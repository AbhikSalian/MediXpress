import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    CircularProgress,
    Box,
    Paper,
    Button,
    Chip
} from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function OrderDetails() {
    const { orderID } = useParams();
    const location = useLocation();
    const order = location.state?.order;
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const statusMap = {
        0: { text: "Pending Acceptance from store", color: "info" },
        1: { text: "Accepted by Store", color: "primary" },
        2: { text: "Packing Item", color: "warning" },
        3: { text: "Packed", color: "secondary" },
        4: { text: "Out for Delivery", color: "warning" },
        5: { text: "Delivered", color: "success" },
        6: { text: "Cancelled", color: "error" }
    };
    // Fetch store details if order exists
    useEffect(() => {
        const fetchStoreDetails = async () => {
            if (!order) return; // no order passed from navigation
            try {
                const storeRes = await axios.get(
                    `https://localhost:8020/api/Store/store/${order.storeID}`
                );
                setStore(storeRes.data);
            } catch (err) {
                console.error("Failed to fetch store details", err);
            }
        };
        fetchStoreDetails();
    }, [order]);

    // Fetch order items
    useEffect(() => {
        const fetchOrderItems = async () => {
            try {
                const orderRes = await axios.get(
                    `https://localhost:7065/api/Order/orderItem/${orderID}`
                );
                const orderItems = orderRes.data;

                const detailedItems = await Promise.all(
                    orderItems.map(async (item) => {
                        try {
                            const invRes = await axios.get(
                                `https://localhost:8040/api/Inventory/inventoryId/${item.productID}`
                            );
                            const prodID = invRes.data;

                            const prodRes = await axios.get(
                                `https://localhost:8030/api/Product/${prodID}`
                            );
                            const productDetails = prodRes.data;

                            return {
                                ...item,
                                productName: productDetails.productName,
                                description: productDetails.description,
                                category: productDetails.category
                            };
                        } catch (innerErr) {
                            console.error("Failed to fetch product details", innerErr);
                            return { ...item, productName: "Unknown", description: "", category: "" };
                        }
                    })
                );

                setItems(detailedItems);
            } catch (err) {
                console.error("Failed to fetch order items", err);
                setError("Failed to fetch order details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderItems();
    }, [orderID]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography variant="h6" color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container
            maxWidth={false}
            disableGutters={false}
            sx={{
                pl: { xs: 2, md: 5 },  // left padding
                pr: { xs: 2, md: 5 },  // right padding
                pt: 3,                 // top padding
                pb: 3,                 // bottom padding if needed
            }}
        >
            <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate(-1)}
                sx={{ mb: 2 }}
            >
                &larr; Back
            </Button>
            <Typography variant="h4" gutterBottom>
                Order Details
            </Typography>
            <Typography variant="h6" gutterBottom>
                Order ID: {orderID}
            </Typography>
            <Typography variant="h8" gutterBottom>
                Order Date : {new Date(order.createdAt).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })}
            </Typography>

            {store && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">
                        Ordered from: <strong>{store.storeName}</strong>
                    </Typography>
                    <Typography variant="body2">
                        Address: {store.address}, Pincode: {store.pincode}
                    </Typography>
                </Box>
            )}
            <Chip
                label={statusMap[order.deliveryStatus]?.text || "Status Not Found"}
                color={statusMap[order.deliveryStatus]?.color || "default"}
                sx={{ fontWeight: 600, mr: 2 }}
            />
            {items.length === 0 ? (
                <Typography>No items found for this order.</Typography>
            ) : (
                <Paper elevation={3} sx={{ borderRadius: 2, mt: 3 }}>
                    <List>
                        {items.map((item, index) => (
                            <React.Fragment key={item.orderItemID}>
                                <ListItem>
                                    <ListItemText
                                        primary={`${item.productName} (x${item.quantity})`}
                                        secondary={
                                            <>
                                                <Typography variant="body2" component="span">
                                                    Category: {item.category || "N/A"}
                                                </Typography>
                                                <br />
                                                <Typography variant="body2" component="span">
                                                    Price per unit: ₹{item.unitPrice}
                                                </Typography>
                                                <br />
                                                <Typography variant="body2" component="span">
                                                    Description: {item.description || "No description"}
                                                </Typography>
                                            </>
                                        }
                                    />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        ₹{item.quantity * item.unitPrice}
                                    </Typography>
                                </ListItem>
                                {index < items.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>

            )}
            <Typography variant="h6" sx={{ fontWeight: 600, pt: 3 }}>
                Order Total:  ₹{order.totalAmount}
            </Typography>
        </Container>
    );
}

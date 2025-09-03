import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Box,
  Button,
  IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [stores, setStores] = useState({}); // storeID -> store object map

  const statusMap = {
    0: { text: "Pending Acceptance from store", color: "info" },
    1: { text: "Accepted by Store", color: "primary" },
    2: { text: "Packing Item", color: "warning" },
    3: { text: "Packed", color: "secondary" },
    4: { text: "Out for Delivery", color: "warning" },
    5: { text: "Delivered", color: "success" },
    6: { text: "Cancelled", color: "error" }
  };

  useEffect(() => {
    if (!user) return;

    const fetchOrdersAndStores = async () => {
      try {
        // Fetch orders
        const orderRes = await axios.get(
          `https://localhost:7065/api/Order/customer/${user.customerID}`
        );
        const orderList = orderRes.data;
        setOrders(orderList);

        // Get unique store IDs
        const uniqueStoreIds = [...new Set(orderList.map(o => o.storeID))];

        // Fetch store details in parallel
        const storeResponses = await Promise.all(
          uniqueStoreIds.map(async (id) => {
            try {
              const res = await axios.get(`https://localhost:8020/api/Store/store/${id}`);
              return { id, data: res.data };
            } catch (err) {
              console.error(`Failed to fetch store ${id}`, err);
              return { id, data: null };
            }
          })
        );

        // Convert to {storeID: storeData} map
        const storeMap = {};
        storeResponses.forEach(({ id, data }) => {
          if (data) storeMap[id] = data;
        });
        setStores(storeMap);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };

    fetchOrdersAndStores();
  }, [user]);

  const handleViewOrder = (order) => {
    navigate(`/orders/${order.orderID}`, { state: { order } });
  };

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
      <Typography variant="h4" gutterBottom>Your Orders</Typography>

      {orders.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            mt: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <img
            src="https://static.vecteezy.com/system/resources/previews/047/639/622/original/no-orders-icon-for-web-app-infographic-etc-vector.jpg"
            alt="No Orders"
            style={{ maxWidth: 300, marginBottom: 20 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            You haven’t placed any orders yet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3, fontWeight: 600 }}
            href="/pharmacies"
          >
            Order Medicines Now
          </Button>
        </Box>
      ) : (
        <List>
          {orders.map((order, index) => {
            const store = stores[order.storeID];
            return (
              <React.Fragment key={order.orderID}>
                <ListItem
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <ListItemText
                    primary={`Order #${order.orderID}`}
                    secondary={
                      store ? (
                        <>
                          {`Store: ${store.storeName}, ${store.address}`}<br />
                          {`Order Date: ${new Date(order.createdAt).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}`}<br />
                          <Typography component="span" fontWeight="bold">
                            Total Amount: ₹{order.totalAmount}
                          </Typography>
                        </>
                      ) : (
                        <>
                          {`Store ID: ${order.storeID}`}<br />
                          {`Order Date: ${new Date(order.createdAt).toLocaleString()}`}<br />
                          <Typography component="span" fontWeight="bold">
                            Total Amount: ₹{order.totalAmount}
                          </Typography>
                        </>
                      )
                    }
                  />


                  <Chip
                    label={statusMap[order.deliveryStatus]?.text || "Status Not Found"}
                    color={statusMap[order.deliveryStatus]?.color || "default"}
                    sx={{ fontWeight: 600, mr: 2 }}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => handleViewOrder(order)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </ListItem>
                {index < orders.length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
        </List>
      )}
    </Container>
  );
}

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Divider,
  Paper,
  Alert,
  Snackbar,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  ShoppingCart,
  Person,
  LocationOn,
  Phone,
  Payment,
  LocalShipping,
  CheckCircle,
  ArrowBack,
} from "@mui/icons-material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { orderService } from "../../services/orderService";
import {
  formatCurrency,
  formatDateTime,
  getOrderStatusColor,
  getPaymentStatusColor,
} from "../../utils/helpers";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
const [customer, setCustomer] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    const loadOrder = async () => {
      if (location.state?.order) {
        setOrder(location.state.order);
        setLoading(false);
        fetchCustomer(location.state.order.customerId);
        fetchOrderItems(location.state.order.id);
      } else {
        try {
          const data = await orderService.getOrder(id);
          setOrder(data);
           fetchCustomer(data.customerId);
          fetchOrderItems(data.id);
        } catch (error) {
          setSnackbar({
            open: true,
            message: "Failed to load order details",
            severity: "error",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchOrderItems = async (orderId) => {
      try {
        const res = await fetch(`https://localhost:7065/api/Order/orderItem/${orderId}`);
        if (!res.ok) throw new Error("Failed to fetch order items");
        const items = await res.json();

        // Fetch product names for each item
        const enrichedItems = await Promise.all(
          items.map(async (item) => {
            try {
              const invRes = await fetch(`https://localhost:8040/api/Inventory/inventoryId/${item.productID}`);
              const prodID = await invRes.json();

              const prodRes = await fetch(`https://localhost:8030/api/Product/${prodID}`);
              const product = await prodRes.json();

              return {
                ...item,
                name: product.productName, // attach productName
              };
            } catch (err) {
              console.error("Error fetching product details", err);
              return { ...item, name: "Unknown Product" };
            }
          })
        );

        setOrderItems(enrichedItems);
      } catch (err) {
        console.error(err);
        setSnackbar({
          open: true,
          message: "Failed to load order items",
          severity: "error",
        });
      }
    };
const fetchCustomer = async (customerId) => {
    try {
      const res = await fetch(`https://localhost:8010/api/Customer/${customerId}`);
      if (!res.ok) throw new Error("Failed to fetch customer details");
      const data = await res.json();
      setCustomer(data);
    } catch (err) {
      console.error("Error fetching customer", err);
      setSnackbar({
        open: true,
        message: "Failed to load customer details",
        severity: "error",
      });
    }
  };
    loadOrder();
  }, [id, location.state]);


  const handleStatusUpdate = async (newStatus) => {
    setActionLoading(true);
    try {
      // This part works correctly and updates the database
      await orderService.updateOrderStatus(id, newStatus);

      setSnackbar({
        open: true,
        message: `Order status updated to ${newStatus}`,
        severity: "success",
      });

      setOrder(prevOrder => ({ ...prevOrder, status: newStatus }));

    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update order status",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusActions = (currentStatus) => {
    const actions = [];

    switch (currentStatus) {
      case "Pending":
        actions.push({
          label: "Accept Order",
          status: "Accepted",
          color: "success",
        });
        actions.push({
          label: "Cancel Order",
          status: "Cancelled",
          color: "error",
        });
        break;
      case "Confirmed":
        actions.push({
          label: "Mark as Packed",
          status: "Packed",
          color: "primary",
        });
        actions.push({
          label: "Cancel Order",
          status: "Cancelled",
          color: "error",
        });
        break;
      case "Accepted":
        actions.push({
          label: "Mark as Packed",
          status: "Packed",
          color: "primary",
        });
        actions.push({
          label: "Cancel Order",
          status: "Cancelled",
          color: "error",
        });
        break;
      case "Packed":
        actions.push({
          label: "Out for Delivery",
          status: "Out for Delivery",
          color: "info",
        });
        break;

      case "Ready":
        actions.push({
          label: "Out for Delivery",
          status: "Out for Delivery",
          color: "info",
        });
        break;
      case "Out for Delivery":
        actions.push({
          label: "Mark as Delivered",
          status: "Delivered",
          color: "success",
        });
        break;
      default:
        break;
    }

    return actions;
  };

  const getTimelineStatus = () => {
    const statuses = [
      "Pending",
      "Accepted",
      "Packed",
      "Out for Delivery",
      "Delivered",
    ];
    const currentIndex = statuses.indexOf(order?.status);

    return statuses.map((status, index) => ({
      label: status,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  if (loading) {
    return <LoadingSpinner message="Loading order details..." />;
  }

  if (!order) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="error">
          Order not found
        </Typography>
        <Button onClick={() => navigate("/orders")} sx={{ mt: 2 }}>
          Back to Orders
        </Button>
      </Box>
    );
  }

  const timeline = getTimelineStatus();
  const actions = getStatusActions(order.status);

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate("/orders")}
          sx={{ textDecoration: "none" }}
        >
          Orders
        </Link>
        <Typography color="text.primary">Order #{order.id}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/orders")}
        >
          Back
        </Button>
        <Box>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <ShoppingCart />
            Order #{order.id}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Placed on {formatDateTime(order.createdAt)}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Order Status Actions */}
        {actions.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Actions
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  {actions.map((action, index) => (
                    <Button
                      key={index}
                      variant="contained"
                      color={action.color}
                      onClick={() => handleStatusUpdate(action.status)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Updating..." : action.label}
                    </Button>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Order Status Timeline */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Status
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Chip
                  label={order.status}
                  color={getOrderStatusColor(order.status)}
                  sx={{ mr: 2 }}
                />
                <Chip
                  label={`Payment: ${order.paymentStatus}`}
                  color={getPaymentStatusColor(order.paymentStatus)}
                  variant="outlined"
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {timeline.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: item.completed
                        ? "primary.main"
                        : "grey.100",
                      color: item.completed
                        ? "primary.contrastText"
                        : "text.secondary",
                      border: item.active ? 2 : 0,
                      borderColor: "primary.main",
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        backgroundColor: item.completed ? "white" : "grey.400",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.completed && (
                        <CheckCircle
                          sx={{ fontSize: 14, color: "primary.main" }}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="body1"
                      fontWeight={item.active ? "bold" : "normal"}
                    >
                      {item.label}
                    </Typography>
                    {item.active && (
                      <Chip
                        label="Current"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Customer Information */}
        <Grid item xs={12} md={4}>
  <Card>
    <CardContent>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Person />
        Customer Information
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Customer ID: {order.customerId} <br />
          Customer Name: {customer ? customer.customerName : "Loading..."}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Phone fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {customer ? customer.phone : "Loading..."}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
          <LocationOn fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {customer
              ? `${customer.address}, Pincode: ${customer.pincode}`
              : "Loading..."}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
</Grid>


        {/* Order Items */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
  {orderItems.map((item, index) => (
    <TableRow key={index}>
      <TableCell>
        <Typography variant="body2" fontWeight="medium">
          {item.name}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography variant="body2">{item.quantity}</Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2">
          {formatCurrency(item.unitPrice)}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2" fontWeight="medium">
          {formatCurrency(item.unitPrice * item.quantity)}
        </Typography>
      </TableCell>
    </TableRow>
  ))}

  <TableRow>
    <TableCell colSpan={3}>
      <Typography variant="subtitle1" fontWeight="bold">
        Total
      </Typography>
    </TableCell>
    <TableCell align="right">
      <Typography variant="subtitle1" fontWeight="bold">
        {formatCurrency(orderItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0))}
      </Typography>
    </TableCell>
  </TableRow>
</TableBody>


                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrderDetails;

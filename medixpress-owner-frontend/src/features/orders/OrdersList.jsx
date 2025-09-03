import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material'
import {
  ShoppingCart,
  Visibility,
  MoreVert,
  Phone,
  LocationOn,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { orderService } from '../../services/orderService'
import { formatCurrency, formatDateTime, getOrderStatusColor, getPaymentStatusColor } from '../../utils/helpers'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'

const OrdersList = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const navigate = useNavigate()

  const statusTabs = ['All', 'Pending', 'Accepted', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled']
  const statusMapping = {
    0: null, // All
    1: 'Pending',
    2: 'Accepted',
    3: 'Packed',
    4: 'Out for Delivery',
    5: 'Delivered',
    6: 'Cancelled'
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const data = await orderService.getOrders()
      setOrders(data)
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load orders',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleMenuClick = (event, order) => {
    setAnchorEl(event.currentTarget)
    setSelectedOrder(order)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedOrder(null)
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
      await orderService.updateOrderStatus(selectedOrder.id, newStatus)
      setSnackbar({
        open: true,
        message: `Order status updated to ${newStatus}`,
        severity: 'success'
      })
      loadOrders()
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update order status',
        severity: 'error'
      })
    } finally {
      handleMenuClose()
    }
  }

  const getFilteredOrders = () => {
    const targetStatus = statusMapping[activeTab]
    if (!targetStatus) return orders
    return orders.filter(order => order.status === targetStatus)
  }

  const getStatusActions = (currentStatus) => {
    const actions = []

    switch (currentStatus) {
      case 'Pending':
        actions.push('Accept', 'Cancel')
        break
      case 'Accepted':
        actions.push('Pack', 'Cancel')
        break
      case 'Packed':
        actions.push('Out for Delivery')
        break
      case 'Out for Delivery':
        actions.push('Deliver')
        break
      default:
        break
    }

    return actions
  }

  const getStatusUpdateText = (action) => {
    const statusMap = {
      'Accept': 'Accepted',
      'Pack': 'Packed',
      'Out for Delivery': 'Out for Delivery',
      'Deliver': 'Delivered',
      'Cancel': 'Cancelled'
    }
    return statusMap[action] || action
  }

  if (loading) {
    return <LoadingSpinner message="Loading orders..." />
  }

  const filteredOrders = getFilteredOrders()

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCart />
          Orders Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage customer orders
        </Typography>
      </Box>

      {/* Status Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {statusTabs.map((status, index) => (
            <Tab key={index} label={status} />
          ))}
        </Tabs>
      </Card>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer ID</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="medium">
                        Order #{order.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {order.customer.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {order.items.length} item(s)
                      </Typography>
                      {order.items.slice(0, 2).map((item, index) => (
                        <Typography key={index} variant="caption" display="block" color="text.secondary">
                          {item.name} x{item.qty}
                        </Typography>
                      ))}
                      {order.items.length > 2 && (
                        <Typography variant="caption" color="text.secondary">
                          +{order.items.length - 2} more...
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="medium">
                        {formatCurrency(order.total)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.paymentStatus}
                        color={getPaymentStatusColor(order.paymentStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getOrderStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDateTime(order.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/orders/${order.id}`, { state: { order: order } })}
                          color="primary"
                        >
                          <Visibility />
                        </IconButton>
                        {getStatusActions(order.status).length > 0 && (
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuClick(e, order)}
                          >
                            <MoreVert />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      ) : (
        <EmptyState
          icon={ShoppingCart}
          title="No orders found"
          description={
            activeTab === 0
              ? "No orders have been placed yet. Orders will appear here once customers start ordering."
              : `No orders with status "${statusTabs[activeTab]}" found.`
          }
        />
      )}

      {/* Status Update Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedOrder && getStatusActions(selectedOrder.status).map((action) => (
          <MenuItem
            key={action}
            onClick={() => handleStatusUpdate(getStatusUpdateText(action))}
          >
            {action} Order
          </MenuItem>
        ))}
      </Menu>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default OrdersList
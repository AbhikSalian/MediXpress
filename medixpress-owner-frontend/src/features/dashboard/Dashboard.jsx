import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Inventory,
  ShoppingCart,
  LocalShipping,
  CheckCircle,
  Add,
  Visibility,
  Warning,
  TrendingUp,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { productService } from '../../services/productService'
import { orderService } from '../../services/orderService'
import { formatCurrency, formatDate, getOrderStatusColor, isLowStock } from '../../utils/helpers'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const Dashboard = () => {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [productsData, ordersData] = await Promise.all([
          productService.getProducts(),
          orderService.getOrders(),
        ])
        setProducts(productsData)
        setOrders(ordersData)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />
  }

  // Calculate KPIs
  const totalProducts = products.length
  const lowStockItems = products.filter(p => isLowStock(p.stock)).length
  const pendingOrders = orders.filter(o => o.status === 'Pending').length
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length

  // Get recent orders (last 5)
  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const kpiCards = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: <Inventory />,
      color: 'primary',
      bgColor: 'primary.main',
    },
    {
      title: 'Low Stock Items',
      value: lowStockItems,
      icon: <Warning />,
      color: 'warning',
      bgColor: 'warning.main',
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: <ShoppingCart />,
      color: 'info',
      bgColor: 'info.main',
    },
    {
      title: 'Delivered Orders',
      value: deliveredOrders,
      icon: <CheckCircle />,
      color: 'success',
      bgColor: 'success.main',
    },
  ]

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DashboardIcon />
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your pharmacy today.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpiCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="h6">
                      {card.title}
                    </Typography>
                    <Typography variant="h4" component="div" color={card.color}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: card.bgColor,
                      color: 'white',
                      borderRadius: '50%',
                      width: 60,
                      height: 60,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0.8,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Orders */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Recent Orders</Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/orders')}
              startIcon={<ShoppingCart />}
            >
              View All Orders
            </Button>
          </Box>

          {recentOrders.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {order.customer.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.customer.phone}
                        </Typography>
                      </TableCell>
                      <TableCell>{order.items.length} item(s)</TableCell>
                      <TableCell>{formatCurrency(order.total)}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color={getOrderStatusColor(order.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/orders/${order.id}`, { state: { order: order } })}
                        >
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="text.secondary" textAlign="center" py={4}>
              No orders yet. Orders will appear here once customers start placing them.
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Inventory sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Manage Inventory
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Add new products, update stock levels, and manage your pharmacy inventory.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/inventory/new')}
                sx={{ mr: 1 }}
              >
                Add Product
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/inventory')}
              >
                View Inventory
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Business Insights
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {lowStockItems > 0 ? (
                  <>You have {lowStockItems} items running low on stock. Consider restocking soon.</>
                ) : (
                  "All your products are well-stocked. Keep up the good work!"
                )}
              </Typography>
              <Button
                variant="contained"
                color="success"
                onClick={() => navigate('/inventory')}
              >
                Check Inventory
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
import React from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
} from '@mui/material'
import {
  LocalPharmacy,
  Inventory,
  ShoppingCart,
  Analytics,
  Phone,
  Security,
  Speed,
  Support,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import PublicHeader from '../../components/Layout/PublicHeader'
import PublicFooter from '../../components/Layout/PublicFooter'

const Home = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Inventory color="primary" sx={{ fontSize: 40 }} />,
      title: 'Smart Inventory Management',
      description: 'Track stock levels, expiry dates, and get automated alerts for low stock items.'
    },
    {
      icon: <ShoppingCart color="primary" sx={{ fontSize: 40 }} />,
      title: 'Order Management',
      description: 'Process customer orders efficiently with real-time status tracking and updates.'
    },
    {
      icon: <Analytics color="primary" sx={{ fontSize: 40 }} />,
      title: 'Business Analytics',
      description: 'Get insights into your pharmacy performance with detailed reports and metrics.'
    },
    {
      icon: <Phone color="primary" sx={{ fontSize: 40 }} />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to help you manage your pharmacy business.'
    },
    {
      icon: <Security color="primary" sx={{ fontSize: 40 }} />,
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security and regular backups.'
    },
    {
      icon: <Speed color="primary" sx={{ fontSize: 40 }} />,
      title: 'Fast & Efficient',
      description: 'Streamlined processes that save time and improve your pharmacy operations.'
    }
  ]

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicHeader />
      
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                Welcome to MediXpress
              </Typography>
              <Typography variant="h5" component="p" gutterBottom sx={{ opacity: 0.9 }}>
                The Complete Pharmacy Management Solution
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, opacity: 0.8, fontSize: '1.1rem' }}>
                Streamline your pharmacy operations with our comprehensive platform. 
                Manage inventory, process orders, track sales, and grow your business 
                with powerful analytics and automation tools.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: 'grey.100',
                    }
                  }}
                  onClick={() => navigate('/register')}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderColor: 'white',
                    }
                  }}
                  onClick={() => navigate('/login')}
                >
                  Login to Dashboard
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 300,
                }}
              >
                <LocalPharmacy sx={{ fontSize: 200, opacity: 0.3 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom fontWeight="bold">
          Why Choose MediXpress?
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Everything you need to run a successful pharmacy business
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Paper
        elevation={0}
        sx={{
          backgroundColor: 'grey.50',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
            Ready to Transform Your Pharmacy?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Join thousands of pharmacy owners who trust MediXpress to manage their business
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<LocalPharmacy />}
              sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
              onClick={() => navigate('/register')}
            >
              Start Your Journey
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
              onClick={() => navigate('/login')}
            >
              Already Have an Account?
            </Button>
          </Box>
        </Container>
      </Paper>

      <PublicFooter />
    </Box>
  )
}

export default Home
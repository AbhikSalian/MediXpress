import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material'
import logoImage from '../../assets/logo.PNG'
import { useNavigate, useLocation } from 'react-router-dom'

const PublicHeader = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogoClick = () => {
    navigate('/')
  }
  const handleCustomerPortal = () => {
    window.open('http://localhost:5173/', '_blank')
  }

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar sx={{ 
        justifyContent: 'space-between', 
        px: 3,
        minHeight: 64 
      }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={handleLogoClick}
        >
          <Box
            component="img"
            src={logoImage}
            alt="Logo"
            sx={{ width: 40, height: 40, mr: 1 }}
          />

          <Typography variant="h5" component="div" fontWeight="bold">
            MediXpress
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            onClick={() => navigate('/login')}
            variant={location.pathname === '/login' ? 'outlined' : 'text'}
            sx={{ 
              borderColor: 'white',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Login
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/register')}
            variant={location.pathname === '/register' ? 'outlined' : 'text'}
            sx={{ 
              borderColor: 'white',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Register
          </Button>
                    <Button
            color="inherit"
            onClick={handleCustomerPortal}
            variant="text"
            sx={{ 
              borderColor: 'white',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Customer Portal
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default PublicHeader

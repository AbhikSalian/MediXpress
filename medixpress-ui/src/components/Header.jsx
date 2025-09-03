import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import logo from "../assets/mediXpress-logo.png";
import { useAuth } from '../context/AuthContext';
import UserMenu from '../components/UserMenu';
import Badge from '@mui/material/Badge';
import { useCart } from '../context/CartContext';

function Header() {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={0}>
      <Container maxWidth={false} disableGutters sx={{ px: 3 }}>
        <Toolbar disableGutters sx={{ py: 1, px: 2, justifyContent: 'space-between' }}>
          {/* Left: Menu + Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {user && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box
              component={Link}
              to="/"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}
            >
              <img src={logo} alt="MediXpress Logo" style={{ height: 60 }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  textDecoration: 'none',
                  '& span': { color: 'secondary.main' },
                  '&:hover': {
                    color: 'primary.dark',
                    '& span': { color: 'primary.dark' },
                  },
                }}
              >
                Medi<span>Xpress</span>
              </Typography>

            </Box>
          </Box>

          {/* Right: Buttons */}
          <Box>
            {!user ? (
              <>
                <Button
                  onClick={() => (window.location.href = "http://localhost:3000/")}
                  variant="contained"
                  color="secondary"
                  sx={{ fontWeight: 600, mr: 2 }}
                >
                  Owner Portal
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  color="primary"
                  sx={{ fontWeight: 600, mr: 2 }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  color="primary"
                  sx={{ fontWeight: 600 }}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <IconButton component={Link} to="/cart" color="inherit">
                <Badge
                  badgeContent={cartItems.reduce((total, item) => total + item.quantity, 0)}
                  color="secondary"
                  overlap="circular"
                  invisible={cartItems.reduce((total, item) => total + item.quantity, 0) === 0}
                >
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* UserMenu */}
      {user && (
        <UserMenu
          anchorEl={anchorEl}
          onClose={handleMenuClose}
          onLogout={handleLogout}
        />
      )}
    </AppBar>
  );
}

export default Header;

// pages/Checkout.jsx
import React, { useContext } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    // For now, simulate order placement
    console.log("Order placed:", cartItems);
    clearCart();
    navigate('/order-success');
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>
      <Typography>Review your order and confirm</Typography>
      <Button 
        variant="contained" 
        color="success" 
        sx={{ mt: 3 }}
        onClick={handlePlaceOrder}
      >
        Place Order
      </Button>
    </Container>
  );
}

export default Checkout;

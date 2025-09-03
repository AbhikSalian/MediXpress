// pages/OrderSuccess.jsx
import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth={false}
      disableGutters={false}
      sx={{
        pl: { xs: 2, md: 5 },  // left padding
        pr: { xs: 2, md: 5 },  // right padding
        pt: 3,                 // top padding
        pb: 3,                 // bottom padding if needed
        textAlign:'center'
      }} 
    >
      <Typography variant="h4" gutterBottom>Order Successful!</Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Thank you for your purchase. Your medicines will be delivered shortly.
      </Typography>
      <Button 
        variant="contained" 
        color="primary"
        onClick={() => navigate('/')}
      >
        Back to Home
      </Button>
    </Container>
  );
}

export default OrderSuccess;

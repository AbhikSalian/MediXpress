import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function HeroGuest() {
  return (
    <Box
      sx={{
        position: 'relative',
        py: 12,
        textAlign: 'center',
        color: 'white',
        overflow: 'hidden',
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url("https://img.pikbest.com/ai/illus_our/20230426/85fd6cbcf65cabdeaf6f2b31e352fb33.jpg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.25,
          zIndex: 1,
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'green' }}>
          Welcome to MediXpress
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, color: 'black' }}>
          Order medicines effortlessly. Find nearby pharmacies instantly.  
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/signup"
          sx={{ textTransform: 'none', fontSize: '1rem', px: 4, py: 1.2 }}
        >
          Get Started
        </Button>
      </Container>
    </Box>
  );
}

export default HeroGuest;

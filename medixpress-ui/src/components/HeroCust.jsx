import React from 'react';
import { Box, Container, Typography, TextField, Button, Stack } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function HeroCust({ pincode, setPincode, onFindPharmacies }) {
  const { user } = useAuth();
  
  const storedUser = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user'))
    : null;

  const displayUser = storedUser || user || { customerName: 'Guest', pincode: '' };

  return (
    <Box
      sx={{
        position: 'relative',
        py: 10,
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
          opacity: 0.2,
          zIndex: 1,
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Clean Bold Greeting */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            mb: 2,
            color: '#1a1a1a',
            textShadow: '0px 4px 8px rgba(0,0,0,0.15)',
          }}
        >
          Hello, {displayUser.customerName || 'Guest'}!
        </Typography>

        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'green' }}>
          Find Pharmacies Near You
        </Typography>

        <Typography variant="h6" sx={{ mb: 3, color: 'black' }}>
          Enter your pincode to locate nearby pharmacies instantly.
        </Typography>

        <Stack spacing={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter pincode..."
            value={pincode || displayUser.pincode || ''}
            onChange={(e) => setPincode(e.target.value)}
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />

          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            sx={{ fontWeight: 'bold', fontSize: '1rem' }}
            onClick={() => onFindPharmacies(pincode || displayUser.pincode)}
            disabled={!(pincode || displayUser.pincode)}
          >
            Find Pharmacies
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

export default HeroCust;

import React from 'react';
import { Card, CardContent, Typography, Button, CardActions, Divider, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

export default function PharmacyCard({ pharmacy }) {
  const navigate = useNavigate();

  const handleViewMedicines = () => {
    navigate(`/inventory/${pharmacy.id}`); // send store ID in URL
  };

  return (
    <Card 
      sx={{ 
        borderRadius: 3, 
        boxShadow: 4, 
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': { transform: 'translateY(-5px)', boxShadow: 8 }
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <LocalPharmacyIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            {pharmacy.name}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {pharmacy.address}, Pincode: {pharmacy.pincode}
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        <Box display="flex" alignItems="center" mb={0.5}>
          <PhoneIcon fontSize="small" color="action" sx={{ mr: 1 }} />
          <Typography variant="body2">{pharmacy.phone}</Typography>
        </Box>

        {pharmacy.email && (
          <Box display="flex" alignItems="center">
            <EmailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
            <Typography variant="body2">{pharmacy.email}</Typography>
          </Box>
        )}
      </CardContent>

      <CardActions>
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth
          sx={{ borderRadius: 2 }}
          onClick={handleViewMedicines}
        >
          View Medicines
        </Button>
      </CardActions>
    </Card>
  );
}

// pages/Medicines.jsx
import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, TextField, Grid, Card, CardContent, Button } from '@mui/material';
import Slider from 'react-slick';
import axios from '../api/axios';
import { CartContext } from '../context/CartContext';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Medicines() {
  const { addToCart } = useContext(CartContext);
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('/medicines')
      .then(response => setMedicines(response.data))
      .catch(error => console.error('Error fetching medicines:', error));
  }, []);

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Container sx={{ mt: 4 }}>
      {/* Carousel Hero Section */}
      <Slider {...carouselSettings} style={{ marginBottom: '2rem', borderRadius: '10px', overflow: 'hidden' }}>
        <div>
          <img src="https://wallpaperaccess.com/full/136954.jpg" alt="Banner 1" style={{ width: '100%' }} />
        </div>
        <div>
          <img src="https://medlineplus.gov/images/Medicines_share.jpg" alt="Banner 2" style={{ width: '100%' }} />
        </div>
        <div>
          <img src="https://wallpaperaccess.com/full/137042.jpg" alt="Banner 3" style={{ width: '100%' }} />
        </div>
      </Slider>

      <Typography variant="h4" gutterBottom>Search Medicines</Typography>
      <TextField
        fullWidth
        label="Search by name"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={2}>
        {filteredMedicines.map((med) => (
          <Grid item xs={12} sm={6} md={4} key={med.id}>
            <Card sx={{ borderRadius: '12px', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'green' }}>{med.name}</Typography>
                <Typography variant="body2">Price: ₹{med.price}</Typography>
                <Typography variant="body2">Available at: {med.pharmacyName}</Typography>
                <Button 
                  variant="contained" 
                  color="success" 
                  sx={{ mt: 1 }}
                  onClick={() => addToCart(med)}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Medicines;

import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, TextField, Button } from '@mui/material';
import PharmacyCard from '../components/PharmacyCard';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function Pharmacies() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pincodeFromQuery = queryParams.get('pincode');

  const user = JSON.parse(sessionStorage.getItem('user') || 'null');
  const defaultPincode = pincodeFromQuery || (user ? user.pincode : '');

  const [pincode, setPincode] = useState(defaultPincode);
  const [searchPin, setSearchPin] = useState(defaultPincode);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState('');

  const fetchPharmacies = (pin) => {
    if (!pin) return;
    setLoading(true);
    axios.get(`https://localhost:8020/api/Store/ByPincode/${pin}`)
      .then(res => setPharmacies(res.data))
      .catch(err => {
        console.error(err);
        setPharmacies([]);
      })
      .finally(() => setLoading(false));
  };

  const fetchAllPharmacies = () => {
  setLoading(true);
  axios.get('https://localhost:8020/api/Store/All')
    .then(res => {
      setPharmacies(res.data);
      setPincode(''); // reset pincode to indicate viewing all
      setSearchPin('');
    })
    .catch(err => {
      console.error(err);
      setPharmacies([]);
    })
    .finally(() => setLoading(false));
};


  useEffect(() => {
    if (defaultPincode) {
      fetchPharmacies(defaultPincode);
    }
  }, [defaultPincode]);

  const handleSearchPin = (e) => {
    e.preventDefault();
    setPincode(searchPin);
    fetchPharmacies(searchPin);
  };

  // Filter pharmacies by name
  const filteredPharmacies = pharmacies.filter(store =>
    store.storeName.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <Container
      maxWidth={false}
      disableGutters={false}
      sx={{
        pl: { xs: 2, md: 5 },  // left padding
        pr: { xs: 2, md: 5 },  // right padding
        pt: 3,                 // top padding
        pb: 3,                 // bottom padding if needed
      }}
    >
      {/* Pincode search */}
<Box component="form" onSubmit={handleSearchPin} display="flex" gap={2} mb={3}>
  <TextField
    variant="outlined"
    placeholder="Enter pincode..."
    value={searchPin}
    onChange={e => setSearchPin(e.target.value)}
  />
  <Button type="submit" variant="contained" color="primary">Search</Button>
  <Button variant="contained" color="secondary" onClick={fetchAllPharmacies}>
    View All
  </Button>
</Box>

{/* Name filter - only if pharmacies are displayed */}
{pharmacies.length > 0 && (
  <TextField
    label="Search pharmacies by name"
    variant="outlined"
    size="small"
    value={searchName}
    onChange={e => setSearchName(e.target.value)}
    sx={{ mb: 3, width: '100%' }}
  />
)}

  <Typography variant="h4" gutterBottom>
    {pincode
      ? `Pharmacies in ${pincode}`
      : 'Viewing All Pharmacies'}
  </Typography>

      {loading ? (
        <Typography>Loading pharmacies...</Typography>
      ) : filteredPharmacies.length > 0 ? (
        <Grid container spacing={2}>
          {filteredPharmacies.map(store => (
            <Grid item xs={12} sm={6} md={4} key={store.storeID}>
              <PharmacyCard pharmacy={{
                id: store.storeID,
                name: store.storeName,
                phone: store.phone,
                address: store.address,
                email: store.email,
                pincode: store.pincode
              }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" sx={{ mt: 6 }}>
          <img 
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" 
            alt="No pharmacies" 
            style={{ width: 200, opacity: 0.7, marginBottom: '1rem' }} 
          />
          <Typography variant="h6" sx={{ mb: 2 }}>
            No pharmacies available at pincode {pincode || '(not provided)'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Search for a different pincode or click on View All
          </Typography>
          
          
        </Box>
      )}
    </Container>
  );
}

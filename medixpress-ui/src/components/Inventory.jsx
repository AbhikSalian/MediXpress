import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Box, TextField, Divider, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MedicineItem from '../components/MedicineItem';
import { CartContext } from '../context/CartContext';

export default function Inventory() {
  const { storeId } = useParams();
  const navigate = useNavigate(); // <-- useNavigate hook
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState({});
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
  const fetchInventoryAndStore = async () => {
    try {
      // Fetch all stores first
      const storesRes = await axios.get('https://localhost:8020/api/Store/All');
      const matchedStore = storesRes.data.find(s => s.storeID.toString() === storeId.toString());
      setStore(matchedStore);

      if (!matchedStore) return; // store truly not found
      // Try fetching inventory
      let inventoryRes;
      try {
        inventoryRes = await axios.get(`https://localhost:8040/api/Inventory/store/${storeId}`);
        setInventory(inventoryRes.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // Inventory not found, treat as empty
          setInventory([]);
        } else {
          console.error(err);
        }
      }

      // Fetch product details if inventory exists
      if (inventoryRes && inventoryRes.data.length > 0) {
        const productPromises = inventoryRes.data.map(item =>
          axios.get(`https://localhost:8030/api/Product/${item.productID}`)
        );
        const productResults = await Promise.all(productPromises);
        const productsMap = {};
        productResults.forEach(res => {
          const product = res.data;
          const inventoryItem = inventoryRes.data.find(i => i.productID === product.productID);
          productsMap[product.productID] = {
            ...product,
            unitPrice: inventoryItem.unitPrice,
            discountRate: inventoryItem.discountRate,
            quantityInStock: inventoryItem.quantityInStock,
            inventoryID: inventoryItem.inventoryID
          };
        });
        setProducts(productsMap);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  fetchInventoryAndStore();
}, [storeId]);
  const filteredMedicines = Object.values(products).filter(p =>
    p.productName.toLowerCase().includes(search.toLowerCase())
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
    {/* Back Button always visible */}
    <Button
      variant="outlined"
      color="primary"
      onClick={() => navigate(-1)}
      sx={{ mb: 2 }}
    >
      &larr; Back
    </Button>

    {loading ? (
      <Typography>Loading...</Typography>
    ) : !store ? (
      // Store truly not found
      <Typography>Store not found.</Typography>
    ) : inventory.length === 0 ? (
      // Store exists but inventory empty
      <Box textAlign="center" sx={{ mt: 4 }}>
        <img 
          src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" 
          alt="Coming soon" 
          style={{ width: 200, opacity: 0.7, marginBottom: '1rem' }} 
        />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Medicines from this store coming soon...
        </Typography>
      </Box>
    ) : (
      // Inventory exists
      <>
        <Typography variant="h4" gutterBottom>
          Medicines available at {store.storeName}
        </Typography>
        <Box display="flex" alignItems="center" mb={3}>
          <LocationOnIcon color="action" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {store.address}, Pincode: {store.pincode}
          </Typography>
        </Box>

        {/* Search Bar */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search medicines..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mb: 3 }}
        />

        {/* Medicine List */}
        <Divider sx={{ mb: 2 }} />
        {filteredMedicines.length === 0 ? (
          <Typography>No medicines found for "{search}"</Typography>
        ) : (
          filteredMedicines.map(med => (
            <React.Fragment key={med.inventoryID}>
              <MedicineItem medicine={med} storeID={storeId} onAddToCart={addToCart} />
              <Divider />
            </React.Fragment>
          ))
        )}
      </>
    )}
  </Container>
);
}
import React, { useContext } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { CartContext } from '../context/CartContext';

export default function MedicineItem({ medicine, storeID }) {
  const { cartItems, addToCart, updateCartItem, removeFromCart } = useContext(CartContext);
  const outOfStock = medicine.quantityInStock === 0;

  const cartEntry = cartItems.find(item => item.inventoryID === medicine.inventoryID);

  const increment = () => {
    if (cartEntry.quantity < medicine.quantityInStock) {
      updateCartItem(medicine.inventoryID, cartEntry.quantity + 1);
    }
  };

  const decrement = () => {
    if (cartEntry.quantity > 1) {
      updateCartItem(medicine.inventoryID, cartEntry.quantity - 1);
    } else {
      removeFromCart(medicine.inventoryID);
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" py={2} px={1}>
      <Box>
        <Typography variant="h6">{medicine.productName}</Typography>
        <Typography variant="body2" color="text.secondary">
          Category: {medicine.category}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {medicine.description}
        </Typography>
        <Box display="flex" alignItems="center" gap={1} mt={0.5}>
          <Typography
            variant="h6"
            fontWeight={700}
            color={outOfStock ? 'text.disabled' : 'primary.main'}
          >
            ₹{medicine.unitPrice}
          </Typography>
          {/* {medicine.discountRate > 0 && !outOfStock && (
            <Typography 
              variant="body2" 
              fontWeight={600} 
              color="success.main" 
              sx={{ ml: 1 }}
            >
              {medicine.discountRate}% OFF
            </Typography>
          )} */}
          <Typography
            variant="body2"
            color={outOfStock ? 'text.disabled' : 'text.secondary'}
            sx={{ ml: 2 }}
          >
            Stock: {medicine.quantityInStock}
          </Typography>
        </Box>
      </Box>

      {cartEntry ? (
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={decrement}>
            <Remove />
          </IconButton>
          <Typography>{cartEntry.quantity}</Typography>
          <IconButton
            onClick={increment}
            disabled={cartEntry.quantity >= medicine.quantityInStock}
          >
            <Add />
          </IconButton>
        </Box>
      ) : (
        <Button
          variant="contained"
          onClick={() => addToCart(medicine, storeID)}
          disabled={outOfStock}
        >
          Add to Cart
        </Button>
      )}
    </Box>
  );
}

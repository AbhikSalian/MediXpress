import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Container, Typography, Button, Box, IconButton, Divider } from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Cart() {
  const { cartItems, productDetails, removeFromCart, updateCartItem, setProductDetails, clearCart } = useCart();
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const { user } = useAuth();
  const [store, setStore] = useState(null);
  const [stockMap, setStockMap] = useState({});
  console.log("user obtained from session storage in cart : ", user.customerID);
  // Fallback fetch for any missing product details
  useEffect(() => {
    console.log("Cart items length :", cartItems.length);
    console.log("cartItems: ", cartItems);
    async function fetchStoreDetails() {
      const storeID = localStorage.getItem('cartStoreID');
      if (!storeID) return;

      try {
        const res = await fetch(`https://localhost:8020/api/Store/store/${storeID}`);
        if (!res.ok) throw new Error("Failed to fetch store details");
        const data = await res.json();
        setStore(data);
      } catch (err) {
        console.error("Error fetching store info:", err);
      }
    }
    async function fetchMissingDetails() {
      // const missing = cartItems.filter(item => !productDetails[item.productID]);
      // console.log("Missing: ", missing);
      // if (missing.length === 0) return;

      const detailsMap = {};
      const promises = cartItems.map(async (item) => {
        try {
          const invRes = await fetch(`https://localhost:8040/api/Inventory/inventoryId/${item.inventoryID}`);
          if (!invRes.ok) throw new Error("Inventory fetch failed");
          const productId = await invRes.json();
          console.log("Product ID fetched :", productId);

          const prodRes = await fetch(`https://localhost:8030/api/Product/${productId}`);
          if (!prodRes.ok) throw new Error("Product fetch failed");
          const productData = await prodRes.json();
          console.log("Product data :", productData);
          detailsMap[item.inventoryID] = {
            productName: productData.productName,
            category: productData.category,
            description: productData.description,
          };
          console.log("Details map :", detailsMap);
        } catch (err) {
          console.error(`Failed to fetch details for productID ${item.productID}:`, err);
        }
      });

      await Promise.all(promises);

      // merge with existing details (update context)
      setProductDetails(prev => {
        const updated = { ...prev, ...detailsMap };
        console.log("Updated : ", updated);
        sessionStorage.setItem("productDetails", JSON.stringify(updated));
        return updated;
      });
    }
    const fetchStock = async () => {
      try {
        const stockData = await Promise.all(
          cartItems.map(async (item) => {
            const res = await fetch(`https://localhost:8040/api/Inventory/inventory/${item.inventoryID}`);
            if (!res.ok) throw new Error(`Failed to fetch stock for ${item.inventoryID}`);
            const data = await res.json();
            return { inventoryID: item.inventoryID, quantityInStock: data.quantityInStock };
          })
        );

        // Convert to a map { inventoryID: quantityInStock }
        const stockMapObj = {};
        stockData.forEach(({ inventoryID, quantityInStock }) => {
          stockMapObj[inventoryID] = quantityInStock;
        });

        setStockMap(stockMapObj);
      } catch (err) {
        console.error("Failed to fetch stock:", err);
      }
    };

    if (cartItems.length > 0) {
      fetchMissingDetails();
      fetchStoreDetails();
      fetchStock();
    }
    

  }, [cartItems, setProductDetails]);

  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );


  // async function handlePlaceOrder() {
  //   try {
  //     const orderBody = {
  //       customerID: user.customerID,
  //       storeID: localStorage.getItem('cartStoreID'),
  //       deliveryStatus: 0,
  //       totalAmount: cartTotal,
  //       items: cartItems.map(item => ({
  //         productID: item.inventoryID,
  //         quantity: item.quantity,
  //         unitPrice: item.unitPrice
  //       }))
  //     };

  //     const res = await fetch("https://localhost:7065/api/Order/place", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(orderBody)
  //     });

  //     if (!res.ok) {
  //       throw new Error(`Order placement failed with status ${res.status}`);
  //     }

  //     // --- Clear cart using CartContext ---
  //     await clearCart();

  //     // --- Navigate to success page ---
  //     navigate('/order-success');

  //   } catch (err) {
  //     console.error("Failed to place order:", err);
  //     alert("Failed to place order. Please try again.");
  //   }
  // }

  async function handlePlaceOrder() {
    try {
      const res = await fetch(
        `https://localhost:7063/api/OrderPlacement/${user.customerID}/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        }
      );

      if (!res.ok) {
        throw new Error(`Order placement failed with status ${res.status}`);
      }
      await clearCart();
      // No need to manually clear the cart — backend does it

      // Navigate to success page
      navigate('/order-success');

    } catch (err) {
      console.error("Failed to place order:", err);
      alert("Failed to place order. Please try again.");
    }
  }

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
      <Button
        variant="outlined"
        color="primary"
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        &larr; Back
      </Button>
      <Typography variant="h4" gutterBottom>Your Cart</Typography>
      <Typography variant="h6" gutterBottom>
        {store
          ? `Showing items from ${store.storeName}, ${store.address} - ${store.pincode}`
          : "Showing items from selected store"}
      </Typography>

      {cartItems.length === 0 ? (
        <Box textAlign="center" sx={{ mt: 6 }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
            alt="Empty cart"
            style={{ width: 250, opacity: 0.8, marginBottom: '1rem' }}
          />
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            Your cart is empty!
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
            Add some items to get started.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3, fontWeight: 600 }}
            onClick={() => navigate('/pharmacies')}
          >
            Browse Pharmacies
          </Button>
        </Box>
      ) : (
        <>
          <Box>
            {cartItems.map((ctitem) => {
              console.log("Item in cart itemsssss (ctitem): ", ctitem);
              const details = productDetails[ctitem.inventoryID] || {};
              console.log("Productssss details: ", productDetails);

              console.log("Product details: ", details);
              return (
                <Box
                  key={ctitem.cartItemID}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  py={2}
                >
                  {/* Product details */}
                  <Box sx={{ maxWidth: '60%' }}>
                    <Typography variant="h6" fontWeight={600}>
                      {details.productName || ctitem.inventoryID}
                    </Typography>
                    {details.category && (
                      <Typography variant="body2" color="text.secondary">
                        Category: {details.category}
                      </Typography>
                    )}
                    {details.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        {details.description}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      ₹{ctitem.unitPrice} × {ctitem.quantity} = ₹{ctitem.unitPrice * ctitem.quantity}
                    </Typography>
                  </Box>

                  {/* Quantity controls and remove */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton
                      size="small"
                      onClick={() => updateCartItem(ctitem.inventoryID, ctitem.quantity - 1)}
                      disabled={ctitem.quantity <= 1}
                    >
                      <Remove />
                    </IconButton>

                    <Typography variant="body1" sx={{ minWidth: 20, textAlign: 'center' }}>
                      {ctitem.quantity}
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={() => updateCartItem(ctitem.inventoryID, ctitem.quantity + 1)}
                      disabled={stockMap[ctitem.inventoryID] !== undefined && ctitem.quantity >= stockMap[ctitem.inventoryID]}
                    >
                      <Add />
                    </IconButton>

                    <IconButton color="error" onClick={() => removeFromCart(ctitem.inventoryID)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Cart total */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6" fontWeight={700}>₹{cartTotal}</Typography>
          </Box>

          <Button
            variant="contained"
            color="success"
            onClick={() => {
              setOpenConfirm(true);
            }}
          >
            Place Order
          </Button>

          <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
            <DialogTitle>Confirm Order</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to place this order?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenConfirm(false)}>No</Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  setOpenConfirm(false);
                  handlePlaceOrder();

                  navigate('/order-success');  // Redirect to success page
                }}
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>

        </>
      )}
    </Container>
  );
}

export default Cart;

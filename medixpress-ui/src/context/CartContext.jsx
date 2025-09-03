// src/context/CartContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();   // fetch customerID from logged-in user
  const [cartItems, setCartItems] = useState([]);
  const [storeID, setStoreID] = useState(() => localStorage.getItem("storeID") || null);
  const [productDetails, setProductDetails] = useState(() => {
    const stored = sessionStorage.getItem('productDetails');
    return stored ? JSON.parse(stored) : {};
  });

  // Fetch cart from backend when user logs in
  useEffect(() => {
    if (!user) return;

    axios.get(`https://localhost:7063/api/Cart/${user.customerID}`)
      .then(res => setCartItems(res.data))
      .catch(err => console.error('Failed to fetch cart', err));
    console.log("Cart items as soon as cart context is loaded : ", cartItems);
  }, [user]);

  // Fetch product details whenever cartItems changes
  useEffect(() => {
    async function fetchDetails() {
      const updatedDetails = { ...productDetails };
      let hasNewData = false;
      console.log("CartItems in useEffect of Cart Context: ", cartItems);
      for (const cartitem of cartItems) {
        console.log("Item in cart context: ", cartitem)
        if (!updatedDetails[cartitem.inventoryID]) {
          try {
            console.log("cartitem.inventoryID :", cartitem.inventoryID);
            // 1. Get actual productID from inventoryID
            const invRes = await axios.get(
              `https://localhost:8040/api/Inventory/inventoryId/${cartitem.inventoryID}`
            );
            const productId = invRes.data;
            console.log("invRes.productID: ", productId);

            // 2. Get product details
            const productRes = await axios.get(
              `https://localhost:8030/api/Product/${productId}`
            );

            updatedDetails[cartitem.inventoryID] = {
              productName: productRes.data.productName,
              category: productRes.data.category,
              description: productRes.data.description,
            };

            hasNewData = true;
          } catch (err) {
            console.error('Error fetching product details', err);
          }
        }
      }

      if (hasNewData) {
        setProductDetails(updatedDetails);
        sessionStorage.setItem('productDetails', JSON.stringify(updatedDetails));
      }
    }

    if (cartItems.length > 0) {
      fetchDetails();
    }
  }, [cartItems]);

  const addToCart = async (product, storeID) => {
    if (!user) return alert("Please log in first");

    // Check if there's already a storeID in localStorage
    const existingStoreID = localStorage.getItem("cartStoreID");

    // If cart already has items from a different store
    if (existingStoreID && existingStoreID !== storeID.toString()) {
      const confirmSwitch = window.confirm(
        "Your cart contains items from another store. Do you want to clear the cart and add this item?"
      );
      if (!confirmSwitch) return;

      // Clear cart on backend if required
      try {
        await axios.delete(`https://localhost:7063/api/Cart/${user.customerID}/clear`);
        setCartItems([]); // Clear locally
        localStorage.removeItem("cartStoreID");
      } catch (err) {
        console.error("Failed to clear cart", err);
        return;
      }
    }

    // Now set storeID in localStorage if it's empty or just cleared
    if (!existingStoreID || existingStoreID !== storeID.toString()) {
      localStorage.setItem("cartStoreID", storeID);
    }

    const newItem = {
      customerID: user.customerID,
      productID: product.inventoryID,  // inventory ID 
      storeID: storeID,
      quantity: 1,
      unitPrice: product.unitPrice,
    };
    console.log("newItem in addToCart of Cart Context: ", newItem);

    try {
      await axios.post('https://localhost:7063/api/Cart', newItem);
      var scnewItem = {
        customerID: newItem.customerID,
        inventoryID: newItem.productID,  // inventory ID 
        storeID: newItem.storeID,
        quantity: 1,
        unitPrice: newItem.unitPrice,
      };
      setCartItems(prev => {
        const existing = prev.find(i => i.inventoryID === scnewItem.inventoryID);
        console.log("prevvvvvvvv", prev);
        if (existing) {
          return prev.map(i =>
            i.inventoryID === scnewItem.inventoryID
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        }
        return [...prev, scnewItem];
      });

    } catch (err) {
      console.error('Add to cart failed', err);
    }
  };

  const updateCartItem = async (productID, quantity) => {
    if (!user) return;
    try {
      console.log("Product ID in updatecartitem: ", productID);
      await axios.put(
        `https://localhost:7063/api/Cart/${user.customerID}/product/${productID}/quantity/${quantity}`
      );
      setCartItems(prev =>
        prev.map(item =>
          item.inventoryID === productID ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      console.error('Update cart failed', err);
    }
  };

  const removeFromCart = async (productID) => {
    if (!user) return;
    try {
      await console.log("removefrom cart product ID: ", productID);
      await axios.delete(
        `https://localhost:7063/api/Cart/${user.customerID}/product/${productID}`
      );
      setCartItems(prev => prev.filter(item => item.inventoryID !== productID));
    } catch (err) {
      console.error('Remove cart item failed', err);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await axios.delete(`https://localhost:7063/api/Cart/${user.customerID}/clear`);
      setCartItems([]);
      setProductDetails({});
      localStorage.removeItem("cartStoreID");
      sessionStorage.removeItem("productDetails");
    } catch (err) {
      console.error('Clear cart failed', err);
    }
  };


  return (
    <CartContext.Provider value={{
      cartItems,
      productDetails,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      setProductDetails
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Pharmacies from './pages/Pharmacies';
import Medicines from './pages/Medicines';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Header from './components/Header';
import Footer from './components/Footer';
import Profile from './pages/Profile';
import SignUp from './pages/SignUp';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import ProtectedRoute from './components/ProtectedRoute';
import Inventory from './components/Inventory';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/pharmacies" element={<ProtectedRoute><Pharmacies /></ProtectedRoute>} />
        <Route path="/medicines" element={<ProtectedRoute><Medicines /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/orders/:orderID" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
        <Route path="/inventory/:storeId" element={<Inventory />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout/Layout'
import Home from './features/home/Home'
import Login from './features/auth/Login'
import Register from './features/auth/Register'
import Dashboard from './features/dashboard/Dashboard'
import Profile from './features/profile/Profile'
import InventoryList from './features/inventory/InventoryList'
import AddProduct from './features/inventory/AddProduct'
import EditProduct from './features/inventory/EditProduct'
import OrdersList from './features/orders/OrdersList'
import OrderDetails from './features/orders/OrderDetails'
import Notifications from './features/notifications/Notifications'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Public Route component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}

function App() {
  const { loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Routes>
      {/* Public Home Page */}
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        } 
      />
      
      {/* Public routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      
      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="inventory" element={<InventoryList />} />
        <Route path="inventory/new" element={<AddProduct />} />
        <Route path="inventory/:id/edit" element={<EditProduct />} />
        <Route path="orders" element={<OrdersList />} />
        <Route path="orders/:id" element={<OrderDetails />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* Legacy protected routes (for direct access) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Profile />} />
      </Route>
      <Route
        path="/inventory/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<InventoryList />} />
        <Route path="new" element={<AddProduct />} />
        <Route path=":id/edit" element={<EditProduct />} />
      </Route>
      <Route
        path="/orders/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OrdersList />} />
        <Route path=":id" element={<OrderDetails />} />
      </Route>
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Notifications />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
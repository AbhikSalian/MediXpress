import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Divider,
} from '@mui/material'
import { Store, Save, Cancel, LocationOn } from '@mui/icons-material'
import { useFormik } from 'formik'
import { useAuth } from '../../contexts/AuthContext'
import { shopService } from '../../services/shopService'
import { shopProfileValidationSchema } from '../../utils/validation'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const Profile = () => {
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const { user } = useAuth()

  const formik = useFormik({
    initialValues: {
      name: '',
      pincode: '',
      address: '',
      phone: '',
      hours: '',
      acceptingOrders: true,
      coverageKm: 5,
      logoUrl: '',
    },
    validationSchema: shopProfileValidationSchema,
    onSubmit: async (values) => {
      setLoading(true)
      try {
        await shopService.updateShopProfile(values)
        setSnackbar({
          open: true,
          message: 'Shop profile updated successfully!',
          severity: 'success'
        })
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.message || 'Failed to update profile',
          severity: 'error'
        })
      } finally {
        setLoading(false)
      }
    },
  })

  useEffect(() => {
    const loadShopProfile = async () => {
      try {
        if (user?.shop) {
          formik.setValues({
            name: user.shop.name || '',
            pincode: user.shop.pincode || '',
            address: user.shop.address || '',
            phone: user.shop.phone || '',
            hours: user.shop.hours || '9:00 AM - 9:00 PM',
            acceptingOrders: user.shop.acceptingOrders ?? true,
            coverageKm: user.shop.coverageKm || 5,
            logoUrl: user.shop.logoUrl || '',
          })
        }
      } catch (error) {
        console.error('Error loading shop profile:', error)
      } finally {
        setInitialLoading(false)
      }
    }

    loadShopProfile()
  }, [user])

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  if (initialLoading) {
    return <LoadingSpinner message="Loading shop profile..." />
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Store />
          Shop Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your pharmacy information and location settings
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Shop Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="Phone Number"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && (formik.errors.phone || "10-digit mobile number starting with 6-9")}
                  required
                />
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn />
              Store Location
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="pincode"
                  name="pincode"
                  label="Store Pincode"
                  value={formik.values.pincode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.pincode && Boolean(formik.errors.pincode)}
                  helperText={formik.touched.pincode && (formik.errors.pincode || "6-digit pincode where your store is located")}
                  placeholder="e.g., 110001"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="coverageKm"
                  name="coverageKm"
                  label="Delivery Coverage (km)"
                  type="number"
                  value={formik.values.coverageKm}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.coverageKm && Boolean(formik.errors.coverageKm)}
                  helperText={formik.touched.coverageKm && (formik.errors.coverageKm || "How far you deliver from your store")}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="address"
                  name="address"
                  label="Complete Address"
                  multiline
                  rows={3}
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && (formik.errors.address || "Full address including landmarks")}
                  required
                />
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Why pincode matters:</strong> Customers will search for pharmacies by entering their pincode. 
                Make sure to enter the correct pincode where your store is physically located so customers can find you.
              </Typography>
            </Alert>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Business Settings
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="hours"
                  name="hours"
                  label="Operating Hours"
                  value={formik.values.hours}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.hours && Boolean(formik.errors.hours)}
                  helperText={formik.touched.hours && formik.errors.hours}
                  placeholder="e.g., 9:00 AM - 9:00 PM"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="logoUrl"
                  name="logoUrl"
                  label="Shop Logo URL (Optional)"
                  value={formik.values.logoUrl}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.logoUrl && Boolean(formik.errors.logoUrl)}
                  helperText={formik.touched.logoUrl && formik.errors.logoUrl}
                  placeholder="https://example.com/logo.png"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.acceptingOrders}
                      onChange={formik.handleChange}
                      name="acceptingOrders"
                      color="primary"
                    />
                  }
                  label="Accept New Orders"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                  Toggle this to start or stop accepting new orders from customers
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                type="button"
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => formik.resetForm()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Profile
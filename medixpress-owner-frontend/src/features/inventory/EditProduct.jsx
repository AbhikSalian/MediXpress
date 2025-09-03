import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  Snackbar,
  Breadcrumbs,
  Link,
  Divider,
} from '@mui/material'
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Edit, Save, Cancel, ArrowBack, Calculate } from '@mui/icons-material'
// import { useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import { productService } from '../../services/productService'
import { inventoryValidationSchema, masterProductValidationSchema } from '../../utils/validation'
import { formatCurrency } from '../../utils/helpers'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const EditProduct = () => {
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [product, setProduct] = useState(null)
  const [discountedPrice, setDiscountedPrice] = useState(0)
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation();

  // Initialize formik first
  const formik = useFormik({
    initialValues: {
      productMasterId: '',
      mrp: '',
      discount: 0,
      stock: '',
      expiryDate: '',
    },
    validationSchema: inventoryValidationSchema,
    onSubmit: async (values) => {
      setLoading(true)
      try {
        await productService.updateProduct(id, values)
        setSnackbar({
          open: true,
          message: 'Product updated successfully!',
          severity: 'success'
        })
        setTimeout(() => navigate('/inventory'), 1500)
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.message || 'Failed to update product',
          severity: 'error'
        })
      } finally {
        setLoading(false)
      }
    },
  })

    useEffect(() => {
    const loadProduct = async () => {
      // Check if the product data was passed from the list page
      if (location.state?.product) {
        console.log("Found product data in navigation state. Using it.");
        const productData = location.state.product;
        setProduct(productData);
        
        // Pre-fill the form with the passed data
        formik.setValues({
          productMasterId: productData.productMasterId,
          mrp: productData.mrp,
          discount: productData.discount,
          stock: productData.stock,
          expiryDate: new Date(productData.expiryDate).toISOString().split('T')[0],
        });

        setInitialLoading(false); // We're done loading
      } else {
        console.log("No navigation state. Attempting to fetch from API.");
        try {
          const productData = await productService.getProduct(id);
          setProduct(productData);

        } catch (error) {
          setSnackbar({ /*...*/ });
          setInitialLoading(false);
        }
      }
    };

    loadProduct();
  }, [id, location.state]);

  // Calculate discounted price function
  const calculateDiscountedPrice = () => {
    const mrp = parseFloat(formik.values.mrp) || 0
    const discount = parseFloat(formik.values.discount) || 0
    const calculated = mrp - (mrp * discount / 100)
    setDiscountedPrice(Math.round(calculated * 100) / 100)
  }

  useEffect(() => {
    calculateDiscountedPrice()
  }, [formik.values.mrp, formik.values.discount])

  const handleCancel = () => {
    navigate('/inventory')
  }

  if (initialLoading) {
    return <LoadingSpinner message="Loading product details..." />
  }

  if (!product) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="error">
          Product not found
        </Typography>
        <Button onClick={() => navigate('/inventory')} sx={{ mt: 2 }}>
          Back to Inventory
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link 
          component="button"
          variant="body2"
          onClick={() => navigate('/inventory')}
          sx={{ textDecoration: 'none' }}
        >
          Inventory
        </Link>
        <Typography color="text.primary">Edit Product</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/inventory')}
        >
          Back
        </Button>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Edit />
            Edit Product
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Update pricing and stock for {product.masterProduct?.name}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Product Details */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product Details
              </Typography>
              
              {/* Locked Product Information */}
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Product:</strong> {product.masterProduct?.name} by {product.masterProduct?.brand} 
                  ({product.masterProduct?.form}) - Category: {product.masterProduct?.category}
                  <br />
                  <strong>Note:</strong> Product details are locked. You can only update pricing, stock, and expiry date.
                </Typography>
              </Alert>
              
              <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Pricing & Stock Details
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      id="mrp"
                      name="mrp"
                      label="MRP (₹) *"
                      type="number"
                      value={formik.values.mrp}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.mrp && Boolean(formik.errors.mrp)}
                      helperText={formik.touched.mrp && (formik.errors.mrp || "Update the maximum retail price")}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      id="discount"
                      name="discount"
                      label="Discount % *"
                      type="number"
                      value={formik.values.discount}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.discount && Boolean(formik.errors.discount)}
                      helperText={formik.touched.discount && (formik.errors.discount || "Update discount percentage (0-100)")}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      id="stock"
                      name="stock"
                      label="Stock Quantity *"
                      type="number"
                      value={formik.values.stock}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.stock && Boolean(formik.errors.stock)}
                      helperText={formik.touched.stock && (formik.errors.stock || "Update available stock quantity")}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="expiryDate"
                      name="expiryDate"
                      label="Expiry Date *"
                      type="date"
                      value={formik.values.expiryDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.expiryDate && Boolean(formik.errors.expiryDate)}
                      helperText={formik.touched.expiryDate && (formik.errors.expiryDate || "Update product expiry date")}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        min: new Date().toISOString().split('T')[0]
                      }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
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
                    {loading ? 'Updating Product...' : 'Update Product'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Price Calculator */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calculate />
                Price Calculator
              </Typography>
              
              <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      MRP:
                    </Typography>
                    <Typography variant="h6">
                      {formik.values.mrp ? formatCurrency(formik.values.mrp) : '₹0.00'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Discount:
                    </Typography>
                    <Typography variant="h6" color="error.main">
                      -{formik.values.discount || 0}%
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Selling Price
                  </Typography>
                  <Typography variant="h4" color="primary.main" fontWeight="bold">
                    {formatCurrency(discountedPrice)}
                  </Typography>
                  {formik.values.mrp && formik.values.discount > 0 && (
                    <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                      Customer saves {formatCurrency(parseFloat(formik.values.mrp || 0) - discountedPrice)}!
                    </Typography>
                  )}
                </Box>
              </Box>

              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Remember:</strong>
                  <br />• Product details cannot be changed
                  <br />• Only pricing and stock can be updated
                  <br />• Price recalculates automatically
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default EditProduct
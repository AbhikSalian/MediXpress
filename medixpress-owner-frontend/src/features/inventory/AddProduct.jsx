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
  Autocomplete,
  Divider,
} from '@mui/material'
import { Add, Save, Cancel, ArrowBack, Calculate } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { productService } from '../../services/productService'
import { productMasterService } from '../../services/productMasterService'
import { inventoryValidationSchema } from '../../utils/validation'
import { formatCurrency } from '../../utils/helpers'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const AddProduct = () => {
  const [loading, setLoading] = useState(false)
  const [masterProducts, setMasterProducts] = useState([])
  const [loadingMaster, setLoadingMaster] = useState(true)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [selectedMasterProduct, setSelectedMasterProduct] = useState(null)
  const [discountedPrice, setDiscountedPrice] = useState(0)
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      productMasterId: '',
      mrp: '',
      discount: 0,
      stock: '',
      expiryDate: '',
    },
    validationSchema: inventoryValidationSchema,
    onSubmit: async (values, {resetForm}) => {
      console.log("=== FORM SUBMISSION STARTED ===")
      console.log("Form values:", values)

      setLoading(true)
      try {
        await productService.createProduct(values)
        setSnackbar({
          open: true,
          message: 'Product added to inventory successfully!',
          severity: 'success'
        })
        resetForm()
        setSelectedMasterProduct(null)
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.message || 'Failed to add product',
          severity: 'error'
        })
      } finally {
        setLoading(false)
      }
    },
  })

  useEffect(() => {
    console.log("Formik errors:", formik.errors);
  },
    [formik.errors]
  );

  const calculateDiscountedPrice = () => {
    const mrp = parseFloat(formik.values.mrp) || 0
    const discount = parseFloat(formik.values.discount) || 0
    const calculated = mrp - (mrp * discount / 100)
    setDiscountedPrice(Math.round(calculated * 100) / 100)
  }

  useEffect(() => {
    loadMasterProducts()
  }, [])

  useEffect(() => {
    calculateDiscountedPrice()
  }, [formik.values.mrp, formik.values.discount])

  const loadMasterProducts = async () => {
    try {
      const data = await productMasterService.getMasterProducts()
      setMasterProducts(data)
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load product catalog',
        severity: 'error'
      })
    } finally {
      setLoadingMaster(false)
    }
  }

  const handleMasterProductChange = (event, value) => {
  formik.setFieldTouched('productMasterId', true)
  console.log('Selected product:', value);
  setSelectedMasterProduct(value);
  formik.setFieldValue('productMasterId', value ? value.id : '');
}

  const handleCancel = () => {
    navigate('/inventory')
  }

  if (loadingMaster) {
    return <LoadingSpinner message="Loading product catalog..." />
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
        <Typography color="text.primary">Add Product</Typography>
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
            <Add />
            Add Product to Inventory
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Select a product from our catalog and set your pricing
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Product Selection */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product Selection & Pricing
              </Typography>

              <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Autocomplete
                      options={masterProducts}
                      getOptionLabel={(option) => `${option.name} - ${option.brand} (${option.form})`}
                      value={selectedMasterProduct}
                      onChange={handleMasterProductChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Product *"
                          placeholder="Search and select a product from catalog"
                          error={formik.touched.productMasterId && Boolean(formik.errors.productMasterId)}
                          helperText={formik.touched.productMasterId && formik.errors.productMasterId}
                          onBlur={() => formik.setFieldTouched('productMasterId', true)}
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {option.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {option.brand} • {option.form} • {option.category}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      noOptionsText="No products found"
                    />
                  </Grid>

                  {selectedMasterProduct && (
                    <Grid item xs={12}>
                      <Alert severity="info">
                        <Typography variant="body2">
                          <strong>Selected:</strong> {selectedMasterProduct.name} by {selectedMasterProduct.brand}
                          ({selectedMasterProduct.form}) - Category: {selectedMasterProduct.category}
                        </Typography>
                      </Alert>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
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
                      helperText={formik.touched.mrp && (formik.errors.mrp || "Enter the maximum retail price")}
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
                      helperText={formik.touched.discount && (formik.errors.discount || "Enter discount percentage (0-100)")}
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
                      helperText={formik.touched.stock && (formik.errors.stock || "Enter available stock quantity")}
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
                      helperText={formik.touched.expiryDate && (formik.errors.expiryDate || "Select product expiry date")}
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
                    disabled={loading || !selectedMasterProduct}
                    onClick={() => console.log("Add to Inventory button clicked!", {
                      formValid: formik.isValid,
                      hasProduct: !!selectedMasterProduct,
                      loading: loading
                    })}
                  >
                    {loading ? 'Adding Product...' : 'Add to Inventory'}
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

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Pricing Rules:</strong>
                  <br />• MRP must be entered manually
                  <br />• Discount is applied to MRP
                  <br />• Final price calculates automatically
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

export default AddProduct

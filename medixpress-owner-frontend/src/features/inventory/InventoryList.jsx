import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
} from '@mui/material'
import {
  Inventory as InventoryIcon,
  Add,
  Search,
  Edit,
  Delete,
  Warning,
  CheckCircle,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { productService } from '../../services/productService'
import { formatCurrency, formatDate, isLowStock } from '../../utils/helpers'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'

const InventoryList = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [deleteDialog, setDeleteDialog] = useState({ open: false, productId: null })
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const navigate = useNavigate()

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [products, searchTerm, selectedCategory, stockFilter])

  const loadProducts = async () => {
    try {
      const data = await productService.getProducts()
      setProducts(data)
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load products',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = products

    // Apply text search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(product =>
        product.masterProduct?.name.toLowerCase().includes(term) ||
        product.masterProduct?.brand.toLowerCase().includes(term) ||
        product.masterProduct?.category.toLowerCase().includes(term)
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.masterProduct?.category === selectedCategory
      )
    }

    // Apply stock filter
    if (stockFilter === 'low') {
      filtered = filtered.filter(product => isLowStock(product.stock))
    } else if (stockFilter === 'instock') {
      filtered = filtered.filter(product => !isLowStock(product.stock))
    }

    setFilteredProducts(filtered)
  }

  const handleDeleteClick = (productId) => {
    setDeleteDialog({ open: true, productId })
  }

  const handleDeleteConfirm = async () => {
    try {
      await productService.deleteProduct(deleteDialog.productId)
      setSnackbar({
        open: true,
        message: 'Product deleted successfully',
        severity: 'success'
      })
      loadProducts()
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete product',
        severity: 'error'
      })
    } finally {
      setDeleteDialog({ open: false, productId: null })
    }
  }

  const getUniqueCategories = () => {
    const categories = products
      .map(p => p.masterProduct?.category)
      .filter(Boolean)
    return [...new Set(categories)]
  }

  if (loading) {
    return <LoadingSpinner message="Loading inventory..." />
  }

  const categories = ['all', ...getUniqueCategories()]

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InventoryIcon />
            Inventory Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your pharmacy products and stock levels
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/inventory/new')}
        >
          Add Product
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Stock Status</InputLabel>
                <Select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  label="Stock Status"
                >
                  <MenuItem value="all">All Items</MenuItem>
                  <MenuItem value="instock">In Stock</MenuItem>
                  <MenuItem value="low">Low Stock</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary">
                {filteredProducts.length} products found
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Products Table */}
      {filteredProducts.length > 0 ? (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Details</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>MRP</TableCell>
                  {/* <TableCell>Selling Price</TableCell> */}
                  <TableCell>Stock</TableCell>
                  <TableCell>Expiry Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {product.masterProduct?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.masterProduct?.brand} • {product.masterProduct?.form}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.masterProduct?.category}
                        size="small"

                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="success">
                        {formatCurrency(product.mrp)}
                      </Typography>
                    </TableCell>
                    {/* <TableCell>
                      <Box>
                        <Typography fontWeight="medium" color="primary">
                          {formatCurrency(product.discountedPrice)}
                        </Typography>
                        {product.discount > 0 && (
                          <Chip
                            label={`${product.discount}% OFF`}
                            color="success"
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </Box>
                    </TableCell> */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography>{product.stock}</Typography>
                        {isLowStock(product.stock) ? (
                          <Warning color="warning" fontSize="small" />
                        ) : (
                          <CheckCircle color="success" fontSize="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(product.expiryDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {/* <IconButton
                          size="small"
                          onClick={() => navigate(`/inventory/${product.id}/edit`)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton> */}
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/inventory/${product.id}/edit`, { state: { product: product } })}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(product.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      ) : (
        <EmptyState
          icon={InventoryIcon}
          title="No products found"
          description="No products match your current filters. Try adjusting your search or add some products to get started."
          actionText="Add Product"
          onAction={() => navigate('/inventory/new')}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, productId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        confirmColor="error"
      />

      {/* Snackbar */}
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

export default InventoryList
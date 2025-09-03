import { productApi } from './api'

export const productMasterService = {
  // Get all master products
  getMasterProducts: async () => {
    try {
      console.log('Getting all master products...')
      
      const response = await productApi.get('/api/Product')
      const products = response.data || []
      
      console.log('ProductService response:', products)
      
      // Map backend response to frontend format
      const mappedProducts = products.map(product => ({
        // Backend: productName -> Frontend: name
        id: product.productID || product.ProductId || product.id,
        name: product.productName || product.ProductName,
        brand: 'Generic', // Not provided by backend
        form: 'Unknown', // Not provided by backend  
        category: product.category || product.Category,
        description: product.description || product.Description || ''
      }))
      console.log('Mapped master products:', mappedProducts)
      return mappedProducts
      // console.log('Mapped products after loading:', mappedProducts);
    } catch (error) {
      console.error('Get master products error:', error)
      throw new Error('Failed to fetch master products')
    }
  },

  // Get master product by ID
  getMasterProduct: async (id) => {
    try {
      console.log(`Getting master product: ${id}`)
      
      const response = await productApi.get(`/api/Product/${id}`)
      const product = response.data
      
      const mappedProduct = {
        id: product.productID || product.productId || product.id,
        name: product.productName || product.ProductName,
        brand: 'Generic',
        form: 'Unknown',
        category: product.category || product.Category,
        description: product.description || product.Description || ''
      }
      
      return mappedProduct
    } catch (error) {
      console.error('Get master product error:', error)
      if (error.response?.status === 404) {
        throw new Error('Product not found')
      }
      throw new Error('Failed to fetch master product')
    }
  },

  // Get products by category
  getMasterProductsByCategory: async (category) => {
    try {
      console.log(`Getting products by category: ${category}`)
      
      const response = await productApi.get(`/api/Product/ByCategory/${category}`)
      const products = response.data || []
      
      const mappedProducts = products.map(product => ({
        id: product.productID || product.ProductId || product.id,
        name: product.productName || product.ProductName,
        brand: 'Generic',
        form: 'Unknown',
        category: product.category || product.Category,
        description: product.description || product.Description || ''
      }))
      
      return mappedProducts
    } catch (error) {
      console.error('Get products by category error:', error)
      throw new Error('Failed to fetch products by category')
    }
  },

  // Create new master product
  createMasterProduct: async (productData) => {
    try {
      console.log('Creating master product:', productData)
      
      const response = await productApi.post('/api/Product/Create', {
        ProductName: productData.name,
        Description: productData.description || '',
        Category: productData.category
      })
      
      console.log('Created master product:', response.data)
      return response.data
    } catch (error) {
      console.error('Create master product error:', error)
      throw new Error('Failed to create master product')
    }
  },

  // Update master product
  updateMasterProduct: async (id, productData) => {
    try {
      console.log(`Updating master product: ${id}`, productData)
      
      const response = await productApi.put(`/api/Product/Update/${id}`, {
        ProductName: productData.name,
        Description: productData.description || '',
        Category: productData.category
      })
      
      console.log('Updated master product:', response.data)
      return response.data
    } catch (error) {
      console.error('Update master product error:', error)
      throw new Error('Failed to update master product')
    }
  },

  // Delete master product
  deleteMasterProduct: async (id) => {
    try {
      console.log(`Deleting master product: ${id}`)
      
      await productApi.delete(`/api/Product/Delete/${id}`)
      
      console.log('Master product deleted successfully')
      return true
    } catch (error) {
      console.error('Delete master product error:', error)
      throw new Error('Failed to delete master product')
    }
  }
}
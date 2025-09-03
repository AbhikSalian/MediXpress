import { inventoryService } from './inventoryService'
import { productMasterService } from './productMasterService'

// Helper function to get user store ID
const getUserStoreId = () => {
  const userData = localStorage.getItem('medixpress_user')
  if (!userData) throw new Error('No user logged in')
  
  const user = JSON.parse(userData)
  const storeId = user.storeId
  
  console.log('User data:', user)
  console.log('Extracted storeId:', storeId)
  
  if (!storeId) {
    console.error('StoreId is missing! User data:', user)
    throw new Error('Store ID not found. Please login again.')
  }
  
  return storeId
}

export const productService = {
  getProducts: async () => {
    try {
      const storeId = getUserStoreId()
      
      console.log('Getting products for storeId:', storeId)
      
      const inventoryItems = await inventoryService.getInventoryByStore(storeId)
     
      const masterProducts = await productMasterService.getMasterProducts()
      
      // Combine inventory data with master product details
      const enrichedProducts = inventoryItems.map(item => {
        const masterProduct = masterProducts.find(mp => mp.id === item.productMasterId)
        return {
          ...item,
          masterProduct: masterProduct || {
            id: item.productMasterId,
            name: `Product ${item.productMasterId}`,
            brand: 'Unknown',
            form: 'Unknown',
            category: 'Unknown',
            description: 'Product not found in catalog'
          }
        }
      })
      
      console.log('Enriched products:', enrichedProducts)
      return enrichedProducts
    } catch (error) {
      console.error('Get products error:', error)
      throw new Error('Failed to fetch products')
    }
  },

  // Create new product (add to inventory)

  createProduct: async (productData) => {
    try {
      const storeId = getUserStoreId()
      
      const inventoryData = {
        ...productData,
        storeId: storeId
      }
      
      await inventoryService.addInventoryItem(inventoryData)
      
      console.log('Product added to inventory successfully.')

      return {
        ...productData,
        storeId: storeId,
        id: Date.now(), // Use a temporary ID for the key prop if needed
        message: 'Product created successfully'
      }

    } catch (error) {
      console.error('Create product error:', error)
      throw new Error('Failed to create product')
    }
  },

  // Update existing product
  updateProduct: async (inventoryId, productData) => {
  try {
    console.log(`Updating product inventoryId: ${inventoryId}`);

    await inventoryService.updateInventoryItem(inventoryId, productData);
    
    console.log('Product updated successfully in the inventory.');

    return { success: true };

  } catch (error) {
    console.error('Update product error:', error);
    throw new Error('Failed to update product');
  }
},

  // Delete product
  deleteProduct: async (inventoryId) => {
    try {
      console.log(`Deleting product inventoryId: ${inventoryId}`)
      
      await inventoryService.deleteInventoryItem(inventoryId)
      
      console.log('Product deleted successfully')
      return true
    } catch (error) {
      console.error('Delete product error:', error)
      throw new Error('Failed to delete product')
    }
  }
}

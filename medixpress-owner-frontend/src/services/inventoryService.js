import { inventoryApi } from './api'

export const inventoryService = {
  // Get inventory for store
  getInventoryByStore: async (storeId) => {
    try {
      console.log(`Getting inventory for store: ${storeId}`)
      
      if (!storeId) {
        throw new Error('Store ID is required')
      }
      
      const response = await inventoryApi.get(`/api/Inventory/store/${storeId}`)
      const inventoryItems = response.data || []
      
      console.log('InventoryService response:', inventoryItems)
      
      // Map backend response to frontend format
      const mappedItems = inventoryItems.map(item => ({
        // Backend: inventoryID -> Frontend: inventoryId
        id: item.inventoryID || item.InventoryID,
        inventoryId: item.inventoryID || item.InventoryID,
        storeId: item.storeID || item.StoreID,
        productId: item.productID || item.ProductID,
        productMasterId: item.productID || item.ProductID,
        
        // Backend: unitPrice -> Frontend: mrp
        mrp: parseFloat(item.unitPrice || 0),
        // Backend: discountRate -> Frontend: discount
        // discount: parseFloat(item.discountRate || 0),
        // discountedPrice: 0, // Will calculate below
        // Backend: quantityInStock -> Frontend: stock
        stock: parseInt(item.quantityInStock || 0),
        
        expiryDate: item.expiryDate || '2026-12-31',
        createdAt: item.createdAt || new Date().toISOString(),
        
        // Will be populated later with master product data
        masterProduct: {
          id: item.ProductID || item.productID,
          name: `Product ${item.ProductID || item.productID}`,
          brand: 'Loading...',
          form: 'Unknown',
          category: 'Unknown'
        }
      }))
      
      // // Calculate discounted prices
      // mappedItems.forEach(item => {
      //   const mrp = item.mrp
      //   const discount = item.discount
      //   item.discountedPrice = mrp - (mrp * discount / 100)
      // })
      
      console.log('Mapped inventory items:', mappedItems)
      return mappedItems
    } catch (error) {
      console.error('Get inventory error:', error)
      throw new Error('Failed to fetch inventory')
    }
  },

  // Add inventory item
  addInventoryItem: async (inventoryData) => {
    try {
      const payload = {
        // Frontend: storeId -> Backend: storeID
        storeID: parseInt(inventoryData.storeId),
        // Frontend: productMasterId -> Backend: productID
        productID: parseInt(inventoryData.productMasterId),
        // Frontend: mrp -> Backend: unitPrice
        unitPrice: parseFloat(inventoryData.mrp),
        // Frontend: discount -> Backend: discountRate
        // discountRate: parseFloat(inventoryData.discount),
        // Frontend: stock -> Backend: quantityInStock
        quantityInStock: parseInt(inventoryData.stock),
        createdAt: new Date().toISOString()
      }
      
      console.log('Adding inventory item:', payload)
      
      const response = await inventoryApi.post('/api/Inventory', payload)
      const item = response.data
      
      console.log('Add inventory response:', item)
      
      // Map response back to frontend format
      return {
        id: item.inventoryID || item.InventoryID,
        inventoryId: item.inventoryID || item.InventoryID,
        storeId: item.storeID || item.StoreID,
        productId: item.productID || item.ProductID,
        productMasterId: item.productID || item.ProductID,
        mrp: parseFloat(item.unitPrice || item.UnitPrice),
        // discount: parseFloat(item.discountRate || item.DiscountRate),
        // discountedPrice: parseFloat(item.unitPrice || item.UnitPrice) - (parseFloat(item.unitPrice || item.UnitPrice) * parseFloat(item.discountRate || item.DiscountRate) / 100),
        stock: parseInt(item.quantityInStock || item.QuantityInStock),
        expiryDate: inventoryData.expiryDate,
        createdAt: item.createdAt
      }
    } catch (error) {
      console.error('Add inventory error:', error)
      throw new Error('Failed to add inventory item')
    }
  },

  // Update inventory item
  updateInventoryItem: async (inventoryId, inventoryData) => {
    try {
      const payload = {
        // Frontend: id -> Backend: inventoryID
        inventoryID: parseInt(inventoryId),
        // Frontend: mrp -> Backend: unitPrice
        unitPrice: parseFloat(inventoryData.mrp),
        // Frontend: discount -> Backend: discountRate
        // discountRate: parseFloat(inventoryData.discount),
        // Frontend: stock -> Backend: quantityInStock
        quantityInStock: parseInt(inventoryData.stock)
      }
      
      console.log('Updating inventory item:', payload)
      
      const response = await inventoryApi.put('/api/Inventory', payload)
      const item = response.data
      
      console.log('Update inventory response:', item)
      
      return {
        id: item.inventoryID || item.InventoryID,
        inventoryId: item.inventoryID || item.InventoryID,
        storeId: item.storeID || item.StoreID,
        productId: item.productID || item.ProductID,
        productMasterId: item.productID || item.ProductID,
        mrp: parseFloat(item.unitPrice || item.UnitPrice),
        // discount: parseFloat(item.discountRate || item.DiscountRate),
        // discountedPrice: parseFloat(item.unitPrice || item.UnitPrice) - (parseFloat(item.unitPrice || item.UnitPrice) * parseFloat(item.discountRate || item.DiscountRate) / 100),
        stock: parseInt(item.quantityInStock || item.QuantityInStock),
        expiryDate: inventoryData.expiryDate,
        createdAt: item.createdAt
      }
    } catch (error) {
      console.error('Update inventory error:', error)
      throw new Error('Failed to update inventory item')
    }
  },

  // Delete inventory item
  deleteInventoryItem: async (inventoryId) => {
    try {
      console.log(`Deleting inventory item: ${inventoryId}`)
      
      await inventoryApi.delete(`/api/Inventory/${inventoryId}`)
      
      console.log('Inventory item deleted successfully')
      return true
    } catch (error) {
      console.error('Delete inventory error:', error)
      throw new Error('Failed to delete inventory item')
    }
  }
}
import { orderApi } from './api'
import { inventoryService } from './inventoryService';
import { productMasterService } from './productMasterService';


export const orderService = {
  // Get orders by store
  getOrdersByStore: async (storeId) => {
    try {
      if (!storeId) throw new Error('Store ID is required');

      const [ordersResponse, inventoryItems, masterProducts] = await Promise.all([
        orderApi.get(`/api/Order/store/${storeId}`),
        inventoryService.getInventoryByStore(storeId),
        productMasterService.getMasterProducts()
      ]);
      
      const orders = ordersResponse.data || [];

      const mappedOrders = orders.map(order => ({
        id: order.orderId || order.OrderId || order.orderID || order.OrderID,
        orderId: order.orderId || order.OrderId || order.orderID || order.OrderID,
        customerId: order.customerID,
        storeId: order.storeID,
        status: orderService.mapDeliveryStatus(order.deliveryStatus || 0),
        total: parseFloat(order.totalAmount || 0),
        createdAt: order.orderDate || order.createdAt || new Date().toISOString(),
        customer: {
          id: order.customerID,
          name: `Customer ${order.customerID}`,
          phone: '',
          address: ''
        },
        paymentStatus: 'Pending',

        items: (order.items || []).map(item => {
          const inventoryId = item.productID;
          const matchingInventoryItem = inventoryItems.find(invItem => invItem.id === inventoryId);
          
          let productName = `Product #${inventoryId}`;
          if (matchingInventoryItem) {
            const masterProduct = masterProducts.find(mp => mp.id === matchingInventoryItem.productMasterId);
            if (masterProduct) {
              productName = masterProduct.name;
            }
          }
          const historicalPrice = item.unitPrice;

          return {
            productId: inventoryId,
            quantity: parseInt(item.quantity || 0),
            unitPrice: parseFloat(historicalPrice || 0),
            name: productName
          };
        })
      }));
      
      return mappedOrders;

    } catch (error) {
      console.error('Get orders error:', error);
      throw new Error('Failed to fetch orders');
    }
  },


  getOrders: async () => {
    try {
      const userData = localStorage.getItem('medixpress_user');
      if (!userData) throw new Error('No user logged in');

      const user = JSON.parse(userData);
      const storeId = user.storeId || user.id;

      if (!storeId) {
        throw new Error('Store ID not found');
      }

      return await orderService.getOrdersByStore(storeId);
    } catch (error) {
      console.error('Get orders error:', error);
      throw new Error('Failed to fetch orders');
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const deliveryStatus = orderService.mapStatusToDeliveryStatus(status);
      const response = await orderApi.put(`/api/Order/${orderId}/status/${deliveryStatus}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update order status');
    }
  },

  // Delete order
  deleteOrder: async (orderId) => {
    try {
      console.log(`Deleting order: ${orderId}`)

      await orderApi.delete(`/api/Order/${orderId}`)

      console.log('Order deleted successfully')
      return true
    } catch (error) {
      console.error('Delete order error:', error)
      throw new Error('Failed to delete order')
    }
  },

  // Helper: Map delivery status number to string
  mapDeliveryStatus: (status) => {
    const statusMap = {
      0: 'Pending',
      1: 'Accepted',
      2: 'Preparing',
      3: 'Packed',
      4: 'Out for Delivery',
      5: 'Delivered',
      6: 'Cancelled'
    }
    return statusMap[status] || 'Unknown'
  },

  // Helper: Map status string to delivery status number
  mapStatusToDeliveryStatus: (status) => {
    const statusMap = {
      'Pending': 0,
      'Accepted': 1,
      'Preparing': 2,
      'Packed': 3,
      'Out for Delivery': 4,
      'Delivered': 5,
      'Cancelled': 6
    }
    // return statusMap[status] || 0
    const numericStatus = statusMap[status];
    if (numericStatus === undefined) {
      console.error(`Unknown status string: ${status}`);
      return -1; // Or throw an error
    }
    return numericStatus;
  }
}
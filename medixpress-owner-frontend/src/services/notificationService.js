// Mock notification service since no backend endpoint is available
export const notificationService = {
  // Get notifications - Mock implementation
  getNotifications: async (ownerId) => {
    try {
      console.log(`Getting notifications for owner: ${ownerId}`)
      
      // Return empty notifications array (no backend endpoint available)
      return []
    } catch (error) {
      console.error('Get notifications error:', error)
      throw new Error('Failed to fetch notifications')
    }
  },

  // Get unread count - Mock implementation
  getUnreadCount: async (ownerId) => {
    try {
      console.log(`Getting unread count for owner: ${ownerId}`)
      
      // Return 0 unread notifications
      return 0
    } catch (error) {
      console.error('Get unread count error:', error)
      return 0
    }
  }
}
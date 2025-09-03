import { storeApi } from './api'

export const shopService = {

  // Get shop profile - Use existing store data
  getShopProfile: async () => {
    try {
      const userData = localStorage.getItem('medixpress_user')
      if (!userData) throw new Error('No user logged in')
      
      const user = JSON.parse(userData)


      
      // Return current user shop data
      return {
        success: true,
        shop: user.shop || {
          name: user.name || '',
          pincode: '',
          address: '',
          phone: '',
          hours: '9:00 AM - 9:00 PM',
          acceptingOrders: true,
          coverageKm: 5,
          logoUrl: ''
        }
      }
    } catch (error) {
      console.error('Get shop profile error:', error)
      throw new Error('Failed to fetch shop profile')
    }
  },

  // Update shop profile - Mock implementation (no backend endpoint available)
  updateShopProfile: async (profileData) => {
    try {
      console.log('Updating shop profile:', profileData)
      
      // Update localStorage data
      const userData = localStorage.getItem('medixpress_user')
      if (!userData) throw new Error('No user logged in')
      
      const user = JSON.parse(userData)
      
      // Update user shop data
      user.shop = {
        ...user.shop,
        name: profileData.name || user.shop.name,
        pincode: profileData.pincode || user.shop.pincode,
        address: profileData.address || user.shop.address,
        phone: profileData.phone || user.shop.phone,
        hours: profileData.hours || user.shop.hours,
        acceptingOrders: profileData.acceptingOrders !== undefined ? profileData.acceptingOrders : user.shop.acceptingOrders,
        coverageKm: profileData.coverageKm || user.shop.coverageKm
      }
      
      // Save updated data
      localStorage.setItem('medixpress_user', JSON.stringify(user))
      
      console.log('Shop profile updated successfully')
      return {
        success: true,
        message: 'Profile updated successfully',
        shop: user.shop
      }
    } catch (error) {
      console.error('Update shop profile error:', error)
      throw new Error('Failed to update shop profile')
    }
  }
}

// src/services/shopService.js

// src/services/shopService.js

// import { storeApi } from './api';

// export const shopService = {
//   // Make sure your getShopProfile function is still here
//   getShopProfile: async () => {
//     // ... (your existing getShopProfile code)
//   },

//   updateShopProfile: async (profileData) => {
//     try {
//       console.log('Updating shop profile with backend:', profileData);
      
//       const user = JSON.parse(localStorage.getItem('medixpress_user'));
//       const storeId = user.storeId || user.id;

//       if (!storeId) {
//         throw new Error("Store ID not found. Cannot update profile.");
//       }

//       const response = await storeApi.put(`/api/Store/Update/${storeId}`, {
//         storeName: profileData.name,
//         phone: profileData.phone,
//         pincode: profileData.pincode,
//         address: profileData.address,
//         // Add other fields like hours, coverageKm if the backend expects them
//       });

//       // --- THIS IS THE MISSING LOGIC ---
//       console.log("Backend update successful. Updating localStorage to stay in sync.");
      
//       // Update the user object that's already in memory
//       user.shop = {
//         ...user.shop,
//         ...profileData
//       };
      
//       // Save the updated user object back to localStorage
//       localStorage.setItem('medixpress_user', JSON.stringify(user));
//       // --- END OF MISSING LOGIC ---

//       return response.data; // Return the response from the backend
//     } catch (error) {
//       console.error('Update shop profile error:', error);
//       throw new Error('Failed to update shop profile');
//     }
//   }
// };
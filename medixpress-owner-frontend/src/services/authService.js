import { storeApi } from './api'

export const authService = {
  // Login with StoreService
  login: async (email, password) => {
    try {
      console.log('Login attempt:', { email })

      const response = await storeApi.post('/api/Store/Login', {
        email: email.trim(),
        password: password
      })
      console.log('=== FULL BACKEND LOGIN RESPONSE ===')
      console.log('Response status:', response.status)
      console.log('Response data:', response.data)
      console.log('================================')
      if (response.status === 200) {
        const responseData = response.data
        const userData = {
          id: responseData.storeID,
          storeId: responseData.storeID,
          name: responseData.storeName,
          email: email,
          shop: {
            name: responseData.storeName,
            pincode: responseData.pincode,
            address: responseData.address,
            phone: responseData.phone,
            hours: '9:00 AM - 9:00 PM',
            acceptingOrders: true,
            coverageKm: 5,
            logoUrl: ''
          }
        }

        console.log('Mapped user data:', userData)
        console.log('Final storeId should be:', userData.storeId)

        // Save to localStorage
        localStorage.setItem('medixpress_user', JSON.stringify(userData))
        localStorage.setItem('medixpress_token', 'logged-in')

        return {
          success: true,
          user: userData,
          message: 'Login successful'
        }
      }
    } catch (error) {
      console.error('Login error:', error)

      if (error.response) {
        const status = error.response.status
        if (status === 401) {
          throw new Error('Invalid email or password')
        } else if (status === 400) {
          throw new Error('Invalid login credentials')
        }
      }

      throw new Error('Login failed. Please try again.')
    }
  },

  // Register with StoreService
  register: async (userData) => {
    try {
      console.log('Registration attempt:', userData)

      const response = await storeApi.post('/api/Store/Register', {
        storeName: userData.shopName,
        email: userData.email.trim(),
        password: userData.password,
        phone: userData.phone || '',
        pincode: userData.shopPincode,
        address: userData.address || ''
      })

      console.log('Registration response:', response.data)

      if (response.status === 200) {
        const responseData = response.data

        const newUser = {
          id: responseData.storeID,
          storeId: responseData.storeID,
          name: userData.name,
          email: userData.email,
          shop: {
            name: userData.shopName,
            pincode: userData.shopPincode,
            address: userData.address || '',
            phone: userData.phone || '',
            hours: '9:00 AM - 9:00 PM',
            acceptingOrders: true,
            coverageKm: 5,
            logoUrl: ''
          }
        }
        localStorage.removeItem('medixpress_user')
        localStorage.removeItem('medixpress_token')

        return {
          success: true,
          user: newUser,
          message: 'Registration successful'
        }
      }
    } catch (error) {
      console.error('Registration error:', error)

      if (error.response) {
        const status = error.response.status
        if (status === 400) {
          throw new Error('Registration failed. Please check your information.')
        } else if (status === 409) {
          throw new Error('Email already exists.')
        }
      }

      throw new Error('Registration failed. Please try again.')
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('medixpress_token')
    localStorage.removeItem('medixpress_user')
  }
}
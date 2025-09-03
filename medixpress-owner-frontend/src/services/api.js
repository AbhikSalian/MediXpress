import axios from 'axios'

// Backend service URLs
const STORE_SERVICE_BASE_URL = 'https://localhost:8020'
const PRODUCT_SERVICE_BASE_URL = 'https://localhost:8030'  
const INVENTORY_SERVICE_BASE_URL = 'https://localhost:8040'
const ORDER_SERVICE_BASE_URL = 'https://localhost:7065'

// Create axios instances for each service
const storeApi = axios.create({
  baseURL: STORE_SERVICE_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

const productApi = axios.create({
  baseURL: PRODUCT_SERVICE_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

const inventoryApi = axios.create({
  baseURL: INVENTORY_SERVICE_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

const orderApi = axios.create({
  baseURL: ORDER_SERVICE_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Add request/response interceptors for debugging
const setupInterceptors = (api, serviceName) => {
  api.interceptors.request.use(
    (config) => {
      console.log(`${serviceName} Request:`, config)
      return config
    },
    (error) => {
      console.error(`${serviceName} Request Error:`, error)
      return Promise.reject(error)
    }
  )

  api.interceptors.response.use(
    (response) => {
      console.log(`${serviceName} Response:`, response.data)
      return response
    },
    (error) => {
      console.error(`${serviceName} Response Error:`, error)
      return Promise.reject(error)
    }
  )
}

setupInterceptors(storeApi, 'StoreService')
setupInterceptors(productApi, 'ProductService')  
setupInterceptors(inventoryApi, 'InventoryService')
setupInterceptors(orderApi, 'OrderService')

export { storeApi, productApi, inventoryApi, orderApi }
export default storeApi // For backward compatibility
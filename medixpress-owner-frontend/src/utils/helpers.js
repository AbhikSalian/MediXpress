export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date for display
export const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString))
}

// Format date and time for display
export const formatDateTime = (dateString) => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

// Check if stock is low (threshold of 10)
export const isLowStock = (stock, threshold = 10) => {
  return stock <= threshold
}

// Get status color for order status chips
export const getOrderStatusColor = (status) => {
  const statusColors = {
    'Pending': 'warning',
    'Accepted': 'info',
    'Packed': 'primary',
    'Out for Delivery': 'secondary',
    'Delivered': 'success',
    'Cancelled': 'error',
  }
  return statusColors[status] || 'default'
}

// Get payment status color
export const getPaymentStatusColor = (status) => {
  const statusColors = {
    'Paid': 'success',
    'Pending': 'warning',
    'Failed': 'error',
  }
  return statusColors[status] || 'default'
}

// Calculate order total
export const calculateOrderTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.qty), 0)
}

// Truncate text to specified length
export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// Generate unique ID (for mock purposes)
export const generateId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9)
}

// Check if product is expiring soon (within 30 days)
export const isExpiringSoon = (expiryDate, days = 30) => {
  const expiry = new Date(expiryDate)
  const now = new Date()
  const diffTime = expiry - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= days && diffDays > 0
}

// Check if product is expired
export const isExpired = (expiryDate) => {
  const expiry = new Date(expiryDate)
  const now = new Date()
  return expiry < now
}

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now - date
  const diffMinutes = Math.floor(diffTime / (1000 * 60))
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`
  } else {
    return `${diffDays} days ago`
  }
}

// Sort array by field
export const sortBy = (array, field, order = 'asc') => {
  return array.sort((a, b) => {
    const aValue = a[field]
    const bValue = b[field]
    
    if (order === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
}

// Filter products by search term
export const filterProducts = (products, searchTerm, category = 'all') => {
  let filtered = products

  // Filter by search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase()
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.brand.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    )
  }

  // Filter by category
  if (category !== 'all') {
    filtered = filtered.filter(product => product.category === category)
  }

  return filtered
}

// Get product categories from products array
export const getProductCategories = (products) => {
  const categories = [...new Set(products.map(product => product.category))]
  return categories.sort()
}

// Debounce function for search
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const getOrderActions = (currentStatus) => {
  const actions = [];
  switch (currentStatus) {
    case 'Pending':
      actions.push({ status: 'Accepted', label: 'Accept Order', color: 'success' });
      actions.push({ status: 'Cancelled', label: 'Cancel Order', color: 'error' });
      break;
    case 'Confirmed':
    case 'Accepted':
      actions.push({ status: 'Packed', label: 'Mark as Packed', color: 'primary' });
      actions.push({ status: 'Cancelled', label: 'Cancel Order', color: 'error' });
      break;
    case 'Packed':
    case 'Ready':
      actions.push({ status: 'Out for Delivery', label: 'Out for Delivery', color: 'info' });
      break;
    case 'Out for Delivery':
      actions.push({ status: 'Delivered', label: 'Mark as Delivered', color: 'success' });
      break;
    default:
      break;
  }
  return actions;
}
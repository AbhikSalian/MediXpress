import * as Yup from 'yup'

// Login validation schema
export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

// Register validation schema (matches backend StoreDTO)
export const registerValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  shopName: Yup.string()
    .min(2, 'Shop name must be at least 2 characters')
    .max(100, 'Shop name must be less than 100 characters')
    .required('Shop name is required'),
  shopPincode: Yup.string()
    .matches(/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit Indian pincode')
    .required('Store pincode is required'),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number')
    .nullable(),
  address: Yup.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters')
    .nullable(),
})

// Product validation schema (matches backend InventoryAddDTO)
export const productValidationSchema = Yup.object({
  productMasterId: Yup.number()
    .required('Please select a product'),
  mrp: Yup.number()
    .min(0.01, 'MRP must be greater than 0')
    .max(10000, 'MRP seems too high')
    .required('MRP is required'),
  discount: Yup.number()
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot exceed 100%')
    .required('Discount is required'),
  stock: Yup.number()
    .min(0, 'Stock cannot be negative')
    .max(10000, 'Stock quantity seems too high')
    .integer('Stock must be a whole number')
    .required('Stock quantity is required'),
  expiryDate: Yup.date()
    .min(new Date(), 'Expiry date must be in the future')
    .required('Expiry date is required'),
})

// Master product validation schema (matches backend ProductDTO)
export const masterProductValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must be less than 100 characters')
    .required('Product name is required'),
  description: Yup.string()
    .max(500, 'Description must be less than 500 characters')
    .nullable(),
  category: Yup.string()
    .min(2, 'Category must be at least 2 characters')
    .max(50, 'Category must be less than 50 characters')
    .required('Category is required'),
})

// Shop profile validation schema (matches backend StoreDTO)
export const shopProfileValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Shop name must be at least 2 characters')
    .max(100, 'Shop name must be less than 100 characters')
    .required('Shop name is required'),
  pincode: Yup.string()
    .matches(/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit Indian pincode')
    .required('Pincode is required'),
  address: Yup.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters')
    .required('Address is required'),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number')
    .required('Phone number is required'),
  hours: Yup.string()
    .required('Operating hours are required'),
  coverageKm: Yup.number()
    .min(1, 'Coverage area must be at least 1 km')
    .max(50, 'Coverage area cannot exceed 50 km')
    .required('Coverage area is required'),
})

// Alternative names for compatibility
export const addProductValidationSchema = productValidationSchema
export const editProductValidationSchema = productValidationSchema
export const inventoryValidationSchema = productValidationSchema
export const profileValidationSchema = shopProfileValidationSchema
export const storeProfileValidationSchema = shopProfileValidationSchema

// Utility validation functions
export const validatePincode = (pincode) => {
  const pincodeRegex = /^[1-9][0-9]{5}$/
  return pincodeRegex.test(pincode)
}

export const validateMobileNumber = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone)
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
const API_BASE_URL = '/api'

class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = 'An error occurred'
    let errorData = null

    try {
      errorData = await response.json()
      errorMessage = errorData.error || errorMessage
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage
    }

    throw new ApiError(errorMessage, response.status, errorData)
  }

  try {
    return await response.json()
  } catch {
    // If response is not JSON, return null
    return null
  }
}

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add body if it's not a GET request and body is provided
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body)
  }

  try {
    const response = await fetch(url, config)
    return await handleResponse(response)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    
    // Network error or other issues
    throw new ApiError('Network error. Please check your connection.', 0, null)
  }
}

// API methods for Vercel
export const api = {
  // Get all apartments
  getApartments: () => apiRequest('/apartments'),

  // Get apartment by slug (updated for Vercel)
  getApartment: (slug) => apiRequest(`/apartments?slug=${slug}`),

  // Submit reservation
  submitReservation: (data) => apiRequest('/reservations', {
    method: 'POST',
    body: data,
  }),
}

// Utility functions
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  
  return new Date(date).toLocaleDateString('en-US', {
    ...defaultOptions,
    ...options,
  })
}

export const calculateNights = (checkIn, checkOut) => {
  const arrival = new Date(checkIn)
  const departure = new Date(checkOut)
  const nights = Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24))
  return nights > 0 ? nights : 0
}

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (phone) => {
  // Basic phone validation - can be customized based on requirements
  const re = /^[\+]?[1-9][\d]{0,15}$/
  return re.test(phone.replace(/\s/g, ''))
}

export default api
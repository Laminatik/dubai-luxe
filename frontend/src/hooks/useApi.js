import { useState, useEffect, useCallback } from 'react'

// Custom hook for API calls with loading states
const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiFunction(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err.message || 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    execute()
  }, [execute])

  return { data, loading, error, refetch: execute }
}

// Hook for manual API calls (doesn't execute automatically)
export const useApiCall = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (apiFunction, ...args) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiFunction(...args)
      return result
    } catch (err) {
      setError(err.message || 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
  }, [])

  return { loading, error, execute, reset }
}

// Hook for form submissions with validation
export const useFormSubmission = (onSubmit, validation = null) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validateField = useCallback((name, value, formData) => {
    if (!validation || !validation[name]) return ''
    
    const validator = validation[name]
    if (typeof validator === 'function') {
      return validator(value, formData) || ''
    }
    
    return ''
  }, [validation])

  const validateForm = useCallback((formData) => {
    if (!validation) return {}
    
    const newErrors = {}
    Object.keys(validation).forEach(field => {
      const error = validateField(field, formData[field], formData)
      if (error) newErrors[field] = error
    })
    
    return newErrors
  }, [validation, validateField])

  const handleSubmit = useCallback(async (formData) => {
    const formErrors = validateForm(formData)
    setErrors(formErrors)
    
    if (Object.keys(formErrors).length > 0) {
      return { success: false, errors: formErrors }
    }

    try {
      setLoading(true)
      const result = await onSubmit(formData)
      return { success: true, data: result }
    } catch (error) {
      const submitError = { submit: error.message || 'Submission failed' }
      setErrors(submitError)
      return { success: false, errors: submitError }
    } finally {
      setLoading(false)
    }
  }, [onSubmit, validateForm])

  const handleFieldChange = useCallback((name, value, formData) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    
    if (touched[name] || errors[name]) {
      const fieldError = validateField(name, value, formData)
      setErrors(prev => ({
        ...prev,
        [name]: fieldError
      }))
    }
  }, [touched, errors, validateField])

  const reset = useCallback(() => {
    setLoading(false)
    setErrors({})
    setTouched({})
  }, [])

  return {
    loading,
    errors,
    touched,
    handleSubmit,
    handleFieldChange,
    reset
  }
}

// Hook for managing async operations with retry functionality
export const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  const execute = useCallback(async (operation, maxRetries = 3) => {
    let attempt = 0
    
    while (attempt <= maxRetries) {
      try {
        setLoading(true)
        setError(null)
        setRetryCount(attempt)
        
        const result = await operation()
        return result
      } catch (err) {
        attempt++
        
        if (attempt > maxRetries) {
          setError(err.message || 'Operation failed')
          throw err
        }
        
        // Exponential backoff delay
        const delay = Math.pow(2, attempt - 1) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      } finally {
        setLoading(false)
      }
    }
  }, [])

  return { loading, error, retryCount, execute }
}

export default useApi
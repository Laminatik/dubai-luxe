import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import LoadingSpinner from '../UI/LoadingSpinner'
import CustomDatePicker from '../UI/CustomDatePicker'
import CustomSelect from '../UI/CustomSelect'

const ReservationForm = ({ apartment, onClose }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    arrivalDate: '',
    departureDate: '',
    guests: 1,
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleDateChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleGuestsChange = (value) => {
    setFormData(prev => ({ ...prev, guests: parseInt(value) }))
    if (errors.guests) {
      setErrors(prev => ({ ...prev, guests: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.arrivalDate) {
      newErrors.arrivalDate = 'Check-in date is required'
    }

    if (!formData.departureDate) {
      newErrors.departureDate = 'Check-out date is required'
    }

    if (formData.arrivalDate && formData.departureDate) {
      if (new Date(formData.arrivalDate) >= new Date(formData.departureDate)) {
        newErrors.departureDate = 'Check-out must be after check-in'
      }
      if (new Date(formData.arrivalDate) < new Date()) {
        newErrors.arrivalDate = 'Check-in date cannot be in the past'
      }
    }

    if (!formData.guests || formData.guests < 1) {
      newErrors.guests = 'Number of guests is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          apartmentId: apartment.id
        })
      })

      const result = await response.json()

      if (response.ok) {
        // Success - redirect to thank you page
        navigate('/thanks')
      } else {
        throw new Error(result.error || 'Failed to submit reservation')
      }
    } catch (error) {
      console.error('Reservation error:', error)
      setErrors({ submit: error.message })
    } finally {
      setLoading(false)
    }
  }

  const calculateNights = () => {
    if (formData.arrivalDate && formData.departureDate) {
      const arrival = new Date(formData.arrivalDate)
      const departure = new Date(formData.departureDate)
      const nights = Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24))
      return nights > 0 ? nights : 0
    }
    return 0
  }

  const totalCost = calculateNights() * apartment.priceNight

  const guestOptions = Array.from({ length: 8 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1} Guest${i > 0 ? 's' : ''}`
  }))

  // ИСПРАВЛЕНО: Создаем единый класс для всех лейблов
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2 tracking-wide"
  const inputClass = "w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 bg-white"
  const errorClass = "text-red-500 text-xs mt-1 flex items-center break-words"

  return (
    <div className="w-full max-w-full overflow-hidden">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="w-full max-w-full"
      >
        <div className="space-y-6 w-full max-w-full">
          {/* ИСПРАВЛЕНО: Apartment Summary */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 relative w-full overflow-hidden">
            <div className="absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-dubai-gold/5 to-transparent rounded-full -mr-10 sm:-mr-12 -mt-10 sm:-mt-12"></div>
            <div className="relative w-full">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-playfair font-bold text-lg sm:text-xl mb-2 text-gray-800 break-words leading-tight">
                    {apartment.name}
                  </h3>
                  <div className="flex flex-col space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-dubai-gold/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-2 h-2 text-dubai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </div>
                      <span className="break-words">{apartment.district}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-dubai-gold/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-2 h-2 text-dubai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        </svg>
                      </div>
                      <span className="whitespace-nowrap">{apartment.bedrooms} Bedroom{apartment.bedrooms > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg sm:text-xl font-bold gold-gradient-text">${apartment.priceNight.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">per night</div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3 h-3 text-dubai-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          {/* ИСПРАВЛЕНО: Form Fields с единообразными отступами */}
          <div className="space-y-6 w-full max-w-full">
            {/* ИСПРАВЛЕНО: Personal Information Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-full"
              >
                <label className={labelClass}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`${inputClass} ${
                    errors.fullName 
                      ? 'border-red-300 focus:border-red-400' 
                      : 'border-dubai-gold/20 focus:border-dubai-gold hover:border-dubai-gold/40'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <p className={errorClass}>
                  <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="break-words">{errors.fullName}</span>
                </p>}
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full"
              >
                <label className={labelClass}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${inputClass} ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-400' 
                      : 'border-dubai-gold/20 focus:border-dubai-gold hover:border-dubai-gold/40'
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className={errorClass}>
                  <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="break-words">{errors.email}</span>
                </p>}
              </motion.div>
            </div>

            {/* ИСПРАВЛЕНО: Contact & Guests Row с одинаковыми отступами */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-full"
              >
                <label className={labelClass}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`${inputClass} border-dubai-gold/20 focus:border-dubai-gold hover:border-dubai-gold/40`}
                  placeholder="+971 50 123 4567"
                />
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-full"
              >
                {/* ИСПРАВЛЕНО: Используем внешний label для согласованности */}
                <label className={labelClass}>
                  Number of Guests *
                </label>
                <CustomSelect
                  value={formData.guests.toString()}
                  onChange={handleGuestsChange}
                  options={guestOptions}
                  placeholder="Select guests"
                  hideExternalLabel={true}
                />
                {errors.guests && <p className={errorClass}>
                  <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="break-words">{errors.guests}</span>
                </p>}
              </motion.div>
            </div>

            {/* ИСПРАВЛЕНО: Date Selection Row с одинаковыми отступами */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="w-full"
              >
                <label className={labelClass}>
                  Check-in Date *
                </label>
                <CustomDatePicker
                  value={formData.arrivalDate}
                  onChange={(value) => handleDateChange('arrivalDate', value)}
                  placeholder="Select check-in date"
                  minDate={new Date().toISOString().split('T')[0]}
                  error={!!errors.arrivalDate}
                  hideExternalLabel={true}
                  isInModal={true}
                />
                {errors.arrivalDate && <p className={errorClass}>
                  <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="break-words">{errors.arrivalDate}</span>
                </p>}
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="w-full"
              >
                <label className={labelClass}>
                  Check-out Date *
                </label>
                <CustomDatePicker
                  value={formData.departureDate}
                  onChange={(value) => handleDateChange('departureDate', value)}
                  placeholder="Select check-out date"
                  minDate={formData.arrivalDate || new Date().toISOString().split('T')[0]}
                  error={!!errors.departureDate}
                  hideExternalLabel={true}
                  isInModal={true}
                />
                {errors.departureDate && <p className={errorClass}>
                  <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="break-words">{errors.departureDate}</span>
                </p>}
              </motion.div>
            </div>

            {/* Special Requests */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="w-full"
            >
              <label className={labelClass}>
                Special Requests & Preferences
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className={`${inputClass} border-dubai-gold/20 focus:border-dubai-gold hover:border-dubai-gold/40 resize-none`}
                placeholder="Let us know about any special requirements, dietary preferences, celebration occasions, or personalized services you'd like us to arrange..."
              />
            </motion.div>
          </div>

          {/* Cost Summary */}
          {calculateNights() > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-gradient-to-br from-dubai-gold/5 to-dubai-gold/10 rounded-2xl p-4 sm:p-6 border-2 border-dubai-gold/20 w-full overflow-hidden"
            >
              <h4 className="font-playfair font-semibold text-lg mb-4 text-gray-800">Reservation Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-dubai-gold/20">
                  <span className="text-gray-600 text-sm break-words flex-1 pr-2">{calculateNights()} night{calculateNights() > 1 ? 's' : ''} × ${apartment.priceNight.toLocaleString()}</span>
                  <span className="font-semibold flex-shrink-0">${totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Dubai Luxe service fee</span>
                  <span className="font-semibold">Included</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-dubai-gold/20">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-xl gold-gradient-text">${totalCost.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-600 text-center">
                Final pricing will be confirmed by our concierge team
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 w-full overflow-hidden"
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-medium text-sm break-words">{errors.submit}</p>
              </div>
            </motion.div>
          )}

          {/* Form Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-3 pt-4 w-full"
          >
            <button
              type="button"
              onClick={onClose}
              className="btn-luxury-secondary flex-1 py-3 text-sm w-full"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-luxury-primary flex-1 py-3 text-sm flex items-center justify-center w-full"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">Submitting...</span>
                </>
              ) : (
                'Confirm Reservation'
              )}
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-center space-y-2 w-full"
          >
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 flex-wrap gap-2">
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Secure & Encrypted</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Free Cancellation</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed break-words px-4">
              By submitting this reservation, you agree to Dubai Luxe's terms of service and privacy policy. 
              Your information is protected and will only be used to provide you with exceptional service.
            </p>
          </motion.div>
        </div>
      </motion.form>
    </div>
  )
}

export default ReservationForm
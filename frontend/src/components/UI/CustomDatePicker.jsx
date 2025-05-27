import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CustomDatePicker = ({ 
  value, 
  onChange, 
  placeholder = "Select date", 
  minDate, 
  maxDate,
  className = "",
  error = false 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null)
  const containerRef = useRef(null)

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value))
      setCurrentMonth(new Date(value))
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0)
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonth.getDate() - i),
        isCurrentMonth: false
      })
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true
      })
    }

    // Next month's leading days
    const remainingSlots = 42 - days.length
    for (let day = 1; day <= remainingSlots; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false
      })
    }

    return days
  }

  const isDateDisabled = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (date < today) return true
    if (minDate && date < new Date(minDate)) return true
    if (maxDate && date > new Date(maxDate)) return true
    return false
  }

  const isDateSelected = (date) => {
    if (!selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  const handleDateSelect = (date) => {
    if (isDateDisabled(date)) return
    
    setSelectedDate(date)
    onChange?.(date.toISOString().split('T')[0])
    setIsOpen(false)
  }

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      newMonth.setMonth(prev.getMonth() + direction)
      return newMonth
    })
  }

  const formatDisplayDate = (date) => {
    if (!date) return placeholder
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const days = getDaysInMonth(currentMonth)

  return (
    <div className="relative" ref={containerRef}>
      {/* Input Field */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 luxury-glass text-left flex items-center justify-between ${
          error 
            ? 'border-red-300 focus:border-red-400' 
            : 'border-dubai-gold/20 focus:border-dubai-gold hover:border-dubai-gold/40'
        } ${className}`}
        whileTap={{ scale: 0.98 }}
      >
        <span className={selectedDate ? 'text-gray-800' : 'text-gray-500'}>
          {formatDisplayDate(selectedDate)}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="w-5 h-5 text-dubai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.button>

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 z-50 luxury-card rounded-3xl p-6 shadow-luxury border border-dubai-gold/20"
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <motion.button
                type="button"
                onClick={() => navigateMonth(-1)}
                className="p-2 rounded-full hover:bg-dubai-gold/10 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5 text-dubai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              
              <div className="text-center">
                <h3 className="text-lg font-playfair font-semibold text-gray-800">
                  {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
              </div>
              
              <motion.button
                type="button"
                onClick={() => navigateMonth(1)}
                className="p-2 rounded-full hover:bg-dubai-gold/10 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5 text-dubai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekdays.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const isDisabled = isDateDisabled(day.date)
                const isSelected = isDateSelected(day.date)
                const isToday = day.date.toDateString() === new Date().toDateString()
                
                return (
                  <motion.button
                    key={index}
                    type="button"
                    onClick={() => handleDateSelect(day.date)}
                    disabled={isDisabled || !day.isCurrentMonth}
                    className={`
                      relative h-10 w-full rounded-xl text-sm font-medium transition-all duration-200
                      ${!day.isCurrentMonth 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : isDisabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : isSelected
                        ? 'bg-dubai-gold text-white shadow-lg'
                        : isToday
                        ? 'bg-dubai-gold/20 text-dubai-gold font-semibold'
                        : 'text-gray-700 hover:bg-dubai-gold/10 hover:text-dubai-gold'
                      }
                    `}
                    whileHover={!isDisabled && day.isCurrentMonth ? { scale: 1.05 } : {}}
                    whileTap={!isDisabled && day.isCurrentMonth ? { scale: 0.95 } : {}}
                  >
                    {day.date.getDate()}
                    
                    {/* Today indicator */}
                    {isToday && !isSelected && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-dubai-gold rounded-full"></div>
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Quick Actions */}
            <div className="flex justify-center space-x-4 mt-6 pt-4 border-t border-gray-200">
              <motion.button
                type="button"
                onClick={() => {
                  const today = new Date()
                  if (!isDateDisabled(today)) {
                    handleDateSelect(today)
                  }
                }}
                className="text-sm text-dubai-gold hover:text-dubai-gold-dark font-medium transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                Today
              </motion.button>
              <motion.button
                type="button"
                onClick={() => {
                  setSelectedDate(null)
                  onChange?.('')
                  setIsOpen(false)
                }}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                Clear
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CustomDatePicker
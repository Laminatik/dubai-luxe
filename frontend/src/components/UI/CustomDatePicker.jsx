import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

const CustomDatePicker = ({ 
  value, 
  onChange, 
  placeholder = "Select date", 
  minDate, 
  maxDate,
  className = "",
  error = false,
  hideExternalLabel = false,
  isInModal = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef(null)
  const dropdownRef = useRef(null)

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  // ИСПРАВЛЕНО: Улучшенная детекция мобильных устройств
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value))
      setCurrentMonth(new Date(value))
    }
  }, [value])

  // ИСПРАВЛЕНО: Улучшенное позиционирование для модальных окон
  const calculateDropdownPosition = useCallback(() => {
    if (!containerRef.current || !isOpen) return {}

    const rect = containerRef.current.getBoundingClientRect()
    
    // ИСПРАВЛЕНО: Определяем контейнер (модальное окно или viewport)
    let boundary
    if (isInModal) {
      // Ищем ближайший модальный контейнер
      const modal = containerRef.current.closest('[role="dialog"], .modal, [data-modal]')
      boundary = modal ? modal.getBoundingClientRect() : {
        top: 0,
        left: 0,
        bottom: window.innerHeight,
        right: window.innerWidth,
        width: window.innerWidth,
        height: window.innerHeight
      }
    } else {
      boundary = {
        top: 0,
        left: 0,
        bottom: window.innerHeight,
        right: window.innerWidth,
        width: window.innerWidth,
        height: window.innerHeight
      }
    }

    // ИСПРАВЛЕНО: Адаптивные размеры календаря
    const calendarHeight = isMobile ? 320 : 360
    const calendarWidth = isMobile ? Math.min(300, boundary.width - 32) : Math.min(380, rect.width)
    
    const spaceBelow = boundary.bottom - rect.bottom - 16
    const spaceAbove = rect.top - boundary.top - 16
    
    let top = rect.bottom + 8
    let left = rect.left
    
    // ИСПРАВЛЕНО: Проверяем, помещается ли календарь снизу
    if (spaceBelow < calendarHeight && spaceAbove > spaceBelow && spaceAbove >= 280) {
      // Показываем сверху
      top = rect.top - calendarHeight - 8
    }
    
    // ИСПРАВЛЕНО: Проверяем горизонтальные границы
    if (left + calendarWidth > boundary.right - 16) {
      left = boundary.right - calendarWidth - 16
    }
    if (left < boundary.left + 16) {
      left = boundary.left + 16
    }

    return {
      position: 'fixed',
      top: `${Math.max(boundary.top + 16, top)}px`,
      left: `${left}px`,
      width: `${calendarWidth}px`,
      maxHeight: `${Math.min(calendarHeight, Math.max(spaceBelow, spaceAbove) - 16)}px`,
      zIndex: isInModal ? 10001 : 9999
    }
  }, [isOpen, isMobile, isInModal])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    // ИСПРАВЛЕНО: Улучшенный обработчик скролла для модальных окон
    const handleScroll = (event) => {
      if (!isOpen) return
      
      // Если мы в модальном окне, проверяем скролл модала
      if (isInModal) {
        const modal = containerRef.current?.closest('[role="dialog"], .modal, [data-modal]')
        if (modal && modal.contains(event.target)) {
          // Скролл внутри модала - не закрываем календарь
          return
        }
      }
      
      // Закрываем календарь при скролле страницы
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      window.addEventListener('scroll', handleScroll, true)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isOpen, isInModal])

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
  const dropdownStyle = calculateDropdownPosition()

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Input Field */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 luxury-glass text-left flex items-center justify-between ${
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

      {/* ИСПРАВЛЕНО: Calendar Dropdown с портал для модальных окон */}
      <AnimatePresence>
        {isOpen && (
          <>
            {isInModal ? (
              // В модальном окне используем портал
              document.body && createPortal(
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={dropdownStyle}
                  className="luxury-card rounded-3xl shadow-luxury border border-dubai-gold/20 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CalendarContent 
                    {...{
                      currentMonth,
                      months,
                      navigateMonth,
                      weekdays,
                      days,
                      selectedDate,
                      isDateDisabled,
                      isDateSelected,
                      handleDateSelect,
                      setSelectedDate,
                      setIsOpen,
                      onChange,
                      isMobile
                    }}
                  />
                </motion.div>,
                document.body
              )
            ) : (
              // Обычное позиционирование
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute top-full left-0 right-0 mt-2 z-50 luxury-card rounded-3xl shadow-luxury border border-dubai-gold/20 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <CalendarContent 
                  {...{
                    currentMonth,
                    months,
                    navigateMonth,
                    weekdays,
                    days,
                    selectedDate,
                    isDateDisabled,
                    isDateSelected,
                    handleDateSelect,
                    setSelectedDate,
                    setIsOpen,
                    onChange,
                    isMobile
                  }}
                />
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ИСПРАВЛЕНО: Выделенный компонент календаря для переиспользования
const CalendarContent = ({
  currentMonth,
  months,
  navigateMonth,
  weekdays,
  days,
  selectedDate,
  isDateDisabled,
  isDateSelected,
  handleDateSelect,
  setSelectedDate,
  setIsOpen,
  onChange,
  isMobile
}) => {
  return (
    <div className={`bg-white rounded-3xl ${isMobile ? 'p-4' : 'p-6'} w-full`}>
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
          <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-playfair font-semibold text-gray-800`}>
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
          <div key={day} className={`text-center ${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-500 py-2`}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className={`grid grid-cols-7 ${isMobile ? 'gap-1' : 'gap-1'} mb-4`}>
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
                relative ${isMobile ? 'h-8 w-full text-xs' : 'h-10 w-full text-sm'} rounded-xl font-medium transition-all duration-200
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
      <div className="flex justify-center space-x-4 pt-4 border-t border-gray-200">
        <motion.button
          type="button"
          onClick={() => {
            const today = new Date()
            if (!isDateDisabled(today)) {
              handleDateSelect(today)
            }
          }}
          className={`${isMobile ? 'text-xs' : 'text-sm'} text-dubai-gold hover:text-dubai-gold-dark font-medium transition-colors duration-300`}
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
          className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 hover:text-gray-700 font-medium transition-colors duration-300`}
          whileHover={{ scale: 1.05 }}
        >
          Clear
        </motion.button>
      </div>
    </div>
  )
}

export default CustomDatePicker
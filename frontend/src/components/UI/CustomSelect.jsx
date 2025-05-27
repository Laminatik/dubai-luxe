import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

const CustomSelect = ({ 
  value = '', 
  onChange, 
  options = [], 
  placeholder = "Select option",
  className = "",
  label = ""
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(
    options.find(opt => opt.value === value) || null
  )
  const [dropdownStyle, setDropdownStyle] = useState({})
  const containerRef = useRef(null)
  const dropdownRef = useRef(null)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    setSelectedOption(options.find(opt => opt.value === value) || null)
  }, [value, options])

  const calculateDropdownPosition = useCallback(() => {
    if (!containerRef.current || !isOpen) return

    const rect = containerRef.current.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    // Проверяем видимость элемента
    if (rect.bottom < -50 || rect.top > viewport.height + 50) {
      setIsOpen(false)
      return
    }

    const dropdownMaxHeight = 280 // Увеличено для лучшего UX
    const spaceBelow = viewport.height - rect.bottom - 16
    const spaceAbove = rect.top - 16

    let top = rect.bottom + 8
    let actualMaxHeight = dropdownMaxHeight

    // Определяем позицию: сверху или снизу
    if (spaceBelow < 180 && spaceAbove > spaceBelow) {
      actualMaxHeight = Math.min(dropdownMaxHeight, spaceAbove - 8)
      top = rect.top - actualMaxHeight - 8
    } else {
      actualMaxHeight = Math.min(dropdownMaxHeight, spaceBelow - 8)
    }

    // Минимальная высота
    if (actualMaxHeight < 120) {
      setIsOpen(false)
      return
    }

    let left = rect.left
    const dropdownWidth = rect.width

    // Проверяем горизонтальные границы
    if (left + dropdownWidth > viewport.width - 16) {
      left = viewport.width - dropdownWidth - 16
    }
    if (left < 16) {
      left = 16
    }

    setDropdownStyle({
      position: 'fixed',
      top: `${Math.max(16, top)}px`,
      left: `${left}px`,
      width: `${dropdownWidth}px`,
      maxHeight: `${actualMaxHeight}px`,
      zIndex: 9999 // Высокий z-index
    })
  }, [isOpen])

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

    // ИСПРАВЛЕН: Обработчик скролла только для закрытия при scroll вне dropdown
    const handleWindowScroll = (e) => {
      if (isOpen && !dropdownRef.current?.contains(e.target)) {
        // Закрываем только при скролле страницы, не внутри dropdown
        requestAnimationFrame(calculateDropdownPosition)
      }
    }

    const handleResize = () => {
      if (isOpen) {
        calculateDropdownPosition()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      window.addEventListener('scroll', handleWindowScroll, true)
      window.addEventListener('resize', handleResize)
      
      // Рассчитываем позицию
      requestAnimationFrame(calculateDropdownPosition)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('scroll', handleWindowScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [isOpen, calculateDropdownPosition])

  const handleSelect = (option) => {
    setSelectedOption(option)
    onChange?.(option.value)
    setIsOpen(false)
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  // ИСПРАВЛЕН: Dropdown Portal Component с правильной прокруткой
  const DropdownPortal = () => {
    if (!isOpen) return null

    return createPortal(
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ 
          duration: 0.15, 
          ease: [0.25, 0.1, 0.25, 1.0]
        }}
        style={dropdownStyle}
        className="bg-white rounded-2xl border border-dubai-gold/30 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >        
        {/* ИСПРАВЛЕН: Options Container с правильным скроллингом */}
        <div 
          ref={scrollContainerRef}
          className="relative overflow-y-auto overflow-x-hidden bg-white rounded-2xl"
          style={{ 
            maxHeight: 'inherit',
            // КЛЮЧЕВЫЕ ИСПРАВЛЕНИЯ для скролла:
            scrollbarWidth: 'thin',
            scrollbarColor: '#C9A351 rgba(245, 245, 245, 0.3)'
          }}
          // ИСПРАВЛЕНО: Предотвращаем всплытие scroll событий
          onWheel={(e) => {
            e.stopPropagation()
            // Разрешаем нативный скролл внутри dropdown
          }}
          onScroll={(e) => {
            e.stopPropagation()
            // Разрешаем нативный скролл внутри dropdown
          }}
        >
          {options.map((option, index) => (
            <motion.button
              key={option.value}
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleSelect(option)
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              className={`w-full px-6 py-4 text-left transition-all duration-200 border-none bg-transparent cursor-pointer group ${
                selectedOption?.value === option.value
                  ? 'bg-dubai-gold/10 text-dubai-gold font-semibold border-l-4 border-dubai-gold'
                  : 'text-gray-700 hover:bg-dubai-gold/5 hover:text-dubai-gold'
              } ${index === 0 ? 'rounded-t-2xl' : ''} ${index === options.length - 1 ? 'rounded-b-2xl' : ''}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.1, 
                delay: index * 0.02,
                ease: "easeOut"
              }}
              whileHover={{ x: 2 }}
              style={{ 
                minHeight: '56px', 
                display: 'flex', 
                alignItems: 'center',
                outline: 'none',
                userSelect: 'none'
              }}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-base leading-tight pr-3 relative overflow-hidden flex-1">
                  {/* ИСПРАВЛЕНО: Плавный fade-out вместо троеточий */}
                  <span className="block relative">
                    {option.label}
                    <div className="absolute top-0 right-0 bottom-0 w-6 bg-gradient-to-l from-white via-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </span>
                </span>
                {selectedOption?.value === option.value && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.15, delay: 0.05 }}
                    className="flex-shrink-0"
                  >
                    <svg className="w-4 h-4 text-dubai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* ИСПРАВЛЕН: Custom Scrollbar Styles */}
        <style jsx>{`
          .overflow-y-auto::-webkit-scrollbar {
            width: 6px;
          }
          .overflow-y-auto::-webkit-scrollbar-track {
            background: rgba(245, 245, 245, 0.3);
            border-radius: 6px;
          }
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #C9A351, #E8C168);
            border-radius: 6px;
            transition: all 0.3s ease;
          }
          .overflow-y-auto::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #a9862f, #C9A351);
            box-shadow: 0 2px 8px rgba(201,163,81,0.4);
          }
        `}</style>
      </motion.div>,
      document.body
    )
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide">
          {label}
        </label>
      )}
      
      {/* ИСПРАВЛЕН: Select Button с плавным fade-out для длинного текста */}
      <motion.button
        type="button"
        onClick={toggleDropdown}
        className={`w-full luxury-glass px-6 py-4 rounded-2xl border-2 border-dubai-gold/20 focus:ring-2 focus:ring-dubai-gold focus:border-dubai-gold transition-all duration-300 bg-white/90 backdrop-blur-sm text-left flex items-center justify-between hover:border-dubai-gold/40 focus:outline-none group ${
          isOpen ? 'border-dubai-gold ring-2 ring-dubai-gold' : ''
        } ${className}`}
        whileTap={{ scale: 0.98 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <span className={`${
          selectedOption ? 'text-gray-800 font-medium' : 'text-gray-500'
        } pr-2 text-base leading-tight relative overflow-hidden flex-1`}>
          <span className="block relative">
            {selectedOption ? selectedOption.label : placeholder}
            {/* ИСПРАВЛЕНО: Плавный fade-out эффект для кнопки */}
            <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white/90 via-white/70 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </span>
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex-shrink-0 ml-2"
        >
          <svg className="w-5 h-5 text-dubai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.button>

      {/* Dropdown Portal */}
      <AnimatePresence>
        <DropdownPortal />
      </AnimatePresence>
    </div>
  )
}

export default CustomSelect
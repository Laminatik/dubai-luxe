import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

const PriceRangeSlider = ({ 
  value = [0, 5000], 
  onChange, 
  min = 0, 
  max = 5000, 
  step = 100,
  label = "Price Range",
  className = "" 
}) => {
  // ИСПРАВЛЕНО: Убрали setState во время рендера, используем useEffect для синхронизации
  const [localValue, setLocalValue] = useState(value)
  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState({ min: false, max: false })
  const [dropdownStyle, setDropdownStyle] = useState({})
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef(null)
  const dropdownRef = useRef(null)
  const sliderRef = useRef(null)

  // ИСПРАВЛЕНО: Детекция мобильных устройств
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // ИСПРАВЛЕНО: Используем useEffect для синхронизации props с локальным состоянием
  useEffect(() => {
    // Синхронизируем только если значения действительно изменились
    if (value[0] !== localValue[0] || value[1] !== localValue[1]) {
      setLocalValue(value)
    }
  }, [value]) // Убрали localValue из зависимостей чтобы избежать лишних обновлений

  const formatPrice = useCallback((price) => {
    if (price >= max) return `$${(price / 1000).toFixed(0)}K+`
    return `$${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}K`
  }, [max])

  const formatDisplayRange = useMemo(() => {
    if (localValue[0] === min && localValue[1] === max) {
      return "Any Price"
    }
    return `${formatPrice(localValue[0])} — ${formatPrice(localValue[1])}`
  }, [localValue, min, max, formatPrice])

  const calculatePercentage = useCallback((val) => ((val - min) / (max - min)) * 100, [min, max])

  // ИСПРАВЛЕНО: Адаптивные размеры dropdown в зависимости от устройства
  const calculateDropdownPosition = useCallback(() => {
    if (!containerRef.current || !isOpen) return

    const rect = containerRef.current.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    // ИСПРАВЛЕНО: Адаптивная максимальная высота
    const dropdownMaxHeight = isMobile ? 225 : 290
    const dropdownMinHeight = isMobile ? 200 : 260
    
    // ИСПРАВЛЕНО: Более мягкая проверка видимости
    if (rect.bottom < -100 || rect.top > viewport.height + 100) {
      return // Не закрываем сразу, просто не пересчитываем
    }

    const spaceBelow = viewport.height - rect.bottom - 16
    const spaceAbove = rect.top - 16

    let top = rect.bottom + 8
    let actualMaxHeight = dropdownMaxHeight

    // Определяем оптимальную позицию
    if (spaceBelow < dropdownMinHeight && spaceAbove > spaceBelow && spaceAbove >= dropdownMinHeight) {
      // Показываем сверху если снизу мало места, но сверху достаточно
      actualMaxHeight = Math.min(dropdownMaxHeight, spaceAbove - 8)
      top = rect.top - actualMaxHeight - 8
    } else if (spaceBelow >= dropdownMinHeight) {
      // Показываем снизу если достаточно места
      actualMaxHeight = Math.min(dropdownMaxHeight, spaceBelow - 8)
    } else {
      // ИСПРАВЛЕНО: Используем доступное пространство с учетом адаптивных размеров
      if (spaceBelow > spaceAbove) {
        actualMaxHeight = Math.max(dropdownMinHeight, Math.min(dropdownMaxHeight, spaceBelow - 8))
      } else {
        actualMaxHeight = Math.max(dropdownMinHeight, Math.min(dropdownMaxHeight, spaceAbove - 8))
        top = rect.top - actualMaxHeight - 8
      }
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
      height: `${actualMaxHeight}px`,
      zIndex: 9999
    })
  }, [isOpen, isMobile])

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

    const handleWindowScroll = (e) => {
      if (isOpen && !dropdownRef.current?.contains(e.target)) {
        // ИСПРАВЛЕНО: Debounce для плавности
        const timeoutId = setTimeout(() => {
          calculateDropdownPosition()
        }, 10)
        return () => clearTimeout(timeoutId)
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
      
      requestAnimationFrame(calculateDropdownPosition)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('scroll', handleWindowScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [isOpen, calculateDropdownPosition])

  // ИСПРАВЛЕНО: Оптимизированный onChange без лишних вызовов
  const handleValueChange = useCallback((newValue) => {
    setLocalValue(newValue)
    onChange?.(newValue)
  }, [onChange])

  const handleMouseDown = useCallback((e, thumb) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(prev => ({ ...prev, [thumb]: true }))
    
    const handleMouseMove = (moveEvent) => {
      if (!sliderRef.current) return

      const rect = sliderRef.current.getBoundingClientRect()
      const percentage = Math.max(0, Math.min(100, ((moveEvent.clientX - rect.left) / rect.width) * 100))
      const newValue = Math.round((percentage / 100) * (max - min) + min)
      const snappedValue = Math.round(newValue / step) * step

      setLocalValue(prev => {
        let newRange
        if (thumb === 'min') {
          newRange = [Math.min(snappedValue, prev[1] - step), prev[1]]
        } else {
          newRange = [prev[0], Math.max(snappedValue, prev[0] + step)]
        }
        return newRange
      })
    }

    const handleMouseUp = () => {
      setIsDragging(prev => {
        const newDragging = { ...prev, [thumb]: false }
        // Вызываем onChange по завершении drag
        if (!newDragging.min && !newDragging.max) {
          onChange?.(localValue)
        }
        return newDragging
      })
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [localValue, max, min, step, onChange])

  const handleTouchStart = useCallback((e, thumb) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(prev => ({ ...prev, [thumb]: true }))
    
    const handleTouchMove = (moveEvent) => {
      if (!sliderRef.current || !moveEvent.touches[0]) return

      const touch = moveEvent.touches[0]
      const rect = sliderRef.current.getBoundingClientRect()
      const percentage = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100))
      const newValue = Math.round((percentage / 100) * (max - min) + min)
      const snappedValue = Math.round(newValue / step) * step

      setLocalValue(prev => {
        let newRange
        if (thumb === 'min') {
          newRange = [Math.min(snappedValue, prev[1] - step), prev[1]]
        } else {
          newRange = [prev[0], Math.max(snappedValue, prev[0] + step)]
        }
        return newRange
      })
    }

    const handleTouchEnd = () => {
      setIsDragging(prev => {
        const newDragging = { ...prev, [thumb]: false }
        if (!newDragging.min && !newDragging.max) {
          onChange?.(localValue)
        }
        return newDragging
      })
      document.removeEventListener('touchmove', handleTouchMove, { passive: false })
      document.removeEventListener('touchend', handleTouchEnd)
    }

    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
  }, [localValue, max, min, step, onChange])

  const resetToDefault = useCallback(() => {
    const defaultRange = [min, max]
    handleValueChange(defaultRange)
  }, [min, max, handleValueChange])

  const minPercentage = calculatePercentage(localValue[0])
  const maxPercentage = calculatePercentage(localValue[1])

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const handleInputChange = useCallback((type, value) => {
    const numValue = parseInt(value) || (type === 'min' ? min : max)
    let newRange
    
    if (type === 'min') {
      newRange = [Math.max(min, Math.min(numValue, localValue[1] - step)), localValue[1]]
    } else {
      newRange = [localValue[0], Math.min(max, Math.max(numValue, localValue[0] + step))]
    }
    
    handleValueChange(newRange)
  }, [localValue, min, max, step, handleValueChange])

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide">
          {label}
        </label>
      )}
      
      <motion.button
        type="button"
        onClick={toggleDropdown}
        className={`w-full luxury-glass px-6 py-4 rounded-2xl border-2 border-dubai-gold/20 focus:ring-2 focus:ring-dubai-gold focus:border-dubai-gold transition-all duration-300 bg-white/90 backdrop-blur-sm text-left flex items-center justify-between hover:border-dubai-gold/40 focus:outline-none group ${
          isOpen ? 'border-dubai-gold ring-2 ring-dubai-gold' : ''
        } ${className}`}
        whileTap={{ scale: 0.98 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <span className="text-gray-800 font-medium pr-2 text-base leading-tight relative overflow-hidden flex-1">
          <span className="block relative">
            {formatDisplayRange}
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

      <AnimatePresence>
        {isOpen && (
          <div>
            {createPortal(
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
                className="bg-white rounded-2xl border border-dubai-gold/30 overflow-hidden shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >        
                {/* ИСПРАВЛЕНО: Оптимизированная структура с flex для точного контроля высоты */}
                <div className="flex flex-col h-full">
                  {/* Header - фиксированная высота */}
                  <div className={`flex-shrink-0 flex items-center justify-between border-b border-gray-100 ${
                    isMobile ? 'px-4 py-3' : 'px-6 py-4'
                  }`}>
                    <h4 className={`font-semibold text-gray-800 ${isMobile ? 'text-base' : 'text-lg'}`}>
                      Price Range
                    </h4>
                    <button
                      onClick={resetToDefault}
                      className="text-xs text-gray-500 hover:text-dubai-gold transition-colors duration-200 uppercase tracking-wider font-medium"
                    >
                      Reset
                    </button>
                  </div>

                  {/* Content - гибкая высота */}
                  <div className={`flex-1 flex flex-col ${isMobile ? 'px-4 py-3' : 'px-6 py-4'}`}>
                    {/* Current Values Display */}
                    <div className={`flex items-center justify-center space-x-3 ${isMobile ? 'mb-3' : 'mb-4'}`}>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">From</div>
                        <div className={`font-bold text-dubai-gold ${isMobile ? 'text-base' : 'text-lg'}`}>
                          {formatPrice(localValue[0])}
                        </div>
                      </div>
                      <div className={`h-px bg-gradient-to-r from-dubai-gold/30 via-dubai-gold to-dubai-gold/30 ${
                        isMobile ? 'w-4' : 'w-6'
                      }`}></div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">To</div>
                        <div className={`font-bold text-dubai-gold ${isMobile ? 'text-base' : 'text-lg'}`}>
                          {formatPrice(localValue[1])}
                        </div>
                      </div>
                    </div>

                    {/* Main Slider */}
                    <div className={`flex-1 flex flex-col justify-center ${isMobile ? 'mb-3' : 'mb-4'}`}>
                      <div className="relative mb-3">
                        {/* Background Track */}
                        <div 
                          ref={sliderRef}
                          className="relative h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full cursor-pointer"
                          style={{ touchAction: 'none' }}
                        >
                          {/* Active Range */}
                          <div
                            className="absolute h-full bg-gradient-to-r from-dubai-gold to-dubai-gold-light rounded-full shadow-lg transition-all duration-150"
                            style={{
                              left: `${minPercentage}%`,
                              width: `${maxPercentage - minPercentage}%`
                            }}
                          />

                          {/* Min Thumb */}
                          <div
                            className={`absolute top-1/2 w-5 h-5 -mt-2.5 cursor-grab active:cursor-grabbing select-none transition-transform duration-150 ${
                              isDragging.min ? 'scale-110' : 'hover:scale-105'
                            }`}
                            style={{ 
                              left: `${minPercentage}%`, 
                              marginLeft: '-10px',
                              touchAction: 'none'
                            }}
                            onMouseDown={(e) => handleMouseDown(e, 'min')}
                            onTouchStart={(e) => handleTouchStart(e, 'min')}
                          >
                            <div 
                              className="w-full h-full bg-white border-2 border-dubai-gold shadow-lg"
                              style={{ borderRadius: '50%' }}
                            >
                              <div 
                                className="w-1.5 h-1.5 bg-dubai-gold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                style={{ borderRadius: '50%' }}
                              ></div>
                            </div>
                          </div>

                          {/* Max Thumb */}
                          <div
                            className={`absolute top-1/2 w-5 h-5 -mt-2.5 cursor-grab active:cursor-grabbing select-none transition-transform duration-150 ${
                              isDragging.max ? 'scale-110' : 'hover:scale-105'
                            }`}
                            style={{ 
                              left: `${maxPercentage}%`, 
                              marginLeft: '-10px',
                              touchAction: 'none'
                            }}
                            onMouseDown={(e) => handleMouseDown(e, 'max')}
                            onTouchStart={(e) => handleTouchStart(e, 'max')}
                          >
                            <div 
                              className="w-full h-full bg-white border-2 border-dubai-gold shadow-lg"
                              style={{ borderRadius: '50%' }}
                            >
                              <div 
                                className="w-1.5 h-1.5 bg-dubai-gold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                style={{ borderRadius: '50%' }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Range Labels */}
                        <div className="flex justify-between mt-2 text-xs text-gray-400">
                          <span>{formatPrice(min)}</span>
                          {!isMobile && <span>{formatPrice(Math.floor(max * 0.5))}</span>}
                          <span>{formatPrice(max)}+</span>
                        </div>
                      </div>
                    </div>

                    {/* Manual Inputs - фиксированная высота */}
                    <div className="flex-shrink-0 border-t border-gray-200 pt-3">
                      <div className={`grid grid-cols-2 ${isMobile ? 'gap-2' : 'gap-3'}`}>
                        <div>
                          <label className={`block text-xs font-medium text-gray-600 ${isMobile ? 'mb-1' : 'mb-2'}`}>
                            From ($)
                          </label>
                          <input
                            type="number"
                            value={localValue[0]}
                            onChange={(e) => handleInputChange('min', e.target.value)}
                            className={`w-full py-2 text-sm border border-dubai-gold/20 rounded-lg focus:border-dubai-gold focus:ring-1 focus:ring-dubai-gold focus:outline-none transition-colors duration-200 ${
                              isMobile ? 'px-2' : 'px-3'
                            }`}
                            min={min}
                            max={localValue[1] - step}
                            step={step}
                            placeholder="Min"
                          />
                        </div>
                        
                        <div>
                          <label className={`block text-xs font-medium text-gray-600 ${isMobile ? 'mb-1' : 'mb-2'}`}>
                            To ($)
                          </label>
                          <input
                            type="number"
                            value={localValue[1]}
                            onChange={(e) => handleInputChange('max', e.target.value)}
                            className={`w-full py-2 text-sm border border-dubai-gold/20 rounded-lg focus:border-dubai-gold focus:ring-1 focus:ring-dubai-gold focus:outline-none transition-colors duration-200 ${
                              isMobile ? 'px-2' : 'px-3'
                            }`}
                            min={localValue[0] + step}
                            max={max}
                            step={step}
                            placeholder="Max"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>,
              document.body
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PriceRangeSlider
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const PriceRangeSlider = ({ 
  value = [0, 5000], 
  onChange, 
  min = 0, 
  max = 5000, 
  step = 100,
  label = "Price Range",
  className = "" 
}) => {
  const [localValue, setLocalValue] = useState(value)
  const [isDragging, setIsDragging] = useState({ min: false, max: false })
  const sliderRef = useRef(null)
  const minThumbRef = useRef(null)
  const maxThumbRef = useRef(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const formatPrice = (price) => {
    if (price >= max) return `$${(price / 1000).toFixed(0)}K+`
    return `$${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}K`
  }

  const calculatePercentage = (val) => ((val - min) / (max - min)) * 100

  const handleMouseDown = (e, thumb) => {
    e.preventDefault()
    setIsDragging({ ...isDragging, [thumb]: true })
    
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
        onChange?.(newRange)
        return newRange
      })
    }

    const handleMouseUp = () => {
      setIsDragging({ min: false, max: false })
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleTouchStart = (e, thumb) => {
    e.preventDefault()
    setIsDragging({ ...isDragging, [thumb]: true })
    
    const handleTouchMove = (moveEvent) => {
      if (!sliderRef.current) return

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
        onChange?.(newRange)
        return newRange
      })
    }

    const handleTouchEnd = () => {
      setIsDragging({ min: false, max: false })
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }

    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)
  }

  const minPercentage = calculatePercentage(localValue[0])
  const maxPercentage = calculatePercentage(localValue[1])

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide">
          {label}
        </label>
      )}
      
      {/* Price Display */}
      <div className="flex justify-between items-center mb-6">
        <motion.div 
          className="luxury-glass px-4 py-2 rounded-full border border-dubai-gold/30"
          animate={{ 
            scale: isDragging.min ? 1.05 : 1,
            borderColor: isDragging.min ? 'rgba(201,163,81,0.6)' : 'rgba(201,163,81,0.3)'
          }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-sm font-semibold text-dubai-gold">
            {formatPrice(localValue[0])}
          </span>
        </motion.div>
        
        <div className="flex-1 mx-4 flex items-center justify-center">
          <div className="h-px bg-gradient-to-r from-dubai-gold/30 via-dubai-gold/60 to-dubai-gold/30 w-full max-w-16"></div>
        </div>
        
        <motion.div 
          className="luxury-glass px-4 py-2 rounded-full border border-dubai-gold/30"
          animate={{ 
            scale: isDragging.max ? 1.05 : 1,
            borderColor: isDragging.max ? 'rgba(201,163,81,0.6)' : 'rgba(201,163,81,0.3)'
          }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-sm font-semibold text-dubai-gold">
            {formatPrice(localValue[1])}
          </span>
        </motion.div>
      </div>

      {/* Slider Container */}
      <div className="relative">
        {/* Background Track */}
        <div 
          ref={sliderRef}
          className="relative h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full cursor-pointer"
        >
          {/* Active Range */}
          <motion.div
            className="absolute h-full bg-gradient-to-r from-dubai-gold to-dubai-gold-light rounded-full shadow-lg"
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`
            }}
            animate={{
              boxShadow: (isDragging.min || isDragging.max) 
                ? '0 4px 20px rgba(201,163,81,0.4), 0 0 0 4px rgba(201,163,81,0.1)'
                : '0 2px 8px rgba(201,163,81,0.2)'
            }}
            transition={{ duration: 0.2 }}
          />

          {/* Min Thumb */}
          <motion.div
            ref={minThumbRef}
            className="absolute top-1/2 w-6 h-6 -mt-3 cursor-grab active:cursor-grabbing"
            style={{ left: `${minPercentage}%`, marginLeft: '-12px' }}
            onMouseDown={(e) => handleMouseDown(e, 'min')}
            onTouchStart={(e) => handleTouchStart(e, 'min')}
            animate={{
              scale: isDragging.min ? 1.2 : 1,
              boxShadow: isDragging.min 
                ? '0 8px 25px rgba(201,163,81,0.4), 0 0 0 6px rgba(201,163,81,0.1)'
                : '0 4px 12px rgba(0,0,0,0.15)'
            }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-full h-full bg-gradient-to-br from-white to-gray-100 border-3 border-dubai-gold rounded-full shadow-luxury flex items-center justify-center">
              <div className="w-2 h-2 bg-dubai-gold rounded-full"></div>
            </div>
          </motion.div>

          {/* Max Thumb */}
          <motion.div
            ref={maxThumbRef}
            className="absolute top-1/2 w-6 h-6 -mt-3 cursor-grab active:cursor-grabbing"
            style={{ left: `${maxPercentage}%`, marginLeft: '-12px' }}
            onMouseDown={(e) => handleMouseDown(e, 'max')}
            onTouchStart={(e) => handleTouchStart(e, 'max')}
            animate={{
              scale: isDragging.max ? 1.2 : 1,
              boxShadow: isDragging.max 
                ? '0 8px 25px rgba(201,163,81,0.4), 0 0 0 6px rgba(201,163,81,0.1)'
                : '0 4px 12px rgba(0,0,0,0.15)'
            }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-full h-full bg-gradient-to-br from-white to-gray-100 border-3 border-dubai-gold rounded-full shadow-luxury flex items-center justify-center">
              <div className="w-2 h-2 bg-dubai-gold rounded-full"></div>
            </div>
          </motion.div>

          {/* Tick Marks */}
          <div className="absolute top-full mt-2 w-full">
            <div className="flex justify-between text-xs text-gray-500">
              <span>${(min / 1000).toFixed(0)}K</span>
              <span>${(max / 4000).toFixed(0)}K</span>
              <span>${(max / 2000).toFixed(0)}K</span>
              <span>${(max / 1000).toFixed(0)}K+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Value Inputs */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">Minimum</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
            <input
              type="number"
              value={localValue[0]}
              onChange={(e) => {
                const newMin = Math.max(min, Math.min(parseInt(e.target.value) || min, localValue[1] - step))
                const newRange = [newMin, localValue[1]]
                setLocalValue(newRange)
                onChange?.(newRange)
              }}
              className="w-full pl-8 pr-4 py-2 text-sm border border-dubai-gold/20 rounded-xl focus:border-dubai-gold focus:ring-1 focus:ring-dubai-gold focus:outline-none transition-colors duration-200"
              min={min}
              max={localValue[1] - step}
              step={step}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">Maximum</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
            <input
              type="number"
              value={localValue[1]}
              onChange={(e) => {
                const newMax = Math.min(max, Math.max(parseInt(e.target.value) || max, localValue[0] + step))
                const newRange = [localValue[0], newMax]
                setLocalValue(newRange)
                onChange?.(newRange)
              }}
              className="w-full pl-8 pr-4 py-2 text-sm border border-dubai-gold/20 rounded-xl focus:border-dubai-gold focus:ring-1 focus:ring-dubai-gold focus:outline-none transition-colors duration-200"
              min={localValue[0] + step}
              max={max}
              step={step}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PriceRangeSlider
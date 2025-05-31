import { useState } from 'react'
import { motion } from 'framer-motion'

const LuxuryIcon = ({ 
  name, 
  size = 'md', 
  className = '', 
  fallback = null,
  alt = '',
  ...props 
}) => {
  const [imageError, setImageError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Size mappings for different contexts
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6', 
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
    '3xl': 'w-24 h-24',
    hero: 'w-16 h-16 sm:w-20 sm:h-20',
    stats: 'w-12 h-12 sm:w-16 sm:h-16'
  }

  // Icon mapping for emoji to PNG conversion
  const iconMap = {
    // Emoji to icon mappings
    '🏛️': 'temple.png',
    '⭐': 'star.png', 
    '👑': 'crown.png',
    '🎩': 'hat.png',
    '💎': 'diamond.png',
    '🎭': 'mask.png',
    '🗝️': 'key.png',
    '✨': 'innovation.png',
    // Direct name mappings
    'temple': 'temple.png',
    'temple2': 'temple2.png',
    'star': 'star.png',
    'crown': 'crown.png', 
    'hat': 'hat.png',
    'diamond': 'diamond.png',
    'mask': 'mask.png',
    'key': 'key.png',
    'innovation': 'innovation.png'
  }

  const iconFileName = iconMap[name] || name
  const iconPath = `/icons/${iconFileName}`

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setIsLoaded(true)
  }

  // If image failed to load, show fallback or emoji
  if (imageError) {
    if (fallback) {
      return fallback
    }
    // Return original emoji if it was passed as name
    if (name && /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(name)) {
      return (
        <span className={`${sizeClasses[size]} flex items-center justify-center text-2xl ${className}`} {...props}>
          {name}
        </span>
      )
    }
    return null
  }

  return (
    <div className={`${sizeClasses[size]} relative ${className}`} {...props}>
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-dubai-gold/10 rounded-full animate-pulse flex items-center justify-center">
          <div className="w-1/2 h-1/2 bg-dubai-gold/20 rounded-full"></div>
        </div>
      )}
      
      {/* Actual image */}
      <motion.img
        src={iconPath}
        alt={alt || `${name} icon`}
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0, 
          scale: isLoaded ? 1 : 0.8 
        }}
        transition={{ duration: 0.3 }}
        // Optimization attributes
        decoding="async"
        fetchPriority="low"
      />
    </div>
  )
}

export default LuxuryIcon
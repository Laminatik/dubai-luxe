import { motion } from 'framer-motion'
import { ButtonSpinner } from './LoadingSpinner'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon = null,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 relative overflow-hidden'

  const variantClasses = {
    primary: 'btn-luxury-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
    secondary: 'btn-luxury-secondary disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent disabled:hover:text-gray-400',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 disabled:opacity-50 px-6 py-3 rounded-2xl',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 disabled:opacity-50 px-6 py-3 rounded-2xl',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg hover:shadow-xl disabled:bg-gray-400 px-6 py-3 rounded-2xl transform hover:scale-105 hover:-translate-y-1',
    gold: 'bg-gradient-to-r from-dubai-gold to-dubai-gold-light text-white hover:from-dubai-gold-dark hover:to-dubai-gold shadow-luxury hover:shadow-luxury-hover disabled:opacity-50 px-6 py-3 rounded-2xl transform hover:scale-105 hover:-translate-y-1'
  }

  const sizeClasses = {
    sm: variant.includes('luxury') ? 'px-6 py-2 text-sm' : 'px-4 py-2 text-sm',
    md: variant.includes('luxury') ? 'px-8 py-3 text-base' : 'px-6 py-3 text-base',
    lg: variant.includes('luxury') ? 'px-10 py-4 text-lg' : 'px-8 py-4 text-lg',
    xl: variant.includes('luxury') ? 'px-12 py-5 text-xl' : 'px-10 py-5 text-xl'
  }

  const widthClass = fullWidth ? 'w-full' : ''

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${variant.includes('luxury') ? '' : sizeClasses[size]}
    ${widthClass}
    ${disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim()

  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e)
    }
  }

  return (
    <motion.button
      type={type}
      className={combinedClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {/* Shimmer Effect for Primary/Gold variants */}
      {(variant === 'primary' || variant === 'gold') && !disabled && !loading && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
        </div>
      )}
      
      {loading && (
        <div className="mr-3">
          <ButtonSpinner 
            size={size === 'sm' ? 'sm' : size === 'lg' || size === 'xl' ? 'md' : 'sm'}
          />
        </div>
      )}
      
      {icon && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

// Specialized Luxury Button Components
export const GoldButton = (props) => (
  <Button {...props} variant="gold" />
)

export const LuxuryPrimaryButton = (props) => (
  <Button {...props} variant="primary" />
)

export const LuxurySecondaryButton = (props) => (
  <Button {...props} variant="secondary" />
)

// Icon Button Component
export const IconButton = ({ 
  icon, 
  size = 'md', 
  variant = 'ghost', 
  className = '', 
  ...props 
}) => {
  const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  return (
    <motion.button
      className={`
        ${iconSizeClasses[size]} 
        rounded-full 
        flex items-center justify-center 
        transition-all duration-300 
        ${variant === 'ghost' ? 'hover:bg-gray-100 text-gray-600 hover:text-gray-800' : ''}
        ${variant === 'luxury' ? 'luxury-glass border border-gray-200/50 hover:bg-gray-100 text-gray-600 hover:text-dubai-gold' : ''}
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {icon}
    </motion.button>
  )
}

export default Button
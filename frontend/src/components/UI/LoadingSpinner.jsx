import { motion } from 'framer-motion'

const LoadingSpinner = ({ size = 'md', color = 'dubai-gold', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const colorClasses = {
    'dubai-gold': 'text-dubai-gold',
    'white': 'text-white',
    'gray': 'text-gray-600',
    'black': 'text-black'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} ${colorClasses[color]} relative`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        {/* Outer Ring */}
        <div className="absolute inset-0 border-2 border-current border-t-transparent rounded-full opacity-100"></div>
        
        {/* Middle Ring */}
        <motion.div
          className="absolute inset-1 border border-current border-r-transparent rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        ></motion.div>
        
        {/* Inner Dot */}
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-current rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </motion.div>
    </div>
  )
}

// Luxury Full Page Loading Spinner
export const LuxuryPageSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center premium-section-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-radial from-dubai-gold/5 to-transparent rounded-full animate-luxury-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-radial from-dubai-gold/3 to-transparent rounded-full animate-luxury-pulse"></div>
      </div>

      <div className="relative text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-dubai-gold to-dubai-gold-light flex items-center justify-center mx-auto shadow-luxury mb-6">
            <span className="text-white font-bold text-2xl">DL</span>
          </div>
          <h2 className="text-3xl font-playfair font-bold">
            Dubai <span className="gold-gradient-text">Luxe</span>
          </h2>
        </motion.div>

        {/* Premium Spinner */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <div className="relative w-20 h-20 mx-auto">
            {/* Outer Ring */}
            <motion.div
              className="absolute inset-0 border-4 border-dubai-gold/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-dubai-gold rounded-full transform -translate-x-1/2 -translate-y-1"></div>
            </motion.div>
            
            {/* Middle Ring */}
            <motion.div
              className="absolute inset-2 border-2 border-dubai-gold/50 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-dubai-gold rounded-full transform -translate-x-1/2 -translate-y-0.5"></div>
            </motion.div>
            
            {/* Inner Ring */}
            <motion.div
              className="absolute inset-4 border border-dubai-gold rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 w-1 h-1 bg-dubai-gold rounded-full transform -translate-x-1/2 -translate-y-0.5"></div>
            </motion.div>
            
            {/* Center Pulse */}
            <motion.div
              className="absolute inset-6 bg-dubai-gold/20 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            ></motion.div>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-xl text-gray-700 font-medium mb-2">{message}</p>
          <p className="text-sm text-gray-500">Curating your luxury experience</p>
        </motion.div>

        {/* Loading Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex justify-center space-x-2 mt-8"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-dubai-gold/60 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// Compact Card Loading Spinner
export const CardSpinner = ({ size = 'md', message = '' }) => {
  return (
    <div className="luxury-card rounded-2xl p-8 text-center">
      <div className="relative mb-4">
        <LoadingSpinner size={size} />
      </div>
      {message && (
        <p className="text-gray-600 font-medium">{message}</p>
      )}
    </div>
  )
}

// Button Loading Spinner
export const ButtonSpinner = ({ size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} relative`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <div className="absolute inset-0 border-2 border-current border-t-transparent rounded-full"></div>
    </motion.div>
  )
}

export default LoadingSpinner
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Modal = ({ isOpen, onClose, title, children, size = 'lg' }) => {
  useEffect(() => {
    if (isOpen) {
      // ИСПРАВЛЕНО: Сохраняем текущую позицию скролла
      const scrollY = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.left = '0'
      document.body.style.right = '0'
    } else {
      // ИСПРАВЛЕНО: Восстанавливаем позицию скролла
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.left = ''
      document.body.style.right = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }

    return () => {
      // Cleanup на всякий случай
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.left = ''
      document.body.style.right = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const sizeClasses = {
    sm: 'w-full max-w-md',
    md: 'w-full max-w-lg',
    lg: 'w-full max-w-2xl',
    xl: 'w-full max-w-4xl',
    full: 'w-[95vw] max-w-[95vw] max-h-[95vh]'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        // ИСПРАВЛЕНО: Правильный z-index для модального окна
        <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 9999 }}>
          {/* Premium Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)',
              zIndex: 9999
            }}
          />

          {/* ИСПРАВЛЕН: Modal Container с контролем overflow */}
          <div 
            className="fixed inset-0 flex items-center justify-center p-2 sm:p-4"
            style={{ 
              zIndex: 10000,
              overflow: 'hidden' // ИСПРАВЛЕНО: предотвращаем overflow
            }}
          >
            <div className="w-full h-full flex items-center justify-center min-h-full py-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ 
                  duration: 0.3,
                  type: "spring",
                  damping: 25,
                  stiffness: 500
                }}
                className={`${sizeClasses[size]} bg-white rounded-3xl shadow-luxury overflow-hidden max-h-[90vh] flex flex-col mx-2 sm:mx-4 relative`}
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: size === 'xl' ? 'min(56rem, 90vw)' : undefined,
                  width: '100%',
                  // ИСПРАВЛЕНО: Строгий контроль размеров
                  boxSizing: 'border-box'
                }}
              >
                {/* Decorative Top Border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-dubai-gold to-transparent"></div>
                
                {/* Header */}
                {title && (
                  <div className="relative px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-100 flex-shrink-0 bg-white overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 pr-4">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-semibold text-gray-900 mb-2 break-words leading-tight">
                          {title}
                        </h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-dubai-gold to-dubai-gold-light rounded-full"></div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="luxury-glass p-2 sm:p-3 rounded-full hover:bg-gray-100 transition-all duration-300 border border-gray-200/50 flex-shrink-0"
                        aria-label="Close modal"
                      >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 hover:text-gray-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* ИСПРАВЛЕН: Content с правильным overflow контролем */}
                <div className={`${title ? 'p-4 sm:p-6 lg:p-8' : 'p-4 sm:p-6 lg:p-10'} flex-1 bg-white relative`}
                     style={{
                       overflow: 'hidden', // ИСПРАВЛЕНО: предотвращаем overflow на уровне контейнера
                       maxHeight: title ? 'calc(90vh - 120px)' : 'calc(90vh - 80px)'
                     }}>
                  {/* Background Decoration */}
                  <div className="absolute top-0 right-0 w-24 sm:w-32 lg:w-40 h-24 sm:h-32 lg:h-40 bg-gradient-to-br from-dubai-gold/5 to-transparent rounded-full -mr-12 sm:-mr-16 lg:-mr-20 -mt-12 sm:-mt-16 lg:-mt-20 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-20 sm:w-24 lg:w-32 h-20 sm:h-24 lg:h-32 bg-gradient-to-tr from-dubai-gold/3 to-transparent rounded-full -ml-10 sm:-ml-12 lg:-ml-16 -mb-10 sm:-mb-12 lg:-mb-16 pointer-events-none"></div>
                  
                  {/* ИСПРАВЛЕН: Content Container с внутренним скроллом */}
                  <div 
                    className="relative z-10 w-full h-full overflow-y-auto custom-scrollbar"
                    style={{
                      // ИСПРАВЛЕНО: Строгий контроль размеров внутреннего контента
                      maxWidth: '100%',
                      maxHeight: '100%',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div className="w-full max-w-full break-words">
                      {children}
                    </div>
                  </div>
                </div>

                {/* Close button for modals without title */}
                {!title && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="absolute top-2 sm:top-4 right-2 sm:right-4 luxury-glass p-2 sm:p-3 rounded-full hover:bg-gray-100 transition-all duration-300 z-20 border border-gray-200/50"
                    aria-label="Close modal"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 hover:text-gray-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                )}

                {/* Luxury Corner Accents */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-dubai-gold/30 rounded-tl-lg pointer-events-none"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-dubai-gold/30 rounded-tr-lg pointer-events-none"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-2 border-b-2 border-dubai-gold/30 rounded-bl-lg pointer-events-none"></div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-dubai-gold/30 rounded-br-lg pointer-events-none"></div>
              </motion.div>
            </div>
          </div>

          {/* Keyboard Navigation Hint */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
            className="fixed bottom-4 sm:bottom-8 left-4 sm:left-8 luxury-glass px-3 sm:px-4 py-2 rounded-full border border-white/20 hidden sm:block"
            style={{ zIndex: 10001 }}
          >
            <div className="flex items-center space-x-2 text-white text-sm">
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono">ESC</kbd>
              <span>Close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Modal
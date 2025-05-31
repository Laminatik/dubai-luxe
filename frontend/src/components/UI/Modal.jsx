import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Modal = ({ isOpen, onClose, title, children, size = 'lg' }) => {
  useEffect(() => {
    if (isOpen) {
      // ИСПРАВЛЕНО: Улучшенная система блокировки скролла с предотвращением горизонтального скролла
      const scrollY = window.scrollY
      const body = document.body
      const html = document.documentElement
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      
      // Сохраняем оригинальные стили
      const originalStyles = {
        bodyOverflow: body.style.overflow,
        bodyOverflowX: body.style.overflowX,
        bodyOverflowY: body.style.overflowY,
        bodyPosition: body.style.position,
        bodyTop: body.style.top,
        bodyLeft: body.style.left,
        bodyRight: body.style.right,
        bodyWidth: body.style.width,
        bodyPaddingRight: body.style.paddingRight,
        htmlOverflowX: html.style.overflowX
      }
      
      // КРИТИЧНО: Блокируем горизонтальный скролл на всех уровнях
      html.style.overflowX = 'hidden'
      body.style.overflow = 'hidden'
      body.style.overflowX = 'hidden'
      body.style.overflowY = 'hidden'
      body.style.position = 'fixed'
      body.style.top = `-${scrollY}px`
      body.style.left = '0'
      body.style.right = '0'
      body.style.width = '100%'
      body.style.paddingRight = `${scrollbarWidth}px`
      
      // Сохраняем данные для восстановления
      body.dataset.scrollY = scrollY.toString()
      body.dataset.originalStyles = JSON.stringify(originalStyles)
    } else {
      // ИСПРАВЛЕНО: Плавное восстановление позиции скролла
      const body = document.body
      const html = document.documentElement
      const scrollY = parseInt(body.dataset.scrollY || '0')
      const originalStyles = JSON.parse(body.dataset.originalStyles || '{}')
      
      // Восстанавливаем стили
      html.style.overflowX = originalStyles.htmlOverflowX || ''
      body.style.overflow = originalStyles.bodyOverflow || ''
      body.style.overflowX = originalStyles.bodyOverflowX || ''
      body.style.overflowY = originalStyles.bodyOverflowY || ''
      body.style.position = originalStyles.bodyPosition || ''
      body.style.top = originalStyles.bodyTop || ''
      body.style.left = originalStyles.bodyLeft || ''
      body.style.right = originalStyles.bodyRight || ''
      body.style.width = originalStyles.bodyWidth || ''
      body.style.paddingRight = originalStyles.bodyPaddingRight || ''
      
      // Плавно возвращаемся к позиции скролла
      if (scrollY > 0) {
        // Используем smooth скролл вместо мгновенного прыжка
        window.scrollTo({
          top: scrollY,
          left: 0,
          behavior: 'smooth'
        })
      }
      
      // Очищаем временные данные
      delete body.dataset.scrollY
      delete body.dataset.originalStyles
    }

    return () => {
      // Cleanup на всякий случай
      const body = document.body
      const html = document.documentElement
      if (body.dataset.scrollY) {
        const scrollY = parseInt(body.dataset.scrollY || '0')
        const originalStyles = JSON.parse(body.dataset.originalStyles || '{}')
        
        html.style.overflowX = originalStyles.htmlOverflowX || ''
        body.style.overflow = originalStyles.bodyOverflow || ''
        body.style.overflowX = originalStyles.bodyOverflowX || ''
        body.style.overflowY = originalStyles.bodyOverflowY || ''
        body.style.position = originalStyles.bodyPosition || ''
        body.style.top = originalStyles.bodyTop || ''
        body.style.left = originalStyles.bodyLeft || ''
        body.style.right = originalStyles.bodyRight || ''
        body.style.width = originalStyles.bodyWidth || ''
        body.style.paddingRight = originalStyles.bodyPaddingRight || ''
        
        if (scrollY > 0) {
          window.scrollTo({
            top: scrollY,
            left: 0,
            behavior: 'smooth'
          })
        }
        
        delete body.dataset.scrollY
        delete body.dataset.originalStyles
      }
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

  // ИСПРАВЛЕНО: Безопасные размеры без горизонтального overflow
  const sizeClasses = {
    sm: 'w-full max-w-[90vw] sm:max-w-md',
    md: 'w-full max-w-[90vw] sm:max-w-lg',
    lg: 'w-full max-w-[90vw] sm:max-w-2xl',
    xl: 'w-full max-w-[90vw] sm:max-w-4xl',
    full: 'w-[90vw] max-w-[90vw] max-h-[90vh]'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        // ИСПРАВЛЕНО: Правильный z-index и блокировка горизонтального скролла
        <div 
          className="fixed inset-0"
          style={{ 
            zIndex: 9999,
            // КРИТИЧНО: Блокируем любой overflow на уровне модального контейнера
            overflow: 'hidden',
            width: '100vw',
            height: '100vh',
            maxWidth: '100vw',
            maxHeight: '100vh'
          }}
        >
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
              zIndex: 9999,
              width: '100vw',
              height: '100vh',
              overflow: 'hidden'
            }}
          />

          {/* ИСПРАВЛЕН: Modal Container с безопасными размерами */}
          <div 
            className="fixed inset-0 flex items-center justify-center"
            style={{ 
              zIndex: 10000,
              padding: 'clamp(0.5rem, 2vw, 1rem)', // Адаптивный padding
              width: '100vw',
              height: '100vh',
              maxWidth: '100vw',
              maxHeight: '100vh',
              overflow: 'hidden', // КРИТИЧНО: Блокируем overflow
              boxSizing: 'border-box'
            }}
          >
            {/* ИСПРАВЛЕНО: Scrollable wrapper с безопасными размерами */}
            <div 
              className="w-full h-full flex items-center justify-center overflow-y-auto overflow-x-hidden custom-scrollbar"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                boxSizing: 'border-box'
              }}
            >
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
                className={`${sizeClasses[size]} bg-white rounded-3xl shadow-luxury my-4 relative`}
                onClick={(e) => e.stopPropagation()}
                style={{
                  // КРИТИЧНО: Строгий контроль размеров
                  maxWidth: size === 'xl' ? 'min(56rem, 90vw)' : 
                           size === 'lg' ? 'min(32rem, 90vw)' :
                           size === 'md' ? 'min(28rem, 90vw)' :
                           size === 'sm' ? 'min(24rem, 90vw)' : '90vw',
                  width: '100%',
                  maxHeight: '90vh',
                  minHeight: 'auto',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden' // КРИТИЧНО: Блокируем overflow на уровне модала
                }}
              >
                {/* Decorative Top Border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-dubai-gold to-transparent"></div>
                
                {/* Header */}
                {title && (
                  <div className="relative px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-100 flex-shrink-0 bg-white overflow-hidden rounded-t-3xl">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 pr-4">
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-playfair font-semibold text-gray-900 mb-2 break-words leading-tight">
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

                {/* ИСПРАВЛЕН: Content с безопасным скроллом */}
                <div 
                  className={`${title ? 'p-4 sm:p-6' : 'p-4 sm:p-6'} flex-1 bg-white relative overflow-y-auto overflow-x-hidden custom-scrollbar`}
                  style={{
                    minHeight: 0, // Позволяет flex-item сжиматься
                    maxHeight: 'none', // Убираем строгое ограничение высоты
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  {/* Background Decoration */}
                  <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-br from-dubai-gold/5 to-transparent rounded-full -mr-10 sm:-mr-16 -mt-10 sm:-mt-16 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-tr from-dubai-gold/3 to-transparent rounded-full -ml-8 sm:-ml-12 -mb-8 sm:-mb-12 pointer-events-none"></div>
                  
                  {/* ИСПРАВЛЕН: Content Container с безопасными размерами */}
                  <div 
                    className="relative z-10 w-full"
                    style={{
                      maxWidth: '100%',
                      boxSizing: 'border-box',
                      overflow: 'visible' // Позволяем контенту быть видимым, но контролируем размеры
                    }}
                  >
                    {/* ОБЕРТКА для безопасности контента */}
                    <div 
                      className="w-full"
                      style={{
                        maxWidth: '100%',
                        overflow: 'hidden', // Скрываем любой горизонтальный overflow контента
                        boxSizing: 'border-box',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                      }}
                    >
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
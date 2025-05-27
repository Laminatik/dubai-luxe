import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ApartmentGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return
      
      if (e.key === 'Escape') {
        setIsLightboxOpen(false)
      } else if (e.key === 'ArrowLeft') {
        prevImage()
      } else if (e.key === 'ArrowRight') {
        nextImage()
      }
    }

    if (isLightboxOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isLightboxOpen])

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  const openLightbox = (index) => {
    setSelectedImage(index)
    setIsLightboxOpen(true)
  }

  return (
    <>
      {/* Main Gallery */}
      <div className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden bg-black">
        <div 
          className="flex transition-transform duration-700 ease-out h-full"
          style={{ transform: `translateX(-${selectedImage * 100}%)` }}
        >
          {images.map((image, index) => (
            <div 
              key={index}
              className="min-w-full h-full relative cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image}
                alt={`Luxury apartment view ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Hover Overlay - скрыт на мобильном */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hidden sm:flex">
                <div className="luxury-glass rounded-2xl p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 border border-white/20">
                  <div className="flex items-center space-x-3 text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    <span className="font-medium">View Full Size</span>
                  </div>
                </div>
              </div>

              {/* Mobile Tap Indicator */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 sm:hidden pointer-events-none">
                <div className="bg-black/40 backdrop-blur-sm rounded-full p-3 border border-white/20">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevImage}
              className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 luxury-glass rounded-full p-3 sm:p-4 shadow-luxury transition-all duration-300 hover:bg-white/20 border border-white/20 group"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-dubai-gold transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextImage}
              className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 luxury-glass rounded-full p-3 sm:p-4 shadow-luxury transition-all duration-300 hover:bg-white/20 border border-white/20 group"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-dubai-gold transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 luxury-glass px-3 sm:px-4 py-2 rounded-full border border-white/20">
          <span className="text-white font-medium text-sm">
            {selectedImage + 1} of {images.length}
          </span>
        </div>

        {/* Image Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  selectedImage === index 
                    ? 'bg-dubai-gold shadow-lg scale-125' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="bg-black/95 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex space-x-3 sm:space-x-4 overflow-x-auto custom-scrollbar pb-2">
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-12 sm:w-24 sm:h-16 md:w-32 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index 
                      ? 'border-dubai-gold shadow-luxury scale-105' 
                      : 'border-white/20 hover:border-dubai-gold/50 hover:shadow-lg'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Premium Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-full max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedImage]}
                alt={`Full view ${selectedImage + 1}`}
                className="max-w-full max-h-[90vh] sm:max-h-[85vh] object-contain rounded-xl sm:rounded-2xl shadow-luxury"
              />

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 luxury-glass rounded-full p-2 sm:p-3 transition-colors duration-300 hover:bg-white/20 border border-white/20"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Navigation in Lightbox */}
              {images.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 luxury-glass rounded-full p-3 sm:p-4 transition-colors duration-300 hover:bg-white/20 border border-white/20"
                  >
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 luxury-glass rounded-full p-3 sm:p-4 transition-colors duration-300 hover:bg-white/20 border border-white/20"
                  >
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </>
              )}

              {/* Image Counter in Lightbox */}
              <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 luxury-glass px-3 sm:px-6 py-2 sm:py-3 rounded-full border border-white/20">
                <span className="text-white font-medium text-sm sm:text-base">
                  {selectedImage + 1} of {images.length}
                </span>
              </div>

              {/* Premium Gallery Info - только на десктопе */}
              {!isMobile && (
                <div className="absolute top-4 left-4 luxury-glass px-4 py-2 rounded-full border border-white/20">
                  <span className="text-white text-sm font-medium">
                    Premium Gallery View
                  </span>
                </div>
              )}
            </motion.div>

            {/* Keyboard Navigation Hint - только на десктопе */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-8 left-8 luxury-glass px-4 py-2 rounded-full border border-white/20"
              >
                <div className="flex items-center space-x-4 text-white text-sm">
                  <div className="flex items-center space-x-1">
                    <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono">←</kbd>
                    <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono">→</kbd>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono">ESC</kbd>
                    <span>Close</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Mobile Close Hint - переработанная */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.2 }}
                className="absolute top-4 left-4 luxury-glass px-3 py-1 rounded-full border border-white/20"
              >
                <span className="text-white text-xs">Tap outside to close</span>
              </motion.div>
            )}

            {/* Мобильная подсказка - теперь ПОД фоткой */}
            {isMobile && images.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="absolute bottom-20 sm:bottom-24 left-1/2 transform -translate-x-1/2 luxury-glass px-4 py-2 rounded-full border border-white/20"
              >
                <div className="flex items-center space-x-2 text-white text-xs">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18M17 8l4 4m0 0l-4 4" />
                  </svg>
                  <span>Swipe or use arrows</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ApartmentGallery
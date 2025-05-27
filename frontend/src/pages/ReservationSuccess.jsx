import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const ReservationSuccess = () => {
  // Принудительная прокрутка вверх при загрузке страницы
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    }
    
    // Немедленная прокрутка
    scrollToTop()
    
    // Дополнительная прокрутка через небольшую задержку
    const timeoutId = setTimeout(scrollToTop, 100)
    
    return () => clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    // Create premium confetti effect (только если библиотека доступна)
    const duration = 4 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    if (typeof window !== 'undefined' && window.confetti) {
      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // Create luxury confetti burst
        window.confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#C9A351', '#E8C168', '#FFFFFF', '#F5F5F5']
        })
        window.confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#C9A351', '#E8C168', '#FFFFFF', '#F5F5F5']
        })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen premium-section-bg flex items-center justify-center py-16 sm:py-20 px-4 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-radial from-dubai-gold/10 to-transparent rounded-full animate-luxury-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-radial from-dubai-gold/5 to-transparent rounded-full animate-luxury-pulse"></div>
        <div className="absolute top-20 right-20 w-24 sm:w-32 h-24 sm:h-32 border border-dublin-gold/20 rotate-45 animate-float hide-mobile"></div>
        <div className="absolute bottom-32 left-32 w-16 sm:w-24 h-16 sm:h-24 border border-dubai-gold/30 rotate-12 animate-float hide-mobile"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative w-full">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
        >
          {/* Success Icon */}
          <motion.div 
            className="relative mx-auto mb-8 sm:mb-12"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-24 sm:w-32 h-24 sm:h-32 luxury-card rounded-full flex items-center justify-center mx-auto shadow-luxury relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-dubai-gold to-dubai-gold-light"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <motion.svg 
                className="w-12 sm:w-16 h-12 sm:h-16 text-white relative z-10" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <motion.path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </div>
            {/* Ripple effect */}
            <div className="absolute inset-0 w-24 sm:w-32 h-24 sm:h-32 mx-auto rounded-full border-4 border-dubai-gold/30 animate-ping"></div>
            <div className="absolute inset-0 w-32 sm:w-40 h-32 sm:h-40 mx-auto -m-4 rounded-full border-2 border-dubai-gold/20 animate-ping" style={{animationDelay: '300ms'}}></div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-playfair font-bold mb-6 sm:mb-8 text-shadow-luxury responsive-heading">
              <span className="gold-gradient-text">Thank You!</span>
            </h1>
            <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-dubai-gold to-transparent mx-auto mb-8 sm:mb-10"></div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="space-y-4 sm:space-y-6 text-gray-700 mb-8 sm:mb-12 px-4"
          >
            <p className="text-xl sm:text-2xl md:text-3xl font-light leading-relaxed responsive-text">
              Your luxury reservation request has been <strong className="text-dubai-gold">successfully submitted</strong>.
            </p>
            <p className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto responsive-text">
              Our distinguished concierge team will contact you within <strong>24 hours</strong> to 
              confirm your booking and arrange any bespoke accommodations for your Dubai experience.
            </p>
          </motion.div>

          {/* Process Steps */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="luxury-card rounded-3xl p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-br from-dubai-gold/10 to-transparent rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20"></div>
            <h3 className="text-xl sm:text-2xl font-playfair font-semibold mb-6 sm:mb-8 gold-gradient-text responsive-subheading">
              What Happens Next?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  step: '01',
                  title: 'Personal Concierge Review',
                  description: 'Dedicated luxury specialist reviews your preferences and confirms availability',
                  icon: '👨‍💼'
                },
                {
                  step: '02', 
                  title: 'Bespoke Welcome Package',
                  description: 'Customized arrival experience with premium amenities and local recommendations',
                  icon: '🎁'
                },
                {
                  step: '03',
                  title: '24/7 Elite Support',
                  description: 'Continuous concierge assistance throughout your entire Dubai experience',
                  icon: '🏆'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                  className="text-center relative"
                >
                  <div className="luxury-glass rounded-2xl p-4 sm:p-6 hover:transform hover:-translate-y-2 transition-all duration-500 border border-dubai-gold/20">
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 filter hover:scale-110 transition-transform duration-500">
                      {item.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 sm:w-8 h-6 sm:h-8 bg-dubai-gold rounded-full flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm font-bold">{item.step}</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-playfair font-semibold mb-2 sm:mb-3 text-gray-800 responsive-text">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed responsive-text">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4"
          >
            <Link 
              to="/apartments" 
              className="btn-luxury-secondary text-base sm:text-lg px-8 sm:px-12 py-4 w-full sm:w-auto text-center"
            >
              Explore More Properties
            </Link>
            <Link 
              to="/" 
              className="btn-luxury-primary text-base sm:text-lg px-8 sm:px-12 py-4 w-full sm:w-auto text-center"
            >
              Return to Home
            </Link>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="luxury-card rounded-3xl p-6 sm:p-8 bg-black text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
            <div className="absolute top-0 left-0 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-br from-dubai-gold/10 to-transparent rounded-full -ml-16 sm:-ml-20 -mt-16 sm:-mt-20"></div>
            <div className="relative">
              <h4 className="text-lg sm:text-xl font-playfair font-semibold mb-4 sm:mb-6 gold-gradient-text responsive-subheading">
                Need Immediate Assistance?
              </h4>
              <p className="text-gray-300 mb-6 sm:mb-8 leading-relaxed responsive-text">
                Our luxury concierge team is available around the clock to ensure your experience exceeds expectations.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full luxury-glass mx-auto mb-3 flex items-center justify-center border border-white/20">
                    <svg className="w-5 sm:w-6 h-5 sm:h-6 text-dubai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-dubai-gold font-semibold text-sm">Email</div>
                  <div className="text-gray-300 text-sm break-words">concierge@dubailuxe.com</div>
                </div>
                
                <div className="text-center">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full luxury-glass mx-auto mb-3 flex items-center justify-center border border-white/20">
                    <svg className="w-5 sm:w-6 h-5 sm:h-6 text-dubai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="text-dubai-gold font-semibold text-sm">Phone</div>
                  <div className="text-gray-300 text-sm">+971 4 123 4567</div>
                </div>
                
                <div className="text-center">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full luxury-glass mx-auto mb-3 flex items-center justify-center border border-white/20">
                    <svg className="w-5 sm:w-6 h-5 sm:h-6 text-dubai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="text-dubai-gold font-semibold text-sm">Live Chat</div>
                  <div className="text-gray-300 text-sm">24/7 Available</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Animation Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden hide-mobile">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 sm:w-2 h-1 sm:h-2 bg-dubai-gold/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
            }}
            animate={{
              y: -100,
              rotate: 360,
            }}
            transition={{
              duration: Math.random() * 4 + 6,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default ReservationSuccess
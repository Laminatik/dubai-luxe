import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isOnLightBackground, setIsOnLightBackground] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20
      setIsScrolled(scrolled)
      
      // Улучшенная логика определения светлого фона
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      
      // Определяем светлый фон в зависимости от страницы и позиции скролла
      let isOnLight = false
      
      if (location.pathname === '/apartments') {
        // На странице апартаментов - после героя всегда светлый фон
        isOnLight = scrollPosition > windowHeight * 0.4
      } else if (location.pathname === '/about') {
        // На странице о нас - светлые секции через одну
        const sectionHeight = windowHeight * 0.8
        const currentSection = Math.floor(scrollPosition / sectionHeight)
        isOnLight = currentSection % 2 === 1 // нечетные секции светлые
      } else if (location.pathname === '/') {
        // На главной - после героя светлый фон
        isOnLight = scrollPosition > windowHeight * 0.9
      } else if (location.pathname.startsWith('/apartments/')) {
        // На странице деталей апартамента - всегда светлый после галереи
        isOnLight = scrollPosition > 400
      }
      
      setIsOnLightBackground(isOnLight)
    }
    
    window.addEventListener('scroll', handleScroll)
    // Вызываем сразу для начальной установки
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname])

  // НОВОЕ: Закрываем мобильное меню при изменении маршрута
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // НОВОЕ: Предотвращаем скролл body когда открыто мобильное меню
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/apartments', label: 'Collection' },
    { path: '/about', label: 'Heritage' }
  ]

  const getNavbarStyles = () => {
    if (isScrolled) {
      if (isOnLightBackground) {
        return 'bg-white/95 backdrop-blur-md shadow-luxury border-b border-gray-100'
      }
      return 'luxury-glass border-b border-white/10 shadow-luxury'
    }
    return 'bg-transparent'
  }

  const getTextColor = () => {
    if (isScrolled && isOnLightBackground) {
      return 'text-gray-800'
    }
    return 'text-white'
  }

  const getLogoTextColor = () => {
    if (isScrolled && isOnLightBackground) {
      return 'text-gray-900'
    }
    return 'text-white'
  }

  const getMobileButtonColor = () => {
    if (isScrolled && isOnLightBackground) {
      return 'border-gray-200 text-gray-700 hover:text-dubai-gold'
    }
    return 'border-white/20 text-white hover:text-dubai-gold'
  }

  return (
    // ИСПРАВЛЕНО: Используем Tailwind z-index класс вместо inline стилей
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-navigation transition-all duration-500 ${getNavbarStyles()}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group" onClick={() => setIsMobileMenuOpen(false)}>
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gradient-to-br from-dubai-gold to-dubai-gold-dark flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg sm:text-xl">DL</span>
              </div>
              <div className="absolute -inset-2 rounded-full border border-dubai-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
            <div className={`text-2xl sm:text-3xl font-playfair font-bold transition-colors duration-500 ${getLogoTextColor()}`}>
              <span className={isScrolled && isOnLightBackground ? 'text-gray-900' : 'text-white'}>Dubai</span>{' '}
              <span className="gold-gradient-text">Luxe</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative font-medium tracking-wide transition-all duration-500 hover:text-dubai-gold ${
                  location.pathname === item.path 
                    ? 'text-dubai-gold' 
                    : getTextColor()
                }`}
                style={{
                  textShadow: (isScrolled && isOnLightBackground) ? 'none' : '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                {item.label}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-dubai-gold to-dubai-gold-light rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link 
              to="/apartments" 
              className="btn-luxury-primary text-sm px-6 sm:px-8 py-3"
            >
              Explore
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden relative w-10 sm:w-12 h-10 sm:h-12 rounded-full luxury-glass flex items-center justify-center transition-all duration-300 hover:scale-105 border ${getMobileButtonColor()}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <motion.div
              animate={isMobileMenuOpen ? "open" : "closed"}
              className="w-5 sm:w-6 h-5 sm:h-6 relative"
            >
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0, opacity: 1 },
                  open: { rotate: 45, y: 6, opacity: 1 }
                }}
                className="absolute w-5 sm:w-6 h-0.5 bg-current transform origin-center transition-all duration-300 rounded-full"
                style={{ top: '6px' }}
              />
              <motion.span
                variants={{
                  closed: { opacity: 1 },
                  open: { opacity: 0 }
                }}
                className="absolute w-5 sm:w-6 h-0.5 bg-current rounded-full"
                style={{ top: '12px' }}
              />
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0, opacity: 1 },
                  open: { rotate: -45, y: -6, opacity: 1 }
                }}
                className="absolute w-5 sm:w-6 h-0.5 bg-current transform origin-center transition-all duration-300 rounded-full"
                style={{ top: '18px' }}
              />
            </motion.div>
          </button>
        </div>

        {/* ИСПРАВЛЕНО: Mobile Menu с Tailwind z-index классами */}
        <motion.div
          initial={false}
          animate={isMobileMenuOpen ? "open" : "closed"}
          variants={{
            open: { opacity: 1, height: "auto", y: 0 },
            closed: { opacity: 0, height: 0, y: -20 }
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="md:hidden overflow-hidden z-elevated"
        >
          <motion.div 
            className="luxury-card rounded-3xl mt-4 p-6 sm:p-8 border border-dubai-gold/20 shadow-luxury mx-4 overflow-hidden"
            variants={{
              open: { scale: 1, opacity: 1 },
              closed: { scale: 0.95, opacity: 0 }
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isMobileMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`block py-4 px-6 rounded-2xl font-medium text-base sm:text-lg tracking-wide transition-all duration-300 overflow-hidden ${
                      location.pathname === item.path
                        ? 'text-dubai-gold bg-dubai-gold/10 border-2 border-dubai-gold/20 shadow-sm'
                        : 'text-gray-700 hover:text-dubai-gold hover:bg-dubai-gold/5'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="font-medium break-words">{item.label}</span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isMobileMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="pt-6 border-t border-dubai-gold/20"
              >
                <Link 
                  to="/apartments" 
                  className="btn-luxury-primary w-full text-center text-base sm:text-lg px-8 py-4 overflow-hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ boxSizing: 'border-box' }}
                >
                  Explore Collection
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* НОВОЕ: Mobile Menu Backdrop с Tailwind z-index */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-sticky"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </motion.nav>
  )
}

export default Header
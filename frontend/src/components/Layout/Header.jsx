import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { createPortal } from 'react-dom'

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

  // Закрываем мобильное меню при изменении маршрута
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // ИСПРАВЛЕНО: Правильная блокировка скролла без влияния на fixed элементы
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Получаем ширину scrollbar
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      
      // Блокируем скролл и компенсируем scrollbar
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
      
      // Компенсируем scrollbar для fixed элементов
      const fixedElements = document.querySelectorAll('nav[style*="z-index"]')
      fixedElements.forEach(el => {
        el.style.paddingRight = `${scrollbarWidth}px`
      })
    } else {
      // Восстанавливаем скролл
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      
      // Убираем компенсацию для fixed элементов
      const fixedElements = document.querySelectorAll('nav[style*="z-index"]')
      fixedElements.forEach(el => {
        el.style.paddingRight = ''
      })
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
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

  // ИСПРАВЛЕНО: Backdrop как отдельный компонент через portal
  const MobileBackdrop = () => {
    if (!isMobileMenuOpen) return null
    
    return createPortal(
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden"
        style={{ 
          zIndex: 9998, // Очень высокий z-index чтобы покрыть все
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh'
        }}
        onClick={() => setIsMobileMenuOpen(false)}
      />,
      document.body
    )
  }

  // ИСПРАВЛЕНО: Mobile Menu через portal
  const MobileMenu = () => {
    if (!isMobileMenuOpen) return null

    return createPortal(
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed w-full md:hidden"
        style={{ 
          top: '80px', // Высота navbar
          zIndex: 9999, // Выше backdrop
          left: 0,
          right: 0
        }}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-black/95 backdrop-blur-xl rounded-3xl mx-4 p-6 sm:p-8 border-2 border-dubai-gold/40 shadow-2xl overflow-hidden relative"
        >
          {/* Декоративные элементы для темного фона */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-dubai-gold/20 to-transparent rounded-full -mr-12 -mt-12"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-dubai-gold/10 to-transparent rounded-full -ml-10 -mb-10"></div>
          
          <div className="space-y-2 relative z-10">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className={`block py-4 px-6 rounded-2xl font-medium text-lg tracking-wide transition-all duration-300 overflow-hidden ${
                    location.pathname === item.path
                      ? 'text-dubai-gold bg-dubai-gold/20 border-2 border-dubai-gold/50 shadow-lg font-semibold'
                      : 'text-white hover:text-dubai-gold hover:bg-dubai-gold/10 border-2 border-transparent font-medium'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="break-words relative z-10">{item.label}</span>
                </Link>
              </motion.div>
            ))}
            
            {/* CTA кнопка */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="pt-6 border-t-2 border-dubai-gold/30 relative"
            >
              <Link 
                to="/apartments" 
                className="block w-full text-center bg-gradient-to-r from-dubai-gold to-dubai-gold-light text-white font-bold text-lg px-8 py-4 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg border-2 border-dubai-gold/30 overflow-hidden relative"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10 font-semibold">Explore Collection</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>,
      document.body
    )
  }

  return (
    <>
      {/* ИСПРАВЛЕНО: Backdrop через portal */}
      <MobileBackdrop />

      {/* ИСПРАВЛЕНО: Navbar с упрощенным z-index */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full transition-all duration-500 ${getNavbarStyles()}`}
        style={{ 
          zIndex: 10000 // Максимальный z-index для navbar
        }}
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
              className={`md:hidden relative w-12 h-12 rounded-full luxury-glass flex items-center justify-center transition-all duration-300 hover:scale-105 border ${getMobileButtonColor()}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <div className="w-5 h-5 relative flex items-center justify-center">
                <motion.span
                  className="absolute w-5 h-0.5 bg-current rounded-full"
                  animate={{
                    rotate: isMobileMenuOpen ? 45 : 0,
                    y: isMobileMenuOpen ? 0 : -6,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ transformOrigin: 'center center' }}
                />
                <motion.span
                  className="absolute w-5 h-0.5 bg-current rounded-full"
                  animate={{
                    opacity: isMobileMenuOpen ? 0 : 1,
                    scale: isMobileMenuOpen ? 0.8 : 1,
                  }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                />
                <motion.span
                  className="absolute w-5 h-0.5 bg-current rounded-full"
                  animate={{
                    rotate: isMobileMenuOpen ? -45 : 0,
                    y: isMobileMenuOpen ? 0 : 6,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ transformOrigin: 'center center' }}
                />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ИСПРАВЛЕНО: Mobile Menu через portal */}
      <MobileMenu />
    </>
  )
}

export default Header
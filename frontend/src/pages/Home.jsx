import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import LuxuryIcon from '../components/UI/LuxuryIcon'

const Home = () => {
  const [apartments, setApartments] = useState([])
  const [heroRef, heroInView] = useInView({ threshold: 0.2, triggerOnce: true })
  const [featuredRef, featuredInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [experienceRef, experienceInView] = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    fetch('/api/apartments')
      .then(res => res.json())
      .then(data => setApartments(data.slice(0, 3)))
      .catch(err => console.error('Error fetching apartments:', err))
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 premium-hero"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/img/img1.png)' }}
        ></div>
        
        {/* ПЕРЕРАБОТАННЫЕ Elegant floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Главный орбитальный элемент */}
          <motion.div 
            className="absolute top-20 left-20 w-40 h-40 opacity-20 hidden sm:block"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 rounded-full border-2 border-dubai-gold/30 bg-gradient-radial from-dubai-gold/10 to-transparent"></div>
              <div className="absolute inset-4 rounded-full border border-dubai-gold/40 bg-dubai-gold/5 backdrop-blur-sm"></div>
              <motion.div 
                className="absolute inset-8 rounded-full bg-dubai-gold/15"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.7, 0.3] 
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut"
                }}
              ></motion.div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-dubai-gold/50 rounded-full"></div>
            </div>
          </motion.div>

          {/* Второй декоративный элемент */}
          <motion.div 
            className="absolute bottom-32 right-32 w-32 h-32 opacity-15 hidden sm:block"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-conic from-dubai-gold/15 via-transparent to-dubai-gold/10 rounded-2xl rotate-12 backdrop-blur-sm border border-dubai-gold/20"></div>
              <motion.div 
                className="absolute inset-4 rounded-2xl bg-dubai-gold/8"
                animate={{ 
                  rotate: [0, 45, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut"
                }}
              ></motion.div>
              <div className="absolute top-2 right-2 w-3 h-3 bg-dubai-gold/40 rounded-full"></div>
            </div>
          </motion.div>

          {/* Плавающий элемент в центре */}
          <motion.div 
            className="absolute top-1/2 left-10 w-20 h-20 opacity-10"
            animate={{ 
              y: [-15, 15, -15],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity, 
              ease: "easeInOut"
            }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-dubai-gold/15 to-transparent border border-dubai-gold/25 backdrop-blur-sm"></div>
            <div className="absolute inset-3 rounded-full bg-dubai-gold/10"></div>
          </motion.div>

          {/* Мобильные версии */}
          <motion.div 
            className="absolute top-16 right-8 w-16 h-16 opacity-20 sm:hidden"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full rounded-full border border-dubai-gold/30 bg-dubai-gold/10"></div>
          </motion.div>

          <motion.div 
            className="absolute bottom-20 left-8 w-12 h-12 opacity-15 sm:hidden"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.15, 0.3, 0.15]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut"
            }}
          >
            <div className="w-full h-full rounded-full bg-dubai-gold/20"></div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={heroInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative z-10 text-center text-white max-w-6xl px-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={heroInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-playfair font-bold mb-6 premium-text-shadow">
              Dubai <span className="gold-gradient-text">Luxe</span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-dubai-gold to-transparent mx-auto mb-8"></div>
          </motion.div>
          
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={heroInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-lg sm:text-2xl md:text-3xl mb-12 font-light tracking-wider opacity-90 leading-relaxed px-4"
          >
            Where Opulence Meets the <span className="gold-gradient-text font-medium">Skyline</span>
          </motion.p>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={heroInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center px-4"
          >
            <Link to="/apartments" className="btn-luxury-primary text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-5 w-full sm:w-auto text-center">
              Discover Collection
            </Link>
            <Link to="/about" className="btn-luxury-secondary text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-5 w-full sm:w-auto text-center">
              Our Heritage
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-8 sm:mt-16 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-xs sm:text-sm tracking-widest opacity-70 px-4"
          >
            <span>ESTABLISHED 2020</span>
            <span className="hidden sm:inline">•</span>
            <span>LUXURY REDEFINED</span>
            <span className="hidden sm:inline">•</span>
            <span>DUBAI ELITE</span>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 text-white hidden sm:block"
        >
          <div className="flex flex-col items-center animate-bounce">
            <span className="text-xs tracking-widest mb-2 opacity-70">SCROLL</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Apartments */}
      <section ref={featuredRef} className="py-16 sm:py-32 premium-section-bg relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-radial from-dubai-gold/5 to-transparent rounded-full"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-radial from-dubai-gold/3 to-transparent rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={featuredInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-20"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={featuredInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span className="text-dubai-gold text-sm tracking-[0.3em] uppercase font-medium mb-4 block">
                Curated Excellence
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-playfair font-bold mb-6 text-shadow-luxury">
                Featured <span className="gold-gradient-text">Collection</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-dubai-gold to-transparent mx-auto mb-8"></div>
              <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed px-4">
                Handpicked residences that define the pinnacle of luxury living in Dubai's most prestigious districts
              </p>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            {apartments.map((apartment, index) => (
              <motion.div
                key={apartment.id}
                initial={{ y: 50, opacity: 0 }}
                animate={featuredInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="luxury-card rounded-2xl overflow-hidden group"
              >
                <div className="relative h-60 sm:h-80 overflow-hidden">
                  <img
                    src={apartment.coverImg}
                    alt={apartment.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-4 sm:top-6 right-4 sm:right-6 luxury-glass px-3 sm:px-4 py-2 rounded-full">
                    <span className="text-white font-semibold text-sm">
                      ${apartment.priceNight}/night
                    </span>
                  </div>
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                    <div className="text-xs tracking-widest opacity-70 mb-1">
                      {apartment.district.toUpperCase()}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-playfair font-semibold mb-3 group-hover:text-dubai-gold transition-colors duration-500">
                    {apartment.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed text-sm sm:text-base">
                    {apartment.shortDesc}
                  </p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-8 h-8 rounded-full bg-dubai-gold/10 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-dubai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        </svg>
                      </div>
                      <span>{apartment.bedrooms} Bedroom{apartment.bedrooms > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-dubai-gold" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  
                  <Link
                    to={`/apartments/${apartment.slug}`}
                    className="group inline-flex items-center text-dubai-gold hover:text-dubai-gold-dark font-semibold transition-all duration-500 uppercase tracking-wide text-sm"
                  >
                    Explore Details
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuredInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-12 sm:mt-16"
          >
            <Link to="/apartments" className="btn-luxury-secondary text-base sm:text-lg px-8 sm:px-12 py-4">
              View Complete Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Premium Stats - ОБНОВЛЕНО с иконками */}
      <section ref={statsRef} className="py-16 sm:py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A351' fill-opacity='0.05'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.3
        }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { number: '50+', label: 'Luxury Properties', icon: 'temple' },
              { number: '5★', label: 'Average Rating', icon: 'star' },
              { number: '1000+', label: 'Distinguished Guests', icon: 'crown' },
              { number: '24/7', label: 'Concierge Excellence', icon: 'hat' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={statsInView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className="text-center group"
              >
                <div className="luxury-glass rounded-2xl p-4 sm:p-8 hover:bg-white/5 transition-all duration-500">
                  <motion.div 
                    className="mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-500 flex justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <LuxuryIcon 
                      name={stat.icon} 
                      size="stats"
                      className="opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                      alt={`${stat.label} icon`}
                      fallback={
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-dubai-gold/20 rounded-full flex items-center justify-center">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-dubai-gold/40 rounded-full"></div>
                        </div>
                      }
                    />
                  </motion.div>
                  <div className="text-2xl sm:text-4xl md:text-5xl font-playfair font-bold text-dubai-gold mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-500">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 tracking-wide text-xs sm:text-sm uppercase">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Experience Section - ОБНОВЛЕНО с иконками */}
      <section ref={experienceRef} className="py-16 sm:py-32 premium-section-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-20">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={experienceInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <span className="text-dubai-gold text-sm tracking-[0.3em] uppercase font-medium mb-4 block">
                The Dubai Luxe Experience
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-playfair font-bold mb-8 text-shadow-luxury">
                Beyond <span className="gold-gradient-text">Accommodation</span>
              </h2>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                title: 'Curated Excellence',
                description: 'Every property personally selected and maintained to the highest standards of luxury.',
                icon: 'diamond'
              },
              {
                title: 'Bespoke Service',
                description: 'Personalized concierge services tailored to your unique preferences and desires.',
                icon: 'mask'
              },
              {
                title: 'Exclusive Access',
                description: 'Private events, hidden gems, and experiences unavailable to the general public.',
                icon: 'key'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={experienceInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.7 + index * 0.2 }}
                className="text-center luxury-card rounded-2xl p-6 sm:p-10 hover:transform hover:-translate-y-2 transition-all duration-500 group"
              >
                <motion.div 
                  className="mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500 flex justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <LuxuryIcon 
                    name={feature.icon} 
                    size="hero"
                    className="opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    alt={`${feature.title} icon`}
                    fallback={
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-dubai-gold/20 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-dubai-gold/40 rounded-full"></div>
                      </div>
                    }
                  />
                </motion.div>
                <h3 className="text-xl sm:text-2xl font-playfair font-semibold mb-4 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default Home
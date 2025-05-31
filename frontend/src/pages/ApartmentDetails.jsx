import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApartmentGallery from '../components/Apartment/ApartmentGallery'
import ReservationForm from '../components/Apartment/ReservationForm'
import Modal from '../components/UI/Modal'
import LoadingSpinner from '../components/UI/LoadingSpinner'

const ApartmentDetails = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [apartment, setApartment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [showMobileButton, setShowMobileButton] = useState(true)
  const sidebarRef = useRef(null)
  const contentRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    fetch(`/api/apartments/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Apartment not found')
        return res.json()
      })
      .then(data => {
        setApartment(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching apartment:', err)
        setLoading(false)
        navigate('/apartments')
      })  
  }, [slug, navigate])

  // Intersection Observer для скрытия мобильной кнопки при достижении футера
  useEffect(() => {
    if (loading) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowMobileButton(!entry.isIntersecting)
      },
      {
        rootMargin: '0px 0px -100px 0px',
        threshold: 0
      }
    )

    const footer = document.querySelector('footer')
    if (footer) {
      observer.observe(footer)
    }

    return () => {
      if (footer) {
        observer.unobserve(footer)
      }
    }
  }, [loading])

  if (loading) return <LoadingSpinner />
  if (!apartment) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      // КРИТИЧНО: Убран overflow-x-hidden! Он ломал position: sticky
      className="min-h-screen bg-white"
    >
      {/* Gallery */}
      <ApartmentGallery images={apartment.gallery} />

      {/* Details Container */}
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative">
          {/* Main Content */}
          <div ref={contentRef} className="lg:col-span-2">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-full"
            >
              {/* Header */}
              <div className="mb-12">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col xl:flex-row xl:items-start justify-between mb-6 gap-6"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span className="bg-dubai-gold/20 text-dubai-gold px-4 py-2 rounded-full text-sm font-medium tracking-wide uppercase">
                        {apartment.district}
                      </span>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-dubai-gold" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl xl:text-6xl font-playfair font-bold mb-4 text-shadow-luxury leading-tight break-words">
                      {apartment.name}
                    </h1>
                    <div className="flex flex-wrap items-center text-gray-600 mb-6 gap-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-dubai-gold/10 flex items-center justify-center">
                          <svg className="w-4 h-4 text-dubai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          </svg>
                        </div>
                        <span className="font-medium">{apartment.bedrooms} Bedroom{apartment.bedrooms > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-dubai-gold/10 flex items-center justify-center">
                          <svg className="w-4 h-4 text-dubai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                        </div>
                        <span className="font-medium">Prime Location</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-100 p-6 xl:p-8 rounded-2xl xl:ml-8 flex-shrink-0">
                    <div className="text-center xl:text-right">
                      <div className="text-3xl xl:text-4xl 2xl:text-5xl font-bold gold-gradient-text mb-2">
                        ${apartment.priceNight.toLocaleString()}
                      </div>
                      <div className="text-gray-600 font-medium">per night</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="w-32 h-1 bg-gradient-to-r from-dubai-gold to-dubai-gold-light rounded-full mb-8"
                ></motion.div>

                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-xl text-gray-700 leading-relaxed font-light break-words"
                >
                  {apartment.longDesc}
                </motion.p>
              </div>

              {/* Amenities */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-12"
              >
                <h3 className="text-3xl font-playfair font-semibold mb-8 flex items-center">
                  <span className="gold-gradient-text">Exclusive</span>
                  <span className="ml-3">Amenities</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-dubai-gold/30 to-transparent ml-6"></div>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {apartment.amenities.map((amenity, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="bg-white border border-gray-100 p-6 rounded-2xl hover:transform hover:-translate-y-2 transition-all duration-500 group hover:shadow-lg overflow-hidden"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-dubai-gold to-dubai-gold-light flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                        <span className="text-gray-800 font-medium text-lg truncate">{amenity}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Location */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-12"
              >
                <h3 className="text-3xl font-playfair font-semibold mb-8 flex items-center">
                  <span className="gold-gradient-text">Prime</span>
                  <span className="ml-3">Location</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-dubai-gold/30 to-transparent ml-6"></div>
                </h3>
                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
                  <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-dubai-gold/5 to-dubai-gold/10"></div>
                    <div className="text-center relative z-10">
                      <div className="w-20 h-20 bg-dubai-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                        <svg className="w-10 h-10 text-dubai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h4 className="text-2xl font-playfair font-semibold text-gray-800 mb-2">
                        {apartment.district}, Dubai
                      </h4>
                      <p className="text-gray-600">
                        Interactive map integration available in production
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Experience Features */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mb-12 lg:mb-32"
              >
                <h3 className="text-3xl font-playfair font-semibold mb-8 flex items-center">
                  <span className="gold-gradient-text">Dubai Luxe</span>
                  <span className="ml-3">Experience</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-dubai-gold/30 to-transparent ml-6"></div>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { title: '24/7 Concierge', description: 'Personal assistance for all your needs', icon: '🎩' },
                    { title: 'Private Chef', description: 'Michelin-starred dining experiences', icon: '👨‍🍳' },
                    { title: 'Luxury Transport', description: 'Premium vehicles at your disposal', icon: '🚗' }
                  ].map((feature, index) => (
                    <div key={index} className="bg-white border border-gray-100 p-8 rounded-2xl text-center hover:transform hover:-translate-y-2 transition-all duration-500 hover:shadow-lg overflow-hidden">
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h4 className="text-xl font-playfair font-semibold mb-3 text-gray-800 break-words">{feature.title}</h4>
                      <p className="text-gray-600 leading-relaxed break-words">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* ИСПРАВЛЕН: Sticky Sidebar без overflow конфликтов */}
          <div className="lg:col-span-1 hidden lg:block">
            <motion.div
              ref={sidebarRef}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="sticky top-28 z-sidebar"
              style={{
                // ИСПРАВЛЕНО: Простое sticky поведение
                // Теперь работает корректно без overflow: hidden конфликтов
                position: 'sticky',
                top: '7rem', // 28 * 0.25rem = 7rem = 112px
                zIndex: 30
              }}
            >
              {/* Sidebar карточка */}
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-lg overflow-hidden max-w-sm mx-auto">
                <div className="text-center mb-8">
                  <div className="text-3xl font-bold gold-gradient-text mb-3">
                    ${apartment.priceNight.toLocaleString()}/night
                  </div>
                  <p className="text-gray-600 font-medium">Experience luxury redefined</p>
                  <div className="flex justify-center space-x-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-dubai-gold" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowReservationModal(true)}
                  className="btn-luxury-primary w-full mb-6 text-lg py-4"
                >
                  Reserve Now
                </button>

                <div className="space-y-4 text-center text-sm text-gray-500 mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Free cancellation</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                    <span>No hidden fees</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure booking</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Included Services</h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-dubai-gold rounded-full flex-shrink-0"></div>
                      <span>Airport transfer</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-dubai-gold rounded-full flex-shrink-0"></div>
                      <span>Daily housekeeping</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-dubai-gold rounded-full flex-shrink-0"></div>
                      <span>Welcome amenities</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-dubai-gold rounded-full flex-shrink-0"></div>
                      <span>24/7 support</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Reserve Button */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ 
          y: showMobileButton ? 0 : 100,
          opacity: showMobileButton ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-mobile-buttons"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none"></div>
        <div className="relative bg-white/98 backdrop-blur-md border-t border-gray-200/70">
          <div className="safe-area-padding py-4">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1">
                <div className="text-lg font-bold gold-gradient-text">
                  ${apartment.priceNight.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">per night</div>
              </div>
              <button
                onClick={() => setShowReservationModal(true)}
                className="btn-luxury-primary text-base px-8 py-3 flex-shrink-0"
              >
                Reserve Now
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reservation Modal */}
      <Modal
        isOpen={showReservationModal}
        onClose={() => setShowReservationModal(false)}
        title="Reserve Your Luxury Experience"
        size="xl"
      >
        <ReservationForm
          apartment={apartment}
          onClose={() => setShowReservationModal(false)}
        />
      </Modal>
    </motion.div>
  )
}

export default ApartmentDetails
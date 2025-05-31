import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import ApartmentGrid from '../components/Apartment/ApartmentGrid'
import CustomSelect from '../components/UI/CustomSelect'
import PriceRangeSlider from '../components/UI/PriceRangeSlider'

const Apartments = () => {
  const [apartments, setApartments] = useState([])
  const [filteredApartments, setFilteredApartments] = useState([])
  const [filters, setFilters] = useState({
    bedrooms: '',
    district: '',
    priceRange: [0, 5000]
  })
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [headerRef, headerInView] = useInView({ threshold: 0.2, triggerOnce: true })

  // ИСПРАВЛЕНО: Мемоизированные вычисления для стабильности
  const maxPriceFromData = useMemo(() => {
    if (apartments.length === 0) return 4200
    return Math.max(...apartments.map(apt => apt.priceNight))
  }, [apartments])

  const districts = useMemo(() => {
    return [...new Set(apartments.map(apt => apt.district))]
  }, [apartments])

  const bedroomOptions = useMemo(() => {
    return [...new Set(apartments.map(apt => apt.bedrooms))].sort()
  }, [apartments])

  useEffect(() => {
    fetch('/api/apartments')
      .then(res => res.json())
      .then(data => {
        setApartments(data)
        setFilteredApartments(data)
        setLoading(false)
        
        // ИСПРАВЛЕНО: Устанавливаем максимальную цену только один раз
        const maxPrice = Math.max(...data.map(apt => apt.priceNight))
        setFilters(prev => ({ 
          ...prev, 
          priceRange: [0, maxPrice + 500] 
        }))
      })
      .catch(err => {
        console.error('Error fetching apartments:', err)
        setLoading(false)
      })
  }, [])

  // ИСПРАВЛЕНО: Оптимизированный фильтр с debounce эффектом
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let filtered = apartments

      if (filters.bedrooms) {
        filtered = filtered.filter(apt => apt.bedrooms === parseInt(filters.bedrooms))
      }

      if (filters.district) {
        filtered = filtered.filter(apt => apt.district === filters.district)
      }

      if (filters.priceRange && filters.priceRange.length === 2) {
        const [min, max] = filters.priceRange
        filtered = filtered.filter(apt => {
          return apt.priceNight >= min && apt.priceNight <= max
        })
      }

      setFilteredApartments(filtered)
    }, 50) // 50ms debounce для плавности

    return () => clearTimeout(timeoutId)
  }, [filters, apartments])

  // ИСПРАВЛЕНО: Мемоизированные функции для предотвращения ререндеров
  const clearFilters = useCallback(() => {
    const maxPrice = maxPriceFromData + 500
    setFilters({ 
      bedrooms: '', 
      district: '', 
      priceRange: [0, maxPrice] 
    })
  }, [maxPriceFromData])

  // ИСПРАВЛЕНО: Оптимизированные обработчики изменений
  const handleBedroomsChange = useCallback((value) => {
    setFilters(prev => ({ ...prev, bedrooms: value }))
  }, [])

  const handleDistrictChange = useCallback((value) => {
    setFilters(prev => ({ ...prev, district: value }))
  }, [])

  // КРИТИЧНО: Стабильный обработчик для PriceRangeSlider
  const handlePriceRangeChange = useCallback((value) => {
    setFilters(prev => ({ ...prev, priceRange: value }))
  }, [])

  // ИСПРАВЛЕНО: Мемоизированная проверка активных фильтров
  const hasActiveFilters = useMemo(() => {
    const maxPrice = maxPriceFromData + 500
    return filters.bedrooms || 
           filters.district || 
           (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice))
  }, [filters, maxPriceFromData])

  // ИСПРАВЛЕНО: Мемоизированные опции для селектов
  const bedroomSelectOptions = useMemo(() => [
    { value: '', label: 'All Bedrooms' },
    ...bedroomOptions.map(num => ({
      value: num.toString(),
      label: `${num} Bedroom${num > 1 ? 's' : ''}`
    }))
  ], [bedroomOptions])

  const districtSelectOptions = useMemo(() => [
    { value: '', label: 'All Districts' },
    ...districts.map(district => ({
      value: district,
      label: district
    }))
  ], [districts])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen premium-section-bg"
    >
      {/* Hero Header */}
      <section ref={headerRef} className="relative py-20 sm:py-32 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 premium-hero"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A351' fill-opacity='0.1'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* ПЕРЕРАБОТАННЫЕ Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-20 right-20 w-32 sm:w-32 h-32 sm:h-32 hidden sm:block"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-dubai-gold/20 via-dubai-gold/10 to-transparent border border-dubai-gold/30"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-dubai-gold/15 via-transparent to-dubai-gold/5 border border-dubai-gold/20"></div>
              <div className="absolute inset-6 rounded-full bg-dubai-gold/10 backdrop-blur-sm"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-dubai-gold/40 animate-pulse"></div>
            </div>
          </motion.div>

          <motion.div 
            className="absolute bottom-32 left-32 w-24 h-24 hidden sm:block"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 rounded-full border-2 border-dubai-gold/20 bg-gradient-radial from-dubai-gold/10 to-transparent"></div>
              <div className="absolute inset-3 rounded-full border border-dubai-gold/30 bg-dubai-gold/5"></div>
              <motion.div 
                className="absolute inset-6 rounded-full bg-dubai-gold/20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              ></motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="absolute top-1/3 left-1/4 w-16 h-16 opacity-60"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-dubai-gold/15 to-transparent border border-dubai-gold/25 backdrop-blur-sm"></div>
          </motion.div>

          <motion.div 
            className="absolute bottom-1/3 right-1/4 w-12 h-12 opacity-40"
            animate={{ x: [-8, 8, -8] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-full h-full rounded-full bg-dubai-gold/10 border border-dubai-gold/20"></div>
          </motion.div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={headerInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={headerInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span className="text-dubai-gold text-sm tracking-[0.3em] uppercase font-medium mb-4 block">
                Exclusive Collection
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-playfair font-bold mb-6 premium-text-shadow">
                Luxury <span className="gold-gradient-text">Residences</span>
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-dubai-gold to-transparent mx-auto mb-8"></div>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
                Discover Dubai's most exclusive residential experiences, curated for the world's most discerning travelers
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ИСПРАВЛЕНО: Filters без sticky - теперь просто статичная секция */}
      <section className="py-8 sm:py-12 bg-white/80 backdrop-blur-sm border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="filters-card rounded-2xl p-4 w-full flex items-center justify-between"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-dubai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                <span className="font-semibold text-gray-800">Filters</span>
                {hasActiveFilters && (
                  <div className="w-2 h-2 bg-dubai-gold rounded-full"></div>
                )}
              </div>
              <motion.div
                animate={{ rotate: showFilters ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg className="w-5 h-5 text-dubai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </motion.button>
          </div>

          {/* ИСПРАВЛЕН: Filters Container без sticky */}
          <motion.div
            initial={false}
            animate={showFilters || window.innerWidth >= 1024 ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden lg:overflow-visible"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="filters-card rounded-3xl p-6 sm:p-8"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
                {/* ИСПРАВЛЕН: Filter Controls с правильными z-index */}
                <div className="flex flex-col xl:flex-row flex-wrap gap-4 sm:gap-6 flex-1 w-full lg:w-auto">
                  {/* Bedrooms Filter */}
                  <div className="w-full xl:w-auto xl:min-w-[180px]" style={{ zIndex: 44 }}>
                    <CustomSelect
                      value={filters.bedrooms}
                      onChange={handleBedroomsChange}
                      options={bedroomSelectOptions}
                      label="Bedrooms"
                      placeholder="All Bedrooms"
                    />
                  </div>

                  {/* District Filter */}
                  <div className="w-full xl:w-auto xl:min-w-[180px]" style={{ zIndex: 43 }}>
                    <CustomSelect
                      value={filters.district}
                      onChange={handleDistrictChange}
                      options={districtSelectOptions}
                      label="District"
                      placeholder="All Districts"
                    />
                  </div>

                  {/* ИСПРАВЛЕНО: PriceRangeSlider с оптимизированными props */}
                  <div className="w-full xl:w-auto xl:min-w-[280px]" style={{ zIndex: 42 }}>
                    <PriceRangeSlider
                      value={filters.priceRange}
                      onChange={handlePriceRangeChange}
                      min={0}
                      max={maxPriceFromData + 500}
                      step={100}
                      label="Price Range per Night"
                    />
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                  {/* Clear Filters */}
                  <AnimatePresence>
                    {hasActiveFilters && (
                      <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={clearFilters}
                        className="text-gray-500 hover:text-dubai-gold transition-colors duration-300 text-sm font-medium px-4 py-2 rounded-xl hover:bg-dubai-gold/5"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Clear All
                      </motion.button>
                    )}
                  </AnimatePresence>
                  
                  {/* Results Count */}
                  <motion.div 
                    className="bg-dubai-gold/10 px-6 py-3 rounded-2xl border border-dubai-gold/20 flex-shrink-0"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    key={filteredApartments.length}
                  >
                    <span className="text-dubai-gold font-semibold">
                      {filteredApartments.length} 
                    </span>
                    <span className="text-gray-600 ml-1">
                      propert{filteredApartments.length !== 1 ? 'ies' : 'y'} found
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* ИСПРАВЛЕНО: Active Filters Display */}
              <AnimatePresence>
                {hasActiveFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 pt-6 border-t border-gray-200/50"
                  >
                    <div className="flex flex-wrap gap-3 items-center">
                      <span className="text-sm text-gray-600 font-medium">Active filters:</span>
                      {filters.bedrooms && (
                        <motion.span 
                          className="bg-dubai-gold/20 text-dubai-gold px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <span>{filters.bedrooms} Bedroom{filters.bedrooms > 1 ? 's' : ''}</span>
                          <button 
                            onClick={() => setFilters({...filters, bedrooms: ''})}
                            className="ml-2 hover:bg-dubai-gold/30 rounded-full p-1 transition-colors duration-200"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </motion.span>
                      )}
                      {filters.district && (
                        <motion.span 
                          className="bg-dubai-gold/20 text-dubai-gold px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <span>{filters.district}</span>
                          <button 
                            onClick={() => setFilters({...filters, district: ''})}
                            className="ml-2 hover:bg-dubai-gold/30 rounded-full p-1 transition-colors duration-200"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </motion.span>
                      )}
                      {/* НОВОЕ: Price Range Display */}
                      {filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPriceFromData + 500) && (
                        <motion.span 
                          className="bg-dubai-gold/20 text-dubai-gold px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <span>
                            ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
                          </span>
                          <button 
                            onClick={() => setFilters({...filters, priceRange: [0, maxPriceFromData + 500]})}
                            className="ml-2 hover:bg-dubai-gold/30 rounded-full p-1 transition-colors duration-200"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Apartments Grid */}
      <section className="py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center py-32"
              >
                <div className="luxury-card rounded-3xl p-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-dubai-gold mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Curating luxury experiences...</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <ApartmentGrid apartments={filteredApartments} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Premium CTA Section */}
      {!loading && filteredApartments.length > 0 && (
        <section className="py-16 sm:py-20 bg-black text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold mb-6">
                Can't Find Your <span className="gold-gradient-text">Perfect</span> Residence?
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed px-4">
                Our luxury concierge team can curate a bespoke accommodation experience tailored to your unique preferences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-luxury-primary px-8 sm:px-10 py-4">
                  Contact Concierge
                </button>
                <button className="btn-luxury-secondary px-8 sm:px-10 py-4">
                  Schedule Consultation
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </motion.div>
  )
}

export default Apartments
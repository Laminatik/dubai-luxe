import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const ApartmentCard = ({ apartment, index }) => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="luxury-card group rounded-3xl overflow-hidden relative"
    >
      {/* Image Container */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={apartment.coverImg}
          alt={apartment.name}
          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Premium Badge */}
        <div className="absolute top-6 right-6 luxury-glass px-4 py-2 rounded-full backdrop-blur-xl">
          <span className="text-white font-semibold text-sm tracking-wide">
            ${apartment.priceNight}/night
          </span>
        </div>
        
        {/* District Badge */}
        <div className="absolute top-6 left-6 bg-dubai-gold/90 px-3 py-1 rounded-full">
          <span className="text-white text-xs font-medium tracking-widest uppercase">
            {apartment.district}
          </span>
        </div>
        
        {/* Luxury Rating */}
        <div className="absolute bottom-6 right-6 flex space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-4 h-4 text-dubai-gold filter drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-8 relative">
        {/* Title Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-playfair font-semibold mb-2 group-hover:text-dubai-gold transition-colors duration-500 leading-tight">
            {apartment.name}
          </h3>
          <p className="text-gray-600 line-clamp-2 leading-relaxed text-sm">
            {apartment.shortDesc}
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-dubai-gold/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-dubai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">{apartment.bedrooms}</div>
              <div className="text-xs text-gray-500">Bedroom{apartment.bedrooms > 1 ? 's' : ''}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-dubai-gold/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-dubai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">Premium</div>
              <div className="text-xs text-gray-500">Location</div>
            </div>
          </div>
        </div>

        {/* Amenities Preview */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {apartment.amenities.slice(0, 3).map((amenity, idx) => (
              <span 
                key={idx}
                className="text-xs bg-gradient-to-r from-dubai-gold/10 to-dubai-gold/5 text-dubai-gold px-3 py-1 rounded-full border border-dubai-gold/20 font-medium"
              >
                {amenity}
              </span>
            ))}
            {apartment.amenities.length > 3 && (
              <span className="text-xs text-dubai-gold font-medium px-3 py-1 rounded-full border border-dubai-gold/30 bg-dubai-gold/5">
                +{apartment.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        {/* CTA */}
        <Link
          to={`/apartments/${apartment.slug}`}
          className="group/cta inline-flex items-center justify-between w-full p-4 rounded-2xl border-2 border-dubai-gold/20 hover:border-dubai-gold/40 transition-all duration-500 hover:bg-dubai-gold/5"
        >
          <span className="font-semibold text-dubai-gold group-hover/cta:text-dubai-gold-dark transition-colors duration-300 tracking-wide">
            Explore Details
          </span>
          <div className="w-8 h-8 rounded-full bg-dubai-gold/10 group-hover/cta:bg-dubai-gold flex items-center justify-center transition-all duration-300">
            <svg className="w-4 h-4 text-dubai-gold group-hover/cta:text-white transform group-hover/cta:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>
      </div>
      
      {/* Luxury Corner Accent */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-dubai-gold/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </motion.div>
  )
}

const ApartmentGrid = ({ apartments }) => {
  if (!apartments || apartments.length === 0) {
    return (
      <div className="text-center py-32">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="luxury-card rounded-3xl p-16 max-w-md mx-auto"
        >
          <div className="text-8xl mb-6 opacity-30">🏛️</div>
          <h3 className="text-3xl font-playfair font-semibold mb-4 text-gray-800">
            No Properties Found
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Adjust your search criteria to discover our exclusive collection of luxury residences
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="masonry-grid">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {apartments.map((apartment, index) => (
          <ApartmentCard 
            key={apartment.id} 
            apartment={apartment} 
            index={index}
          />
        ))}
      </div>
    </div>
  )
}

export default ApartmentGrid
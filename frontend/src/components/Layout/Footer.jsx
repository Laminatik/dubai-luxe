import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A351' fill-opacity='0.1'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* ПЕРЕРАБОТАННЫЕ Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Основной декоративный круг */}
        <motion.div 
          className="absolute top-20 right-20 w-40 h-40 hidden sm:block"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <div className="relative w-full h-full">
            {/* Внешний круг */}
            <div className="absolute inset-0 rounded-full border-2 border-dubai-gold/15 bg-gradient-radial from-dubai-gold/8 to-transparent"></div>
            {/* Средний круг */}
            <div className="absolute inset-4 rounded-full border border-dubai-gold/20 bg-dubai-gold/5 backdrop-blur-sm"></div>
            {/* Внутренний круг */}
            <motion.div 
              className="absolute inset-8 rounded-full bg-gradient-to-br from-dubai-gold/15 to-dubai-gold/5"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            ></motion.div>
            {/* Центральная точка */}
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-dubai-gold/30"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            ></motion.div>
          </div>
        </motion.div>

        {/* Второй декоративный элемент */}
        <motion.div 
          className="absolute bottom-32 left-32 w-32 h-32 hidden sm:block"
          animate={{ rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-full bg-gradient-conic from-dubai-gold/10 via-transparent to-dubai-gold/5 border border-dubai-gold/20"></div>
            <div className="absolute inset-3 rounded-full border border-dubai-gold/15 bg-dubai-gold/3"></div>
            <motion.div 
              className="absolute inset-6 rounded-full border border-dubai-gold/25"
              animate={{ borderWidth: [1, 3, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ borderColor: 'rgba(201,163,81,0.25)' }}
            ></motion.div>
          </div>
        </motion.div>

        {/* Дополнительные мелкие элементы */}
        <motion.div 
          className="absolute top-1/2 right-1/4 w-20 h-20 opacity-40"
          animate={{ 
            y: [-15, 15, -15],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-dubai-gold/10 to-transparent border border-dubai-gold/20 backdrop-blur-sm"></div>
          <div className="absolute inset-4 rounded-full bg-dubai-gold/5"></div>
        </motion.div>

        <motion.div 
          className="absolute bottom-1/4 right-1/3 w-16 h-16 opacity-30"
          animate={{ 
            x: [-10, 10, -10],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-full rounded-full border-2 border-dubai-gold/15 bg-dubai-gold/5"></div>
        </motion.div>

        {/* Мобильные версии (меньше и проще) */}
        <motion.div 
          className="absolute top-16 right-8 w-12 h-12 sm:hidden"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full rounded-full border border-dubai-gold/20 bg-dubai-gold/5"></div>
        </motion.div>

        <motion.div 
          className="absolute bottom-16 left-8 w-8 h-8 sm:hidden"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-full rounded-full bg-dubai-gold/15"></div>
        </motion.div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-dubai-gold to-dubai-gold-light flex items-center justify-center shadow-xl">
                    <span className="text-white font-bold text-2xl">DL</span>
                  </div>
                  <div className="text-3xl font-playfair font-bold">
                    Dubai <span className="gold-gradient-text">Luxe</span>
                  </div>
                </div>
                <p className="text-gray-300 max-w-md leading-relaxed text-lg mb-8">
                  Experience the pinnacle of luxury living in Dubai's most prestigious residences. 
                  Curated for the discerning traveler who demands nothing but excellence.
                </p>
                
                {/* Awards & Recognition */}
                <div className="flex flex-wrap gap-4">
                  <div className="luxury-glass px-4 py-2 rounded-full border border-white/10">
                    <span className="text-dubai-gold text-sm font-medium">★ Best Luxury Rental 2024</span>
                  </div>
                  <div className="luxury-glass px-4 py-2 rounded-full border border-white/10">
                    <span className="text-dubai-gold text-sm font-medium">🏆 Excellence Award</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Links */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-playfair font-semibold mb-6 text-dubai-gold">
                Navigate
              </h3>
              <div className="space-y-4">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/apartments', label: 'Collection' },
                  { to: '/about', label: 'Heritage' }
                ].map((link, index) => (
                  <Link
                    key={index}
                    to={link.to}
                    className="block text-gray-300 hover:text-dubai-gold transition-all duration-300 hover:translate-x-2 transform font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Contact & Services */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-playfair font-semibold mb-6 text-dubai-gold">
                Connect
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-dubai-gold/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-dubai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-300">Dubai, United Arab Emirates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-dubai-gold/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-dubai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-gray-300">+971 4 123 4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-dubai-gold/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-dubai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-gray-300">concierge@dubailuxe.com</span>
                </div>
                
                {/* Service Hours */}
                <div className="mt-6 p-4 luxury-glass rounded-2xl border border-white/10">
                  <h4 className="text-dubai-gold font-semibold mb-2">Concierge Hours</h4>
                  <p className="text-sm text-gray-300">Available 24/7 for our guests</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-800"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h3 className="text-2xl font-playfair font-semibold mb-4">
                Stay Informed About <span className="gold-gradient-text">Exclusive</span> Offerings
              </h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Be the first to discover new luxury properties and receive special invitations to exclusive events.
              </p>
              <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-dubai-gold focus:border-dubai-gold transition-all duration-300 backdrop-blur-sm"
                />
                <button className="btn-luxury-primary px-8 py-3">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 bg-black/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="text-center md:text-left"
              >
                <p className="text-gray-400">
                  &copy; 2025 Dubai Luxe. All rights reserved. 
                  <span className="mx-2">•</span>
                  Crafted with excellence in Dubai.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="flex space-x-6"
              >
                {[
                  { name: 'Privacy Policy', href: '#' },
                  { name: 'Terms of Service', href: '#' },
                  { name: 'Cookie Policy', href: '#' }
                ].map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-gray-400 hover:text-dubai-gold transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
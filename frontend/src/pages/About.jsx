import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import LuxuryIcon from '../components/UI/LuxuryIcon'

const About = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.2, triggerOnce: true })
  const [storyRef, storyInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [valuesRef, valuesInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [teamRef, teamInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [awardsRef, awardsInView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Hero */}
      <section ref={heroRef} className="relative py-20 sm:py-40 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 premium-hero"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A351' fill-opacity='0.1'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* ПЕРЕРАБОТАННЫЕ Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Основной декоративный элемент */}
          <motion.div 
            className="absolute top-20 right-20 w-48 h-48 hidden sm:block"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            <div className="relative w-full h-full">
              {/* Внешнее кольцо */}
              <div className="absolute inset-0 rounded-full border-2 border-dubai-gold/15 bg-gradient-radial from-dubai-gold/5 to-transparent"></div>
              {/* Среднее кольцо */}
              <div className="absolute inset-6 rounded-full border border-dubai-gold/25 bg-dubai-gold/5 backdrop-blur-sm"></div>
              {/* Внутреннее кольцо с пульсацией */}
              <motion.div 
                className="absolute inset-12 rounded-full bg-gradient-to-br from-dubai-gold/20 to-dubai-gold/5"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  ease: "easeInOut"
                }}
              ></motion.div>
              {/* Центральная точка */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-dubai-gold/40"></div>
              {/* Орбитальные элементы */}
              <motion.div 
                className="absolute top-2 left-1/2 w-2 h-2 bg-dubai-gold/60 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: '0 94px' }}
              ></motion.div>
              <motion.div 
                className="absolute bottom-2 right-1/2 w-1.5 h-1.5 bg-dubai-gold/40 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: '0 -94px' }}
              ></motion.div>
            </div>
          </motion.div>

          {/* Второй декоративный элемент */}
          <motion.div 
            className="absolute bottom-32 left-32 w-40 h-40 hidden sm:block"
            animate={{ rotate: -360 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 rounded-full bg-gradient-conic from-dubai-gold/12 via-transparent to-dubai-gold/8 border border-dubai-gold/20"></div>
              <div className="absolute inset-4 rounded-full border border-dublin-gold/15 bg-dubai-gold/3 backdrop-blur-sm"></div>
              <motion.div 
                className="absolute inset-8 rounded-full"
                animate={{ 
                  borderWidth: [1, 4, 1],
                  borderColor: ['rgba(201,163,81,0.2)', 'rgba(201,163,81,0.4)', 'rgba(201,163,81,0.2)']
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut"
                }}
                style={{ 
                  border: '1px solid rgba(201,163,81,0.25)',
                  borderRadius: '50%'
                }}
              ></motion.div>
            </div>
          </motion.div>

          {/* Плавающие мелкие элементы */}
          <motion.div 
            className="absolute top-1/2 left-10 w-24 h-24 opacity-40"
            animate={{ 
              y: [-20, 20, -20],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              ease: "easeInOut"
            }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-dubai-gold/15 to-transparent border border-dubai-gold/25 backdrop-blur-sm"></div>
            <div className="absolute inset-4 rounded-full bg-dubai-gold/8"></div>
          </motion.div>

          {/* Мобильные декоративные элементы */}
          <motion.div 
            className="absolute top-16 right-8 w-20 h-20 sm:hidden"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full rounded-full border border-dubai-gold/20 bg-dubai-gold/5"></div>
            <div className="absolute inset-3 rounded-full bg-dubai-gold/10"></div>
          </motion.div>

          <motion.div 
            className="absolute bottom-20 left-8 w-16 h-16 sm:hidden"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut"
            }}
          >
            <div className="w-full h-full rounded-full bg-dubai-gold/15 border border-dubai-gold/25"></div>
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={heroInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={heroInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span className="text-dubai-gold text-sm tracking-[0.3em] uppercase font-medium mb-6 block">
                Est. 2020 • Dubai's Premier Luxury Collection
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-playfair font-bold mb-8 premium-text-shadow leading-tight">
                Redefining <span className="gold-gradient-text">Luxury</span>
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-dubai-gold to-transparent mx-auto mb-10"></div>
              <p className="text-lg sm:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto font-light px-4">
                Dubai Luxe curates extraordinary residential experiences for the world's most discerning travelers. 
                Each property represents the pinnacle of opulence, sophistication, and unparalleled service excellence.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section ref={storyRef} className="py-16 sm:py-32 premium-section-bg relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-radial from-dubai-gold/5 to-transparent rounded-full"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-radial from-dubai-gold/3 to-transparent rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={storyInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-dubai-gold text-sm tracking-[0.3em] uppercase font-medium mb-4 block">
                Our Heritage
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-playfair font-bold mb-8 text-shadow-luxury">
                A Legacy of <span className="gold-gradient-text">Excellence</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-dubai-gold to-dubai-gold-light rounded-full mb-8"></div>
              
              <div className="space-y-6 text-gray-700 leading-relaxed text-base sm:text-lg">
                <p>
                  Founded in 2020 by visionary hospitality veterans, Dubai Luxe emerged from a singular mission: 
                  to transform how elite travelers experience Dubai's architectural marvels and cultural richness. 
                  We recognized that true luxury transcends mere amenities—it's about crafting unforgettable moments 
                  and creating lasting memories.
                </p>
                <p>
                  Our founding team, with over four decades of combined experience in ultra-luxury hospitality, 
                  personally curates each property based on uncompromising standards of architectural beauty, 
                  location prestige, and service excellence. From penthouse suites commanding panoramic views 
                  of the Burj Khalifa to beachfront villas on the exclusive Palm Jumeirah crescent.
                </p>
                <p>
                  Today, we proudly serve distinguished guests from over 50 countries, offering not merely 
                  accommodations, but exclusive gateways to Dubai's most coveted experiences and hidden treasures 
                  known only to true connoisseurs of luxury.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 sm:gap-6">
                <div className="luxury-card p-4 sm:p-6 rounded-2xl text-center">
                  <div className="text-2xl sm:text-3xl font-playfair font-bold text-dubai-gold mb-2">50+</div>
                  <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide">Countries Served</div>
                </div>
                <div className="luxury-card p-4 sm:p-6 rounded-2xl text-center">
                  <div className="text-2xl sm:text-3xl font-playfair font-bold text-dubai-gold mb-2">1000+</div>
                  <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide">Distinguished Guests</div>
                </div>
                <div className="luxury-card p-4 sm:p-6 rounded-2xl text-center">
                  <div className="text-2xl sm:text-3xl font-playfair font-bold text-dubai-gold mb-2">24/7</div>
                  <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide">Concierge Excellence</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={storyInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="luxury-card rounded-3xl overflow-hidden shadow-luxury">
                <img
                  src="/img/img2.png"
                  alt="Dubai luxury skyline"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <div className="luxury-glass px-6 py-3 rounded-full backdrop-blur-xl border border-white/20">
                    <span className="font-semibold">Dubai's Finest Collection</span>
                  </div>
                </div>
              </div>
              
              {/* Floating accent elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 border-2 border-dubai-gold/30 rounded-full animate-luxury-pulse hidden sm:block"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-dubai-gold/20 rounded-full animate-float"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values - ОБНОВЛЕНО с иконками */}
      <section ref={valuesRef} className="py-16 sm:py-32 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={valuesInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-20"
          >
            <span className="text-dubai-gold text-sm tracking-[0.3em] uppercase font-medium mb-6 block">
              Our Philosophy
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-playfair font-bold mb-8 premium-text-shadow">
              Guiding <span className="gold-gradient-text">Principles</span>
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-dubai-gold to-transparent mx-auto mb-8"></div>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              The core values that define every interaction, every service, and every moment of your Dubai Luxe experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                title: 'Uncompromising Excellence',
                description: 'Every detail meticulously crafted to exceed the highest expectations of luxury and refinement.',
                icon: 'crown',
                accent: 'from-dubai-gold to-dubai-gold-light'
              },
              {
                title: 'Authentic Experiences',
                description: 'Genuine cultural immersion that reveals Dubai\'s hidden treasures and timeless elegance.',
                icon: 'temple2',
                accent: 'from-dubai-gold-light to-dubai-gold'
              },
              {
                title: 'Innovation Leadership',
                description: 'Pioneering new standards in luxury hospitality through technology and personalized service.',
                icon: 'innovation',
                accent: 'from-dubai-gold to-dubai-gold-dark'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={valuesInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="luxury-glass rounded-3xl p-6 sm:p-10 hover:transform hover:-translate-y-4 transition-all duration-700 group text-center border border-white/10"
              >
                <motion.div 
                  className="mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-500 flex justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <LuxuryIcon 
                    name={value.icon} 
                    size="hero"
                    className="opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                    alt={`${value.title} icon`}
                    fallback={
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-dubai-gold/20 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-dubai-gold/40 rounded-full"></div>
                      </div>
                    }
                  />
                </motion.div>
                <h3 className={`text-xl sm:text-2xl font-playfair font-semibold mb-4 sm:mb-6 bg-gradient-to-r ${value.accent} bg-clip-text text-transparent`}>
                  {value.title}
                </h3>
                <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section ref={teamRef} className="py-16 sm:py-32 premium-section-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={teamInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-20"
          >
            <span className="text-dubai-gold text-sm tracking-[0.3em] uppercase font-medium mb-6 block">
              Leadership Excellence
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-playfair font-bold mb-8 text-shadow-luxury">
              Visionary <span className="gold-gradient-text">Leadership</span>
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-dubai-gold to-transparent mx-auto mb-8"></div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Meet the distinguished professionals who bring decades of luxury hospitality expertise to curate your perfect Dubai experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                name: 'Amara Al-Rashid',
                title: 'Founder & Chief Executive',
                image: '/img/img5.png',
                background: 'Former Director of Luxury Operations at Emirates Palace'
              },
              {
                name: 'James Morrison',
                title: 'Director of Operations',
                image: '/img/img6.png',
                background: 'Two decades at Four Seasons and Ritz-Carlton properties'
              },
              {
                name: 'Sofia Delacroix',
                title: 'Guest Experience Director',
                image: '/img/img7.png',
                background: 'Former Concierge Manager at Burj Al Arab'
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={teamInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="luxury-card rounded-3xl overflow-hidden hover:transform hover:-translate-y-4 transition-all duration-700 group"
              >
                <div className="relative h-80 sm:h-96 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                    <div className="luxury-glass p-4 rounded-2xl backdrop-blur-xl border border-white/20">
                      <h3 className="text-lg sm:text-xl font-playfair font-semibold text-white mb-1">
                        {member.name}
                      </h3>
                      <p className="text-dubai-gold text-sm font-medium mb-2">{member.title}</p>
                      <p className="text-gray-300 text-xs leading-relaxed">{member.background}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition - ОБНОВЛЕНО с иконками */}
      <section ref={awardsRef} className="py-16 sm:py-32 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={awardsInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-dubai-gold text-sm tracking-[0.3em] uppercase font-medium mb-6 block">
              Industry Recognition
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-playfair font-bold mb-12 sm:mb-16 premium-text-shadow">
              Awards & <span className="gold-gradient-text">Accolades</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {[
                {
                  award: 'Best Luxury Rental Agency',
                  year: 'Dubai Tourism Awards 2024',
                  icon: 'crown'
                },
                {
                  award: 'Excellence in Guest Experience',
                  year: 'Hospitality Excellence Awards 2024',
                  icon: 'star'
                },
                {
                  award: 'Top 10 Boutique Hospitality',
                  year: 'Middle East Luxury Awards 2023',
                  icon: 'crown'
                },
                {
                  award: 'Sustainable Luxury Initiative',
                  year: 'Green Tourism Recognition 2023',
                  icon: 'innovation'
                }
              ].map((award, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={awardsInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="luxury-glass p-6 sm:p-8 rounded-3xl border border-dubai-gold/20 hover:border-dubai-gold/40 transition-all duration-500 group"
                >
                  <motion.div 
                    className="mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500 flex justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <LuxuryIcon 
                      name={award.icon} 
                      size="xl"
                      className="opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                      alt={`${award.award} icon`}
                      fallback={
                        <div className="w-16 h-16 bg-dubai-gold/20 rounded-full flex items-center justify-center">
                          <div className="w-8 h-8 bg-dubai-gold/40 rounded-full"></div>
                        </div>
                      }
                    />
                  </motion.div>
                  <h3 className="text-lg sm:text-xl font-playfair font-semibold text-dubai-gold mb-3">
                    "{award.award}"
                  </h3>
                  <p className="text-gray-300 italic text-sm sm:text-base">{award.year}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default About
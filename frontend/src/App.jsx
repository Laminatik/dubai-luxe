import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useScrollToTop from './hooks/useScrollToTop'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Apartments from './pages/Apartments'
import ApartmentDetails from './pages/ApartmentDetails'
import ReservationSuccess from './pages/ReservationSuccess'

function AppContent() {
  useScrollToTop()
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/apartments" element={<Apartments />} />
          <Route path="/apartments/:slug" element={<ApartmentDetails />} />
          <Route path="/thanks" element={<ReservationSuccess />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
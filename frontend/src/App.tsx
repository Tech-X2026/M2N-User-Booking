import { useEffect, useLayoutEffect, useState } from 'react'
import { Routes, Route, useLocation, Link, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import PageTransition from './components/PageTransition'
import { ErrorBoundary } from './components/ErrorBoundary'
import { scrollToTop } from './lib/lib'

import Home from './pages/Home'
import About from './pages/About'
import Hotels from './pages/Hotels'
import HotelDetail from './pages/HotelDetail'
import Rooms from './pages/Rooms'
import Dining from './pages/Dining'
import Spa from './pages/Spa'
import Events from './pages/Events'
import Experiences from './pages/Experiences'
import Offers from './pages/Offers'
import Gallery from './pages/Gallery'
import Blog from './pages/Blog'
import Careers from './pages/Careers'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import MyBookings from './pages/MyBookings'

function NotFound() {
  return (
    <div className="editorial-grid min-h-[80vh] items-center pt-40 pb-32">
      <div className="col-span-12 md:col-span-8 md:col-start-3">
        <p className="u-label text-terracotta">404 — Lost keys</p>
        <h1 className="t-hero mt-6 text-[clamp(4rem,12vw,10rem)]">
          This room <em className="font-normal italic">doesn&rsquo;t exist.</em>
        </h1>
        <Link to="/" className="btn-outline mt-12">Return to the Lobby</Link>
      </div>
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [booted, setBooted] = useState(
    () => typeof window !== 'undefined' && sessionStorage.getItem('m2n-booted') === '1'
  )

  useEffect(() => {
    const handleReserve = () => {
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    };
    window.addEventListener('m2n:reserve', handleReserve);
    return () => window.removeEventListener('m2n:reserve', handleReserve);
  }, [navigate]);

  useEffect(() => {
    if (booted) sessionStorage.setItem('m2n-booted', '1')
  }, [booted])

  useLayoutEffect(() => {
    scrollToTop()
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    const t = setTimeout(() => ScrollTrigger.refresh(), 900)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
    }
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-porcelain font-sans text-ink">
      <div className="grain" aria-hidden />
      <CustomCursor />

      <AnimatePresence>
        {!booted && <LoadingScreen key="loader" onDone={() => setBooted(true)} />}
      </AnimatePresence>

      <Navbar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/hotels" element={<PageTransition><Hotels /></PageTransition>} />
          <Route path="/hotels/:id" element={<PageTransition><ErrorBoundary><HotelDetail /></ErrorBoundary></PageTransition>} />
          <Route path="/rooms" element={<PageTransition><Rooms /></PageTransition>} />
          <Route path="/dining" element={<PageTransition><Dining /></PageTransition>} />
          <Route path="/spa" element={<PageTransition><Spa /></PageTransition>} />
          <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
          <Route path="/experiences" element={<PageTransition><Experiences /></PageTransition>} />
          <Route path="/offers" element={<PageTransition><Offers /></PageTransition>} />
          <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
          <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
          <Route path="/careers" element={<PageTransition><Careers /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </div>
  )
}

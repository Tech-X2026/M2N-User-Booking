import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RiCloseLine, RiMenuLine, RiUserLine } from 'react-icons/ri'
import { EASE } from '../lib/lib'
import { useAuth } from '../lib/AuthContext'

const NAV = [
  { label: 'Stays', to: '/hotels' },
  { label: 'Dining', to: '/dining' },
  { label: 'Experiences', to: '/experiences' },
  { label: 'Weddings', to: '/events' },
]

const MENU_ALL = [
  { label: 'HOME', to: '/' },
  { label: 'HOTELS', to: '/hotels' },
  { label: 'ROOMS', to: '/rooms' },
  { label: 'DINING', to: '/dining' },
  { label: 'EXPERIENCES', to: '/experiences' },
  { label: 'SPA & WELLNESS', to: '/spa' },
  { label: 'MEETINGS & EVENTS', to: '/events' },
  { label: 'OFFERS', to: '/offers' },
  { label: 'GALLERY', to: '/gallery' },
  { label: 'JOURNAL', to: '/blog' },
  { label: 'ABOUT', to: '/about' },
  { label: 'CONTACT', to: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        className={`fixed inset-x-0 top-0 z-[60] transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-border shadow-sm'
            : 'bg-white/80 backdrop-blur-sm border-b border-border'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img src="/Logo/M2N_logo1.png" alt="M2N Logo" className="h-10 w-auto" />
          </Link>

          {/* NAV PILLS (Desktop) */}
          <nav className="hidden lg:flex gap-1 bg-bg-soft p-1 rounded-xl">
            {NAV.map((n) => {
              const isActive = location.pathname.startsWith(n.to)
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`px-3.5 py-2 text-xs font-medium rounded-[7px] transition-all ${
                    isActive 
                      ? 'bg-white text-m2n-ink shadow-[0_1px_3px_rgba(0,0,0,0.08)]' 
                      : 'text-text-2 hover:bg-white/50'
                  }`}
                >
                  {n.label}
                </Link>
              )
            })}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="icon-btn hidden sm:flex">♡</button>
            <button className="btn btn-ghost hidden md:block">INR · EN</button>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex h-9 w-9 items-center justify-center border border-border rounded-full bg-white transition-colors hover:border-m2n-saffron hover:text-m2n-saffron"
                >
                  <RiUserLine size={16} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-border shadow-lg rounded-xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-border bg-bg-soft">
                      <p className="text-sm font-bold text-m2n-ink truncate">{user.name}</p>
                      <p className="text-xs text-text-3 truncate">{user.email}</p>
                    </div>
                    <Link to="/my-bookings" className="block px-4 py-2 text-sm font-medium hover:bg-bg-soft hover:text-m2n-saffron transition-colors" onClick={() => setProfileOpen(false)}>
                      My Bookings
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setProfileOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm font-medium hover:bg-bg-soft hover:text-m2n-saffron transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary hidden sm:block">
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center border border-border bg-white rounded-full transition-colors hover:border-m2n-saffron hover:text-m2n-saffron lg:hidden"
            >
              <RiMenuLine size={16} />
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="btn btn-ghost hidden lg:flex items-center gap-2"
            >
              <RiMenuLine size={14} /> Menu
            </button>
          </div>
        </div>
      </motion.header>

      {/* ===== FULL MENU OVERLAY ===== */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[80] bg-m2n-cream flex flex-col"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {/* Header */}
            <div className="flex-none flex items-center justify-between border-b border-border px-6 py-4 max-w-[1280px] mx-auto w-full">
              <img src="/Logo/M2N_logo1.png" alt="M2N Logo" className="h-10 w-auto" />
              <button
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center border border-border bg-white rounded-full transition-colors hover:border-m2n-saffron hover:text-m2n-saffron"
              >
                <RiCloseLine size={18} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-10 custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-12 gap-y-2 sm:grid-cols-2 max-w-[1280px] mx-auto w-full">
                {MENU_ALL.map((m, i) => (
                  <motion.div
                    key={m.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.04 }}
                  >
                    <Link
                      to={m.to}
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-center justify-between border-b border-border/60 py-4"
                    >
                      <span className="font-display text-[clamp(1.5rem,2.5vw,2rem)] font-medium text-m2n-ink transition-colors group-hover:text-m2n-saffron">
                        {m.label}
                      </span>
                      <span className="text-xs font-medium text-text-3 opacity-60">0{i + 1}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

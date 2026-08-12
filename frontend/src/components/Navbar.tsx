import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { RiCloseLine, RiMenuLine, RiArrowRightLine, RiCheckLine, RiUserLine } from 'react-icons/ri'
import axios from 'axios'
import { EASE } from '../lib/lib'
import { useAuth } from '../lib/AuthContext'

const NAV = [
  { label: 'HOME', to: '/' },
  { label: 'HOTELS', to: '/hotels' },
  { label: 'ROOMS', to: '/rooms' },
  { label: 'DINING', to: '/dining' },
  { label: 'EXPERIENCES', to: '/experiences' },
  { label: 'ABOUT', to: '/about' },
]

const MENU_ALL = [
  ...NAV,
  { label: 'SPA & WELLNESS', to: '/spa' },
  { label: 'MEETINGS, EVENTS & WEDDINGS', to: '/events' },
  { label: 'OFFERS', to: '/offers' },
  { label: 'GALLERY', to: '/gallery' },
  { label: 'JOURNAL', to: '/blog' },
  { label: 'CAREERS', to: '/careers' },
  { label: 'CONTACT', to: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()
  const todayDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
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
        transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
        className={`fixed inset-x-0 top-0 z-[60] transition-all duration-500 ${
          scrolled
            ? 'border-b border-line bg-porcelain/95 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="editorial-grid !grid-cols-12 items-center py-5">
          <Link to="/" className="col-span-4 flex items-baseline gap-3 lg:col-span-3">
            <img src="/Logo/M2N_logo.png" alt="M2N Logo" className="h-10 w-auto" />
          </Link>

          <nav className="col-span-6 hidden items-center justify-center gap-9 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`u-label link-line !text-[0.72rem] ${
                  location.pathname.startsWith(n.to) ? 'text-terracotta' : 'text-ink'
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="col-span-8 flex items-center justify-end gap-5 lg:col-span-3 relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex h-10 w-10 items-center justify-center border border-line rounded-full transition-colors hover:border-terracotta hover:text-terracotta"
                >
                  <RiUserLine size={18} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-porcelain border border-line shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-line mb-1">
                      <p className="text-sm font-medium text-ink truncate">{user.name}</p>
                      <p className="text-xs text-muted truncate">{user.email}</p>
                    </div>
                    <Link to="/my-bookings" className="block px-4 py-2 u-label hover:bg-line/20 hover:text-terracotta" onClick={() => setProfileOpen(false)}>
                      My Bookings
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setProfileOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 u-label hover:bg-line/20 hover:text-terracotta"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="u-label link-line text-ink hidden sm:block">
                Login
              </Link>
            )}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center border border-line text-ink transition-colors hover:border-terracotta hover:text-terracotta lg:hidden"
            >
              <RiMenuLine size={18} />
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open full menu"
              className="u-label hidden items-center gap-2 text-ink transition-colors hover:text-terracotta lg:flex"
            >
              <RiMenuLine size={16} /> Menu
            </button>
          </div>
        </div>
      </motion.header>

      {/* ===== FULL MENU OVERLAY ===== */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[80] bg-porcelain flex flex-col"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {/* Header */}
            <div className="flex-none flex items-center justify-between border-b border-line px-6 pt-6 pb-4 md:px-12 md:pt-12 md:pb-6 max-w-[1560px] mx-auto w-full">
              <img src="/Logo/M2N_logo.png" alt="M2N Logo" className="h-10 md:h-12 w-auto" />
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center border border-ink transition-colors hover:border-terracotta hover:text-terracotta rounded-full"
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 min-h-0 overflow-y-auto px-6 md:px-12 py-6 custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-16 gap-y-1 sm:grid-cols-2 max-w-[1560px] mx-auto w-full">
                {MENU_ALL.map((m, i) => (
                  <motion.div
                    key={m.to}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.55, ease: EASE, delay: 0.15 + i * 0.045 }}
                  >
                    <Link
                      to={m.to}
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-baseline justify-between border-b border-line py-3.5"
                    >
                      <span className="t-section text-[clamp(1.5rem,3.2vw,2.6rem)] transition-all duration-500 group-hover:translate-x-2 group-hover:text-terracotta">
                        {m.label}
                      </span>
                      <span className="u-label-sm text-warm">0{i + 1}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Removed Footer per user request */}
          </motion.div>
        )}
      </AnimatePresence>

    </>
  )
}

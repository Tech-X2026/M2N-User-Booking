import { Link } from 'react-router-dom'
import {
  RiInstagramLine,
  RiTwitterLine,
  RiLinkedinLine,
  RiYoutubeLine,
} from 'react-icons/ri'

const EXPERIENCES = [
  { label: 'Our Hotels', to: '/hotels' },
  { label: 'Rooms & Suites', to: '/rooms' },
  { label: 'Dining', to: '/dining' },
  { label: 'Spa & Wellness', to: '/spa' },
]

const EVENTS = [
  { label: 'Meetings, Events & Weddings', to: '/events' },
  { label: 'Special Offers', to: '/offers' },
  { label: 'Gallery', to: '/gallery' },
]

const ABOUT = [
  { label: 'Our Story', to: '/about' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Journal', to: '/blog' },
]

const SOCIALS = [
  { label: 'Instagram', icon: RiInstagramLine },
  { label: 'Twitter', icon: RiTwitterLine },
  { label: 'LinkedIn', icon: RiLinkedinLine },
  { label: 'YouTube', icon: RiYoutubeLine },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#111] text-[#b3b3b3]">
      <div className="editorial-grid pt-24 md:pt-32 pb-32">
        
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-4 pr-12 mb-12 lg:mb-0">
          <Link to="/" className="block mb-6">
            <img src="/Logo/M2N_logo.png" alt="M2N Logo" className="h-16 md:h-20 w-auto" />
          </Link>
          <p className="text-[0.95rem] font-light leading-relaxed mb-8 max-w-[320px]">
            A luxury hospitality group across India.<br />
            Where every heartbeat matters.
          </p>
          <div className="text-[0.95rem] font-light mb-8 flex flex-col gap-1">
            <p>Reception: +9196587100</p>
            <p>Reservations: +9196587100</p>
            <p>Email: m2nhotelsbookinglko@gmail.com</p>
          </div>

        </div>

        {/* Middle Column 1: Experiences */}
        <div className="col-span-6 sm:col-span-4 lg:col-span-2 mb-8 lg:mb-0">
          <p className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-white mb-8">Experiences</p>
          <ul className="flex flex-col gap-4 text-[0.95rem] font-light">
            {EXPERIENCES.map((e) => (
              <li key={e.to}>
                <Link to={e.to} className="hover:text-white transition-colors duration-300">{e.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Middle Column 2: Events */}
        <div className="col-span-6 sm:col-span-4 lg:col-span-3 lg:pl-8 mb-8 lg:mb-0">
          <p className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-white mb-8">Events</p>
          <ul className="flex flex-col gap-4 text-[0.95rem] font-light">
            {EVENTS.map((e) => (
              <li key={e.to}>
                <Link to={e.to} className="hover:text-white transition-colors duration-300">{e.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: About & Socials */}
        <div className="col-span-12 sm:col-span-4 lg:col-span-3 mb-8 lg:mb-0">
          <p className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-white mb-8">About</p>
          <ul className="flex flex-col gap-4 text-[0.95rem] font-light mb-8">
            {ABOUT.map((e) => (
              <li key={e.to}>
                <Link to={e.to} className="hover:text-white transition-colors duration-300">{e.label}</Link>
              </li>
            ))}
          </ul>
          
          <div className="flex gap-5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="text-[#b3b3b3] hover:text-white transition-colors duration-300"
              >
                <s.icon size={20} />
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Background Watermark */}
      <div className="absolute bottom-[8rem] md:bottom-[4.5rem] left-0 w-full overflow-hidden pointer-events-none flex justify-center px-4 md:px-[clamp(1.25rem,4vw,4.5rem)]">
        <h2
          aria-hidden
          className="font-display text-[7.5vw] md:text-[8vw] xl:text-[6.5rem] 2xl:text-[7.5rem] font-bold leading-none text-white opacity-[0.05] select-none whitespace-nowrap tracking-normal w-full max-w-[1560px] text-center"
        >
          M2N GROUP OF HOTELS
        </h2>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 relative z-10">
        <div className="editorial-grid items-center py-5">
          <p className="text-[0.8rem] font-light col-span-12 md:col-span-6 opacity-70">
            © 2026 M2N GROUP OF HOTELS · Lucknow, Uttar Pradesh
          </p>
          <div className="col-span-12 flex gap-8 md:col-span-6 md:justify-end text-[0.8rem] font-light opacity-70">
            <Link to="/privacy" className="hover:text-white hover:opacity-100 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white hover:opacity-100 transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

import { Link } from 'react-router-dom'

const HOTELS = [
  { label: 'M2N Zaarang Inn · Jaipur', to: '/hotels/1' },
  { label: 'M2N Aurelia Grand · Jaipur', to: '/hotels/2' },
  { label: 'M2N Shaurya Inn', to: '/hotels/3' },
  { label: 'M2N Udaipur · Lake Pavilion', to: '/hotels/4' },
  { label: 'M2N Shimla · Cedar Lodge', to: '/hotels/5' },
  { label: 'M2N Delhi · Lutyens', to: '/hotels/6' },
]

const EXPLORE = [
  { label: 'Rooms & Suites', to: '/rooms' },
  { label: 'Dining', to: '/dining' },
  { label: 'Spa & Wellness', to: '/spa' },
  { label: 'Experiences', to: '/experiences' },
  { label: 'Weddings & Events', to: '/events' },
]

const OFFERS = [
  { label: 'Early-Bird 25% Off', to: '/offers' },
  { label: 'Loyalty ×2 Points', to: '/offers' },
  { label: 'Stay Longer Save More', to: '/offers' },
  { label: 'Corporate & MICE', to: '/offers' },
  { label: 'Gift Cards', to: '/offers' },
]

const SUPPORT = [
  { label: 'My Bookings', to: '/my-bookings' },
  { label: 'Modify / Cancel', to: '/contact' },
  { label: 'Contact Concierge', to: '/contact' },
  { label: '+91 96587 100', to: 'tel:+9196587100' },
  { label: 'booking@m2nhotels.com', to: 'mailto:booking@m2nhotels.com' },
]

export default function Footer() {
  return (
    <footer className="bg-m2n-ink text-white pt-[50px] pb-6 px-6">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-8">
        
        {/* Brand Column (takes up 2 columns on lg) */}
        <div className="lg:col-span-2">
          <Link to="/" className="inline-block">
            <img src="/Logo/M2N_logo2.png" alt="M2N Logo" className="h-10 w-auto" />
          </Link>
          <p className="text-white/60 text-[13px] mt-4 leading-[1.6] max-w-[280px]">
            Where architecture breathes and time stands still. Five addresses across India, one discipline of restraint. Established 2012.
          </p>
        </div>

        {/* Hotels Column */}
        <div>
          <h5 className="text-[13px] font-bold mb-3.5 tracking-[0.5px] text-[#fbbf24] uppercase">Our Hotels</h5>
          <ul className="flex flex-col gap-2.5">
            {HOTELS.map((item, i) => (
              <li key={i}>
                <Link to={item.to} className="text-white/70 hover:text-white text-[12px] transition-colors">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Explore Column */}
        <div>
          <h5 className="text-[13px] font-bold mb-3.5 tracking-[0.5px] text-[#fbbf24] uppercase">Explore</h5>
          <ul className="flex flex-col gap-2.5">
            {EXPLORE.map((item, i) => (
              <li key={i}>
                <Link to={item.to} className="text-white/70 hover:text-white text-[12px] transition-colors">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Offers Column */}
        <div>
          <h5 className="text-[13px] font-bold mb-3.5 tracking-[0.5px] text-[#fbbf24] uppercase">Offers</h5>
          <ul className="flex flex-col gap-2.5">
            {OFFERS.map((item, i) => (
              <li key={i}>
                <Link to={item.to} className="text-white/70 hover:text-white text-[12px] transition-colors">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h5 className="text-[13px] font-bold mb-3.5 tracking-[0.5px] text-[#fbbf24] uppercase">Support</h5>
          <ul className="flex flex-col gap-2.5">
            {SUPPORT.map((item, i) => (
              <li key={i}>
                {item.to.startsWith('tel') || item.to.startsWith('mailto') ? (
                  <a href={item.to} className="text-white/70 hover:text-white text-[12px] transition-colors">{item.label}</a>
                ) : (
                  <Link to={item.to} className="text-white/70 hover:text-white text-[12px] transition-colors">{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div className="max-w-[1280px] mx-auto mt-9 pt-[18px] border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-[11px] text-white/50">
        <span>© 2026 M2N Group of Hotels · India · All rights reserved</span>
        <div className="flex gap-4">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
        </div>
      </div>
    </footer>
  )
}

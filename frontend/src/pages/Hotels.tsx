import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { RiArrowRightLine } from 'react-icons/ri'
import axios from 'axios'
import { inr, EASE } from '../lib/lib'

export default function Hotels() {
  const [hotels, setHotels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActiveState] = useState<number | null>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const activeRef = useRef<number | null>(null)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5000/api'}/public/hotels`)
      .then(res => {
        setHotels(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching hotels:', err)
        setLoading(false)
      })
  }, [])

  const setActive = (i: number | null) => {
    activeRef.current = i
    setActiveState(i)
  }

  useEffect(() => {
    let raf = 0
    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
    }
    const loop = () => {
      raf = requestAnimationFrame(loop)
      current.current.x += (target.current.x - current.current.x) * 0.1
      current.current.y += (target.current.y - current.current.y) * 0.1
      if (activeRef.current !== null) setPos({ x: current.current.x, y: current.current.y })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    loop()
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>Our Hotels — M2N Group of Hotels</title>
        <meta name="description" content="Five addresses: Jaipur Palace, Goa Coast House, Delhi Residency, Udaipur Lake House, Shimla Ridge Lodge." />
      </Helmet>

      {/* HERO */}
      <section className="overflow-hidden pb-20 pt-40 md:pb-28 md:pt-48">
        <div className="editorial-grid">
          <p className="u-label col-span-12 text-terracotta">The Portfolio</p>
          <h1 className="t-hero col-span-12 mt-6 whitespace-nowrap text-[clamp(4rem,17vw,15rem)] leading-[0.85]">
            OUR <em className="font-normal italic">hotels</em>
          </h1>
          <p className="col-span-12 mt-10 max-w-[540px] text-[0.95rem] font-light leading-[1.85] text-muted md:col-span-5">
            Five buildings that were worth saving — each restored rather than built, each governed
            by the same restraint charter. Hover an address to look through its window.
          </p>
        </div>
      </section>

      {/* HOTEL LIST */}
      <section className="relative pb-16 md:pb-24">
        <div className="editorial-grid">
          <div className="col-span-12 border-t border-line">
            {loading ? (
               <div className="py-12 text-center text-muted">Loading hotels...</div>
            ) : hotels.map((h, i) => (
              <Link
                key={h._id}
                to={`/hotels/${h._id}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="row-shift group grid grid-cols-12 items-center gap-3 border-b border-line py-8 md:py-12"
              >
                <span className="u-label col-span-2 text-warm md:col-span-1">0{i + 1}</span>
                <span className="col-span-10 md:col-span-6 lg:col-span-7">
                  <span className="t-section block text-[clamp(2rem,5vw,4.6rem)] leading-[1.02] transition-colors duration-400 group-hover:text-terracotta">
                    {h.name}
                  </span>
                  {/* Mobile inline image */}
                  <span className="img-frame mt-5 block aspect-[16/10] w-full md:hidden">
                    <img src={h.images && h.images[0] ? h.images[0] : 'https://images.unsplash.com/photo-1542314831-c53cd3816002?q=80&w=1000'} alt={h.name} loading="lazy" />
                  </span>
                </span>
                <span className="col-span-9 col-start-3 md:col-span-3 md:col-start-8">
                  <span className="u-label-sm block text-muted">{h.type || 'Heritage Hotel'} · {h.totalRooms || 0} Rooms</span>
                  <span className="u-label-sm mt-2 block text-warm">From {inr(h.priceFrom || 0)}</span>
                </span>
                <span 
                  className="col-span-3 col-start-10 flex justify-end md:col-span-2 md:col-start-11 py-4"
                  onMouseEnter={() => setActive(null)}
                  onMouseLeave={() => setActive(i)}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-ink transition-all duration-500 group-hover:border-terracotta group-hover:bg-terracotta group-hover:text-porcelain">
                    <RiArrowRightLine size={18} />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Cursor-following preview */}
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key={active}
              className="pointer-events-none fixed z-40 hidden h-[220px] w-[340px] overflow-hidden lg:block shadow-2xl"
              style={{
                left: 0,
                top: 0,
                x: pos.x - 170,
                y: pos.y - 110,
              }}
              initial={{ clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
              exit={{ clipPath: 'inset(0% 0% 100% 0%)', opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <img src={hotels[active].images && hotels[active].images[0] ? hotels[active].images[0] : 'https://images.unsplash.com/photo-1542314831-c53cd3816002?q=80&w=1000'} alt="" className="h-full w-full object-cover" />
              <span className="u-label-sm absolute bottom-4 left-5 text-porcelain">
                {hotels[active].city} — {hotels[active].state || 'India'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  )
}

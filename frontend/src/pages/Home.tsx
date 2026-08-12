import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RiArrowRightLine, RiArrowRightUpLine } from 'react-icons/ri'
import ImageReveal from '../components/ImageReveal'
import ParallaxImage from '../components/ParallaxImage'
import HeroBookingCard from '../components/HeroBookingCard'
import { hotels } from '../data/hotels'
import { rooms } from '../data/rooms'
import { u, inr, EASE } from '../lib/lib'

gsap.registerPlugin(ScrollTrigger)

/* ---------- Count-up stat ---------- */
function Stat({ value, suffix, label, infinity = false }: { value: number; suffix: string; label: string; infinity?: boolean }) {
  const numRef = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    if (infinity) return
    const el = numRef.current
    if (!el) return
    const obj = { v: 0 }
    const tween = gsap.to(obj, {
      v: value,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate: () => {
        el.textContent = String(Math.round(obj.v)).padStart(2, '0')
      },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [value, infinity])

  return (
    <div>
      <div className="font-display text-[clamp(4.5rem,9vw,9rem)] font-light leading-none text-ink">
        {infinity ? (
          <span className="italic">∞</span>
        ) : (
          <>
            <span ref={numRef}>00</span>
            <span className="text-terracotta">{suffix}</span>
          </>
        )}
      </div>
      <p className="u-label mt-5 text-muted">{label}</p>
    </div>
  )
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const philRef = useRef<HTMLElement>(null)

  const [hotelsCount, setHotelsCount] = useState(0)
  const [roomsCount, setRoomsCount] = useState(0)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5000/api'}/public/hotels`)
      .then(res => {
        if (res.data && Array.isArray(res.data)) setHotelsCount(res.data.length)
      }).catch(err => console.error(err))

    axios.get(`${import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5000/api'}/public/categories`)
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          const total = res.data.reduce((sum: number, cat: any) => sum + (cat.numberOfRooms || 0), 0);
          setRoomsCount(total);
        }
      }).catch(err => console.error(err))
  }, [])

  /* Scrubbed marquee */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(marqueeRef.current, {
        xPercent: -28,
        ease: 'none',
        scrollTrigger: {
          trigger: marqueeRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  /* Pinned philosophy */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: philRef.current,
        start: 'top top+=90',
        end: '+=38%',
        pin: true,
        pinSpacing: true,
      })
    }, philRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <Helmet>
        <title>M2N Group of Hotels — Where Architecture Breathes</title>
        <meta name="description" content="Five addresses across India — Jaipur, Goa, Delhi, Udaipur, Shimla. Heritage palaces, coastal houses and mountain lodges rendered with editorial restraint." />
      </Helmet>

      {/* ============ HERO ============ */}
      <section ref={heroRef} className="relative min-h-[100svh] bg-ink flex flex-col justify-between">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="https://images.pexels.com/videos/37797114/pexels-photo-37797114.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920"
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.8, ease: EASE }}
          >
            <source
              src="https://videos.pexels.com/video-files/37797114/16032427_3840_2160_60fps.mp4"
              type="video/mp4"
            />
          </motion.video>
          <div className="absolute inset-0 bg-gradient-to-b from-porcelain/65 via-ink/5 to-ink/65" />
        </div>

        <div className="editorial-grid relative flex-1">
          <div className="col-span-12 flex items-start justify-between pt-28">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="u-label text-muted"
            >
              Group of Hotels — India
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="u-label hidden text-muted sm:block"
            >
              Est. 2012
            </motion.p>
          </div>

          {/* Quiet wordmark lets the palace remain the dominant visual. */}
          <div className="absolute left-0 top-[35%] md:top-[43%] w-full -translate-y-1/2 text-center">
            <h1 className="t-hero whitespace-nowrap text-[clamp(4.5rem,9vw,8rem)] leading-[0.8] tracking-[-0.03em] text-porcelain">
              {['M', '2', 'N'].map((ch, i) => (
                <span key={i} className="inline-block overflow-hidden align-top">
                  <motion.span
                    className="inline-block"
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.1, ease: EASE, delay: 0.2 + i * 0.12 }}
                  >
                    {ch}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.9 }}
              className="t-quote mx-auto mt-8 max-w-[560px] px-6 text-[clamp(1.4rem,2.6vw,2.4rem)] text-porcelain"
            >
              Where architecture breathes <span className="text-porcelain/75">and time stands still.</span>
            </motion.p>
          </div>

          {/* Bottom row */}
          <div className="col-span-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-10 pb-10 md:pb-36 mt-[45vh] md:mt-0">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.05 }}
              className="max-w-[340px] text-[0.95rem] font-light leading-[1.8] text-porcelain/80"
            >
              Five addresses across India — a rose-stone palace, a coastal house, a Lutyens mansion,
              a lake pavilion, a cedar lodge. One discipline: restraint.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.15 }}
            >
              <Link to="/hotels" className="u-label link-line text-porcelain">
                Explore Hotels <RiArrowRightLine size={16} className="text-porcelain" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Hero Booking Card positioned naturally on mobile, absolute bottom on desktop */}
        <div className="relative z-20 px-4 pb-6 pt-10 md:pt-0 md:absolute md:bottom-6 md:left-0 md:right-0 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <HeroBookingCard />
          </motion.div>
        </div>
      </section>

      {/* ============ SCRUBBED MARQUEE ============ */}
      <section className="overflow-hidden border-y border-line py-8 md:py-10">
        <div ref={marqueeRef} className="flex w-max whitespace-nowrap will-change-transform">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="t-section flex items-center text-[clamp(1.6rem,3.4vw,3rem)] text-ink">
              <span className="mx-8 uppercase tracking-widest font-light">M2N Group Of Hotels</span>
              <span className="h-1.5 w-1.5 rounded-full bg-terracotta opacity-50" />
            </span>
          ))}
        </div>
      </section>

      {/* ============ PHILOSOPHY (PINNED) ============ */}
      <section ref={philRef} className="relative pt-32 md:pt-44 pb-16 md:pb-24">
        <div className="editorial-grid items-center">
          <div className="col-span-12 md:col-span-6">
            <p className="u-label text-terracotta">01 — Philosophy</p>
            <blockquote className="t-quote mt-10 text-[clamp(1.9rem,4vw,3.6rem)] text-ink">
              &ldquo;Luxury is not opulence. It is <em className="text-terracotta">proportion</em>, light,
              and the discipline of <em className="text-sage">restraint</em>.&rdquo;
            </blockquote>
            <p className="mt-12 max-w-[460px] text-[0.95rem] font-light leading-[1.85] text-muted">
              Every M2N house begins with subtraction. We remove until only the essential remains —
              then we proportion what is left with the patience of a manuscript illuminator. Nothing
              in our houses shouts. Everything holds.
            </p>
            <p className="u-label-sm mt-10 text-warm">— The M2N Principle, No. 001</p>
          </div>
          <div className="col-span-12 mt-16 md:col-span-5 md:col-start-8 md:mt-0">
            <ParallaxImage
              src={u('photo-1564501049412-61c2a3083791', 1400)}
              speed={0.55}
              className="aspect-[3/4]"
              viewCursor
            />
            <div className="mt-4 flex items-center justify-between">
              <p className="u-label-sm text-muted">Courtyard of the First House</p>
              <p className="u-label-sm text-warm">Jaipur, 0630 hrs</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SPACES — STACKING ANIMATION ============ */}
      <section className="bg-cream/60 pt-16 md:pt-24 pb-12 relative border-t border-line">
        <div className="editorial-grid mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-6">
            <p className="u-label text-terracotta">02 — Spaces</p>
            <h2 className="t-hero mt-8 text-[clamp(4rem,10vw,8.5rem)]">SPACES</h2>
            <p className="mt-8 max-w-[380px] text-[0.95rem] font-light leading-[1.85] text-muted">
              Sixty keys across five houses, each proportioned to its landscape. Scroll to explore the rooms.
            </p>
          </div>
        </div>

        <div className="px-6 md:px-12 pb-12 md:pb-16 relative max-w-7xl mx-auto flex flex-col gap-[15vh]">
          {rooms.map((r, i) => (
            <div 
              key={r.id} 
              className="sticky flex flex-col md:flex-row items-center gap-8 md:gap-16 bg-white border border-line p-6 md:p-12 shadow-md rounded-xl w-full mx-auto"
              style={{
                top: `calc(10vh + ${i * 40}px)`,
                zIndex: i
              }}
            >
              <div className="img-frame relative h-[40vh] md:h-[65vh] w-full md:w-3/5 shrink-0 rounded-lg overflow-hidden" data-cursor="view">
                <img src={r.image} alt={r.name} loading="lazy" className="object-cover w-full h-full" />
                <span className="absolute right-5 top-4 font-display text-[4rem] md:text-[6rem] font-light leading-none text-white drop-shadow-md">
                  0{i + 1}
                </span>
              </div>
              <div className="w-full md:w-2/5 md:pr-8">
                <p className="u-label-sm text-sage">{hotels.find((h) => h.id === r.hotels[0])?.city} · {r.size} SQ.FT</p>
                <h3 className="t-section mt-5 text-[clamp(2rem,3.5vw,3rem)] leading-tight">{r.name}</h3>
                <p className="mt-6 text-[0.92rem] font-light leading-[1.8] text-muted">{r.desc}</p>
                <p className="u-label mt-8 text-terracotta">From {inr(r.price)} / night</p>
                <Link to="/rooms" className="u-label link-line mt-6 text-ink">
                  View Room <RiArrowRightLine size={15} className="text-terracotta" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ MEETINGS, EVENTS & WEDDINGS ============ */}
      <section className="relative overflow-visible pt-16 md:pt-20 pb-20 md:pb-24 bg-cream/30">
        <div className="editorial-grid">
          <div className="col-span-12 text-center mb-16 md:mb-24">
            <p className="u-label text-terracotta">03 — Gatherings</p>
            <h2 className="t-section mt-6 text-[clamp(2.4rem,4.5vw,4.2rem)] max-w-4xl mx-auto">
              Spaces designed for <em className="font-normal italic">moments,</em>
              <br />
              meetings, and milestones.
            </h2>
          </div>

          <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {/* Meetings */}
            <Link to="/events" className="group block cursor-pointer">
              <div className="img-frame aspect-[4/5] rounded-sm" data-cursor="view">
                <img src={u('photo-1517457373958-b7bdd4587205', 800)} alt="Meetings" loading="lazy" />
              </div>
              <div className="mt-6 flex justify-between items-center">
                <h3 className="t-section text-2xl group-hover:text-terracotta transition-colors">Meetings</h3>
                <RiArrowRightLine className="text-terracotta opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 duration-300" />
              </div>
              <p className="mt-3 text-[0.95rem] text-muted font-light leading-[1.8]">
                Boardrooms and conference spaces proportioned for focus, strategy, and vision.
              </p>
            </Link>

            {/* Events */}
            <Link to="/events" className="group block cursor-pointer md:mt-16">
              <div className="img-frame aspect-[4/5] rounded-sm" data-cursor="view">
                <img src={u('photo-1511795409834-ef04bbd61622', 800)} alt="Events" loading="lazy" />
              </div>
              <div className="mt-6 flex justify-between items-center">
                <h3 className="t-section text-2xl group-hover:text-terracotta transition-colors">Events</h3>
                <RiArrowRightLine className="text-terracotta opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 duration-300" />
              </div>
              <p className="mt-3 text-[0.95rem] text-muted font-light leading-[1.8]">
                Gala dinners, private parties, and grand celebrations in heritage settings.
              </p>
            </Link>

            {/* Weddings */}
            <Link to="/weddings" className="group block cursor-pointer md:mt-32">
              <div className="img-frame aspect-[4/5] rounded-sm" data-cursor="view">
                <img src={u('photo-1519225421980-715cb0215aed', 800)} alt="Weddings" loading="lazy" />
              </div>
              <div className="mt-6 flex justify-between items-center">
                <h3 className="t-section text-2xl group-hover:text-terracotta transition-colors">Weddings</h3>
                <RiArrowRightLine className="text-terracotta opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 duration-300" />
              </div>
              <p className="mt-3 text-[0.95rem] text-muted font-light leading-[1.8]">
                Royal processions, intimate ceremonies, and timeless memories crafted with restraint.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ EXPERIENCES BENTO ============ */}
      <section className="border-t border-line py-20 md:py-24">
        <div className="editorial-grid">
          <p className="u-label col-span-12 text-terracotta md:col-span-3">04 — Experiences</p>
          <h2 className="t-hero col-span-12 -mt-2 whitespace-nowrap text-[clamp(3rem,9vw,7.5rem)] leading-[0.95] md:col-span-11">
            EXPE<em className="font-normal italic">riences</em>
          </h2>

          <div className="col-span-12 mt-16 grid grid-cols-1 gap-6 md:grid-cols-4 md:auto-rows-[230px]">
            {/* Tile 1 — tall */}
            <Link to="/experiences" className="group img-frame img-zoom-slow relative border border-line md:col-span-2 md:row-span-2" data-cursor="view">
              <img src={u('photo-1598091383021-15ddea10925d', 1400)} alt="Heritage walks" loading="lazy" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/40 to-transparent p-7">
                <div>
                  <p className="u-label-sm text-porcelain/80">Jaipur · 3 Hours</p>
                  <p className="t-section mt-2 text-3xl text-porcelain">Heritage Walks</p>
                </div>
                <RiArrowRightUpLine className="text-porcelain" size={22} />
              </div>
            </Link>
            {/* Tile 2 — wide */}
            <Link to="/experiences" className="group img-frame img-zoom-slow relative border border-line md:col-span-2" data-cursor="view">
              <img src={u('photo-1556910103-1c02745aae4d', 1400)} alt="Culinary journeys" loading="lazy" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/40 to-transparent p-6">
                <p className="t-section text-2xl text-porcelain">Culinary Journeys</p>
                <RiArrowRightUpLine className="text-porcelain" size={20} />
              </div>
            </Link>
            {/* Tile 3 */}
            <Link to="/spa" className="group img-frame img-zoom-slow relative border border-line" data-cursor="view">
              <img src={u('photo-1544161515-4ab6ce6db874', 1200)} alt="Spa rituals" loading="lazy" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/40 to-transparent p-6">
                <p className="t-section text-2xl text-porcelain">Spa Rituals</p>
              </div>
            </Link>
            {/* Tile 4 */}
            <Link to="/dining" className="group img-frame img-zoom-slow relative border border-line" data-cursor="view">
              <img src={u('photo-1414235077428-338989a2e8c0', 1200)} alt="Royal dining" loading="lazy" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/40 to-transparent p-6">
                <p className="t-section text-2xl text-porcelain">Royal Dining</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ NUMBERS ============ */}
      <section className="border-t border-line bg-cream py-16 md:py-24">
        <div className="editorial-grid">
          <p className="u-label col-span-12 text-terracotta md:col-span-3">05 — In Numbers</p>
          <div className="col-span-12 mt-10 grid grid-cols-2 gap-y-16 lg:grid-cols-4">
            <Stat value={hotelsCount} suffix="" label="Hotels" />
            <Stat value={roomsCount} suffix="" label="Rooms & Suites" />
            <Stat value={5} suffix="" label="Years of Craft" />
            <Stat value={0} suffix="" label="Stories Told" infinity />
          </div>
          <div className="col-span-12 mt-24 flex flex-col items-start justify-between gap-10 border-t border-line pt-14 md:flex-row md:items-end">
            <h3 className="t-quote max-w-[640px] text-[clamp(1.8rem,3.6vw,3.2rem)]">
              The numbers end. <em className="text-terracotta">The stories don&rsquo;t.</em>
            </h3>
            <Link to="/about" className="btn-outline">
              Our Story <RiArrowRightLine size={15} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

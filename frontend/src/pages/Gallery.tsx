import { useLayoutEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Keyboard } from 'swiper/modules'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RiCloseLine } from 'react-icons/ri'
import 'swiper/css'
import 'swiper/css/navigation'
import { u } from '../lib/lib'

gsap.registerPlugin(ScrollTrigger)

const IDS = [
  'photo-1566073771259-6a8506099945',
  'photo-1582719478250-c89cae4dc85b',
  'photo-1564501049412-61c2a3083791',
  'photo-1540541338287-41700207dee6',
  'photo-1544161515-4ab6ce6db874',
  'photo-1414235077428-338989a2e8c0',
  'photo-1519741497674-611481863552',
  'photo-1512343879784-a960bf40e7f2',
  'photo-1598091383021-15ddea10925d',
  'photo-1618773928121-c32242e63f39',
  'photo-1540555700478-4be289fbecef',
  'photo-1520250497591-112f2f40a3f4',
  'photo-1517248135467-4c7edcad34c4',
  'photo-1506905925346-21bda4d32df4',
  'photo-1578683010236-d716f9a3f461',
  'photo-1476514525535-07fb3b4ae5f1',
  'photo-1542314831-068cd1dbfeeb',
  'photo-1519225421980-715cb0215aed',
  'photo-1445019980597-93fa8acb246c',
  'photo-1522708323590-d24dbb6b0267',
]

const CAPTIONS = [
  'The Lake House — Udaipur', 'Heritage Chamber', 'Courtyard, First House', 'The Coast House cliff pool',
  'Spa ritual, Goa', 'Copper & Vine', 'A monsoon wedding', 'Coconut grove morning',
  'Hawa Mahal walk', 'Lake Pavilion', 'Steam grotto', 'Pool at first light',
  'The Verandah', 'Ridge line, Shimla', 'Ridge Suite', 'The wooden launch',
  'Dusk, Delhi Residency', 'Table six, set', 'The lodge balcony', 'Residence corridor',
]

export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const rightRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(rightRef.current, {
        yPercent: -14,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, wrapRef)
    
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      ctx.revert()
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const left = IDS.filter((_, i) => i % 2 === 0)
  const right = IDS.filter((_, i) => i % 2 === 1)
  const heights = [340, 540, 420, 600, 300, 480, 380, 560, 440, 320]
  const scale = isMobile ? 0.45 : 1

  return (
    <>
      <Helmet>
        <title>Gallery — M2N Group of Hotels</title>
        <meta name="description" content="Twenty frames from five addresses — courtyards, spa grottos, lake terraces and ridge lines." />
      </Helmet>

      {/* HEADER */}
      <div className="pb-16 pt-24 md:pt-32 px-6 max-w-[1280px] mx-auto text-center border-b border-border">
        <p className="text-m2n-saffron font-bold tracking-[2px] text-[11px] mb-3 uppercase">The Archive</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] text-m2n-ink font-bold leading-tight italic">
          Gallery
        </h1>
        <p className="mt-6 text-[11px] font-bold text-text-3 uppercase tracking-widest max-w-lg mx-auto">
          Twenty frames · Two speeds · Click any window
        </p>
      </div>

      {/* TWO-SPEED COLUMNS */}
      <section ref={wrapRef} className="pb-12 md:pb-24 pt-16 px-6 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-2 gap-4 md:gap-8">
          <div className="col-span-1">
            {left.map((id, i) => {
              const idx = i * 2
              return (
                <figure
                  key={id}
                  className="rounded-xl overflow-hidden relative mb-4 md:mb-8 border border-border cursor-pointer group"
                  style={{ height: heights[i % heights.length] * scale }}
                  onClick={() => setLightbox(idx)}
                >
                  <img src={u(id, 1000)} alt={CAPTIONS[idx]} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-m2n-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <figcaption className="text-[10px] font-bold text-white uppercase tracking-wider absolute bottom-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {CAPTIONS[idx]}
                  </figcaption>
                </figure>
              )
            })}
          </div>
          <div className="col-span-1 will-change-transform" ref={rightRef} style={{ marginTop: isMobile ? 0 : -60, marginBottom: isMobile ? -180 : -340 }}>
            {right.map((id, i) => {
              const idx = i * 2 + 1
              return (
                <figure
                  key={id}
                  className="rounded-xl overflow-hidden relative mb-4 md:mb-8 border border-border cursor-pointer group"
                  style={{ height: (heights[(i + 3) % heights.length] + 40) * scale }}
                  onClick={() => setLightbox(idx)}
                >
                  <img src={u(id, 1000)} alt={CAPTIONS[idx]} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-m2n-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <figcaption className="text-[10px] font-bold text-white uppercase tracking-wider absolute bottom-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {CAPTIONS[idx]}
                  </figcaption>
                </figure>
              )
            })}
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-[95] bg-white/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setLightbox(null)}
              aria-label="Close gallery"
              className="absolute right-6 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-border text-m2n-ink transition-colors hover:border-m2n-saffron hover:text-m2n-saffron bg-white shadow-sm"
            >
              <RiCloseLine size={22} />
            </button>
            <p className="text-[11px] font-bold text-text-3 uppercase tracking-widest absolute left-6 top-9 z-10">
              {String(lightbox + 1).padStart(2, '0')} / {IDS.length}
            </p>
            <div className="relative flex h-full items-center justify-center p-6 md:p-24">
              <Swiper
                initialSlide={lightbox}
                navigation
                keyboard={{ enabled: true }}
                modules={[Navigation, Keyboard]}
                className="h-full w-full"
                onSlideChange={(s) => setLightbox(s.activeIndex)}
              >
                {IDS.map((id, i) => (
                  <SwiperSlide key={id} className="flex items-center justify-center">
                    <img
                      src={u(id, 2000)}
                      alt={CAPTIONS[i]}
                      className="max-h-full w-auto max-w-full object-contain shadow-2xl rounded-sm"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <p className="text-[11px] font-bold text-m2n-ink uppercase tracking-widest absolute bottom-8 left-1/2 z-10 -translate-x-1/2 bg-white px-4 py-2 rounded shadow-sm border border-border">
              {CAPTIONS[lightbox]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

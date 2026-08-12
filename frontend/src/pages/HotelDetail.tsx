import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  RiArrowRightLine,
  RiRestaurantLine,
  RiHeartPulseLine,
  RiSailboatLine,
  RiServiceLine,
  RiMapPinLine,
  RiRulerLine,
  RiGroupLine,
  RiCheckLine,
  RiArrowRightUpLine,
  RiArrowLeftSLine,
  RiArrowRightSLine
} from 'react-icons/ri'
import axios from 'axios'
import ParallaxImage from '../components/ParallaxImage'
import { inr, EASE } from '../lib/lib'
import BookingWidget from '../components/BookingWidget'

gsap.registerPlugin(ScrollTrigger)

const AMENITIES = [
  { cat: 'DINING', icon: RiRestaurantLine, items: ['Signature restaurant', 'Courtyard all-day café', 'Private dining room', 'Wine cellar'] },
  { cat: 'WELLNESS', icon: RiHeartPulseLine, items: ['Ayurvedic spa pavilion', 'Yoga at first light', 'Heated pool', 'Meditation garden'] },
  { cat: 'LEISURE', icon: RiSailboatLine, items: ['Heritage walks', 'Culinary studio', 'Library & listening room', 'Curated city beats'] },
  { cat: 'SERVICES', icon: RiServiceLine, items: ['Dedicated butler', 'Concierge desk', 'Valet & transfers', 'In-residence chef'] },
]

const BEATS = [
  {
    tag: 'Architecture',
    title: 'The bones remember.',
    body: 'Every structural decision defers to the original hand — cornices, courtyards and staircases are read first, touched last.',
  },
  {
    tag: 'Interiors',
    title: 'Rooms with a pulse.',
    body: 'Lime plaster, hand-planed teak, brass that will age gracefully for fifty years. Surfaces you will want to touch twice.',
  },
  {
    tag: 'Grounds',
    title: 'Landscape as ritual.',
    body: 'Gardens are kept to wilderness-adjacent discipline — pruned enough to walk, wild enough to think.',
  },
]

const HotelRoomCard = ({ r, i, hotel, setActiveBookingRoom }: { r: any, i: number, hotel: any, setActiveBookingRoom: (id: string) => void }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const allImages = [
    ...(r.images && r.images.length > 0 ? [r.images[0]] : []),
    ...(r.galleryImages || [])
  ];
  
  if (allImages.length === 0) {
    allImages.push('https://images.unsplash.com/photo-1542314831-c53cd3816002?q=80&w=1000');
  }

  const nextImg = () => {
    setCurrentImgIndex((prev) => (prev + 1) % allImages.length);
  };
  
  const prevImg = () => {
    setCurrentImgIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div 
      className="sticky w-[90vw] max-w-5xl mx-auto mb-16 last:mb-0 shadow-2xl flex flex-col md:flex-row items-stretch gap-6 md:gap-12 bg-white border border-line p-5 md:p-6 rounded-xl"
      style={{ top: `calc(12vh + ${i * 1.5}rem)` }}
    >
      {/* Image */}
      <div className="img-frame relative h-[30vh] md:h-auto w-full md:w-3/5 shrink-0 rounded-lg overflow-hidden group md:flex-grow" data-cursor="view">
        <img
          src={allImages[currentImgIndex]}
          alt={r.name}
          loading={i === 0 ? 'eager' : 'lazy'}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        <span className="absolute right-5 top-4 font-display text-[4rem] md:text-[6rem] font-light leading-none text-white drop-shadow-md">
          0{i + 1}
        </span>

        {allImages.length > 1 && (
          <div className="absolute bottom-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={prevImg}
              className="bg-black/50 text-white p-3 rounded-full hover:bg-black transition-colors"
            >
              <RiArrowLeftSLine size={24} />
            </button>
            <button
              onClick={nextImg}
              className="bg-black/50 text-white p-3 rounded-full hover:bg-black transition-colors"
            >
              <RiArrowRightSLine size={24} />
            </button>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="w-full md:w-2/5 md:pr-4 lg:pr-6 py-2 flex flex-col">
        <div>
          <p className="u-label text-terracotta uppercase">
            {hotel.city}
          </p>
          <h2 className="t-section mt-1 md:mt-2 text-[clamp(1.8rem,3vw,2.5rem)] leading-tight">{r.name}</h2>
          <div className="mt-2 md:mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="u-label-sm flex items-center gap-1.5 text-muted">
              <RiRulerLine size={14} className="text-terracotta" /> {r.roomSize || '45'} SQ.FT
            </span>
            <span className="u-label-sm flex items-center gap-1.5 text-muted">
              <RiGroupLine size={14} className="text-terracotta" /> Sleeps {r.capacity}
            </span>
          </div>
          <p className="mt-2 md:mt-3 max-w-[420px] text-[0.9rem] font-light leading-[1.6] text-muted line-clamp-3">
            {Array.isArray(r.features) ? r.features.join(', ') : (r.features || 'A luxurious room experience.')}
          </p>
          <ul className="mt-2 md:mt-3 grid max-w-[420px] grid-cols-2 gap-x-3 gap-y-1.5 pb-2">
            {Array.isArray(r.features) && r.features.slice(0, 10).map((f: string) => (
              <li key={f} className="flex items-start gap-1.5 text-[0.8rem] font-light text-muted">
                <RiCheckLine size={14} className="shrink-0 text-sage mt-0.5" />
                <span className="line-clamp-2">{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto flex items-end justify-between border-t border-line pt-3 md:pt-4 mb-2">
          <div>
            <p className="u-label-sm text-warm">From</p>
            <p className="t-section mt-1 text-[clamp(1.4rem,2vw,2rem)] text-terracotta">
              {inr(r.price)} <span className="text-base text-muted">/ night</span>
            </p>
          </div>
          <button
            onClick={() => setActiveBookingRoom(r._id)}
            className="u-label link-line text-ink shrink-0 ml-4 mb-1"
          >
            Reserve <RiArrowRightUpLine size={15} className="text-terracotta inline" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function HotelDetail() {
  const { id } = useParams()
  const [hotel, setHotel] = useState<any>(null)
  const [hotelRooms, setHotelRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [beat, setBeat] = useState(0)
  const [activeBookingRoom, setActiveBookingRoom] = useState<string | null>(null)
  const beatsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelRes, roomsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5000/api'}/public/hotels/${id}`),
          axios.get(`${import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5000/api'}/public/hotels/${id}/categories`)
        ])
        setHotel(hotelRes.data)
        setHotelRooms(roomsRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  useLayoutEffect(() => {
    if (!beatsRef.current) return
    const sections = beatsRef.current.querySelectorAll('[data-beat]')
    const triggers: ScrollTrigger[] = []
    sections.forEach((sec, i) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: sec,
          start: 'top 60%',
          end: 'bottom 60%',
          onEnter: () => setBeat(i),
          onEnterBack: () => setBeat(i),
        })
      )
    })
    return () => triggers.forEach((t) => t.kill())
  }, [id])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted">Loading hotel details...</div>
  }

  if (!hotel) return <Navigate to="/hotels" replace />

  // Derived properties with fallbacks
  const totalRooms = hotelRooms.reduce((acc, curr) => acc + (curr.numberOfRooms || 0), 0)
  const minPrice = hotelRooms.length > 0 ? Math.min(...hotelRooms.map(r => r.price)) : 0
  const heroImage = hotel.images && hotel.images.length > 1 ? hotel.images[1] : (hotel.images?.[0] || 'https://images.unsplash.com/photo-1542314831-c53cd3816002?q=80&w=1000')
  const cardImage = hotel.images?.[0] || 'https://images.unsplash.com/photo-1542314831-c53cd3816002?q=80&w=1000'
  const gallery = hotel.images && hotel.images.length >= 3 ? hotel.images.slice(0, 3) : [cardImage, heroImage, cardImage]
  const state = hotel.state || 'India'
  const type = hotel.type || 'Heritage Hotel'
  const description = hotel.description || ''
  const tagline = hotel.tagline || (description ? description.split('.')[0] + '.' : 'A beautiful luxury hotel.')
  const paragraphs = description ? description.split('\n').filter((p: string) => p.trim() !== '') : []

  return (
    <>
      <Helmet>
        <title>{hotel.name} — M2N Group of Hotels</title>
        <meta name="description" content={hotel.tagline} />
      </Helmet>

      {/* FULL BLEED HERO */}
      <section className="relative h-[100svh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          <motion.img
            src={heroImage}
            alt={hotel.name}
            className="h-full w-full object-cover"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.8, ease: EASE }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
        <div className="editorial-grid absolute inset-x-0 bottom-0 pb-14">
          <div className="col-span-12">
            <p className="u-label text-porcelain/80">
              {hotel.city} · {state} — {type}
            </p>
            <h1 className="t-hero mt-5 text-[clamp(3rem,9vw,7.5rem)] leading-[0.9] text-porcelain">
              {hotel.name}
            </h1>
          </div>
        </div>
      </section>

      {/* INFO BAR */}
      <section className="border-b border-line">
        <div className="editorial-grid">
          {[
            ['Type', type],
            ['Keys', String(totalRooms)],
            ['From', `${inr(minPrice)} / night`],
            ['Where', `${hotel.city}, ${state}`],
          ].map(([k, v], i) => (
            <div key={k} className={`col-span-6 border-line py-8 md:col-span-3 ${i !== 0 ? 'md:border-l md:pl-8' : ''}`}>
              <p className="u-label-sm text-warm">{k}</p>
              <p className="t-section mt-2 text-[clamp(1.2rem,2vw,1.8rem)]">{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INTRO */}
      <section className="py-12 md:py-32">
        <div className="editorial-grid">
          <p className="u-label col-span-12 text-terracotta md:col-span-3">The House</p>
          <div className="col-span-12 md:col-span-6 md:col-start-5">
            <h2 className="t-quote text-[clamp(1.8rem,3.4vw,3.2rem)]">{tagline}</h2>
            {paragraphs.map((p: string, i: number) => (
              <p key={i} className="mt-8 max-w-[540px] text-[0.95rem] font-light leading-[1.85] text-muted">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* PINNED IMAGE SEQUENCE */}
      <section className="border-t border-line py-12 md:py-0">
        <div className="editorial-grid">
          {/* Sticky crossfading image */}
          <div className="col-span-12 md:col-span-6">
            <div className="sticky top-[14vh] hidden h-[72vh] overflow-hidden md:block" data-cursor="view">
              {gallery.map((g: string, i: number) => (
                <img
                  key={i}
                  src={g}
                  alt=""
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${beat === i ? 'opacity-100' : 'opacity-0'}`}
                />
              ))}
              <span className="absolute left-6 top-5 font-display text-6xl font-light text-porcelain/90">
                0{beat + 1}
              </span>
            </div>
          </div>
          {/* Scrolling beats */}
          <div ref={beatsRef} className="col-span-12 md:col-span-5 md:col-start-8">
            {BEATS.map((b, i) => (
              <div
                key={b.tag}
                data-beat
                className="flex md:min-h-[60vh] flex-col justify-center border-b border-line py-10 md:py-16 last:border-0"
              >
                <p className="u-label-sm text-sage">{`0${i + 1} — ${b.tag}`}</p>
                <h3 className="t-section mt-5 text-[clamp(2rem,3.6vw,3.4rem)]">{b.title}</h3>
                <p className="mt-6 max-w-[460px] text-[0.95rem] font-light leading-[1.85] text-muted">{b.body}</p>
                <div className="img-frame mt-10 aspect-[4/3] md:hidden">
                  <img src={gallery[i]} alt={b.tag} loading="lazy" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROOMS — OVERLAPPING SCROLL */}
      {hotelRooms.length > 0 && (
        <section className="bg-cream/60 py-12 md:pt-32 md:pb-16 relative">
          <div className="editorial-grid mb-8 md:mb-16 relative z-10">
            <div className="col-span-12 md:col-span-6">
              <p className="u-label text-terracotta">Stay</p>
              <h2 className="t-hero mt-6 text-[clamp(3rem,7vw,6rem)] leading-[0.9]">Select your<br/>room</h2>
              <p className="mt-6 max-w-[400px] text-[0.95rem] font-light leading-[1.8] text-muted">
                {totalRooms} keys across {hotelRooms.length} temperaments. Each designed to reflect the spirit of {hotel.city}.
              </p>
            </div>
          </div>
          
          <div className="relative">
            {hotelRooms.map((r, i) => (
              <HotelRoomCard key={r._id} r={r} i={i} hotel={hotel} setActiveBookingRoom={setActiveBookingRoom} />
            ))}
          </div>
        </section>
      )}

      {/* AMENITIES */}
      <section className="border-t border-line py-12 md:py-32">
        <div className="editorial-grid">
          <p className="u-label col-span-12 text-terracotta md:col-span-3">Amenities</p>
          <h2 className="t-section col-span-12 mt-2 text-[clamp(2.2rem,4.5vw,4rem)] md:col-span-6">
            Kept simple, <em className="font-normal italic">kept perfectly.</em>
          </h2>
          <div className="col-span-12 mt-10 md:mt-16 grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
            {AMENITIES.map((a) => (
              <div key={a.cat} className="border-t border-line py-6 md:py-10">
                <a.icon size={26} className="text-terracotta" strokeWidth={0.5} />
                <p className="u-label mt-6 text-ink">{a.cat}</p>
                <ul className="mt-6 flex flex-col gap-3">
                  {a.items.map((it) => (
                    <li key={it} className="text-sm font-light text-muted">{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="border-t border-line py-12 md:py-32">
        <div className="editorial-grid items-center">
          <div className="col-span-12 md:col-span-5">
            <p className="u-label text-terracotta">Find Us</p>
            <h2 className="t-section mt-6 text-[clamp(2.2rem,4.5vw,4rem)]">
              {hotel.city}, <em className="font-normal italic">{state}</em>
            </h2>
            <p className="mt-8 flex max-w-[540px] items-start gap-4 text-[0.95rem] font-light leading-[1.85] text-muted">
              <RiMapPinLine size={18} className="mt-1 shrink-0 text-terracotta" />
              {hotel.address || `${hotel.city} City Center`}
            </p>
            <div className="mt-8 flex gap-16">
              <div>
                <p className="u-label-sm text-warm">Latitude</p>
                <p className="t-section mt-2 text-2xl">{hotel.coords?.lat || 26.9124}° N</p>
              </div>
              <div>
                <p className="u-label-sm text-warm">Longitude</p>
                <p className="t-section mt-2 text-2xl">{hotel.coords?.lng || 75.7873}° E</p>
              </div>
            </div>
            <a
              href={`https://maps.google.com/?q=${hotel.coords?.lat || 26.9124},${hotel.coords?.lng || 75.7873}`}
              target="_blank"
              rel="noreferrer"
              className="u-label link-line mt-12 text-ink"
            >
              Get Directions <RiArrowRightLine size={15} className="text-terracotta" />
            </a>
          </div>
          <div className="col-span-12 mt-10 md:col-span-6 md:col-start-7 md:mt-0">
            <ParallaxImage src={cardImage} speed={0.5} className="aspect-[4/3]" viewCursor />
            <Link to="/hotels" className="u-label link-line mt-6 text-muted">
              Back to Portfolio <RiArrowRightLine size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* BOOKING CTA */}
      <section className="border-t border-line bg-cream py-12 md:py-32">
        <div className="editorial-grid items-start">
          <div className="col-span-12 md:col-span-6 pr-8">
            <h2 className="t-hero text-[clamp(3rem,8vw,5.5rem)]">
              Begin <em className="font-normal italic">your</em> stay
            </h2>
            <p className="mt-8 text-lg font-light text-muted">
              Select your dates and preferred room type to experience the unmatched hospitality of {hotel.name}.
            </p>
          </div>
          <div className="col-span-12 mt-10 md:col-span-6 md:mt-0">
            <BookingWidget hotelId={hotel._id} hotelRooms={hotelRooms} />
          </div>
        </div>
      </section>

      {/* ROOM-WISE BOOKING MODAL */}
      {activeBookingRoom && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-none shadow-2xl">
            <BookingWidget 
              hotelId={hotel._id} 
              hotelRooms={hotelRooms} 
              preSelectedRoomId={activeBookingRoom}
              onClose={() => setActiveBookingRoom(null)}
            />
          </div>
        </div>
      )}
    </>
  )
}

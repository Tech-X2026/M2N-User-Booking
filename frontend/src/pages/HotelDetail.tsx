import { useEffect, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { RiMapPinLine, RiRulerLine, RiGroupLine, RiCheckLine, RiRestaurantLine, RiHeartPulseLine, RiServiceLine, RiSailboatLine } from 'react-icons/ri'
import axios from 'axios'
import { inr, u } from '../lib/lib'
import BookingWidget from '../components/BookingWidget'

const AMENITIES = [
  { cat: 'DINING', icon: RiRestaurantLine, items: ['Signature restaurant', 'Courtyard all-day café', 'Private dining room', 'Wine cellar'] },
  { cat: 'WELLNESS', icon: RiHeartPulseLine, items: ['Ayurvedic spa pavilion', 'Yoga at first light', 'Heated pool', 'Meditation garden'] },
  { cat: 'LEISURE', icon: RiSailboatLine, items: ['Heritage walks', 'Culinary studio', 'Library & listening room', 'Curated city beats'] },
  { cat: 'SERVICES', icon: RiServiceLine, items: ['Dedicated butler', 'Concierge desk', 'Valet & transfers', 'In-residence chef'] },
]

const HotelRoomCard = ({ r, i, hotel, setActiveBookingRoom }: { r: any, i: number, hotel: any, setActiveBookingRoom: (id: string) => void }) => {
  const allImages = [...(r.images && r.images.length > 0 ? [r.images[0]] : []), ...(r.galleryImages || [])];
  if (allImages.length === 0) allImages.push(u('photo-1542314831-c53cd3816002', 1000));
  
  return (
    <div className="flex flex-col md:flex-row bg-white border border-border shadow-sm rounded-xl overflow-hidden mb-8 group hover:shadow-md transition-shadow">
      <div className="w-full md:w-[40%] h-[250px] md:h-auto relative">
        <img src={allImages[0]} alt={r.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-6 md:p-8 flex flex-col justify-between w-full md:w-[60%]">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-display text-2xl text-m2n-ink font-bold">{r.name}</h3>
            <div className="text-right">
              <span className="text-[10px] text-text-3 block uppercase tracking-wider font-bold mb-0.5">From</span>
              <span className="text-xl text-m2n-saffron font-bold">{inr(r.price)}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-[12px] text-text-2 font-medium mb-4">
             <span className="flex items-center gap-1.5"><RiRulerLine className="text-m2n-saffron"/> {r.roomSize || '45'} SQ.FT</span>
             <span className="flex items-center gap-1.5"><RiGroupLine className="text-m2n-saffron"/> Sleeps {r.capacity}</span>
          </div>
          <p className="text-sm text-text-2 leading-relaxed mb-4 line-clamp-2">
            {Array.isArray(r.features) ? r.features.join(', ') : (r.features || 'A luxurious room experience.')}
          </p>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 max-w-[70%]">
            {Array.isArray(r.features) && r.features.slice(0, 3).map((f: string) => (
              <li key={f} className="flex items-center gap-1.5 text-[11px] text-text-3 font-medium">
                <RiCheckLine size={12} className="text-m2n-emerald" /> <span className="truncate">{f}</span>
              </li>
            ))}
          </ul>
          <button onClick={() => setActiveBookingRoom(r._id)} className="btn btn-primary px-6 py-2.5 text-xs">Reserve</button>
        </div>
      </div>
    </div>
  )
}

export default function HotelDetail() {
  const { id } = useParams()
  const [hotel, setHotel] = useState<any>(null)
  const [hotelRooms, setHotelRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeBookingRoom, setActiveBookingRoom] = useState<string | null>(null)

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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-text-3 font-medium">Loading details...</div>
  }

  if (!hotel) return <Navigate to="/hotels" replace />

  const totalRooms = hotelRooms.reduce((acc, curr) => acc + (curr.numberOfRooms || 0), 0)
  const minPrice = hotelRooms.length > 0 ? Math.min(...hotelRooms.map(r => r.price)) : 0
  const state = hotel.state || 'India'
  const type = hotel.type || 'Heritage Hotel'
  const description = hotel.description || ''
  
  const heroImg = hotel.images?.[0] || u('photo-1542314831-c53cd3816002', 1200)
  const galleryImgs = hotel.images?.slice(1, 4) || [u('photo-1564501049412-61c2a3083791', 800), u('photo-1511795409834-ef04bbd61622', 800), u('photo-1544161515-4ab6ce6db874', 800)]

  return (
    <div className="pb-24 pt-32 min-h-screen">
      <Helmet>
        <title>{hotel.name} — M2N Group</title>
      </Helmet>

      {/* COMPACT HEADER */}
      <div className="max-w-[1280px] mx-auto px-6 mb-10 text-center">
        <p className="text-m2n-saffron font-bold tracking-[2px] text-[11px] mb-3 uppercase">{hotel.city}, {state} • {type}</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] text-m2n-ink font-bold leading-tight mb-8">
          {hotel.name}
        </h1>
        
        {/* INFO STRIP */}
        <div className="inline-flex flex-wrap justify-center items-center gap-6 md:gap-12 py-4 border-y border-border">
          <div className="text-center">
             <p className="text-[10px] text-text-3 font-bold uppercase tracking-wider mb-1">Keys</p>
             <p className="text-xl font-medium text-m2n-ink">{totalRooms}</p>
          </div>
          <div className="w-px h-8 bg-border hidden md:block"></div>
          <div className="text-center">
             <p className="text-[10px] text-text-3 font-bold uppercase tracking-wider mb-1">Starting Rate</p>
             <p className="text-xl font-medium text-m2n-ink">{inr(minPrice)}</p>
          </div>
          <div className="w-px h-8 bg-border hidden md:block"></div>
          <div className="text-center">
             <p className="text-[10px] text-text-3 font-bold uppercase tracking-wider mb-1">Location</p>
             <p className="text-xl font-medium text-m2n-ink flex items-center justify-center gap-1">
               <RiMapPinLine size={16} className="text-m2n-saffron"/> {hotel.city}
             </p>
          </div>
        </div>
      </div>

      {/* GALLERY GRID */}
      <div className="max-w-[1280px] mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-[500px]">
          <div className="md:col-span-2 rounded-xl overflow-hidden h-[300px] md:h-full">
            <img src={heroImg} alt={hotel.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-4 h-full">
            <div className="rounded-xl overflow-hidden flex-1">
              <img src={galleryImgs[0]} alt="Detail 1" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden flex-1">
              <img src={galleryImgs[1] || galleryImgs[0]} alt="Detail 2" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* STORY & AMENITIES */}
      <div className="max-w-[1280px] mx-auto px-6 mb-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5">
          <h2 className="section-title mb-6">The House Story</h2>
          <div className="text-sm text-text-2 leading-loose whitespace-pre-line">
            {description || 'Every structural decision defers to the original hand — cornices, courtyards and staircases are read first, touched last. Lime plaster, hand-planed teak, brass that will age gracefully for fifty years.'}
          </div>
        </div>
        <div className="lg:col-span-7">
          <h2 className="section-title mb-6">Signature Amenities</h2>
          <div className="grid grid-cols-2 gap-8">
            {AMENITIES.map(a => (
              <div key={a.cat}>
                <a.icon size={24} className="text-m2n-saffron mb-3" />
                <h4 className="font-bold text-[13px] text-m2n-ink uppercase tracking-wide mb-3">{a.cat}</h4>
                <ul className="flex flex-col gap-2">
                  {a.items.map(it => (
                    <li key={it} className="text-[13px] text-text-2 font-medium flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-m2n-saffron opacity-50"></span> {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROOMS */}
      <div className="bg-bg-soft py-20 border-y border-border">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">Select Your Room</h2>
            <p className="section-sub">{totalRooms} keys across {hotelRooms.length} temperaments.</p>
          </div>
          
          <div>
            {hotelRooms.map((r, i) => (
              <HotelRoomCard key={r._id} r={r} i={i} hotel={hotel} setActiveBookingRoom={setActiveBookingRoom} />
            ))}
          </div>
        </div>
      </div>

      {/* BOOKING MODAL */}
      {activeBookingRoom && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-m2n-ink/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl bg-white">
            <BookingWidget 
              hotelId={hotel._id} 
              hotelRooms={hotelRooms} 
              preSelectedRoomId={activeBookingRoom}
              onClose={() => setActiveBookingRoom(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

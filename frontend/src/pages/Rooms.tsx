import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { RiRulerLine, RiGroupLine, RiCheckLine } from 'react-icons/ri'
import axios from 'axios'
import { inr, u } from '../lib/lib'
import BookingWidget from '../components/BookingWidget'

const RoomCard = ({ r, allRooms }: { r: any, allRooms: any[] }) => {
  const [showBooking, setShowBooking] = useState(false);
  const allImages = [...(r.images && r.images.length > 0 ? [r.images[0]] : []), ...(r.galleryImages || [])];
  if (allImages.length === 0) allImages.push(u('photo-1542314831-c53cd3816002', 1000));

  return (
    <>
      <div className="flex flex-col md:flex-row bg-white border border-border shadow-sm rounded-xl overflow-hidden mb-8 group hover:shadow-md transition-shadow">
        <div className="w-full md:w-[40%] h-[250px] md:h-auto relative">
          <img src={allImages[0]} alt={r.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-6 md:p-8 flex flex-col justify-between w-full md:w-[60%]">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-[10px] text-m2n-saffron font-bold tracking-wider uppercase mb-1">{r.hotelId?.city || 'Various Locations'}</p>
                <h3 className="font-display text-2xl text-m2n-ink font-bold">{r.name}</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-text-3 block uppercase tracking-wider font-bold mb-0.5">From</span>
                <span className="text-xl text-m2n-saffron font-bold">{inr(r.price)}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-[12px] text-text-2 font-medium mb-4 mt-2">
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
            <button onClick={() => setShowBooking(true)} className="btn btn-primary px-6 py-2.5 text-xs">Reserve</button>
          </div>
        </div>
      </div>
      
      {showBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-m2n-ink/80 backdrop-blur-sm" style={{ margin: 0 }}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <BookingWidget
              hotelId={r.hotelId?._id || r.hotelId}
              hotelRooms={allRooms.filter((room) => (room.hotelId?._id || room.hotelId) === (r.hotelId?._id || r.hotelId))}
              preSelectedRoomId={r._id}
              onClose={() => setShowBooking(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default function Rooms() {
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5000/api'}/public/categories`)
      .then(res => {
        setRooms(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="pb-12 md:pb-24 pt-24 md:pt-32 px-6 max-w-[1000px] mx-auto min-h-screen">
      <Helmet>
        <title>Rooms & Suites — M2N Group</title>
      </Helmet>

      {/* HEADER */}
      <div className="mb-12 border-b border-border pb-8 text-center">
        <p className="text-m2n-saffron font-bold tracking-[2px] text-[11px] mb-3 uppercase">Accommodation</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] text-m2n-ink font-bold leading-tight max-w-2xl mx-auto">
          Rooms & <span className="italic font-medium text-m2n-saffron">Suites</span>
        </h1>
        <p className="mt-6 text-sm text-text-2 max-w-lg mx-auto leading-relaxed">
          Each room type exists in more than one house, but no two rooms are ever identical — buildings with a pulse refuse repetition.
        </p>
      </div>

      {/* ROOMS LIST */}
      <div>
        {loading ? (
          <div className="py-24 text-center text-text-3 font-medium">Loading rooms...</div>
        ) : rooms.map((r) => (
          <RoomCard key={r._id} r={r} allRooms={rooms} />
        ))}
      </div>
    </div>
  )
}

import { useEffect, useState, useLayoutEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RiRulerLine, RiGroupLine, RiCheckLine, RiArrowRightUpLine } from 'react-icons/ri'
import axios from 'axios'
import { inr } from '../lib/lib'
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri'
import BookingWidget from '../components/BookingWidget'

gsap.registerPlugin(ScrollTrigger)

const RoomCard = ({ r, index, total, allRooms }: { r: any, index: number, total: number, allRooms: any[] }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
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
    <>
      <style>{`
        .room-card-sticky {
          position: sticky;
          top: var(--card-top);
        }
        .details-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .details-scroll::-webkit-scrollbar-thumb {
          background-color: #e5e5e5;
          border-radius: 4px;
        }
      `}</style>
      <div
        data-room-card
        className="room-card-sticky flex flex-col md:flex-row items-stretch gap-6 md:gap-12 bg-white border border-line p-5 md:p-6 shadow-md rounded-xl w-full mx-auto"
        style={{
          '--card-top': `10vh`,
          zIndex: index + 1
        } as React.CSSProperties}
      >
        {/* Image */}
        <div className="img-frame relative h-[30vh] md:h-auto w-full md:w-3/5 shrink-0 rounded-lg overflow-hidden group md:flex-grow" data-cursor="view">
          <img
            src={allImages[currentImgIndex]}
            alt={r.name}
            loading={index === 0 ? 'eager' : 'lazy'}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          <span className="absolute right-5 top-4 font-display text-[4rem] md:text-[6rem] font-light leading-none text-white drop-shadow-md">
            0{index + 1}
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
            <p className="u-label text-terracotta">
              {r.hotelId?.city || 'Various'}
            </p>
            <h2 className="t-section mt-1 md:mt-2 text-[clamp(1.8rem,3vw,2.5rem)] leading-tight">{r.name}</h2>
            <div className="mt-2 md:mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="u-label-sm flex items-center gap-1.5 text-muted">
                <RiRulerLine size={14} className="text-terracotta" /> {r.roomSize} SQ.FT
              </span>
              <span className="u-label-sm flex items-center gap-1.5 text-muted">
                <RiGroupLine size={14} className="text-terracotta" /> Sleeps {r.capacity}
              </span>
            </div>
            <p className="mt-2 md:mt-3 max-w-[420px] text-[0.9rem] font-light leading-[1.6] text-muted line-clamp-3">{Array.isArray(r.features) ? r.features.join(', ') : (r.features || 'A luxurious room experience.')}</p>
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
              onClick={() => setShowBooking(true)}
              className="u-label link-line text-ink shrink-0 ml-4 mb-1"
            >
              Reserve <RiArrowRightUpLine size={15} className="text-terracotta inline" />
            </button>
          </div>
        </div>
      </div>
      {showBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm" style={{ margin: 0 }}>
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
  const wrapRef = useRef<HTMLDivElement>(null)
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

  useLayoutEffect(() => {
    // The previous GSAP logic is removed to match the simple sticky overlapping animation
    // from the homepage spaces section, which relies purely on CSS position: sticky.
  }, [loading, rooms.length])

  return (
    <>
      <Helmet>
        <title>Rooms & Suites — M2N Group of Hotels</title>
        <meta name="description" content="Five temperaments of room — Heritage Chamber, Courtyard Terrace, Lake Pavilion, Ridge Suite and The M2N Residence. Rates in INR." />
      </Helmet>

      {/* HERO */}
      <section className="overflow-hidden pb-16 md:pb-24 pt-32 md:pt-48 bg-cream/30">
        <div className="editorial-grid">
          <p className="u-label col-span-12 text-terracotta mb-4 md:mb-0">Accommodation</p>
          <h1 className="t-hero col-span-12 mt-2 md:mt-6 text-[clamp(3.2rem,10vw,11rem)] leading-[0.9] md:leading-[0.85] break-words flex flex-wrap items-center gap-x-3 md:gap-x-6">
            <span>ROOMS</span> <em className="font-normal italic text-terracotta">&amp;</em> <span>SUITES</span>
          </h1>
          <div className="col-span-12 mt-8 md:mt-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <p className="max-w-[540px] text-[0.95rem] font-light leading-[1.85] text-muted">
              247 keys, five temperaments. Each room type exists in more than one house, but no two
              rooms are ever identical — buildings with a pulse refuse repetition.
            </p>
            <p className="u-label-sm text-warm">Scroll — each room stacks over the last</p>
          </div>
        </div>
      </section>

      {/* STACKED CARDS */}
      <div ref={wrapRef} className="bg-cream/30 px-6 md:px-12 pb-32 relative max-w-7xl mx-auto flex flex-col gap-[30vh] md:gap-[100vh]">
        {loading ? (
          <div className="py-24 text-center text-muted">Loading rooms...</div>
        ) : rooms.map((r, i) => (
          <RoomCard key={r._id} r={r} index={i} total={rooms.length} allRooms={rooms} />
        ))}
      </div>
    </>
  )
}

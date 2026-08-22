import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocationContext } from '../lib/LocationContext'
import { Helmet } from 'react-helmet-async'
import { RiMapPinLine, RiStarFill } from 'react-icons/ri'
import axios from 'axios'
import { inr, u } from '../lib/lib'

export default function Hotels() {
  const [hotels, setHotels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { selectedCity } = useLocationContext()

  const renderHotelCard = (h: any) => (
    <Link to={`/hotels/${h._id}`} key={h._id} className="prop-card group">
      <div className="prop-img" style={{ backgroundImage: `url(${h.images?.[0] || u('photo-1564501049412-61c2a3083791', 600)})` }}>
        <button className="prop-fav text-text-3 hover:text-m2n-rose transition-colors">♡</button>
      </div>
      <div className="prop-body">
        <div className="prop-top">
          <h3 className="prop-name truncate pr-2">{h.name}</h3>
          <div className="prop-rating"><RiStarFill className="text-[#fbbf24] text-[10px]" /><span className="rating-pill">4.9</span></div>
        </div>
        <p className="prop-loc"><RiMapPinLine size={12}/> {h.city || 'India'}</p>
        <div className="prop-amen">
          <span>Pool</span>
          <span>Spa</span>
          <span>Fine Dining</span>
        </div>
        <div className="prop-bottom">
          <span className="text-[11px] font-bold text-m2n-saffron">Explore House ➔</span>
          <div className="prop-price-block">
            <div className="per">From</div>
            <div className="now">{inr(h.priceFrom || 9500)}</div>
          </div>
        </div>
      </div>
    </Link>
  )

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

  return (
    <div className="pb-12 md:pb-24 pt-24 md:pt-32 px-6 max-w-[1280px] mx-auto min-h-[85vh]">
      <Helmet>
        <title>Our Hotels — M2N Group</title>
        <meta name="description" content="Five addresses: Jaipur Palace, Goa Coast House, Delhi Residency, Udaipur Lake House, Shimla Ridge Lodge." />
      </Helmet>

      {/* HEADER */}
      <div className="mb-12 border-b border-border pb-8">
        <p className="text-m2n-saffron font-bold tracking-[2px] text-[11px] mb-3 uppercase">The Portfolio</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] text-m2n-ink font-bold leading-tight">
          Addresses proportioned to <br/><span className="italic font-medium text-m2n-saffron">their landscape.</span>
        </h1>
      </div>



      {/* HOTELS GRID */}
      {loading ? (
        <div className="py-20 text-center text-text-3 font-medium">Loading Portfolio...</div>
      ) : (
        <div>
          {(() => {
            if (selectedCity) {
              const filtered = hotels.filter(h => 
                h.city?.toLowerCase() === selectedCity.name.toLowerCase() || 
                h.state?.toLowerCase() === selectedCity.name.toLowerCase()
              );
              
              if (filtered.length === 0) {
                return (
                  <div className="py-20 text-center text-text-3 font-medium">
                    <span className="font-bold text-m2n-saffron text-xl block mb-2">Coming Soon</span>
                    No properties currently available in {selectedCity.name}.
                  </div>
                );
              }
              
              return (
                <div>
                  <h2 className="text-2xl font-display font-bold text-m2n-ink mb-6 pb-2 border-b border-border">Properties in {selectedCity.name}</h2>
                  <div className="props-grid">
                    {filtered.map(h => renderHotelCard(h))}
                  </div>
                </div>
              );
            } else {
              // Group by city
              const grouped = hotels.reduce((acc: any, h: any) => {
                const c = h.city || 'Other Destinations';
                if (!acc[c]) acc[c] = [];
                acc[c].push(h);
                return acc;
              }, {});
              
              return (
                <div className="flex flex-col gap-16">
                  {Object.keys(grouped).map(city => (
                    <div key={city}>
                      <h2 className="text-2xl font-display font-bold text-m2n-ink mb-6 pb-2 border-b border-border">Hotels in {city}</h2>
                      <div className="props-grid">
                        {grouped[city].map((h: any) => renderHotelCard(h))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            }
          })()}
        </div>
      )}
    </div>
  )
}

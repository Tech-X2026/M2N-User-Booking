import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { RiMapPinLine, RiStarFill } from 'react-icons/ri'
import HeroBookingCard from '../components/HeroBookingCard'
import { u, inr } from '../lib/lib'
import { useLocationContext } from '../lib/LocationContext'

export default function Home() {
  const [dbHotels, setDbHotels] = useState<any[]>([])
  const { selectedCity } = useLocationContext()

  const renderHotelCard = (h: any) => (
    <Link to={`/hotels/${h._id}`} key={h._id} className="prop-card group">
      <div className="prop-img" style={{ backgroundImage: `url(${h.images?.[0] || u('photo-1564501049412-61c2a3083791', 600)})` }}>
        <span className="prop-tag gold">FEATURED</span>
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
        if (res.data && Array.isArray(res.data)) {
          setDbHotels(res.data)
        }
      }).catch(err => console.error(err))
  }, [])

  return (
    <div className="pb-12 md:pb-24">
      <Helmet>
        <title>M2N Group of Hotels — Where Architecture Breathes</title>
        <meta name="description" content="Five addresses across India — Jaipur, Goa, Delhi, Udaipur, Shimla. Heritage palaces, coastal houses and mountain lodges rendered with editorial restraint." />
      </Helmet>

      {/* COMPACT HERO */}
      <section className="relative h-[65vh] min-h-[500px] bg-m2n-charcoal flex flex-col justify-between pt-[120px] px-6 overflow-hidden">
        <img 
          src="/images/zaarang-hero.png" 
          alt="Zaarang Hotel" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/20"></div>

        
        <div className="relative z-10 max-w-[1280px] mx-auto w-full flex-1 flex flex-col justify-center pb-[100px]">
        </div>
      </section>

      {/* SEARCH WIDGET (overlapping hero) */}
      <div className="relative z-20 px-6 -mt-[110px]">
        <HeroBookingCard />
      </div>



      {/* TRUST STRIP */}
      <section className="max-w-[1280px] mx-auto px-6 mt-14 mb-10 md:mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-border">
          <div className="flex flex-col gap-2">
            <span className="text-xl">🏛️</span>
            <h6 className="font-bold text-[12px] text-text-1 uppercase tracking-wide">Heritage Certified</h6>
            <p className="text-[11px] text-text-3">Authentic restored palaces</p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xl">✨</span>
            <h6 className="font-bold text-[12px] text-text-1 uppercase tracking-wide">Bespoke Service</h6>
            <p className="text-[11px] text-text-3">24/7 personal concierge</p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xl">🌿</span>
            <h6 className="font-bold text-[12px] text-text-1 uppercase tracking-wide">Sustainable</h6>
            <p className="text-[11px] text-text-3">Zero single-use plastics</p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xl">🏆</span>
            <h6 className="font-bold text-[12px] text-text-1 uppercase tracking-wide">Award Winning</h6>
            <p className="text-[11px] text-text-3">Condé Nast Gold List 2025</p>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="max-w-[1280px] mx-auto px-6 mb-12 md:mb-16 lg:mb-24">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="section-title">Featured Properties</h2>
            <p className="section-sub">Addresses proportioned to their landscape.</p>
          </div>
          <Link to="/hotels" className="btn btn-ghost hidden sm:block">View All</Link>
        </div>

        <div>
          {(() => {
            if (selectedCity) {
              const filtered = dbHotels.filter(h => 
                h.city?.toLowerCase() === selectedCity.name.toLowerCase() || 
                h.state?.toLowerCase() === selectedCity.name.toLowerCase()
              );
              
              if (filtered.length === 0) {
                return (
                  <div className="py-10 text-center text-text-3 font-medium">
                    <span className="font-bold text-m2n-saffron text-xl block mb-2">Coming Soon</span>
                    No properties currently available in {selectedCity.name}.
                  </div>
                );
              }
              
              return (
                <div>
                  <h3 className="text-xl font-display font-bold text-m2n-ink mb-4 pb-2 border-b border-border">Properties in {selectedCity.name}</h3>
                  <div className="props-grid">
                    {filtered.map(h => renderHotelCard(h))}
                  </div>
                </div>
              );
            } else {
              // Group by city
              const grouped = dbHotels.reduce((acc: any, h: any) => {
                const c = h.city || 'Other Destinations';
                if (!acc[c]) acc[c] = [];
                acc[c].push(h);
                return acc;
              }, {});
              
              return (
                <div className="flex flex-col gap-12">
                  {Object.keys(grouped).map(city => (
                    <div key={city}>
                      <h3 className="text-xl font-display font-bold text-m2n-ink mb-4 pb-2 border-b border-border">Hotels in {city}</h3>
                      <div className="props-grid">
                        {grouped[city].map((h: any) => renderHotelCard(h))}
                      </div>
                    </div>
                  ))}
                  {dbHotels.length === 0 && (
                    <div className="props-grid">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="prop-card border-border">
                          <div className="prop-img bg-border animate-pulse"></div>
                          <div className="prop-body">
                            <div className="h-4 bg-border rounded w-3/4 mb-3 animate-pulse"></div>
                            <div className="h-3 bg-border rounded w-1/2 mb-4 animate-pulse"></div>
                            <div className="h-10 bg-border rounded w-full animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
          })()}
        </div>
        <Link to="/hotels" className="btn btn-ghost block sm:hidden w-full mt-6 text-center">View All Properties</Link>
      </section>

      {/* TODAY's FLASH DEALS */}
      <section className="max-w-[1280px] mx-auto px-6 mb-12 md:mb-16 lg:mb-24">
        <h2 className="section-title mb-6">Exclusive Offers</h2>
        <div className="deals-row">
          <Link to="/offers" className="deal-card group">
            <div className="deal-img" style={{ backgroundImage: `url(${u('photo-1618773928120-47db60d4b1a4', 400)})` }}>
              <span className="deal-badge">-25%</span>
            </div>
            <div className="deal-body">
              <h4 className="deal-name">Early Bird Summer</h4>
              <p className="deal-loc">All Properties</p>
              <div className="deal-meta"><span>Book 60 Days Adv</span><span>Min 2 Nights</span></div>
              <div className="deal-price"><span className="text-[12px] text-text-3 line-through">₹12,000</span><span className="text-[16px] font-bold text-m2n-ink">₹9,000</span></div>
            </div>
          </Link>
          
          <Link to="/offers" className="deal-card group">
            <div className="deal-img" style={{ backgroundImage: `url(${u('photo-1544161515-4ab6ce6db874', 400)})` }}>
              <span className="deal-badge">COMPLIMENTARY</span>
            </div>
            <div className="deal-body">
              <h4 className="deal-name">Spa Rejuvenation</h4>
              <p className="deal-loc">Jaipur & Udaipur</p>
              <div className="deal-meta"><span>Couples</span><span>60 Min Therapy</span></div>
              <div className="deal-price"><span className="text-[12px] text-m2n-emerald font-bold">Included with Suites</span></div>
            </div>
          </Link>
          
          <Link to="/offers" className="deal-card group">
            <div className="deal-img" style={{ backgroundImage: `url(${u('photo-1556910103-1c02745aae4d', 400)})` }}>
              <span className="deal-badge">STAY 3 PAY 2</span>
            </div>
            <div className="deal-body">
              <h4 className="deal-name">Long Weekend</h4>
              <p className="deal-loc">Shimla Lodge</p>
              <div className="deal-meta"><span>Valid till Oct</span><span>Breakfast Incl.</span></div>
              <div className="deal-price"><span className="text-[12px] text-text-3 line-through">₹24,000</span><span className="text-[16px] font-bold text-m2n-ink">₹16,000</span></div>
            </div>
          </Link>
        </div>
      </section>

      {/* CURATED EXPERIENCES */}
      <section className="max-w-[1280px] mx-auto px-6 mb-12 md:mb-16 lg:mb-24">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="section-title">Curated Experiences</h2>
            <p className="section-sub">Moments crafted with absolute precision.</p>
          </div>
          <Link to="/experiences" className="btn btn-ghost hidden sm:block">Explore All</Link>
        </div>

        <div className="exp-row">
          <Link to="/dining" className="exp-card">
            <div className="img" style={{ backgroundImage: `url(${u('photo-1414235077428-338989a2e8c0', 600)})` }}></div>
            <div className="ov"></div>
            <div className="label"><small>Gastronomy</small><strong>Royal Dining</strong></div>
          </Link>
          <Link to="/spa" className="exp-card">
            <div className="img" style={{ backgroundImage: `url(${u('photo-1540555700478-4be289fbecef', 600)})` }}></div>
            <div className="ov"></div>
            <div className="label"><small>Wellness</small><strong>Thermal Spa</strong></div>
          </Link>
          <Link to="/experiences" className="exp-card">
            <div className="img" style={{ backgroundImage: `url(${u('photo-1598091383021-15ddea10925d', 600)})` }}></div>
            <div className="ov"></div>
            <div className="label"><small>Culture</small><strong>Heritage Walks</strong></div>
          </Link>
          <Link to="/events" className="exp-card">
            <div className="img" style={{ backgroundImage: `url(${u('photo-1511795409834-ef04bbd61622', 600)})` }}></div>
            <div className="ov"></div>
            <div className="label"><small>Celebrations</small><strong>Private Events</strong></div>
          </Link>
        </div>
      </section>

      {/* LOYALTY PROMO */}
      <section className="max-w-[1280px] mx-auto px-6 mb-12 md:mb-16 lg:mb-24">
        <div className="bg-m2n-ink rounded-2xl overflow-hidden flex flex-col md:flex-row items-center">
          <div className="p-10 md:p-14 flex-1 text-center md:text-left">
            <h3 className="font-display text-3xl md:text-4xl text-white font-bold mb-4">M2N <span className="text-m2n-saffron italic font-medium">Reserve</span></h3>
            <p className="text-white/70 text-sm mb-8 max-w-md mx-auto md:mx-0 leading-relaxed">
              Join our exclusive loyalty program. Earn points on every stay, unlock complimentary upgrades, and access member-only rates.
            </p>
            <Link to="/register" className="btn btn-saffron px-8 py-3 text-sm">Join the Reserve</Link>
          </div>
          <div className="w-full md:w-5/12 h-[300px] md:h-auto self-stretch bg-cover bg-center" style={{ backgroundImage: `url(${u('photo-1578683010236-d716f9a3f461', 800)})` }}></div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="max-w-[800px] mx-auto px-6 text-center pb-12">
        <p className="text-[28px] md:text-[34px] font-display text-m2n-ink font-bold leading-tight">
          "Luxury is not opulence. It is <span className="italic font-medium text-m2n-saffron">proportion</span>, light, and the discipline of restraint."
        </p>
        <p className="text-[10px] tracking-[2px] text-text-3 uppercase mt-8 font-bold">The M2N Principle, No. 001</p>
      </section>
    </div>
  )
}

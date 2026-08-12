import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { RiGroupLine, RiRulerLine, RiGridLine, RiArrowRightLine } from 'react-icons/ri'
import { u, EASE_SOFT } from '../lib/lib'
import Weddings from './Weddings'

const MEETINGS_SPACES = [
  {
    name: 'The Boardroom',
    hotel: 'M2N Delhi Residency',
    capacity: 16,
    size: 48,
    layouts: 'Fixed oval · Burma teak',
    image: u('photo-1556761175-b413da4baf72', 1200),
    span: 'md:col-span-3',
  },
  {
    name: 'The Private Dining',
    hotel: 'M2N Udaipur Lake House',
    capacity: 24,
    size: 64,
    layouts: 'Single table · Cellar pairing',
    image: u('photo-1414235077428-338989a2e8c0', 1200),
    span: 'md:col-span-3',
  },
  {
    name: 'Executive Suite',
    hotel: 'M2N Mumbai Skyline',
    capacity: 12,
    size: 35,
    layouts: 'Lounge · Presentation',
    image: u('photo-1497366216548-37526070297c', 1200),
    span: 'md:col-span-4 md:row-span-2',
  },
  {
    name: 'The Library',
    hotel: 'M2N Shimla Lodge',
    capacity: 20,
    size: 55,
    layouts: 'Fireside · Discussion',
    image: u('photo-1519389950473-47ba0277781c', 1200),
    span: 'md:col-span-2',
  }
]

const EVENTS_SPACES = [
  {
    name: 'The Summit Hall',
    hotel: 'M2N Delhi Residency',
    capacity: 200,
    size: 340,
    layouts: 'Theatre · Banquet · Boardroom',
    image: u('photo-1511578314322-379afb476865', 1400),
    span: 'md:col-span-4 md:row-span-2',
  },
  {
    name: 'Courtyard Pavilion',
    hotel: 'M2N Jaipur Palace',
    capacity: 120,
    size: 210,
    layouts: 'Reception · Classrooms under sky',
    image: u('photo-1540575467063-178a50c2df87', 1200),
    span: 'md:col-span-2',
  },
  {
    name: 'Rooftop Deck',
    hotel: 'M2N Goa Coast House',
    capacity: 80,
    size: 140,
    layouts: 'Cocktail · Sundowner',
    image: u('photo-1470337458703-46ad1756a187', 1200),
    span: 'md:col-span-3',
  },
  {
    name: 'Grand Ballroom',
    hotel: 'M2N Mumbai Skyline',
    capacity: 350,
    size: 520,
    layouts: 'Gala · Conference',
    image: u('photo-1505368142750-f8f4c4c8d523', 1400),
    span: 'md:col-span-3',
  }
]

export default function Events() {
  const [activeTab, setActiveTab] = useState<'meetings' | 'events' | 'weddings'>('events')

  return (
    <div className="relative min-h-screen">
      {activeTab === 'weddings' ? (
        <Weddings />
      ) : (
        <EventsContent type={activeTab} />
      )}

      <div className="fixed bottom-10 left-1/2 z-[50] flex -translate-x-1/2 items-center rounded-full bg-ink/90 p-1.5 backdrop-blur-md shadow-2xl">
        <button
          onClick={() => setActiveTab('meetings')}
          className={`rounded-full px-6 py-2.5 text-[0.85rem] font-medium transition-all duration-300 ${activeTab === 'meetings' ? 'bg-porcelain text-ink' : 'text-porcelain/70 hover:text-porcelain'}`}
        >
          Meetings
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`rounded-full px-6 py-2.5 text-[0.85rem] font-medium transition-all duration-300 ${activeTab === 'events' ? 'bg-porcelain text-ink' : 'text-porcelain/70 hover:text-porcelain'}`}
        >
          Events
        </button>
        <button
          onClick={() => setActiveTab('weddings')}
          className={`rounded-full px-6 py-2.5 text-[0.85rem] font-medium transition-all duration-300 ${activeTab === 'weddings' ? 'bg-porcelain text-ink' : 'text-porcelain/70 hover:text-porcelain'}`}
        >
          Weddings
        </button>
      </div>
    </div>
  )
}

function EventsContent({ type }: { type: 'meetings' | 'events' }) {
  const [hovered, setHovered] = useState<number | null>(null)
  
  const spaces = type === 'meetings' ? MEETINGS_SPACES : EVENTS_SPACES;

  return (
    <motion.div
      key={type}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.6, ease: EASE_SOFT }}
    >
      <Helmet>
        <title>{type === 'meetings' ? 'Meetings' : 'Events'} — M2N Group of Hotels</title>
        <meta name="description" content="Exclusive spaces for your next gathering." />
      </Helmet>

      {/* HERO */}
      <section className="overflow-hidden pb-24 pt-40 md:pt-48">
        <div className="editorial-grid">
          <p className="u-label col-span-12 text-terracotta">Gatherings</p>
          <h1 className="t-hero col-span-12 mt-6 text-[clamp(3.2rem,12vw,10.5rem)] leading-[0.85] uppercase">
            {type === 'meetings' ? 'MEETINGS' : 'EVENTS'}
          </h1>
          <p className="col-span-12 mt-12 max-w-[540px] text-[0.95rem] font-light leading-[1.85] text-muted md:col-span-5">
            Every gathering here is house-private: when your {type === 'meetings' ? 'meeting' : 'event'} is in session, the space belongs
            to no one else. Hover a room to read its temperament.
          </p>
        </div>
      </section>

      {/* ISOMETRIC-STYLE GRID */}
      <section className="pb-16 md:pb-24">
        <div className="editorial-grid">
          <div className="col-span-12 grid grid-cols-1 gap-6 md:grid-cols-6 md:auto-rows-[240px]">
            {spaces.map((s, i) => (
              <motion.div
                key={s.name}
                className={`group relative overflow-hidden border border-line ${s.span} min-h-[300px]`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, ease: EASE_SOFT }}
                data-cursor="view"
              >
                <img
                  src={s.image}
                  alt={s.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ filter: 'saturate(0.88)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-7">
                  <p className="u-label-sm text-porcelain/75">{s.hotel.replace('M2N ', '')}</p>
                  <h3 className="t-section mt-2 text-[clamp(1.6rem,2.8vw,2.6rem)] text-porcelain">{s.name}</h3>
                </div>

                {/* Hover overlay */}
                <AnimatePresence>
                  {hovered === i && (
                    <motion.div
                      className="absolute inset-0 flex flex-col justify-end bg-porcelain/95 p-7"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 24 }}
                      transition={{ duration: 0.45, ease: EASE_SOFT }}
                    >
                      <p className="u-label text-terracotta">{s.name}</p>
                      <div className="mt-6 flex flex-col gap-4 border-t border-line pt-6">
                        <p className="flex items-center gap-3 text-sm font-light text-ink">
                          <RiGroupLine size={16} className="text-terracotta" /> Up to {s.capacity} guests
                        </p>
                        <p className="flex items-center gap-3 text-sm font-light text-ink">
                          <RiRulerLine size={16} className="text-terracotta" /> {s.size} sq.m
                        </p>
                        <p className="flex items-center gap-3 text-sm font-light text-ink">
                          <RiGridLine size={16} className="text-terracotta" /> {s.layouts}
                        </p>
                      </div>
                      <p className="u-label-sm mt-6 text-warm">{s.hotel}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="col-span-12 mt-28 flex flex-col items-start justify-between gap-10 border-t border-line pt-16 md:flex-row md:items-end">
            <h2 className="t-quote max-w-[560px] text-[clamp(1.8rem,3.4vw,3rem)]">
              Reception, offsite, or quiet signing — <em className="text-terracotta">we set the room, you keep the moment.</em>
            </h2>
            <button
              onClick={() => window.dispatchEvent(new Event('m2n:reserve'))}
              className="btn-outline"
            >
              Plan {type === 'meetings' ? 'a Meeting' : 'an Event'} <RiArrowRightLine size={15} />
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

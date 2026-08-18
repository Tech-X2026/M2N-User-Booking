import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { RiGroupLine, RiRulerLine, RiGridLine } from 'react-icons/ri'
import { u } from '../lib/lib'
import Weddings from './Weddings'

const MEETINGS_SPACES = [
  {
    name: 'The Boardroom',
    hotel: 'M2N Delhi Residency',
    capacity: 16,
    size: 48,
    layouts: 'Fixed oval · Burma teak',
    image: u('photo-1556761175-b413da4baf72', 1200),
  },
  {
    name: 'The Private Dining',
    hotel: 'M2N Udaipur Lake House',
    capacity: 24,
    size: 64,
    layouts: 'Single table · Cellar pairing',
    image: u('photo-1414235077428-338989a2e8c0', 1200),
  },
  {
    name: 'Executive Suite',
    hotel: 'M2N Mumbai Skyline',
    capacity: 12,
    size: 35,
    layouts: 'Lounge · Presentation',
    image: u('photo-1497366216548-37526070297c', 1200),
  },
  {
    name: 'The Library',
    hotel: 'M2N Shimla Lodge',
    capacity: 20,
    size: 55,
    layouts: 'Fireside · Discussion',
    image: u('photo-1519389950473-47ba0277781c', 1200),
  }
]

const EVENTS_SPACES = [
  {
    name: 'The Summit Hall',
    hotel: 'M2N Delhi Residency',
    capacity: 200,
    size: 340,
    layouts: 'Theatre · Banquet',
    image: u('photo-1511578314322-379afb476865', 1400),
  },
  {
    name: 'Courtyard Pavilion',
    hotel: 'M2N Jaipur Palace',
    capacity: 120,
    size: 210,
    layouts: 'Reception · Sky',
    image: u('photo-1540575467063-178a50c2df87', 1200),
  },
  {
    name: 'Rooftop Deck',
    hotel: 'M2N Goa Coast House',
    capacity: 80,
    size: 140,
    layouts: 'Cocktail · Sundowner',
    image: u('photo-1470337458703-46ad1756a187', 1200),
  },
  {
    name: 'Grand Ballroom',
    hotel: 'M2N Mumbai Skyline',
    capacity: 350,
    size: 520,
    layouts: 'Gala · Conference',
    image: u('photo-1505368142750-f8f4c4c8d523', 1400),
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

      {/* COMPACT PILL NAVIGATION */}
      <div className="fixed bottom-10 left-1/2 z-[50] flex -translate-x-1/2 items-center rounded-full bg-white p-1.5 shadow-xl border border-border">
        <button
          onClick={() => setActiveTab('meetings')}
          className={`rounded-full px-6 py-2.5 text-[13px] font-bold transition-all duration-300 ${activeTab === 'meetings' ? 'bg-m2n-ink text-white' : 'text-text-2 hover:text-m2n-ink'}`}
        >
          Meetings
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`rounded-full px-6 py-2.5 text-[13px] font-bold transition-all duration-300 ${activeTab === 'events' ? 'bg-m2n-ink text-white' : 'text-text-2 hover:text-m2n-ink'}`}
        >
          Events
        </button>
        <button
          onClick={() => setActiveTab('weddings')}
          className={`rounded-full px-6 py-2.5 text-[13px] font-bold transition-all duration-300 ${activeTab === 'weddings' ? 'bg-m2n-ink text-white' : 'text-text-2 hover:text-m2n-ink'}`}
        >
          Weddings
        </button>
      </div>
    </div>
  )
}

function EventsContent({ type }: { type: 'meetings' | 'events' }) {
  const spaces = type === 'meetings' ? MEETINGS_SPACES : EVENTS_SPACES;

  return (
    <div key={type} className="pb-32 pt-32 px-6 max-w-[1280px] mx-auto min-h-screen">
      <Helmet>
        <title>{type === 'meetings' ? 'Meetings' : 'Events'} — M2N Group</title>
        <meta name="description" content="Exclusive spaces for your next gathering." />
      </Helmet>

      {/* HEADER */}
      <div className="mb-16 border-b border-border pb-8 text-center">
        <p className="text-m2n-saffron font-bold tracking-[2px] text-[11px] mb-3 uppercase">Gatherings</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] text-m2n-ink font-bold leading-tight max-w-2xl mx-auto uppercase">
          {type === 'meetings' ? 'Meetings' : 'Events'}
        </h1>
        <p className="mt-6 text-sm text-text-2 max-w-lg mx-auto leading-relaxed">
          Every gathering here is house-private: when your {type === 'meetings' ? 'meeting' : 'event'} is in session, the space belongs to no one else.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {spaces.map((s) => (
          <div key={s.name} className="group flex flex-col bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-[280px] relative overflow-hidden">
               <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-[10px] font-bold text-m2n-ink uppercase tracking-wider shadow-sm">
                 {s.hotel}
               </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
               <h3 className="font-display text-2xl text-m2n-ink font-bold mb-4">{s.name}</h3>
               
               <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
                 <div>
                   <p className="text-[10px] font-bold text-text-3 uppercase tracking-wider mb-1">Capacity</p>
                   <p className="text-sm text-m2n-ink font-medium flex items-center gap-1"><RiGroupLine className="text-m2n-saffron"/> {s.capacity}</p>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-text-3 uppercase tracking-wider mb-1">Size (sq.m)</p>
                   <p className="text-sm text-m2n-ink font-medium flex items-center gap-1"><RiRulerLine className="text-m2n-saffron"/> {s.size}</p>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-text-3 uppercase tracking-wider mb-1">Layout</p>
                   <p className="text-sm text-m2n-ink font-medium flex items-center gap-1"><RiGridLine className="text-m2n-saffron"/> {s.layouts.split('·')[0].trim()}</p>
                 </div>
               </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* OUTRO */}
      <div className="bg-bg-soft rounded-xl p-10 text-center max-w-3xl mx-auto border border-border">
         <p className="font-display text-2xl text-m2n-ink font-bold mb-4">
           Reception, offsite, or quiet signing — <span className="italic text-m2n-saffron font-medium">we set the room, you keep the moment.</span>
         </p>
         <button className="btn btn-primary px-6 py-2.5 text-sm mt-4">Plan {type === 'meetings' ? 'a Meeting' : 'an Event'}</button>
      </div>
    </div>
  )
}

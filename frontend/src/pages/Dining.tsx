import { Helmet } from 'react-helmet-async'
import { RiTimerLine, RiMapPinLine } from 'react-icons/ri'
import { inr, u } from '../lib/lib'

const RESTAURANTS = [
  {
    id: 'saffron',
    name: 'Saffron',
    cuisine: 'ROYAL INDIAN',
    hotel: 'M2N Jaipur Palace',
    hours: '1900 — 2300',
    price: 4200,
    desc: 'Recipes recovered from the Mewar and Amber court kitchens — laal maas slow-cooked for six hours, safed maas perfumed with white pepper, breads from a clay oven that has not cooled since opening night.',
    signature: 'Jungli Maas · Ghewar with Rabri',
    image: u('photo-1585937421612-70a008356fbe', 1600),
  },
  {
    id: 'verandah',
    name: 'The Verandah',
    cuisine: 'ALL-DAY COLONIAL',
    hotel: 'M2N Delhi Residency',
    hours: '0700 — 2300',
    price: 2800,
    desc: 'Under the Lutyens colonnade: railway lamb curry, dak bungalow chicken, and a khichdi that regulars cross the city for. Breakfast runs late here, deliberately — mornings are a course, not a slot.',
    signature: 'Dak Bungalow Chicken · Baked Alaska',
    image: u('photo-1517248135467-4c7edcad34c4', 1600),
  },
  {
    id: 'copper-vine',
    name: 'Copper & Vine',
    cuisine: 'WINE ROOM & GRILL',
    hotel: 'M2N Udaipur Lake House',
    hours: '1800 — 0030',
    price: 5600,
    desc: 'Copper pans hung over a live fire, a cellar of four hundred labels, and the lake one staircase below every table. The grill works only with whole carcass and seasonal catch — ask what arrived this morning.',
    signature: 'Wood-fired Raan · Sula Reserve Vertical',
    image: u('photo-1414235077428-338989a2e8c0', 1600),
  },
  {
    id: 'chai-room',
    name: 'The Chai Room',
    cuisine: 'AFTERNOON TEA',
    hotel: 'M2N Shimla Ridge Lodge',
    hours: '1500 — 1800',
    price: 1800,
    desc: 'A cedar-panelled tea room at 2,400 metres. First-flush Darjeelings, kangra greens and house masala, poured beside a hearth fire, with scones and hill-station patties from the 1948 bakery ledger.',
    signature: 'Masala Chai · Ridge Honey Cake',
    image: u('photo-1544787219-7f47ccb76574', 1600),
  },
]

export default function Dining() {
  return (
    <div className="pb-24 pt-32 px-6 max-w-[1280px] mx-auto min-h-screen">
      <Helmet>
        <title>Dining — M2N Group</title>
      </Helmet>

      {/* HEADER */}
      <div className="mb-16 border-b border-border pb-8 text-center">
        <p className="text-m2n-saffron font-bold tracking-[2px] text-[11px] mb-3 uppercase">Gastronomy</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] text-m2n-ink font-bold leading-tight max-w-2xl mx-auto">
          Food is the shortest route <br/><span className="italic font-medium text-m2n-saffron">to a place.</span>
        </h1>
        <p className="mt-6 text-sm text-text-2 max-w-lg mx-auto leading-relaxed">
          Four tables across four houses — each built from the ledgers of its own region, each committed to slow technique over seasonal theatre.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {RESTAURANTS.map((r, i) => (
          <div key={r.id} className="group bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="h-[280px] md:h-[340px] relative overflow-hidden">
               <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-[10px] font-bold text-m2n-ink uppercase tracking-wider shadow-sm">
                 {r.cuisine}
               </div>
            </div>
            <div className="p-6 md:p-8 flex flex-col flex-grow">
               <div className="flex justify-between items-start mb-2">
                 <h3 className="font-display text-2xl text-m2n-ink font-bold">{r.name}</h3>
                 <span className="text-[10px] font-bold text-m2n-saffron uppercase tracking-widest">0{i+1}</span>
               </div>
               <div className="flex flex-wrap gap-4 text-[12px] text-text-2 font-medium mb-4">
                  <span className="flex items-center gap-1.5"><RiMapPinLine className="text-m2n-saffron"/> {r.hotel.replace('M2N ', '')}</span>
                  <span className="flex items-center gap-1.5"><RiTimerLine className="text-m2n-saffron"/> {r.hours}</span>
               </div>
               <p className="text-sm text-text-2 leading-relaxed mb-6 flex-grow">{r.desc}</p>
               
               <div className="border-t border-border pt-4 mt-auto">
                 <p className="text-[11px] font-bold text-text-3 uppercase tracking-wider mb-2">Signature</p>
                 <p className="text-[13px] text-m2n-ink font-medium mb-4">{r.signature}</p>
                 
                 <div className="flex items-center justify-between">
                   <p className="text-sm text-m2n-saffron font-bold">From {inr(r.price)} <span className="text-[10px] text-text-3 font-normal uppercase tracking-wider">/ Guest</span></p>
                   <button className="btn btn-ghost px-4 py-2 text-xs">Reserve</button>
                 </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

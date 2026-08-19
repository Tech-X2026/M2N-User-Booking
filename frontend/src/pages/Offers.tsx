import { Helmet } from 'react-helmet-async'
import { RiArrowRightLine, RiPercentLine, RiCalendarLine } from 'react-icons/ri'
import { inr } from '../lib/lib'

const OFFERS = [
  {
    title: 'The Royal Escape',
    desc: 'Two nights in the Lake Pavilion, sunrise boat breakfast, a private ghat dinner and both spa rituals — Udaipur, at its slowest.',
    price: 72000,
    hotel: 'M2N Udaipur Lake House',
    validity: 'APR — SEP 2025',
  },
  {
    title: 'Monsoon Retreat',
    desc: 'When the rain arrives, Goa empties and becomes ours alone. Three nights with the cliff kitchen, the shala and the sea at full volume.',
    price: 48500,
    hotel: 'M2N Goa Coast House',
    validity: 'JUN — AUG 2025',
  },
  {
    title: 'Suite Sojourn',
    desc: 'Seven nights split between Jaipur and Delhi — two palaces, one car, one driver, and the guild\u2019s restoration rooms opened just for you.',
    price: 96000,
    hotel: 'Jaipur + Delhi',
    validity: 'YEAR-ROUND',
  },
  {
    title: 'The Long Stay Edit',
    desc: 'Fourteen nights across any three addresses. For the traveller who measures a place in weeks, not weekends. Butler and board included.',
    price: 210000,
    hotel: 'Any Three Houses',
    validity: 'YEAR-ROUND',
  },
]

export default function Offers() {
  return (
    <>
      <Helmet>
        <title>Offers — M2N Group of Hotels</title>
        <meta name="description" content="Seasonal arrangements across the five M2N houses — Royal Escape, Monsoon Retreat, Suite Sojourn and the Long Stay Edit." />
      </Helmet>

      {/* HEADER */}
      <div className="pb-16 pt-24 md:pt-32 px-6 max-w-[1280px] mx-auto text-center border-b border-border">
        <p className="text-m2n-saffron font-bold tracking-[2px] text-[11px] mb-3 uppercase">Arrangements</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] text-m2n-ink font-bold leading-tight italic">
          Offers
        </h1>
        <p className="mt-6 text-sm text-text-2 max-w-lg mx-auto leading-relaxed">
          We do not discount; we arrange. Each offer bundles the house, its rituals and its people into one considered whole — at a price quieter than the sum of its parts.
        </p>
      </div>

      {/* LIST */}
      <div className="max-w-[1080px] mx-auto px-6 pb-32 pt-16">
        <div className="flex flex-col gap-6">
          {OFFERS.map((o) => (
            <div
              key={o.title}
              className="group bg-white border border-border rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 cursor-pointer hover:shadow-md transition-all duration-300"
              onClick={() => window.dispatchEvent(new Event('m2n:reserve'))}
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="flex items-center gap-1.5 bg-m2n-emerald/10 text-m2n-emerald px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                    <RiPercentLine size={12} /> {o.hotel}
                  </span>
                  <span className="flex items-center gap-1.5 bg-bg-stone text-text-2 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                    <RiCalendarLine size={12} /> {o.validity}
                  </span>
                </div>
                <h3 className="font-display text-3xl text-m2n-ink font-bold mb-3 group-hover:text-m2n-saffron transition-colors">
                  {o.title}
                </h3>
                <p className="text-sm text-text-2 leading-relaxed max-w-2xl">{o.desc}</p>
              </div>

              <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center gap-4 md:pl-8 md:border-l md:border-border shrink-0">
                <div className="text-left md:text-right">
                  <p className="text-[10px] font-bold text-text-3 uppercase tracking-wider mb-1">From</p>
                  <p className="font-display text-2xl text-m2n-ink font-bold">{inr(o.price)}</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-m2n-ink group-hover:border-m2n-saffron group-hover:bg-m2n-saffron group-hover:text-white transition-all duration-300">
                  <RiArrowRightLine size={18} />
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-[10px] font-bold text-text-3 uppercase tracking-widest mt-12 text-center">
          All arrangements are exclusive of government taxes. Prices quoted in Indian Rupees.
        </p>
      </div>
    </>
  )
}

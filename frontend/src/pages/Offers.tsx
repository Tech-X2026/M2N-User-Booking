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

      {/* HERO */}
      <section className="overflow-hidden pb-20 pt-40 md:pb-28 md:pt-48">
        <div className="editorial-grid">
          <p className="u-label col-span-12 text-terracotta">Arrangements</p>
          <h1 className="t-hero col-span-12 mt-6 whitespace-nowrap text-[clamp(4rem,15vw,13rem)] leading-[0.85]">
            <em className="font-normal italic">offers</em>
          </h1>
          <p className="col-span-12 mt-10 max-w-[540px] text-[0.95rem] font-light leading-[1.85] text-muted md:col-span-5">
            We do not discount; we arrange. Each offer bundles the house, its rituals and its people
            into one considered whole — at a price quieter than the sum of its parts.
          </p>
        </div>
      </section>

      {/* TYPOGRAPHIC LIST */}
      <section className="pb-16 md:pb-24">
        <div className="editorial-grid">
          <div className="col-span-12">
            {OFFERS.map((o, i) => (
              <div
                key={o.title}
                className="row-shift group grid cursor-pointer grid-cols-12 items-center gap-4 border-b border-line py-12 first:border-t md:py-16"
                onClick={() => window.dispatchEvent(new Event('m2n:reserve'))}
              >
                {/* Big faded number */}
                <span className="col-span-4 font-display text-[clamp(3.5rem,8vw,8rem)] font-light leading-none text-line transition-colors duration-500 group-hover:text-terracotta/30 md:col-span-2">
                  0{i + 1}
                </span>

                {/* Title + desc */}
                <div className="col-span-8 md:col-span-6">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <span className="u-label-sm flex items-center gap-2 text-sage">
                      <RiPercentLine size={13} /> {o.hotel}
                    </span>
                    <span className="u-label-sm flex items-center gap-2 text-warm">
                      <RiCalendarLine size={13} /> {o.validity}
                    </span>
                  </div>
                  <h3 className="t-section mt-4 text-[clamp(2rem,4.5vw,4rem)] transition-colors duration-400 group-hover:text-terracotta">
                    {o.title}
                  </h3>
                  <p className="mt-4 max-w-[540px] text-[0.92rem] font-light leading-[1.8] text-muted">{o.desc}</p>
                </div>

                {/* Price + arrow */}
                <div className="col-span-8 col-start-5 flex items-center justify-between md:col-span-4 md:col-start-9 md:justify-end md:gap-14">
                  <div className="md:text-right">
                    <p className="u-label-sm text-warm">From</p>
                    <p className="t-section mt-1 text-[clamp(1.5rem,2.6vw,2.4rem)] text-terracotta">{inr(o.price)}</p>
                  </div>
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-all duration-500 group-hover:border-terracotta group-hover:bg-terracotta group-hover:text-porcelain">
                    <RiArrowRightLine size={20} />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="u-label-sm col-span-12 mt-14 text-warm">
            All arrangements are exclusive of government taxes. Prices quoted in Indian Rupees.
          </p>
        </div>
      </section>
    </>
  )
}

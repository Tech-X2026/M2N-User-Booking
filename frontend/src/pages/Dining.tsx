import { useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { RiTimerLine, RiMapPinLine, RiArrowRightLine } from 'react-icons/ri'
import ImageReveal from '../components/ImageReveal'
import { getLenis, inr, u } from '../lib/lib'

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
    direction: 'left' as const,
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
    direction: 'bottom' as const,
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
    direction: 'left' as const,
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
    direction: 'bottom' as const,
  },
]

export default function Dining() {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id]
    if (el) getLenis()?.scrollTo(el, { offset: -90 })
  }

  return (
    <>
      <Helmet>
        <title>Dining — M2N Group of Hotels</title>
        <meta name="description" content="Four tables across four houses: Saffron, The Verandah, Copper & Vine, and The Chai Room." />
      </Helmet>

      <section className="pb-16 md:pb-24 pt-40 md:pt-48">
        <div className="editorial-grid">
          {/* STICKY LEFT RAIL */}
          <aside className="hidden md:col-span-3 md:block">
            <div className="sticky top-32 flex h-[70vh] flex-col">
              <h1
                className="t-hero text-[clamp(3.5rem,7vw,6rem)] leading-none text-ink"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                DINING
              </h1>
              <div className="absolute bottom-0 left-0 flex flex-col gap-4">
                <p className="u-label-sm mb-2 text-warm">The Tables</p>
                {RESTAURANTS.map((r, i) => (
                  <button
                    key={r.id}
                    onClick={() => scrollTo(r.id)}
                    className="u-label group flex items-center gap-4 text-left text-muted transition-colors hover:text-terracotta"
                  >
                    <span className="text-warm">0{i + 1}</span>
                    <span className="link-line">{r.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* CONTENT */}
          <div className="col-span-12 md:col-span-8 md:col-start-5">
            <p className="u-label text-terracotta md:hidden">01 — Dining</p>
            <h2 className="t-quote mt-4 max-w-[560px] text-[clamp(1.9rem,3.8vw,3.4rem)]">
              Food is the shortest route to a place. <em className="text-sage">We keep the roads old.</em>
            </h2>
            <p className="mt-8 max-w-[540px] text-[0.95rem] font-light leading-[1.85] text-muted">
              Four tables across four houses — each built from the ledgers of its own region,
              each committed to slow technique over seasonal theatre.
            </p>

            {RESTAURANTS.map((r, i) => (
              <article
                key={r.id}
                ref={(el) => {
                  sectionRefs.current[r.id] = el
                }}
                className="mt-24 border-t border-line pt-16 md:mt-32"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <p className="u-label text-terracotta">0{i + 1} — {r.cuisine}</p>
                  <p className="u-label-sm text-warm">{r.hotel}</p>
                </div>

                <ImageReveal
                  src={r.image}
                  alt={r.name}
                  direction={r.direction}
                  className={`mt-8 block aspect-[16/9] ${i % 2 === 1 ? 'md:mr-16' : 'md:ml-16'}`}
                  imgClassName="absolute inset-0 w-full h-full object-cover"
                  viewCursor
                />

                <div className={`mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 ${i % 2 === 1 ? 'md:mr-16' : ''}`}>
                  <div>
                    <h3 className="t-section text-[clamp(2.2rem,4vw,3.6rem)]">{r.name}</h3>
                    <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-2">
                      <span className="u-label-sm flex items-center gap-2 text-muted">
                        <RiTimerLine size={14} className="text-terracotta" /> {r.hours}
                      </span>
                      <span className="u-label-sm flex items-center gap-2 text-muted">
                        <RiMapPinLine size={14} className="text-terracotta" /> {r.hotel.replace('M2N ', '')}
                      </span>
                    </div>
                    <p className="u-label mt-7 text-sage">Signature — {r.signature}</p>
                  </div>
                  <div>
                    <p className="max-w-[460px] text-[0.95rem] font-light leading-[1.85] text-muted">{r.desc}</p>
                    <p className="u-label mt-7 text-terracotta">Tasting from {inr(r.price)} / guest</p>
                    <button
                      onClick={() => window.dispatchEvent(new Event('m2n:reserve'))}
                      className="u-label link-line mt-6 text-ink"
                    >
                      Book a Table <RiArrowRightLine size={15} className="text-terracotta" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

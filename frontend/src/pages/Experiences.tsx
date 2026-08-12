import { Helmet } from 'react-helmet-async'
import { RiArrowRightUpLine, RiTimerLine } from 'react-icons/ri'
import { experiences } from '../data/experiences'
import { inr } from '../lib/lib'

/** Bento tile sizing map (md+): named-area feel via spans */
const SPANS = [
  'md:col-span-2 md:row-span-2',
  'md:col-span-2',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-2',
  'md:col-span-2',
]

export default function Experiences() {
  const list = experiences.slice(0, 6)

  return (
    <>
      <Helmet>
        <title>Experiences — M2N Group of Hotels</title>
        <meta name="description" content="Heritage walks, cooking masterclasses, sunset boat rides, royal astrology, artisan workshops and forest yoga across five addresses." />
      </Helmet>

      {/* HERO */}
      <section className="overflow-hidden pb-20 pt-40 md:pt-48">
        <div className="editorial-grid">
          <p className="u-label col-span-12 text-terracotta">Curated by the Houses</p>
          <h1 className="t-hero col-span-12 mt-6 whitespace-nowrap text-[clamp(2.9rem,11vw,10rem)] leading-[0.85]">
            EXPE<em className="font-normal italic">riences</em>
          </h1>
          <p className="col-span-12 mt-10 max-w-[540px] text-[0.95rem] font-light leading-[1.85] text-muted md:col-span-5">
            Nothing on this list is subcontracted. Every experience is led by someone who lives
            here — a historian, a chef, a seventh-generation astrologer — and priced once, honestly,
            in rupees.
          </p>
        </div>
      </section>

      {/* BENTO GRID */}
      <section className="pb-16 md:pb-24">
        <div className="editorial-grid">
          <div className="col-span-12 grid grid-cols-1 gap-6 md:grid-cols-4 md:auto-rows-[250px]">
            {list.map((e, i) => (
              <div
                key={e.id}
                className={`group img-frame img-zoom-slow relative border border-line ${SPANS[i]} min-h-[280px]`}
                data-cursor="view"
              >
                <img src={e.image} alt={e.name} loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent" />

                <span className="absolute left-5 top-5 font-display text-4xl font-light text-porcelain/80">
                  0{i + 1}
                </span>
                <RiArrowRightUpLine
                  className="absolute right-5 top-5 text-porcelain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  size={20}
                />

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="flex items-center gap-4">
                    <p className="u-label-sm text-porcelain/75">{e.hotel}</p>
                    <span className="u-label-sm flex items-center gap-1.5 text-porcelain/75">
                      <RiTimerLine size={12} /> {e.duration}
                    </span>
                  </div>
                  <h3 className="t-section mt-2 text-[clamp(1.4rem,2.4vw,2.3rem)] text-porcelain">{e.name}</h3>
                  <div className="mt-3 grid grid-rows-[0fr] transition-all duration-500 ease-out group-hover:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <p className="max-w-[440px] pb-1 text-[0.85rem] font-light leading-relaxed text-porcelain/85">
                        {e.desc}
                      </p>
                      <p className="u-label pb-1 text-porcelain">{inr(e.price)} / guest</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Outro */}
          <div className="col-span-12 mt-24 flex flex-col items-start justify-between gap-10 border-t border-line pt-14 md:flex-row md:items-end">
            <p className="t-quote max-w-[520px] text-[clamp(1.6rem,3vw,2.6rem)]">
              &ldquo;The concierge does not sell experiences. <em className="text-sage">He lends you his friends.</em>&rdquo;
            </p>
            <button
              onClick={() => window.dispatchEvent(new Event('m2n:reserve'))}
              className="btn-outline"
            >
              Plan with Concierge
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

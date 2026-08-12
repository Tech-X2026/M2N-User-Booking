import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { RiAddLine, RiArrowRightLine, RiMapPinLine, RiTeamLine, RiCheckLine } from 'react-icons/ri'
import ImageReveal from '../components/ImageReveal'
import { EASE, u } from '../lib/lib'

const ROLES = [
  {
    title: 'General Manager',
    dept: 'THE HOUSE',
    location: 'M2N Udaipur Lake House',
    reqs: [
      'Ten years in small luxury properties; palace experience preferred',
      'Reads a building the way most read a balance sheet',
      'Fluent in restraint — both the word and the practice',
    ],
  },
  {
    title: 'Executive Chef',
    dept: 'KITCHEN',
    location: 'M2N Delhi Residency',
    reqs: [
      'A forceful opinion on slow technique and the humility to document it',
      'Institution-level brigade experience, heritage-recipe curiosity',
      'Willing to keep the 1926 ledger tradition alive',
    ],
  },
  {
    title: 'Spa Director',
    dept: 'WELLNESS',
    location: 'M2N Goa Coast House',
    reqs: [
      'Ayurvedic lineage training — BAMS or equivalent certification',
      'Runs a treatment floor like a concert hall: tuned, timed, silent',
      'Believes darkness is an amenity',
    ],
  },
  {
    title: 'Front Office Lead',
    dept: 'THE HOUSE',
    location: 'M2N Jaipur Palace',
    reqs: [
      'Receives guests under a neem tree, not a desk',
      'Remembers names after one hearing, preferences after two',
      'Comfortable with eleven rooms and infinite attention',
    ],
  },
  {
    title: 'Architect-in-Residence',
    dept: 'STUDIO M2N',
    location: 'Restoration sites, pan-India',
    reqs: [
      'Conservation architecture background; AKT or INTACH exposure a plus',
      'Draws section before elevation, always',
      'Accepts that the building is the client, not the brief',
    ],
  },
  {
    title: 'Sommelier',
    dept: 'KITCHEN',
    location: 'Copper & Vine, Udaipur',
    reqs: [
      'WSET Level 3 or equivalent; Indian wine fluency mandatory',
      'Can hold a forty-minute table conversation without mentioning points',
      'Understands that the lake is the pairing',
    ],
  },
]

export default function Careers() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <>
      <Helmet>
        <title>Careers — M2N Group of Hotels</title>
        <meta name="description" content="Six open roles across the houses — general management, kitchen, wellness, studio and cellar." />
      </Helmet>

      {/* HERO */}
      <section className="overflow-hidden pb-24 pt-40 md:pt-48">
        <div className="editorial-grid">
          <p className="u-label col-span-12 text-terracotta">People</p>
          <h1 className="t-hero col-span-12 mt-6 whitespace-nowrap text-[clamp(4rem,14vw,12rem)] leading-[0.85]">
            WE ARE
          </h1>
          <h1 className="t-hero col-span-12 -mt-2 whitespace-nowrap text-right text-[clamp(4.5rem,17vw,15rem)] italic leading-[0.85] text-terracotta">
            <em className="font-normal">hiring.</em>
          </h1>
          <p className="col-span-12 mt-12 max-w-[540px] text-[0.95rem] font-light leading-[1.85] text-muted md:col-span-5">
            We hire slowly and keep people for decades. Six roles are open this season — read the
            requirements twice; we mean every word of them.
          </p>
        </div>
      </section>

      {/* CULTURE STRIP */}
      <section className="pb-16 md:pb-20">
        <div className="editorial-grid items-center">
          <div className="col-span-12 md:col-span-7">
            <ImageReveal src={u('photo-1493106641515-6b5631de4bb9', 1600)} direction="left" className="aspect-[16/9]" viewCursor />
          </div>
          <div className="col-span-12 mt-10 md:col-span-4 md:col-start-9 md:mt-0">
            <RiTeamLine size={28} className="text-terracotta" />
            <p className="t-quote mt-6 text-[clamp(1.5rem,2.6vw,2.2rem)]">
              &ldquo;Sixty-two artisans, four chefs de cuisine, one court astrologer. All colleagues.&rdquo;
            </p>
            <p className="u-label-sm mt-6 text-warm">— HR Charter, margin note</p>
          </div>
        </div>
      </section>

      {/* ACCORDION LISTINGS */}
      <section className="pb-16 md:pb-24">
        <div className="editorial-grid">
          <div className="col-span-12 md:col-span-10 md:col-start-2">
            {ROLES.map((r, i) => {
              const isOpen = open === i
              return (
                <div key={r.title} className="border-b border-line first:border-t">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="grid w-full grid-cols-12 items-center gap-3 py-8 text-left md:py-10"
                  >
                    <span className="u-label-sm col-span-2 text-warm md:col-span-1">0{i + 1}</span>
                    <span className="col-span-8 md:col-span-5">
                      <span className="t-section block text-[clamp(1.6rem,3.4vw,3.2rem)] leading-none transition-colors duration-400 group-hover:text-terracotta">
                        {r.title}
                      </span>
                    </span>
                    <span className="col-span-9 col-start-3 flex flex-col gap-1 md:col-span-4 md:col-start-7">
                      <span className="u-label-sm text-sage">{r.dept}</span>
                      <span className="u-label-sm flex items-center gap-2 text-muted">
                        <RiMapPinLine size={12} className="text-terracotta" /> {r.location}
                      </span>
                    </span>
                    <span className="col-span-3 col-start-10 flex justify-end md:col-span-2 md:col-start-11">
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-400 ${
                          isOpen ? 'border-terracotta bg-terracotta text-porcelain' : 'border-line text-ink'
                        }`}
                      >
                        <RiAddLine size={18} />
                      </motion.span>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-12 gap-6 pb-12 md:pl-[8.333%]">
                          <div className="col-span-12 md:col-span-7">
                            <p className="u-label-sm mb-6 text-warm">We ask for</p>
                            <ul className="flex flex-col gap-4">
                              {r.reqs.map((req) => (
                                <li key={req} className="flex items-start gap-3 text-[0.92rem] font-light leading-relaxed text-muted">
                                  <RiCheckLine size={16} className="mt-0.5 shrink-0 text-sage" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="col-span-12 flex items-end md:col-span-4 md:col-start-9">
                            <a
                              href={`mailto:people@m2nhotels.com?subject=${encodeURIComponent('Application — ' + r.title)}`}
                              className="u-label link-line text-ink"
                            >
                              Apply <RiArrowRightLine size={15} className="text-terracotta" />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
          <p className="u-label-sm col-span-12 mt-12 text-center text-warm md:col-span-10 md:col-start-2">
            Nothing fits? Write anyway — people@m2nhotels.com. Slow replies, sincere ones.
          </p>
        </div>
      </section>
    </>
  )
}

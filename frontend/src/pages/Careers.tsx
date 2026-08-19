import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { RiAddLine, RiArrowRightLine, RiMapPinLine, RiTeamLine, RiCheckLine } from 'react-icons/ri'
import { u } from '../lib/lib'

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

      {/* HEADER */}
      <div className="pb-16 pt-24 md:pt-32 px-6 max-w-[1280px] mx-auto text-center border-b border-border">
        <p className="text-m2n-saffron font-bold tracking-[2px] text-[11px] mb-3 uppercase">People</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] text-m2n-ink font-bold leading-tight">
          WE ARE <span className="italic font-medium text-m2n-saffron">hiring.</span>
        </h1>
        <p className="mt-6 text-sm text-text-2 max-w-lg mx-auto leading-relaxed">
          We hire slowly and keep people for decades. Six roles are open this season — read the requirements twice; we mean every word of them.
        </p>
      </div>

      {/* CULTURE STRIP */}
      <div className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white border border-border rounded-xl p-8 shadow-sm">
          <div className="h-[300px] rounded-lg overflow-hidden border border-border relative">
            <img src={u('photo-1493106641515-6b5631de4bb9', 1600)} alt="Team" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <RiTeamLine size={32} className="text-m2n-saffron mb-6" />
            <p className="font-display text-3xl text-m2n-ink font-bold leading-tight mb-4">
              &ldquo;Sixty-two artisans, four chefs de cuisine, one court astrologer. All colleagues.&rdquo;
            </p>
            <p className="text-[11px] font-bold text-text-3 uppercase tracking-wider">— HR Charter, margin note</p>
          </div>
        </div>
      </div>

      {/* ACCORDION LISTINGS */}
      <div className="max-w-[1080px] mx-auto px-6 pb-32">
        <div className="flex flex-col gap-4">
          {ROLES.map((r, i) => {
            const isOpen = open === i
            return (
              <div key={r.title} className="bg-white border border-border rounded-xl overflow-hidden shadow-sm transition-all duration-300">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full grid grid-cols-1 md:grid-cols-12 items-center gap-4 p-6 md:p-8 text-left hover:bg-bg-soft transition-colors"
                >
                  <span className="text-[11px] font-bold text-m2n-saffron uppercase tracking-widest md:col-span-1">0{i + 1}</span>
                  <span className="md:col-span-6">
                    <span className="font-display text-2xl text-m2n-ink font-bold">
                      {r.title}
                    </span>
                  </span>
                  <span className="flex flex-col gap-1 md:col-span-4">
                    <span className="text-[10px] font-bold text-m2n-emerald uppercase tracking-wider">{r.dept}</span>
                    <span className="text-xs text-text-2 font-medium flex items-center gap-1.5">
                      <RiMapPinLine size={14} className="text-m2n-saffron" /> {r.location}
                    </span>
                  </span>
                  <span className="hidden md:flex justify-end md:col-span-1">
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 ${
                        isOpen ? 'border-m2n-ink bg-m2n-ink text-white' : 'border-border text-text-2'
                      }`}
                    >
                      <RiAddLine size={20} />
                    </motion.span>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 md:p-8 pt-0 border-t border-border mt-2 bg-bg-soft/50">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6">
                          <div className="md:col-span-8 md:col-start-2">
                            <p className="text-[10px] font-bold text-text-3 uppercase tracking-wider mb-4">We ask for</p>
                            <ul className="flex flex-col gap-3">
                              {r.reqs.map((req) => (
                                <li key={req} className="flex items-start gap-3 text-sm text-text-2 font-medium leading-relaxed">
                                  <RiCheckLine size={18} className="mt-0.5 shrink-0 text-m2n-emerald" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="md:col-span-3 flex items-end justify-start md:justify-end">
                            <a
                              href={`mailto:people@m2nhotels.com?subject=${encodeURIComponent('Application — ' + r.title)}`}
                              className="btn btn-primary px-6 py-2.5 flex items-center gap-2"
                            >
                              Apply <RiArrowRightLine size={16} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
        
        <p className="text-[11px] font-bold text-text-3 uppercase tracking-widest mt-12 text-center">
          Nothing fits? Write anyway — <a href="mailto:people@m2nhotels.com" className="text-m2n-ink hover:text-m2n-saffron hover:underline">people@m2nhotels.com</a>.
        </p>
      </div>
    </>
  )
}

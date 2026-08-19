import { Helmet } from 'react-helmet-async'
import { RiTimerLine, RiDropLine } from 'react-icons/ri'
import { inr, u } from '../lib/lib'

const TREATMENTS = [
  {
    name: 'Abhyanga',
    time: '90 MIN',
    price: 12500,
    desc: 'Synchronised four-hand warm-oil therapy drawing on two Ayurvedic lineages. The nervous system is the guest; the body merely hosts it.',
  },
  {
    name: 'Shirodhara',
    time: '75 MIN',
    price: 14000,
    desc: 'A slow thread of medicated oil over the forehead, held at exactly blood temperature. Conducted in the darkest, quietest room we own.',
  },
  {
    name: 'Udvartana',
    time: '60 MIN',
    price: 9800,
    desc: 'Herbal-powder exfoliation using chickpea, sandalwood and rose, ground fresh each morning in the spa\u2019s own stone mill.',
  },
]

export default function Spa() {
  return (
    <div className="pb-12 md:pb-24 pt-24 md:pt-32 px-6 max-w-[1280px] mx-auto min-h-screen">
      <Helmet>
        <title>Spa & Wellness — M2N Group</title>
        <meta name="description" content="Abhyanga, Shirodhara, Udvartana — Ayurvedic rituals delivered with clinical calm at every M2N spa pavilion." />
      </Helmet>
      
      {/* HEADER */}
      <div className="mb-16 border-b border-border pb-8 text-center">
        <p className="text-m2n-saffron font-bold tracking-[2px] text-[11px] mb-3 uppercase">Spa & Wellness</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] text-m2n-ink font-bold leading-tight max-w-2xl mx-auto">
          Stillness is the deepest <br/><span className="italic font-medium text-m2n-saffron">form of luxury.</span>
        </h1>
        <p className="mt-6 text-sm text-text-2 max-w-lg mx-auto leading-relaxed">
          Abhyanga, Shirodhara, Udvartana — Ayurvedic rituals delivered with clinical calm at every M2N spa pavilion. We treat nothing. We remove noise until the body remembers what it already knew.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
         <div className="rounded-xl overflow-hidden shadow-sm h-[300px] md:h-auto">
            <img src={u('photo-1540555700478-4be289fbecef', 1200)} alt="Spa" className="w-full h-full object-cover" />
         </div>
         <div className="flex flex-col gap-6 justify-center">
            {TREATMENTS.map((t, i) => (
              <div key={t.name} className="border-b border-border pb-6 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display text-2xl text-m2n-ink font-bold">{t.name}</h3>
                  <span className="text-[10px] font-bold text-m2n-saffron uppercase tracking-widest">0{i+1}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-text-2 font-medium mb-3">
                  <RiTimerLine className="text-m2n-saffron"/> {t.time}
                </div>
                <p className="text-sm text-text-2 leading-relaxed mb-4">{t.desc}</p>
                <div className="flex justify-between items-center">
                   <p className="text-m2n-ink font-bold">{inr(t.price)}</p>
                   <button className="btn btn-ghost px-4 py-2 text-xs">Book Ritual</button>
                </div>
              </div>
            ))}
         </div>
      </div>
      
      {/* FOOTER NOTE */}
      <div className="bg-bg-soft rounded-xl p-8 flex items-start gap-4">
         <RiDropLine className="text-m2n-saffron shrink-0" size={24} />
         <p className="text-sm text-text-2 leading-relaxed">
            Every ritual includes the steam grotto, the salt wall and ninety unhurried minutes afterwards in the tea court — phones sleep in lockers here.
         </p>
      </div>
    </div>
  )
}

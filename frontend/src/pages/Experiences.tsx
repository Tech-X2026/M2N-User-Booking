import { Helmet } from 'react-helmet-async'
import { RiTimerLine, RiArrowRightUpLine } from 'react-icons/ri'
import { experiences } from '../data/experiences'
import { inr } from '../lib/lib'

export default function Experiences() {
  const list = experiences.slice(0, 6)

  return (
    <div className="pb-24 pt-32 px-6 max-w-[1280px] mx-auto min-h-screen">
      <Helmet>
        <title>Experiences — M2N Group</title>
      </Helmet>

      {/* HEADER */}
      <div className="mb-16 border-b border-border pb-8 text-center">
        <p className="text-m2n-saffron font-bold tracking-[2px] text-[11px] mb-3 uppercase">Curated by the Houses</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] text-m2n-ink font-bold leading-tight max-w-2xl mx-auto">
          Expe<span className="italic font-medium text-m2n-saffron">riences</span>
        </h1>
        <p className="mt-6 text-sm text-text-2 max-w-lg mx-auto leading-relaxed">
          Nothing on this list is subcontracted. Every experience is led by someone who lives here — a historian, a chef, a seventh-generation astrologer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {list.map((e, i) => (
          <div key={e.id} className="group flex flex-col bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-[220px] relative overflow-hidden">
               <img src={e.image} alt={e.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-[10px] font-bold text-m2n-ink uppercase tracking-wider shadow-sm">
                 {e.hotel}
               </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
               <div className="flex justify-between items-start mb-2">
                 <h3 className="font-display text-xl text-m2n-ink font-bold">{e.name}</h3>
                 <span className="text-[10px] font-bold text-m2n-saffron uppercase tracking-widest">0{i+1}</span>
               </div>
               <div className="flex items-center gap-1.5 text-[12px] text-text-2 font-medium mb-3">
                 <RiTimerLine className="text-m2n-saffron"/> {e.duration}
               </div>
               <p className="text-[13px] text-text-2 leading-relaxed mb-6 flex-grow">{e.desc}</p>
               
               <div className="flex items-center justify-between border-t border-border pt-4">
                 <p className="text-sm text-m2n-saffron font-bold">{inr(e.price)} <span className="text-[10px] text-text-3 font-normal uppercase tracking-wider">/ Guest</span></p>
                 <button className="btn btn-ghost px-3 py-2 text-xs flex items-center gap-1">Plan <RiArrowRightUpLine/></button>
               </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-bg-soft rounded-xl p-10 text-center max-w-3xl mx-auto border border-border">
         <p className="font-display text-2xl text-m2n-ink font-bold mb-4">
           "The concierge does not sell experiences. <span className="italic text-m2n-saffron font-medium">He lends you his friends.</span>"
         </p>
         <button className="btn btn-primary px-6 py-2.5 text-sm mt-4">Plan with Concierge</button>
      </div>
    </div>
  )
}

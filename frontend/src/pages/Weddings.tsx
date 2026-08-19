import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { RiCheckLine, RiGroupLine } from 'react-icons/ri'
import { u } from '../lib/lib'

const VENUES = [
  {
    name: 'The Durbar Lawn',
    hotel: 'M2N Jaipur Palace',
    capacity: 500,
    desc: 'Two acres beneath the palace facade, floored in centuries-old grass. Evening ceremonies arrive with the floodlit haveli as the only backdrop required.',
    image: u('photo-1519225421980-715cb0215aed', 1600),
  },
  {
    name: 'The Mirror Courtyard',
    hotel: 'M2N Delhi Residency',
    capacity: 200,
    desc: 'A colonnaded courtyard lined with antique thikri mirror-work. At candle-hour the whole space doubles — flame above, flame below.',
    image: u('photo-1519741497674-611481863552', 1600),
  },
  {
    name: 'The Lake Terrace',
    hotel: 'M2N Udaipur Lake House',
    capacity: 150,
    desc: 'Cantilevered over Lake Pichola with the ghat lights for decoration. Pheras at sunset, dinner as the city palace turns gold.',
    image: u('photo-1465495976277-4387d4b0b4c6', 1600),
  },
]

interface WeddingForm {
  name: string
  email: string
  city: string
  date: string
  guests: number
  message: string
}

export default function Weddings() {
  const { register, handleSubmit, reset } = useForm<WeddingForm>()
  const [sent, setSent] = useState(false)
  const todayDate = new Date().toISOString().split('T')[0];

  const onSubmit = () => {
    setSent(true)
    reset()
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <div className="pb-12 md:pb-24 pt-24 md:pt-32 px-6 max-w-[1280px] mx-auto min-h-[85vh]">
      <Helmet>
        <title>Weddings — M2N Group</title>
        <meta name="description" content="Timeless celebrations across three M2N venues." />
      </Helmet>

      {/* HEADER */}
      <div className="mb-16 border-b border-border pb-8 text-center">
        <p className="text-m2n-saffron font-bold tracking-[2px] text-[11px] mb-3 uppercase">Weddings</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] text-m2n-ink font-bold leading-tight max-w-2xl mx-auto">
          Timeless <br/><span className="italic font-medium text-m2n-saffron">celebrations.</span>
        </h1>
        <p className="mt-6 text-sm text-text-2 max-w-lg mx-auto leading-relaxed">
          One celebration at a time, across all five houses. When we host your wedding, the address belongs to you alone.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 md:mb-16 lg:mb-24">
        {VENUES.map((v) => (
          <div key={v.name} className="group flex flex-col bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-[240px] relative overflow-hidden">
               <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-[10px] font-bold text-m2n-ink uppercase tracking-wider shadow-sm">
                 {v.hotel}
               </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
               <h3 className="font-display text-xl text-m2n-ink font-bold mb-2">{v.name}</h3>
               <div className="flex items-center gap-1.5 text-[12px] text-text-2 font-medium mb-3">
                 <RiGroupLine className="text-m2n-saffron"/> Up to {v.capacity} guests
               </div>
               <p className="text-[13px] text-text-2 leading-relaxed flex-grow">{v.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FORM */}
      <div className="bg-bg-soft rounded-xl p-8 md:p-12 border border-border">
         <div className="text-center mb-10">
           <h2 className="font-display text-3xl font-bold text-m2n-ink mb-3">Tell us everything.</h2>
           <p className="text-sm text-text-2">Our celebrations director replies personally within a day. Nothing here is templated.</p>
         </div>

         <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div>
              <label className="text-[11px] font-bold text-text-3 uppercase tracking-wider mb-2 block">Full Name</label>
              <input {...register('name', { required: true })} placeholder="Aarav & Myra Kapoor" className="w-full bg-white border border-border px-4 py-3 rounded text-sm focus:outline-none focus:border-m2n-saffron transition-colors" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-text-3 uppercase tracking-wider mb-2 block">Email</label>
              <input type="email" {...register('email', { required: true })} placeholder="you@example.com" className="w-full bg-white border border-border px-4 py-3 rounded text-sm focus:outline-none focus:border-m2n-saffron transition-colors" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-text-3 uppercase tracking-wider mb-2 block">Preferred Venue</label>
              <select {...register('city')} className="w-full bg-white border border-border px-4 py-3 rounded text-sm focus:outline-none focus:border-m2n-saffron transition-colors" defaultValue="">
                <option value="" disabled>Choose an address</option>
                {VENUES.map((v) => (
                  <option key={v.name} value={v.name}>{v.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-text-3 uppercase tracking-wider mb-2 block">Expected Guests</label>
              <select {...register('guests')} className="w-full bg-white border border-border px-4 py-3 rounded text-sm focus:outline-none focus:border-m2n-saffron transition-colors" defaultValue={150}>
                {[50, 100, 150, 250, 400, 500].map((g) => (
                  <option key={g} value={g}>{g} guests</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] font-bold text-text-3 uppercase tracking-wider mb-2 block">Tentative Date</label>
              <input type="date" {...register('date')} min={todayDate} className="w-full bg-white border border-border px-4 py-3 rounded text-sm focus:outline-none focus:border-m2n-saffron transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] font-bold text-text-3 uppercase tracking-wider mb-2 block">The Celebration You Imagine</label>
              <textarea {...register('message')} rows={3} placeholder="Three evenings, two cities, one garden…" className="w-full bg-white border border-border px-4 py-3 rounded text-sm focus:outline-none focus:border-m2n-saffron transition-colors resize-none" />
            </div>
            
            <div className="md:col-span-2 flex flex-col items-center mt-4">
              {sent && (
                <div className="mb-6 flex items-center justify-center gap-2 bg-m2n-emerald/10 text-m2n-emerald px-4 py-3 rounded text-sm w-full font-medium">
                  <RiCheckLine size={18} />
                  Received. Our celebrations director will write within 24 hours.
                </div>
              )}
              <button type="submit" className="btn btn-primary w-full py-3">Send Inquiry</button>
            </div>
         </form>
      </div>
    </div>
  )
}

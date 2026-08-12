import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { RiArrowRightLine, RiCheckLine, RiGroupLine } from 'react-icons/ri'
import ParallaxImage from '../components/ParallaxImage'
import { EASE, u } from '../lib/lib'

const VIDEO =
  'https://videos.pexels.com/video-files/4669741/4669741-uhd_4096_2160_25fps.mp4'

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
    <>
      <Helmet>
        <title>Weddings — M2N Group of Hotels</title>
        <meta name="description" content="Timeless celebrations across three M2N venues — palace lawns, mirror courtyards and lake terraces." />
      </Helmet>

      {/* CINEMATIC VIDEO HERO */}
      <section className="relative h-[100svh] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={u('photo-1519741497674-611481863552', 1600)}
        >
          <source src={VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-ink/25" />

        <div className="editorial-grid relative h-full content-center">
          <div className="col-span-12">
            <div className="overflow-hidden">
              <motion.h1
                initial={{ x: '-105%' }}
                animate={{ x: 0 }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
                className="t-hero whitespace-nowrap text-[clamp(3.6rem,12vw,10rem)] text-porcelain"
              >
                TIMELESS
              </motion.h1>
            </div>
            <div className="overflow-hidden text-right">
              <motion.h1
                initial={{ x: '105%' }}
                animate={{ x: 0 }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.5 }}
                className="t-hero whitespace-nowrap text-[clamp(3.6rem,12vw,10rem)] italic text-porcelain"
              >
                <em className="font-normal">celebrations</em>
              </motion.h1>
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1 }}
            className="col-span-12 mt-10 max-w-[480px] text-sm font-light leading-[1.8] text-porcelain/85"
          >
            One celebration at a time, across all five houses. When we host your wedding, the
            address belongs to you alone.
          </motion.p>
        </div>
      </section>

      {/* VENUES */}
      <section className="py-32 md:py-44">
        <div className="editorial-grid">
          <p className="u-label col-span-12 text-terracotta">The Venues</p>
          <h2 className="t-section col-span-12 mt-4 text-[clamp(2.4rem,5vw,4.6rem)] md:col-span-7">
            Three rooms <em className="font-normal italic">the sky is part of.</em>
          </h2>
        </div>

        {VENUES.map((v, i) => (
          <div key={v.name} className="editorial-grid mt-24 items-center md:mt-36">
            <div className={`col-span-12 md:col-span-7 ${i % 2 === 1 ? 'md:order-2 md:col-start-6' : ''}`}>
              <ParallaxImage src={v.image} alt={v.name} speed={0.5} className="aspect-[16/10]" viewCursor />
            </div>
            <div className={`col-span-12 mt-10 md:col-span-4 md:mt-0 ${i % 2 === 1 ? 'md:order-1 md:col-start-1' : 'md:col-start-9'}`}>
              <p className="u-label-sm text-sage">{v.hotel}</p>
              <h3 className="t-section mt-4 text-[clamp(2rem,3.8vw,3.6rem)]">{v.name}</h3>
              <p className="u-label mt-5 flex items-center gap-2 text-muted">
                <RiGroupLine size={15} className="text-terracotta" /> Up to {v.capacity} guests
              </p>
              <p className="mt-6 max-w-[420px] text-[0.95rem] font-light leading-[1.85] text-muted">{v.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* INQUIRY FORM */}
      <section className="border-t border-line bg-cream/60 py-32 md:py-44">
        <div className="editorial-grid">
          <div className="col-span-12 md:col-span-5">
            <p className="u-label text-terracotta">Begin the Conversation</p>
            <h2 className="t-hero mt-6 text-[clamp(3rem,7vw,6rem)] leading-[0.9]">
              Tell us <em className="font-normal italic text-terracotta">everything.</em>
            </h2>
            <p className="mt-8 max-w-[440px] text-[0.95rem] font-light leading-[1.85] text-muted">
              Our celebrations director replies personally within a day. Nothing here is templated —
              no packages, no catalogues, no two weddings alike.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="col-span-12 mt-16 grid grid-cols-1 gap-x-14 gap-y-10 md:col-span-6 md:col-start-7 md:mt-4 md:grid-cols-2">
            <div>
              <label className="u-label-sm text-muted">Full name</label>
              <input {...register('name', { required: true })} placeholder="Aarav &amp; Myra Kapoor" className="field" />
            </div>
            <div>
              <label className="u-label-sm text-muted">Email</label>
              <input type="email" {...register('email', { required: true })} placeholder="you@example.com" className="field" />
            </div>
            <div>
              <label className="u-label-sm text-muted">Preferred venue</label>
              <select {...register('city')} className="field" defaultValue="">
                <option value="" disabled>Choose an address</option>
                {VENUES.map((v) => (
                  <option key={v.name} value={v.name}>{v.name} — {v.hotel.replace('M2N ', '')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="u-label-sm text-muted">Tentative date</label>
              <input type="date" {...register('date')} min={todayDate} className="field" />
            </div>
            <div>
              <label className="u-label-sm text-muted">Expected guests</label>
              <select {...register('guests')} className="field" defaultValue={150}>
                {[50, 100, 150, 250, 400, 500].map((g) => (
                  <option key={g} value={g}>{g} guests</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="u-label-sm text-muted">The celebration you imagine</label>
              <textarea {...register('message')} rows={3} placeholder="Three evenings, two cities, one garden…" className="field resize-none" />
            </div>

            <div className="md:col-span-2">
              {sent && (
                <div className="mb-6 flex items-center gap-3 border border-sage/40 bg-porcelain px-4 py-3">
                  <RiCheckLine className="text-sage" size={18} />
                  <p className="text-sm font-light">Received. Our celebrations director will write within 24 hours.</p>
                </div>
              )}
              <button type="submit" className="btn-outline">
                Send Inquiry <RiArrowRightLine size={15} />
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import {
  RiMailLine,
  RiPhoneLine,
  RiInstagramLine,
  RiTwitterLine,
  RiLinkedinLine,
  RiCheckLine,
} from 'react-icons/ri'
import { u } from '../lib/lib'

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export default function Contact() {
  const { register, handleSubmit, reset } = useForm<ContactForm>()
  const [sent, setSent] = useState(false)

  const onSubmit = () => {
    setSent(true)
    reset()
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <>
      <Helmet>
        <title>Contact — M2N Group of Hotels</title>
        <meta name="description" content="Get in touch — reservations, press, partnerships and slow, sincere replies." />
      </Helmet>

      <section className="min-h-[100svh]">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT — PARALLAX IMAGE */}
          <div className="relative hidden h-[100svh] lg:block">
            <img
              src={u('photo-1587474260584-136574528ed5', 1800)}
              alt="Delhi at dusk"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-m2n-ink/80 via-m2n-ink/20 to-transparent" />
            <div className="absolute bottom-16 left-16 right-16">
              <p className="text-[11px] font-bold text-m2n-saffron uppercase tracking-widest mb-4">Correspondence Desk</p>
              <p className="font-display text-3xl text-white font-bold leading-tight max-w-[380px]">
                &ldquo;We answer everything. Eventually, personally, and in full sentences.&rdquo;
              </p>
            </div>
          </div>

          {/* RIGHT — FORM */}
          <div className="flex flex-col justify-center px-6 pb-24 pt-32 md:px-14 lg:pt-24 xl:px-24 min-h-screen">
            <div className="mb-12">
              <p className="text-[11px] font-bold text-m2n-saffron uppercase tracking-widest mb-3">Correspondence</p>
              <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] text-m2n-ink font-bold leading-tight">
                GET IN <span className="italic font-medium text-m2n-saffron">touch.</span>
              </h1>
            </div>

            <div className="bg-white border border-border rounded-xl p-8 shadow-sm">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-bold text-text-3 uppercase tracking-wider mb-2">Name</label>
                    <input {...register('name', { required: true })} placeholder="Your full name" className="sfield w-full" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-text-3 uppercase tracking-wider mb-2">Email</label>
                    <input type="email" {...register('email', { required: true })} placeholder="you@example.com" className="sfield w-full" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-text-3 uppercase tracking-wider mb-2">Subject</label>
                  <select {...register('subject')} className="sfield w-full" defaultValue="Reservation">
                    <option>Reservation</option>
                    <option>Wedding Inquiry</option>
                    <option>Press</option>
                    <option>Partnership</option>
                    <option>Careers</option>
                    <option>Something Else</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-text-3 uppercase tracking-wider mb-2">Message</label>
                  <textarea {...register('message', { required: true })} rows={4} placeholder="Tell us slowly, at whatever length it needs…" className="sfield w-full resize-none" />
                </div>

                {sent && (
                  <div className="flex items-center gap-3 bg-m2n-emerald/10 text-m2n-emerald px-4 py-3 rounded text-sm font-medium mt-2">
                    <RiCheckLine size={18} />
                    <p>Received. Expect a full-sentence reply within the day.</p>
                  </div>
                )}

                <button type="submit" className="btn btn-primary py-3 w-full mt-2">
                  Send Message
                </button>
              </form>
            </div>

            {/* DIRECT INFO */}
            <div className="mt-16 grid grid-cols-1 gap-10 border-t border-border pt-12 sm:grid-cols-2">
              <div className="flex flex-col gap-4">
                <a href="tel:+9196587100" className="flex items-center gap-3 text-sm font-medium text-m2n-ink hover:text-m2n-saffron transition-colors">
                  <RiPhoneLine size={18} className="text-m2n-saffron" /> Reception: +9196587100
                </a>
                <a href="tel:+9196587100" className="flex items-center gap-3 text-sm font-medium text-m2n-ink hover:text-m2n-saffron transition-colors">
                  <RiPhoneLine size={18} className="text-m2n-saffron" /> Reservations: +9196587100
                </a>
                <a href="mailto:m2nhotelsbookinglko@gmail.com" className="flex items-center gap-3 text-sm font-medium text-m2n-ink hover:text-m2n-saffron transition-colors">
                  <RiMailLine size={18} className="text-m2n-saffron" /> Email: m2nhotelsbookinglko@gmail.com
                </a>
              </div>
              <div>
                <p className="text-[11px] font-bold text-text-3 uppercase tracking-widest mb-4">Elsewhere</p>
                <div className="flex gap-3">
                  {[
                    { label: 'Instagram', icon: RiInstagramLine },
                    { label: 'Twitter', icon: RiTwitterLine },
                    { label: 'LinkedIn', icon: RiLinkedinLine },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href="#"
                      aria-label={s.label}
                      className="icon-btn hover:border-m2n-saffron hover:text-m2n-saffron"
                    >
                      <s.icon size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

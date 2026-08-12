import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import {
  RiMailLine,
  RiPhoneLine,
  RiInstagramLine,
  RiTwitterLine,
  RiLinkedinLine,
  RiArrowRightLine,
  RiCheckLine,
} from 'react-icons/ri'
import ParallaxImage from '../components/ParallaxImage'
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
            <ParallaxImage
              src={u('photo-1587474260584-136574528ed5', 1800)}
              alt="Delhi at dusk"
              speed={0.45}
              className="h-full w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
            <div className="absolute bottom-12 left-12 right-12">
              <p className="u-label text-porcelain/85">Correspondence Desk</p>
              <p className="t-quote mt-4 max-w-[380px] text-2xl text-porcelain">
                &ldquo;We answer everything. Eventually, personally, and in full sentences.&rdquo;
              </p>
            </div>
          </div>

          {/* RIGHT — FORM */}
          <div className="flex flex-col justify-center px-6 pb-32 pt-40 md:px-14 lg:pt-32 xl:px-24">
            <p className="u-label text-terracotta">Correspondence</p>
            <h1 className="t-hero mt-6 text-[clamp(3.4rem,7vw,6rem)] leading-[0.9]">
              GET IN
            </h1>
            <h1 className="t-hero mt-1 text-[clamp(3.4rem,7vw,6rem)] italic leading-[0.9]">
              <em className="font-normal text-terracotta">touch.</em>
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-14 flex flex-col gap-9">
              <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                <div>
                  <label className="u-label-sm text-muted">Name</label>
                  <input {...register('name', { required: true })} placeholder="Your full name" className="field" />
                </div>
                <div>
                  <label className="u-label-sm text-muted">Email</label>
                  <input type="email" {...register('email', { required: true })} placeholder="you@example.com" className="field" />
                </div>
              </div>
              <div>
                <label className="u-label-sm text-muted">Subject</label>
                <select {...register('subject')} className="field" defaultValue="Reservation">
                  <option>Reservation</option>
                  <option>Wedding Inquiry</option>
                  <option>Press</option>
                  <option>Partnership</option>
                  <option>Careers</option>
                  <option>Something Else</option>
                </select>
              </div>
              <div>
                <label className="u-label-sm text-muted">Message</label>
                <textarea {...register('message', { required: true })} rows={4} placeholder="Tell us slowly, at whatever length it needs…" className="field resize-none" />
              </div>

              {sent && (
                <div className="flex items-center gap-3 border border-sage/40 bg-cream px-4 py-3">
                  <RiCheckLine className="text-sage" size={18} />
                  <p className="text-sm font-light">Received. Expect a full-sentence reply within the day.</p>
                </div>
              )}

              <button type="submit" className="btn-outline w-fit">
                Send Message <RiArrowRightLine size={15} />
              </button>
            </form>

            {/* DIRECT INFO */}
            <div className="mt-16 grid grid-cols-1 gap-10 border-t border-line pt-12 sm:grid-cols-2">
              <div className="flex flex-col gap-5">
                <a href="tel:+9196587100" className="link-line flex w-fit items-center gap-3 text-sm font-light text-ink">
                  <RiPhoneLine size={16} className="text-terracotta" /> Reception: +9196587100
                </a>
                <a href="tel:+9196587100" className="link-line flex w-fit items-center gap-3 text-sm font-light text-ink">
                  <RiPhoneLine size={16} className="text-terracotta" /> Reservations: +9196587100
                </a>
                <a href="mailto:m2nhotelsbookinglko@gmail.com" className="link-line flex w-fit items-center gap-3 text-sm font-light text-ink">
                  <RiMailLine size={16} className="text-terracotta" /> Email: m2nhotelsbookinglko@gmail.com
                </a>
              </div>
              <div>
                <p className="u-label-sm mb-5 text-warm">Elsewhere</p>
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
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-muted transition-colors duration-400 hover:border-terracotta hover:text-terracotta"
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

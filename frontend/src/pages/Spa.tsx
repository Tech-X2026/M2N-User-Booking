import { useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, useScroll, useTransform } from 'framer-motion'
import { RiArrowRightLine, RiTimerLine, RiLeafLine, RiDropLine } from 'react-icons/ri'
import ParallaxImage from '../components/ParallaxImage'
import { u, inr } from '../lib/lib'

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
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const circleScale = useTransform(scrollYProgress, [0, 1], [1, 2.1])
  const circleOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.15])

  return (
    <>
      <Helmet>
        <title>Spa & Wellness — M2N Group of Hotels</title>
        <meta name="description" content="Abhyanga, Shirodhara, Udvartana — Ayurvedic rituals delivered with clinical calm at every M2N spa pavilion." />
      </Helmet>

      {/* HERO — BREATHING CIRCLE */}
      <section ref={heroRef} className="relative flex h-[100svh] flex-col items-center justify-center overflow-hidden pt-20">
        <motion.div
          className="absolute h-[46vmin] w-[46vmin]"
          style={{ scale: circleScale, opacity: circleOpacity }}
        >
          <div className="breathe h-full w-full rounded-full border border-terracotta/50" />
        </motion.div>
        <motion.div
          className="absolute h-[64vmin] w-[64vmin]"
          style={{ scale: circleScale, opacity: circleOpacity }}
        >
          <div className="breathe breathe-rev h-full w-full rounded-full border border-line" />
        </motion.div>
        <div className="relative text-center">
          <p className="u-label text-terracotta">Spa &amp; Wellness</p>
          <h1 className="t-hero mt-7 text-[clamp(3.4rem,10vw,8.5rem)]">STILLNESS</h1>
          <p className="t-quote mx-auto mt-7 max-w-[560px] px-6 text-[clamp(1.2rem,2.4vw,2rem)] text-muted">
            is the deepest form of luxury.
          </p>
        </div>
        <p className="u-label-sm absolute bottom-10 text-warm">Breathe with the page — scroll slowly</p>
      </section>

      {/* FULL-WIDTH IMAGE */}
      <section className="py-24 md:py-32">
        <ParallaxImage
          src={u('photo-1540555700478-4be289fbecef', 2200)}
          alt="Spa ritual"
          speed={0.6}
          className="h-[80svh] w-full"
          viewCursor
        />
        <div className="editorial-grid mt-6">
          <p className="u-label-sm col-span-12 text-warm md:col-span-4">
            The Spa Pavilion — M2N Goa Coast House
          </p>
        </div>
      </section>

      {/* PHILOSOPHY STRIP */}
      <section className="border-y border-line bg-cream/60 py-24 md:py-32">
        <div className="editorial-grid">
          <RiLeafLine className="col-span-12 text-sage md:col-span-1" size={30} />
          <p className="t-quote col-span-12 text-[clamp(1.6rem,3vw,2.6rem)] md:col-span-9">
            &ldquo;We treat nothing. We remove noise until the body remembers what it already knew.&rdquo;
          </p>
          <p className="u-label-sm col-span-12 self-end text-warm md:col-span-2">— Spa Charter, No. 03</p>
        </div>
      </section>

      {/* TREATMENTS */}
      <section className="py-32 md:py-44">
        <div className="editorial-grid">
          <p className="u-label col-span-12 text-terracotta md:col-span-3">Rituals</p>
          <h2 className="t-section col-span-12 mt-2 text-[clamp(2.2rem,4.5vw,4rem)] md:col-span-6">
            Three ways <em className="font-normal italic">to disappear.</em>
          </h2>

          <div className="col-span-12 mt-20">
            {TREATMENTS.map((t, i) => (
              <div
                key={t.name}
                className="row-shift group grid grid-cols-12 items-baseline gap-4 border-b border-line py-12 first:border-t md:py-16"
              >
                <span className="u-label col-span-2 text-warm md:col-span-1">0{i + 1}</span>
                <h3 className="t-section col-span-10 text-[clamp(2rem,5vw,4.4rem)] transition-colors duration-400 group-hover:text-terracotta md:col-span-5">
                  {t.name}
                </h3>
                <p className="col-span-10 col-start-3 max-w-[440px] text-[0.92rem] font-light leading-[1.8] text-muted md:col-span-4 md:col-start-7">
                  {t.desc}
                </p>
                <div className="col-span-10 col-start-3 md:col-span-2 md:col-start-11 md:text-right">
                  <p className="u-label-sm flex items-center gap-2 text-muted md:justify-end">
                    <RiTimerLine size={13} className="text-terracotta" /> {t.time}
                  </p>
                  <p className="t-section mt-3 text-2xl text-terracotta">{inr(t.price)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="col-span-12 mt-24 flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
            <div className="flex items-start gap-5">
              <RiDropLine className="mt-1 text-terracotta" size={22} />
              <p className="max-w-[440px] text-[0.95rem] font-light leading-[1.85] text-muted">
                Every ritual includes the steam grotto, the salt wall and ninety unhurried minutes
                afterwards in the tea court — phones sleep in lockers here.
              </p>
            </div>
            <button
              onClick={() => window.dispatchEvent(new Event('m2n:reserve'))}
              className="btn-outline"
            >
              Book a Ritual <RiArrowRightLine size={15} />
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

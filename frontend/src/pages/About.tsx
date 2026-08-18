import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { RiDoubleQuotesL } from 'react-icons/ri'
import ParallaxImage from '../components/ParallaxImage'
import ImageReveal from '../components/ImageReveal'

const SECTIONS = [
  {
    num: '01',
    id: 'overview',
    title: 'M2N Group of Hotels',
    quote: 'Comfort • Hospitality • Service • Experience',
    body: [
      'Welcome to M2N Group of Hotels, offering comfortable and well-appointed luxury accommodation in the heart of Lucknow.',
      'Our properties are designed to provide a memorable and relaxing stay for business travellers, couples, families, corporate guests, and leisure travellers alike.'
    ],
    image: '/About us/1.JPG',
    caption: 'Comfortable stay in the heart of Lucknow',
  },
  {
    num: '02',
    id: 'aurelia-grand',
    title: 'M2N Aurelia Grand',
    quote: 'Your comfortable stay in Gomti Nagar, Lucknow.',
    body: [
      'Located on Malhaur Road, Gomti Nagar, M2N Aurelia Grand features 20 luxury rooms spread across two floors. Each room offers 150 sq. ft. of well-appointed space with modern amenities, comfortable double beds, and high-speed Wi-Fi.',
      'Guests can enjoy our in-house dining facility, which serves breakfast, lunch, and dinner with a variety of veg and non-veg options. We also cater to corporate bookings, banquets, and social events.'
    ],
    image: '/About us/2.JPG',
    caption: 'M2N Aurelia Grand, Gomti Nagar',
  },
  {
    num: '03',
    id: 'zaarang-inn',
    title: 'M2N Zaarang Inn',
    quote: 'Luxury accommodation on Dewa Road, Chinhat.',
    body: [
      'M2N Zaarang Inn offers 15 Deluxe and Super Deluxe rooms. Each room is spacious, ranging from 200 to 220 sq. ft., designed to provide ultimate comfort and relaxation with modern features.',
      'Our property features an in-house restaurant, 24-hour front desk assistance, daily housekeeping, and excellent facilities for hosting corporate meetings and social celebrations.'
    ],
    image: '/About us/3.JPG',
    caption: 'M2N Zaarang Inn, Chinhat',
  },
  {
    num: '04',
    id: 'corporate-careers',
    title: 'Corporate & Careers',
    quote: 'Building careers in hospitality and hosting your memorable events.',
    body: [
      'We welcome corporate travellers, tour groups, wedding guests, and long-stay guests, offering special rates based on your requirements and duration of stay.',
      'M2N Group Of Hotels also regularly welcomes talented hospitality professionals. If you are passionate about service, we invite you to explore career opportunities with our teams.'
    ],
    image: '/About us/4.JPG',
    caption: 'Join M2N Group Of Hotels',
  },
]

export default function About() {
  const [active, setActive] = useState('01')
  const refs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.num || '01')
        })
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )
    refs.current.forEach((r) => r && obs.observe(r))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <Helmet>
        <title>About — M2N Group of Hotels</title>
        <meta name="description" content="M2N Group of Hotels offers comfortable and well-appointed luxury accommodation in Lucknow, including M2N Aurelia Grand and M2N Zaarang Inn." />
      </Helmet>

      {/* HEADER */}
      <div className="pb-16 pt-32 px-6 max-w-[1280px] mx-auto text-center border-b border-border">
        <p className="text-m2n-saffron font-bold tracking-[2px] text-[11px] mb-3 uppercase">The Group</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] text-m2n-ink font-bold leading-tight">
          M2N <span className="italic font-medium text-m2n-saffron">Group of Hotels</span>
        </h1>
      </div>

      {/* STICKY SIDEBAR + SECTIONS */}
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 pb-24 pt-16">
        {/* Sidebar */}
        <aside className="hidden md:col-span-3 md:block">
          <div className="sticky top-32">
            <div className="font-display text-[6rem] font-bold leading-none text-border transition-colors duration-500">
              {active}
            </div>
            <div className="mt-4 h-1 w-24 bg-bg-soft rounded overflow-hidden">
              <div
                className="h-full bg-m2n-saffron transition-all duration-700"
                style={{ width: `${(parseInt(active) / 4) * 100}%` }}
              />
            </div>
            <ul className="mt-8 flex flex-col gap-4">
              {SECTIONS.map((s) => (
                <li key={s.num} className={`text-[11px] font-bold uppercase tracking-wider transition-colors duration-400 ${active === s.num ? 'text-m2n-ink' : 'text-text-3'}`}>
                  {s.title}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Content */}
        <div className="md:col-span-8 md:col-start-5">
          {SECTIONS.map((s, i) => (
            <section
              key={s.id}
              data-num={s.num}
              ref={(el) => {
                refs.current[i] = el
              }}
              className="mb-24 pb-24 border-b border-border last:mb-0 last:pb-0 last:border-b-0"
            >
              <p className="text-[11px] font-bold text-m2n-saffron uppercase tracking-wider md:hidden mb-4">{s.num} — {s.title}</p>
              <h2 className="font-display text-3xl md:text-4xl text-m2n-ink font-bold leading-tight mb-8">
                <RiDoubleQuotesL className="inline-block text-m2n-saffron mb-2" size={24} />
                <br />
                {s.quote}
              </h2>
              
              <div className="max-w-2xl bg-white border border-border p-8 rounded-xl shadow-sm mb-10">
                {s.body.map((p, j) => (
                  <p key={j} className="mb-4 text-sm text-text-2 leading-relaxed last:mb-0">
                    {p}
                  </p>
                ))}
              </div>
              
              <div className="rounded-xl overflow-hidden border border-border">
                {i % 2 === 0 ? (
                  <ImageReveal src={s.image} direction="left" className="aspect-[16/9]" viewCursor />
                ) : (
                  <ParallaxImage src={s.image} speed={0.45} className="aspect-[16/9]" viewCursor />
                )}
                <div className="bg-bg-soft px-4 py-3 border-t border-border">
                  <p className="text-[10px] font-bold text-text-2 uppercase tracking-wider text-center">{s.caption}</p>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}

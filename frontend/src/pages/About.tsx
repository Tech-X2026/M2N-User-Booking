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

      {/* HERO */}
      <section className="overflow-hidden pb-16 pt-40 md:pt-48">
        <div className="editorial-grid">
          <p className="u-label col-span-12 text-terracotta">The Group</p>
          <h1 className="t-hero col-span-12 mt-6 text-[clamp(3.5rem,8vw,9rem)] leading-[0.9]">
            M2N <em className="font-normal italic text-terracotta">Group Of Hotels</em>
          </h1>
        </div>
      </section>

      {/* STICKY SIDEBAR + SECTIONS */}
      <div className="editorial-grid pb-16 pt-10 md:pb-24">
        {/* Sidebar */}
        <aside className="hidden md:col-span-3 md:block">
          <div className="sticky top-36">
            <div className="font-display text-[7rem] font-light leading-none text-line transition-colors duration-500">
              {active}
            </div>
            <div className="mt-6 h-px w-24 bg-line">
              <div
                className="h-px bg-terracotta transition-all duration-700"
                style={{ width: `${(parseInt(active) / 4) * 100}%` }}
              />
            </div>
            <ul className="mt-8 flex flex-col gap-3">
              {SECTIONS.map((s) => (
                <li key={s.num} className={`u-label-sm transition-colors duration-400 ${active === s.num ? 'text-terracotta' : 'text-warm'}`}>
                  {s.title}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Content */}
        <div className="col-span-12 md:col-span-8 md:col-start-5">
          {SECTIONS.map((s, i) => (
            <section
              key={s.id}
              data-num={s.num}
              ref={(el) => {
                refs.current[i] = el
              }}
              className="mb-16 border-t border-line pt-10 md:pt-14 first:border-t-0 first:pt-0 md:mb-24 last:mb-0"
            >
              <p className="u-label text-terracotta md:hidden">{s.num} — {s.title}</p>
              <h2 className="t-quote mt-4 text-[clamp(1.9rem,3.6vw,3.4rem)]">
                <RiDoubleQuotesL className="mb-4 inline-block text-terracotta" size={26} />
                <br />
                {s.quote}
              </h2>
              <div className="mt-10 max-w-[540px]">
                {s.body.map((p, j) => (
                  <p key={j} className="mb-6 text-[0.95rem] font-light leading-[1.85] text-muted last:mb-0">
                    {p}
                  </p>
                ))}
              </div>
              <div className={`mt-14 ${i % 2 === 0 ? 'md:mr-24' : 'md:ml-24'}`}>
                {i % 2 === 0 ? (
                  <ImageReveal src={s.image} direction="left" className="aspect-[16/10]" viewCursor />
                ) : (
                  <ParallaxImage src={s.image} speed={0.45} className="aspect-[16/10]" viewCursor />
                )}
                <p className="u-label-sm mt-4 text-warm">{s.caption}</p>
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}

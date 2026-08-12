import { useLayoutEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  children: ReactNode
  className?: string
}

/** Pinned section: vertical scroll scrubs the inner flex track horizontally */
export default function HorizontalScroll({ children, className = '' }: Props) {
  const secRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current!
      const sec = secRef.current!
      gsap.to(track, {
        x: () => -(track.scrollWidth - sec.clientWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: sec,
          start: 'top top',
          end: () => '+=' + (track.scrollWidth - sec.clientWidth),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }, secRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className={`relative h-[100svh] overflow-hidden ${className}`}>
      <div ref={trackRef} className="flex h-full items-stretch will-change-transform">
        {children}
      </div>
    </section>
  )
}

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  src: string
  alt?: string
  speed?: number
  className?: string
  viewCursor?: boolean
}

export default function ParallaxImage({
  src,
  alt = '',
  speed = 0.5,
  className = '',
  viewCursor = false,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgRef.current,
        { yPercent: -14 * speed },
        {
          yPercent: 14 * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
    }, wrapRef)
    return () => ctx.revert()
  }, [speed])

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden ${className}`}
      data-cursor={viewCursor ? 'view' : undefined}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => ScrollTrigger.refresh()}
        className="absolute left-0 top-[-15%] h-[130%] w-full object-cover"
        style={{ filter: 'saturate(0.9)' }}
      />
    </div>
  )
}

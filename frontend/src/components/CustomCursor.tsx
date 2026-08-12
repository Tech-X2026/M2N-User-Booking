import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState('')
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: -100, y: -100 })
  const ring = useRef({ x: -100, y: -100 })
  const mode = useRef<'default' | 'link' | 'view'>('default')

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      const t = e.target as HTMLElement | null
      if (!t || typeof t.closest !== 'function') return
      const view = t.closest('[data-cursor="view"]')
      const link = t.closest(
        'a,button,[role="button"],input,textarea,select,label,[data-cursor="link"]'
      )
      const m: 'default' | 'link' | 'view' = view ? 'view' : link ? 'link' : 'default'
      if (m !== mode.current) {
        mode.current = m
        setLabel(m === 'view' ? 'VIEW' : '')
        if (ringRef.current) ringRef.current.dataset.mode = m
      }
    }

    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      ring.current.x += (mouse.current.x - ring.current.x) * 0.15
      ring.current.y += (mouse.current.y - ring.current.y) * 0.15
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${mouse.current.x}px,${mouse.current.y}px) translate(-50%,-50%)`
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${ring.current.x}px,${ring.current.y}px) translate(-50%,-50%)`
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    loop()
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[200] h-3 w-3 rounded-full bg-terracotta"
      />
      <div
        ref={ringRef}
        data-mode="default"
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[199] flex items-center justify-center rounded-full border border-ink/20 text-center transition-[width,height,background-color,border-color] duration-300 ease-out"
      >
        <span className="u-label text-[0.55rem] tracking-[0.2em] text-terracotta">{label}</span>
      </div>
    </>
  )
}

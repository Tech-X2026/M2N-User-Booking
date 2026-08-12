import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import { EASE } from '../lib/lib'

/* Abstract orbiting arcs — hand-authored minimal Lottie composition */
const loaderAnim = {
  v: '5.7.4',
  fr: 60,
  ip: 0,
  op: 121,
  w: 240,
  h: 240,
  nm: 'm2n-loader',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'arc-terracotta',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] }, t: 0, s: [0], e: [360] },
            { t: 120, s: [360] },
          ],
        },
        p: { a: 0, k: [120, 120, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            { d: 1, ty: 'el', s: { a: 0, k: [110, 110] }, p: { a: 0, k: [0, 0] } },
            {
              ty: 'st',
              c: { a: 0, k: [0.7725, 0.4196, 0.2902, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 2.5 },
              lc: 2,
              lj: 2,
            },
            {
              ty: 'tm',
              s: { a: 0, k: 0 },
              e: { a: 0, k: 38 },
              o: { a: 0, k: 0 },
              m: 1,
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
        },
      ],
      ip: 0,
      op: 121,
      st: 0,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: 'arc-ink',
      sr: 1,
      ks: {
        o: { a: 0, k: 60 },
        r: {
          a: 1,
          k: [
            { i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] }, t: 0, s: [360], e: [0] },
            { t: 120, s: [0] },
          ],
        },
        p: { a: 0, k: [120, 120, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            { d: 1, ty: 'el', s: { a: 0, k: [150, 150] }, p: { a: 0, k: [0, 0] } },
            {
              ty: 'st',
              c: { a: 0, k: [0.0549, 0.0549, 0.0549, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 1.5 },
              lc: 2,
              lj: 2,
            },
            {
              ty: 'tm',
              s: { a: 0, k: 10 },
              e: { a: 0, k: 32 },
              o: { a: 0, k: 90 },
              m: 1,
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
        },
      ],
      ip: 0,
      op: 121,
      st: 0,
      bm: 0,
    },
  ],
}

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-porcelain"
      exit={{ y: '-100%', transition: { duration: 0.8, ease: EASE } }}
    >
      <div className="h-24 w-24">
        <Lottie animationData={loaderAnim} loop autoplay style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="mt-6 overflow-hidden">
        <motion.div
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          className="t-hero text-6xl tracking-tight"
        >
          <img src="/Logo/M2N_logo.png" alt="M2N Logo" className="h-16 w-auto" />
        </motion.div>
      </div>

    </motion.div>
  )
}

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { EASE } from '../lib/lib'

/** Curtain wipe-down page transition wrapping each page */
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      className="relative"
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -18 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
      >
        {children}
      </motion.div>

      {/* curtain */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[70] bg-porcelain"
        initial={{ scaleY: 1, originY: 1 }}
        animate={{ scaleY: 0, transition: { duration: 0.8, ease: EASE, delay: 0.1 } }}
        exit={{ scaleY: 1, originY: 0, transition: { duration: 0.5, ease: EASE } }}
      />
    </motion.div>
  )
}

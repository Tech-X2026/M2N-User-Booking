import { motion } from 'framer-motion'
import { EASE } from '../lib/lib'

interface Props {
  src: string
  alt?: string
  direction?: 'left' | 'bottom' | 'top' | 'right'
  delay?: number
  className?: string
  imgClassName?: string
  viewCursor?: boolean
  onClick?: () => void
}

const CLIPS: Record<string, [string, string]> = {
  left: ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)'],
  right: ['inset(0% 0% 0% 100%)', 'inset(0% 0% 0% 0%)'],
  bottom: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
  top: ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)'],
}

export default function ImageReveal({
  src,
  alt = '',
  direction = 'left',
  delay = 0,
  className = '',
  imgClassName = '',
  viewCursor = false,
  onClick,
}: Props) {
  const [from, to] = CLIPS[direction]
  const isMobile = window.innerWidth < 768
  
  const initialVariant = isMobile ? { opacity: 0, y: 20 } : { clipPath: from }
  const inViewVariant = isMobile ? { opacity: 1, y: 0 } : { clipPath: to }

  return (
    <motion.div
      className={`img-frame ${className} bg-line/20`}
      initial={initialVariant}
      whileInView={inViewVariant}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 1.2, ease: EASE, delay }}
      data-cursor={viewCursor ? 'view' : undefined}
      onClick={onClick}
    >
      <motion.img
        src={src}
        alt={alt}
        className={imgClassName}
        initial={{ scale: 1.18 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '-12%' }}
        transition={{ duration: 1.5, ease: EASE, delay }}
        loading="lazy"
      />
    </motion.div>
  )
}

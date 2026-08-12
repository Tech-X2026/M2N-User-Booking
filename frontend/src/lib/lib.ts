import type Lenis from 'lenis'

let lenisInstance: Lenis | null = null
export const setLenis = (l: Lenis) => {
  lenisInstance = l
}
export const getLenis = () => lenisInstance

export const scrollToTop = () => {
  lenisInstance?.scrollTo(0, { immediate: true })
  window.scrollTo(0, 0)
}

/** Unsplash image helper */
export const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

/** INR formatting */
export const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

export const EASE: [number, number, number, number] = [0.77, 0, 0.175, 1]
export const EASE_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1]

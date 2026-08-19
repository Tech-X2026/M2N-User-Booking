import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import App from './App'
import { setLenis } from './lib/lib'
import { AuthProvider } from './lib/AuthContext'
import { LocationProvider } from './lib/LocationContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({
  lerp: 0.07,
  duration: 1.2,
  smoothWheel: true,
})
setLenis(lenis)

lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <BrowserRouter>
        <AuthProvider>
          <LocationProvider>
            <App />
          </LocationProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </HelmetProvider>
)

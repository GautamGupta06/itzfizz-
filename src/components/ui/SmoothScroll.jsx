import { createContext, useContext, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LENIS } from '@/lib/motion.js'

const SmoothScrollContext = createContext(null)

export function useSmoothScroll() {
  return useContext(SmoothScrollContext)
}

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const lenis = new Lenis({
      lerp: prefersReduced ? 1 : LENIS.lerp,
      smoothWheel: !prefersReduced,
      wheelMultiplier: LENIS.wheelMultiplier || 0.9,
      touchMultiplier: 1.5,
      infinite: false,
    })
    lenisRef.current = lenis

    // Keep Lenis synchronized with GSAP ticker & ScrollTrigger
    const tickerFn = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(500, 33)
    lenis.on('scroll', () => ScrollTrigger.update())

    return () => {
      lenis.destroy()
      gsap.ticker.remove(tickerFn)
    }
  }, [])

  return (
    <SmoothScrollContext.Provider value={lenisRef}>
      {children}
    </SmoothScrollContext.Provider>
  )
}

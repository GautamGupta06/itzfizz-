import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Car from './Car.jsx'
import Headline from './Headline.jsx'
import StatCard from './StatCard.jsx'
import { EASE, DUR, STAGGER } from '@/lib/motion.js'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const STATS = [
  { value: 98,  suffix: '%', label: 'Client satisfaction' },
  { value: 3,   suffix: 'x', label: 'Faster page loads' },
  { value: 120, suffix: '%', label: 'Average traffic growth' },
  { value: 75,  suffix: '%', label: 'Conversion lift' },
]

export default function Hero() {
  const rootRef = useRef(null)
  const bgGlowRef = useRef(null)

  // Mouse Parallax on Background Glow
  const handleMouseMove = (e) => {
    if (!bgGlowRef.current) return
    const { clientX, clientY } = e
    const x = (clientX / window.innerWidth - 0.5) * 60
    const y = (clientY / window.innerHeight - 0.5) * 60
    gsap.to(bgGlowRef.current, { x, y, duration: 1, ease: 'power2.out' })
  }

  useGSAP(() => {
    const mm = gsap.matchMedia()

    // ── REDUCED MOTION ──────────────────────────────────────
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.car-container', { x: 0, opacity: 1 })
      gsap.set('.char', { yPercent: 0, opacity: 1 })
      gsap.set('.stat', { y: 0, opacity: 1 })
      document.querySelectorAll('.stat [data-value]').forEach(el => {
        el.textContent = el.dataset.value ?? '0'
      })
    })

    // ── FULL MOTION ─────────────────────────────────────────
    mm.add('(prefers-reduced-motion: no-preference)', () => {

      // 1. INTRO TIMELINE
      const intro = gsap.timeline({ defaults: { ease: EASE.outExpo }, paused: true })

      gsap.set('.char',          { yPercent: 110, opacity: 0 })
      gsap.set('.stat',          { y: 40, opacity: 0, scale: 0.94 })
      gsap.set('.car-container', { x: -120, opacity: 0 })
      gsap.set('.nav',           { yPercent: -100, opacity: 0 })
      gsap.set('.scroll-hint',   { opacity: 0 })
      gsap.set('.hero-sub',      { y: 20, opacity: 0 })

      intro
        .to('.char',          { yPercent: 0, opacity: 1, duration: DUR.l, stagger: STAGGER.text })
        .to('.car-container', { x: 0, opacity: 1, duration: 1.2, ease: EASE.soft }, 0.2)
        .to('.hero-sub',      { y: 0, opacity: 1, duration: DUR.m, ease: EASE.soft }, 0.4)
        .to('.stat',          { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: STAGGER.stat, ease: EASE.soft }, '-=0.6')
        .to('.nav',           { yPercent: 0, opacity: 1, duration: DUR.s }, '-=0.2')
        .to('.scroll-hint',   { opacity: 1, duration: DUR.s }, '-=0.1')

      // Count-up per stat
      STATS.forEach(({ value }, i) => {
        const el = document.querySelectorAll('.stat [data-value]')[i]
        if (!el) return
        const obj = { n: 0 }
        intro.to(obj, {
          n: value, duration: DUR.l, ease: 'power2.out',
          snap: { n: 1 },
          onUpdate() { el.textContent = String(Math.floor(obj.n)) },
        }, 0.6 + i * STAGGER.stat)
      })

      // Auto play intro or listen to preloader signal
      const play = () => intro.play()
      if (document.querySelector('.preloader')?.dataset.done === 'true') {
        play()
      } else {
        window.addEventListener('preloader:done', play, { once: true })
        // Fallback play if preloader finished early
        setTimeout(play, 1500)
      }

      // 2. SCROLL TIMELINE TIGHTENED (No blank space!)
      const tl = gsap.timeline({
        defaults: { ease: EASE.none },
        scrollTrigger: {
          trigger: '.hero-track',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })

      // Car drives cleanly from left → right across screen
      tl.fromTo('.car-container',
        { x: () => -window.innerWidth * 0.35 },
        { x: () => window.innerWidth * 1.05 },
        0
      )

      // Wheel rotation
      tl.to('.wheel', { rotation: 1800, transformOrigin: '50% 50%' }, 0)

      // Dynamic car chassis bob
      tl.to('.car-body', { y: -4, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 0)

      // Speed lines opacity burst
      tl.fromTo('.speed-lines', { scaleX: 0.5, opacity: 0 }, { scaleX: 2, opacity: 1 }, 0.05)
      tl.to('.speed-lines', { opacity: 0 }, 0.7)

      // Headline characters illuminate with neon burst as car sweeps across
      const chars = Array.from(document.querySelectorAll('.char'))
      chars.forEach((ch, i) => {
        const p = i / Math.max(chars.length - 1, 1)
        const startP = 0.05 + p * 0.5
        tl.to(ch, { color: '#C6FF3D', y: -14, textShadow: '0 0 20px rgba(198,255,61,0.8)', duration: 0.06 }, startP)
        tl.to(ch, { color: '#F4F5F7', y: 0, textShadow: 'none', duration: 0.06 }, startP + 0.1)
      })

      // Smooth exit transition into next section without blank gap
      tl.to('.hero-content', { opacity: 0, y: -70, duration: 0.3 }, 0.55)
      tl.to('.car-container', { opacity: 0, duration: 0.2 }, 0.75)
      tl.to('.scroll-hint',  { opacity: 0 }, 0.1)

      return () => window.removeEventListener('preloader:done', play)
    })

    return () => mm.revert()
  }, { scope: rootRef })

  return (
    <section 
      ref={rootRef} 
      id="hero" 
      aria-labelledby="hero-heading" 
      className="hero-track"
      onMouseMove={handleMouseMove}
    >
      <div className="hero-stage">

        {/* Ambient Background Grid & Parallax Neon */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              radial-gradient(ellipse 80% 60% at 50% 30%, rgba(77,124,255,0.12) 0%, transparent 65%),
              radial-gradient(ellipse 100% 80% at 50% 100%, rgba(198,255,61,0.06) 0%, transparent 55%),
              linear-gradient(180deg, #07080B 0%, #0A0C12 100%)
            `,
          }} />
          <div ref={bgGlowRef} className="bg-glow" style={{
            position: 'absolute',
            width: '700px', height: '450px',
            left: '50%', top: '40%',
            transform: 'translate(-50%,-50%)',
            background: 'radial-gradient(ellipse, rgba(198,255,61,0.1) 0%, rgba(0,240,255,0.05) 50%, transparent 70%)',
            willChange: 'transform',
            filter: 'blur(30px)',
          }} />
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.04,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '70px 70px',
          }} />
        </div>

        {/* Main Hero Content */}
        <div className="hero-content" style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', padding: '0 clamp(1.5rem, 5vw, 5rem)' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '5.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 12px var(--accent)' }} />
              <p className="hero-sub" aria-hidden="true" style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '0.725rem', letterSpacing: '0.4em', textTransform: 'uppercase', margin: 0 }}>
                Web Development Studio
              </p>
            </div>
            
            <Headline text="WELCOME ITZFIZZ" />
            
            <p className="hero-sub" style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', maxWidth: '30rem', marginTop: '1.25rem', fontSize: 'clamp(0.95rem, 1.6vw, 1.2rem)', lineHeight: 1.6 }}>
              High-performance, motion-driven web experiences that captivate, convert, and leave a lasting impression.
            </p>
          </div>

          {/* Stat Cards with 3D micro-tilt */}
          <div
            role="list"
            aria-label="Impact statistics"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1rem',
              paddingBottom: 'clamp(1.5rem, 5vh, 3.5rem)',
            }}
          >
            {STATS.map((s, i) => (
              <div role="listitem" key={s.label}>
                <StatCard {...s} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* Hypercar (Interactive - click to rev!) */}
        <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 'clamp(2rem, 8vh, 5.5rem)', willChange: 'transform', pointerEvents: 'auto' }}>
          <Car style={{ width: 'clamp(55vw, 65vw, 920px)', maxWidth: '92vw', margin: '0 auto', display: 'block' }} />
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-hint" aria-label="Scroll to explore" style={{ position: 'absolute', bottom: '1.25rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', pointerEvents: 'none' }}>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Scroll Down</span>
          <div style={{ width: '1.5px', height: '2.2rem', background: 'var(--line)', position: 'relative', overflow: 'hidden', borderRadius: '1px' }}>
            <div className="animate-scroll-bounce" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} />
          </div>
        </div>
      </div>
    </section>
  )
}

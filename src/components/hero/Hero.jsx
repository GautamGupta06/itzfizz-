import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Car from './Car.jsx'
import Headline from './Headline.jsx'
import Subtitle from './Subtitle.jsx'
import StatCard from './StatCard.jsx'
import ActiveTheoryHexPortal from './HexPortal.jsx'
import StreetLights from './StreetLights.jsx'
import { EASE, DUR, STAGGER } from '@/lib/motion.js'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const STATS = [
  { value: 98, suffix: '%', label: 'Client satisfaction' },
  { value: 3, suffix: 'x', label: 'Faster page loads' },
  { value: 120, suffix: '%', label: 'Average traffic growth' },
  { value: 75, suffix: '%', label: 'Conversion lift' },
]

export default function Hero() {
  const rootRef = useRef(null)
  const bgGlowRef = useRef(null)

  // Interactive 3D Mouse Parallax
  const handleMouseMove = (e) => {
    if (!bgGlowRef.current) return
    const { clientX, clientY } = e
    const x = (clientX / window.innerWidth - 0.5) * 80
    const y = (clientY / window.innerHeight - 0.5) * 80
    gsap.to(bgGlowRef.current, { x, y, duration: 1, ease: 'power2.out' })
  }

  useGSAP(() => {
    const mm = gsap.matchMedia()

    // ── REDUCED MOTION ──────────────────────────────────────
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.car-container', { x: 0, opacity: 1 })
      gsap.set('.char', { yPercent: 0, opacity: 1 })
      gsap.set('.stat', { y: 0, opacity: 1 })
      gsap.set('.portal-wrapper', { opacity: 1, scale: 1, y: 0 })
      gsap.set('.street-light', { opacity: 1, y: 0 })
      document.querySelectorAll('.stat [data-value]').forEach(el => {
        el.textContent = el.dataset.value ?? '0'
      })
    })

    // ── FULL MOTION ─────────────────────────────────────────
    mm.add('(prefers-reduced-motion: no-preference)', () => {

      // 1. INTRO TIMELINE
      const intro = gsap.timeline({ defaults: { ease: EASE.outExpo }, paused: true })

      gsap.set('.char', { yPercent: 110, opacity: 0 })
      gsap.set('.stat', { y: 30, opacity: 0, scale: 0.94 })
      gsap.set('.car-container', { x: -80, opacity: 0 })
      gsap.set('.nav', { yPercent: -100, opacity: 0 })
      gsap.set('.scroll-hint', { opacity: 0 })
      gsap.set('.hero-sub', { y: 20, opacity: 0 })
      gsap.set('.portal-wrapper', { scale: 0.85, opacity: 0, y: 20 })
      gsap.set('.street-light', { opacity: 0, y: 15 })

      intro
        .to('.char', { yPercent: 0, opacity: 1, duration: DUR.l, stagger: STAGGER.text })
        .to('.portal-wrapper', { scale: 1, opacity: 1, y: 0, duration: 1.2, ease: EASE.soft }, 0.25)
        .to('.car-container', { x: 0, opacity: 1, duration: 1.1, ease: EASE.soft }, 0.2)
        .to('.street-light', { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: EASE.soft }, 0.35)
        .to('.hero-sub', { y: 0, opacity: 1, duration: DUR.m, ease: EASE.soft }, 0.4)
        .to('.stat', { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: STAGGER.stat, ease: EASE.soft }, '-=0.6')
        .to('.nav', { yPercent: 0, opacity: 1, duration: DUR.s }, '-=0.2')
        .to('.scroll-hint', { opacity: 1, duration: DUR.s }, '-=0.1')

      // Count-up per stat
      STATS.forEach(({ value }, i) => {
        const el = document.querySelectorAll('.stat [data-value]')[i]
        if (!el) return
        const obj = { n: 0 }
        intro.to(obj, {
          n: value, duration: DUR.l, ease: 'power2.out',
          snap: { n: 1 },
          onUpdate() { el.textContent = String(Math.floor(obj.n)) },
        }, 0.5 + i * STAGGER.stat)
      })

      const play = () => intro.play()
      if (document.querySelector('.preloader')?.dataset.done === 'true') {
        play()
      } else {
        window.addEventListener('preloader:done', play, { once: true })
        setTimeout(play, 1200)
      }

      // 2. NATURAL SCROLL TIMELINE (NO EXCESSIVE DEAD SCROLL SPACE)
      const tl = gsap.timeline({
        defaults: { ease: EASE.none },
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })

      // Car drives across smoothly as you scroll into the next section
      tl.to('.car-container', {
        x: () => window.innerWidth * 0.85,
        ease: 'power1.in',
      }, 0)

      // Concentric wheel rotation on exact center points (svgOrigin prevents any revolving/orbiting)
      tl.to('.rear-wheel', { rotation: 1200, svgOrigin: '250 240', transformOrigin: '250px 240px' }, 0)
      tl.to('.front-wheel', { rotation: 1200, svgOrigin: '650 240', transformOrigin: '650px 240px' }, 0)

      // Speed lines & nitro react to scroll speed
      tl.fromTo('.speed-lines', { scaleX: 0.4, opacity: 0 }, { scaleX: 2.2, opacity: 1 }, 0)
      tl.fromTo('.nitro-flame', { scaleX: 0.8 }, { scaleX: 2.2, opacity: 1 }, 0)

      // Street lights parallax on scroll with glowing beams staying visible
      tl.to('.street-light-left', { x: -160, ease: 'power1.in' }, 0)
      tl.to('.street-light-right', { x: -70, ease: 'power1.in' }, 0)

      // Active Theory Portal smooth parallax without disappearing
      tl.to('.portal-wrapper', {
        y: -30,
        ease: 'power1.out',
      }, 0)

      // Subtle parallax on stats cards
      tl.to('.stat', {
        y: (i) => (i % 2 === 0 ? -25 : -45),
        opacity: 0.85,
        stagger: 0.05,
      }, 0)

      // Ambient background shift
      tl.to('.bg-glow', { x: 120, y: -40, opacity: 0.4 }, 0)

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
      style={{
        position: 'relative',
        padding: '0 clamp(1.5rem, 5vw, 5rem)',
        background: `
          radial-gradient(ellipse 90% 70% at 50% 20%, rgba(77,124,255,0.18) 0%, transparent 70%),
          radial-gradient(ellipse 80% 50% at 80% 80%, rgba(139,92,246,0.12) 0%, transparent 60%),
          radial-gradient(ellipse 70% 60% at 20% 90%, rgba(198,255,61,0.08) 0%, transparent 60%),
          linear-gradient(180deg, #0e111a 0%, #0a0c13 100%)
        `,
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="hero-stage">

        {/* Ambient Animated Cyber Mesh & Particle Grid */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div ref={bgGlowRef} className="bg-glow" style={{
            position: 'absolute',
            width: '800px', height: '500px',
            left: '50%', top: '35%',
            transform: 'translate(-50%,-50%)',
            background: 'radial-gradient(circle, rgba(77,124,255,0.2) 0%, rgba(198,255,61,0.12) 40%, transparent 70%)',
            willChange: 'transform',
            filter: 'blur(50px)',
          }} />

          {/* Grid lines with soft glowing intersections */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.08,
            backgroundImage: 'linear-gradient(rgba(198,255,61,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(77,124,255,0.4) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />

          {/* Glowing Top Ambient Arc */}
          <div style={{
            position: 'absolute', top: '-150px', left: '50%', transform: 'translateX(-50%)',
            width: '70vw', height: '300px',
            background: 'radial-gradient(ellipse, rgba(0,240,255,0.15) 0%, transparent 65%)',
            filter: 'blur(40px)',
          }} />
        </div>

        {/* Hero Top Content: Left Column (Badge, Headline, Subtitle) & Right Column (Active Theory Hexagon Particle Portal) */}
        <div
          className="hero-content"
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '6rem',
            gap: '2rem'
          }}
        >
          {/* Left Text Block */}
          <div style={{ flex: '1 1 480px', maxWidth: '580px', position: 'relative', zIndex: 25, pointerEvents: 'auto' }}>

            <Headline text="WELCOME ITZFIZZ" />
            <Subtitle />
          </div>

          {/* Right Active Theory Hexagon Portal */}
          <div
            className="portal-wrapper"
            style={{
              flex: '1 1 650px',
              maxWidth: '880px',
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 5,
              pointerEvents: 'auto',
            }}
          >
            <ActiveTheoryHexPortal />
          </div>
        </div>

        {/* Hypercar Section with Street Lights */}
        <div style={{ position: 'relative', zIndex: 12, margin: '2rem 0 1.5rem', willChange: 'transform', pointerEvents: 'auto' }}>
          {/* Street Lights Layer matching circled street light positions */}
          <StreetLights />
          <Car style={{ width: 'clamp(55vw, 65vw, 920px)', maxWidth: '92vw', margin: '0 auto', display: 'block' }} />
        </div>

        {/* Stat Cards Row */}
        <div
          role="list"
          aria-label="Impact statistics"
          style={{
            position: 'relative',
            zIndex: 14,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            paddingBottom: '2.5rem',
          }}
        >
          {STATS.map((s, i) => (
            <div role="listitem" key={s.label}>
              <StatCard {...s} index={i} />
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-hint" aria-label="Scroll to explore" style={{ position: 'absolute', bottom: '0.75rem', right: 'clamp(1.5rem, 5vw, 5rem)', display: 'flex', alignItems: 'center', gap: '0.75rem', pointerEvents: 'none', zIndex: 20 }}>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>Explore Work</span>
          <div style={{ width: '2rem', height: '1.5px', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} />
        </div>

      </div>
    </section>
  )
}

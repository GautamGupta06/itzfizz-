import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const TEXT = 'We design and build websites that feel alive. Every scroll, every hover, every millisecond is crafted to turn visitors into customers — fast, smooth and unforgettable.'
const KEY  = new Set(['alive.', 'crafted', 'fast,', 'smooth', 'unforgettable.'])

export default function Manifesto() {
  const sectionRef = useRef(null)
  const textRef    = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const text = textRef.current
    if (!text) return

    text.innerHTML = TEXT.split(' ').map((w, i) =>
      `<span class="mw" data-i="${i}" style="display:inline-block;opacity:0.2;margin-right:0.3em;transition:transform 0.2s, color 0.2s">${w}</span>`
    ).join('')

    const words = text.querySelectorAll('.mw')
    const tl = gsap.timeline({
      scrollTrigger: { 
        trigger: sectionRef.current, 
        start: 'top 80%', 
        end: 'bottom 40%', 
        scrub: 1 
      },
    })
    words.forEach((el, i) => {
      tl.to(el, {
        opacity: 1,
        color: KEY.has(el.textContent ?? '') ? '#C6FF3D' : '#F4F6FA',
        textShadow: KEY.has(el.textContent ?? '') ? '0 0 15px rgba(198,255,61,0.5)' : 'none',
        duration: 0.1,
        ease: 'none',
      }, (i / (words.length - 1)) * 0.9)
    })
  }, [])

  return (
    <section 
      ref={sectionRef} 
      id="manifesto" 
      aria-labelledby="manifesto-heading"
      style={{ 
        position: 'relative',
        padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 5rem)', 
        background: `
          radial-gradient(ellipse 60% 50% at 90% 30%, rgba(77,124,255,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 50% 60% at 10% 70%, rgba(139,92,246,0.07) 0%, transparent 60%),
          #0e1119
        `,
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden'
      }}
    >
      {/* Soft Ambient Light Glow */}
      <div 
        aria-hidden="true" 
        style={{
          position: 'absolute', top: '10%', left: '5%', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(198,255,61,0.05) 0%, transparent 70%)',
          pointerEvents: 'none', filter: 'blur(40px)'
        }} 
      />

      <div style={{ maxWidth: '85rem', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <h2 id="manifesto-heading" className="sr-only">Our Philosophy</h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <span style={{ width: '2rem', height: '1.5px', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} aria-hidden="true" />
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '0.72rem', letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 700 }}>
            Our Philosophy
          </span>
        </div>

        <p 
          ref={textRef} 
          aria-label={TEXT}
          style={{ 
            fontFamily: 'var(--font-display)', 
            fontWeight: 800, 
            lineHeight: 1.35, 
            fontSize: 'clamp(1.8rem, 4.2vw, 3.8rem)', 
            maxWidth: '68rem',
            color: 'var(--ink)'
          }}
        />
      </div>
    </section>
  )
}

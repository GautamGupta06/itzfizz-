import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from '@/components/ui/MagneticButton.jsx'

const WORDMARK = 'ITZFIZZ'
const LINKS = [
  { label: 'GitHub', href: 'https://github.com/' },
  { label: 'LinkedIn', href: 'https://linkedin.com/' },
  { label: 'Twitter', href: '#' },
]

export default function Cta() {
  const sectionRef = useRef(null)
  const wordmarkRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    gsap.fromTo(sectionRef.current?.querySelectorAll('.cta-line'),
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0, opacity: 1, stagger: 0.12, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }
      }
    )

    const wm = wordmarkRef.current
    if (wm) {
      const letters = wm.querySelectorAll('.wm-char')
      gsap.fromTo(letters, { yPercent: 100, opacity: 0 }, {
        yPercent: 0, opacity: 1, stagger: 0.06, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: wm, start: 'top 85%', once: true },
      })
      letters.forEach(l => {
        l.addEventListener('mouseenter', () => gsap.to(l, { y: -12, color: 'var(--accent)', duration: 0.25, ease: 'power3.out' }))
        l.addEventListener('mouseleave', () => gsap.to(l, { y: 0, color: 'transparent', duration: 0.5, ease: 'elastic.out(1,0.5)' }))
      })
    }
  }, [])

  const pad = 'clamp(1.5rem, 5vw, 5rem)'

  return (
    <footer id="cta" aria-labelledby="cta-heading">

      <section ref={sectionRef}
        style={{ position: 'relative', padding: `clamp(5rem,12vw,10rem) ${pad} clamp(2rem,6vw,4rem)`, borderTop: '1px solid var(--line)', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '50rem', height: '25rem', background: 'radial-gradient(ellipse, rgba(198,255,61,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} aria-hidden="true" />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '62.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <span style={{ width: '2rem', height: '1px', background: 'var(--accent)' }} aria-hidden="true" />
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '0.7rem', letterSpacing: '0.4em', textTransform: 'uppercase' }}>Start a Project</span>
          </div>

          <h2 id="cta-heading" style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)', marginBottom: 'clamp(2rem,5vw,4rem)' }}>
            {["Let's build", 'something', 'that moves.'].map((line, i) => (
              <span key={i} style={{ display: 'block', overflow: 'hidden' }}>
                <span className="cta-line" style={{ display: 'block', fontSize: 'clamp(2rem,6vw,5.5rem)', fontWeight: 800, lineHeight: 1.05 }}>
                  {line}
                </span>
              </span>
            ))}
          </h2>

          <MagneticButton
            href="mailto:hello@itzfizz.com"
            strength={15}
            data-cursor=""
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              padding: '1rem 2rem', borderRadius: '9999px',
              background: 'var(--accent)', color: 'var(--bg)',
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase',
              textDecoration: 'none', transition: 'background 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'white'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
          >
            Start a project
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </MagneticButton>
        </div>
      </section>


      <div style={{ borderTop: '1px solid var(--line)', padding: `3rem ${pad}` }}>

        <div ref={wordmarkRef} style={{ overflow: 'hidden', marginBottom: '3rem' }} aria-label="ITZFIZZ">
          <div aria-hidden="true" style={{ display: 'flex', lineHeight: 1, userSelect: 'none', fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 14vw, 12rem)', fontWeight: 800, color: 'transparent', WebkitTextStroke: '1px rgba(244,245,247,0.12)' }}>
            {WORDMARK.split('').map((ch, i) => (
              <span key={i} className="wm-char" style={{ display: 'inline-block', opacity: 0, cursor: 'default' }}>{ch}</span>
            ))}
          </div>
        </div>


        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          <nav aria-label="Footer navigation" style={{ display: 'flex', gap: '1.5rem' }}>
            {LINKS.map(l => (
              <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                style={{ color: 'var(--muted)', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                onMouseLeave={e => e.target.style.color = 'var(--muted)'}
              >{l.label}</a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}

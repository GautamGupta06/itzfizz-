import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const SERVICES = [
  { num: '01', title: 'Web Development',          desc: 'Custom Next.js and React experiences built with surgical precision that perform, scale, and convert.',             tags: ['Next.js','React','TypeScript'], accent: '#C6FF3D' },
  { num: '02', title: 'WordPress Architecture',   desc: 'Bespoke themes and enterprise headless setups. Fast, flexible, and fully future-proof.',                  tags: ['WordPress','ACF','WooCommerce'], accent: '#4D7CFF' },
  { num: '03', title: 'Shopify Flagships',        desc: 'Stores engineered to captivate buyers. Custom Liquid & headless stores with seamless checkout.',      tags: ['Shopify','Liquid','Headless'], accent: '#00F0FF' },
  { num: '04', title: 'Performance Engineering',  desc: 'Sub-second load times, flawless 100/100 Lighthouse scores, and Core Web Vitals optimization.',      tags: ['Lighthouse','CDN','Core Web Vitals'], accent: '#FF3D77' },
]

export default function Services() {
  const sectionRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const rows = sectionRef.current?.querySelectorAll('.svc-row')
    if (!rows) return

    rows.forEach((row, i) => {
      gsap.fromTo(row, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', delay: i * 0.1,
        scrollTrigger: { trigger: row, start: 'top 85%', once: true },
      })

      const line = row.querySelector('.svc-line')
      const num  = row.querySelector('.svc-num')
      const icon = row.querySelector('.svc-icon')

      function enter() {
        gsap.to(row,  { backgroundColor: 'rgba(255,255,255,0.03)', x: 12, duration: 0.3, ease: 'power2.out' })
        if (line) gsap.to(line, { scaleX: 1, duration: 0.4, ease: 'power3.out' })
        if (num)  gsap.to(num,  { color: 'var(--accent)', duration: 0.2 })
        if (icon) gsap.to(icon, { x: 8, color: 'var(--accent)', duration: 0.25 })
      }
      function leave() {
        gsap.to(row,  { backgroundColor: 'transparent', x: 0, duration: 0.5, ease: 'power3.out' })
        if (line) gsap.to(line, { scaleX: 0, duration: 0.3 })
        if (num)  gsap.to(num,  { color: 'var(--muted)', duration: 0.2 })
        if (icon) gsap.to(icon, { x: 0, color: 'var(--muted)', duration: 0.25 })
      }
      row.addEventListener('mouseenter', enter)
      row.addEventListener('mouseleave', leave)
    })
  }, [])

  const pad = 'clamp(1.5rem, 5vw, 5rem)'

  return (
    <section 
      ref={sectionRef} 
      id="services" 
      aria-labelledby="services-heading"
      style={{ 
        position: 'relative',
        padding: `clamp(5rem, 10vw, 8rem) ${pad}`, 
        background: `
          radial-gradient(ellipse 70% 50% at 50% 10%, rgba(77,124,255,0.07) 0%, transparent 60%),
          #0b0d13
        `,
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <div style={{ maxWidth: '85rem', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <span style={{ width: '2rem', height: '1.5px', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} aria-hidden="true" />
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '0.72rem', letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 700 }}>
            Capabilities & Craft
          </span>
        </div>

        <h2 id="services-heading" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--ink)', fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
          Our Specialized Services
        </h2>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }} role="list">
          {SERVICES.map(svc => (
            <li key={svc.num} role="listitem">
              <div 
                className="svc-row" 
                aria-label={`${svc.title}: ${svc.desc}`}
                style={{ 
                  position: 'relative', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '2rem', 
                  padding: '2rem 1.5rem', 
                  borderRadius: '1rem',
                  border: '1px solid var(--line)', 
                  background: 'rgba(20, 24, 36, 0.4)',
                  backdropFilter: 'blur(10px)',
                  transition: 'border-color 0.3s',
                  cursor: 'pointer' 
                }}
              >
                <span className="svc-num" style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 700, flexShrink: 0, width: '2.5rem', transition: 'color 0.2s' }}>
                  {svc.num}
                </span>

                <div style={{ flex: 1 }}>
                  <div className="svc-line" style={{ height: '1.5px', background: svc.accent, transformOrigin: 'left', transform: 'scaleX(0)', width: '6rem', marginBottom: '0.5rem', boxShadow: `0 0 8px ${svc.accent}` }} aria-hidden="true" />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--ink)', fontSize: 'clamp(1.2rem, 2.2vw, 1.8rem)', marginBottom: '0.4rem' }}>
                    {svc.title}
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.925rem', lineHeight: 1.6, maxWidth: '38rem', margin: 0 }}>
                    {svc.desc}
                  </p>
                </div>

                <div style={{ display: 'none', mdDisplay: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {svc.tags.map(t => (
                    <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', padding: '0.3rem 0.75rem', borderRadius: '9999px', border: '1px solid var(--line)', background: 'rgba(255,255,255,0.02)' }}>
                      {t}
                    </span>
                  ))}
                </div>

                <svg className="svc-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0, color: 'var(--muted)', transition: 'color 0.2s, transform 0.2s' }}>
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

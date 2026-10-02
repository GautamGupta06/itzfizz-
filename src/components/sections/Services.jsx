import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const SERVICES = [
  { num: '01', title: 'Web Development',          desc: 'Custom Next.js and React experiences that perform and convert.',             tags: ['Next.js','React','TypeScript'] },
  { num: '02', title: 'WordPress',                desc: 'Bespoke themes and plugins. Fast, flexible, future-proof.',                  tags: ['WordPress','ACF','WooCommerce'] },
  { num: '03', title: 'Shopify',                  desc: 'Stores designed to sell. Custom themes that feel premium.',                  tags: ['Shopify','Liquid','Headless'] },
  { num: '04', title: 'Performance Optimisation', desc: 'Core Web Vitals, Lighthouse scores, speed that keeps users engaged.',        tags: ['Lighthouse','CDN','Core Web Vitals'] },
]

export default function Services() {
  const sectionRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const rows = sectionRef.current?.querySelectorAll('.svc-row')
    if (!rows) return

    rows.forEach((row, i) => {
      gsap.fromTo(row, { opacity: 0, x: -20 }, {
        opacity: 1, x: 0, duration: 0.7, ease: 'expo.out', delay: i * 0.08,
        scrollTrigger: { trigger: row, start: 'top 85%', once: true },
      })

      const line = row.querySelector('.svc-line')
      const desc = row.querySelector('.svc-desc')
      const num  = row.querySelector('.svc-num')

      function enter() {
        gsap.to(row,  { x: 16, duration: 0.3, ease: 'power3.out' })
        if (line) gsap.to(line, { scaleX: 1, duration: 0.4, ease: 'power3.out' })
        if (desc) gsap.to(desc, { opacity: 1, y: 0, duration: 0.3 })
        if (num)  gsap.to(num,  { color: 'var(--accent)', duration: 0.2 })
      }
      function leave() {
        gsap.to(row,  { x: 0, duration: 0.5, ease: 'elastic.out(1,0.6)' })
        if (line) gsap.to(line, { scaleX: 0, duration: 0.3 })
        if (desc) gsap.to(desc, { opacity: 0, y: 4, duration: 0.2 })
        if (num)  gsap.to(num,  { color: 'var(--muted)', duration: 0.2 })
      }
      row.addEventListener('mouseenter', enter)
      row.addEventListener('mouseleave', leave)
      row.addEventListener('click', () => {
        if (desc) {
          const open = desc.style.opacity === '1'
          gsap.to(desc, { opacity: open ? 0 : 1, y: open ? 4 : 0, duration: 0.3 })
          if (line) gsap.to(line, { scaleX: open ? 0 : 1, duration: 0.3 })
        }
      })
    })
  }, [])

  const pad = 'clamp(1.5rem, 5vw, 5rem)'

  return (
    <section ref={sectionRef} id="services" aria-labelledby="services-heading"
      style={{ padding: `clamp(4rem,10vw,8rem) ${pad}`, maxWidth: '87.5rem', margin: '0 auto' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <span style={{ width: '2rem', height: '1px', background: 'var(--accent)' }} aria-hidden="true" />
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '0.7rem', letterSpacing: '0.4em', textTransform: 'uppercase' }}>What We Offer</span>
      </div>

      <h2 id="services-heading" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--ink)', fontSize: 'clamp(1.4rem,3vw,2.5rem)', marginBottom: 'clamp(3rem,6vw,5rem)' }}>
        Our Services
      </h2>

      <ul style={{ listStyle: 'none' }} role="list">
        {SERVICES.map(svc => (
          <li key={svc.num} role="listitem">
            <div className="svc-row" aria-label={`${svc.title}: ${svc.desc}`}
              style={{ opacity: 0, position: 'relative', display: 'flex', alignItems: 'flex-start', gap: '1.5rem', padding: '2rem 0', borderTop: '1px solid var(--line)', cursor: 'pointer' }}
            >
              <span className="svc-num" style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontSize: '0.75rem', marginTop: '0.25rem', flexShrink: 0, width: '2rem', transition: 'color 0.2s' }}>
                {svc.num}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '0.25rem' }}>
                  <div className="svc-line" style={{ height: '1px', background: 'var(--accent)', transformOrigin: 'left', transform: 'scaleX(0)', width: '7.5rem', marginBottom: '0.5rem' }} aria-hidden="true" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--ink)', fontSize: 'clamp(1.1rem,2.5vw,1.8rem)', marginBottom: '0.5rem' }}>{svc.title}</h3>
                <p className="svc-desc" style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '32rem', opacity: 0, transform: 'translateY(4px)' }}>{svc.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                  {svc.tags.map(t => (
                    <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', padding: '0.25rem 0.625rem', borderRadius: '9999px', border: '1px solid var(--line)' }}>{t}</span>
                  ))}
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ flexShrink: 0, color: 'var(--muted)', marginTop: '0.25rem' }}>
                <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

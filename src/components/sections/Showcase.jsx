import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const CARDS = [
  { num: '01', title: 'Brand Websites',       desc: 'Cinematic experiences that define who you are with rich motion and interactive depth.', accent: '#C6FF3D', tags: ['Next.js','GSAP','Custom'],         grad: 'linear-gradient(135deg,#0D1117,#1A1D2E,#0D1117)' },
  { num: '02', title: 'WordPress Themes',     desc: 'Power and polish. Made to scale your content seamlessly with headless performance.', accent: '#4D7CFF', tags: ['WordPress','ACF','WooCommerce'],    grad: 'linear-gradient(135deg,#0F1118,#1E1228,#0F1118)' },
  { num: '03', title: 'Shopify Stores',       desc: 'High-converting commerce experiences tailored to maximize sales.', accent: '#3DFF9A', tags: ['Shopify','Liquid','Headless'],      grad: 'linear-gradient(135deg,#0C0F12,#1A2418,#0C0F12)' },
  { num: '04', title: 'Web Apps',             desc: 'Complex interactive platforms crafted to be intuitively fast and responsive.', accent: '#FF8C3D', tags: ['React','TypeScript','APIs'],        grad: 'linear-gradient(135deg,#0E0F18,#241A18,#0E0F18)' },
  { num: '05', title: 'Performance Sprints',  desc: 'Cut load times, boost Core Web Vitals, and dominate search rankings.', accent: '#FF3D7A', tags: ['Lighthouse','Core Web Vitals','CDN'],grad: 'linear-gradient(135deg,#0B0E12,#1A1824,#0B0E12)' },
]

export default function Showcase() {
  const sectionRef  = useRef(null)
  const cardsRef    = useRef(null)
  const progressRef = useRef(null)
  const [activeModalCard, setActiveModalCard] = useState(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const section = sectionRef.current
    const cards   = cardsRef.current
    const bar     = progressRef.current

    const init = () => {
      const totalW  = cards.scrollWidth
      const viewW   = window.innerWidth
      // Ensure the last card scrolls comfortably into view with generous right clearance
      const dist    = Math.max(totalW - viewW + 160, 400)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${dist}`,
          pin: true, 
          anticipatePin: 1, 
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: self => { if (bar) bar.style.transform = `scaleX(${self.progress})` },
        },
      })
      tl.to(cards, { x: () => -(totalW - viewW + 160), ease: 'none' })

      cards.querySelectorAll('.card-art').forEach(art => {
        gsap.to(art, {
          x: '8%', ease: 'none',
          scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${dist}`, scrub: 1, invalidateOnRefresh: true },
        })
      })
    }

    const t = setTimeout(init, 100)
    return () => {
      clearTimeout(t)
      ScrollTrigger.getAll().forEach(st => { if (st.trigger === section) st.kill() })
    }
  }, [])

  const handleCardMouseMove = (e, cardEl) => {
    const rect = cardEl.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(cardEl, {
      rotateX: -y * 0.05,
      rotateY: x * 0.05,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  const handleCardMouseLeave = (cardEl) => {
    gsap.to(cardEl, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power3.out'
    })
  }

  const pad = 'clamp(1.5rem, 5vw, 5rem)'

  return (
    <section ref={sectionRef} id="showcase" aria-labelledby="showcase-heading"
      style={{ position: 'relative', overflow: 'hidden', background: 'var(--surface)', height: '100vh' }}
    >
      {/* Header */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: `3rem ${pad} 1.5rem` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <span style={{ width: '2rem', height: '1px', background: 'var(--accent)' }} aria-hidden="true" />
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '0.7rem', letterSpacing: '0.4em', textTransform: 'uppercase' }}>Our Work</span>
        </div>
        <h2 id="showcase-heading" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--ink)', fontSize: 'clamp(1.4rem, 3vw, 2.5rem)', margin: 0 }}>What We Build</h2>
      </div>

      {/* Cards track */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', paddingTop: '7rem', paddingBottom: '3rem' }}>
        <div ref={cardsRef} role="list" aria-label="Showcase cards"
          style={{ display: 'flex', gap: '1.5rem', paddingLeft: pad, paddingRight: '5rem', willChange: 'transform' }}
        >
          {CARDS.map(card => (
            <article 
              key={card.num} 
              role="listitem" 
              className="showcase-card"
              onMouseMove={(e) => handleCardMouseMove(e, e.currentTarget)}
              onMouseLeave={(e) => handleCardMouseLeave(e.currentTarget)}
              onClick={() => setActiveModalCard(card)}
              style={{ 
                width: 'min(420px, 75vw)', 
                aspectRatio: '3/4', 
                perspective: '1000px', 
                transformStyle: 'preserve-3d', 
                cursor: 'pointer',
                transition: 'border-color 0.3s'
              }}
              data-cursor="EXPLORE"
            >
              <div className="card-art" style={{ position: 'absolute', inset: 0, background: card.grad, willChange: 'transform' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.2, background: `radial-gradient(circle at 40% 40%, ${card.accent} 0%, transparent 60%)` }} />
                <div aria-hidden="true" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'clamp(5rem, 12vw, 8rem)', color: card.accent, opacity: 0.08, lineHeight: 1 }}>
                  {card.num}
                </div>
              </div>

              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'clamp(1.5rem, 4vw, 2rem)', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: card.accent, boxShadow: `0 0 10px ${card.accent}` }} aria-hidden="true" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.3em', color: card.accent, textTransform: 'uppercase' }}>{card.num}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--ink)', fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', marginBottom: '0.5rem' }}>{card.title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>{card.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {card.tags.map(t => (
                    <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', padding: '0.25rem 0.625rem', borderRadius: '9999px', border: `1px solid ${card.accent}60`, color: card.accent, background: `${card.accent}10` }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ position: 'absolute', inset: 0, borderRadius: '1.25rem', border: `1px solid ${card.accent}30`, pointerEvents: 'none' }} />
            </article>
          ))}
        </div>
      </div>

      {/* Detail Modal Preview */}
      {activeModalCard && (
        <div 
          onClick={() => setActiveModalCard(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(7,8,11,0.85)', backdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative', width: 'min(600px, 90vw)',
              background: 'var(--surface)', border: `1px solid ${activeModalCard.accent}`,
              borderRadius: '1.5rem', padding: '2.5rem', boxShadow: `0 20px 60px ${activeModalCard.accent}25`
            }}
          >
            <button 
              onClick={() => setActiveModalCard(null)}
              style={{
                position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none',
                color: 'var(--ink)', fontSize: '1.5rem', cursor: 'pointer'
              }}
            >
              ✕
            </button>
            <span style={{ fontFamily: 'var(--font-mono)', color: activeModalCard.accent, fontSize: '0.8rem', letterSpacing: '0.2em' }}>
              CAPABILITY {activeModalCard.num}
            </span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginTop: '0.5rem', marginBottom: '1rem', color: 'var(--ink)' }}>
              {activeModalCard.title}
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {activeModalCard.desc} We combine interactive webGL shaders, fluid GSAP timelines, and optimized React architecture to elevate your brand presence.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {activeModalCard.tags.map(t => (
                <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.4rem 0.8rem', borderRadius: '9999px', background: activeModalCard.accent, color: '#07080B', fontWeight: 700 }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'var(--line)' }} aria-hidden="true">
        <div ref={progressRef} style={{ height: '100%', background: 'var(--accent)', transformOrigin: 'left', transform: 'scaleX(0)', boxShadow: '0 0 10px var(--accent)' }} />
      </div>
    </section>
  )
}

import { useRef, useEffect } from 'react'
import gsap from 'gsap'

const ROW1 = 'WEB DEVELOPMENT / WORDPRESS / SHOPIFY / PERFORMANCE / '
const ROW2 = 'NEXT.JS / REACT / GSAP / TAILWIND / TYPESCRIPT / '

function Row({ text, direction = 1 }) {
  const rowRef = useRef(null)

  useEffect(() => {
    const row = rowRef.current
    row.innerHTML = `<span>${text}</span><span aria-hidden="true">${text}</span>`

    let xPos = 0, velocity = 0, lastY = 0

    const ticker = gsap.ticker.add(() => {
      const y     = window.scrollY
      const delta = y - lastY
      lastY = y
      const target = direction * (0.8 + Math.abs(delta) * 0.3) * Math.sign(delta || 1)
      velocity += (target - velocity) * 0.05
      xPos += velocity

      const totalW = row.firstElementChild?.offsetWidth ?? 1000
      if (xPos >= 0)       xPos = -totalW
      if (xPos <= -totalW) xPos = 0
      row.style.transform = `translateX(${xPos}px)`
    })

    return () => gsap.ticker.remove(ticker)
  }, [text, direction])

  return (
    <div style={{ overflow: 'hidden', borderTop: '1px solid var(--line)', padding: '1rem 0' }} aria-hidden="true">
      <div ref={rowRef} style={{ display: 'flex', whiteSpace: 'nowrap', willChange: 'transform' }} />
    </div>
  )
}

export default function MarqueeSection() {
  const textStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1.2rem, 3vw, 2.2rem)',
    fontWeight: 700,
    letterSpacing: '0.06em',
    color: 'transparent',
    WebkitTextStroke: '1px rgba(244,245,247,0.15)',
  }

  return (
    <section aria-label="Technology stack" style={{ padding: '2rem 0', background: 'var(--bg)', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem', padding: '0 1.5rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase' }}>Technologies we master</span>
      </div>
      <div style={textStyle}>
        <Row text={ROW1} direction={-1} />
        <Row text={ROW2} direction={1}  />
      </div>
    </section>
  )
}

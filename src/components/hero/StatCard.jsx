import { useRef } from 'react'
import gsap from 'gsap'

export default function StatCard({ value, suffix, label, index }) {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    gsap.to(card, {
      rotateX: -y * 0.1,
      rotateY: x * 0.1,
      borderColor: 'var(--accent)',
      boxShadow: '0 8px 30px rgba(198,255,61,0.15)',
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      borderColor: 'var(--line)',
      boxShadow: 'none',
      duration: 0.5,
      ease: 'power3.out',
    })
  }

  return (
    <div
      ref={cardRef}
      className="stat"
      data-index={index}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="IMPACT"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
        padding: '1.25rem 1.5rem',
        borderRadius: '0.875rem',
        border: '1px solid var(--line)',
        background: 'rgba(14,16,22,0.65)',
        backdropFilter: 'blur(12px)',
        transformStyle: 'preserve-3d',
        perspective: '800px',
        willChange: 'transform',
        transition: 'background 0.3s, border-color 0.3s',
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.15rem' }}>
        <span
          data-value={value}
          aria-hidden="true"
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: 'var(--accent)',
            fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
            lineHeight: 1,
            textShadow: '0 0 15px rgba(198,255,61,0.3)',
          }}
        >
          0
        </span>
        <span
          aria-hidden="true"
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: 'rgba(198,255,61,0.85)',
            fontSize: 'clamp(1rem, 2vw, 1.6rem)',
          }}
        >
          {suffix}
        </span>
      </div>
      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', fontSize: '0.725rem', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
        {label}
      </p>
      <span className="sr-only">{value}{suffix} {label}</span>
    </div>
  )
}

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'

/**
 * StatCard:
 * - Only starts counting up from 0 to final target value once the card becomes visible on screen
 * - Employs IntersectionObserver to detect genuine viewport visibility
 * - Supports preloader delay synchronization
 * - Interactive 3D tilt & cursor radial spotlight reflection on hover
 */
export default function StatCard({ value, suffix, label, index }) {
  const cardRef = useRef(null)
  const numRef = useRef(null)
  const glowRef = useRef(null)
  const [displayVal, setDisplayVal] = useState(0)

  // Trigger 0 to final count-up ONLY when visible in viewport
  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    let fired = false

    const startCountAnimation = () => {
      if (fired) return
      fired = true

      const counter = { val: 0 }
      gsap.to(counter, {
        val: value,
        duration: 1.8,
        delay: 0.1 + index * 0.12,
        ease: 'power2.out',
        onUpdate() {
          setDisplayVal(Math.floor(counter.val))
        },
      })
    }

    // IntersectionObserver guarantees it ONLY starts when scrolled/visible into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Check if preloader is currently active
            const preloader = document.querySelector('.preloader')
            if (preloader && preloader.style.display !== 'none') {
              window.addEventListener('preloader:done', startCountAnimation, { once: true })
            } else {
              startCountAnimation()
            }
            observer.disconnect()
          }
        })
      },
      {
        threshold: 0.25, // Trigger once 25% of the card is visible on screen
        rootMargin: '0px 0px -40px 0px',
      }
    )

    observer.observe(card)

    return () => {
      observer.disconnect()
      window.removeEventListener('preloader:done', startCountAnimation)
    }
  }, [value, index])

  // Interactive Hover Parallax & 3D Tilt
  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    gsap.to(card, {
      rotateX: -y * 0.12,
      rotateY: x * 0.12,
      y: -6,
      borderColor: 'rgba(198, 255, 61, 0.75)',
      boxShadow: '0 12px 35px rgba(198, 255, 61, 0.2), inset 0 0 15px rgba(0, 240, 255, 0.15)',
      duration: 0.25,
      ease: 'power2.out',
    })

    if (numRef.current) {
      gsap.to(numRef.current, {
        scale: 1.05,
        textShadow: '0 0 20px rgba(198, 255, 61, 0.65), 0 0 35px rgba(0, 240, 255, 0.4)',
        duration: 0.2,
      })
    }

    if (glowRef.current) {
      const rx = e.clientX - rect.left
      const ry = e.clientY - rect.top
      glowRef.current.style.opacity = '1'
      glowRef.current.style.left = `${rx}px`
      glowRef.current.style.top = `${ry}px`
    }
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      y: 0,
      borderColor: 'var(--line)',
      boxShadow: 'none',
      duration: 0.5,
      ease: 'power3.out',
    })

    if (numRef.current) {
      gsap.to(numRef.current, {
        scale: 1,
        textShadow: '0 0 15px rgba(198, 255, 61, 0.3)',
        duration: 0.4,
      })
    }

    if (glowRef.current) {
      glowRef.current.style.opacity = '0'
    }
  }

  return (
    <div
      ref={cardRef}
      className="stat stat-card-hover"
      data-index={index}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="IMPACT"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
        padding: '1.25rem 1.5rem',
        borderRadius: '0.875rem',
        border: '1px solid var(--line)',
        background: 'rgba(14, 16, 24, 0.72)',
        backdropFilter: 'blur(14px)',
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        willChange: 'transform',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'border-color 0.3s',
      }}
    >
      {/* Dynamic Cursor Spotlight Reflection */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(198,255,61,0.18) 0%, rgba(0,240,255,0.08) 45%, transparent 70%)',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.25s',
        }}
      />

      <div ref={numRef} style={{ display: 'flex', alignItems: 'baseline', gap: '0.15rem', willChange: 'transform' }}>
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
            transition: 'color 0.2s',
          }}
        >
          {displayVal}
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
      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', fontSize: '0.725rem', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0, zIndex: 1 }}>
        {label}
      </p>
      <span className="sr-only">{value}{suffix} {label}</span>
    </div>
  )
}

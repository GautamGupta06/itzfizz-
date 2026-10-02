import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { PRELOADER } from '@/lib/motion.js'

export default function Preloader() {
  const containerRef = useRef(null)
  const progressRef  = useRef(null)
  const counterRef   = useRef(null)

  useEffect(() => {
    const container  = containerRef.current
    const progressBar = progressRef.current
    const counter    = counterRef.current

    document.documentElement.style.overflow = 'hidden'

    let count = { value: 0 }
    let resolved = false

    function complete() {
      if (resolved) return
      resolved = true

      gsap.to(count, {
        value: 100,
        duration: 0.3,
        onUpdate() {
          if (counter) counter.textContent = String(Math.floor(count.value)).padStart(3, '0')
        },
        onComplete() {
          gsap.to(container, {
            clipPath: 'inset(0 0 100% 0)',
            duration: PRELOADER.exitDuration,
            ease: PRELOADER.exitEase,
            delay: 0.15,
            onComplete() {
              container.style.display = 'none'
              document.documentElement.style.overflow = ''
              window.dispatchEvent(new CustomEvent('preloader:done'))
            },
          })
        },
      })
    }

    const startTime = Date.now()

    const tween = gsap.to(count, {
      value: 90,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate() {
        if (counter) counter.textContent = String(Math.floor(count.value)).padStart(3, '0')
        if (progressBar) progressBar.style.transform = `scaleX(${count.value / 100})`
      },
    })

    Promise.all([
      document.fonts.ready,
      new Promise((res) => {
        const elapsed = Date.now() - startTime
        setTimeout(res, Math.max(0, PRELOADER.minDuration - elapsed))
      }),
    ]).then(() => {
      tween.kill()
      complete()
    })

    const timeout = setTimeout(complete, PRELOADER.hardTimeout)
    return () => {
      clearTimeout(timeout)
      tween.kill()
    }
  }, [])

  return (
    <div ref={containerRef} className="preloader" role="progressbar" aria-label="Loading" aria-valuemin={0} aria-valuemax={100}>
      {/* Brand */}
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '0.75rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
          ITZFIZZ
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          VELOCITY
        </span>
      </div>

      {/* Counter */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <span
          ref={counterRef}
          aria-hidden="true"
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: 'var(--ink)',
            fontSize: 'clamp(4rem, 12vw, 8rem)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          000
        </span>

        {/* Progress bar */}
        <div style={{ width: '12rem', height: '1px', background: 'var(--line)', position: 'relative', overflow: 'hidden' }}>
          <div
            ref={progressRef}
            style={{
              position: 'absolute', inset: 0,
              background: 'var(--accent)',
              transformOrigin: 'left',
              transform: 'scaleX(0)',
            }}
          />
        </div>
      </div>

      <p aria-hidden="true" style={{ position: 'absolute', bottom: '2rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
        WEB EXPERIENCE
      </p>
    </div>
  )
}

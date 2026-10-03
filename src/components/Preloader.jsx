import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * 3D Sphere Split Preloader:
 * 1. Sphere with authentic 3D shading, orbital tech rings & glowing neon core.
 * 2. Counter counts smoothly from 0 to 100 inside the sphere core.
 * 3. At 100%, the sphere splits vertically right down the center:
 *    - Left hemisphere slides open to the left (-120% X with 3D rotation)
 *    - Right hemisphere slides open to the right (+120% X with 3D rotation)
 * 4. Entire preloader transitions opacity from 100% to 0%, revealing the homepage seamlessly.
 */
export default function Preloader() {
  const containerRef = useRef(null)
  const sphereLeftRef = useRef(null)
  const sphereRightRef = useRef(null)
  const coreRef = useRef(null)
  const canvasRef = useRef(null)
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'

    let count = { val: 0 }
    let finished = false

    // Acoustic wave filaments canvas
    const canvas = canvasRef.current
    let animId
    if (canvas) {
      const ctx = canvas.getContext('2d')
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr

      const centerX = (w * dpr) / 2
      const centerY = (h * dpr) / 2
      const threadCount = 28
      let time = 0

      const drawThreads = () => {
        time += 0.02
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const baseRadius = 140 * dpr

        for (let i = 0; i < threadCount; i++) {
          const angle = (i / threadCount) * Math.PI * 2 + time * 0.15
          const points = []
          const segments = 24
          const threadLength = 180 * dpr

          for (let s = 0; s <= segments; s++) {
            const frac = s / segments
            const currentDist = baseRadius + frac * threadLength

            // Acoustic organic harmonic undulation
            const wave1 = Math.sin(frac * 6 + time * 3 + i) * (14 * dpr) * frac
            const wave2 = Math.cos(frac * 4 - time * 2 + i * 0.5) * (8 * dpr) * frac
            const totalWave = wave1 + wave2

            const px = centerX + Math.cos(angle) * currentDist - Math.sin(angle) * totalWave
            const py = centerY + Math.sin(angle) * currentDist + Math.cos(angle) * totalWave
            points.push({ x: px, y: py })
          }

          ctx.beginPath()
          ctx.moveTo(points[0].x, points[0].y)
          for (let p = 1; p < points.length - 1; p++) {
            const xc = (points[p].x + points[p + 1].x) / 2
            const yc = (points[p].y + points[p + 1].y) / 2
            ctx.quadraticCurveTo(points[p].x, points[p].y, xc, yc)
          }

          // Gradient color: Cyan to Lime into deep space fade
          const alpha = 0.45 + Math.sin(time * 2 + i) * 0.25
          ctx.strokeStyle = i % 2 === 0
            ? `rgba(0, 240, 255, ${alpha})`
            : `rgba(198, 255, 61, ${alpha * 0.85})`
          ctx.lineWidth = 1.2 * dpr
          ctx.stroke()
        }

        animId = requestAnimationFrame(drawThreads)
      }

      animId = requestAnimationFrame(drawThreads)
    }

    const handleSplitReveal = () => {
      if (finished) return
      finished = true

      const container = containerRef.current
      const leftHemi = sphereLeftRef.current
      const rightHemi = sphereRightRef.current
      const core = coreRef.current
      const threadsCanvas = canvasRef.current

      const tl = gsap.timeline({
        onComplete() {
          if (animId) cancelAnimationFrame(animId)
          if (container) container.style.display = 'none'
          document.documentElement.style.overflow = ''
          window.dispatchEvent(new CustomEvent('preloader:done'))
        },
      })

      // 1. Acoustic threads disperse and fade
      if (threadsCanvas) {
        tl.to(threadsCanvas, {
          scale: 1.4,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        }, 0)
      }

      // 2. Core pop & fade
      tl.to(core, {
        scale: 1.25,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
      }, 0)

      // 3. Vertical split of sphere halves (opening left and right)
      tl.to(leftHemi, {
        x: -220,
        rotateY: -45,
        opacity: 0,
        duration: 0.9,
        ease: 'power4.inOut',
      }, 0.1)

      tl.to(rightHemi, {
        x: 220,
        rotateY: 45,
        opacity: 0,
        duration: 0.9,
        ease: 'power4.inOut',
      }, 0.1)

      // 4. Whole container opacity 100% to 0% to reveal homepage
      tl.to(container, {
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, 0.3)
    }

    // 0 to 100 Counter Animation
    const tween = gsap.to(count, {
      val: 100,
      duration: 2.2,
      ease: 'power1.inOut',
      onUpdate() {
        setPercent(Math.floor(count.val))
      },
      onComplete() {
        setPercent(100)
        handleSplitReveal()
      },
    })

    return () => {
      tween.kill()
      if (animId) cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <aside
      ref={containerRef}
      className="preloader sphere-split-preloader"
      role="progressbar"
      aria-label="Loading Website"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#07090e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        overflow: 'hidden',
        perspective: '1200px',
      }}
    >
      {/* Undulating Acoustic Wave Filaments/Threads Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* Background ambient lighting pulse */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.22) 0%, rgba(77, 124, 255, 0.1) 40%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Sphere Assembly Stage */}
      <div
        style={{
          position: 'relative',
          width: '280px',
          height: '280px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformStyle: 'preserve-3d',
          zIndex: 10,
        }}
      >
        {/* Left Hemisphere (Vertical Half) */}
        <div
          ref={sphereLeftRef}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '140px',
            height: '280px',
            overflow: 'hidden',
            willChange: 'transform, opacity',
            transformOrigin: 'right center',
          }}
        >
          {/* Full circle clipped into left half */}
          <div
            style={{
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: `
                radial-gradient(circle at 35% 35%, rgba(0, 240, 255, 0.45) 0%, rgba(20, 26, 42, 0.95) 50%, #0a0d16 100%)
              `,
              border: '2px solid rgba(0, 240, 255, 0.65)',
              boxShadow: 'inset 10px 10px 30px rgba(0, 240, 255, 0.4), 0 0 35px rgba(0, 240, 255, 0.25)',
              position: 'relative',
            }}
          >
            {/* Tech grid markings on sphere */}
            <svg viewBox="0 0 280 280" style={{ width: '100%', height: '100%', opacity: 0.45 }}>
              <circle cx="140" cy="140" r="130" fill="none" stroke="#00f0ff" strokeWidth="1" strokeDasharray="6 8" />
              <circle cx="140" cy="140" r="95" fill="none" stroke="#c6ff3d" strokeWidth="0.8" strokeDasharray="3 6" />
              <line x1="140" y1="10" x2="140" y2="270" stroke="#00f0ff" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Right Hemisphere (Vertical Half) */}
        <div
          ref={sphereRightRef}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: '140px',
            height: '280px',
            overflow: 'hidden',
            willChange: 'transform, opacity',
            transformOrigin: 'left center',
          }}
        >
          {/* Full circle shifted left to align right half */}
          <div
            style={{
              width: '280px',
              height: '280px',
              marginLeft: '-140px',
              borderRadius: '50%',
              background: `
                radial-gradient(circle at 35% 35%, rgba(0, 240, 255, 0.45) 0%, rgba(20, 26, 42, 0.95) 50%, #0a0d16 100%)
              `,
              border: '2px solid rgba(0, 240, 255, 0.65)',
              boxShadow: 'inset -10px -10px 30px rgba(77, 124, 255, 0.4), 0 0 35px rgba(0, 240, 255, 0.25)',
              position: 'relative',
            }}
          >
            <svg viewBox="0 0 280 280" style={{ width: '100%', height: '100%', opacity: 0.45 }}>
              <circle cx="140" cy="140" r="130" fill="none" stroke="#00f0ff" strokeWidth="1" strokeDasharray="6 8" />
              <circle cx="140" cy="140" r="95" fill="none" stroke="#c6ff3d" strokeWidth="0.8" strokeDasharray="3 6" />
              <line x1="140" y1="10" x2="140" y2="270" stroke="#00f0ff" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Center Split Seam Glow Line */}
        <div
          style={{
            position: 'absolute',
            width: '2px',
            height: '260px',
            background: 'linear-gradient(180deg, transparent 0%, #00f0ff 30%, #c6ff3d 70%, transparent 100%)',
            boxShadow: '0 0 10px #00f0ff',
            pointerEvents: 'none',
            zIndex: 12,
          }}
        />

        {/* Center 0 to 100 Core Display */}
        <div
          ref={coreRef}
          style={{
            position: 'relative',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(7, 9, 14, 0.9) 0%, rgba(12, 16, 26, 0.6) 80%, transparent 100%)',
            padding: '1.5rem',
            borderRadius: '50%',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(2rem, 3.8vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: '#FFFFFF',
              textShadow: '0 0 15px rgba(0, 240, 255, 0.95), 0 0 30px rgba(198, 255, 61, 0.4)',
              display: 'flex',
              alignItems: 'baseline',
              lineHeight: 1,
            }}
          >
            <span>{percent}</span>
            <span style={{ fontSize: '1rem', color: 'var(--accent)', marginLeft: '2px' }}>%</span>
          </div>

          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.3em',
              color: 'rgba(0, 240, 255, 0.85)',
              textTransform: 'uppercase',
              marginTop: '0.4rem',
            }}
          >
            {percent < 100 ? 'INITIALIZING' : 'UNLOCKED'}
          </span>
        </div>
      </div>

      {/* Top and Bottom Tech Telemetry */}
      <div
        style={{
          position: 'absolute',
          top: '2.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          color: 'rgba(255, 255, 255, 0.35)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
        }}
      >
        ITZFIZZ // QUANTUM_SPHERE
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'rgba(0, 240, 255, 0.55)',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
        }}
      >
        CLICK OR SCROLL TO ENTER
      </div>
    </aside>
  )
}

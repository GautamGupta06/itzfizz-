import React, { useRef, useState, useEffect } from 'react'

/**
 * Headline:
 * Per-Letter Liquid / Watery Distortion with Continuous Raycast / Distance Sweep
 *
 * Solves Fast Mouse Movement:
 * - When cursor moves rapidly, discrete mouseenter/pointerenter events skip characters because
 *   the browser only samples mouse events every 8-16ms.
 * - By tracking global/container continuous pointer coordinates and interpolating the segment
 *   from lastMouse to currentMouse, ANY letter crossed by the cursor ray immediately triggers
 *   its individual watery wave disturbance!
 * - Only the letters actually touched/crossed by the cursor animate.
 */

// Global or shared event broadcaster for letters
export default function Headline({ text = 'WELCOME ITZFIZZ' }) {
  const containerRef = useRef(null)
  const lettersRef = useRef([])
  const lastPosRef = useRef(null)

  const registerLetter = (idx, triggerFn, getRectFn) => {
    lettersRef.current[idx] = { trigger: triggerFn, getRect: getRectFn }
  }

  const unregisterLetter = (idx) => {
    delete lettersRef.current[idx]
  }

  // Segment-to-point distance check for continuous collision detection (bullet-proof sweep)
  const distToSegment = (px, py, x1, y1, x2, y2) => {
    const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)
    if (l2 === 0) return Math.hypot(px - x1, py - y1)
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2
    t = Math.max(0, Math.min(1, t))
    return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)))
  }

  useEffect(() => {
    const handlePointerMove = (e) => {
      const curX = e.clientX
      const curY = e.clientY

      const last = lastPosRef.current || { x: curX, y: curY }
      const speed = Math.hypot(curX - last.x, curY - last.y)

      // Test each letter bounding rect
      const entries = Object.entries(lettersRef.current)
      for (let i = 0; i < entries.length; i++) {
        const item = entries[i][1]
        if (!item) continue
        const rect = item.getRect()
        if (!rect) continue

        // Letter center & tolerance box
        const lcx = rect.left + rect.width / 2
        const lcy = rect.top + rect.height / 2
        const radius = Math.max(rect.width, rect.height) * 0.55

        // Check if current point is inside OR swept segment passed through letter
        const dist = distToSegment(lcx, lcy, last.x, last.y, curX, curY)
        if (dist <= radius) {
          // Calculate intensity based on distance to segment & speed
          const intensity = Math.min(1.4, 0.7 + speed * 0.025)
          item.trigger(intensity)
        }
      }

      lastPosRef.current = { x: curX, y: curY }
    }

    const handlePointerLeave = () => {
      lastPosRef.current = null
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  const words = text.split(' ')
  let globalIndexCounter = 0

  return (
    <div
      ref={containerRef}
      className="hero-headline-container"
      style={{
        position: 'relative',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        pointerEvents: 'auto',
        fontSize: 'clamp(3rem, 7.5vw, 6.2rem)',
        fontWeight: 800,
        fontFamily: '"Unbounded", sans-serif',
        lineHeight: 1.05,
        letterSpacing: '0.04em',
        filter: 'drop-shadow(0 0 20px rgba(0, 240, 255, 0.28))',
      }}
    >
      {words.map((word, wordIndex) => (
        <div
          key={wordIndex}
          style={{
            display: 'flex',
            whiteSpace: 'nowrap',
          }}
        >
          {word.split('').map((char) => {
            const currentIdx = globalIndexCounter++
            return (
              <LiquidLetter
                key={currentIdx}
                char={char}
                index={currentIdx}
                register={registerLetter}
                unregister={unregisterLetter}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

function LiquidLetter({ char, index, register, unregister }) {
  const spanRef = useRef(null)
  const animFrameRef = useRef(null)
  const [filterId] = useState(() => `water-turb-${index}-${Math.random().toString(36).substr(2, 6)}`)
  const turbRef = useRef(null)
  const dispRef = useRef(null)

  const stateRef = useRef({
    intensity: 0,
    targetIntensity: 0,
    phase: 0,
  })

  // Register with parent continuous raycaster
  useEffect(() => {
    const trigger = (intensity = 1.0) => {
      stateRef.current.targetIntensity = Math.max(stateRef.current.targetIntensity, intensity)
    }
    const getRect = () => {
      return spanRef.current ? spanRef.current.getBoundingClientRect() : null
    }

    register(index, trigger, getRect)
    return () => {
      unregister(index)
    }
  }, [index, register, unregister])

  useEffect(() => {
    let active = true

    const loop = () => {
      if (!active) return

      const s = stateRef.current
      // Smooth decay / relaxation back to crisp original shape
      s.intensity += (s.targetIntensity - s.intensity) * 0.14
      s.phase += 0.1 + s.intensity * 0.22

      if (turbRef.current && dispRef.current) {
        if (s.intensity > 0.005) {
          // Dynamic watery caustics frequency & scale
          const baseFreqX = 0.035 + Math.sin(s.phase * 0.6) * 0.015
          const baseFreqY = 0.085 + Math.cos(s.phase * 0.9) * 0.03
          turbRef.current.setAttribute('baseFrequency', `${baseFreqX} ${baseFreqY}`)

          const scale = s.intensity * 20
          dispRef.current.setAttribute('scale', scale.toFixed(2))

          if (spanRef.current) {
            spanRef.current.style.filter = `url(#${filterId}) drop-shadow(0 0 ${s.intensity * 10}px rgba(0, 240, 255, 0.7))`
            spanRef.current.style.transform = `scale(${1 + s.intensity * 0.09}) skewX(${(Math.sin(s.phase) * s.intensity * 6).toFixed(2)}deg)`
          }
        } else {
          // Idle state - zero distortion, 100% crisp
          if (spanRef.current && spanRef.current.style.filter) {
            spanRef.current.style.filter = 'none'
            spanRef.current.style.transform = 'none'
          }
        }
      }

      // Automatically decay target intensity
      s.targetIntensity *= 0.91
      if (s.targetIntensity < 0.01) s.targetIntensity = 0

      animFrameRef.current = requestAnimationFrame(loop)
    }

    animFrameRef.current = requestAnimationFrame(loop)

    return () => {
      active = false
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [filterId])

  const handlePointerEnter = () => {
    stateRef.current.targetIntensity = Math.max(stateRef.current.targetIntensity, 1.0)
  }

  if (char === ' ') {
    return <span style={{ display: 'inline-block', width: '0.35em' }}>&nbsp;</span>
  }

  return (
    <span
      ref={spanRef}
      style={{
        display: 'inline-block',
        position: 'relative',
        cursor: 'default',
        transformOrigin: 'center center',
        willChange: 'transform, filter',
        pointerEvents: 'auto',
        zIndex: 30,
      }}
      onPointerEnter={handlePointerEnter}
    >
      {/* SVG Liquid Filter unique to this letter */}
      <svg
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <defs>
          <filter id={filterId} x="-40%" y="-40%" width="180%" height="180%">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.04 0.09"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <span
        style={{
          display: 'inline-block',
          color: '#FFFFFF',
          transition: 'color 0.2s ease',
          pointerEvents: 'none',
        }}
      >
        {char}
      </span>
    </span>
  )
}

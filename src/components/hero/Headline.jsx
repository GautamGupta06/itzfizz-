import { useEffect, useRef } from 'react'
import { splitChars } from '@/lib/splitChars.js'

/**
 * Headline:
 * Perfectly replicates Active Theory's cinematic water refraction & underwater caustic ripple effect:
 * - Crisp, bold, solid typography ("WELCOME ITZFIZZ") perfectly aligned and readable
 * - SVG dynamic liquid water displacement filter (feTurbulence + feDisplacementMap)
 * - Fluid water surface waves ripple across the text and distort it like looking through agitated water
 * - When the user moves the mouse across the text, fluid water ripples radiate and disperse through the letters
 * - The letters stay anchored in their clean typography while the water wave ripples across them, exactly like Active Theory
 */
export default function Headline({ text, style = {} }) {
  const containerRef = useRef(null)
  const turbRef = useRef(null)
  const dispRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0, targetScale: 4.5, currentScale: 4.5, speed: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Inject clean characters
    container.innerHTML = splitChars(text)

    let animationFrameId
    let time = 0

    // Fluid water wave animation loop
    const animateWater = () => {
      time += 0.02
      const mouse = mouseRef.current

      // Smooth decay of mouse ripple intensity
      mouse.currentScale += (mouse.targetScale - mouse.currentScale) * 0.06
      mouse.targetScale = Math.max(4.5, mouse.targetScale * 0.97)

      // Active Theory fluid water caustics frequency modulation:
      // Produces genuine undulating water surface ripples through the letters
      if (turbRef.current) {
        const baseFreqX = 0.018 + Math.sin(time * 1.5) * 0.007
        const baseFreqY = 0.032 + Math.cos(time * 1.2) * 0.010
        turbRef.current.setAttribute('baseFrequency', `${baseFreqX.toFixed(4)} ${baseFreqY.toFixed(4)}`)
      }

      if (dispRef.current) {
        dispRef.current.setAttribute('scale', mouse.currentScale.toFixed(2))
      }

      animationFrameId = requestAnimationFrame(animateWater)
    }

    animationFrameId = requestAnimationFrame(animateWater)

    // Interactive mouse fluid ripple
    const handleMouseMove = (e) => {
      const containerRect = container.getBoundingClientRect()
      // Check if mouse is near or over the text
      const isNear =
        e.clientX >= containerRect.left - 60 &&
        e.clientX <= containerRect.right + 60 &&
        e.clientY >= containerRect.top - 60 &&
        e.clientY <= containerRect.bottom + 60

      if (isNear) {
        // Surge water ripple waves across the text
        mouseRef.current.targetScale = 16
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [text])

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* SVG Active Theory Dynamic Water Refraction Filter */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <filter id="activeTheoryWaterFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              ref={turbRef}
              type="turbulence"
              baseFrequency="0.015 0.025"
              numOctaves="3"
              result="fluidNoise"
              seed="1"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="fluidNoise"
              scale="3"
              xChannelSelector="R"
              yChannelSelector="G"
              result="waterDisplacement"
            />
          </filter>
        </defs>
      </svg>

      <h1
        ref={containerRef}
        className="hero-headline"
        aria-label={text}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.2rem, 5.2vw, 5.8rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: 'var(--ink)',
          userSelect: 'none',
          filter: 'url(#activeTheoryWaterFilter) drop-shadow(0 0 20px rgba(0, 240, 255, 0.2))',
          willChange: 'filter',
          ...style,
        }}
      />
    </div>
  )
}

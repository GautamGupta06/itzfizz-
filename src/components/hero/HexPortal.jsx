import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * ActiveTheoryHexPortal:
 * Inspired by Active Theory's "The Lab" interactive 3D particle hexagon lattice portal.
 * Features:
 * - Fluid undulating wave motion across a honeycomb grid of hexagons
 * - Mouse magnetic tilt & dispersion (interactive ripples & depth)
 * - Holographic HUD ring with rotating runes / telemetry data and crosshair
 * - Volumetric caustics / particulate floaters
 * - Click/Hover interactive warp surge
 */
export default function ActiveTheoryHexPortal() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const ringRef = useRef(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, speed: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animationFrameId
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio || 500)
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio || 400)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = (canvas.offsetWidth || 500) * (window.devicePixelRatio || 1)
      height = canvas.height = (canvas.offsetHeight || 400) * (window.devicePixelRatio || 1)
      initHexagons()
    }
    window.addEventListener('resize', handleResize)

    // Build Hexagon Grid - expanded across full hero width & height extending to the left
    let hexes = []
    const hexRadius = 15 * (window.devicePixelRatio || 1)
    const hexW = Math.sqrt(3) * hexRadius
    const hexH = 2 * hexRadius * 0.75

    function initHexagons() {
      hexes = []
      const cols = Math.ceil(width / hexW) + 8
      const rows = Math.ceil(height / hexH) + 6
      const centerX = width * 0.48
      const centerY = height * 0.50

      for (let r = -rows / 2; r <= rows / 2; r++) {
        for (let c = -cols / 2; c <= cols / 2; c++) {
          const x = centerX + c * hexW + ((r % 2) * hexW) / 2
          const y = centerY + r * hexH

          // Expansive elliptical coverage extending wide to the left and right
          const dx = (x - centerX) / (width * 0.62)
          const dy = (y - centerY) / (height * 0.54)
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 1.38) {
            hexes.push({
              baseX: x,
              baseY: y,
              distFromCenter: dist,
              angle: Math.atan2(y - centerY, x - centerX),
              r: hexRadius,
              noiseOffset: Math.random() * Math.PI * 2,
              baseAlpha: Math.max(0.06, 1 - Math.pow(dist, 1.5)),
            })
          }
        }
      }
    }

    initHexagons()

    // Particles/Motes floating around
    const motes = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: (Math.random() * 2 + 1) * (window.devicePixelRatio || 1),
      speedY: -(Math.random() * 0.4 + 0.15),
      speedX: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      cyan: Math.random() > 0.4,
    }))

    let time = 0

    // Render loop
    const render = () => {
      time += 0.025
      const mouse = mouseRef.current
      mouse.x += (mouse.targetX - mouse.x) * 0.08
      mouse.y += (mouse.targetY - mouse.y) * 0.08

      ctx.clearRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height / 2

      // Draw caustics / subtle backdrop gradient in portal center
      const bgGrad = ctx.createRadialGradient(
        centerX + (mouse.x - 0.5) * 60,
        centerY + (mouse.y - 0.5) * 60,
        10,
        centerX,
        centerY,
        width * 0.48
      )
      bgGrad.addColorStop(0, 'rgba(0, 240, 255, 0.18)')
      bgGrad.addColorStop(0.35, 'rgba(77, 124, 255, 0.12)')
      bgGrad.addColorStop(0.7, 'rgba(198, 255, 61, 0.06)')
      bgGrad.addColorStop(1, 'rgba(12, 14, 20, 0)')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, width, height)

      // Hexagon drawing function
      const drawHex = (x, y, radius, fillStyle, strokeStyle, lineWidth = 1) => {
        ctx.beginPath()
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i + Math.PI / 6
          const hx = x + radius * Math.cos(a)
          const hy = y + radius * Math.sin(a)
          if (i === 0) ctx.moveTo(hx, hy)
          else ctx.lineTo(hx, hy)
        }
        ctx.closePath()
        if (fillStyle) {
          ctx.fillStyle = fillStyle
          ctx.fill()
        }
        if (strokeStyle) {
          ctx.strokeStyle = strokeStyle
          ctx.lineWidth = lineWidth
          ctx.stroke()
        }
      }

      // Render Hex Lattice with Active Theory 3D ripple/wave
      const mousePixelX = mouse.x * width
      const mousePixelY = mouse.y * height

      for (let i = 0; i < hexes.length; i++) {
        const h = hexes[i]

        // 3D undulating wave displacement
        const wave = Math.sin(time * 1.5 + h.distFromCenter * 5.0 - h.angle * 2) * 4
        const wave2 = Math.cos(time * 0.9 + h.baseX * 0.015 + h.baseY * 0.015) * 3

        // Mouse proximity interaction
        const mdx = h.baseX - mousePixelX
        const mdy = h.baseY - mousePixelY
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy)
        const mouseFactor = Math.max(0, 1 - mDist / (width * 0.35))
        const push = mouseFactor * 16

        const curX = h.baseX + (mdx / (mDist || 1)) * push + (mouse.x - 0.5) * 15
        const curY = h.baseY + (mdy / (mDist || 1)) * push + (mouse.y - 0.5) * 15 + wave + wave2

        // Dynamic scale & brightness based on depth and waves
        const scale = Math.max(0.2, (1 - h.distFromCenter * 0.45) + (wave / 20) + mouseFactor * 0.35)
        const curRadius = h.r * scale * 0.92

        // Color modulation (Active Theory cyber metallic look: iridescent dark slate, glowing lime & cyan edges)
        const alpha = Math.min(1, Math.max(0.04, h.baseAlpha * (0.55 + 0.45 * Math.sin(time * 2 + h.noiseOffset) + mouseFactor * 0.8)))

        let fillColor
        let strokeColor

        if (mouseFactor > 0.45) {
          fillColor = `rgba(0, 240, 255, ${alpha * 0.45})`
          strokeColor = `rgba(198, 255, 61, ${alpha * 0.95})`
        } else if (h.distFromCenter < 0.32) {
          fillColor = `rgba(30, 40, 58, ${alpha * 0.6})`
          strokeColor = `rgba(0, 240, 255, ${alpha * 0.65})`
        } else {
          fillColor = `rgba(16, 20, 30, ${alpha * 0.75})`
          strokeColor = `rgba(77, 124, 255, ${alpha * 0.4})`
        }

        drawHex(curX, curY, curRadius, fillColor, strokeColor, 1)
      }

      // Render Floating underwater/cyber motes
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i]
        m.y += m.speedY
        m.x += m.speedX + Math.sin(time + i) * 0.2
        if (m.y < 0) {
          m.y = height
          m.x = Math.random() * width
        }
        ctx.beginPath()
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2)
        ctx.fillStyle = m.cyan
          ? `rgba(0, 240, 255, ${m.alpha})`
          : `rgba(198, 255, 61, ${m.alpha * 0.8})`
        ctx.shadowColor = m.cyan ? '#00f0ff' : '#c6ff3d'
        ctx.shadowBlur = 6
        ctx.fill()
        ctx.shadowBlur = 0
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Mouse Parallax & Ring rotation
  const handlePointerMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const clientX = e.clientX - rect.left
    const clientY = e.clientY - rect.top
    const nx = Math.max(0, Math.min(1, clientX / rect.width))
    const ny = Math.max(0, Math.min(1, clientY / rect.height))
    mouseRef.current.targetX = nx
    mouseRef.current.targetY = ny

    if (ringRef.current) {
      const tiltX = (ny - 0.5) * -18
      const tiltY = (nx - 0.5) * 22
      gsap.to(ringRef.current, {
        rotateX: tiltX,
        rotateY: tiltY,
        duration: 0.5,
        ease: 'power2.out',
      })
    }
  }

  const handlePointerLeave = () => {
    mouseRef.current.targetX = 0.5
    mouseRef.current.targetY = 0.5
    if (ringRef.current) {
      gsap.to(ringRef.current, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
    }
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="active-theory-portal"
      data-cursor="INNOVATE"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '920px',
        height: '500px',
        margin: '0 auto',
        perspective: '1200px',
        cursor: 'crosshair',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        borderRadius: '34px',
      }}
    >
      {/* Dynamic Ambient Background Glow */}
      <div
        style={{
          position: 'absolute',
          inset: '10%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,240,255,0.22) 0%, rgba(77,124,255,0.12) 40%, transparent 70%)',
          filter: 'blur(35px)',
          pointerEvents: 'none',
          animation: 'pulseGlow 6s ease-in-out infinite alternate',
        }}
      />

      {/* Hexagonal Interactive Particle Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          borderRadius: '24px',
          pointerEvents: 'none',
        }}
      />

      {/* 3D Holographic HUD Ring & Telemetry Centerpiece */}
      <div
        ref={ringRef}
        style={{
          position: 'relative',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformStyle: 'preserve-3d',
          pointerEvents: 'none',
          boxShadow: '0 0 35px rgba(0, 240, 255, 0.25), inset 0 0 20px rgba(198, 255, 61, 0.15)',
          background: 'radial-gradient(circle, rgba(12,14,20,0.85) 0%, rgba(18,22,34,0.65) 75%, transparent 100%)',
          backdropFilter: 'blur(4px)',
          border: '1.5px solid rgba(0, 240, 255, 0.45)',
        }}
      >
        {/* Rotating Outer Tech Tick Ring */}
        <svg
          viewBox="0 0 200 200"
          style={{
            position: 'absolute',
            inset: '-10px',
            width: 'calc(100% + 20px)',
            height: 'calc(100% + 20px)',
            animation: 'spinTechRing 22s linear infinite',
            overflow: 'visible',
          }}
        >
          <circle
            cx="100"
            cy="100"
            r="94"
            fill="none"
            stroke="rgba(0, 240, 255, 0.3)"
            strokeWidth="1.5"
            strokeDasharray="4 8 16 8 32 8"
          />
          <circle
            cx="100"
            cy="100"
            r="86"
            fill="none"
            stroke="rgba(198, 255, 61, 0.4)"
            strokeWidth="1"
            strokeDasharray="2 12"
          />
        </svg>

        {/* Counter-rotating Inner Compass Markings */}
        <svg
          viewBox="0 0 160 160"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            animation: 'spinTechRingRev 14s linear infinite',
          }}
        >
          <circle
            cx="80"
            cy="80"
            r="68"
            fill="none"
            stroke="rgba(77, 124, 255, 0.4)"
            strokeWidth="1.2"
            strokeDasharray="20 40 10 30"
          />
          <line x1="80" y1="6" x2="80" y2="16" stroke="#00f0ff" strokeWidth="2" />
          <line x1="80" y1="144" x2="80" y2="154" stroke="#00f0ff" strokeWidth="2" />
          <line x1="6" y1="80" x2="16" y2="80" stroke="#00f0ff" strokeWidth="2" />
          <line x1="144" y1="80" x2="154" y2="80" stroke="#00f0ff" strokeWidth="2" />
        </svg>

        {/* Center Active Theory Four-Point Star Emblem */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="54" height="54" viewBox="0 0 48 48" fill="none">
            {/* Center diamond core */}
            <circle cx="24" cy="24" r="5" fill="#C6FF3D" />
            {/* 4 radiant star arms */}
            <path
              d="M24 2 L26.5 19 L44 24 L26.5 29 L24 46 L21.5 29 L4 24 L21.5 19 Z"
              fill="rgba(255, 255, 255, 0.95)"
              stroke="#00F0FF"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Active Theory Telemetry Texts Floating beside Ring */}
        <div
          style={{
            position: 'absolute',
            right: '-160px',
            top: '28%',
            width: '140px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            color: 'var(--muted)',
            lineHeight: 1.45,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textAlign: 'left',
            opacity: 0.85,
            pointerEvents: 'none',
          }}
        >
          <div style={{ color: 'var(--accent)', fontWeight: 700, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', background: '#00F0FF', boxShadow: '0 0 6px #00F0FF' }} />
            AT_STREAM // 07
          </div>
          <div>PROTOTYPES TURN INTO REALITY</div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: '-140px',
            bottom: '30%',
            width: '120px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            fontWeight: 800,
            letterSpacing: '0.2em',
            color: '#fff',
            textShadow: '0 0 10px rgba(0,240,255,0.6)',
            textAlign: 'right',
            pointerEvents: 'none',
          }}
        >
          {'// THE LAB ->'}
        </div>
      </div>

      <style>{`
        @keyframes spinTechRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinTechRingRev {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulseGlow {
          0% { transform: scale(0.9); opacity: 0.6; }
          100% { transform: scale(1.15); opacity: 0.95; }
        }
      `}</style>
    </div>
  )
}

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * ActiveTheoryHexPortal:
 * 1:1 Recreation of Active Theory "The Lab" (activetheory.net) underwater portal:
 * - High performance 60-120fps optimized 2D canvas rendering
 * - Intelligent visibility pause (stops requestAnimationFrame when scrolled out of view)
 * - Optimized hexagon grid batching
 * - Concentric undulating ripples + iridescent metallic pebble palette
 */
export default function ActiveTheoryHexPortal() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const ringRef = useRef(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 })

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d', { alpha: true })

    let animationFrameId
    let isVisible = true
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5) // Cap DPR at 1.5 for buttery smooth GPU performance
    let width = (canvas.width = (canvas.offsetWidth || 800) * dpr)
    let height = (canvas.height = (canvas.offsetHeight || 500) * dpr)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = (canvas.offsetWidth || 800) * dpr
      height = canvas.height = (canvas.offsetHeight || 500) * dpr
      initHexGrid()
    }
    window.addEventListener('resize', handleResize)

    // Stop render loop when off-screen to give 100% CPU/GPU back to scrolling
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (isVisible && !animationFrameId) {
        render()
      }
    }, { threshold: 0.05 })
    observer.observe(container)

    let hexes = []
    const hexRadius = 15 * dpr
    const hexW = Math.sqrt(3) * hexRadius
    const hexH = 2 * hexRadius * 0.75

    function initHexGrid() {
      hexes = []
      const cols = Math.ceil(width / hexW) + 4
      const rows = Math.ceil(height / hexH) + 4
      const centerX = width * 0.50
      const centerY = height * 0.50

      for (let r = -rows / 2; r <= rows / 2; r++) {
        for (let c = -cols / 2; c <= cols / 2; c++) {
          const x = centerX + c * hexW + ((r % 2) * hexW) / 2
          const y = centerY + r * hexH

          const dx = (x - centerX) / (width * 0.44)
          const dy = (y - centerY) / (height * 0.44)
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 1.15) {
            hexes.push({
              baseX: x,
              baseY: y,
              distFromCenter: dist,
              angle: Math.atan2(y - centerY, x - centerX),
              r: hexRadius,
              seed: Math.random() * Math.PI * 2,
              colorType: Math.random(),
              baseAlpha: Math.min(1, Math.max(0.15, 1 - Math.pow(dist, 1.8))),
            })
          }
        }
      }
    }

    initHexGrid()

    // Floating motes
    const motes = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: (Math.random() * 2 + 1) * dpr,
      speedY: -(Math.random() * 0.35 + 0.15),
      speedX: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.6 + 0.3,
      isCyan: Math.random() > 0.45,
    }))

    let time = 0

    const render = () => {
      if (!isVisible) {
        animationFrameId = null
        return
      }

      time += 0.024
      const mouse = mouseRef.current
      mouse.x += (mouse.targetX - mouse.x) * 0.08
      mouse.y += (mouse.targetY - mouse.y) * 0.08

      ctx.clearRect(0, 0, width, height)

      const centerX = width * 0.50
      const centerY = height * 0.50

      // Ambient underwater glow
      const bgGlow = ctx.createRadialGradient(
        centerX + (mouse.x - 0.5) * 60,
        centerY + (mouse.y - 0.5) * 60,
        15,
        centerX,
        centerY,
        width * 0.46
      )
      bgGlow.addColorStop(0, 'rgba(0, 240, 255, 0.2)')
      bgGlow.addColorStop(0.35, 'rgba(77, 124, 255, 0.12)')
      bgGlow.addColorStop(0.65, 'rgba(198, 255, 61, 0.06)')
      bgGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = bgGlow
      ctx.fillRect(0, 0, width, height)

      // Fast Hexagon Draw
      const mousePx = mouse.x * width
      const mousePy = mouse.y * height

      for (let i = 0; i < hexes.length; i++) {
        const h = hexes[i]

        const ringWave = Math.sin(time * 2.2 - h.distFromCenter * 7.0) * 4.5
        const crossWave = Math.cos(time * 1.1 + h.baseX * 0.012 + h.baseY * 0.012) * 2.5

        const mdx = h.baseX - mousePx
        const mdy = h.baseY - mousePy
        const mDistSq = mdx * mdx + mdy * mdy
        const mouseFactor = mDistSq < 40000 ? Math.max(0, 1 - Math.sqrt(mDistSq) / 200) : 0
        const push = mouseFactor * 16

        const curX = h.baseX + (push ? (mdx / (Math.sqrt(mDistSq) || 1)) * push : 0) + (mouse.x - 0.5) * 14
        const curY = h.baseY + (push ? (mdy / (Math.sqrt(mDistSq) || 1)) * push : 0) + (mouse.y - 0.5) * 14 + ringWave + crossWave

        const depthScale = Math.max(0.35, 1 - h.distFromCenter * 0.35 + ringWave * 0.04 + mouseFactor * 0.3)
        const curRadius = h.r * depthScale * 0.94
        const alpha = Math.min(1, Math.max(0.08, h.baseAlpha * (0.65 + 0.35 * Math.sin(time * 1.8 + h.seed) + mouseFactor * 0.7)))

        ctx.beginPath()
        for (let j = 0; j < 6; j++) {
          const a = (Math.PI / 3) * j + Math.PI / 6
          const hx = curX + curRadius * Math.cos(a)
          const hy = curY + curRadius * Math.sin(a)
          if (j === 0) ctx.moveTo(hx, hy)
          else ctx.lineTo(hx, hy)
        }
        ctx.closePath()

        if (mouseFactor > 0.4) {
          ctx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.6})`
          ctx.strokeStyle = `rgba(198, 255, 61, ${alpha * 0.9})`
        } else if (h.distFromCenter < 0.28) {
          ctx.fillStyle = `rgba(12, 16, 24, ${alpha * 0.85})`
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.7})`
        } else if (h.colorType > 0.72) {
          ctx.fillStyle = `rgba(165, 110, 48, ${alpha * 0.65})`
          ctx.strokeStyle = `rgba(230, 175, 90, ${alpha * 0.8})`
        } else if (h.colorType > 0.45) {
          ctx.fillStyle = `rgba(18, 55, 60, ${alpha * 0.7})`
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.5})`
        } else {
          ctx.fillStyle = `rgba(20, 24, 34, ${alpha * 0.78})`
          ctx.strokeStyle = `rgba(77, 124, 255, ${alpha * 0.4})`
        }
        ctx.lineWidth = 1
        ctx.fill()
        ctx.stroke()
      }

      // Draw floating motes (batch fill without expensive shadows in frame loop)
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i]
        m.y += m.speedY
        m.x += m.speedX
        if (m.y < 0) {
          m.y = height
          m.x = Math.random() * width
        }
        ctx.beginPath()
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2)
        ctx.fillStyle = m.isCyan ? `rgba(0, 240, 255, ${m.alpha})` : `rgba(198, 255, 61, ${m.alpha * 0.85})`
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const handlePointerMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const nx = (e.clientX - rect.left) / rect.width
    const ny = (e.clientY - rect.top) / rect.height
    mouseRef.current.targetX = Math.max(0, Math.min(1, nx))
    mouseRef.current.targetY = Math.max(0, Math.min(1, ny))

    if (ringRef.current) {
      const tiltX = (ny - 0.5) * -16
      const tiltY = (nx - 0.5) * 20
      gsap.to(ringRef.current, {
        rotateX: tiltX,
        rotateY: tiltY,
        duration: 0.4,
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
        height: '520px',
        margin: '0 auto',
        perspective: '1200px',
        cursor: 'crosshair',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        willChange: 'transform',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '8%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,240,255,0.22) 0%, rgba(77,124,255,0.12) 45%, transparent 75%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />

      <div
        ref={ringRef}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformStyle: 'preserve-3d',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: 'calc(100% + 24px)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(1rem, 1.8vw, 1.5rem)',
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: '#FFFFFF',
            textShadow: '0 0 15px rgba(0,240,255,0.8), 0 0 30px rgba(0,240,255,0.4)',
            whiteSpace: 'nowrap',
            lineHeight: 1.1,
            textAlign: 'right',
          }}
        >
          <div>// THE</div>
          <div>LAB -&gt;</div>
        </div>

        <div
          style={{
            position: 'relative',
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle, rgba(8,10,16,0.92) 0%, rgba(14,18,28,0.82) 75%, transparent 100%)',
            border: '2.5px solid #FFFFFF',
            boxShadow: '0 0 25px rgba(255, 255, 255, 0.4), inset 0 0 15px rgba(0, 240, 255, 0.3)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '6px',
              borderRadius: '50%',
              border: '1.2px solid rgba(0, 240, 255, 0.65)',
              boxShadow: '0 0 10px rgba(0, 240, 255, 0.4)',
            }}
          />

          <svg
            width="64"
            height="64"
            viewBox="0 0 48 48"
            fill="none"
            style={{
              overflow: 'visible',
              filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.8))',
            }}
          >
            <path
              d="M24 3 L26.2 19 L43 24 L26.2 29 L24 45 L21.8 29 L5 24 L21.8 19 Z"
              fill="#FFFFFF"
              stroke="#00F0FF"
              strokeWidth="1.2"
            />
            <circle cx="24" cy="24" r="3.5" fill="#C6FF3D" />
          </svg>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 'calc(100% + 24px)',
            maxWidth: '220px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.66rem',
            lineHeight: 1.45,
            color: 'rgba(255, 255, 255, 0.88)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textAlign: 'left',
          }}
        >
          <div style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: '3px' }}>
            OUR HOME FOR INNOVATION.
          </div>
          <div style={{ color: 'var(--muted)' }}>
            WHERE PROTOTYPES TURN INTO PRODUCTION PROJECTS
          </div>
        </div>
      </div>
    </div>
  )
}

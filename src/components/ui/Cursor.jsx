import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    const hasFine    = window.matchMedia('(pointer: fine)').matches
    const prefersRed = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!hasFine || prefersRed) {
      if (dotRef.current)  dotRef.current.style.display  = 'none'
      if (ringRef.current) ringRef.current.style.display = 'none'
      return
    }

    const dot   = dotRef.current
    const ring  = ringRef.current
    const label = labelRef.current

    const moveRingX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' })
    const moveRingY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' })

    function onMove(e) {
      gsap.set(dot, { x: e.clientX, y: e.clientY })
      moveRingX(e.clientX)
      moveRingY(e.clientY)
    }
    function onDown() {
      gsap.to(dot,  { scale: 0.5, duration: 0.15 })
      gsap.to(ring, { scale: 0.85, duration: 0.15 })
    }
    function onUp() {
      gsap.to(dot,  { scale: 1, duration: 0.25, ease: 'elastic.out(1.2,0.5)' })
      gsap.to(ring, { scale: 1, duration: 0.25, ease: 'elastic.out(1.2,0.5)' })
    }
    function onOver(e) {
      const el = e.target.closest('[data-cursor]')
      if (el) {
        const txt = el.dataset.cursor || ''
        gsap.to(ring, { width: 64, height: 64, duration: 0.3, ease: 'power3.out' })
        gsap.to(dot,  { opacity: 0, duration: 0.2 })
        if (txt) { label.textContent = txt; gsap.to(label, { opacity: 1, duration: 0.2 }) }
      } else {
        gsap.to(ring, { width: 40, height: 40, duration: 0.3, ease: 'power3.out' })
        gsap.to(dot,  { opacity: 1, duration: 0.2 })
        gsap.to(label, { opacity: 0, duration: 0.15 })
      }
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup',   onUp)
    document.addEventListener('mouseover', onOver)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup',   onUp)
      document.removeEventListener('mouseover', onOver)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span ref={labelRef} className="cursor-label" />
      </div>
    </>
  )
}

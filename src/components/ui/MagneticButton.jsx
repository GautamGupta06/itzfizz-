import { useRef } from 'react'
import gsap from 'gsap'

export default function MagneticButton({ href, children, strength = 12, className = '', style, 'data-cursor': dataCursor, onClick }) {
  const btnRef = useRef(null)

  function onMouseMove(e) {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const cx = rect.left + rect.width  / 2
    const cy = rect.top  + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 100) {
      const factor = (1 - dist / 100) * strength
      gsap.to(btn, { x: (dx / dist) * factor, y: (dy / dist) * factor, duration: 0.3, ease: 'power3.out' })
    }
  }
  function onMouseLeave() {
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1.1,0.5)' })
  }

  const props = { ref: btnRef, onMouseMove, onMouseLeave, className, style, 'data-cursor': dataCursor }

  return href
    ? <a href={href} {...props}>{children}</a>
    : <button onClick={onClick} {...props}>{children}</button>
}

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from '@/components/ui/MagneticButton.jsx'

const NAV_LINKS = [
  { label: 'Work',     href: '#showcase' },
  { label: 'Services', href: '#services' },
  { label: 'About',    href: '#manifesto' },
]

/**
 * NavFlipLink:
 * Rolling / Flip-up interactive text effect on hover:
 * - On mouse enter: the current text flips up (-100%) and the duplicate copy rolls up from below
 * - On mouse leave: the text flips back down to initial position seamlessly
 */
function NavFlipLink({ label, onClick }) {
  const containerRef = useRef(null)
  const rollRef = useRef(null)

  const handleMouseEnter = () => {
    if (!rollRef.current) return
    gsap.to(rollRef.current, {
      yPercent: -50,
      duration: 0.35,
      ease: 'power3.out',
    })
  }

  const handleMouseLeave = () => {
    if (!rollRef.current) return
    gsap.to(rollRef.current, {
      yPercent: 0,
      duration: 0.35,
      ease: 'power3.out',
    })
  }

  return (
    <button
      ref={containerRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="nav-flip-link"
      style={{
        position: 'relative',
        display: 'inline-block',
        height: '1.25rem',
        overflow: 'hidden',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: '0.82rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontWeight: 500,
        lineHeight: 1,
      }}
    >
      <span
        ref={rollRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          willChange: 'transform',
          transform: 'translateY(0%)',
        }}
      >
        {/* Primary initial text */}
        <span
          style={{
            height: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--muted)',
            transition: 'color 0.2s',
          }}
        >
          {label}
        </span>
        {/* Clone text rolling up from below with glowing neon accent */}
        <span
          aria-hidden="true"
          style={{
            height: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--ink)',
            textShadow: '0 0 10px rgba(0, 240, 255, 0.4), 0 0 20px rgba(198, 255, 61, 0.3)',
          }}
        >
          {label}
        </span>
      </span>
    </button>
  )
}

export default function Navbar() {
  const navRef  = useRef(null)
  const menuRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const nav = navRef.current
    let lastY = 0

    ScrollTrigger.create({
      start: 80,
      onUpdate(self) {
        const y   = self.scroll()
        const dir = y > lastY ? 1 : -1
        lastY = y
        gsap.to(nav, { yPercent: dir > 0 ? -100 : 0, duration: 0.4, ease: 'power3.out', overwrite: 'auto' })
        if (y > 80) nav.classList.add('nav-scrolled')
        else        nav.classList.remove('nav-scrolled')
      },
    })
  }, [])

  useEffect(() => {
    const menu = menuRef.current
    if (!menu) return
    if (menuOpen) {
      gsap.fromTo(menu,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: 'power4.inOut' }
      )
      gsap.fromTo(menu.querySelectorAll('.mobile-link'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'expo.out', delay: 0.2 }
      )
      document.body.style.overflow = 'hidden'
    } else {
      gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: 0.5, ease: 'power4.in',
        onComplete: () => { document.body.style.overflow = '' }
      })
    }
  }, [menuOpen])

  function scrollTo(href) {
    setMenuOpen(false)
    setTimeout(() => {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  return (
    <>
      <header
        ref={navRef}
        className="nav"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          padding: '1rem 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'background 0.3s',
        }}
      >
        {/* Logo */}
        <a href="/" aria-label="Itzfizz home" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--ink)', fontSize: '0.95rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            ITZFIZZ
          </span>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} aria-hidden="true" />
        </a>

        {/* Desktop links with Rolling / Flip-Up Animation */}
        <nav aria-label="Main navigation" style={{ display: 'flex', gap: '2.2rem', alignItems: 'center' }} className="desktop-nav">
          {NAV_LINKS.map(l => (
            <NavFlipLink key={l.label} label={l.label} onClick={() => scrollTo(l.href)} />
          ))}
        </nav>

        {/* CTA with Clean Roll-Up Flip Effect */}
        <MagneticButton
          href="mailto:hello@itzfizz.com"
          strength={8}
          data-cursor="View"
          className="desktop-cta"
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em',
            textTransform: 'uppercase', padding: '0 1.25rem',
            borderRadius: '9999px', border: '1px solid var(--accent)',
            color: 'var(--accent)', textDecoration: 'none',
            overflow: 'hidden',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '2.4rem',
            boxSizing: 'border-box',
            transition: 'background 0.3s, color 0.3s, border-color 0.3s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--accent)'
            e.currentTarget.style.color = '#000000'
            const textInner = e.currentTarget.querySelector('.cta-flip-inner')
            if (textInner) gsap.to(textInner, { y: -38, duration: 0.3, ease: 'power2.out' })
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--accent)'
            const textInner = e.currentTarget.querySelector('.cta-flip-inner')
            if (textInner) gsap.to(textInner, { y: 0, duration: 0.3, ease: 'power2.out' })
          }}
        >
          <span
            style={{
              display: 'block',
              height: '38px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <span
              className="cta-flip-inner"
              style={{
                display: 'flex',
                flexDirection: 'column',
                willChange: 'transform',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '38px', whiteSpace: 'nowrap' }}>
                Start a project
              </span>
              <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '38px', whiteSpace: 'nowrap' }}>
                Start a project
              </span>
            </span>
          </span>
        </MagneticButton>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="hamburger"
          style={{ width: '2rem', height: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block', height: '1px', background: 'var(--ink)',
              transition: 'transform 0.3s, opacity 0.3s',
              width: i === 1 ? '75%' : '100%',
              transform: menuOpen && i === 0 ? 'translateY(10px) rotate(45deg)' : menuOpen && i === 2 ? 'translateY(-10px) rotate(-45deg)' : 'none',
              opacity: menuOpen && i === 1 ? 0 : 1,
              transformOrigin: 'center',
            }} />
          ))}
        </button>
      </header>

      {/* Mobile menu */}
      <div
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'var(--bg)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2.5rem',
          clipPath: 'inset(0 0 100% 0)',
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        {NAV_LINKS.map(l => (
          <button key={l.label} onClick={() => scrollTo(l.href)} className="mobile-link"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 8vw, 3rem)', fontWeight: 700, color: 'var(--ink)', background: 'none', border: 'none', cursor: 'pointer', opacity: 0 }}
          >{l.label}</button>
        ))}
        <MagneticButton href="mailto:hello@itzfizz.com" className="mobile-link"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '1rem 2rem', borderRadius: '9999px', border: '1px solid var(--accent)', color: 'var(--accent)', textDecoration: 'none', opacity: 0 }}
        >Start a project</MagneticButton>
      </div>

      <style>{`
        @media (max-width: 768px) { .desktop-nav, .desktop-cta { display: none !important; } }
        @media (min-width: 769px) { .hamburger { display: none !important; } }
      `}</style>
    </>
  )
}

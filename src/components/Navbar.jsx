import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from '@/components/ui/MagneticButton.jsx'

const NAV_LINKS = [
  { label: 'Work',     href: '#showcase' },
  { label: 'Services', href: '#services' },
  { label: 'About',    href: '#manifesto' },
]

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

        {/* Desktop links */}
        <nav aria-label="Main navigation" style={{ display: 'flex', gap: '2rem' }} className="desktop-nav">
          {NAV_LINKS.map(l => (
            <button key={l.label} onClick={() => scrollTo(l.href)}
              style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', fontSize: '0.8rem', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--ink)'}
              onMouseLeave={e => e.target.style.color = 'var(--muted)'}
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <MagneticButton
          href="mailto:hello@itzfizz.com"
          strength={8}
          data-cursor="View"
          className="desktop-cta"
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em',
            textTransform: 'uppercase', padding: '0.6rem 1.25rem',
            borderRadius: '9999px', border: '1px solid var(--accent)',
            color: 'var(--accent)', textDecoration: 'none',
            transition: 'background 0.3s, color 0.3s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'var(--bg)' }}
          onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--accent)' }}
        >
          Start a project
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

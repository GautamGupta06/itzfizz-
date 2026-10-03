import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const ROW1 = 'WEB DEVELOPMENT / WORDPRESS / SHOPIFY / PERFORMANCE / '
const ROW2 = 'NEXT.JS / REACT / GSAP / TAILWIND / TYPESCRIPT / '

export default function MarqueeSection() {
  const sectionRef = useRef(null)
  const row1Ref = useRef(null)
  const row2Ref = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const row1 = row1Ref.current
    const row2 = row2Ref.current
    const section = sectionRef.current
    if (!row1 || !row2 || !section) return

    // Scrub position directly linked ONLY to page scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    })

    // Row 1 slides dynamically to the left on scroll down
    tl.fromTo(
      row1,
      { x: 0 },
      { x: () => -window.innerWidth * 0.8, ease: 'none' },
      0
    )

    // Row 2 slides dynamically to the right on scroll down
    tl.fromTo(
      row2,
      { x: () => -window.innerWidth * 0.8 },
      { x: 0, ease: 'none' },
      0
    )

    const onDone = () => ScrollTrigger.refresh()
    window.addEventListener('preloader:done', onDone)

    return () => {
      tl.kill()
      window.removeEventListener('preloader:done', onDone)
    }
  }, [])

  const textStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1.4rem, 3.5vw, 2.6rem)',
    fontWeight: 700,
    letterSpacing: '0.06em',
    color: 'transparent',
    WebkitTextStroke: '1px rgba(244,245,247,0.18)',
  }

  // Multiply string so it covers wide screens seamlessly during scroll
  const repeatText = (str) => Array(6).fill(str).join('')

  return (
    <section
      ref={sectionRef}
      aria-label="Technology stack"
      style={{
        padding: '3rem 0',
        background: 'var(--bg)',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2.5rem', padding: '0 1.5rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase' }}>
          Technologies we master
        </span>
      </div>

      <div style={textStyle}>
        {/* ROW 1: Moves Left on Scroll */}
        <div style={{ overflow: 'hidden', borderTop: '1px solid var(--line)', padding: '1.2rem 0' }}>
          <div
            ref={row1Ref}
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
              willChange: 'transform',
            }}
          >
            {repeatText(ROW1)}
          </div>
        </div>

        {/* ROW 2: Moves Right on Scroll */}
        <div style={{ overflow: 'hidden', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '1.2rem 0' }}>
          <div
            ref={row2Ref}
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
              willChange: 'transform',
            }}
          >
            {repeatText(ROW2)}
          </div>
        </div>
      </div>
    </section>
  )
}

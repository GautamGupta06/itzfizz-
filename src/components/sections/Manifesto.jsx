import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const TEXT = 'We design and build websites that feel alive. Every scroll, every hover, every millisecond is crafted to turn visitors into customers — fast, smooth and unforgettable.'
const KEY  = new Set(['alive.', 'crafted', 'fast,', 'smooth', 'unforgettable.'])

export default function Manifesto() {
  const sectionRef = useRef(null)
  const textRef    = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const text = textRef.current
    if (!text) return

    text.innerHTML = TEXT.split(' ').map((w, i) =>
      `<span class="mw" data-i="${i}" style="display:inline-block;opacity:0.15;margin-right:0.3em">${w}</span>`
    ).join('')

    const words = text.querySelectorAll('.mw')
    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', end: 'bottom 30%', scrub: 1.5 },
    })
    words.forEach((el, i) => {
      tl.to(el, {
        opacity: 1,
        color: KEY.has(el.textContent ?? '') ? '#C6FF3D' : '#F4F5F7',
        duration: 0.1,
        ease: 'none',
      }, (i / (words.length - 1)) * 0.9)
    })
  }, [])

  return (
    <section ref={sectionRef} id="manifesto" aria-labelledby="manifesto-heading"
      style={{ padding: 'clamp(4rem,12vw,10rem) clamp(1.5rem,5vw,5rem)', maxWidth: '87.5rem', margin: '0 auto' }}
    >
      <h2 id="manifesto-heading" className="sr-only">Our Philosophy</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <span style={{ width: '2rem', height: '1px', background: 'var(--accent)' }} aria-hidden="true" />
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '0.7rem', letterSpacing: '0.4em', textTransform: 'uppercase' }}>Our Philosophy</span>
      </div>

      <p ref={textRef} aria-label={TEXT}
        style={{ fontFamily: 'var(--font-display)', fontWeight: 700, lineHeight: 1.3, fontSize: 'clamp(1.6rem, 4vw, 3.5rem)', maxWidth: '62.5rem' }}
      />
    </section>
  )
}

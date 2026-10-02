import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Subtitle:
 * "Websites that move at the speed of your ambition. Precision engineering, buttery 60fps animations, and magnetic interactions."
 *
 * Features:
 * - Ambient underwater caustic wave shimmer across key cyber terms
 * - Interactive word hover: dynamic aquatic wave float & iridescent glow
 * - Mouse ripple displacement that radiates as the cursor sweeps across
 * - Crisp readability matching modern Active Theory typography
 */
const SUBTITLE_TEXT = "Websites that move at the speed of your ambition. Precision engineering, buttery 60fps animations, and magnetic interactions."

const HIGHLIGHT_WORDS = new Set(['speed', 'ambition.', 'Precision', 'engineering,', 'buttery', '60fps', 'animations,', 'magnetic', 'interactions.'])

export default function Subtitle({ style = {} }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const words = el.querySelectorAll('.sub-word')

    // Continuous subtle aquatic wave breathing across words
    const tl = gsap.timeline({ repeat: -1, yoyo: true })
    tl.to(words, {
      y: (i) => Math.sin(i * 0.8) * 3,
      duration: 2.4,
      ease: 'sine.inOut',
      stagger: {
        each: 0.08,
        from: 'start',
      },
    })

    // Interactive magnetic fluid wave on mouse hover/enter per word
    words.forEach((word) => {
      const isHighlight = word.dataset.highlight === 'true'

      const onEnter = () => {
        gsap.to(word, {
          y: -5,
          scale: 1.06,
          color: isHighlight ? '#00f0ff' : '#ffffff',
          textShadow: isHighlight 
            ? '0 0 16px rgba(0,240,255,0.7), 0 0 25px rgba(198,255,61,0.4)' 
            : '0 0 10px rgba(255,255,255,0.5)',
          duration: 0.25,
          ease: 'power2.out',
        })
      }

      const onLeave = () => {
        gsap.to(word, {
          y: 0,
          scale: 1,
          color: isHighlight ? '#c6ff3d' : 'var(--muted)',
          textShadow: isHighlight ? '0 0 10px rgba(198,255,61,0.3)' : 'none',
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)',
        })
      }

      word.addEventListener('mouseenter', onEnter)
      word.addEventListener('mouseleave', onLeave)
    })

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <p
      ref={rootRef}
      className="hero-sub"
      style={{
        fontFamily: 'var(--font-body)',
        color: 'var(--muted)',
        maxWidth: '36rem',
        marginTop: '1.25rem',
        fontSize: 'clamp(1.02rem, 1.65vw, 1.25rem)',
        lineHeight: 1.7,
        position: 'relative',
        zIndex: 10,
        ...style,
      }}
    >
      {SUBTITLE_TEXT.split(' ').map((w, i) => {
        const isHighlight = HIGHLIGHT_WORDS.has(w)
        return (
          <span
            key={i}
            className="sub-word"
            data-highlight={isHighlight}
            style={{
              display: 'inline-block',
              marginRight: '0.28em',
              color: isHighlight ? '#c6ff3d' : 'var(--muted)',
              fontWeight: isHighlight ? 500 : 400,
              textShadow: isHighlight ? '0 0 10px rgba(198,255,61,0.25)' : 'none',
              cursor: 'pointer',
              transition: 'color 0.2s',
              willChange: 'transform',
            }}
          >
            {w}
          </span>
        )
      })}
    </p>
  )
}

import { useEffect, useRef } from 'react'
import { splitChars } from '@/lib/splitChars.js'

export default function Headline({ text, style = {} }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = splitChars(text)
  }, [text])

  return (
    <h1
      ref={ref}
      className="hero-headline"
      aria-label={text}
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.8rem, 5.5vw, 6.5rem)',
        fontWeight: 800,
        lineHeight: 1.05,
        letterSpacing: '0.5em',
        textTransform: 'uppercase',
        color: 'var(--ink)',
        userSelect: 'none',
        ...style,
      }}
    />
  )
}

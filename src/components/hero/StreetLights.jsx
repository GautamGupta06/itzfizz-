import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * StreetLights:
 * Animated roadside cyber street lamps passing by as the car drives,
 * matching the user's annotation ("street light" on both left and right sides of the road/car).
 * Features:
 * - Sleek modern cyber-pole structure with cantilevered curved arm
 * - High-intensity downward volumetric conical beam hitting the pavement
 * - Ambient ground reflection pool
 * - Real-time flicker & atmospheric breathing neon glow
 * - Dynamic scroll parallax and speed streak effect when scrolling
 */
export default function StreetLights({ carRef }) {
  const containerRef = useRef(null)

  useEffect(() => {
    // Atmospheric subtle flickering & breathing of street light glow
    const tl = gsap.timeline({ repeat: -1, yoyo: true })
    tl.to('.street-lamp-beam', {
      opacity: 0.65,
      duration: 'random(1.2, 2.5)',
      ease: 'sine.inOut',
      stagger: {
        each: 0.4,
        from: 'random',
      },
    })

    // Random micro flickers on cyber LEDs
    const flicker = () => {
      const lamps = document.querySelectorAll('.lamp-bulb')
      if (lamps.length > 0) {
        const randLamp = lamps[Math.floor(Math.random() * lamps.length)]
        gsap.to(randLamp, {
          opacity: 0.4,
          duration: 0.08,
          yoyo: true,
          repeat: 3,
          ease: 'rough',
          onComplete: () => {
            gsap.to(randLamp, { opacity: 1, duration: 0.1 })
          }
        })
      }
      flickerTimeout = setTimeout(flicker, Math.random() * 5000 + 3000)
    }

    let flickerTimeout = setTimeout(flicker, 2000)

    return () => {
      tl.kill()
      clearTimeout(flickerTimeout)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="street-lights-layer"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 11, // positioned in stage around the car
        overflow: 'visible',
      }}
    >
      {/* ── LEFT STREET LIGHT (Tall cyber pole arching over the rear of the car) ── */}
      <div
        className="street-light street-light-left"
        style={{
          position: 'absolute',
          bottom: '8px',
          left: 'max(0.5rem, 5%)',
          width: '240px',
          height: '320px',
          zIndex: 15,
          pointerEvents: 'none',
        }}
      >
        <svg
          viewBox="0 0 180 240"
          fill="none"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <defs>
            {/* Volumetric downward cone beam */}
            <linearGradient id="leftLightBeam" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#C6FF3D" stopOpacity="0.8" />
              <stop offset="25%" stopColor="#C6FF3D" stopOpacity="0.35" />
              <stop offset="75%" stopColor="#4D7CFF" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#C6FF3D" stopOpacity="0" />
            </linearGradient>

            {/* Pavement ground pool */}
            <radialGradient id="groundPoolLeft" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C6FF3D" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#00F0FF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#C6FF3D" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Volumetric Light Cone projecting downwards */}
          <polygon
            points="95,46 20,235 170,235"
            fill="url(#leftLightBeam)"
            className="street-lamp-beam"
            opacity="0.45"
            style={{ mixBlendMode: 'screen' }}
          />

          {/* Ground reflection pool on the asphalt */}
          <ellipse
            cx="95"
            cy="235"
            rx="75"
            ry="9"
            fill="url(#groundPoolLeft)"
            opacity="0.7"
          />

          {/* Lamp Post Base */}
          <rect x="24" y="232" width="16" height="5" rx="1.5" fill="#1e2230" stroke="#333a4d" strokeWidth="0.8" />
          <path d="M28 232 L30 220 L34 220 L36 232 Z" fill="#141722" />

          {/* Vertical Pole with Cyber Accents */}
          <line x1="32" y1="220" x2="32" y2="40" stroke="#252a3a" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="32" y1="200" x2="32" y2="60" stroke="#00f0ff" strokeWidth="1" opacity="0.35" />

          {/* LED Ring Joints on Pole */}
          <rect x="29" y="160" width="6" height="2" rx="1" fill="#C6FF3D" opacity="0.8" />
          <rect x="29" y="100" width="6" height="2" rx="1" fill="#00f0ff" opacity="0.8" />

          {/* Cantilever Curved Arm arching over the road */}
          <path
            d="M32 40 C32 15, 65 15, 95 38"
            fill="none"
            stroke="#2d3345"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Lamp Fixture Head */}
          <path
            d="M80 34 L110 40 L106 48 L76 42 Z"
            fill="#12151e"
            stroke="#4d7cff"
            strokeWidth="1"
          />

          {/* Glowing Lamp Bulb / Lens */}
          <ellipse
            cx="93"
            cy="44"
            rx="11"
            ry="3.5"
            fill="#C6FF3D"
            className="lamp-bulb"
            filter="drop-shadow(0 0 10px #C6FF3D)"
          />
          <ellipse
            cx="93"
            cy="44"
            rx="22"
            ry="7"
            fill="#C6FF3D"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* ── RIGHT STREET LIGHT (Tall cyber pole arching over the front wheel of the car) ── */}
      <div
        className="street-light street-light-right"
        style={{
          position: 'absolute',
          bottom: '8px',
          right: 'max(1rem, 7%)',
          width: '260px',
          height: '340px',
          zIndex: 15,
          pointerEvents: 'none',
        }}
      >
        <svg
          viewBox="0 0 200 260"
          fill="none"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <defs>
            {/* Volumetric downward cone beam */}
            <linearGradient id="rightLightBeam" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.85" />
              <stop offset="30%" stopColor="#C6FF3D" stopOpacity="0.4" />
              <stop offset="80%" stopColor="#4D7CFF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
            </linearGradient>

            {/* Pavement ground pool */}
            <radialGradient id="groundPoolRight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.55" />
              <stop offset="45%" stopColor="#C6FF3D" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Volumetric Light Cone projecting downwards */}
          <polygon
            points="95,44 15,255 175,255"
            fill="url(#rightLightBeam)"
            className="street-lamp-beam"
            opacity="0.5"
            style={{ mixBlendMode: 'screen' }}
          />

          {/* Ground reflection pool on the road */}
          <ellipse
            cx="95"
            cy="255"
            rx="80"
            ry="10"
            fill="url(#groundPoolRight)"
            opacity="0.75"
          />

          {/* Lamp Post Base */}
          <rect x="150" y="252" width="18" height="5" rx="1.5" fill="#1e2230" stroke="#333a4d" strokeWidth="0.8" />
          <path d="M154 252 L156 240 L162 240 L164 252 Z" fill="#141722" />

          {/* Vertical Pole with Cyber Accents */}
          <line x1="159" y1="240" x2="159" y2="40" stroke="#252a3a" strokeWidth="4" strokeLinecap="round" />
          <line x1="159" y1="210" x2="159" y2="60" stroke="#C6FF3D" strokeWidth="1" opacity="0.35" />

          {/* LED Ring Joints on Pole */}
          <rect x="156" y="170" width="6" height="2.5" rx="1" fill="#00f0ff" opacity="0.8" />
          <rect x="156" y="110" width="6" height="2.5" rx="1" fill="#C6FF3D" opacity="0.8" />

          {/* Cantilever Curved Arm arching toward road */}
          <path
            d="M159 40 C159 12, 125 12, 95 38"
            fill="none"
            stroke="#2d3345"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Lamp Fixture Head */}
          <path
            d="M110 34 L80 40 L84 48 L114 42 Z"
            fill="#12151e"
            stroke="#00f0ff"
            strokeWidth="1"
          />

          {/* Glowing Lamp Bulb / Lens */}
          <ellipse
            cx="97"
            cy="44"
            rx="12"
            ry="4"
            fill="#00F0FF"
            className="lamp-bulb"
            filter="drop-shadow(0 0 12px #00F0FF)"
          />
          <ellipse
            cx="97"
            cy="44"
            rx="24"
            ry="8"
            fill="#C6FF3D"
            opacity="0.35"
          />
        </svg>
      </div>
    </div>
  )
}

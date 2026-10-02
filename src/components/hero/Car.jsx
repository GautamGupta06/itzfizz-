import { useState } from 'react'
import gsap from 'gsap'

export default function Car({ className = '', style = {} }) {
  const [revving, setRevving] = useState(false)

  const handleCarClick = (e) => {
    setRevving(true)
    const carEl = e.currentTarget
    
    // Rev animation: shake + nitro flame burst
    gsap.to(carEl, {
      y: -12,
      rotation: -1.5,
      duration: 0.1,
      yoyo: true,
      repeat: 5,
      ease: 'power1.inOut',
      onComplete: () => {
        gsap.to(carEl, { y: 0, rotation: 0, duration: 0.3, ease: 'bounce.out' })
        setRevving(false)
      }
    })

    // Pulse speed lines & exhaust
    gsap.fromTo('.nitro-flame', 
      { scaleX: 0.4, opacity: 0.3 }, 
      { scaleX: 1.8, opacity: 1, duration: 0.35, yoyo: true, repeat: 1, ease: 'power2.out' }
    )
  }

  return (
    <div 
      className={`car-container ${className}`}
      onClick={handleCarClick}
      data-cursor="REV TURBO"
      style={{
        cursor: 'pointer',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        ...style
      }}
    >
      <svg
        viewBox="0 0 900 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="car"
        role="img"
        aria-label="Itzfizz hypercar"
        style={{
          width: '100%',
          height: 'auto',
          overflow: 'visible'
        }}
      >
        <defs>
          <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C6FF3D" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#4D7CFF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#C6FF3D" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="headlightBeam" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C6FF3D" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#C6FF3D" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#C6FF3D" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="nitroGrad" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#C6FF3D" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF3D77" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. Ground Neon Glow */}
        <g className="car-shadow">
          <ellipse cx="450" cy="258" rx="360" ry="20" fill="url(#shadowGrad)" />
        </g>

        {/* 2. Speed Lines trailing behind on left (rear) */}
        <g className="speed-lines" opacity="0">
          <rect x="0" y="178" width="180" height="2" rx="1" fill="#C6FF3D" opacity="0.6" />
          <rect x="0" y="188" width="130" height="1.5" rx="0.75" fill="#00F0FF" opacity="0.5" />
          <rect x="0" y="198" width="160" height="1.5" rx="0.75" fill="#4D7CFF" opacity="0.4" />
          <rect x="0" y="205" width="100" height="1" rx="0.5" fill="#C6FF3D" opacity="0.3" />
        </g>

        {/* 3. Nitro Flame Exhaust (Behind rear bumper on the left) */}
        <g className="nitro-flame" style={{ transformOrigin: '90px 224px' }}>
          <path d="M90 220 L0 208 L40 224 L0 226 L90 228 Z" fill="url(#nitroGrad)" opacity={revving ? 0.95 : 0.4} />
          <ellipse cx="85" cy="224" rx="12" ry="5" fill="#00F0FF" opacity="0.9" />
        </g>

        {/* 4. Headlight Beam Projection (Beaming forward to the right) */}
        <g className="headlight-cone">
          <polygon points="760,195 1020,130 1040,240 760,205" fill="url(#headlightBeam)" opacity="0.35" />
        </g>

        {/* 5. Road Track Line */}
        <rect x="20" y="252" width="860" height="2" rx="1" fill="rgba(255,255,255,0.08)" />

        {/* 6. Car Body (Facing forward to the right) */}
        <g className="car-body">
          {/* Main Chassis */}
          <path d="M760 220 C760 220 740 180 690 165 L610 148 C590 142 560 128 510 120 L400 112 C360 110 320 112 290 118 L220 132 C180 140 150 158 130 175 L100 200 C90 210 88 220 90 230 L740 230 Z" fill="#12141D" stroke="rgba(198,255,61,0.25)" strokeWidth="1" />
          <path d="M600 148 C585 128 550 108 500 100 L380 96 C340 96 310 104 290 118 L220 132 C230 135 260 135 280 130 L390 116 C425 112 460 112 500 116 L580 128 Z" fill="#1E2230" />
          
          {/* Cockpit & Tinted Glass */}
          <path d="M580 148 C570 124 540 106 500 100 L390 96 C355 96 330 106 320 120 L360 132 C380 124 410 118 445 116 L520 118 C545 120 565 130 575 144 Z" fill="#0A0C14" opacity="0.95" />
          <path d="M570 144 C560 122 532 104 492 100 L390 96 C356 96 332 106 322 118 L335 124 C352 112 380 106 410 106 L500 108 C532 110 555 122 564 140 Z" fill="rgba(198,255,61,0.25)" />
          
          {/* Body Accents & Racing Lines */}
          <line x1="460" y1="108" x2="468" y2="148" stroke="#C6FF3D" strokeWidth="1" opacity="0.4" />
          <line x1="400" y1="106" x2="402" y2="148" stroke="#C6FF3D" strokeWidth="1" opacity="0.4" />
          <path d="M690 190 L120 190" stroke="#C6FF3D" strokeWidth="2" opacity="0.6" />
          <path d="M760 220 C755 212 740 208 720 210 L715 230 L760 230 Z" fill="#0D0F18" />
          <path d="M100 200 C95 208 92 216 92 230 L120 230 L120 220 C110 218 102 210 100 200 Z" fill="#0D0F18" />

          {/* Side Vent LEDs */}
          <rect x="738" y="214" width="20" height="10" rx="2" fill="rgba(198,255,61,0.15)" />
          <rect x="752" y="216" width="4" height="6" rx="1" fill="#C6FF3D" />
          <rect x="746" y="216" width="4" height="6" rx="1" fill="#C6FF3D" />
          <rect x="740" y="216" width="4" height="6" rx="1" fill="#C6FF3D" />
          <rect x="210" y="226" width="490" height="4" rx="2" fill="#090B12" />
        </g>

        {/* 7. Front Headlight */}
        <g className="headlight front-light">
          <ellipse cx="748" cy="200" rx="14" ry="7" fill="#C6FF3D" />
          <ellipse cx="748" cy="200" rx="24" ry="14" fill="#C6FF3D" opacity="0.3" />
          <ellipse cx="748" cy="200" rx="45" ry="22" fill="#C6FF3D" opacity="0.1" />
        </g>

        {/* 8. Rear Taillight */}
        <g className="headlight rear-light">
          <rect x="92" y="195" width="18" height="8" rx="2" fill="#FF3D77" />
          <rect x="86" y="190" width="30" height="18" rx="4" fill="#FF3D77" opacity="0.25" />
        </g>

        {/* Exhaust Pipes */}
        <rect x="98" y="222" width="12" height="5" rx="2.5" fill="#363A4D" />
        <rect x="88" y="222" width="8" height="5" rx="2.5" fill="#363A4D" />

        {/* 9. REAR WHEEL (Center at x=250, y=240) */}
        <g className="rear-wheel" style={{ transformOrigin: '250px 240px', transformBox: 'view-box' }}>
          <circle cx="250" cy="240" r="38" fill="#090B10" stroke="#C6FF3D" strokeWidth="2" opacity="0.8" />
          <circle cx="250" cy="240" r="24" fill="none" stroke="#252A3C" strokeWidth="2.5" />
          <circle cx="250" cy="240" r="10" fill="#141724" />
          <line x1="250" y1="218" x2="250" y2="262" stroke="#C6FF3D" strokeWidth="2" opacity="0.9" />
          <line x1="228" y1="240" x2="272" y2="240" stroke="#C6FF3D" strokeWidth="2" opacity="0.9" />
          <line x1="234" y1="224" x2="266" y2="256" stroke="#C6FF3D" strokeWidth="2" opacity="0.9" />
          <line x1="234" y1="256" x2="266" y2="224" stroke="#C6FF3D" strokeWidth="2" opacity="0.9" />
          <circle cx="250" cy="240" r="6" fill="#C6FF3D" />
        </g>
        {/* Wheel Well Arch */}
        <path d="M215 274 Q250 278 285 274" stroke="rgba(0,0,0,0.6)" strokeWidth="4" fill="none" />

        {/* 10. FRONT WHEEL (Center at x=650, y=240) */}
        <g className="front-wheel" style={{ transformOrigin: '650px 240px', transformBox: 'view-box' }}>
          <circle cx="650" cy="240" r="38" fill="#090B10" stroke="#C6FF3D" strokeWidth="2" opacity="0.8" />
          <circle cx="650" cy="240" r="24" fill="none" stroke="#252A3C" strokeWidth="2.5" />
          <circle cx="650" cy="240" r="10" fill="#141724" />
          <line x1="650" y1="218" x2="650" y2="262" stroke="#C6FF3D" strokeWidth="2" opacity="0.9" />
          <line x1="628" y1="240" x2="672" y2="240" stroke="#C6FF3D" strokeWidth="2" opacity="0.9" />
          <line x1="634" y1="224" x2="666" y2="256" stroke="#C6FF3D" strokeWidth="2" opacity="0.9" />
          <line x1="634" y1="256" x2="666" y2="224" stroke="#C6FF3D" strokeWidth="2" opacity="0.9" />
          <circle cx="650" cy="240" r="6" fill="#C6FF3D" />
        </g>
        {/* Wheel Well Arch */}
        <path d="M615 274 Q650 278 685 274" stroke="rgba(0,0,0,0.6)" strokeWidth="4" fill="none" />

      </svg>
    </div>
  )
}

import { useState } from 'react'
import gsap from 'gsap'

export default function Car({ className = '', style = {} }) {
  const [revving, setRevving] = useState(false)

  const handleCarClick = (e) => {
    setRevving(true)
    const carEl = e.currentTarget
    
    // Rev animation: shake + nitro flame burst
    gsap.to(carEl, {
      y: -15,
      rotation: -2,
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
      { scaleX: 0.2, opacity: 0.2 }, 
      { scaleX: 1.8, opacity: 1, duration: 0.4, yoyo: true, repeat: 1, ease: 'power2.out' }
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
          transform: 'scaleX(-1)', // Flip so front faces right (direction of motion)
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

          <linearGradient id="nitroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#C6FF3D" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF3D77" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ground Neon Glow */}
        <g className="car-shadow">
          <ellipse cx="450" cy="258" rx="360" ry="20" fill="url(#shadowGrad)" />
        </g>

        {/* Speed Lines */}
        <g className="speed-lines" opacity="0">
          <rect x="0" y="178" width="200" height="2" rx="1" fill="#C6FF3D" opacity="0.6" />
          <rect x="0" y="188" width="140" height="1.5" rx="0.75" fill="#00F0FF" opacity="0.5" />
          <rect x="0" y="198" width="180" height="1.5" rx="0.75" fill="#4D7CFF" opacity="0.4" />
          <rect x="0" y="205" width="110" height="1" rx="0.5" fill="#C6FF3D" opacity="0.3" />
        </g>

        {/* Nitro Flame Exhaust (Rear at Left in flipped view) */}
        <g className="nitro-flame" style={{ transformOrigin: '810px 222px' }}>
          <path d="M810 220 L920 205 L870 224 L930 226 L810 228 Z" fill="url(#nitroGrad)" opacity={revving ? 0.95 : 0.4} />
          <ellipse cx="820" cy="224" rx="15" ry="6" fill="#00F0FF" opacity="0.9" />
        </g>

        {/* Headlight Beam Projection (Front at Left in SVG -> Right when flipped) */}
        <g className="headlight-cone">
          <polygon points="140,195 -120,130 -140,240 140,205" fill="url(#headlightBeam)" opacity="0.35" />
        </g>

        {/* Road Track Line */}
        <rect x="20" y="252" width="860" height="2" rx="1" fill="rgba(255,255,255,0.08)" />

        {/* Car Body */}
        <g className="car-body">
          {/* Main Chassis */}
          <path d="M140 220 C140 220 160 180 210 165 L290 148 C310 142 340 128 390 120 L500 112 C540 110 580 112 610 118 L680 132 C720 140 750 158 770 175 L800 200 C810 210 812 220 810 230 L160 230 Z" fill="#12141D" stroke="rgba(198,255,61,0.2)" strokeWidth="1" />
          <path d="M300 148 C315 128 350 108 400 100 L520 96 C560 96 590 104 610 118 L680 132 C670 135 640 135 620 130 L510 116 C475 112 440 112 400 116 L320 128 Z" fill="#1E2230" />
          
          {/* Cockpit & Tinted Glass */}
          <path d="M320 148 C330 124 360 106 400 100 L510 96 C545 96 570 106 580 120 L540 132 C520 124 490 118 455 116 L380 118 C355 120 335 130 325 144 Z" fill="#0A0C14" opacity="0.95" />
          <path d="M330 144 C340 122 368 104 408 100 L510 96 C544 96 568 106 578 118 L565 124 C548 112 520 106 490 106 L400 108 C368 110 345 122 336 140 Z" fill="rgba(198,255,61,0.25)" />
          
          {/* Body Accents & Aerodynamic Racing Lines */}
          <line x1="440" y1="108" x2="432" y2="148" stroke="#C6FF3D" strokeWidth="1" opacity="0.4" />
          <line x1="500" y1="106" x2="498" y2="148" stroke="#C6FF3D" strokeWidth="1" opacity="0.4" />
          <path d="M210 190 L780 190" stroke="#C6FF3D" strokeWidth="2" opacity="0.6" />
          <path d="M140 220 C145 212 160 208 180 210 L185 230 L140 230 Z" fill="#0D0F18" />
          <path d="M800 200 C805 208 808 216 808 230 L780 230 L780 220 C790 218 798 210 800 200 Z" fill="#0D0F18" />

          {/* Side Vent LEDs */}
          <rect x="142" y="214" width="20" height="10" rx="2" fill="rgba(198,255,61,0.15)" />
          <rect x="144" y="216" width="4" height="6" rx="1" fill="#C6FF3D" />
          <rect x="150" y="216" width="4" height="6" rx="1" fill="#C6FF3D" />
          <rect x="156" y="216" width="4" height="6" rx="1" fill="#C6FF3D" />
          <rect x="200" y="226" width="490" height="4" rx="2" fill="#090B12" />
        </g>

        {/* Front Headlight (Front of car) */}
        <g className="headlight front-light">
          <ellipse cx="152" cy="200" rx="14" ry="7" fill="#C6FF3D" />
          <ellipse cx="152" cy="200" rx="24" ry="14" fill="#C6FF3D" opacity="0.3" />
          <ellipse cx="152" cy="200" rx="45" ry="22" fill="#C6FF3D" opacity="0.1" />
        </g>

        {/* Rear Taillight */}
        <g className="headlight rear-light">
          <rect x="790" y="195" width="18" height="8" rx="2" fill="#FF3D77" />
          <rect x="784" y="190" width="30" height="18" rx="4" fill="#FF3D77" opacity="0.25" />
        </g>

        {/* Exhaust Pipes */}
        <rect x="790" y="222" width="12" height="5" rx="2.5" fill="#363A4D" />
        <rect x="804" y="222" width="8" height="5" rx="2.5" fill="#363A4D" />

        {/* Front Wheel */}
        <g className="wheel front-wheel" style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}>
          <circle cx="250" cy="240" r="38" fill="#090B10" stroke="#C6FF3D" strokeWidth="2" opacity="0.8" />
          <circle cx="250" cy="240" r="24" fill="none" stroke="#252A3C" strokeWidth="2.5" />
          <circle cx="250" cy="240" r="10" fill="#141724" />
          {[0, 60, 120, 180, 240, 300].map(a => (
            <line key={a} x1="250" y1="240"
              x2={250 + 22 * Math.cos(a * Math.PI / 180)}
              y2={240 + 22 * Math.sin(a * Math.PI / 180)}
              stroke="#C6FF3D" strokeWidth="2" opacity="0.9" />
          ))}
          <circle cx="250" cy="240" r="6" fill="#C6FF3D" />
          <path d="M215 274 Q250 278 285 274" stroke="rgba(0,0,0,0.6)" strokeWidth="4" fill="none" />
        </g>

        {/* Rear Wheel */}
        <g className="wheel rear-wheel" style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}>
          <circle cx="650" cy="240" r="38" fill="#090B10" stroke="#C6FF3D" strokeWidth="2" opacity="0.8" />
          <circle cx="650" cy="240" r="24" fill="none" stroke="#252A3C" strokeWidth="2.5" />
          <circle cx="650" cy="240" r="10" fill="#141724" />
          {[0, 60, 120, 180, 240, 300].map(a => (
            <line key={a} x1="650" y1="240"
              x2={650 + 22 * Math.cos(a * Math.PI / 180)}
              y2={650 + 22 * Math.sin(a * Math.PI / 180)}
              stroke="#C6FF3D" strokeWidth="2" opacity="0.9" />
          ))}
          <circle cx="650" cy="240" r="6" fill="#C6FF3D" />
          <path d="M615 274 Q650 278 685 274" stroke="rgba(0,0,0,0.6)" strokeWidth="4" fill="none" />
        </g>
      </svg>
    </div>
  )
}

// Motion constants – single source of truth for all animation values
export const EASE = {
  outExpo: 'expo.out',
  inOutQuart: 'power4.inOut',
  soft: 'power3.out',
  none: 'none',
}

export const DUR = {
  xs: 0.2,
  s:  0.5,
  m:  0.9,
  l:  1.4,
}

export const STAGGER = {
  text: 0.04,   // per character
  stat: 0.18,   // per stat card
}

// Hero scroll values
export const HERO = {
  scrub: 0.8,
  carStartX: -0.32,        // × innerWidth
  carEndX:    1.12,        // × innerWidth
  wheelRotation: 1440,
  statsParallax: [-40, -70, -100, -60],
  exitStart: 0.85,
}

// Preloader
export const PRELOADER = {
  minDuration:  1800,   // ms
  hardTimeout:  4500,   // ms
  exitDuration: 0.8,
  exitEase:    'power3.inOut',
}

// Lenis Butter-smooth scrolling
export const LENIS = {
  lerp:        0.075,
  smoothWheel: true,
  wheelMultiplier: 0.9,
}

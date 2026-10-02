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
  scrub: 1.1,
  carStartX: -0.32,        // × innerWidth
  carEndX:    1.12,        // × innerWidth
  wheelRotation: 1440,
  statsParallax: [-40, -70, -100, -60],
  exitStart: 0.85,
}

// Preloader
export const PRELOADER = {
  minDuration:  1200,   // ms
  hardTimeout:  4000,   // ms
  exitDuration: 0.9,
  exitEase:    'power4.inOut',
}

// Lenis
export const LENIS = {
  lerp:        0.09,
  smoothWheel: true,
}

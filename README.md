# ITZFIZZ // VELOCITY

> A scroll-driven, cinematic web experience for the Itzfizz Digital Web Development Internship assignment.

[![Deploy to GitHub Pages](https://github.com/YOUR_USERNAME/itzfizz-velocity/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/itzfizz-velocity/actions/workflows/deploy.yml)

**🌐 Live Demo:** [https://YOUR_USERNAME.github.io/itzfizz-velocity/](https://YOUR_USERNAME.github.io/itzfizz-velocity/)

---

## Overview

ITZFIZZ // VELOCITY is a premium, scroll-driven marketing website built to demonstrate cinematic motion design. The hero section features a sports car that travels horizontally across the viewport in perfect sync with scroll position — never on autoplay, always responding to user input.

The experience is modelled after the motion language of high-end creative studios, with smooth inertial scrolling, character-by-character text reveals, velocity-reactive marquees, pinned horizontal showcases, and magnetic interaction buttons.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, Static Export) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v3 + Custom Design Tokens |
| Animation | GSAP 3 + ScrollTrigger |
| Smooth Scroll | Lenis (synced to GSAP ticker) |
| Fonts | Unbounded, Inter, JetBrains Mono (via next/font) |
| Hosting | GitHub Pages (via GitHub Actions) |

---

## How to Run Locally

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/itzfizz-velocity.git
cd itzfizz-velocity

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How Animations are Structured

### 1. Intro Timeline (time-based)

After the preloader exits and dispatches the `preloader:done` event, a single master GSAP timeline plays:

```
preloader:done
  → headline chars stagger in (yPercent 110 → 0, stagger 0.04s)
  → car slides in from left/below
  → sub-headline fades in
  → stat cards appear one by one (stagger 0.18s)
  → numbers count up from 0 to target
  → navbar slides down
  → scroll indicator fades in
```

All within a single `gsap.timeline({ paused: true })` started on the event. This ensures timing is deterministic and controllable.

### 2. Scrubbed Scroll Timeline (progress-based)

A separate `gsap.timeline` is bound to a `ScrollTrigger` on the `.hero-track` (300vh element):

```
p = scroll progress 0..1

p=0.00  → Car at x: -32vw (just off left edge)
p=0.05  → Scroll indicator fades out
p=0.10  → Background glow starts following car
p=0.15  → Stats begin parallax drift (y: -40 to -100px each)
p=0.20  → Each headline .char lights up accent + lifts as car passes
p=0.80  → Speed lines fade out
p=0.85  → Hero content (headline + stats) fades and lifts
p=1.00  → Car at x: +112vw (just off right edge)
```

`scrub: 1.1` provides inertial lag. Lenis provides a second smoothing layer. Together they give the "trailing behind the wheel" feel.

### 3. Section Reveals

All below-the-fold sections use `ScrollTrigger.once: true` entrance animations with `start: "top 85%"` triggered reliably once. The manifesto uses a per-word scrub that lights each word as the section scrolls.

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#07080B` | Page background |
| `--surface` | `#0E1016` | Cards, sections |
| `--ink` | `#F4F5F7` | Primary text |
| `--muted` | `#8A8F9C` | Secondary text |
| `--accent` | `#C6FF3D` | Electric lime highlights |
| `--accent2` | `#4D7CFF` | Secondary glow |

---

## Performance Notes

- **Transform-only animations**: All motion uses `transform` (x, y, rotate, scale) and `opacity` only. No layout properties animated during scroll.
- **Single RAF loop**: Lenis drives GSAP ticker; ScrollTrigger updates on Lenis scroll events. No raw `window.scroll` listeners.
- **Code splitting**: Below-the-fold sections use `next/dynamic` to defer bundle loading.
- **Font subsetting**: Google Fonts are self-hosted via `next/font` with `display: swap`.
- **`will-change: transform`** applied only to the car, headline chars, and moving layers.
- **`invalidateOnRefresh: true`** on all ScrollTriggers with function-based values for correct resize behaviour.
- **Reduced motion**: `gsap.matchMedia` applies a static layout with no scroll bindings when `prefers-reduced-motion: reduce` is set.

### Lighthouse Scores (approximate, after static build)

| Metric | Score |
|--------|-------|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 95 |

*Scores recorded on mobile throttled preset in Chrome DevTools Lighthouse panel.*

---

## Deployment Steps

### Automatic (GitHub Actions)

1. Fork / create a public repository named exactly `itzfizz-velocity`
2. Push this code to the `main` branch
3. Go to **Settings → Pages → Source: GitHub Actions**
4. The workflow in `.github/workflows/deploy.yml` builds and publishes automatically
5. Your live URL will be `https://YOUR_USERNAME.github.io/itzfizz-velocity/`

> **Important:** Update `YOUR_USERNAME` in the badge and live link at the top of this README.

### Manual Build Test

```bash
npm run build   # Creates ./out directory (static HTML/CSS/JS)
npx serve out   # Preview the static export locally
```

---

## Assignment Traceability

| Requirement | Implemented |
|-------------|-------------|
| Hero fills first screen | ✅ `100svh` sticky stage |
| Letter-spaced headline | ✅ `W E L C O M E  I T Z F I Z Z` with `0.5em` spacing, per-char spans |
| Impact statistics | ✅ 4 stat cards with count-up animation |
| Headline staggered entrance | ✅ `yPercent: 110 → 0`, stagger `0.04s` per char |
| Stats animate one by one | ✅ stagger `0.18s`, count-up via GSAP tween |
| Main visual moves with scroll | ✅ Car x: `-32vw → +112vw` scrubbed |
| Easing / interpolation | ✅ `scrub: 1.1` + Lenis `lerp: 0.09` |
| Transform only, no reflow | ✅ Only `x, y, rotation, opacity` animated |
| GSAP + ScrollTrigger | ✅ |
| Next.js (React) + Tailwind | ✅ App Router, TypeScript |
| GitHub Pages hosting | ✅ Static export + Actions workflow |

---

## File Structure

```
itzfizz-velocity/
  app/
    layout.tsx          # Fonts, metadata, providers
    page.tsx            # Section composition
    globals.css         # Design tokens, noise, cursor, reduced-motion
  components/
    Preloader.tsx       # 0–100 counter + clip-path wipe exit
    Navbar.tsx          # Scroll-hide/show, mobile hamburger
    hero/
      Hero.tsx          # Sticky stage + intro + scroll timelines
      Car.tsx           # Original SVG sports car
      Headline.tsx      # Text → .char spans
      StatCard.tsx      # Stat with data-value count-up
    sections/
      Manifesto.tsx     # Per-word scrub reveal
      Showcase.tsx      # Pinned horizontal scroll
      Marquee.tsx       # Velocity-reactive marquee
      Services.tsx      # Hover-expand list
      Cta.tsx           # Magnetic button + footer wordmark
    ui/
      Cursor.tsx        # Custom cursor (fine pointer only)
      MagneticButton.tsx  # GSAP magnetic spring
      SmoothScroll.tsx  # Lenis + GSAP bridge
  lib/
    gsap.ts             # Plugin registration
    motion.ts           # Animation constants
    splitChars.ts       # Text → span utility
    useReducedMotion.ts # Media query hook
  public/
    favicon.svg
    og.png
    .nojekyll           # GitHub Pages fix
  .github/workflows/deploy.yml
```

---

## Credits

Built with ❤️ for the Itzfizz Digital Web Development Internship assignment.
All assets (SVG car, illustrations) are original works created for this project.
Motion design inspired by the velocity-first aesthetic of modern creative studios.

---

*Itzfizz // Velocity — websites that move at the speed of your ambition.*

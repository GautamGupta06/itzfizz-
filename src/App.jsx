import Preloader from '@/components/Preloader.jsx'
import Navbar from '@/components/Navbar.jsx'
import Hero from '@/components/hero/Hero.jsx'
import Manifesto from '@/components/sections/Manifesto.jsx'
import Showcase from '@/components/sections/Showcase.jsx'
import MarqueeSection from '@/components/sections/Marquee.jsx'
import Services from '@/components/sections/Services.jsx'
import Cta from '@/components/sections/Cta.jsx'
import SmoothScroll from '@/components/ui/SmoothScroll.jsx'
import Cursor from '@/components/ui/Cursor.jsx'

export default function App() {
  return (
    <SmoothScroll>
      {/* Custom cursor — desktop only */}
      <Cursor />

      {/* Skip to content */}
      <a href="#hero" className="skip-link">Skip to main content</a>

      {/* Preloader */}
      <Preloader />

      {/* Fixed nav */}
      <Navbar />

      {/* Page sections */}
      <main id="main-content">
        <Hero />
        <Manifesto />
        <Showcase />
        <MarqueeSection />
        <Services />
        <Cta />
      </main>
    </SmoothScroll>
  )
}

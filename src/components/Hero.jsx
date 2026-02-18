import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function Hero() {
  const [videoReady, setVideoReady] = useState(false)

  const scrollToServices = () => {
    const el = document.getElementById('services')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToContact = () => {
    const el = document.getElementById('contact')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero">
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"
        onCanPlay={() => setVideoReady(true)}
        style={{
          opacity: videoReady ? 1 : 0,
          transition: 'opacity 1.2s ease-in-out',
        }}
      >
        <source
          src="https://videos.pexels.com/video-files/4793987/4793987-uhd_2560_1440_25fps.mp4"
          type="video/mp4"
        />
        <source
          src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4"
          type="video/mp4"
        />
      </video>
      <div className="hero-overlay" />

      <div className="hero-content">
        <p className="hero-subtitle">Luxury Travel Redefined</p>
        <h1>Your Passport to Unparalleled Adventure</h1>
        <p className="hero-description">
          Crafting extraordinary journeys to the world's most breathtaking destinations.
          Over 25 years of experience, 120+ countries explored.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={scrollToContact}>
            Start Your Journey
          </button>
          <button className="btn-secondary" onClick={scrollToServices}>
            Explore Services
          </button>
        </div>
      </div>

      <div className="hero-scroll" onClick={scrollToServices} style={{ cursor: 'pointer' }}>
        <span>Discover More</span>
        <ChevronDown size={20} />
      </div>
    </section>
  )
}

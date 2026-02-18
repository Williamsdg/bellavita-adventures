import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const heroImages = [
  {
    src: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=85',
    alt: 'Maldives overwater bungalows',
  },
  {
    src: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&q=85',
    alt: 'Maldives crystal clear water',
  },
  {
    src: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&q=85',
    alt: 'Venice canal Italy',
  },
  {
    src: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=1200&q=85',
    alt: 'Amalfi Coast Italy',
  },
  {
    src: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&q=85',
    alt: 'Paris Eiffel Tower',
  },
  {
    src: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=85',
    alt: 'Santorini Greece',
  },
]

export default function Hero() {
  const [videoReady, setVideoReady] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!isMobile) return
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isMobile])

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
      {isMobile ? (
        <div className="hero-slideshow">
          {heroImages.map((img, index) => (
            <img
              key={index}
              src={img.src}
              alt={img.alt}
              className={`hero-slide ${index === currentImage ? 'active' : ''}`}
            />
          ))}
        </div>
      ) : (
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setVideoReady(true)}
          style={{
            opacity: videoReady ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
          }}
        >
          <source
            src="https://videos.pexels.com/video-files/4069480/4069480-uhd_2560_1440_25fps.mp4"
            type="video/mp4"
          />
          <source
            src="https://videos.pexels.com/video-files/4010941/4010941-uhd_2560_1440_25fps.mp4"
            type="video/mp4"
          />
          <source
            src="https://videos.pexels.com/video-files/2035976/2035976-uhd_2560_1440_24fps.mp4"
            type="video/mp4"
          />
        </video>
      )}
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

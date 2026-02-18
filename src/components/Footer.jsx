import { Link } from 'react-router-dom'
import { Instagram, Facebook } from 'lucide-react'

export default function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="brand-name">BellaVita Adventures</span>
            <p>
              Crafting tailor-made luxury travel experiences that inspire, transform,
              and create lifelong memories. Your journey begins here.
            </p>
            <div className="footer-social">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Navigate</h4>
            <ul>
              <li><a onClick={() => scrollTo('services')} style={{ cursor: 'pointer' }}>Services</a></li>
              <li><a onClick={() => scrollTo('about')} style={{ cursor: 'pointer' }}>About</a></li>
              <li><a onClick={() => scrollTo('faq')} style={{ cursor: 'pointer' }}>FAQ</a></li>
              <li><a onClick={() => scrollTo('contact')} style={{ cursor: 'pointer' }}>Contact</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><a>Luxury Escapes</a></li>
              <li><a>Cultural Immersion</a></li>
              <li><a>Bespoke Journeys</a></li>
              <li><a>Cruise Planning</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a>Gadsden, Alabama</a></li>
              <li><a href="tel:2563932518">256.393.2518</a></li>
              <li><a href="mailto:mark@bellavitaadventures.com">mark@bellavitaadventures.com</a></li>
              <li><Link to="/portal">Owner Portal</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} BellaVita Adventures. All rights reserved.</p>
          <p>Gadsden, Alabama</p>
        </div>
      </div>
    </footer>
  )
}

export default function Intro() {
  return (
    <section className="section intro-section" id="about">
      <div className="container">
        <div className="intro-grid">
          <div className="intro-image">
            <img
              src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80"
              alt="Venice canal with gondola"
            />
            <div className="intro-image-accent" />
          </div>

          <div className="intro-content">
            <span className="section-label">Welcome to BellaVita</span>
            <h2>Embark on a Journey of Luxury & Elegance</h2>
            <p>
              We specialize in crafting tailor-made travel experiences that inspire and transform.
              From the sun-drenched coastlines of Italy to the savannas of Africa, every journey
              is designed with meticulous attention to detail.
            </p>
            <p>
              Led by a former Seabourn Cruise Director with 25+ years of expertise, BellaVita
              Adventures brings unparalleled knowledge and authentic cultural immersion to every
              trip we curate.
            </p>

            <div className="intro-stats">
              <div className="intro-stat">
                <h3>120+</h3>
                <p>Countries Explored</p>
              </div>
              <div className="intro-stat">
                <h3>25+</h3>
                <p>Years Experience</p>
              </div>
              <div className="intro-stat">
                <h3>500+</h3>
                <p>Happy Travelers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

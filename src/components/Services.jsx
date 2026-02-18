export default function Services() {
  const services = [
    {
      title: 'Luxury Escapes',
      description: 'Indulge in exquisite accommodations, personalized service, and unforgettable experiences at the world\'s finest resorts.',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    },
    {
      title: 'Cultural Immersion',
      description: 'Connect authentically with local traditions, cuisine, and communities for travel experiences that go beyond the surface.',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
    },
    {
      title: 'Bespoke Journeys',
      description: 'Every detail customized to your desires — from private tours and exclusive access to curated dining experiences.',
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
    },
  ]

  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-header">
          <span className="section-label">What We Offer</span>
          <h2 className="section-title">Extraordinary Experiences Await</h2>
          <p className="section-description">
            Whether you seek relaxation, adventure, or cultural discovery, we design journeys
            that exceed every expectation.
          </p>
          <div className="section-divider" />
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <img src={service.image} alt={service.title} />
              <div className="service-card-overlay">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

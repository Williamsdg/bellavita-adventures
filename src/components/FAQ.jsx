import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'How does the booking process work?',
    answer: 'We start with a complimentary consultation to understand your travel vision. From there, we craft a personalized itinerary, handle all bookings and logistics, and provide 24/7 support throughout your journey.',
  },
  {
    question: 'What sets BellaVita Adventures apart from other travel agencies?',
    answer: 'With 25+ years of experience and 120+ countries explored, our founder brings unmatched first-hand knowledge. As a former Seabourn Cruise Director, Mark offers insider access and relationships that translate to exclusive experiences for our clients.',
  },
  {
    question: 'Can you customize trips to my specific interests and budget?',
    answer: 'Absolutely. Every journey we create is fully bespoke. Whether you\'re dreaming of a romantic getaway, family adventure, or once-in-a-lifetime expedition, we tailor every detail to your preferences and budget. Luxury travel doesn\'t have to be extravagant.',
  },
  {
    question: 'What destinations do you specialize in?',
    answer: 'While we can plan travel to virtually anywhere in the world, we have particular expertise in European destinations (especially Italy), cruises, African safaris, and luxury beach resorts across the Caribbean and Mediterranean.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Questions & Answers</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="section-divider" />
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div className="faq-item" key={index}>
              <button
                className={`faq-question ${openIndex === index ? 'active' : ''}`}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                {faq.question}
                <ChevronDown size={20} />
              </button>
              <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

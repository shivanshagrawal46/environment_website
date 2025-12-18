import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import '../../styles/Partners.css';

const fallbackTestimonials = [
  {
    quote: "PCB Foundation transformed our sustainability approach with measurable, authentic impact.",
    author: "Jennifer Lee",
    position: "CSO, Global Tech Corp",
    company: "Fortune 500",
  },
  {
    quote: "The transparency and professionalism exceeded our expectations. A true partner.",
    author: "Robert Martinez",
    position: "VP Sustainability, Energy Group",
    company: "Industry Leader",
  },
  {
    quote: "Our ESG ratings improved significantly thanks to PCB Foundation's strategic programs.",
    author: "Lisa Anderson",
    position: "Head of ESG, Financial Services",
    company: "Global Bank",
  },
];

const Partners = () => {
  const [reviews, setReviews] = useState(fallbackTestimonials);
  const API_URL = 'https://www.pcbfoundation.com/api';

  const normalizedReviews = useMemo(() => {
    if (!Array.isArray(reviews)) return fallbackTestimonials;
    const list = reviews.slice(0, 3).map((item) => ({
      quote: item.review || item.quote,
      author: item.reviewerName || item.author || 'Anonymous',
      position: item.reviewerCompany || item.position || '',
      company: item.tagName || item.company || 'Partner',
    }));
    return list.length ? list : fallbackTestimonials;
  }, [reviews]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/reviews`);
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const data = await res.json();
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        if (list.length) setReviews(list);
      } catch (err) {
        console.error('Reviews fetch failed, using fallback:', err.message);
        setReviews(fallbackTestimonials);
      }
    };
    fetchReviews();
  }, [API_URL]);

  return (
    <section className="partners" id="partners">
      <motion.div
        className="partners-header"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.6, 0.05, 0.01, 0.9] }}
        viewport={{ once: false, margin: "-100px" }}
      >
        <motion.span 
          className="section-label"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: false }}
        >
          Trusted By
        </motion.span>
        <h2 className="section-title">Leading corporations worldwide</h2>
        <p className="partners-subtitle">
          Join 850+ companies making a real difference
        </p>
      </motion.div>

      <div className="testimonials-grid">
        {normalizedReviews.map((testimonial, index) => (
          <motion.div
            key={testimonial.author + index}
            className="testimonial-card"
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.15,
              ease: [0.6, 0.05, 0.01, 0.9]
            }}
            viewport={{ once: false, margin: "-80px" }}
            whileHover={{ scale: 1.03, y: -10 }}
          >
            <div className="quote-mark">"</div>
            <p className="testimonial-quote">{testimonial.quote}</p>
            <div className="testimonial-author">
              <strong>{testimonial.author}</strong>
              <span>{testimonial.position}</span>
              <span className="company-badge">{testimonial.company}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="partnership-cta-section"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9] }}
        viewport={{ once: false, margin: "-100px" }}
        id="partner"
      >
        <div className="partnership-content">
          <motion.div 
            className="partnership-text"
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9] }}
            viewport={{ once: false, margin: "-100px" }}
          >
            <motion.span 
              className="section-label"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: false }}
            >
              Partner With Us
            </motion.span>
            <h2 className="section-title">
              Transform your environmental
              <br />
              <span className="text-accent">commitment into legacy</span>
            </h2>
            <p className="partnership-description">
              Join leading corporations in creating authentic, measurable 
              environmental impact. Our partnership model ensures transparency, 
              credibility, and results that resonate with stakeholders.
            </p>
            <div className="partnership-features">
              {['Dedicated account management', 'Real-time impact dashboard', 'Quarterly impact reports', 'Custom ESG integration'].map((feature, i) => (
                <motion.div 
                  key={i}
                  className="feature-item"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + (i * 0.1) }}
                  viewport={{ once: false }}
                  whileHover={{ x: 10 }}
                >
                  <span className="feature-check">✓</span>
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
            <motion.button 
              className="cta-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Schedule Consultation
            </motion.button>
          </motion.div>

          <motion.div
            className="partnership-visual"
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.6, 0.05, 0.01, 0.9] }}
            viewport={{ once: false, margin: "-100px" }}
          >
            {/* <motion.img 
              src="/images/character.png" 
              alt="Environmental steward" 
              className="character-img"
              initial={{ scale: 1.1, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2 }}
              viewport={{ once: false }}
            /> */}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Partners;


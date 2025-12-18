import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { aboutPageData } from '../../data/teamData';
import '../../styles/About.css';

const About = () => {
  const navigate = useNavigate();
  const [about, setAbout] = useState(aboutPageData);
  const API_URL = 'https://www.pcbfoundation.com/api';

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch(`${API_URL}/about`);
        if (!res.ok) throw new Error('Failed to fetch about');
        const data = await res.json();
        if (data) {
          setAbout(data);
        }
      } catch (err) {
        console.error('About section fetch failed, using fallback:', err.message);
        setAbout(aboutPageData);
      }
    };
    fetchAbout();
  }, [API_URL]);

  return (
    <section className="about" id="about">
      <div className="about-grid">
        <motion.div 
          className="about-text"
          initial={{ opacity: 0, x: -80, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
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
            Our Purpose
          </motion.span>
          <motion.h2 
            className="section-title"
            initial={{ backgroundPosition: '100% 50%' }}
            whileInView={{ backgroundPosition: '0% 50%' }}
            transition={{ duration: 3.5, ease: [0.6, 0.05, 0.01, 0.9], delay: 0.3 }}
            viewport={{ once: false }}
            style={{
              backgroundImage: 'linear-gradient(90deg, #2d2d2d 0%, #2d2d2d 50%, #bbb 50%, #bbb 100%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent'
            }}
          >
            {/* We bridge the gap between
            <br />
            corporate responsibility and
            <br /> */}
            Turning Responsibility into
            <motion.span 
              className="text-accent-animated"
              initial={{ backgroundPosition: '100% 50%' }}
              whileInView={{ backgroundPosition: '0% 50%' }}
              transition={{ duration: 3.5, ease: [0.6, 0.05, 0.01, 0.9], delay: 0.5 }}
              viewport={{ once: false }}
              style={{
                backgroundImage: 'linear-gradient(90deg, #4a6741 0%, #4a6741 50%, #bbb 50%, #bbb 100%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              {/* environmental preservation */}
              Real Impact
            
            </motion.span>
          </motion.h2>
          <p className="about-description">
          We work with organisations to translate sustainability commitments into on-ground environmental action.
          <br/>Our approach combines legal accountability, field execution, and transparent impact measurement ensuring ESG initiatives are credible, compliant, and effective.
          </p>
          <div className="about-cta-row">
            <motion.button 
              className="cta-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/about-us')}
            >
              Learn More About Us
            </motion.button>
          </div>
          <div className="about-features">
            <motion.div 
              className="feature-box"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: false }}
            >
              <h3>Mission</h3>
              <p>{about.mission || aboutPageData.mission}</p>
            </motion.div>
            <motion.div 
              className="feature-box"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: false }}
            >
              <h3>Vision</h3>
              <p>{about.vision || aboutPageData.vision}</p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="about-image-container"
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9], delay: 0.2 }}
          viewport={{ once: false, margin: "-100px" }}
        >
          <img src="/images/download1.png" alt="Sustainability" className="about-image" />
        </motion.div>
      </div>
    </section>
  );
};

export default About;


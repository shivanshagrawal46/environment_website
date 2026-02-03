import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/Footer.css';

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 500px
      if (window.scrollY > 500) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/images/logo_pcb.png" alt="PCB Foundation" className="footer-logo-image" />
            <h3>PCB Foundation</h3>
          </div>
          <p>Preserving tomorrow, today</p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4>Organization</h4>
            <a onClick={() => navigate('/about-us')} style={{ cursor: 'pointer' }}>About Us</a>
            <a onClick={() => navigate('/team')} style={{ cursor: 'pointer' }}>Our Team</a>
            <a onClick={() => scrollToSection('contact')} style={{ cursor: 'pointer' }}>Contact</a>
          </div>

          <div className="footer-column">
            <h4>Programs</h4>
            <a onClick={() => navigate('/projects')} style={{ cursor: 'pointer' }}>Projects</a>
            <a onClick={() => navigate('/blogs')} style={{ cursor: 'pointer' }}>Blogs</a>
            <a onClick={() => scrollToSection('partner')} style={{ cursor: 'pointer' }}>Partnerships</a>
          </div>

          <div className="footer-column">
            <h4>Get Involved</h4>
            <a onClick={() => scrollToSection('donate')} style={{ cursor: 'pointer' }}>Donate</a>
            <a onClick={() => scrollToSection('partner')} style={{ cursor: 'pointer' }}>Partner With Us</a>
            <a onClick={() => scrollToSection('contact')} style={{ cursor: 'pointer' }}>Contact Us</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 PCB Foundation. All rights reserved.</p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            className="back-to-top"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;


import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/Footer.css';

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

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

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/images/logo_pcb.png" alt="PCB Foundation" className="footer-logo-image" />
            <h3>PCB Foundation</h3>
          </div>
          <p>Preserving tomorrow, today</p>
          <div className="footer-social">
            <a href="#" aria-label="LinkedIn">LinkedIn</a>
            <a href="#" aria-label="Twitter">Twitter</a>
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="Facebook">Facebook</a>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4>Organization</h4>
            <a href="#about">About Us</a>
            <a href="#team">Our Team</a>
            <a href="#news">News</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-column">
            <h4>Programs</h4>
            <a href="#projects">Projects</a>
            <a href="#initiatives">Initiatives</a>
            <a href="#impact">Impact Reports</a>
            <a href="#partner">Partnerships</a>
          </div>

          <div className="footer-column">
            <h4>Get Involved</h4>
            <a href="#donate">Donate</a>
            <a href="#partner">Partner With Us</a>
            <a href="#">Volunteer</a>
            <a href="#">Corporate Programs</a>
          </div>

          <div className="footer-column">
            <h4>Resources</h4>
            <a href="#">Documentation</a>
            <a href="#">Research Papers</a>
            <a href="#">Annual Reports</a>
            <a href="#">Media Kit</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 PCB Foundation. All rights reserved.</p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
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


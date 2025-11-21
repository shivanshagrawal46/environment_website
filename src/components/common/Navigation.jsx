import { useState } from 'react';
import { motion } from 'framer-motion';
import '../../styles/Navigation.css';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <motion.nav 
      className="nav"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div 
        className="logo"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        TERRA
      </motion.div>

      <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <a onClick={() => scrollToSection('about')}>About</a>
        <a onClick={() => scrollToSection('projects')}>Projects</a>
        <a onClick={() => scrollToSection('impact')}>Impact</a>
        <a onClick={() => scrollToSection('initiatives')}>Initiatives</a>
        <a onClick={() => scrollToSection('team')}>Team</a>
        <a onClick={() => scrollToSection('donate')}>Donate</a>
        <a onClick={() => scrollToSection('contact')}>Contact</a>
      </div>

      <div className="nav-actions">
        <motion.button 
          className="cta-nav"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => scrollToSection('partner')}
        >
          Partner With Us
        </motion.button>

        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </motion.nav>
  );
};

export default Navigation;


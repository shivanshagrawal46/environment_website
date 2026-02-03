import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/Navigation.css';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const scrollToSection = (id) => {
    if (isHomePage) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      setIsMenuOpen(false);
    }
  };

  const handleLogoClick = () => {
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const handleProjectsClick = () => {
    navigate('/projects');
    setIsMenuOpen(false);
  };

  const handleCarbonClick = () => {
    navigate('/carbon-calculator');
    setIsMenuOpen(false);
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
        onClick={handleLogoClick}
      >
        <img src="/images/logo_pcb.png" alt="PCB Foundation" className="logo-image" />
        <span className="logo-text">PCB Foundation</span>
      </motion.div>

      <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <a onClick={() => navigate('/about-us')}>About Us</a>
        <a onClick={handleProjectsClick}>Projects</a>
        <a onClick={() => navigate('/blogs')}>Blogs</a>
        <a onClick={handleCarbonClick}>Carbon Calculator</a>
        <a onClick={() => { navigate('/team'); setIsMenuOpen(false); }}>Team</a>
        <a onClick={() => scrollToSection('contact')}>Join Our Mission</a>
        {/* <a onClick={() => scrollToSection('contact')}>Contact</a> */}
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


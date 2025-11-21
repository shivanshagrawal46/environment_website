import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import '../../styles/Hero.css';

const Hero = () => {
  const { heroOpacity, heroScale } = useScrollAnimation();

  return (
    <motion.section 
      className="hero"
      style={{ opacity: heroOpacity, scale: heroScale }}
    >
      <div className="hero-video-container">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="hero-video"
        >
          <source src="/videos/nature-video-1 (1).mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content">
        <div className="hero-text-container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1 className="hero-title">
              Preserving Tomorrow,
              <br />
              <span className="hero-title-accent">Today</span>
            </h1>
          </motion.div>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Leading corporations toward a sustainable future through
            <br />authentic environmental action and measurable impact
          </motion.p>
        </div>

        <motion.div
          className="hero-scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="scroll-line"></div>
          <span>Scroll to explore</span>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;


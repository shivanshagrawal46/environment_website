import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState('particles'); // particles -> logo -> exit

  // Generate random particles
  const particles = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      initialX: Math.random() * 100 - 50,
      initialY: Math.random() * 100 - 50,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 0.5,
      duration: 1 + Math.random() * 0.5,
    }));
  }, []);

  // Generate floating dots for ambient effect
  const floatingDots = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }));
  }, []);

  useEffect(() => {
    // Phase 1: Particles converge (0-1.5s)
    const logoTimer = setTimeout(() => {
      setPhase('logo');
    }, 1200);

    // Phase 2: Show logo, then exit (3.7s total)
    const exitTimer = setTimeout(() => {
      setShow(false);
      setTimeout(() => {
        onComplete();
      }, 600);
    }, 3700);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }}
        >
          {/* Ambient floating dots */}
          <div className="splash-ambient">
            {floatingDots.map((dot) => (
              <motion.div
                key={`ambient-${dot.id}`}
                className="ambient-dot"
                style={{
                  left: `${dot.x}%`,
                  top: `${dot.y}%`,
                  width: dot.size,
                  height: dot.size,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.6, 0.3, 0.6, 0],
                  scale: [0, 1, 1.2, 1, 0],
                  y: [0, -20, -10, -30, -20],
                }}
                transition={{
                  duration: dot.duration,
                  delay: dot.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="splash-content">
            {/* Converging particles */}
            <div className="particles-container">
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="splash-particle"
                  style={{
                    width: particle.size,
                    height: particle.size,
                  }}
                  initial={{ 
                    x: particle.initialX * 8,
                    y: particle.initialY * 8,
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{ 
                    x: 0,
                    y: 0,
                    opacity: phase === 'logo' ? 0 : [0, 1, 1, 0.8],
                    scale: phase === 'logo' ? 0 : [0, 1.5, 1, 0.5],
                  }}
                  transition={{
                    duration: particle.duration,
                    delay: particle.delay,
                    ease: [0.6, 0.05, 0.01, 0.9],
                  }}
                />
              ))}
            </div>

            {/* Logo with elegant reveal */}
            <motion.div
              className="splash-logo-container"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: phase === 'logo' ? 1 : 0.9,
                opacity: phase === 'logo' ? 1 : 0,
              }}
              transition={{ 
                duration: 0.8, 
                delay: phase === 'logo' ? 0 : 0.5,
                ease: [0.6, 0.05, 0.01, 0.9] 
              }}
            >
              {/* Inner glow */}
              <motion.div 
                className="logo-inner-glow"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: phase === 'logo' ? [0, 0.8, 0.4] : 0,
                }}
                transition={{ 
                  duration: 1.2, 
                  ease: "easeOut",
                }}
              />

              <motion.img 
                src="/images/logo_pcb.png" 
                alt="PCB Foundation"
                className="splash-logo"
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ 
                  opacity: phase === 'logo' ? 1 : 0,
                  scale: phase === 'logo' ? 1 : 0.5,
                  rotate: 0,
                }}
                transition={{ 
                  duration: 0.8,
                  ease: [0.6, 0.05, 0.01, 0.9],
                }}
              />
            </motion.div>

            {/* Subtle tagline */}
            <motion.p
              className="splash-tagline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: phase === 'logo' ? 1 : 0,
                y: phase === 'logo' ? 0 : 20,
              }}
              transition={{ 
                duration: 0.6, 
                delay: phase === 'logo' ? 0.4 : 0,
                ease: "easeOut" 
              }}
            >
              Preserving Tomorrow, Today
            </motion.p>

            {/* Elegant loading dots */}
            <motion.div
              className="splash-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'logo' ? 1 : 0 }}
              transition={{ delay: 0.6 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="loading-dot"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;


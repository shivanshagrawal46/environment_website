import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useInView } from '../../hooks/useInView';
import { impactStats } from '../../data/impactData';
import '../../styles/Impact.css';

const AnimatedNumber = ({ value, delay }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const { ref, isInView } = useInView({ once: false });

  useEffect(() => {
    if (isInView) {
      // Extract number from string like "2.4M", "850+", "98%", etc.
      const numericValue = parseFloat(value.replace(/[^\d.]/g, ''));
      const suffix = value.replace(/[\d.]/g, '');
      const hasDecimal = value.includes('.');
      
      const timer = setTimeout(() => {
        let start = 0;
        const duration = 3500; // 3.5 seconds
        const startTime = Date.now();
        
        const updateNumber = () => {
          const now = Date.now();
          const progress = Math.min((now - startTime) / duration, 1);
          
          // Easing function
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = start + (numericValue - start) * easeOut;
          
          if (hasDecimal) {
            setDisplayValue(current.toFixed(1) + suffix);
          } else {
            setDisplayValue(Math.floor(current) + suffix);
          }
          
          if (progress < 1) {
            requestAnimationFrame(updateNumber);
          }
        };
        
        updateNumber();
      }, delay * 1000);
      
      return () => clearTimeout(timer);
    } else {
      setDisplayValue('0');
    }
  }, [isInView, value, delay]);

  return <span ref={ref}>{displayValue}</span>;
};

const ImpactCard = ({ stat, delay }) => {
  return (
    <motion.div
      className="impact-card"
      initial={{ opacity: 0, y: 60, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.6, 0.05, 0.01, 0.9]
      }}
      viewport={{ once: false, margin: "-100px" }}
      whileHover={{ scale: 1.05, y: -10 }}
    >
      <motion.div
        className="impact-icon"
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        transition={{ 
          duration: 1, 
          delay: delay + 0.2,
          ease: [0.6, 0.05, 0.01, 0.9]
        }}
        viewport={{ once: false }}
      >
        {stat.icon}
      </motion.div>
      <motion.h3 
        className="impact-number"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 1, 
          delay: delay + 0.3,
          ease: [0.6, 0.05, 0.01, 0.9]
        }}
        viewport={{ once: false }}
      >
        <AnimatedNumber value={stat.number} delay={delay + 0.3} />
      </motion.h3>
      <motion.p 
        className="impact-label"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: delay + 0.4 }}
        viewport={{ once: false }}
      >
        {stat.label}
      </motion.p>
    </motion.div>
  );
};

const Impact = () => {
  return (
    <section className="impact" id="impact">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.6, 0.05, 0.01, 0.9] }}
        viewport={{ once: false, margin: "-100px" }}
        className="impact-header"
      >
        <motion.span 
          className="section-label"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: false }}
        >
          Measurable Impact
        </motion.span>
        <h2 className="section-title">Numbers that matter</h2>
        <p className="impact-subtitle">
          Real data, real impact, real change
        </p>
      </motion.div>

      <div className="impact-grid">
        {impactStats.map((stat, index) => (
          <ImpactCard 
            key={index}
            stat={stat} 
            delay={index * 0.1} 
          />
        ))}
      </div>
    </section>
  );
};

export default Impact;


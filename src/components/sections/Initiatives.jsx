import { motion } from 'framer-motion';
import { initiatives } from '../../data/impactData';
import '../../styles/Initiatives.css';

const InitiativeCard = ({ initiative, delay }) => {
  return (
    <motion.div
      className="initiative-card"
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -15, scale: 1.02 }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.6, 0.05, 0.01, 0.9]
      }}
      viewport={{ once: false, margin: "-80px" }}
    >
      <div className="initiative-image">
        <img src={initiative.image} alt={initiative.title} />
      </div>
      <div className="initiative-content">
        <h3>{initiative.title}</h3>
        <p>{initiative.description}</p>
        <motion.div 
          className="initiative-arrow"
          whileHover={{ x: 5 }}
        >
          →
        </motion.div>
      </div>
    </motion.div>
  );
};

const Initiatives = () => {
  return (
    <section className="initiatives" id="initiatives">
      <motion.div
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
          What We Do
        </motion.span>
        <h2 className="section-title">Strategic environmental initiatives</h2>
        <p className="initiatives-subtitle">
          Comprehensive programs designed for corporate sustainability
        </p>
      </motion.div>

      <div className="initiatives-grid">
        {initiatives.map((initiative, index) => (
          <InitiativeCard 
            key={initiative.id}
            initiative={initiative}
            delay={index * 0.1}
          />
        ))}
      </div>
    </section>
  );
};

export default Initiatives;


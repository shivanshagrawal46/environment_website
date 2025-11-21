import { motion } from 'framer-motion';
import '../../styles/VisualStory.css';

const VisualStory = () => {
  return (
    <section className="visual-story">
      <motion.div
        className="story-header"
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
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
          Forest Conservation
        </motion.span>
        <h2 className="section-title">Protecting our planet's lungs</h2>
        <p className="story-subtitle">
          From ancient forests to mountain ecosystems, we're preserving nature's most vital landscapes
        </p>
      </motion.div>

      <div className="story-container">
        <motion.div 
          className="story-block story-left"
          initial={{ opacity: 0, x: -120, scale: 0.9 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9] }}
          viewport={{ once: false, margin: "-100px" }}
        >
          <motion.img 
            src="/images/forest-path.png" 
            alt="Forest preservation"
            initial={{ scale: 1.2, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.6, 0.05, 0.01, 0.9] }}
            viewport={{ once: false }}
          />
          <div className="story-text">
            <h3>Ancient Forest Protection</h3>
            <p>Safeguarding biodiversity hotspots and irreplaceable ecosystems for future generations</p>
          </div>
        </motion.div>

        <motion.div 
          className="story-block story-right"
          initial={{ opacity: 0, x: 120, scale: 0.9 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9] }}
          viewport={{ once: false, margin: "-100px" }}
        >
          <div className="story-text">
            <h3>Mountain Ecosystems</h3>
            <p>Preserving pristine alpine landscapes and critical water sources</p>
          </div>
          <motion.img 
            src="/images/hero-mountain.png" 
            alt="Mountain landscape"
            initial={{ scale: 1.2, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.6, 0.05, 0.01, 0.9] }}
            viewport={{ once: false }}
          />
        </motion.div>

        <motion.div 
          className="story-block story-left"
          initial={{ opacity: 0, x: -120, scale: 0.9 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9] }}
          viewport={{ once: false, margin: "-100px" }}
        >
          <motion.img 
            src="/images/lake-mountain.png" 
            alt="Lake and mountains"
            initial={{ scale: 1.2, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.6, 0.05, 0.01, 0.9] }}
            viewport={{ once: false }}
          />
          <div className="story-text">
            <h3>Freshwater Conservation</h3>
            <p>Protecting vital watersheds and ensuring clean water for communities</p>
          </div>
        </motion.div>
      </div>

      {/* Video Section */}
      <motion.div 
        className="video-container-full"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.6, 0.05, 0.01, 0.9] }}
        viewport={{ once: false, margin: "-100px" }}
      >
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="full-video"
        >
          <source src="/videos/nature-video-2 (1).mp4" type="video/mp4" />
        </video>
        <div className="video-overlay-text">
          <h2>Every action creates ripples of change</h2>
        </div>
      </motion.div>
    </section>
  );
};

export default VisualStory;


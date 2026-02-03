import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import '../../styles/VisualStory.css';

const VisualStory = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          videoRef.current.muted = true;
          await videoRef.current.play();
        } catch (error) {
          console.log("Video autoplay prevented:", error);
          // Retry on user interaction
          document.addEventListener('touchstart', () => {
            videoRef.current?.play();
          }, { once: true });
        }
      }
    };

    // Play when video comes into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current?.paused) {
            playVideo();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

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
          Community Engagement
        </motion.span>
        <h2 className="section-title">Empowering people to foster a culture of sustainability</h2>
        <p className="story-subtitle">
          Preserving nature's most vital landscapes with science, community, and care
        </p>
      </motion.div>

      {/* Video Section */}
      <motion.div 
        className="video-container-full"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.6, 0.05, 0.01, 0.9] }}
        viewport={{ once: false, margin: "-100px" }}
      >
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          className="full-video"
          webkit-playsinline="true"
          x-webkit-airplay="allow"
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


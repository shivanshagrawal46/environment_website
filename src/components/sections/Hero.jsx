import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import '../../styles/Hero.css';

const Hero = () => {
  const { heroOpacity, heroScale } = useScrollAnimation();
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    // Add preload link to HTML head for fastest loading
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'video';
    preloadLink.href = '/videos/nature-video-1 (1).mp4';
    preloadLink.type = 'video/mp4';
    document.head.appendChild(preloadLink);

    const video = videoRef.current;
    if (!video) return;

    // Aggressive preload setup
    video.muted = true;
    video.playsInline = true;
    video.load(); // Force immediate load

    // Track when video is ready
    const handleCanPlay = () => {
      setIsVideoReady(true);
    };

    video.addEventListener('canplay', handleCanPlay);

    // Cleanup
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      // Remove preload link on unmount
      const existingPreload = document.querySelector('link[rel="preload"][as="video"]');
      if (existingPreload) {
        existingPreload.remove();
      }
    };
  }, []);

  // Auto-play when ready
  useEffect(() => {
    const playVideo = async () => {
      const video = videoRef.current;
      if (!video || !isVideoReady) return;

      try {
        await video.play();
      } catch (error) {
        console.log("Video autoplay prevented:", error);
        
        // Retry on any user interaction
        const attemptPlay = () => {
          video.play().catch(() => {});
        };

        document.addEventListener('click', attemptPlay, { once: true });
        document.addEventListener('touchstart', attemptPlay, { once: true });
      }
    };

    playVideo();
  }, [isVideoReady]);

  // Handle visibility change (when tab becomes active)
  useEffect(() => {
    const handleVisibilityChange = () => {
      const video = videoRef.current;
      if (!video) return;

      if (!document.hidden && video.paused && isVideoReady) {
        video.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isVideoReady]);

  return (
    <motion.section 
      className="hero"
      style={{ opacity: heroOpacity, scale: heroScale }}
    >
      <div className="hero-video-container">
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          className="hero-video"
          webkit-playsinline="true"
          x-webkit-airplay="allow"
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
            We design and implement environmental solutions that help institutions, 
            <br /> communities, and landowners recreate measurable ecological impact.
            <br /> Grounded in law, science, and accountability.
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
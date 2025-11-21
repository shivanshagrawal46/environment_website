import { useScroll, useTransform } from 'framer-motion';

export const useScrollAnimation = () => {
  const { scrollYProgress } = useScroll();
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  
  return {
    scrollYProgress,
    heroOpacity,
    heroScale,
    parallaxY
  };
};


import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 220, damping: 30, mass: 0.4 });
  return (
    <motion.div
      style={{ scaleX: width, transformOrigin: '0% 50%' }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 bg-brand-gradient"
      aria-hidden="true"
    />
  );
}

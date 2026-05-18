import { animate, useMotionValue, useTransform, motion } from 'framer-motion';
import { useEffect } from 'react';

interface Props {
  value: number;
  duration?: number;
  className?: string;
  format?: (n: number) => string;
}

export function AnimatedNumber({ value, duration = 0.9, className, format }: Props) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (latest) => {
    const n = Math.round(latest);
    return format ? format(n) : n.toLocaleString();
  });

  useEffect(() => {
    const controls = animate(mv, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [value, duration, mv]);

  return <motion.span className={className}>{rounded}</motion.span>;
}

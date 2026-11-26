import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { usePrint } from '../lib/mode';

type Props = { children: ReactNode; delay?: number; y?: number; className?: string } & Omit<HTMLMotionProps<'div'>, 'children'>;

/** Entrada sincronizada: aparece desde un estado ya legible (opacidad parcial), nunca desde 0. */
export function Reveal({ children, delay = 0, y = 18, className, ...rest }: Props) {
  const print = usePrint();
  if (print) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.001, y, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

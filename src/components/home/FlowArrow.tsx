import React from 'react';
import { motion } from 'framer-motion';
import styles from './home.module.css';

interface FlowArrowProps {
  isActive: boolean;
  direction?: 'horizontal' | 'vertical';
}

export default function FlowArrow({
  isActive,
  direction = 'horizontal',
}: FlowArrowProps): JSX.Element {
  return (
    <div className={`${styles.arrowWrapper} ${styles[direction]}`} data-active={isActive}>
      <motion.div
        className={styles.arrow}
        animate={
          isActive
            ? {
                x: direction === 'horizontal' ? [0, 10, 0] : 0,
                y: direction === 'vertical' ? [0, 10, 0] : 0,
              }
            : {}
        }
        transition={{
          duration: 1,
          repeat: isActive ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        {direction === 'horizontal' ? '→' : '↓'}
      </motion.div>
    </div>
  );
}

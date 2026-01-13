import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './home.module.css';

interface Stage {
  id: string;
  label: string;
  icon: string;
  description: string;
  detail: string;
}

interface OpenSpecNodeProps {
  stage: Stage;
  isActive: boolean;
  isPaused: boolean;
  onHover: () => void;
  onLeave: () => void;
}

export default function OpenSpecNode({
  stage,
  isActive,
  isPaused,
  onHover,
  onLeave,
}: OpenSpecNodeProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onLeave();
  };

  return (
    <div className={styles.nodeWrapper}>
      <motion.div
        className={styles.node}
        data-active={isActive}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{
          y: -5,
          scale: 1.05,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 17,
        }}
      >
        <motion.div
          className={styles.nodeIcon}
          animate={
            isActive
              ? {
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1],
                }
              : {}
          }
          transition={{
            duration: 1,
            repeat: isActive ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          {stage.icon}
        </motion.div>
        <div className={styles.nodeLabel}>{stage.label}</div>
        <div className={styles.nodeDescription}>{stage.description}</div>
        {(isHovered || isPaused) && (
          <motion.div
            className={styles.nodeDetail}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
          >
            {stage.detail}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

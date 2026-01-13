import React from 'react';
import { motion } from 'framer-motion';
import styles from './home.module.css';

interface Screenshot {
  src: string;
  alt: string;
  title: string;
  description: string;
}

interface ScreenshotCardProps {
  screenshot: Screenshot;
}

function ScreenshotCard({ screenshot }: ScreenshotCardProps): JSX.Element {
  return (
    <motion.div
      className={styles.screenshotCard}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.screenshotImageWrapper}>
        <img
          src={screenshot.src}
          alt={screenshot.alt}
          loading="lazy"
          className={styles.screenshotImage}
        />
      </div>
      <div className={styles.screenshotInfo}>
        <h3 className={styles.screenshotTitle}>{screenshot.title}</h3>
        <p className={styles.screenshotDescription}>{screenshot.description}</p>
      </div>
    </motion.div>
  );
}

interface ScreenshotGalleryProps {
  screenshots: Screenshot[];
}

export default function ScreenshotGallery({
  screenshots,
}: ScreenshotGalleryProps): JSX.Element {
  return (
    <div className={styles.screenshotGallery}>
      {screenshots.map((screenshot) => (
        <ScreenshotCard key={screenshot.src} screenshot={screenshot} />
      ))}
    </div>
  );
}

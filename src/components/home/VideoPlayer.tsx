import React, { useRef, useState, useEffect } from 'react';
import styles from './videoPlayer.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * VideoPlayer Component
 *
 * Displays a product introduction video on the homepage.
 * Features:
 * - Native video controls with metadata preload for performance
 * - Poster image for initial display
 * - Error handling and loading states
 * - Responsive design matching the site aesthetic
 */
interface VideoPlayerProps {
  src?: string;
  poster?: string;
  title?: string;
  description?: string;
}

export default function VideoPlayer({
  src = useBaseUrl('/videos/intro.mp4'),
  poster,
  title = '产品介绍视频',
  description = '快速了解 Hagicode 核心功能',
}: VideoPlayerProps): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Handle video load events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <section className={styles.videoPlayerSection}>
      <div className="container">
        <div className={styles.videoPlayerContainer}>
          {/* Section Header */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            <p className={styles.sectionDescription}>{description}</p>
          </div>

          {/* Video Wrapper */}
          <div className={styles.videoWrapper}>
            {hasError ? (
              <div className={styles.errorState}>
                <span className={styles.errorIcon}>⚠️</span>
                <p className={styles.errorText}>
                  视频加载失败，请稍后重试或检查网络连接
                </p>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  className={styles.videoElement}
                  controls
                  preload="metadata"
                  poster={poster}
                  aria-label={title}
                >
                  <source src={src} type="video/mp4" />
                  <p>
                    您的浏览器不支持视频播放。
                    <a href={src}>点击下载视频</a>
                  </p>
                </video>

                {isLoading && (
                  <div className={styles.loadingOverlay}>
                    <div className={styles.spinner} />
                    <span className={styles.loadingText}>加载中...</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

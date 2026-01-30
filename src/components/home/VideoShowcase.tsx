/**
 * VideoShowcase 组件
 * 视频展示区块 - 集成 Bilibili 视频
 * 设计系统: HUD/Sci-Fi FUI + Glassmorphism
 */
import { motion } from 'framer-motion';
import BilibiliVideo from './BilibiliVideo';
import styles from './VideoShowcase.module.css';

// 定义 Variants 类型
type Variants = {
  [key: string]: {
    [key: string]: any;
  };
};

interface VideoShowcaseProps {
  title?: string;
  description?: string;
  videoId: string;
}

export default function VideoShowcase({
  title = '每天哈基半小时,AI多任务编程实战',
  description = '通过视频快速了解 Hagicode 的核心功能和使用方法',
  videoId = 'BV1pirZBuEzq',
}: VideoShowcaseProps) {
  return (
    <section className={styles.videoShowcase} aria-labelledby="video-showcase-title">
      <div className={styles.container}>
        {/* 区块头部 */}
        <div className={styles.header}>
          <h2 id="video-showcase-title" className={styles.title}>
            {title}
          </h2>
          <p className={styles.description}>{description}</p>
        </div>

        {/* 视频包装器 */}
        <div className={styles.videoWrapper}>
          <BilibiliVideo bvid={videoId} title={title} />
        </div>
      </div>
    </section>
  );
}

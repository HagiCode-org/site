import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ScreenshotGallery from './ScreenshotGallery';
import styles from './home.module.css';

interface Screenshot {
  src: string;
  alt: string;
  title: string;
  description: string;
}

export default function ShowcaseSection(): JSX.Element {
  const screenshots: Screenshot[] = [
    {
      src: useBaseUrl('/img/home/亮色主题主界面.png'),
      alt: 'PCode 亮色主题主界面 - 清新明亮的日间模式',
      title: '亮色主题',
      description: '清新明亮的日间模式',
    },
    {
      src: useBaseUrl('/img/home/暗色主题主界面.png'),
      alt: 'PCode 暗色主题主界面 - 护眼舒适的夜间模式',
      title: '暗色主题',
      description: '护眼舒适的夜间模式',
    },
    {
      src: useBaseUrl('/img/home/实时token消耗报告.png'),
      alt: '实时 Token 消耗报告 - 透明的 AI 成本追踪',
      title: '实时消耗报告',
      description: '透明的 AI 成本追踪',
    },
    {
      src: useBaseUrl('/img/home/每日成就报告.png'),
      alt: '每日成就报告 - 游戏化的成就展示',
      title: '每日成就',
      description: '游戏化的成就展示',
    },
    {
      src: useBaseUrl('/img/home/使用 AI 的效率提升报告.png'),
      alt: '使用 AI 的效率提升报告 - 量化 AI 带来的效率提升',
      title: '效率提升',
      description: '量化 AI 带来的效率提升',
    },
    {
      src: useBaseUrl('/img/home/每日编写代码获得的成就.png'),
      alt: '每日编写代码获得的成就 - 收集你的每一个里程碑',
      title: '成就徽章',
      description: '收集你的每一个里程碑',
    },
  ];

  return (
    <section className={styles.showcaseSection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>PCode 功能展示</h2>
        <ScreenshotGallery screenshots={screenshots} />
      </div>
    </section>
  );
}

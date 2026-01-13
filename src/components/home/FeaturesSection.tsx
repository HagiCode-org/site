import React from 'react';
import styles from './home.module.css';

interface Feature {
  emoji: string;
  title: string;
  description: string;
  items: string[];
}

const features: Feature[] = [
  {
    emoji: '🧠',
    title: '智能',
    description: 'AI 驱动的代码智能助手',
    items: ['会话管理', '提案生成', '工具调用'],
  },
  {
    emoji: '⚡',
    title: '便捷',
    description: '开箱即用的项目配置',
    items: ['快速配置', '主题定制', '快捷切换'],
  },
  {
    emoji: '🎮',
    title: '有趣',
    description: '游戏化的开发体验',
    items: ['成就系统', '每日报告', '效率评级'],
  },
];

export default function FeaturesSection(): JSX.Element {
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <div className={styles.featuresGrid}>
          {features.map((feature) => (
            <div key={feature.title} className={styles.featureCard}>
              <div className={styles.featureEmoji}>{feature.emoji}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
              <ul className={styles.featureItems}>
                {feature.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

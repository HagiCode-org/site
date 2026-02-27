/**
 * ProductHighlightsSection 组件
 * 产品特性亮点区域 - 展示核心功能特性和技术标识
 * 设计系统: 更激进的科技风
 */
import { motion } from 'framer-motion';
import { useTranslation } from '@/i18n/ui';
import { useLocale } from '@/lib/useLocale';
import styles from './SocialProofSection.module.css';

// 动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export default function SocialProofSection({ locale: propLocale }: { locale?: 'zh-CN' | 'en' }) {
  const { locale: detectedLocale } = useLocale();
  const locale = propLocale || detectedLocale;
  const { t } = useTranslation(locale);

  // 产品特性亮点 - 展示核心功能
  const highlights = [
    { icon: '⚡', title: t('socialProof.highlights.multiThread'), description: t('socialProof.highlights.multiThreadDesc') },
    { icon: '🔒', title: t('socialProof.highlights.privacy'), description: t('socialProof.highlights.privacyDesc') },
    { icon: '📋', title: t('socialProof.highlights.openspec'), description: t('socialProof.highlights.openspecDesc') },
    { icon: '🎯', title: t('socialProof.highlights.achievements'), description: t('socialProof.highlights.achievementsDesc') },
  ];

  // 技术标识徽章
  const techBadges = [
    {
      name: t('socialProof.badges.claude'),
      description: t('socialProof.badges.claudeDesc'),
      icon: 'C',
    },
    {
      name: t('socialProof.badges.opensource'),
      description: t('socialProof.badges.opensourceDesc'),
      icon: 'G',
    },
    {
      name: t('socialProof.badges.ssl'),
      description: t('socialProof.badges.sslDesc'),
      icon: '🔒',
    },
  ];
  return (
    <section className={styles.socialProofSection}>
      {/* 背景装饰 */}
      <div className={styles.bgGrid} />
      <div className={styles.bgGlow} />

      <div className={styles.container}>
        {/* 产品特性亮点 */}
        <motion.div
          className={styles.highlightsContainer}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {highlights.map((highlight, index) => (
            <motion.div key={index} className={styles.highlightCard} variants={itemVariants}>
              <div className={styles.highlightIcon}>{highlight.icon}</div>
              <div className={styles.highlightContent}>
                <div className={styles.highlightTitle}>{highlight.title}</div>
                <div className={styles.highlightDescription}>{highlight.description}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 技术标识徽章 */}
        <motion.div
          className={styles.techBadgesContainer}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {techBadges.map((badge, index) => (
            <motion.div
              key={index}
              className={styles.techBadge}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.badgeIcon}>{badge.icon}</div>
              <div className={styles.badgeInfo}>
                <div className={styles.badgeName}>{badge.name}</div>
                <div className={styles.badgeDescription}>{badge.description}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

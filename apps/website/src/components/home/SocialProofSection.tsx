/**
 * SocialProofSection 组件
 * 社交证明区域 - 展示用户数据、评价和信任指标
 * 设计系统: 更激进的科技风
 */
import { motion } from 'framer-motion';
import styles from './SocialProofSection.module.css';

interface StatItem {
  value: string;
  label: string;
  suffix?: string;
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating?: number;
}

// 统计数据
const stats: StatItem[] = [
  { value: '10,000+', label: '活跃用户', suffix: '+' },
  { value: '300%', label: '效率提升', suffix: '%' },
  { value: '50,000+', label: '会话处理', suffix: '+' },
  { value: '99.9%', label: '满意度', suffix: '%' },
];

// 用户评价
const testimonials: Testimonial[] = [
  {
    name: '张开发',
    role: '全栈工程师',
    content: 'Hagicode 的多线程会话管理彻底改变了我的编码方式。以前需要打开多个标签页，现在一个窗口就能搞定所有任务，效率至少提升了两倍！',
    rating: 5,
  },
  {
    name: '李架构',
    role: '技术负责人',
    content: 'OpenSpec 工作流让团队协作变得前所未有的顺畅。提案、审核、实施，整个流程标准化，代码质量也明显提升。',
    rating: 5,
  },
  {
    name: '王独立',
    role: '独立开发者',
    content: '作为独立开发者，Hagicode 就是我的全能助手。从需求分析到代码实现，从 Bug 修复到文档生成，它帮了我太多。',
    rating: 5,
  },
];

// 信任徽章
const trustBadges = [
  {
    name: 'Claude AI',
    description: 'Powered by',
    icon: 'C',
  },
  {
    name: 'Open Source',
    description: 'GitHub',
    icon: 'G',
  },
  {
    name: 'SSL Secure',
    description: '安全加密',
    icon: '🔒',
  },
];

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

export default function SocialProofSection() {
  return (
    <section className={styles.socialProofSection}>
      {/* 背景装饰 */}
      <div className={styles.bgGrid} />
      <div className={styles.bgGlow} />

      <div className={styles.container}>
        {/* 统计数据 */}
        <motion.div
          className={styles.statsContainer}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map((stat, index) => (
            <motion.div key={index} className={styles.statCard} variants={itemVariants}>
              <div className={styles.statValue}>
                {stat.value}
                <span className={styles.statSuffix}>{stat.suffix}</span>
              </div>
              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.statGlow} />
            </motion.div>
          ))}
        </motion.div>

        {/* 用户评价 */}
        <motion.div
          className={styles.testimonialsContainer}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2 className={styles.testimonialsTitle} variants={itemVariants}>
            用户怎么说
          </motion.h2>
          <div className={styles.testimonialsGrid}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className={styles.testimonialCard}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.testimonialContent}>
                  <div className={styles.quotesIcon}>"</div>
                  <p className={styles.testimonialText}>{testimonial.content}</p>
                </div>
                <div className={styles.testimonialFooter}>
                  <div className={styles.testimonialAvatar}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className={styles.testimonialInfo}>
                    <div className={styles.testimonialName}>{testimonial.name}</div>
                    <div className={styles.testimonialRole}>{testimonial.role}</div>
                  </div>
                  {testimonial.rating && (
                    <div className={styles.testimonialRating}>
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <svg key={i} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 信任徽章 */}
        <motion.div
          className={styles.trustBadgesContainer}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {trustBadges.map((badge, index) => (
            <motion.div
              key={index}
              className={styles.trustBadge}
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

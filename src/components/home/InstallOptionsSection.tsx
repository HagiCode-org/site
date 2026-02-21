/**
 * InstallOptionsSection 组件
 * 安装选项展示区域 - 展示桌面应用和容器版本
 */
import { motion } from 'framer-motion';
import styles from './InstallOptionsSection.module.css';
import { getLink } from '@/lib/shared/links';

// 定义选项类型
interface InstallOption {
  id: 'desktop' | 'container';
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  ctaText: string;
  ctaLink: string;
  badge?: string;
  popular?: boolean;
}

// Desktop Icon
function DesktopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 21H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="10" r="2" fill="currentColor"/>
      <path d="M12 12V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Container Icon
function ContainerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186h-2.12a.186.186 0 00-.185.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288z" fill="currentColor"/>
    </svg>
  );
}

// Arrow Right Icon
function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Check Icon
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

// 动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

export default function InstallOptionsSection() {
  const options: InstallOption[] = [
    {
      id: 'desktop',
      title: '桌面应用',
      description: '在本地电脑上运行，轻量便捷，开箱即用',
      icon: <DesktopIcon />,
      features: [
        '本地运行，数据完全私有',
        '支持 Windows、macOS、Linux',
        '无需配置服务器',
        '自动更新，保持最新版本',
        '适合个人开发者',
      ],
      ctaText: '下载桌面应用',
      ctaLink: getLink('desktop'),
      badge: '推荐',
      popular: true,
    },
    {
      id: 'container',
      title: '容器版本',
      description: '部署在服务器上，支持远程访问，适合团队协作',
      icon: <ContainerIcon />,
      features: [
        '支持 x86_64 架构',
        '环境隔离，不影响系统',
        '支持 Docker Compose Builder',
        '数据持久化，安全可靠',
        '适合生产环境',
      ],
      ctaText: '容器部署指南',
      ctaLink: getLink('container'),
    },
  ];

  return (
    <section className={styles.installSection}>
      {/* 背景装饰 */}
      <div className={styles.bgGrid} />
      <div className={styles.bgGlow} />

      <div className="container">
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>选择您的安装方式</h2>
          <p className={styles.sectionDescription}>
            根据您的使用场景，选择最适合的安装方式
          </p>
        </motion.div>

        <motion.div
          className={styles.optionsGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {options.map((option) => (
            <motion.div
              key={option.id}
              className={`${styles.optionCard} ${option.popular ? styles.optionCardPopular : ''}`}
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              {/* Badge */}
              {option.badge && (
                <div className={styles.badge}>{option.badge}</div>
              )}

              {/* Icon */}
              <div className={styles.optionIcon}>
                {option.icon}
              </div>

              {/* Title & Description */}
              <h3 className={styles.optionTitle}>{option.title}</h3>
              <p className={styles.optionDescription}>{option.description}</p>

              {/* Features */}
              <ul className={styles.featuresList}>
                {option.features.map((feature, index) => (
                  <li key={index}>
                    <span className={styles.checkIcon}>
                      <CheckIcon />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <a
                href={option.ctaLink}
                className={`${styles.ctaButton} ${option.popular ? styles.ctaButtonPrimary : styles.ctaButtonSecondary}`}
              >
                <span>{option.ctaText}</span>
                <ArrowRightIcon />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

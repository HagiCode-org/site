/**
 * ShowcaseSection 组件
 * 产品功能截图展示
 *
 * 展示 Hagicode 的核心功能界面截图,包括:
 * - 亮色/暗色主题主界面
 * - Token 消耗报告
 * - 效率提升报告
 * - 成就系统
 */
import { withBasePath } from '../../utils/path';
import { useTranslation } from '@/i18n/ui';
import { useLocale } from '@/lib/useLocale';
import styles from './ShowcaseSection.module.css';

interface ScreenshotItem {
  src: string;
  title: string;
  description: string;
  alt: string;
}

// 图片加载错误处理
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const target = e.currentTarget;
  target.style.display = 'none'; // 隐藏损坏的图片

  // 显示占位符
  const parent = target.parentElement;
  if (parent && !parent.querySelector(`.${styles.screenshotPlaceholder}`)) {
    const placeholder = document.createElement('div');
    placeholder.className = styles.screenshotPlaceholder;
    placeholder.textContent = '图片加载失败';
    parent.insertBefore(placeholder, target.nextSibling);
  }
};

export default function ShowcaseSection({ locale: propLocale }: { locale?: 'zh-CN' | 'en' }) {
  const { locale: detectedLocale } = useLocale();
  const locale = propLocale || detectedLocale;
  const { t } = useTranslation(locale);

  // 产品截图数据,按推荐顺序排列
  const screenshots: ScreenshotItem[] = [
    {
      src: withBasePath('/img/home/亮色主题主界面.png'),
      title: t('showcase.screenshots.lightTheme.title'),
      description: t('showcase.screenshots.lightTheme.description'),
      alt: t('showcase.screenshots.lightTheme.alt')
    },
    {
      src: withBasePath('/img/home/暗色主题主界面.png'),
      title: t('showcase.screenshots.darkTheme.title'),
      description: t('showcase.screenshots.darkTheme.description'),
      alt: t('showcase.screenshots.darkTheme.alt')
    },
    {
      src: withBasePath('/img/home/实时token消耗报告.png'),
      title: t('showcase.screenshots.tokenReport.title'),
      description: t('showcase.screenshots.tokenReport.description'),
      alt: t('showcase.screenshots.tokenReport.alt')
    },
    {
      src: withBasePath('/img/home/使用 AI 的效率提升报告.png'),
      title: t('showcase.screenshots.efficiencyReport.title'),
      description: t('showcase.screenshots.efficiencyReport.description'),
      alt: t('showcase.screenshots.efficiencyReport.alt')
    },
    {
      src: withBasePath('/img/home/每日成就报告.png'),
      title: t('showcase.screenshots.dailyAchievements.title'),
      description: t('showcase.screenshots.dailyAchievements.description'),
      alt: t('showcase.screenshots.dailyAchievements.alt')
    },
    {
      src: withBasePath('/img/home/每日编写代码获得的成就.png'),
      title: t('showcase.screenshots.codingAchievements.title'),
      description: t('showcase.screenshots.codingAchievements.description'),
      alt: t('showcase.screenshots.codingAchievements.alt')
    }
  ];

  return (
    <section className={styles.showcaseSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t('showcase.title')}</h2>
          <p className={styles.sectionDescription}>
            {t('showcase.description')}
          </p>
        </div>

        <div className={styles.screenshotsGrid}>
          {screenshots.map((screenshot) => (
            <figure key={screenshot.src} className={styles.screenshotCard}>
              <img
                src={screenshot.src}
                alt={screenshot.alt}
                className={styles.screenshotImage}
                onError={handleImageError}
                loading="lazy"
              />
              <figcaption>
                <h3 className={styles.screenshotTitle}>{screenshot.title}</h3>
                <p className={styles.screenshotDescription}>{screenshot.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

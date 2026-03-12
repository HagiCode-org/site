/**
 * ShowcaseSection 组件
 * 产品功能截图展示
 *
 * 展示 Hagicode 的核心功能界面截图,包括:
 * - 亮色/暗色主题主界面
 * - Token 消耗报告
 * - 多 Agent 并行工作台
 * - Hero Dungeon / Hero Battle 当前界面
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
  // 这里统一使用当前仍存在的工作台/副本/战报视图。
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
      src: withBasePath('/img/home/multi-agent-workspace.svg'),
      title: t('showcase.screenshots.multiAgentWorkspace.title'),
      description: t('showcase.screenshots.multiAgentWorkspace.description'),
      alt: t('showcase.screenshots.multiAgentWorkspace.alt')
    },
    {
      src: withBasePath('/img/home/hero-dungeon-workspace.svg'),
      title: t('showcase.screenshots.heroDungeonWorkspace.title'),
      description: t('showcase.screenshots.heroDungeonWorkspace.description'),
      alt: t('showcase.screenshots.heroDungeonWorkspace.alt')
    },
    {
      src: withBasePath('/img/home/hero-battle-report.svg'),
      title: t('showcase.screenshots.heroBattleReport.title'),
      description: t('showcase.screenshots.heroBattleReport.description'),
      alt: t('showcase.screenshots.heroBattleReport.alt')
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

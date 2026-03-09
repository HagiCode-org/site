import { motion } from 'framer-motion';
import styles from './CopilotCliSection.module.css';

type Locale = 'zh-CN' | 'en';

interface CopilotCliSectionProps {
  locale?: Locale;
}

interface CopySet {
  badge: string;
  title: string;
  subtitle: string;
  versionNote: string;
  cards: Array<{ title: string; description: string }>;
  docsButton: string;
  commandButton: string;
  disabledButton: string;
  disabledReason: string;
  guideLink: string;
}

const COPY: Record<Locale, CopySet> = {
  'zh-CN': {
    badge: 'COPILOT CLI',
    title: '统一命令行集成入口',
    subtitle: '从官网直达文档与组织自动化脚本，快速完成仓库适配',
    versionNote: '术语与示例与 docs 保持一致，兼容性基线：copilot-cli 0.1.x',
    cards: [
      {
        title: '文档即刻可学',
        description: '包含入门、命令参考、故障排查，支持可复现检查点。',
      },
      {
        title: '官网路径清晰',
        description: '提供功能介绍、价值说明与深链入口，减少用户跳转损耗。',
      },
      {
        title: '组织脚本可批量落地',
        description: '使用 org-github 脚本进行 dry-run 校验与模板初始化。',
      },
    ],
    docsButton: '查看 Copilot CLI 入门',
    commandButton: '查看命令参考',
    disabledButton: '下载示例包（即将开放）',
    disabledReason: '当前示例包尚未发布，先通过文档与 org-github 脚本完成适配。',
    guideLink: '查看跨仓库维护指南',
  },
  en: {
    badge: 'COPILOT CLI',
    title: 'Unified CLI Integration Entry',
    subtitle: 'Jump from site to docs and org automation scripts with a consistent setup path',
    versionNote: 'Terms and examples are aligned with docs. Compatibility baseline: copilot-cli 0.1.x',
    cards: [
      {
        title: 'Learn Fast in Docs',
        description: 'Getting started, command reference, troubleshooting, and reproducible checkpoints.',
      },
      {
        title: 'Clear Site-to-Docs Path',
        description: 'Feature messaging and deep links reduce onboarding friction.',
      },
      {
        title: 'Org Scripts for Scale',
        description: 'Use org-github dry-run validation and bootstrap templates across repositories.',
      },
    ],
    docsButton: 'Open Getting Started',
    commandButton: 'Open Command Reference',
    disabledButton: 'Download Example Bundle (Soon)',
    disabledReason: 'Example bundle is not published yet. Use docs + org-github scripts first.',
    guideLink: 'Read Cross-Repository Guide',
  },
};

export default function CopilotCliSection({ locale = 'zh-CN' }: CopilotCliSectionProps) {
  const copy = COPY[locale];
  const docsPrefix = locale === 'en' ? '/en' : '';
  const docsHost = 'https://docs.hagicode.com';
  const gettingStartedUrl = `${docsHost}${docsPrefix}/related-software-installation/copilot-cli/getting-started`;
  const commandRefUrl = `${docsHost}${docsPrefix}/related-software-installation/copilot-cli/command-reference`;
  const guideUrl = `${docsHost}${docsPrefix}/guides/copilot-cli-repository-integration`;

  return (
    <section className={styles.section} id="copilot-cli">
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.45 }}
        >
          <span className={styles.badge}>{copy.badge}</span>
          <h2 className={styles.title}>{copy.title}</h2>
          <p className={styles.subtitle}>{copy.subtitle}</p>
          <p className={styles.versionNote}>{copy.versionNote}</p>
        </motion.div>

        <div className={styles.cardGrid}>
          {copy.cards.map((card) => (
            <article key={card.title} className={styles.card}>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>

        <div className={styles.actions}>
          <a className={styles.primaryButton} href={gettingStartedUrl} target="_blank" rel="noopener noreferrer">
            {copy.docsButton}
          </a>
          <a className={styles.secondaryButton} href={commandRefUrl} target="_blank" rel="noopener noreferrer">
            {copy.commandButton}
          </a>
          <button className={styles.disabledButton} disabled aria-disabled="true" title={copy.disabledReason}>
            {copy.disabledButton}
          </button>
        </div>

        <p className={styles.disabledHint}>{copy.disabledReason}</p>
        <a className={styles.guideLink} href={guideUrl} target="_blank" rel="noopener noreferrer">
          {copy.guideLink}
        </a>
      </div>
    </section>
  );
}

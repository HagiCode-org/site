import { motion } from 'framer-motion';
import styles from './PricingComparisonSection.module.css';
import { getLinkWithLocale } from '@/lib/shared/links';
import { getBundledSteamStoreLink } from '@/lib/shared/steam-store-link';

type Locale = 'zh-CN' | 'en';

type ActionLink = {
  label: string;
  href: string;
  external?: boolean;
};

type EditionColumn = {
  title: string;
  action: ActionLink;
};

type FeatureCell = {
  type: 'check' | 'cross' | 'text';
  value?: string;
  href?: string;
  external?: boolean;
};

type FeatureRow = {
  feature: string;
  desktop: FeatureCell;
  container: FeatureCell;
  steam: FeatureCell;
  turbo: FeatureCell;
  steamExclusive?: boolean;
};

type DlcItem = {
  category: string;
  title: string;
  price: string;
  description: string;
  bullets: string[];
  action: ActionLink;
  featured?: 'sponsor';
};

type PricingContent = {
  title: string;
  limitTitle: string;
  limitDescription: string;
  plusTitle: string;
  plusDescription: string;
  featureHeader: string;
  desktopEdition: EditionColumn;
  containerEdition: EditionColumn;
  steamEdition: EditionColumn;
  turboEdition: EditionColumn;
  rows: FeatureRow[];
  dlcLabel: string;
  dlcTitle: string;
  dlcDescription?: string;
  dlcItems: DlcItem[];
};

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6 10.2 8.6 12.7 14 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="m7 7 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="m13 7-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function getPricingContent(locale: Locale): PricingContent {
  const steamHref = getBundledSteamStoreLink().href;
  const desktopHref = getLinkWithLocale('desktop', locale);
  const containerHref = getLinkWithLocale('container', locale);

  if (locale === 'en') {
    return {
      title: 'Editions & Pricing',
      limitTitle: 'Proposal concurrency rule',
      limitDescription:
        'Free and Steam both include a 3-proposal cap. Proposals in generating, executing, and archiving all count toward the same limit. Turbo Engine DLC expands that limit to 32.',
      plusTitle: 'Hagicode Plus note',
      plusDescription: 'Hagicode Plus means the main Steam edition plus a Turbo Engine DLC subscription.',
      featureHeader: 'Feature',
      desktopEdition: {
        title: 'Desktop',
        action: { label: 'Desktop', href: desktopHref },
      },
      containerEdition: {
        title: 'Container',
        action: { label: 'Container', href: containerHref },
      },
      steamEdition: {
        title: 'Steam',
        action: { label: 'Steam', href: steamHref, external: true },
      },
      turboEdition: {
        title: 'Hagicode Plus',
        action: { label: 'Hagicode Plus', href: steamHref, external: true },
      },
      rows: [
        {
          feature: 'Pricing',
          desktop: { type: 'text', value: 'Free' },
          container: { type: 'text', value: 'Free' },
          steam: { type: 'text', value: 'View on Steam', href: steamHref, external: true },
          turbo: { type: 'text', value: 'View on Steam', href: steamHref, external: true },
        },
        { feature: 'All free features included', desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
        { feature: 'Vault', desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
        { feature: 'Skills', desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
        { feature: 'Proposal workflow', desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
        { feature: 'Local achievements', desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
        { feature: 'All Agent CLI integrations', desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
        { feature: 'Speech recognition', desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
        { feature: 'OmniRoute integration', desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
        { feature: 'GitHub integration', desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
        { feature: 'Git management', desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
        { feature: 'Maximum concurrent proposals', desktop: { type: 'text', value: '3' }, container: { type: 'text', value: '3' }, steam: { type: 'text', value: '3' }, turbo: { type: 'text', value: '32' } },
        { feature: 'Copy switching support', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
        { feature: 'Custom logo', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
        { feature: 'Custom title', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
        { feature: 'Steam cloud achievements', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
        { feature: 'Free DLC support', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
        { feature: 'Steam Workshop support', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
        { feature: 'Cloud save support', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
      ],
      dlcLabel: 'DLC',
      dlcTitle: 'Optional packs',
      dlcItems: [
        {
          category: 'Free DLC',
          title: 'Hagicode - All Beauties Pack',
          price: 'Free',
          description: 'An extra cosmetics pack for Steam users.',
          bullets: [
            'Adds 1,000 anime-girl-style avatars',
            'Leaves room for more beauty-themed content in future updates',
          ],
          action: { label: 'Open Steam', href: steamHref, external: true },
        },
        {
          category: 'Performance DLC',
          title: 'Hagicode: Turbo Engine DLC',
          price: 'View on Steam',
          description: 'You can buy this DLC on its own to expand the original proposal concurrency cap, unlock copy switching, and customize the top-left logo and title. We will usually highlight a bundled purchase option called Hagicode Plus so the overall purchase price stays lower. Please check our store page for the latest changes.',
          bullets: [
            'Supports custom top-left logos and titles',
            'Unlocks copy and wording switching support',
            'Expands the maximum concurrent proposal limit to 32',
          ],
          action: { label: 'Open Steam', href: steamHref, external: true },
        },
        {
          category: 'Supporter DLC',
          title: 'Hagicode - Sponsor Pack',
          price: 'View on Steam',
          description: 'If you think Hagicode is genuinely excellent and want to provide direct financial support, buying Sponsor Pack gives the project more fuel and helps us keep it running for the long term.',
          bullets: [
            'One exclusive dark theme',
            'One exclusive light theme',
            'One exclusive Steam achievement',
          ],
          action: { label: 'Open Steam', href: steamHref, external: true },
          featured: 'sponsor',
        },
      ],
    };
  }

  return {
    title: '版本与定价',
    limitTitle: '提案并行计数规则',
    limitDescription:
      '免费版和 Steam 版默认都包含 3 个提案并行上限。正在生成、正在执行、正在归档三个状态会合并计数。Turbo Engine DLC 可将上限扩展到 32。',
    plusTitle: 'Hagicode Plus 说明',
    plusDescription: '所谓的 Hagicode Plus，实际上就是 Steam 主体版本，再加上订阅 Turbo Engine 这个 DLC。',
    featureHeader: '特性',
    desktopEdition: {
      title: 'Desktop',
      action: { label: 'Desktop', href: desktopHref },
    },
    containerEdition: {
      title: 'Container',
      action: { label: 'Container', href: containerHref },
    },
    steamEdition: {
      title: 'Steam',
      action: { label: 'Steam', href: steamHref, external: true },
    },
    turboEdition: {
      title: 'Hagicode Plus',
      action: { label: 'Hagicode Plus', href: steamHref, external: true },
    },
    rows: [
      {
        feature: '定价',
        desktop: { type: 'text', value: '免费' },
        container: { type: 'text', value: '免费' },
        steam: { type: 'text', value: '点击查看', href: steamHref, external: true },
        turbo: { type: 'text', value: '点击查看', href: steamHref, external: true },
      },
      { feature: '全部免费特性', desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
      { feature: 'Vault', desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
      { feature: 'Skills', desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
      { feature: '提案流程', desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
      { feature: '本地成就', desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
      { feature: '全部 Agent CLI 对接支持', desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
      { feature: '语音识别支持', desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
      { feature: 'OmniRoute 集成', desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
      { feature: 'GitHub 集成', desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
      { feature: 'Git 管理', desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
      { feature: '最大提案并行数', desktop: { type: 'text', value: '3' }, container: { type: 'text', value: '3' }, steam: { type: 'text', value: '3' }, turbo: { type: 'text', value: '32' } },
      { feature: '文案切换支持', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
      { feature: '自定义 Logo', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
      { feature: '自定义 Title', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
      { feature: 'Steam 云成就', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
      { feature: '免费 DLC 支持', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
      { feature: '创意工坊支持', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
      { feature: '云存档支持', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
    ],
    dlcLabel: 'DLC',
    dlcTitle: '扩展包列表',
    dlcItems: [
      {
        category: '免费 DLC',
        title: 'Hagicode - All Beauties Pack',
        price: '免费',
        description: '面向 Steam 用户的额外美少女内容包。',
        bullets: [
          '包含 1000 个额外的美少女风格头像',
          '未来可能继续加入其他美少女相关内容',
        ],
        action: { label: '打开 Steam', href: steamHref, external: true },
      },
      {
        category: '性能 DLC',
        title: 'Hagicode: Turbo Engine DLC',
        price: '点击查看',
        description: '用户可以单独购买这个 DLC 来扩展原来的并发数，同时支持文案切换以及左上角 Logo 和 Title 自定义。通常情况下，我们会重点突出一个名为 Hagicode Plus 的一并购买套餐，使总体购买价格更低，请注意查看我们的商店页面变化。',
        bullets: [
          '支持左上角 Logo 和 Title 自定义',
          '解锁文案切换支持',
          '最大提案并行数扩展到 32',
        ],
        action: { label: '打开 Steam', href: steamHref, external: true },
      },
      {
        category: '赞助者 DLC',
        title: 'Hagicode - Sponsor Pack',
        price: '点击查看',
        description: '您觉得 Hagicode 非常不错，你很希望为我们的项目提供经济支持，那么购买 Sponsor Pack 可以为我们提供更多助力，您的支持使我们的项目可以更加长久地运行。',
        bullets: [
          '一套专属暗色主题',
          '一套专属亮色主题',
          '一个专属 Steam 成就',
        ],
        action: { label: '打开 Steam', href: steamHref, external: true },
        featured: 'sponsor',
      },
    ],
  };
}

function renderCell(cell: FeatureCell) {
  if (cell.type === 'check') {
    return (
      <span className={`${styles.cellBadge} ${styles.cellCheck}`} aria-label="included">
        <CheckIcon />
      </span>
    );
  }

  if (cell.type === 'cross') {
    return (
      <span className={`${styles.cellBadge} ${styles.cellCross}`} aria-label="not included">
        <CrossIcon />
      </span>
    );
  }

  if (cell.href) {
    return (
      <a
        href={cell.href}
        className={`${styles.cellText} ${styles.cellLink}`}
        target={cell.external ? '_blank' : undefined}
        rel={cell.external ? 'noopener noreferrer' : undefined}
      >
        {cell.value}
      </a>
    );
  }

  return <span className={styles.cellText}>{cell.value}</span>;
}

function renderEditionHeader(column: EditionColumn, className?: string) {
  return (
    <div className={`${styles.columnHeading} ${className ?? ''}`.trim()}>
      <a
        href={column.action.href}
        className={styles.headerButton}
        target={column.action.external ? '_blank' : undefined}
        rel={column.action.external ? 'noopener noreferrer' : undefined}
      >
        {column.title}
      </a>
    </div>
  );
}

export default function PricingComparisonSection({ locale = 'zh-CN' }: { locale?: Locale }) {
  const content = getPricingContent(locale);

  return (
    <section className={styles.section} aria-labelledby="pricing-comparison-title">
      <div className={styles.bgGrid} />
      <div className={styles.bgGlow} />

      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.55 }}
        >
          <h2 id="pricing-comparison-title" className={styles.title}>
            {content.title}
          </h2>
        </motion.div>

        <motion.section
          className={styles.group}
          aria-labelledby="pricing-base-title"
          variants={SECTION_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className={styles.matrixWrap}>
            <table className={styles.matrixTable}>
              <thead>
                <tr>
                  <th scope="col" className={styles.featureHeading}>{content.featureHeader}</th>
                  <th scope="col">
                    {renderEditionHeader(content.turboEdition, styles.turboColumnHeading)}
                  </th>
                  <th scope="col">
                    {renderEditionHeader(content.steamEdition, styles.steamColumnHeading)}
                  </th>
                  <th scope="col">
                    {renderEditionHeader(content.desktopEdition, styles.desktopColumnHeading)}
                  </th>
                  <th scope="col">
                    {renderEditionHeader(content.containerEdition, styles.containerColumnHeading)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {content.rows.map((row) => (
                  <tr key={row.feature} className={row.steamExclusive ? styles.steamExclusiveRow : undefined}>
                    <th scope="row" className={styles.rowHeading}>{row.feature}</th>
                    <td className={styles.turboColumnCell}>{renderCell(row.turbo)}</td>
                    <td className={styles.steamColumnCell}>{renderCell(row.steam)}</td>
                    <td className={styles.desktopColumnCell}>{renderCell(row.desktop)}</td>
                    <td className={styles.containerColumnCell}>{renderCell(row.container)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.matrixNote}>
            <span>{content.limitTitle}:</span>
            {' '}
            {content.limitDescription}
          </p>
          <p className={styles.matrixNote}>
            <span>{content.plusTitle}:</span>
            {' '}
            {content.plusDescription}
          </p>
        </motion.section>

        <motion.section
          className={styles.group}
          aria-labelledby="pricing-dlc-title"
          variants={SECTION_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className={styles.groupHeader}>
            <span className={styles.groupLabel}>{content.dlcLabel}</span>
            <h3 id="pricing-dlc-title" className={styles.groupTitle}>
              {content.dlcTitle}
            </h3>
            {content.dlcDescription ? (
              <p className={styles.groupDescription}>{content.dlcDescription}</p>
            ) : null}
          </div>

          <div className={styles.dlcList}>
            {content.dlcItems.map((item) => (
              <a
                key={item.title}
                href={item.action.href}
                className={`${styles.dlcRow} ${item.featured === 'sponsor' ? styles.sponsorRow : ''}`}
                target={item.action.external ? '_blank' : undefined}
                rel={item.action.external ? 'noopener noreferrer' : undefined}
              >
                <div className={styles.dlcTop}>
                  <div className={styles.dlcMain}>
                    <span className={styles.dlcCategory}>{item.category}</span>
                    <h4 className={styles.dlcTitle}>{item.title}</h4>
                    <p className={styles.dlcDescription}>{item.description}</p>
                  </div>
                  <div className={styles.dlcAside}>
                    <strong className={styles.dlcPrice}>{item.price}</strong>
                  </div>
                </div>
                <ul className={styles.dlcBullets}>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </a>
            ))}
          </div>
        </motion.section>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import styles from './PricingComparisonSection.module.css';
import { getLinkWithLocale } from '@/lib/shared/links';
import { getBundledSteamStoreLink } from '@/lib/shared/steam-store-link';

type Locale = 'zh-CN' | 'en';

export const TURBO_ENGINE_STEAM_STORE_URL = 'https://store.steampowered.com/app/4635480/Hagicode__Turbo_Engine/';
export const HAGICODE_PLUS_BUNDLE_STEAM_URL = 'https://store.steampowered.com/bundle/73989/Hagicode_Plus/';

export function getHagicodePlusDocsIntroductionUrl(locale: Locale): string {
  return locale === 'en'
    ? 'https://docs.hagicode.com/en/bundles/hagicode-plus/'
    : 'https://docs.hagicode.com/bundles/hagicode-plus/';
}

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
  includedLabel: string;
  notIncludedLabel: string;
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

export function getPricingContent(locale: Locale): PricingContent {
  const steamHref = getBundledSteamStoreLink().href;
  const turboEngineSteamHref = TURBO_ENGINE_STEAM_STORE_URL;
  const hagicodePlusBundleHref = HAGICODE_PLUS_BUNDLE_STEAM_URL;
  const hagicodePlusDocsHref = getHagicodePlusDocsIntroductionUrl(locale);
  const desktopHref = getLinkWithLocale('desktop', locale);
  const containerHref = getLinkWithLocale('container', locale);

  if (locale === 'en') {
    return {
      title: 'Editions & Pricing',
      limitTitle: 'Proposal concurrency rule',
      limitDescription:
        'Free and Steam both include a 3-proposal cap. Proposals in generating, executing, and archiving all count toward the same limit. Turbo Engine DLC expands that limit to 32.',
      plusTitle: 'Hagicode Plus note',
      plusDescription: 'Hagicode Plus is the official Steam bundle that combines the main Steam edition with Turbo Engine DLC.',
      featureHeader: 'Feature',
      includedLabel: 'Included',
      notIncludedLabel: 'Not included',
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
        action: { label: 'Hagicode Plus', href: hagicodePlusDocsHref },
      },
      rows: [
        {
          feature: 'Pricing',
          desktop: { type: 'text', value: 'Free' },
          container: { type: 'text', value: 'Free' },
          steam: { type: 'text', value: 'View on Steam', href: steamHref, external: true },
          turbo: { type: 'text', value: 'View on Steam', href: hagicodePlusBundleHref, external: true },
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
        { feature: 'Turbo Engine avatar packs', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
        { feature: 'Custom avatar uploads', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
        { feature: 'Custom logo', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
        { feature: 'Custom title', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
        { feature: 'Custom Co-Authored-By info', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
        { feature: 'Steam cloud achievements', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
        { feature: 'Free DLC support', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
        { feature: 'Steam Workshop support', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
        { feature: 'Cloud save support', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
      ],
      dlcLabel: 'DLC & Bundles',
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
          price: 'Steam',
          description: 'You can buy this DLC on its own to expand the original proposal concurrency cap, unlock copy switching, add five avatar packs with 10 standalone avatars each, enable custom avatar uploads, customize the top-left logo and title, and align AI-generated commit trailers with your own Co-Authored-By naming rules. We will usually highlight a bundled purchase option called Hagicode Plus so the overall purchase price stays lower. Please check our store page for the latest changes.',
          bullets: [
            'Supports custom top-left logos and titles',
            'Includes five avatar packs with 10 selectable avatars in each pack',
            'Supports custom avatar uploads',
            'Lets teams customize the AI Co-Authored-By signature for commit workflows',
            'Unlocks copy and wording switching support',
            'Expands the maximum concurrent proposal limit to 32',
          ],
          action: { label: 'Open Steam', href: turboEngineSteamHref, external: true },
        },
        {
          category: 'Bundle',
          title: 'Hagicode Plus',
          price: 'Steam',
          description: 'The official Steam bundle that combines the Hagicode base edition with Turbo Engine DLC in one purchase path.',
          bullets: [
            'Bundles the main Steam edition and Turbo Engine DLC together',
            'Keeps the higher 32-proposal concurrency upgrade attached to the bundle path',
            'Works as the clearest purchase entry when you want the full Steam setup at once',
          ],
          action: { label: 'Open Steam', href: hagicodePlusBundleHref, external: true },
        },
        {
          category: 'Supporter DLC',
          title: 'Hagicode - Sponsor Pack',
          price: 'Steam',
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
    plusDescription: 'Hagicode Plus 是 Steam 上的官方组合包，直接把 Steam 主体版本和 Turbo Engine DLC 一起打包。',
    featureHeader: '特性',
    includedLabel: '已包含',
    notIncludedLabel: '未包含',
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
      action: { label: 'Hagicode Plus', href: hagicodePlusDocsHref },
    },
    rows: [
      {
        feature: '定价',
        desktop: { type: 'text', value: '免费' },
        container: { type: 'text', value: '免费' },
        steam: { type: 'text', value: '点击查看', href: steamHref, external: true },
        turbo: { type: 'text', value: '点击查看', href: hagicodePlusBundleHref, external: true },
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
      { feature: 'Turbo Engine 头像包', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
      { feature: '自定义头像上传', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
      { feature: '自定义 Logo', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
      { feature: '自定义 Title', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
      { feature: '自定义 Co-Authored-By 信息', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
      { feature: 'Steam 云成就', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
      { feature: '免费 DLC 支持', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
      { feature: '创意工坊支持', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
      { feature: '云存档支持', desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
    ],
    dlcLabel: 'DLC 与组合包',
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
        description: '用户可以单独购买这个 DLC 来扩展原来的并发数，同时支持文案切换，附带 5 套每套 10 个的独立头像，并支持上传自定义头像以及左上角 Logo 和 Title 自定义，同时让 AI 提交里的 Co-Authored-By 署名更容易对齐团队自己的命名和邮箱规范。通常情况下，我们会重点突出一个名为 Hagicode Plus 的一并购买套餐，使总体购买价格更低，请注意查看我们的商店页面变化。',
        bullets: [
          '支持左上角 Logo 和 Title 自定义',
          '包含 5 套头像资源，每套提供 10 个可选头像',
          '支持上传自定义头像',
          '支持为 AI 提交流程自定义 Co-Authored-By 署名',
          '解锁文案切换支持',
          '最大提案并行数扩展到 32',
        ],
        action: { label: '打开 Steam', href: turboEngineSteamHref, external: true },
      },
      {
        category: '组合包',
        title: 'Hagicode Plus',
        price: '点击查看',
        description: 'Steam 官方组合包，一次打包 Steam 主体版本和 Turbo Engine DLC，适合想直接进入完整 Steam 工作流的用户。',
        bullets: [
          '把 Steam 主体版本和 Turbo Engine DLC 一起打包',
          '保留 32 个提案并行上限这条升级路径',
          '适合希望一次买齐 Steam 完整能力的购买入口',
        ],
        action: { label: '打开 Steam', href: hagicodePlusBundleHref, external: true },
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

function renderCell(cell: FeatureCell, labels: { included: string; notIncluded: string }) {
  if (cell.type === 'check') {
    return (
      <span className={`${styles.cellBadge} ${styles.cellCheck}`} aria-label={labels.included}>
        <CheckIcon />
      </span>
    );
  }

  if (cell.type === 'cross') {
    return (
      <span className={`${styles.cellBadge} ${styles.cellCross}`} aria-label={labels.notIncluded}>
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
  const cellLabels = {
    included: content.includedLabel,
    notIncluded: content.notIncludedLabel,
  };

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
                    <td className={styles.turboColumnCell} data-column={content.turboEdition.title}>{renderCell(row.turbo, cellLabels)}</td>
                    <td className={styles.steamColumnCell} data-column={content.steamEdition.title}>{renderCell(row.steam, cellLabels)}</td>
                    <td className={styles.desktopColumnCell} data-column={content.desktopEdition.title}>{renderCell(row.desktop, cellLabels)}</td>
                    <td className={styles.containerColumnCell} data-column={content.containerEdition.title}>{renderCell(row.container, cellLabels)}</td>
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

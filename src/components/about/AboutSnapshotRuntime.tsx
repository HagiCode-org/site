import { startTransition, useEffect, useState, type CSSProperties } from 'react';

import {
  buildAboutPageModel,
  hasAboutPageModelMaterialChange,
  type AboutPageEntry,
  type AboutPageModel,
  type AboutPageSectionId,
} from '@/lib/about-page-model';
import {
  fetchCanonicalAboutSnapshot,
  getBundledAboutSnapshot,
  hasAboutSnapshotMaterialChange,
} from '@/lib/about-snapshot-source';

interface AboutSnapshotRuntimeProps {
  model: AboutPageModel;
}

type AboutRefreshState = 'static' | 'refreshing' | 'synced' | 'noop' | 'fallback';
type PlatformIconTone = 'steam' | 'youtube' | 'hot' | 'sky' | 'ink' | 'jade' | 'gold';
type PlatformIconShape =
  | {
      readonly type: 'path';
      readonly d: string;
      readonly fill?: string;
      readonly stroke?: string;
      readonly strokeWidth?: number;
      readonly strokeLinecap?: 'round' | 'square' | 'butt';
      readonly strokeLinejoin?: 'round' | 'miter' | 'bevel';
      readonly fillRule?: 'evenodd' | 'nonzero';
      readonly clipRule?: 'evenodd' | 'nonzero';
      readonly className?: string;
    }
  | {
      readonly type: 'circle';
      readonly cx: number;
      readonly cy: number;
      readonly r: number;
      readonly fill?: string;
      readonly stroke?: string;
      readonly strokeWidth?: number;
      readonly className?: string;
    }
  | {
      readonly type: 'text';
      readonly x: number;
      readonly y: number;
      readonly value: string;
      readonly fontSize: number;
      readonly fontWeight?: string | number;
      readonly letterSpacing?: string;
      readonly fill?: string;
      readonly className?: string;
      readonly textAnchor?: 'start' | 'middle' | 'end';
    };

interface PlatformIconDefinition {
  readonly tone: PlatformIconTone;
  readonly viewBox: string;
  readonly label: string;
  readonly shapes: readonly PlatformIconShape[];
}

const entryAccents = [
  'var(--about-accent-1)',
  'var(--about-accent-2)',
  'var(--about-accent-3)',
  'var(--about-accent-4)',
];

const sectionOrder = new Map<AboutPageSectionId, number>([
  ['store', 0],
  ['community', 1],
  ['content', 2],
]);

const refreshCopy = {
  en: {
    eyebrow: 'About snapshot',
    versionLabel: 'Version',
    updatedAtLabel: 'Updated',
    states: {
      static: 'Bundled snapshot ready',
      refreshing: 'Refreshing latest index data…',
      synced: 'Latest index data synced',
      noop: 'Bundled snapshot already current',
      fallback: 'Refresh failed, keeping the bundled snapshot',
    },
  },
  'zh-CN': {
    eyebrow: 'About 快照',
    versionLabel: '版本',
    updatedAtLabel: '更新时间',
    states: {
      static: '已加载构建期快照',
      refreshing: '正在刷新最新 Index 数据…',
      synced: '已同步最新 Index 数据',
      noop: '当前快照已经是最新可见内容',
      fallback: '刷新失败，继续显示构建期快照',
    },
  },
} as const;

const platformIconAliases: Record<string, string> = {
  'douyin-account': 'douyin',
  'douyin-qr': 'douyin',
  'qq-group': 'qq',
  'feishu-group': 'feishu',
  'wechat-account': 'wechat',
};

const platformIcons: Record<string, PlatformIconDefinition> = {
  youtube: {
    tone: 'youtube',
    viewBox: '0 0 24 24',
    label: 'YouTube',
    shapes: [
      {
        type: 'path',
        d: 'M23.5 7.2a3.02 3.02 0 0 0-2.12-2.14C19.5 4.5 12 4.5 12 4.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 7.2C0 9.1 0 12 0 12s0 2.9.5 4.8a3.02 3.02 0 0 0 2.12 2.14C4.5 19.5 12 19.5 12 19.5s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14c.5-1.9.5-4.8.5-4.8s0-2.9-.5-4.8Z',
        fill: 'white',
      },
      {
        type: 'path',
        d: 'm9.75 15.02 6.24-3.02-6.24-3.02v6.04Z',
        className: 'entry-platform-icon-play',
        fill: '#ff3b30',
      },
    ],
  },
  steam: {
    tone: 'steam',
    viewBox: '0 0 24 24',
    label: 'Steam',
    shapes: [
      {
        type: 'circle',
        cx: 16.9,
        cy: 7.4,
        r: 2.3,
        stroke: 'white',
        strokeWidth: 1.6,
      },
      {
        type: 'circle',
        cx: 8.4,
        cy: 15.7,
        r: 3.6,
        stroke: 'white',
        strokeWidth: 1.6,
      },
      {
        type: 'circle',
        cx: 8.4,
        cy: 15.7,
        r: 1.2,
        fill: 'white',
      },
      {
        type: 'path',
        d: 'M10.9 13.8 15 9.8',
        stroke: 'white',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
    ],
  },
  bilibili: {
    tone: 'sky',
    viewBox: '0 0 24 24',
    label: 'Bilibili',
    shapes: [
      {
        type: 'path',
        d: 'M8 5.5 6.2 3.7M16 5.5l1.8-1.8M8 10.6v2.1M16 10.6v2.1M9.4 16.3c1.3.9 3.9.9 5.2 0M8 6.5h8a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-5a3 3 0 0 1 3-3Z',
        stroke: 'white',
        strokeWidth: 1.9,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
    ],
  },
  xiaohongshu: {
    tone: 'hot',
    viewBox: '0 0 24 24',
    label: 'Xiaohongshu',
    shapes: [{ type: 'text', x: 12, y: 14.2, value: 'RED', fontSize: 6.1, fontWeight: 800, letterSpacing: '.08em', fill: 'white', textAnchor: 'middle' }],
  },
  xiaoheihe: {
    tone: 'ink',
    viewBox: '0 0 24 24',
    label: 'Xiaoheihe',
    shapes: [{ type: 'text', x: 12, y: 14.5, value: 'HH', fontSize: 7.6, fontWeight: 800, letterSpacing: '.04em', fill: 'white', textAnchor: 'middle' }],
  },
  infoq: {
    tone: 'gold',
    viewBox: '0 0 24 24',
    label: 'InfoQ',
    shapes: [{ type: 'text', x: 12, y: 14.5, value: 'IQ', fontSize: 7.5, fontWeight: 800, letterSpacing: '.04em', fill: 'white', textAnchor: 'middle' }],
  },
  segmentfault: {
    tone: 'jade',
    viewBox: '0 0 24 24',
    label: 'SegmentFault',
    shapes: [{ type: 'text', x: 12, y: 14.1, value: '</>', fontSize: 6.5, fontWeight: 900, fill: 'white', textAnchor: 'middle' }],
  },
  csdn: {
    tone: 'hot',
    viewBox: '0 0 24 24',
    label: 'CSDN',
    shapes: [{ type: 'text', x: 12, y: 14.5, value: 'C', fontSize: 9.4, fontWeight: 900, fill: 'white', textAnchor: 'middle' }],
  },
  'tencent-cloud': {
    tone: 'sky',
    viewBox: '0 0 24 24',
    label: 'Tencent Cloud',
    shapes: [
      {
        type: 'path',
        d: 'M7.6 16.8h8.9a3 3 0 0 0 .2-6 4.5 4.5 0 0 0-8.6-1.4 3.3 3.3 0 0 0-.5 6.6Z',
        stroke: 'white',
        strokeWidth: 1.85,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
    ],
  },
  oschina: {
    tone: 'jade',
    viewBox: '0 0 24 24',
    label: 'OSCHINA',
    shapes: [{ type: 'text', x: 12, y: 14.4, value: 'OSC', fontSize: 5.6, fontWeight: 800, letterSpacing: '.02em', fill: 'white', textAnchor: 'middle' }],
  },
  juejin: {
    tone: 'sky',
    viewBox: '0 0 24 24',
    label: 'Juejin',
    shapes: [
      { type: 'path', d: 'm12 4.2 5.8 5.1L12 19.8 6.2 9.3 12 4.2Z', fill: 'white' },
      { type: 'path', d: 'm12 7.4 3.2 2.8L12 16 8.8 10.2 12 7.4Z', className: 'entry-platform-icon-inner', fill: '#1696ff' },
    ],
  },
  cnblogs: {
    tone: 'gold',
    viewBox: '0 0 24 24',
    label: 'Cnblogs',
    shapes: [{ type: 'text', x: 12, y: 14.5, value: 'B', fontSize: 9.1, fontWeight: 900, fill: 'white', textAnchor: 'middle' }],
  },
  zhihu: {
    tone: 'sky',
    viewBox: '0 0 24 24',
    label: 'Zhihu',
    shapes: [{ type: 'text', x: 12, y: 14.5, value: '?', fontSize: 10, fontWeight: 900, fill: 'white', textAnchor: 'middle' }],
  },
  douyin: {
    tone: 'ink',
    viewBox: '0 0 24 24',
    label: 'Douyin',
    shapes: [
      {
        type: 'path',
        d: 'M14.4 5.2c.5 1.1 1.4 2.1 2.6 2.6v2.5a6.2 6.2 0 0 1-2.6-.8v4.8a4.4 4.4 0 1 1-4.4-4.4c.3 0 .6 0 .9.1v2.4a2 2 0 1 0 1.1 1.9V5.2h2.4Z',
        fill: 'white',
      },
    ],
  },
  qq: {
    tone: 'sky',
    viewBox: '0 0 24 24',
    label: 'QQ',
    shapes: [{ type: 'text', x: 12, y: 14.5, value: 'QQ', fontSize: 7, fontWeight: 900, letterSpacing: '.02em', fill: 'white', textAnchor: 'middle' }],
  },
  feishu: {
    tone: 'jade',
    viewBox: '0 0 24 24',
    label: 'Feishu',
    shapes: [
      {
        type: 'path',
        d: 'M4.5 13.6 18.7 5l-4.9 14-2.4-4.3-4.7-1.1 6.8-3.5',
        stroke: 'white',
        strokeWidth: 1.9,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
    ],
  },
  discord: {
    tone: 'ink',
    viewBox: '0 0 24 24',
    label: 'Discord',
    shapes: [
      {
        type: 'path',
        d: 'M7.2 17.2c2.6 1.9 7 1.9 9.6 0 .6-.8 1.2-2 1.5-3.4-.9-.7-1.7-1.1-2.4-1.3l-.5.8c-.7-.2-1.4-.3-2-.3-.7 0-1.4.1-2.1.3l-.4-.8c-.8.2-1.6.6-2.4 1.3.3 1.4.8 2.5 1.5 3.4ZM8.9 14.1h.01M15.1 14.1h.01M7 8.4c1.7-.8 3.4-1.1 5-1.1 1.7 0 3.4.3 5 1.1.7 1 1.2 2.2 1.5 3.7-.8-.6-1.7-1-2.6-1.2-.2-.5-.5-1-.9-1.5-.8-.2-1.5-.3-2.3-.3-.8 0-1.6.1-2.4.3-.3.5-.6 1-.8 1.5-1 .2-1.8.6-2.7 1.2.3-1.5.9-2.7 1.6-3.7Z',
        stroke: 'white',
        strokeWidth: 1.65,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
    ],
  },
  devto: {
    tone: 'ink',
    viewBox: '0 0 24 24',
    label: 'Dev.to',
    shapes: [{ type: 'text', x: 12, y: 14.2, value: 'DEV', fontSize: 6, fontWeight: 900, letterSpacing: '.08em', fill: 'white', textAnchor: 'middle' }],
  },
  x: {
    tone: 'ink',
    viewBox: '0 0 24 24',
    label: 'X',
    shapes: [{ type: 'text', x: 12, y: 14.5, value: 'X', fontSize: 9.2, fontWeight: 900, fill: 'white', textAnchor: 'middle' }],
  },
  linkedin: {
    tone: 'sky',
    viewBox: '0 0 24 24',
    label: 'LinkedIn',
    shapes: [{ type: 'text', x: 12, y: 14.4, value: 'in', fontSize: 8.6, fontWeight: 900, fill: 'white', textAnchor: 'middle' }],
  },
  facebook: {
    tone: 'sky',
    viewBox: '0 0 24 24',
    label: 'Facebook',
    shapes: [{ type: 'text', x: 12, y: 14.7, value: 'f', fontSize: 10.4, fontWeight: 900, fill: 'white', textAnchor: 'middle' }],
  },
  wechat: {
    tone: 'jade',
    viewBox: '0 0 24 24',
    label: 'WeChat',
    shapes: [
      {
        type: 'path',
        d: 'M9.4 7.2c-2.7 0-4.9 1.8-4.9 4.1 0 1.2.6 2.2 1.7 3L5.6 17l2.8-1.3c.3.1.7.1 1 .1 2.7 0 4.9-1.8 4.9-4.1S12.1 7.2 9.4 7.2Zm6 3.7c2.3 0 4.1 1.4 4.1 3.3 0 1-.5 1.8-1.4 2.4l.4 2.2-2.2-1c-.3.1-.6.1-.9.1-2.3 0-4.1-1.4-4.1-3.3s1.8-3.7 4.1-3.7Z',
        fill: 'white',
      },
      { type: 'circle', cx: 7.9, cy: 11.2, r: 0.7, fill: '#24c78a' },
      { type: 'circle', cx: 10.8, cy: 11.2, r: 0.7, fill: '#24c78a' },
      { type: 'circle', cx: 14.4, cy: 14.2, r: 0.65, fill: '#24c78a' },
      { type: 'circle', cx: 17, cy: 14.2, r: 0.65, fill: '#24c78a' },
    ],
  },
};

function getStringSeed(value: string) {
  return Array.from(value).reduce((seed, char) => seed + char.charCodeAt(0), 0);
}

function getEntryStyle(entry: AboutPageEntry, index: number): CSSProperties {
  if (entry.presentation?.theme === 'youtube') {
    return {
      ['--entry-accent' as string]: 'var(--about-accent-youtube)',
      ['--entry-accent-soft' as string]: 'var(--about-accent-youtube-soft)',
    };
  }

  if (entry.presentation?.theme === 'steam') {
    return {
      ['--entry-accent' as string]: 'var(--about-accent-steam)',
      ['--entry-accent-soft' as string]: 'var(--about-accent-steam-soft)',
    };
  }

  const accent = entryAccents[(getStringSeed(entry.id) + index) % entryAccents.length];

  return {
    ['--entry-accent' as string]: accent,
    ['--entry-accent-soft' as string]: accent,
  };
}

function getEntryClass(entry: AboutPageEntry) {
  const classes = ['entry-item', `entry-kind-${entry.kind}`];

  if (entry.presentation?.theme === 'youtube') {
    classes.push('entry-item-youtube');
  }

  if (entry.presentation?.theme === 'steam') {
    classes.push('entry-item-steam');
  }

  if (entry.kind === 'combo' || entry.kind === 'media') {
    classes.push('entry-item-with-preview');
  }

  return classes.join(' ');
}

function getSectionClassName(sectionId: AboutPageSectionId) {
  return `section-block section-block-${sectionId}`;
}

function getPlatformIcon(entry: AboutPageEntry): PlatformIconDefinition | null {
  const iconKey = platformIconAliases[entry.id] ?? entry.id;
  return platformIcons[iconKey] ?? null;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

function formatSnapshotUpdatedAt(updatedAt: string): string {
  const date = new Date(updatedAt);

  if (Number.isNaN(date.getTime())) {
    return updatedAt;
  }

  return date.toISOString().replace('.000Z', 'Z');
}

function renderPlatformShape(shape: PlatformIconShape, index: number) {
  if (shape.type === 'path') {
    return (
      <path
        key={index}
        d={shape.d}
        fill={shape.fill}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        strokeLinecap={shape.strokeLinecap}
        strokeLinejoin={shape.strokeLinejoin}
        fillRule={shape.fillRule}
        clipRule={shape.clipRule}
        className={shape.className}
      />
    );
  }

  if (shape.type === 'circle') {
    return (
      <circle
        key={index}
        cx={shape.cx}
        cy={shape.cy}
        r={shape.r}
        fill={shape.fill}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        className={shape.className}
      />
    );
  }

  return (
    <text
      key={index}
      x={shape.x}
      y={shape.y}
      fill={shape.fill}
      fontSize={shape.fontSize}
      fontWeight={shape.fontWeight}
      letterSpacing={shape.letterSpacing}
      textAnchor={shape.textAnchor}
      className={shape.className}
    >
      {shape.value}
    </text>
  );
}

function AboutEntryCard({ entry, index }: { entry: AboutPageEntry; index: number }) {
  const platformIcon = getPlatformIcon(entry);
  const className = getEntryClass(entry);
  const style = getEntryStyle(entry, index);
  const content = (
    <>
      <div className="entry-main">
        <div className="entry-heading">
          <span className="entry-kind">{entry.kindLabel}</span>
          <div className="entry-title-row">
            {platformIcon ? (
              <span
                className={`entry-platform-icon entry-platform-icon-tone-${platformIcon.tone}`}
                aria-hidden="true"
              >
                <svg viewBox={platformIcon.viewBox} focusable="false" aria-label={platformIcon.label}>
                  {platformIcon.shapes.map((shape, shapeIndex) => renderPlatformShape(shape, shapeIndex))}
                </svg>
              </span>
            ) : null}
            <h3>{entry.label}</h3>
            {entry.presentation?.badgeLabel ? (
              <span className="entry-brand-badge">{entry.presentation.badgeLabel}</span>
            ) : null}
          </div>
        </div>

        {entry.kind === 'contact' ? <p className="entry-value">{entry.value}</p> : null}
        {entry.kind === 'combo' ? <p className="entry-value">{entry.value}</p> : null}

        <p className="entry-detail">{entry.detail}</p>
        {entry.linkText ? <p className="entry-link">{entry.linkText}</p> : null}
      </div>

      {entry.kind === 'media' || entry.kind === 'combo' ? (
        <div className="entry-preview">
          <img
            src={entry.imageUrl}
            alt={entry.alt}
            width={entry.width}
            height={entry.height}
            loading="lazy"
          />
        </div>
      ) : null}
    </>
  );

  if ('href' in entry && entry.href) {
    return (
      <a
        className={className}
        style={style}
        href={entry.href}
        target="_blank"
        rel="noopener noreferrer"
        role="listitem"
      >
        {content}
      </a>
    );
  }

  return (
    <article className={className} style={style} role="listitem">
      {content}
    </article>
  );
}

export function AboutSnapshotRuntimeView({
  model,
  refreshState,
}: {
  model: AboutPageModel;
  refreshState: AboutRefreshState;
}) {
  const copy = refreshCopy[model.locale];
  const formattedUpdatedAt = formatSnapshotUpdatedAt(model.snapshot.updatedAt);
  const orderedSections = [...model.sections].sort(
    (left, right) => (sectionOrder.get(left.id) ?? Number.MAX_SAFE_INTEGER) - (sectionOrder.get(right.id) ?? Number.MAX_SAFE_INTEGER),
  );

  return (
    <main className="about-page" data-about-refresh-state={refreshState}>
      <section className="about-status-panel" aria-live="polite">
        <div className="about-shell about-status-shell">
          <p className="about-status-eyebrow">{copy.eyebrow}</p>
          <div className="about-status-grid">
            <p className="about-status-value">{copy.states[refreshState]}</p>
            <p className="about-status-meta">
              <span>
                {copy.updatedAtLabel}: <time dateTime={model.snapshot.updatedAt}>{formattedUpdatedAt}</time>
              </span>
              <span>{copy.versionLabel}: {model.snapshot.version}</span>
            </p>
          </div>
        </div>
      </section>

      <section className="about-sections">
        <div className="about-shell section-stack">
          {orderedSections.map((section) => (
            <section
              className={getSectionClassName(section.id)}
              data-about-section={section.id}
              id={`about-${section.id}`}
              key={section.id}
            >
              <header className="section-header">
                <h2>{section.title}</h2>
              </header>

              <div className="entry-list" role="list">
                {section.entries.map((entry, index) => (
                  <AboutEntryCard entry={entry} index={index} key={`${section.id}-${entry.id}`} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function AboutSnapshotRuntime({ model: initialModel }: AboutSnapshotRuntimeProps) {
  const [model, setModel] = useState(initialModel);
  const [refreshState, setRefreshState] = useState<AboutRefreshState>('static');

  useEffect(() => {
    const bundledSnapshot = getBundledAboutSnapshot();
    const controller = new AbortController();

    setModel(initialModel);
    setRefreshState('refreshing');

    const loadLatestSnapshot = async () => {
      try {
        const latestSnapshot = await fetchCanonicalAboutSnapshot(fetch, {
          signal: controller.signal,
        });
        const latestModel = buildAboutPageModel(initialModel.locale, latestSnapshot);
        const hasSnapshotDiff = hasAboutSnapshotMaterialChange(bundledSnapshot, latestSnapshot);
        const hasModelDiff = hasAboutPageModelMaterialChange(initialModel, latestModel);

        if (!hasSnapshotDiff && !hasModelDiff) {
          setRefreshState('noop');
          return;
        }

        startTransition(() => {
          setModel(latestModel);
          setRefreshState('synced');
        });
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }

        setRefreshState('fallback');
      }
    };

    void loadLatestSnapshot();

    return () => {
      controller.abort();
    };
  }, [initialModel]);

  return <AboutSnapshotRuntimeView model={model} refreshState={refreshState} />;
}

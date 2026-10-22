import { startTransition, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';

import {
  buildAboutPageModel,
  hasAboutPageModelMaterialChange,
  type AboutPageEntry,
  type AboutPageModel,
  type AboutPageSection,
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

const sectionOrder = new Map<AboutPageSectionId, number>([
  ['store', 0],
  ['community', 1],
  ['content', 2],
]);

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
  'windows-store': {
    tone: 'sky',
    viewBox: '0 0 24 24',
    label: 'Microsoft Store',
    shapes: [
      { type: 'path', d: 'M4.6 4.6h6.4v6.4H4.6V4.6Z', fill: 'white' },
      { type: 'path', d: 'M13 4.6h6.4v6.4H13V4.6Z', fill: 'white' },
      { type: 'path', d: 'M4.6 13h6.4v6.4H4.6V13Z', fill: 'white' },
      { type: 'path', d: 'M13 13h6.4v6.4H13V13Z', fill: 'white' },
    ],
  },
  'product-hunt': {
    tone: 'hot',
    viewBox: '0 0 24 24',
    label: 'Product Hunt',
    shapes: [
      { type: 'circle', cx: 12, cy: 12, r: 7.2, stroke: 'white', strokeWidth: 1.7 },
      { type: 'text', x: 12, y: 12.6, value: 'P', fontSize: 8.6, fontWeight: 900, fill: 'white', textAnchor: 'middle' },
    ],
  },
};

const FALLBACK_TONE = 'default';

function getPlatformIcon(entry: AboutPageEntry): PlatformIconDefinition | null {
  const iconKey = platformIconAliases[entry.id] ?? entry.id;
  return platformIcons[iconKey] ?? null;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

function isScannable(entry: AboutPageEntry): entry is Extract<AboutPageEntry, { imageUrl: string }> {
  return entry.kind === 'media' || entry.kind === 'combo';
}

function getEntryTone(entry: AboutPageEntry): string {
  if (entry.presentation?.theme === 'youtube') {
    return 'youtube';
  }

  if (entry.presentation?.theme === 'steam') {
    return 'steam';
  }

  return getPlatformIcon(entry)?.tone ?? FALLBACK_TONE;
}

function getEntryHandle(entry: AboutPageEntry): string | null {
  return entry.kind === 'contact' || entry.kind === 'combo' ? entry.value : null;
}

function getEntryHref(entry: AboutPageEntry): string | undefined {
  return 'href' in entry ? entry.href : undefined;
}

function getSectionClassName(sectionId: AboutPageSectionId) {
  return `section-block section-block-${sectionId}`;
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


function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        d="M4 12 12 4M5.5 4H12v6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EntryIcon({ entry, size }: { entry: AboutPageEntry; size: 'sm' | 'md' | 'lg' }) {
  const icon = getPlatformIcon(entry);

  if (!icon) {
    return null;
  }

  return (
    <span
      className={`platform-icon platform-icon-${size} entry-platform-icon-tone-${icon.tone}`}
      aria-hidden="true"
    >
      <svg viewBox={icon.viewBox} focusable="false">
        {icon.shapes.map((shape, shapeIndex) => renderPlatformShape(shape, shapeIndex))}
      </svg>
    </span>
  );
}

function CopyHandleButton({ value, copy, copied }: { value: string; copy: string; copied: string }) {
  const [didCopy, setDidCopy] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }
    },
    [],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }

    setDidCopy(true);

    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
    }

    resetTimer.current = setTimeout(() => setDidCopy(false), 1800);
  };

  return (
    <button
      type="button"
      className="handle-copy"
      data-copied={didCopy ? 'true' : undefined}
      onClick={() => void handleCopy()}
      aria-label={`${copy}: ${value}`}
    >
      <span aria-live="polite">{didCopy ? copied : copy}</span>
    </button>
  );
}

function ScanTile({ entry }: { entry: Extract<AboutPageEntry, { imageUrl: string }> }) {
  return (
    <span className="scan-tile">
      <img src={entry.imageUrl} alt={entry.alt} width={entry.width} height={entry.height} loading="lazy" />
    </span>
  );
}

function EntryLink({ entry }: { entry: AboutPageEntry }) {
  const href = getEntryHref(entry);

  if (!href || !entry.linkText) {
    return null;
  }

  return (
    <a className="entry-cta" href={href} target="_blank" rel="noopener noreferrer">
      <span>{entry.linkText}</span>
      <ArrowIcon />
    </a>
  );
}

function StorePanel({ entry }: { entry: AboutPageEntry }) {
  return (
    <article className="store-panel" data-tone={getEntryTone(entry)}>
      <div className="store-panel__body">
        <span className="entry-kind">{entry.kindLabel}</span>
        <div className="store-panel__title">
          <EntryIcon entry={entry} size="lg" />
          <h3>{entry.label}</h3>
          {entry.presentation?.badgeLabel ? (
            <span className="entry-brand-badge">{entry.presentation.badgeLabel}</span>
          ) : null}
        </div>
        <p className="entry-detail">{entry.detail}</p>
        <EntryLink entry={entry} />
      </div>
      <div className="store-panel__panes" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
    </article>
  );
}

function CommunityCard({
  entry,
  index,
  copyLabels,
}: {
  entry: AboutPageEntry;
  index: number;
  copyLabels: AboutPageModel['ui'];
}) {
  const handle = getEntryHandle(entry);
  const href = getEntryHref(entry);
  const style = { ['--i' as string]: index } as CSSProperties;

  return (
    <li
      className={`community-card community-card-${entry.kind}`}
      data-tone={getEntryTone(entry)}
      data-linked={href ? 'true' : undefined}
      style={style}
    >
      {isScannable(entry) ? <ScanTile entry={entry} /> : null}
      <div className="community-card__body">
        <span className="entry-kind">{entry.kindLabel}</span>
        <div className="community-card__title">
          {isScannable(entry) ? null : <EntryIcon entry={entry} size="md" />}
          <h3>{entry.label}</h3>
        </div>
        {handle ? (
          <p className="handle">
            <span className="handle-value">{handle}</span>
            <CopyHandleButton value={handle} copy={copyLabels.copy} copied={copyLabels.copied} />
          </p>
        ) : null}
        <p className="entry-detail">{entry.detail}</p>
        <EntryLink entry={entry} />
      </div>
    </li>
  );
}

function ScanCard({
  entry,
  copyLabels,
}: {
  entry: Extract<AboutPageEntry, { imageUrl: string }>;
  copyLabels: AboutPageModel['ui'];
}) {
  const handle = getEntryHandle(entry);

  return (
    <li className="scan-card" data-tone={getEntryTone(entry)}>
      <ScanTile entry={entry} />
      <div className="scan-card__body">
        <span className="entry-kind">{entry.kindLabel}</span>
        <div className="scan-card__title">
          <EntryIcon entry={entry} size="md" />
          <h3>{entry.label}</h3>
        </div>
        {handle ? (
          <p className="handle">
            <span className="handle-value">{handle}</span>
            <CopyHandleButton value={handle} copy={copyLabels.copy} copied={copyLabels.copied} />
          </p>
        ) : null}
        <p className="entry-detail">{entry.detail}</p>
        <EntryLink entry={entry} />
      </div>
    </li>
  );
}

function ChannelWall({ entries }: { entries: readonly AboutPageEntry[] }) {
  const wallRef = useRef<HTMLUListElement | null>(null);
  const frameRef = useRef(0);

  const handlePointerMove = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== 'mouse' || !wallRef.current) {
      return;
    }

    const wall = wallRef.current;
    const { clientX, clientY } = event;

    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const bounds = wall.getBoundingClientRect();

      wall.style.setProperty('--mx', `${clientX - bounds.left}px`);
      wall.style.setProperty('--my', `${clientY - bounds.top}px`);
      wall.dataset.lit = 'true';
    });
  };

  const handlePointerLeave = () => {
    cancelAnimationFrame(frameRef.current);

    if (wallRef.current) {
      delete wallRef.current.dataset.lit;
    }
  };

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  return (
    <ul className="channel-wall" ref={wallRef} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      {entries.map((entry) => {
        const href = getEntryHref(entry);
        const handle = getEntryHandle(entry);
        const body = (
          <>
            <EntryIcon entry={entry} size="sm" />
            <span className="channel-tile__text">
              <strong>{entry.label}</strong>
              <span className={handle ? 'channel-tile__detail channel-tile__handle' : 'channel-tile__detail'}>
                {handle ?? entry.detail}
              </span>
            </span>
            {entry.presentation?.badgeLabel ? (
              <span className="entry-brand-badge">{entry.presentation.badgeLabel}</span>
            ) : null}
            {href ? <ArrowIcon className="channel-tile__arrow" /> : null}
          </>
        );

        return (
          <li key={entry.id} data-tone={getEntryTone(entry)}>
            {href ? (
              <a className="channel-tile" href={href} target="_blank" rel="noopener noreferrer">
                {body}
              </a>
            ) : (
              <div className="channel-tile">{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function StoreSection({ entries }: { entries: readonly AboutPageEntry[] }) {
  const [primary, ...rest] = entries;

  if (!primary) {
    return null;
  }

  return (
    <div className="store-stack">
      <StorePanel entry={primary} />
      {rest.length > 0 ? (
        <ul className="channel-wall channel-wall-static">
          {rest.map((entry) => {
            const href = getEntryHref(entry);

            return (
              <li key={entry.id} data-tone={getEntryTone(entry)}>
                <a className="channel-tile" href={href} target="_blank" rel="noopener noreferrer">
                  <EntryIcon entry={entry} size="sm" />
                  <span className="channel-tile__text">
                    <strong>{entry.label}</strong>
                    <span className="channel-tile__detail">{entry.detail}</span>
                  </span>
                  <ArrowIcon className="channel-tile__arrow" />
                </a>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function CommunitySection({ entries, copyLabels }: { entries: readonly AboutPageEntry[]; copyLabels: AboutPageModel['ui'] }) {
  return (
    <ul className="community-grid">
      {entries.map((entry, index) => (
        <CommunityCard entry={entry} index={index} copyLabels={copyLabels} key={entry.id} />
      ))}
    </ul>
  );
}

function ContentSection({ entries, copyLabels }: { entries: readonly AboutPageEntry[]; copyLabels: AboutPageModel['ui'] }) {
  const scannable = entries.filter(isScannable);
  const directory = entries.filter((entry) => !isScannable(entry));

  return (
    <div className="content-stack">
      {scannable.length > 0 ? (
        <ul className="scan-row" data-count={scannable.length}>
          {scannable.map((entry) => (
            <ScanCard entry={entry} copyLabels={copyLabels} key={entry.id} />
          ))}
        </ul>
      ) : null}
      {directory.length > 0 ? <ChannelWall entries={directory} /> : null}
    </div>
  );
}

function SectionBody({ section, copyLabels }: { section: AboutPageSection; copyLabels: AboutPageModel['ui'] }) {
  if (section.id === 'store') {
    return <StoreSection entries={section.entries} />;
  }

  if (section.id === 'community') {
    return <CommunitySection entries={section.entries} copyLabels={copyLabels} />;
  }

  return <ContentSection entries={section.entries} copyLabels={copyLabels} />;
}

export function AboutSnapshotRuntimeView({
  model,
  refreshState,
}: {
  model: AboutPageModel;
  refreshState: AboutRefreshState;
}) {
  const orderedSections = [...model.sections].sort(
    (left, right) => (sectionOrder.get(left.id) ?? Number.MAX_SAFE_INTEGER) - (sectionOrder.get(right.id) ?? Number.MAX_SAFE_INTEGER),
  );

  return (
    <main className="about-page" data-about-refresh-state={refreshState}>
      <section className="about-hero">
        <div className="about-shell about-hero__grid">
          <h1 style={{ ['--i' as string]: 0 } as CSSProperties}>{model.header.title}</h1>
          <ul className="about-index">
            {orderedSections.map((section, index) => (
              <li key={section.id} style={{ ['--i' as string]: index + 1 } as CSSProperties}>
                <a href={`#about-${section.id}`}>
                  <span className="about-index__title">{section.title}</span>
                  <span className="about-index__count">{section.entries.length}</span>
                  <ArrowIcon className="about-index__arrow" />
                </a>
              </li>
            ))}
          </ul>
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
              <SectionBody section={section} copyLabels={model.ui} />
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

import { useEffect, useRef, useState, type ImgHTMLAttributes, type SVGProps } from 'react';
import type { HomepageShowcaseCopy } from '@/lib/homepage-section-copy';
import styles from './ShowcaseSection.module.css';

export type ScreenshotId = HomepageShowcaseCopy['screenshots'][number]['id'];

export interface ShowcaseSourceSet {
  avif: string;
  webp: string;
  src: string;
}

export interface ShowcaseImageSources extends ShowcaseSourceSet {
  width: number;
  height: number;
  /** One small rendition for the filmstrip and as the lightbox's instant first paint. */
  thumb: ShowcaseSourceSet;
}

export interface ScreenshotItem {
  id: ScreenshotId;
  sources: ShowcaseImageSources;
  title: string;
  description: string;
  alt: string;
}

/** Slow spring-out used by every authored move in the section. */
export const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function formatOrder(index: number) {
  return String(index + 1).padStart(2, '0');
}

/** A broken image must not stall a slide change, so a capture counts as settled after this long. */
const SETTLE_TIMEOUT_MS = 3000;

interface ShotProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  sources: ShowcaseSourceSet;
  fallbackLabel: string;
  /** Called once when the capture is loaded and decoded (or has failed), so it can be shown without a blank frame. */
  onSettled?: () => void;
}

export function Shot({ sources, sizes, fallbackLabel, onSettled, alt, ...imgProps }: ShotProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const settledRef = useRef(onSettled);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    settledRef.current = onSettled;
  });

  useEffect(() => {
    const img = imgRef.current;
    if (!img) {
      return undefined;
    }

    let done = false;
    const finish = () => {
      if (!done) {
        done = true;
        settledRef.current?.();
      }
    };
    const settle = () => {
      if (typeof img.decode === 'function') {
        img.decode().then(finish, finish);
      } else {
        finish();
      }
    };

    const timer = window.setTimeout(finish, SETTLE_TIMEOUT_MS);
    img.addEventListener('load', settle);
    img.addEventListener('error', finish);
    if (img.complete) {
      if (img.naturalWidth > 0) {
        settle();
      } else {
        finish();
      }
    }

    return () => {
      done = true;
      window.clearTimeout(timer);
      img.removeEventListener('load', settle);
      img.removeEventListener('error', finish);
    };
  }, []);

  if (failed) {
    return (
      <span className={styles.fallback} role="img" aria-label={alt}>
        {fallbackLabel}
      </span>
    );
  }

  return (
    <picture>
      <source type="image/avif" srcSet={sources.avif} sizes={sizes} />
      <source type="image/webp" srcSet={sources.webp} sizes={sizes} />
      <img ref={imgRef} src={sources.src} alt={alt} decoding="async" onError={() => setFailed(true)} {...imgProps} />
    </picture>
  );
}

function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <Icon>
      <path d={direction === 'left' ? 'M12.5 4.5 7 10l5.5 5.5' : 'M7.5 4.5 13 10l-5.5 5.5'} />
    </Icon>
  );
}

export function ExpandIcon() {
  return (
    <Icon>
      <path d="M12 4h4v4M8 16H4v-4M16 4l-4.5 4.5M4 16l4.5-4.5" />
    </Icon>
  );
}

export function ZoomIcon({ out }: { out: boolean }) {
  return (
    <Icon>
      <circle cx="9" cy="9" r="5" />
      <path d="m13 13 3.5 3.5M7 9h4" />
      {out ? null : <path d="M9 7v4" />}
    </Icon>
  );
}

export function CloseIcon() {
  return (
    <Icon>
      <path d="M5 5l10 10M15 5 5 15" />
    </Icon>
  );
}

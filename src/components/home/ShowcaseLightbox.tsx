import { flushSync } from 'react-dom';
import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import type { HomepageShowcaseCopy } from '@/lib/homepage-section-copy';
import {
  ChevronIcon,
  CloseIcon,
  EASE_OUT,
  Shot,
  ZoomIcon,
  formatOrder,
  prefersReducedMotion,
  type ScreenshotItem,
} from './ShowcaseParts';
import styles from './ShowcaseSection.module.css';

interface Props {
  screenshots: ScreenshotItem[];
  index: number;
  copy: HomepageShowcaseCopy;
  /** The stage the capture grows out of and shrinks back into. */
  getOrigin: () => HTMLElement | null;
  onNavigate: (index: number) => void;
  onClose: () => void;
}

const SWIPE_DISTANCE = 56;
const DRAG_THRESHOLD = 4;

/** Animates `el` from where `from` was on screen to where it is now (translate and uniform-ish scale from the top-left corner). */
function flyFrom(el: HTMLElement, from: DOMRect, options: KeyframeAnimationOptions) {
  const to = el.getBoundingClientRect();
  return el.animate(
    [
      {
        transformOrigin: '0 0',
        transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`,
      },
      { transformOrigin: '0 0', transform: 'none' },
    ],
    options,
  );
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export default function ShowcaseLightbox({ screenshots, index, copy, getOrigin, onNavigate, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const zoomAnchorRef = useRef<{ fx: number; fy: number; from: DOMRect } | null>(null);
  const dragRef = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);
  const [zoom, setZoom] = useState(false);
  const [fullReady, setFullReady] = useState<number | null>(null);

  const shot = screenshots[index];
  const last = screenshots.length - 1;
  const neighbours = [index - 1, index + 1].filter((i) => i >= 0 && i <= last);

  // Open: show the modal, lock page scroll, and let the capture grow out of the stage.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const frame = frameRef.current;
    if (!dialog || !frame) {
      return undefined;
    }

    dialog.showModal();

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (gutter > 0) {
      body.style.paddingRight = `${gutter}px`;
    }

    if (!prefersReducedMotion()) {
      const origin = getOrigin()?.getBoundingClientRect();
      if (origin && origin.width > 0) {
        flyFrom(frame, origin, { duration: 520, easing: EASE_OUT });
        scrimRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, easing: 'ease-out' });
        for (const chrome of [topRef.current, bottomRef.current]) {
          chrome?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 280, delay: 240, easing: 'ease-out', fill: 'backwards' });
        }
      } else {
        dialog.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, easing: 'ease-out' });
      }
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      if (dialog.open) {
        dialog.close();
      }
    };
    // Runs once on mount; the origin getter reads a ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Zoom: keep the point that was clicked under the pointer, and let the frame fly between the two sizes.
  useLayoutEffect(() => {
    const anchor = zoomAnchorRef.current;
    zoomAnchorRef.current = null;
    const viewport = viewportRef.current;
    const frame = frameRef.current;
    if (!anchor || !viewport || !frame || closingRef.current) {
      return;
    }

    if (zoom) {
      const f = frame.getBoundingClientRect();
      const v = viewport.getBoundingClientRect();
      viewport.scrollLeft = f.left - v.left + viewport.scrollLeft + anchor.fx * f.width - viewport.clientWidth / 2;
      viewport.scrollTop = f.top - v.top + viewport.scrollTop + anchor.fy * f.height - viewport.clientHeight / 2;
    } else {
      viewport.scrollLeft = 0;
      viewport.scrollTop = 0;
    }

    if (!prefersReducedMotion()) {
      flyFrom(frame, anchor.from, { duration: 320, easing: EASE_OUT });
    }
  }, [zoom]);

  const toggleZoom = (clientX?: number, clientY?: number) => {
    const frame = frameRef.current;
    if (!frame) {
      return;
    }

    const rect = frame.getBoundingClientRect();
    zoomAnchorRef.current = {
      fx: clientX === undefined ? 0.5 : clamp01((clientX - rect.left) / rect.width),
      fy: clientY === undefined ? 0.5 : clamp01((clientY - rect.top) / rect.height),
      from: rect,
    };
    setZoom((current) => !current);
  };

  const requestClose = () => {
    const dialog = dialogRef.current;
    const frame = frameRef.current;
    if (closingRef.current || !dialog || !frame) {
      return;
    }
    closingRef.current = true;

    if (zoom) {
      flushSync(() => setZoom(false));
      const viewport = viewportRef.current;
      if (viewport) {
        viewport.scrollLeft = 0;
        viewport.scrollTop = 0;
      }
    }

    let finished = false;
    const finish = () => {
      if (finished) {
        return;
      }
      finished = true;
      if (dialog.open) {
        dialog.close();
      }
      onClose();
    };

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    const fade = (el: HTMLElement | null, duration: number) =>
      el?.animate([{ opacity: 1 }, { opacity: 0 }], { duration, easing: 'ease-in', fill: 'forwards' });

    fade(scrimRef.current, 380);
    fade(topRef.current, 160);
    fade(bottomRef.current, 160);

    const origin = getOrigin()?.getBoundingClientRect();
    const onScreen = origin && origin.width > 0 && origin.bottom > 0 && origin.top < window.innerHeight;
    if (onScreen) {
      const to = frame.getBoundingClientRect();
      frame
        .animate(
          [
            { transformOrigin: '0 0', transform: 'none' },
            {
              transformOrigin: '0 0',
              transform: `translate(${origin.left - to.left}px, ${origin.top - to.top}px) scale(${origin.width / to.width}, ${origin.height / to.height})`,
            },
          ],
          { duration: 400, easing: 'cubic-bezier(0.5, 0, 0.1, 1)', fill: 'forwards' },
        )
        .finished.then(finish, finish);
    } else {
      fade(frame, 240)?.finished.then(finish, finish);
    }
  };

  const go = (delta: number) => {
    const next = Math.min(last, Math.max(0, index + delta));
    if (next !== index) {
      onNavigate(next);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (zoom) {
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(1);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    movedRef.current = false;
    if (!viewport) {
      return;
    }

    if (event.pointerType === 'mouse') {
      if (zoom && event.button === 0) {
        dragRef.current = { x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
        viewport.setPointerCapture(event.pointerId);
      }
    } else if (!zoom) {
      swipeRef.current = { x: event.clientX, y: event.clientY };
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const viewport = viewportRef.current;
    if (!drag || !viewport) {
      return;
    }

    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) {
      movedRef.current = true;
    }
    viewport.scrollLeft = drag.left - dx;
    viewport.scrollTop = drag.top - dy;
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    dragRef.current = null;

    const swipe = swipeRef.current;
    swipeRef.current = null;
    if (!swipe || event.type === 'pointercancel') {
      return;
    }

    const dx = event.clientX - swipe.x;
    const dy = event.clientY - swipe.y;
    if (Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.5) {
      movedRef.current = true;
      go(dx < 0 ? 1 : -1);
    }
  };

  if (!shot) {
    return null;
  }

  const frameStyle = {
    '--shot-ar': `${shot.sources.width} / ${shot.sources.height}`,
    '--shot-w': `${shot.sources.width}px`,
  } as CSSProperties;

  return (
    <dialog
      ref={dialogRef}
      className={styles.lightbox}
      aria-label={shot.title}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onKeyDown={handleKeyDown}
    >
      <div ref={scrimRef} className={styles.lbScrim} aria-hidden="true" />

      <div
        ref={viewportRef}
        className={styles.lbViewport}
        data-zoom={zoom ? 'true' : undefined}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onClick={(event) => {
          if (event.target === event.currentTarget && !movedRef.current) {
            requestClose();
          }
        }}
      >
        <div
          ref={frameRef}
          className={styles.lbFrame}
          style={frameStyle}
          onClick={(event) => {
            if (!movedRef.current) {
              toggleZoom(event.clientX, event.clientY);
            }
          }}
        >
          <span className={styles.lbLayer} key={`thumb-${shot.id}`}>
            <Shot sources={shot.sources.thumb} alt="" fallbackLabel="" />
          </span>
          <span className={`${styles.lbLayer} ${styles.lbFull}`} key={`full-${shot.id}`} data-ready={fullReady === index ? 'true' : undefined}>
            <Shot
              sources={shot.sources}
              sizes={zoom ? `${shot.sources.width}px` : '100vw'}
              alt={shot.alt}
              fallbackLabel={copy.controls.imageUnavailable}
              onSettled={() => setFullReady(index)}
            />
          </span>
        </div>
      </div>

      <div ref={topRef} className={styles.lbTop}>
        <p className={styles.lbCounter}>
          <span className={styles.counterNow}>{formatOrder(index)}</span> / {formatOrder(last)}
        </p>
        <div className={styles.lbActions}>
          <button
            type="button"
            className={styles.lbButton}
            onClick={() => toggleZoom()}
            aria-pressed={zoom}
          >
            <ZoomIcon out={zoom} />
            <span className={styles.lbButtonText}>{zoom ? copy.controls.zoomOut : copy.controls.zoomIn}</span>
          </button>
          <button type="button" className={styles.lbButton} onClick={requestClose} autoFocus>
            <CloseIcon />
            <span className={styles.lbButtonText}>{copy.controls.closeFullscreen}</span>
          </button>
        </div>
      </div>

      <div ref={bottomRef} className={styles.lbBottom}>
        <div className={styles.lbCaption}>
          <h3 className={styles.lbTitle}>{shot.title}</h3>
          <p className={styles.lbDescription}>{shot.description}</p>
        </div>
        <div className={styles.navGroup}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => go(-1)}
            disabled={index === 0}
            aria-label={copy.controls.previous}
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => go(1)}
            disabled={index === last}
            aria-label={copy.controls.next}
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>

      <div hidden aria-hidden="true">
        {neighbours.map((i) => (
          <Shot
            key={screenshots[i].id}
            sources={screenshots[i].sources}
            sizes="100vw"
            alt=""
            fallbackLabel=""
            loading="eager"
          />
        ))}
      </div>
    </dialog>
  );
}

// @vitest-environment jsdom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { stubMatchMedia } from '@/lib/analytics/test-harness';
import { getHomepageShowcaseCopy } from '@/lib/homepage-section-copy';
import ShowcaseSection from './ShowcaseSection';
import type { ScreenshotId, ShowcaseImageSources } from './ShowcaseParts';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const copy = getHomepageShowcaseCopy('en-US');

function sourcesFor(id: string): ShowcaseImageSources {
  const set = { avif: `/${id}.avif 960w`, webp: `/${id}.webp 960w`, src: `/${id}.png` };
  return { ...set, width: 2400, height: 1500, thumb: { avif: `/${id}-t.avif`, webp: `/${id}-t.webp`, src: `/${id}-t.webp` } };
}

const images = Object.fromEntries(copy.screenshots.map((shot) => [shot.id, sourcesFor(shot.id)])) as Record<ScreenshotId, ShowcaseImageSources>;

let root: Root | null = null;
let container: HTMLDivElement | null = null;

async function mount() {
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  await act(async () => {
    root?.render(<ShowcaseSection copy={copy} images={images} />);
  });
  return container;
}

/**
 * Jsdom never loads images, so a capture settles through the 3 s fallback, then the entry runs. React only
 * schedules the entry's timer once the first act has flushed, hence two steps.
 */
async function settle() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(3500);
  });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1500);
  });
}

const tabs = () => [...(container as HTMLDivElement).querySelectorAll<HTMLButtonElement>('[role="tab"]')];
const selectedTitle = () => tabs().find((tab) => tab.getAttribute('aria-selected') === 'true')?.textContent;
const counter = () => (container as HTMLDivElement).querySelector<HTMLElement>('[class*="counter"]')?.textContent?.replace(/\s+/g, ' ').trim();
const layers = () => [...(container as HTMLDivElement).querySelectorAll<HTMLElement>('[data-phase]')];
const activeCaption = () => (container as HTMLDivElement).querySelector('[data-active="true"] h3')?.textContent;

describe('homepage showcase', () => {
  beforeAll(() => {
    stubMatchMedia();
    Object.defineProperty(Element.prototype, 'animate', {
      configurable: true,
      value: () => ({ finished: Promise.resolve() }),
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value(this: HTMLDialogElement) {
        this.setAttribute('open', '');
      },
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
      configurable: true,
      value(this: HTMLDialogElement) {
        this.removeAttribute('open');
      },
    });
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(async () => {
    await act(async () => root?.unmount());
    container?.remove();
    root = null;
    container = null;
    vi.useRealTimers();
  });

  it('lists every screenshot as a tab and a caption, starting on the first', async () => {
    await mount();

    expect(tabs()).toHaveLength(copy.screenshots.length);
    expect(selectedTitle()).toBe(copy.screenshots[0].title);
    expect(activeCaption()).toBe(copy.screenshots[0].title);
    expect(counter()).toBe('01 / 10');
    expect(layers()).toHaveLength(1);
    expect(document.querySelector('dialog')).toBeNull();
  });

  it('selects at once and moves the stage once the next capture has settled', async () => {
    await mount();

    await act(async () => tabs()[3].click());
    expect(selectedTitle()).toBe(copy.screenshots[3].title);
    expect(activeCaption()).toBe(copy.screenshots[0].title);
    expect(layers().map((layer) => layer.dataset.phase)).toEqual(['rest', 'wait']);

    await settle();
    expect(activeCaption()).toBe(copy.screenshots[3].title);
    expect(counter()).toBe('04 / 10');
    expect(layers().map((layer) => layer.dataset.phase)).toEqual(['rest']);
  });

  it('ends on the last choice after a run of fast clicks, with one layer left', async () => {
    await mount();

    for (const index of [6, 1, 8, 2, 9]) {
      await act(async () => {
        tabs()[index].click();
        await vi.advanceTimersByTimeAsync(80);
      });
    }

    await settle();
    expect(selectedTitle()).toBe(copy.screenshots[9].title);
    expect(activeCaption()).toBe(copy.screenshots[9].title);
    expect(layers().map((layer) => layer.dataset.phase)).toEqual(['rest']);
  });

  it('moves between tabs with the arrow, Home and End keys', async () => {
    await mount();

    const press = async (key: string) => {
      const selected = tabs().find((tab) => tab.getAttribute('aria-selected') === 'true') as HTMLButtonElement;
      await act(async () => {
        selected.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
      });
    };

    await press('ArrowRight');
    expect(selectedTitle()).toBe(copy.screenshots[1].title);
    await press('End');
    expect(selectedTitle()).toBe(copy.screenshots[9].title);
    await press('ArrowRight');
    expect(selectedTitle()).toBe(copy.screenshots[9].title);
    await press('Home');
    expect(selectedTitle()).toBe(copy.screenshots[0].title);
  });

  it('disables the step buttons at either end', async () => {
    await mount();

    const [previous, next] = [...(container as HTMLDivElement).querySelectorAll<HTMLButtonElement>('[class*="navGroup"] button')];
    expect(previous.disabled).toBe(true);
    expect(next.disabled).toBe(false);

    await act(async () => tabs()[9].click());
    expect(previous.disabled).toBe(false);
    expect(next.disabled).toBe(true);
  });

  it('opens a modal dialog from the enlarge button, steps through it and closes on Escape', async () => {
    await mount();

    await act(async () => (container as HTMLDivElement).querySelector<HTMLButtonElement>('[class*="enlarge"]')?.click());
    const dialog = document.querySelector('dialog') as HTMLDialogElement;
    expect(dialog.hasAttribute('open')).toBe(true);
    expect(dialog.getAttribute('aria-label')).toBe(copy.screenshots[0].title);

    await act(async () => {
      dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    });
    expect(dialog.getAttribute('aria-label')).toBe(copy.screenshots[1].title);
    expect(selectedTitle()).toBe(copy.screenshots[1].title);

    await act(async () => {
      dialog.dispatchEvent(new Event('cancel', { bubbles: false, cancelable: true }));
      await vi.advanceTimersByTimeAsync(600);
    });
    expect(document.querySelector('dialog')).toBeNull();
  });
});

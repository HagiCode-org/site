// @vitest-environment jsdom
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { pickR2PoolImage, R2_POOL_TIMEOUT_MS } from './r2-random-image';

const POOL = [
  'https://pool.test/hero-avatars/a.avif',
  'https://pool.test/hero-avatars/b.avif',
  'https://pool.test/hero-avatars/c.avif',
  'https://pool.test/hero-avatars/d.avif',
];

/** A preload element whose outcome the test decides. */
class FakeImage {
  static created: FakeImage[] = [];
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src = '';

  constructor() {
    FakeImage.created.push(this);
  }

  load() {
    this.onload?.();
  }

  fail() {
    this.onerror?.();
  }
}

function setupSlot() {
  document.body.innerHTML = `
    <div class="persona">
      <picture class="persona-picture">
        <source srcset="/default.avif" type="image/avif" />
        <source srcset="/default.webp" type="image/webp" />
        <img class="persona-avatar" src="/default.webp" alt="" width="56" height="56" />
      </picture>
    </div>`;
  return document.querySelector('img') as HTMLImageElement;
}

function pick(slot: HTMLImageElement, random: () => number, extra: object = {}) {
  return pickR2PoolImage(slot, POOL, { random, createImage: () => new FakeImage() as unknown as HTMLImageElement, saveData: false, ...extra });
}

describe('pickR2PoolImage', () => {
  beforeEach(() => {
    FakeImage.created = [];
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('picks uniformly: each index is chosen by its share of the random range', () => {
    const slot = setupSlot();
    const counts = new Map<string, number>();
    const steps = 4000;

    for (let step = 0; step < steps; step += 1) {
      pick(slot, () => (step + 0.5) / steps);
      const probe = FakeImage.created[step];
      counts.set(probe.src, (counts.get(probe.src) ?? 0) + 1);
    }

    expect([...counts.keys()].sort()).toEqual([...POOL].sort());
    for (const url of POOL) {
      expect(counts.get(url)).toBe(steps / POOL.length);
    }
  });

  it('starts exactly one preload per call and never calls fetch', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const slot = setupSlot();

    expect(pick(slot, () => 0.1)).toBe(true);
    expect(FakeImage.created).toHaveLength(1);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('swaps the entry into the same slot once it loads, and keeps the box and alt unchanged', () => {
    const slot = setupSlot();
    const box = { width: slot.getAttribute('width'), height: slot.getAttribute('height'), alt: slot.getAttribute('alt'), className: slot.className };

    pick(slot, () => 0.6);
    expect(slot.getAttribute('src')).toBe('/default.webp');
    FakeImage.created[0].load();

    expect(slot.getAttribute('src')).toBe(POOL[2]);
    expect(slot.hasAttribute('srcset')).toBe(false);
    expect(document.querySelectorAll('picture > source[srcset]')).toHaveLength(0);
    expect({ width: slot.getAttribute('width'), height: slot.getAttribute('height'), alt: slot.getAttribute('alt'), className: slot.className }).toEqual(box);
  });

  it('keeps the default when the entry errors, and does not retry', () => {
    const slot = setupSlot();

    pick(slot, () => 0.1);
    FakeImage.created[0].fail();
    vi.advanceTimersByTime(R2_POOL_TIMEOUT_MS * 2);

    expect(slot.getAttribute('src')).toBe('/default.webp');
    expect(FakeImage.created).toHaveLength(1);
  });

  it('keeps the default when the entry loads after the timeout', () => {
    const slot = setupSlot();

    pick(slot, () => 0.1);
    vi.advanceTimersByTime(R2_POOL_TIMEOUT_MS);
    FakeImage.created[0].load();

    expect(slot.getAttribute('src')).toBe('/default.webp');
  });

  it('swaps when the entry loads just inside the timeout', () => {
    const slot = setupSlot();

    pick(slot, () => 0.1);
    vi.advanceTimersByTime(R2_POOL_TIMEOUT_MS - 1);
    FakeImage.created[0].load();

    expect(slot.getAttribute('src')).toBe(POOL[0]);
  });

  it('makes no request when the visitor asks for data saving', () => {
    const slot = setupSlot();

    expect(pick(slot, () => 0.1, { saveData: true })).toBe(false);
    expect(FakeImage.created).toHaveLength(0);
    expect(slot.getAttribute('src')).toBe('/default.webp');
  });

  it('makes no request when the pool is empty, which is how a site opts a slot out', () => {
    const slot = setupSlot();

    expect(pickR2PoolImage(slot, [], { createImage: () => new FakeImage() as unknown as HTMLImageElement, saveData: false })).toBe(false);
    expect(FakeImage.created).toHaveLength(0);
  });

  it('does not swap into a slot that was removed before the entry loaded', () => {
    const slot = setupSlot();

    pick(slot, () => 0.1);
    slot.remove();
    FakeImage.created[0].load();

    expect(slot.getAttribute('src')).toBe('/default.webp');
  });
});

describe('r2-random-image build', () => {
  it('minifies to at most 2 KiB and never calls fetch', async () => {
    const { build } = await import('vite');
    const result = await build({
      configFile: false,
      logLevel: 'silent',
      build: {
        write: false,
        minify: true,
        lib: { entry: resolve(process.cwd(), 'src/scripts/r2-random-image.ts'), formats: ['es'], fileName: 'picker' },
      },
    });
    const [output] = Array.isArray(result) ? result : [result];
    const chunk = (output as { output: Array<{ type: string; code?: string }> }).output.find((item) => item.type === 'chunk');
    const code = chunk?.code ?? '';

    expect(Buffer.byteLength(code)).toBeLessThanOrEqual(2048);
    expect(code).not.toMatch(/\bfetch\(/);
  }, 30_000);
});

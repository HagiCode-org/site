/**
 * Random display for decorative R2 slots. Each call picks one pool entry uniformly, preloads it
 * with a plain Image element and swaps it into the slot only if it loads within the timeout. The
 * vendored default stays in the markup for first paint, no-script readers and every failure.
 *
 * No fetch and no library: an image element needs no CORS, and a miss is silent.
 */

export const R2_POOL_TIMEOUT_MS = 3000;

export interface R2PoolPickOptions {
  /** Returns a number in [0, 1). Defaults to Math.random. */
  random?: () => number;
  /** Creates the preload element. Defaults to a plain Image. */
  createImage?: () => HTMLImageElement;
  /** Overrides the browser's data-saver preference. */
  saveData?: boolean;
  timeoutMs?: number;
}

function browserPrefersSaveData(): boolean {
  return (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
}

function swapIn(slot: HTMLImageElement, url: string) {
  if (!slot.isConnected) return;
  // A <source> inside the slot's <picture> would win over src, so its srcset is cleared. The slot
  // keeps its width, height and CSS, so the box does not move.
  slot.closest('picture')?.querySelectorAll('source').forEach((source) => source.removeAttribute('srcset'));
  slot.removeAttribute('srcset');
  slot.src = url;
}

/** Starts one preload for a random pool entry. Returns false when nothing was started. */
export function pickR2PoolImage(
  slot: HTMLImageElement,
  pool: readonly string[],
  options: R2PoolPickOptions = {},
): boolean {
  const saveData = options.saveData ?? browserPrefersSaveData();
  if (pool.length === 0 || saveData) return false;

  const random = options.random ?? Math.random;
  const url = pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))];
  const probe = options.createImage ? options.createImage() : new Image();
  let settled = false;
  const timer = setTimeout(() => {
    settled = true;
  }, options.timeoutMs ?? R2_POOL_TIMEOUT_MS);

  probe.onload = () => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    swapIn(slot, url);
  };
  probe.onerror = () => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
  };
  probe.src = url;
  return true;
}

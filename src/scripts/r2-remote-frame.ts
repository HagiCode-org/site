/**
 * Loads one rotating remote frame (a Fun-section cover that is not vendored) when the carousel
 * activates it. Nothing is requested before activation. The frame is preloaded with a plain Image
 * element, so the caller swaps it into the same box only if it loads within the timeout, and a
 * failure leaves the frame out without retrying.
 */
import { R2_POOL_TIMEOUT_MS } from './r2-random-image';

export interface R2RemoteFrameOptions {
  /** Creates the preload element. Defaults to a plain Image. */
  createImage?: () => HTMLImageElement;
  timeoutMs?: number;
}

/** Starts the preload. Returns a cancel function; the callback runs only on a successful load in time. */
export function loadR2RemoteFrame(url: string, onReady: () => void, options: R2RemoteFrameOptions = {}): () => void {
  const probe = options.createImage ? options.createImage() : new Image();
  let settled = false;
  const timer = setTimeout(() => {
    settled = true;
  }, options.timeoutMs ?? R2_POOL_TIMEOUT_MS);

  probe.onload = () => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    onReady();
  };
  probe.onerror = () => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
  };
  probe.src = url;

  return () => {
    settled = true;
    clearTimeout(timer);
  };
}

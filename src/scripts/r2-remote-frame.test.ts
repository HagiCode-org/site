// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { R2_POOL_TIMEOUT_MS } from './r2-random-image';
import { loadR2RemoteFrame } from './r2-remote-frame';

const FRAME = 'https://pool.test/cat-head-gallery/g003-watercolor-wash-02.avif';

class FakeImage {
  static created: FakeImage[] = [];
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src = '';

  constructor() {
    FakeImage.created.push(this);
  }
}

const options = () => ({ createImage: () => new FakeImage() as unknown as HTMLImageElement });

describe('loadR2RemoteFrame', () => {
  beforeEach(() => {
    FakeImage.created = [];
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('requests the frame once, when it is called, and never fetches', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    loadR2RemoteFrame(FRAME, () => {}, options());

    expect(FakeImage.created).toHaveLength(1);
    expect(FakeImage.created[0].src).toBe(FRAME);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it('calls back once the frame loads in time', () => {
    const onReady = vi.fn();
    loadR2RemoteFrame(FRAME, onReady, options());
    FakeImage.created[0].onload?.();

    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it('does not call back on error or after the timeout', () => {
    const onReady = vi.fn();
    loadR2RemoteFrame(FRAME, onReady, options());
    FakeImage.created[0].onerror?.();
    FakeImage.created[0].onload?.();

    const late = vi.fn();
    loadR2RemoteFrame(FRAME, late, options());
    vi.advanceTimersByTime(R2_POOL_TIMEOUT_MS);
    FakeImage.created[1].onload?.();

    expect(onReady).not.toHaveBeenCalled();
    expect(late).not.toHaveBeenCalled();
  });

  it('does not call back after it is cancelled', () => {
    const onReady = vi.fn();
    const cancel = loadR2RemoteFrame(FRAME, onReady, options());
    cancel();
    FakeImage.created[0].onload?.();

    expect(onReady).not.toHaveBeenCalled();
  });
});

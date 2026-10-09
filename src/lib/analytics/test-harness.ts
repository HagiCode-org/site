import { act, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { installGaEventTracking } from '@hagicode/hagilight-core/analytics-events';
import { vi } from 'vitest';
import { initializeWebsiteAnalytics } from './tracker';

declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

/**
 * jsdom helper for click tests: installs both reporting mechanisms exactly as the pages do (the Hagilight
 * `data-ga-*` listener and the unified tracker with its Google Analytics mirror) over one stub `gtag`, so a
 * control that reports through both mechanisms produces two calls and fails its test.
 * Call once per test file, from a file that runs in the jsdom environment.
 */
export function setupGaClickHarness() {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;

  const gtag = vi.fn();
  Object.assign(globalThis, { gtag });
  Object.assign(window, { gtag });
  installGaEventTracking();
  initializeWebsiteAnalytics();
  // jsdom does not implement navigation; keep link clicks from logging errors.
  document.addEventListener('click', (event) => event.preventDefault(), true);

  let container: HTMLDivElement | null = null;
  let root: Root | null = null;

  return {
    gtag,
    /** Renders and flushes pending effects and resolved promises, so no state update lands outside `act`. */
    async render(element: ReactElement) {
      container = document.createElement('div');
      document.body.appendChild(container);
      root = createRoot(container);
      await act(async () => {
        root?.render(element);
      });
      return container;
    },
    click(element: Element) {
      act(() => {
        element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      });
    },
    cleanup() {
      act(() => {
        root?.unmount();
      });
      container?.remove();
      container = null;
      root = null;
      gtag.mockClear();
    },
  };
}

/** `matchMedia` is missing in jsdom but used by the theme toggle and framer-motion. */
export function stubMatchMedia() {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

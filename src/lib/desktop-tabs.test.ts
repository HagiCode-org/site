// @vitest-environment jsdom
import { afterEach, expect, it } from 'vitest';
import { initDesktopTabs } from './desktop-tabs';

afterEach(() => { document.body.innerHTML = ''; });

it('switches panels by click and arrow/home/end keys without adding extra tab stops', () => {
  document.body.innerHTML = `
    <div data-desktop-tabs>
      <div role="tablist">
        <button role="tab" aria-controls="windows" aria-selected="true" tabindex="0">Windows</button>
        <button role="tab" aria-controls="macos" aria-selected="false" tabindex="-1">macOS</button>
        <button role="tab" aria-controls="linux" aria-selected="false" tabindex="-1">Linux</button>
      </div>
      <div id="windows" role="tabpanel">Windows requirements</div>
      <div id="macos" role="tabpanel" hidden>macOS requirements</div>
      <div id="linux" role="tabpanel" hidden>Linux requirements</div>
    </div>`;

  const root = document.querySelector<HTMLElement>('[data-desktop-tabs]')!;
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[role="tabpanel"]')];
  initDesktopTabs(root);

  tabs[1].click();
  expect(tabs.map((tab) => tab.getAttribute('aria-selected'))).toEqual(['false', 'true', 'false']);
  expect(tabs.map((tab) => tab.tabIndex)).toEqual([-1, 0, -1]);
  expect(panels.map((panel) => panel.hidden)).toEqual([true, false, true]);
  expect(document.activeElement).toBe(tabs[1]);

  tabs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  expect(panels.map((panel) => panel.hidden)).toEqual([true, true, false]);
  tabs[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
  expect(document.activeElement).toBe(tabs[0]);
  tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
  expect(document.activeElement).toBe(tabs[2]);
  tabs[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
  expect(document.activeElement).toBe(tabs[2]);
});

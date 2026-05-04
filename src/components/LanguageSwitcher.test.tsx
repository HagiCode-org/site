// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SITE_LOCALES } from '@/i18n/locale-metadata';
import { LanguageSwitcher } from './LanguageSwitcher';

declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const setLocaleMock = vi.fn();
let mockedLocale = 'en-US';

vi.mock('@/lib/useLocale', () => ({
  useLocale: () => ({
    locale: mockedLocale,
    setLocale: setLocaleMock,
  }),
}));

describe('LanguageSwitcher', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    mockedLocale = 'en-US';
    setLocaleMock.mockReset();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  function renderSwitcher(locale?: string) {
    act(() => {
      root.render(<LanguageSwitcher locale={locale} />);
    });
  }

  function getTrigger() {
    const trigger = container.querySelector('button[aria-haspopup="dialog"]');
    expect(trigger).not.toBeNull();
    return trigger as HTMLButtonElement;
  }

  function openChooser() {
    const trigger = getTrigger();

    act(() => {
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    return trigger;
  }

  it('renders the trigger with the canonical locale and opens the popup chooser', () => {
    mockedLocale = 'zh-Hant';
    renderSwitcher('zh-TW');

    const trigger = getTrigger();
    expect(trigger.getAttribute('title')).toBe('繁體中文');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    openChooser();

    const dialog = document.body.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.body.querySelector('[role="listbox"]')).not.toBeNull();
    expect(document.body.querySelectorAll('[role="option"]')).toHaveLength(SITE_LOCALES.length);

    const selectedOption = document.body.querySelector('[role="option"][aria-selected="true"]');
    expect(selectedOption?.getAttribute('data-locale')).toBe('zh-Hant');
  });

  it('calls setLocale with the selected canonical locale', () => {
    renderSwitcher('en-US');
    openChooser();

    const targetOption = document.body.querySelector('[data-locale="fr-FR"]');
    expect(targetOption).not.toBeNull();

    act(() => {
      (targetOption as HTMLButtonElement).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(setLocaleMock).toHaveBeenCalledWith('fr-FR');
  });

  it('closes the popup and returns focus to the trigger when Escape is pressed', () => {
    renderSwitcher('en-US');
    const trigger = openChooser();

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });

    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});

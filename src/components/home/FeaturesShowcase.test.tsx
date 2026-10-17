// @vitest-environment jsdom
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SUPPORTED_SITE_LOCALES } from '@/i18n/locale-metadata';
import { getHomepageFeaturesCopy } from '@/lib/homepage-section-copy';
import FeaturesShowcase from './FeaturesShowcase';

const images = {
  proposalWorkflow: { src: '/proposal.png', avif: '/proposal.avif', webp: '/proposal.webp' },
  sessionBoard: { src: '/sessions.png', avif: '/sessions.avif', webp: '/sessions.webp' },
  workspaceManagement: { src: '/workspace.png', avif: '/workspace.avif', webp: '/workspace.webp' },
};

describe('FeaturesShowcase', () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeEach(() => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }));
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
  });

  it('renders all three localized pillars and real previews without gaming or benchmark claims', () => {
    for (const locale of SUPPORTED_SITE_LOCALES) {
      const copy = getHomepageFeaturesCopy(locale);
      const markup = renderToStaticMarkup(<FeaturesShowcase copy={copy} images={images} />);
      const page = document.createElement('div');
      page.innerHTML = markup;

      expect([...page.querySelectorAll('h3')].map((heading) => heading.textContent), locale)
        .toEqual([copy.smart.title, copy.convenient.title, copy.interesting.title]);
      expect(markup, locale).not.toMatch(/features\.(?:showcase|smart|convenient|interesting)\./);
      expect(copy.showcase.demoLabel, locale).toBeTruthy();
      expect(copy.showcase.previewLabel, locale).toBeTruthy();
      expect(markup, locale).not.toMatch(/Hero Dungeon|提案副本|12\.8M|300|10x\+/);
      expect(page.querySelectorAll('picture source[type="image/avif"]'), locale).toHaveLength(3);
      expect(page.querySelectorAll('details li'), locale).toHaveLength(13);
    }
  });

  it('supports keyboard stage navigation, including wrapping, Home and End', () => {
    const copy = getHomepageFeaturesCopy('en-US');
    act(() => root.render(<FeaturesShowcase copy={copy} images={images} />));
    const tabs = [...container.querySelectorAll<HTMLButtonElement>('[role="tablist"]')][0];
    const buttons = [...tabs.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    buttons[0].focus();

    for (const [key, index] of [['ArrowLeft', 7], ['ArrowRight', 0], ['End', 7], ['Home', 0], ['ArrowRight', 1]] as const) {
      act(() => document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true })));
      expect(document.activeElement).toBe(buttons[index]);
      expect(buttons[index].getAttribute('aria-selected')).toBe('true');
      const panel = document.getElementById(buttons[index].getAttribute('aria-controls')!);
      expect(panel?.hidden).toBe(false);
      expect(panel?.textContent).toContain(copy.smart.workflowStages[index].desc);
      expect(buttons.filter((button) => button.tabIndex === 0)).toHaveLength(1);
    }
  });

  it('switches product screenshots and keeps one accessible preview selected', () => {
    act(() => root.render(<FeaturesShowcase copy={getHomepageFeaturesCopy('en-US')} images={images} />));
    const tabs = container.querySelectorAll('[role="tablist"]')[1];
    const buttons = [...tabs.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    act(() => buttons[2].click());
    const panel = document.getElementById(buttons[2].getAttribute('aria-controls')!)!;

    expect(panel.hidden).toBe(false);
    expect(panel.querySelector('img')?.getAttribute('src')).toBe('/workspace.png');
    expect(buttons[2].getAttribute('aria-selected')).toBe('true');
    expect(buttons[0].getAttribute('aria-selected')).toBe('false');
    expect(document.getElementById(buttons[0].getAttribute('aria-controls')!)?.hidden).toBe(true);
  });
});

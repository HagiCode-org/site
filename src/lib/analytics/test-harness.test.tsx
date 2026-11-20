// @vitest-environment jsdom

import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { setupGaClickHarness } from './test-harness';

const harness = setupGaClickHarness();
const { gtag } = harness;

describe('GA click harness', () => {
  afterEach(() => {
    harness.cleanup();
  });

  it('sees one call for an element wired through exactly one mechanism', async () => {
    const container = await harness.render(
      <div>
        <a id="tagged" href="/a/" data-ga-category="navigation" data-ga-label="a" data-ga-location="test" />
        <a id="tracked" href="/b/" data-track-event="open_desktop_page" data-track-source="test-source" />
      </div>,
    );

    harness.click(container.querySelector('#tagged') as Element);
    expect(gtag).toHaveBeenCalledTimes(1);

    gtag.mockClear();
    harness.click(container.querySelector('#tracked') as Element);
    expect(gtag).toHaveBeenCalledTimes(1);
  });

  it('exposes an element wired through both mechanisms as two calls, which the click tests reject', async () => {
    const container = await harness.render(
      <a
        id="both"
        href="/c/"
        data-ga-category="navigation"
        data-ga-label="c"
        data-ga-location="test"
        data-track-event="open_desktop_page"
        data-track-source="test-source"
      />,
    );

    harness.click(container.querySelector('#both') as Element);

    expect(gtag).toHaveBeenCalledTimes(2);
  });

  it('reports the declarative desktop CTA and the hyphenated spelling once each', async () => {
    const container = await harness.render(
      <div>
        <a
          id="hero"
          href="https://www.hagicode.com/desktop/"
          data-track-event="open_desktop_page"
          data-track-source="home-hero-desktop"
        />
        <a
          id="faq"
          href="https://www.hagicode.com/desktop/"
          data-track-event="open-desktop-page"
          data-track-source="home-hero-desktop-secondary"
        />
      </div>,
    );

    harness.click(container.querySelector('#hero') as Element);
    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenLastCalledWith('event', 'link_click', {
      event_category: 'navigation',
      event_label: 'openDesktopPage',
      link_location: 'home_hero_desktop',
      link_url: 'https://www.hagicode.com/desktop/',
      transport_type: 'beacon',
    });

    gtag.mockClear();
    harness.click(container.querySelector('#faq') as Element);
    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenLastCalledWith('event', 'link_click', {
      event_category: 'navigation',
      event_label: 'openDesktopPage',
      link_location: 'home_hero_desktop_secondary',
      link_url: 'https://www.hagicode.com/desktop/',
      transport_type: 'beacon',
    });
  });
});

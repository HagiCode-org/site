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

  it('reports the declarative Container hero CTA and the hyphenated FAQ spelling once each', async () => {
    const container = await harness.render(
      <div>
        <a
          id="hero"
          href="https://docs.hagicode.com/installation/docker-compose/"
          data-track-event="open_container_deployment_guide"
          data-track-source="container-page-hero"
        />
        <a
          id="faq"
          href="https://docs.hagicode.com/installation/docker-compose/"
          data-track-event="open-container-deployment-guide"
          data-track-source="container-faq-help"
        />
      </div>,
    );

    harness.click(container.querySelector('#hero') as Element);
    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenLastCalledWith('event', 'link_click', {
      event_category: 'navigation',
      event_label: 'openContainerDeploymentGuide',
      link_location: 'container_page_hero',
      link_url: 'https://docs.hagicode.com/installation/docker-compose/',
      transport_type: 'beacon',
    });

    gtag.mockClear();
    harness.click(container.querySelector('#faq') as Element);
    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenLastCalledWith('event', 'link_click', {
      event_category: 'navigation',
      event_label: 'openContainerDeploymentGuide',
      link_location: 'container_faq_help',
      link_url: 'https://docs.hagicode.com/installation/docker-compose/',
      transport_type: 'beacon',
    });
  });
});

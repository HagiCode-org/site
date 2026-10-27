import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { WEBSITE_TRACKING_EVENT_CATALOG, WEBSITE_TRACKING_EVENTS } from './events';
import { SITE_POSTHOG_EVENTS } from '../posthog-events';

const AGENTS_PATH = fileURLToPath(new URL('../../../AGENTS.md', import.meta.url));

function postHogSection(): string {
  const markdown = readFileSync(AGENTS_PATH, 'utf8');
  const start = markdown.indexOf('\n## PostHog Events\n');
  expect(start, 'AGENTS.md must contain a "## PostHog Events" section').toBeGreaterThan(-1);
  const rest = markdown.slice(start + 1);
  const next = rest.indexOf('\n## ', 1);
  return next === -1 ? rest : rest.slice(0, next);
}

describe('PostHog event documentation', () => {
  it('lists every catalog event name in AGENTS.md, and no other event name', () => {
    const section = postHogSection();
    const documented = new Set(
      [...section.matchAll(/`([a-z]+(?:_[a-z]+)+)`/g)].map((match) => match[1]),
    );
    // cta_click is the hagilight event named in the deduplication rule, and link_location is the GA
    // parameter the source is normalized to. Neither is a site event.
    documented.delete('cta_click');
    documented.delete('link_location');

    const catalogNames = WEBSITE_TRACKING_EVENT_CATALOG.map((definition) => definition.name);
    expect([...documented].sort()).toEqual([...catalogNames].sort());
    expect(catalogNames.sort()).toEqual(Object.values(WEBSITE_TRACKING_EVENTS).sort());
  });

  it('documents the cta_click deduplication rule', () => {
    expect(postHogSection()).toContain('`cta_click`');
  });

  it('keeps the wrapper allowlist in step with the catalog', () => {
    const catalogNames = WEBSITE_TRACKING_EVENT_CATALOG.map((definition) => definition.name).sort();
    expect(Object.keys(SITE_POSTHOG_EVENTS).sort()).toEqual(catalogNames);

    for (const definition of WEBSITE_TRACKING_EVENT_CATALOG) {
      const keys = Object.keys(SITE_POSTHOG_EVENTS[definition.name]).sort();
      expect(keys).toEqual(definition.platform ? ['platform', 'source'] : ['source']);
    }
  });
});

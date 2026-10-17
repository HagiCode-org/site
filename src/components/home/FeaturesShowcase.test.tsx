import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { getHomepageFeaturesCopy, type HomepageCliProfile } from '@/lib/homepage-section-copy';
import { getHomepageCliProfiles } from '@/lib/structured-articles.mjs';

import FeaturesShowcase from './FeaturesShowcase';

describe('FeaturesShowcase', () => {
  it('renders the three focus cards without unsourced numbers or retired dungeon content', () => {
    const markup = renderToStaticMarkup(<FeaturesShowcase copy={getHomepageFeaturesCopy('en')} />);

    expect(markup).toContain('Propose first, execute second');
    expect(markup).toContain('What each change leaves behind');
    expect(markup).toContain('Run many agents and instances in parallel');
    expect(markup).toContain('Example setup');
    expect(markup).toContain('Every agent gets a face, a personality and a world to live in');

    for (const retired of ['300', '10x', 'Lv.27', '12.8M', 'LIVE ROUTING', 'Captain roster', 'Proposal Dungeon', 'Battle report']) {
      expect(markup).not.toContain(retired);
    }
  });

  it('builds the CLI bay from the comparison articles without quoting how many CLIs are supported', () => {
    const copy = getHomepageFeaturesCopy('en');
    const profiles = getHomepageCliProfiles('en') as HomepageCliProfile[];
    const markup = renderToStaticMarkup(<FeaturesShowcase copy={copy} cliProfiles={profiles} />);
    const visibleText = markup.replace(/<[^>]*>/g, ' ').replace(/&#x27;/g, "'").replace(/&amp;/g, '&');

    expect(profiles.length).toBeGreaterThan(10);
    for (const profile of profiles) {
      expect(profile.whatItIs, profile.key).toBeTruthy();
      expect(profile.models, profile.key).toBeTruthy();
      expect(profile.start, profile.key).toBeTruthy();
      expect(profile.href, profile.key).toMatch(/-vs-hagicode\/$/);
      expect(markup).toContain(`>${profile.shortName}<`);
    }

    // The first profile is open: its own article text and a link to that article are on the page.
    expect(visibleText).toContain(profiles[0].whatItIs);
    expect(markup).toContain(`href="${profiles[0].href}"`);
    expect(visibleText).toContain('Agent CLIs you can equip');
    expect(visibleText).toContain('Compatible model');

    expect(visibleText).not.toMatch(/\b13\b/);
    expect(visibleText).not.toMatch(/currently supported/i);
    expect(visibleText).not.toMatch(/\b(three|nine) (lanes|instances)\b/i);
    expect(markup).not.toContain('OmniRoute');
  });

  it('hides the CLI bay when no article data is available', () => {
    const markup = renderToStaticMarkup(<FeaturesShowcase copy={getHomepageFeaturesCopy('en')} />);

    expect(markup).not.toContain('Agent CLIs you can equip');
  });

  it('keeps the English Fun card free of Chinese copy and lists every terminology world', () => {
    const copy = getHomepageFeaturesCopy('en');
    const markup = renderToStaticMarkup(<FeaturesShowcase copy={copy} />);

    expect(copy.interesting.worlds.items).toHaveLength(10);
    for (const world of copy.interesting.worlds.items) {
      expect(markup).toContain(world.name);
    }
    expect(markup).toContain('Fantasy Adventure');
    expect(markup).toContain('Imperial Court');
    expect(markup).toContain('Daily Achievements');
    expect(markup).not.toMatch(/[\u4e00-\u9fff]/);
  });

  it('resolves every new Fun card key in every locale', () => {
    for (const locale of ['zh-CN', 'zh-Hant', 'ja-JP', 'ko-KR', 'de-DE', 'fr-FR', 'es-ES', 'pt-BR', 'ru-RU']) {
      const { interesting } = getHomepageFeaturesCopy(locale);
      const values = [
        interesting.subtitle,
        interesting.description,
        interesting.worlds.title,
        interesting.agents.caption,
        interesting.progress.title,
        interesting.progress.token,
        interesting.progress.achievements,
        ...Object.values(interesting.worlds.labels),
        ...Object.values(interesting.progress.tiers),
        ...interesting.agents.items.map((agent) => agent.trait),
        ...interesting.worlds.items.flatMap((world) => [world.name, world.agent, world.group, world.job, world.log]),
      ];

      for (const value of values) {
        expect(value, locale).toBeTruthy();
        expect(value, locale).not.toMatch(/^features\./);
      }
    }
  });
});

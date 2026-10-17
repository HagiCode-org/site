import { describe, expect, it } from 'vitest';
import { getAgentAccentIndex, getHomepageCompareArenaItems } from '@/lib/structured-articles.mjs';

describe('homepage compare arena data', () => {
  it('lists every comparison page once, in a stable order, linking to its own page', () => {
    const items = getHomepageCompareArenaItems('en-US');
    const slugs = items.map((item) => item.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).toContain('claude-vs-hagicode');
    expect(items.find((item) => item.slug === 'claude-vs-hagicode')?.href).toBe('/en-US/claude-vs-hagicode/');
    expect(items.find((item) => item.slug === 'claude-vs-hagicode')?.accentIndex).toBe(getAgentAccentIndex('claude-vs-hagicode'));
  });

  it('previews rows taken from the article comparison table, not written for the homepage', () => {
    const claude = getHomepageCompareArenaItems('en-US').find((item) => item.slug === 'claude-vs-hagicode');

    expect(claude?.rows.map((row) => row.label)).toEqual([
      'What it is',
      'Pricing and licensing',
      'Parallel work',
      'Spec and planning workflow',
    ]);
    expect(claude?.rows.every((row) => row.agent.length > 0 && row.hagicode.length > 0)).toBe(true);
  });

  it('keeps an entry without a table as a summary-only preview', () => {
    const items = getHomepageCompareArenaItems('ja-JP');
    const claude = items.find((item) => item.slug === 'claude-vs-hagicode');

    expect(claude?.rows).toEqual([]);
    expect(claude?.summary.length).toBeGreaterThan(0);
  });
});

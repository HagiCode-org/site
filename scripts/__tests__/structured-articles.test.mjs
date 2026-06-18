import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  buildArticleLocaleFallbacks,
  getHomepageAgentChooserItems,
  getStructuredArticleEntriesByCategory,
  getStructuredArticleSlugsByCategory,
  getStructuredArticleViewModel,
  resolveArticleLocale,
  resolveStructuredArticle,
} from '../../src/lib/structured-articles.mjs';

const tempDirs = [];

async function createTempDir(prefix) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

async function writeSnapshot(snapshotRoot, locale, slug, payload) {
  const targetPath = path.join(snapshotRoot, locale, `${slug}.json`);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, JSON.stringify(payload), 'utf8');
  return targetPath;
}

function buildDetail({
  slug = 'claude-vs-hagicode',
  locale = 'zh-CN',
  updatedAt = '2026-06-17T00:00:00.000Z',
  title,
} = {}) {
  return {
    schemaVersion: '1.0.0',
    slug,
    category: 'vs-hagicode',
    locale,
    updatedAt,
    seo: {
      title: title ?? `${slug.replace(/-vs-hagicode$/u, '')} Vs HagiCode`,
      description: `Description ${locale}`,
    },
    summary: `Summary ${locale}`,
    sections: [
      {
        id: `${slug}-section-1`,
        title: 'Section 1',
        blocks: [
          {
            id: `${slug}-section-1-block-1`,
            type: 'rich-text',
            content: ['Paragraph one'],
          },
        ],
      },
    ],
    cta: {
      primary: { label: 'Primary', href: '/primary/' },
    },
  };
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe('resolveArticleLocale', () => {
  it('maps supported locales to themselves', () => {
    expect(resolveArticleLocale('zh-CN')).toBe('zh-CN');
    expect(resolveArticleLocale('en-US')).toBe('en-US');
  });

  it('resolves aliases via site locale metadata', () => {
    expect(resolveArticleLocale('en')).toBe('en-US');
    expect(resolveArticleLocale('zh')).toBe('zh-CN');
    expect(resolveArticleLocale('zh-tw')).toBe('zh-Hant');
  });

  it('falls back to the default locale for unknown input', () => {
    expect(resolveArticleLocale('xx-XX')).toBe('en-US');
    expect(resolveArticleLocale('')).toBe('en-US');
  });
});

describe('buildArticleLocaleFallbacks', () => {
  it('appends en-US and zh-CN as ultimate fallbacks', () => {
    const fallbacks = buildArticleLocaleFallbacks('zh-Hant');
    expect(fallbacks[0]).toBe('zh-Hant');
    expect(fallbacks).toContain('zh-CN');
    expect(fallbacks).toContain('en-US');
  });
});

describe('getStructuredArticleViewModel', () => {
  it('returns a direct locale match without fallback', async () => {
    const snapshotRoot = await createTempDir('site-articles-');
    await writeSnapshot(snapshotRoot, 'zh-CN', 'claude-vs-hagicode', buildDetail({ locale: 'zh-CN' }));

    const vm = getStructuredArticleViewModel('claude-vs-hagicode', 'zh-CN', { snapshotRoot });
    expect(vm.slug).toBe('claude-vs-hagicode');
    expect(vm.resolvedLocale).toBe('zh-CN');
    expect(vm.usedFallback).toBe(false);
    expect(vm.title).toBe('claude Vs HagiCode');
    expect(vm.toc).toHaveLength(1);
    expect(vm.cta.primary?.href).toBe('/primary/');
  });

  it('falls back from zh-Hant to zh-CN', async () => {
    const snapshotRoot = await createTempDir('site-articles-');
    await writeSnapshot(snapshotRoot, 'zh-CN', 'claude-vs-hagicode', buildDetail({ locale: 'zh-CN' }));

    const vm = getStructuredArticleViewModel('claude-vs-hagicode', 'zh-Hant', { snapshotRoot });
    expect(vm.resolvedLocale).toBe('zh-CN');
    expect(vm.requestedLocale).toBe('zh-Hant');
    expect(vm.usedFallback).toBe(true);
  });

  it('falls back to zh-CN when neither requested nor en-US exists', async () => {
    const snapshotRoot = await createTempDir('site-articles-');
    await writeSnapshot(snapshotRoot, 'zh-CN', 'claude-vs-hagicode', buildDetail({ locale: 'zh-CN' }));

    const vm = getStructuredArticleViewModel('claude-vs-hagicode', 'de-DE', { snapshotRoot });
    expect(vm.resolvedLocale).toBe('zh-CN');
    expect(vm.usedFallback).toBe(true);
  });

  it('throws when no snapshot exists for the slug', async () => {
    const snapshotRoot = await createTempDir('site-articles-');
    await writeSnapshot(snapshotRoot, 'zh-CN', 'claude-vs-hagicode', buildDetail({ locale: 'zh-CN' }));

    expect(() =>
      getStructuredArticleViewModel('nonexistent-slug', 'zh-CN', { snapshotRoot }),
    ).toThrowError(/nonexistent-slug/);
  });
});

describe('snapshot-backed article indexes', () => {
  it('builds article entries and slugs from local snapshots without sibling repos', async () => {
    const snapshotRoot = await createTempDir('site-articles-');
    await writeSnapshot(snapshotRoot, 'en-US', 'claude-vs-hagicode', buildDetail({ locale: 'en-US', title: 'Claude Vs HagiCode' }));
    await writeSnapshot(snapshotRoot, 'zh-CN', 'claude-vs-hagicode', buildDetail({ locale: 'zh-CN', title: 'Claude Vs HagiCode' }));
    await writeSnapshot(snapshotRoot, 'zh-CN', 'kimi-vs-hagicode', buildDetail({ slug: 'kimi-vs-hagicode', locale: 'zh-CN', title: 'Kimi Vs HagiCode' }));
    await writeSnapshot(
      snapshotRoot,
      'zh-CN',
      'weekly-update',
      { ...buildDetail({ slug: 'weekly-update', locale: 'zh-CN' }), category: 'news' },
    );

    const entries = getStructuredArticleEntriesByCategory('vs-hagicode', { snapshotRoot });
    expect(entries).toEqual([
      {
        slug: 'claude-vs-hagicode',
        supportedLocales: ['en-US', 'zh-CN'],
        agentName: 'Claude',
      },
      {
        slug: 'kimi-vs-hagicode',
        supportedLocales: ['zh-CN'],
        agentName: 'Kimi',
      },
    ]);

    expect(getStructuredArticleSlugsByCategory('vs-hagicode', { snapshotRoot })).toEqual([
      'claude-vs-hagicode',
      'kimi-vs-hagicode',
    ]);
  });

  it('builds homepage chooser items from snapshots and only keeps extras as fallback', async () => {
    const snapshotRoot = await createTempDir('site-articles-');
    await writeSnapshot(snapshotRoot, 'en-US', 'claude-vs-hagicode', buildDetail({ locale: 'en-US', title: 'Claude Vs HagiCode' }));
    await writeSnapshot(snapshotRoot, 'zh-CN', 'claude-vs-hagicode', buildDetail({ locale: 'zh-CN', title: 'Claude Vs HagiCode' }));
    await writeSnapshot(snapshotRoot, 'zh-CN', 'pi-vs-hagicode', buildDetail({ slug: 'pi-vs-hagicode', locale: 'zh-CN', title: 'Pi Vs HagiCode' }));

    const items = getHomepageAgentChooserItems('zh-CN', 'vs-hagicode', { snapshotRoot });
    expect(items).toEqual([
      {
        slug: 'claude-vs-hagicode',
        agentName: 'Claude',
        href: '/zh-CN/claude-vs-hagicode/',
        localizedLocale: 'zh-CN',
      },
      {
        slug: 'pi-vs-hagicode',
        agentName: 'Pi',
        href: '/zh-CN/pi-vs-hagicode/',
        localizedLocale: 'zh-CN',
      },
      {
        slug: 'reasonix-vs-hagicode',
        agentName: 'Reasonix',
        href: '/zh-CN/faq/',
        localizedLocale: 'zh-CN',
      },
    ]);
  });
});

describe('resolveStructuredArticle', () => {
  it('exposes the snapshot path and detail', async () => {
    const snapshotRoot = await createTempDir('site-articles-');
    await writeSnapshot(snapshotRoot, 'zh-CN', 'claude-vs-hagicode', buildDetail({ locale: 'zh-CN' }));

    const result = resolveStructuredArticle('claude-vs-hagicode', 'zh-CN', { snapshotRoot });
    expect(result.detail.locale).toBe('zh-CN');
    expect(result.snapshotPath.endsWith(path.join('zh-CN', 'claude-vs-hagicode.json'))).toBe(true);
  });
});

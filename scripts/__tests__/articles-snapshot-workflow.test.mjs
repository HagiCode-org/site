import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { updateArticlesSnapshots } from '../lib/articles-snapshot-workflow.mjs';

const tempDirs = [];

function buildDetail({ slug = 'claude-vs-hagicode', locale = 'zh-CN', title = 'Claude Vs HagiCode' } = {}) {
  return {
    schemaVersion: '1.0.0',
    slug,
    category: 'vs-hagicode',
    locale,
    updatedAt: '2026-06-18T00:00:00.000Z',
    seo: {
      title,
      description: `${title} description`,
    },
    summary: `${title} summary`,
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
  };
}

async function createTempDir(prefix) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe('articles snapshot workflow', () => {
  it('defaults to the remote origin even when the monorepo sibling index exists', async () => {
    const outputDir = await createTempDir('site-articles-output-');
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(buildDetail()), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );

    const result = await updateArticlesSnapshots({
      articles: [{ locale: 'zh-CN', slug: 'claude-vs-hagicode' }],
      fetchImpl: fetchMock,
      origin: 'https://example.com',
      outputDir,
    });

    expect(fetchMock).toHaveBeenCalledWith('https://example.com/articles/zh-CN/claude-vs-hagicode.json', {
      headers: {
        accept: 'application/json',
      },
    });
    expect(result.source).toBe('https://example.com');
    expect(result.count).toBe(1);
    await expect(fs.readFile(path.join(outputDir, 'zh-CN', 'claude-vs-hagicode.json'), 'utf8')).resolves.toContain(
      'Claude Vs HagiCode',
    );
  });

  it('still supports an explicit local override when one is provided', async () => {
    const outputDir = await createTempDir('site-articles-output-');
    const localInputDir = await createTempDir('site-articles-local-');
    const detailPath = path.join(localInputDir, 'articles', 'zh-CN', 'claude-vs-hagicode.json');
    const manifestPath = path.join(localInputDir, 'articles', 'index.json');

    await fs.mkdir(path.dirname(detailPath), { recursive: true });
    await fs.writeFile(detailPath, `${JSON.stringify(buildDetail(), null, 2)}\n`, 'utf8');
    await fs.writeFile(manifestPath, JSON.stringify({ schemaVersion: '1.0.0', localeIndexes: [] }), 'utf8');

    const fetchMock = vi.fn();
    const result = await updateArticlesSnapshots({
      articles: [{ locale: 'zh-CN', slug: 'claude-vs-hagicode' }],
      fetchImpl: fetchMock,
      origin: 'https://example.com',
      outputDir,
      localInputDir,
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.source).toBe(`local:${localInputDir}`);
    await expect(fs.readFile(path.join(outputDir, 'zh-CN', 'claude-vs-hagicode.json'), 'utf8')).resolves.toContain(
      'Claude Vs HagiCode',
    );
  });
});

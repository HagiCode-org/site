import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const fallbackUrl = 'https://index.hagicode.com/desktop/history/';

describe('desktop fallback guidance', () => {
  it('documents the canonical Index history fallback in repository guidance', async () => {
    const [readme, readmeCn] = await Promise.all([
      readFile(path.join(siteRoot, 'README.md'), 'utf8'),
      readFile(path.join(siteRoot, 'README_cn.md'), 'utf8'),
    ]);

    expect(readme).toContain(fallbackUrl);
    expect(readme).toMatch(/referenced dependency only/i);
    expect(readmeCn).toContain(fallbackUrl);
    expect(readmeCn).toContain('仅作为被引用依赖');
  });

  it('keeps both desktop page shells aligned with the same fallback target', async () => {
    const [desktopPage, desktopPageCn] = await Promise.all([
      readFile(path.join(siteRoot, 'src/pages/desktop/index.astro'), 'utf8'),
      readFile(path.join(siteRoot, 'src/pages/zh-CN/desktop/index.astro'), 'utf8'),
    ]);

    expect(desktopPage).toContain(fallbackUrl);
    expect(desktopPageCn).toContain(fallbackUrl);
    expect(desktopPage).toContain('hero-runtime-note');
    expect(desktopPageCn).toContain('hero-runtime-note');
  });
});

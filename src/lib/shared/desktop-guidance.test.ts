import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const fallbackUrl = 'https://index.hagicode.com/desktop/history/';
const readmeFiles = [
  'README.md',
  'README_cn.md',
  'README_zh-Hant.md',
  'README_ja-JP.md',
  'README_ko-KR.md',
  'README_de-DE.md',
  'README_fr-FR.md',
  'README_es-ES.md',
  'README_pt-BR.md',
  'README_ru-RU.md',
];

describe('desktop fallback guidance', () => {
  it('documents the canonical Index history fallback in every localized repository README', async () => {
    const readmes = await Promise.all(
      readmeFiles.map((fileName) => readFile(path.join(siteRoot, fileName), 'utf8'))
    );

    for (const readme of readmes) {
      expect(readme).toContain(fallbackUrl);
    }
  });

  it('keeps every localized repository README wired to the same language navigation set', async () => {
    const readmes = await Promise.all(
      readmeFiles.map(async (fileName) => ({
        fileName,
        content: await readFile(path.join(siteRoot, fileName), 'utf8'),
      }))
    );

    for (const { content } of readmes) {
      for (const navTarget of readmeFiles) {
        expect(content).toContain(`./${navTarget}`);
      }
    }
  });

  it('keeps both desktop page shells aligned with the same fallback target', async () => {
    const [desktopPage, desktopPageCn] = await Promise.all([
      readFile(path.join(siteRoot, 'src/page-templates/DesktopPage.astro'), 'utf8'),
      readFile(path.join(siteRoot, 'src/page-templates/DesktopPage.astro'), 'utf8'),
    ]);

    expect(desktopPage).toContain(fallbackUrl);
    expect(desktopPageCn).toContain(fallbackUrl);
    expect(desktopPage).toContain('hero-runtime-note');
    expect(desktopPageCn).toContain('hero-runtime-note');
  });
});

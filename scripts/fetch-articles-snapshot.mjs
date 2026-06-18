import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ARTICLES_INDEX_ORIGIN,
  resolveArticlesSnapshotOutputDir,
  updateArticlesSnapshots,
} from './lib/articles-snapshot-workflow.mjs';

const SITE_ROOT = path.dirname(fileURLToPath(import.meta.url));
const INDEX_DIST_ROOT = path.resolve(SITE_ROOT, '..', '..', 'index', 'dist', 'articles');

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function buildArticlesFromIndex() {
  const manifest = readJson(path.join(INDEX_DIST_ROOT, 'index.json'));
  const locales = manifest?.localeIndexes?.map((entry) => entry.locale) ?? [];
  const articles = [];

  for (const locale of locales) {
    const localeManifest = readJson(path.join(INDEX_DIST_ROOT, locale, 'index.json'));
    if (!localeManifest?.articles) {
      continue;
    }

    for (const article of localeManifest.articles) {
      if (article?.category !== 'vs-hagicode') {
        continue;
      }

      articles.push({ locale, slug: article.slug });
    }
  }

  return articles;
}

async function main() {
  const outputDir = resolveArticlesSnapshotOutputDir();
  const articles = buildArticlesFromIndex();
  const result = await updateArticlesSnapshots({ articles, outputDir });

  console.log(`Articles snapshot updated from ${result.source}`);
  console.log(`Output: ${result.outputDir}`);
  console.log(`Articles: ${result.count}`);
  for (const file of result.files) {
    console.log(`  - ${file}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

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

function collectArticlesFromManifests(rootManifest, localeManifests) {
  const articles = [];
  for (const localeEntry of rootManifest.localeIndexes) {
    const localeManifest = localeManifests.get(localeEntry.locale);
    if (!localeManifest?.articles) {
      continue;
    }

    for (const article of localeManifest.articles) {
      if (article?.category !== 'vs-hagicode') {
        continue;
      }

      articles.push({ locale: localeEntry.locale, slug: article.slug });
    }
  }

  return articles;
}

function buildArticlesFromLocalIndex() {
  const manifest = readJson(path.join(INDEX_DIST_ROOT, 'index.json'));
  if (!manifest) {
    return null;
  }

  const localeManifests = new Map();
  for (const localeEntry of manifest.localeIndexes ?? []) {
    const localeManifest = readJson(path.join(INDEX_DIST_ROOT, localeEntry.locale, 'index.json'));
    if (localeManifest) {
      localeManifests.set(localeEntry.locale, localeManifest);
    }
  }

  return collectArticlesFromManifests(manifest, localeManifests);
}

async function readJsonFromUrl(url, fetchImpl) {
  const response = await fetchImpl(url, { headers: { accept: 'application/json' } });
  if (!response?.ok) {
    throw new Error(`Failed to fetch ${url}: ${response?.status ?? 'unknown status'}`);
  }
  return response.json();
}

async function buildArticlesFromRemoteIndex({ origin, fetchImpl = globalThis.fetch }) {
  const rootManifest = await readJsonFromUrl(new URL('/articles/index.json', origin).toString(), fetchImpl);
  const localeManifests = new Map();
  for (const localeEntry of rootManifest.localeIndexes ?? []) {
    const localeManifest = await readJsonFromUrl(new URL(localeEntry.path, origin).toString(), fetchImpl);
    localeManifests.set(localeEntry.locale, localeManifest);
  }

  return collectArticlesFromManifests(rootManifest, localeManifests);
}

async function main() {
  const outputDir = resolveArticlesSnapshotOutputDir();
  const origin = process.env.SITE_ARTICLES_ORIGIN ?? ARTICLES_INDEX_ORIGIN;

  // Primary source: the published Index origin. The local sibling `index`
  // build is only a fallback when the published Index is unreachable.
  let articles;
  let listSource;
  try {
    articles = await buildArticlesFromRemoteIndex({ origin });
    listSource = `remote:${new URL(origin).origin}`;
  } catch (error) {
    articles = buildArticlesFromLocalIndex();
    listSource = `local:${INDEX_DIST_ROOT}`;
    if (!articles || articles.length === 0) {
      throw new Error(
        `Failed to build articles list from ${origin} (${error instanceof Error ? error.message : error}) and no local index fallback is available`,
      );
    }
  }

  const result = await updateArticlesSnapshots({ articles, outputDir, origin });

  console.log(`Articles list built from ${listSource}`);
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

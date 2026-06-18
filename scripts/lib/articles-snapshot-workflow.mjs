import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ARTICLES_INDEX_ORIGIN = 'https://index.hagicode.com';
export const ARTICLES_SCHEMA_VERSION = '1.0.0';
export const ARTICLES_SNAPSHOT_OUTPUT_PATH = 'src/data/articles.snapshot';
export const ARTICLES_SNAPSHOT_LOCAL_INPUT_PATH = '../index/dist';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertNonEmptyString(value, fieldName, sourceLabel) {
  assert(
    typeof value === 'string' && value.trim().length > 0,
    `Invalid structured article payload from ${sourceLabel}: ${fieldName} must be a non-empty string`,
  );
  return value.trim();
}

function assertStringArray(value, fieldName, sourceLabel) {
  assert(Array.isArray(value) && value.length > 0, `Invalid structured article payload from ${sourceLabel}: ${fieldName} must be a non-empty array`);
  return value.map((entry, index) => assertNonEmptyString(entry, `${fieldName}[${index}]`, sourceLabel));
}

function ensureUnique(values, fieldName, sourceLabel) {
  const seen = new Set();
  for (const value of values) {
    assert(!seen.has(value), `Invalid structured article payload from ${sourceLabel}: duplicate ${fieldName} value ${value}`);
    seen.add(value);
  }
}

function normalizeCtaLink(value, fieldName, sourceLabel) {
  assert(isRecord(value), `Invalid structured article payload from ${sourceLabel}: ${fieldName} must be an object`);
  return {
    label: assertNonEmptyString(value.label, `${fieldName}.label`, sourceLabel),
    href: assertNonEmptyString(value.href, `${fieldName}.href`, sourceLabel),
  };
}

function normalizeArticleBlock(block, fieldName, sourceLabel) {
  assert(isRecord(block), `Invalid structured article payload from ${sourceLabel}: ${fieldName} must be an object`);
  const id = assertNonEmptyString(block.id, `${fieldName}.id`, sourceLabel);
  const type = assertNonEmptyString(block.type, `${fieldName}.type`, sourceLabel);

  switch (type) {
    case 'rich-text':
      return {
        id,
        type,
        content: assertStringArray(block.content, `${fieldName}.content`, sourceLabel),
      };
    case 'bullet-list':
      return {
        id,
        type,
        items: assertStringArray(block.items, `${fieldName}.items`, sourceLabel),
      };
    case 'capability-list': {
      assert(Array.isArray(block.items) && block.items.length > 0, `Invalid structured article payload from ${sourceLabel}: ${fieldName}.items must be a non-empty array`);
      const items = block.items.map((item, index) => {
        const itemField = `${fieldName}.items[${index}]`;
        assert(isRecord(item), `Invalid structured article payload from ${sourceLabel}: ${itemField} must be an object`);
        return {
          id: assertNonEmptyString(item.id, `${itemField}.id`, sourceLabel),
          title: assertNonEmptyString(item.title, `${itemField}.title`, sourceLabel),
          content: assertStringArray(item.content, `${itemField}.content`, sourceLabel),
          ...(item.bullets === undefined ? {} : { bullets: assertStringArray(item.bullets, `${itemField}.bullets`, sourceLabel) }),
        };
      });
      ensureUnique(items.map((item) => item.id), `${fieldName}.items ids`, sourceLabel);
      return { id, type, items };
    }
    case 'comparison-grid': {
      assert(Array.isArray(block.items) && block.items.length > 0, `Invalid structured article payload from ${sourceLabel}: ${fieldName}.items must be a non-empty array`);
      const items = block.items.map((item, index) => {
        const itemField = `${fieldName}.items[${index}]`;
        assert(isRecord(item), `Invalid structured article payload from ${sourceLabel}: ${itemField} must be an object`);
        return {
          id: assertNonEmptyString(item.id, `${itemField}.id`, sourceLabel),
          label: assertNonEmptyString(item.label, `${itemField}.label`, sourceLabel),
          agent: assertNonEmptyString(item.agent, `${itemField}.agent`, sourceLabel),
          hagicode: assertNonEmptyString(item.hagicode, `${itemField}.hagicode`, sourceLabel),
          ...(item.combinedValue === undefined ? {} : { combinedValue: assertNonEmptyString(item.combinedValue, `${itemField}.combinedValue`, sourceLabel) }),
        };
      });
      ensureUnique(items.map((item) => item.id), `${fieldName}.items ids`, sourceLabel);
      return { id, type, items };
    }
    case 'callout': {
      const tone = assertNonEmptyString(block.tone, `${fieldName}.tone`, sourceLabel);
      assert(['info', 'success', 'warning'].includes(tone), `Invalid structured article payload from ${sourceLabel}: ${fieldName}.tone must be info, success, or warning`);
      return {
        id,
        type,
        tone,
        ...(block.title === undefined ? {} : { title: assertNonEmptyString(block.title, `${fieldName}.title`, sourceLabel) }),
        content: assertStringArray(block.content, `${fieldName}.content`, sourceLabel),
      };
    }
    case 'cta-group': {
      assert(Array.isArray(block.items) && block.items.length > 0, `Invalid structured article payload from ${sourceLabel}: ${fieldName}.items must be a non-empty array`);
      return {
        id,
        type,
        items: block.items.map((item, index) => {
          const itemField = `${fieldName}.items[${index}]`;
          const normalized = normalizeCtaLink(item, itemField, sourceLabel);
          const variant = item?.variant;
          if (variant === undefined) {
            return normalized;
          }
          const variantValue = assertNonEmptyString(variant, `${itemField}.variant`, sourceLabel);
          assert(['primary', 'secondary'].includes(variantValue), `Invalid structured article payload from ${sourceLabel}: ${itemField}.variant must be primary or secondary`);
          return { ...normalized, variant: variantValue };
        }),
      };
    }
    default:
      throw new Error(`Invalid structured article payload from ${sourceLabel}: unsupported block type ${type}`);
  }
}

export function normalizeArticleDetail(payload, expectedLocale, expectedSlug, sourceLabel) {
  assert(isRecord(payload), `Invalid structured article payload from ${sourceLabel}: root must be an object`);
  assert(
    assertNonEmptyString(payload.schemaVersion, 'schemaVersion', sourceLabel) === ARTICLES_SCHEMA_VERSION,
    `Invalid structured article payload from ${sourceLabel}: schemaVersion must be ${ARTICLES_SCHEMA_VERSION}`,
  );

  const slug = assertNonEmptyString(payload.slug, 'slug', sourceLabel);
  const locale = assertNonEmptyString(payload.locale, 'locale', sourceLabel);
  assertNonEmptyString(payload.category, 'category', sourceLabel);
  assertNonEmptyString(payload.updatedAt, 'updatedAt', sourceLabel);
  assert(isRecord(payload.seo), `Invalid structured article payload from ${sourceLabel}: seo must be an object`);
  assert(Array.isArray(payload.sections) && payload.sections.length > 0, `Invalid structured article payload from ${sourceLabel}: sections must be a non-empty array`);

  assert(locale === expectedLocale, `Invalid structured article payload from ${sourceLabel}: expected locale ${expectedLocale} but received ${locale}`);
  assert(slug === expectedSlug, `Invalid structured article payload from ${sourceLabel}: expected slug ${expectedSlug} but received ${slug}`);

  const sections = payload.sections.map((section, sectionIndex) => {
    const sectionField = `sections[${sectionIndex}]`;
    assert(isRecord(section), `Invalid structured article payload from ${sourceLabel}: ${sectionField} must be an object`);
    assert(Array.isArray(section.blocks) && section.blocks.length > 0, `Invalid structured article payload from ${sourceLabel}: ${sectionField}.blocks must be a non-empty array`);

    const blocks = section.blocks.map((block, blockIndex) =>
      normalizeArticleBlock(block, `${sectionField}.blocks[${blockIndex}]`, sourceLabel),
    );
    ensureUnique(blocks.map((block) => block.id), `${sectionField}.blocks ids`, sourceLabel);

    return {
      id: assertNonEmptyString(section.id, `${sectionField}.id`, sourceLabel),
      title: assertNonEmptyString(section.title, `${sectionField}.title`, sourceLabel),
      blocks,
    };
  });

  ensureUnique(sections.map((section) => section.id), 'section ids', sourceLabel);

  const normalized = {
    schemaVersion: ARTICLES_SCHEMA_VERSION,
    slug,
    category: assertNonEmptyString(payload.category, 'category', sourceLabel),
    locale,
    updatedAt: assertNonEmptyString(payload.updatedAt, 'updatedAt', sourceLabel),
    seo: {
      title: assertNonEmptyString(payload.seo.title, 'seo.title', sourceLabel),
      description: assertNonEmptyString(payload.seo.description, 'seo.description', sourceLabel),
    },
    summary: assertNonEmptyString(payload.summary, 'summary', sourceLabel),
    sections,
  };

  if (payload.cta === undefined) {
    return normalized;
  }

  assert(isRecord(payload.cta), `Invalid structured article payload from ${sourceLabel}: cta must be an object`);

  return {
    ...normalized,
    cta: {
      ...(payload.cta.primary === undefined ? {} : { primary: normalizeCtaLink(payload.cta.primary, 'cta.primary', sourceLabel) }),
      ...(payload.cta.secondary === undefined ? {} : { secondary: normalizeCtaLink(payload.cta.secondary, 'cta.secondary', sourceLabel) }),
    },
  };
}

export function getSiteRoot() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(scriptDir, '..', '..');
}

export function resolveArticlesSnapshotOutputDir(relativePath = ARTICLES_SNAPSHOT_OUTPUT_PATH) {
  return path.join(getSiteRoot(), relativePath);
}

export function resolveArticlesLocalInputDir(relativePath = ARTICLES_SNAPSHOT_LOCAL_INPUT_PATH) {
  return path.resolve(getSiteRoot(), relativePath);
}

async function canReadFile(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function resolveRequestTarget(routePath, { origin, localInputDir }) {
  if (localInputDir) {
    return {
      kind: 'file',
      label: path.join(localInputDir, routePath.replace(/^\//u, '')),
    };
  }

  return {
    kind: 'http',
    label: new URL(routePath, `${new URL(origin).origin}/`).toString(),
  };
}

async function readJsonFromTarget(routePath, options) {
  const target = resolveRequestTarget(routePath, options);

  if (target.kind === 'file') {
    const raw = await readFile(target.label, 'utf8');
    return {
      label: target.label,
      payload: JSON.parse(raw),
    };
  }

  const response = await options.fetchImpl(target.label, {
    headers: {
      accept: 'application/json',
    },
  });

  if (!response?.ok) {
    throw new Error(`Failed to fetch structured article snapshot ${target.label}: ${response?.status ?? 'unknown status'}`);
  }

  const contentType = response.headers?.get?.('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error(
      `Failed to fetch structured article snapshot ${target.label}: expected application/json but received ${contentType || 'unknown content-type'}`,
    );
  }

  return {
    label: target.label,
    payload: await response.json(),
  };
}

export async function fetchArticleDetail({ locale, slug, fetchImpl = globalThis.fetch, origin = ARTICLES_INDEX_ORIGIN, localInputDir }) {
  assert(typeof fetchImpl === 'function', 'Structured article fetch requires a fetch implementation');
  const routePath = `/articles/${locale}/${slug}.json`;
  const source = await readJsonFromTarget(routePath, { fetchImpl, origin, localInputDir });
  return {
    label: source.label,
    detail: normalizeArticleDetail(source.payload, locale, slug, source.label),
  };
}

async function resolveEffectiveLocalInputDir(repoRoot, localInputDir) {
  // Explicit override wins (string = use path, null/empty = force remote).
  if (localInputDir !== undefined) {
    return localInputDir ? path.resolve(repoRoot, localInputDir) : null;
  }

  // Environment override.
  if (process.env.SITE_ARTICLES_PUBLISHED_ROOT) {
    const candidate = path.resolve(repoRoot, process.env.SITE_ARTICLES_PUBLISHED_ROOT);
    if (await canReadFile(path.join(candidate, 'articles', 'index.json'))) {
      return candidate;
    }
  }

  // Default: prefer the monorepo-local index build output when available so
  // builds inside the monorepo reflect committed index content even before
  // the published remote is updated.
  const monorepoCandidate = path.resolve(repoRoot, '..', 'index', 'dist');
  if (await canReadFile(path.join(monorepoCandidate, 'articles', 'index.json'))) {
    return monorepoCandidate;
  }

  return null;
}

export async function writeArticleSnapshot({ locale, slug, detail, outputDir }) {
  assertNonEmptyString(outputDir, 'outputDir', 'local output');
  const targetPath = path.join(outputDir, locale, `${slug}.json`);
  await mkdir(path.dirname(targetPath), { recursive: true });
  await writeFile(targetPath, `${JSON.stringify(detail, null, 2)}\n`, 'utf8');
  return targetPath;
}

/**
 * Fetch, validate, and write the requested locale/slug article pairs into the
 * snapshot directory. Falls back to the local index build output when available.
 *
 * @param {object} options
 * @param {Array<{locale: string, slug: string}>} options.articles Locale/slug pairs to snapshot.
 * @param {Function} [options.fetchImpl] Fetch implementation (defaults to global fetch).
 * @param {string} [options.origin] Index origin override.
 * @param {string} [options.outputDir] Snapshot output directory (defaults to site snapshot dir).
 * @param {string|null|undefined} [options.localInputDir] Local index build root override.
 * @returns {Promise<{outputDir: string, count: number, source: string, files: string[]}>}
 */
export async function updateArticlesSnapshots({
  articles,
  fetchImpl = globalThis.fetch,
  origin = ARTICLES_INDEX_ORIGIN,
  outputDir,
  localInputDir,
} = {}) {
  assert(Array.isArray(articles) && articles.length > 0, 'updateArticlesSnapshots requires a non-empty articles list');
  for (const entry of articles) {
    assert(isRecord(entry), 'updateArticlesSnapshots: each article must be an object');
    assertNonEmptyString(entry.locale, 'article.locale', 'updateArticlesSnapshots');
    assertNonEmptyString(entry.slug, 'article.slug', 'updateArticlesSnapshots');
  }

  const repoRoot = getSiteRoot();
  const effectiveOutputDir = outputDir ?? resolveArticlesSnapshotOutputDir();
  const effectiveLocalInputDir = await resolveEffectiveLocalInputDir(
    repoRoot,
    localInputDir,
  );

  const sourceOptions = {
    fetchImpl,
    origin: process.env.SITE_ARTICLES_ORIGIN ?? origin,
    localInputDir: effectiveLocalInputDir,
  };

  const source = effectiveLocalInputDir
    ? `local:${effectiveLocalInputDir}`
    : new URL(process.env.SITE_ARTICLES_ORIGIN ?? origin).origin;

  const files = [];
  for (const { locale, slug } of articles) {
    const fetched = await fetchArticleDetail({ locale, slug, ...sourceOptions });
    const writtenPath = await writeArticleSnapshot({
      locale,
      slug,
      detail: fetched.detail,
      outputDir: effectiveOutputDir,
    });
    files.push(writtenPath);
  }

  return {
    outputDir: effectiveOutputDir,
    count: files.length,
    source,
    files,
  };
}

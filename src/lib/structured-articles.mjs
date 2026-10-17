import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import {
  DEFAULT_LOCALE,
  SITE_LOCALES,
  SUPPORTED_SITE_LOCALES,
  normalizeSiteLocale,
} from '@/i18n/locale-metadata';

// Comparison article data ships with @hagicode/hagilight-core; `snapshotRoot` stays as a
// test-only override of that packaged data root. The root is resolved through the package
// entry point (<pkg>/dist/*.js -> <pkg>/data/comparison-articles) instead of importing the
// loader's own root constant, because that constant derives from import.meta.url and points
// into dist/.prerender once Astro bundles it.
const ARTICLES_SNAPSHOT_ROOT = path.resolve(
  path.dirname(createRequire(import.meta.url).resolve('@hagicode/hagilight-core/comparison-articles-source')),
  '..',
  'data',
  'comparison-articles',
);
const ARTICLE_LOCALE_MAP_CACHE = new Map();

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function resolveArticlesSnapshotRoot(snapshotRoot) {
  return snapshotRoot ? path.resolve(snapshotRoot) : ARTICLES_SNAPSHOT_ROOT;
}

function readJsonFile(filePath, fallback = null) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return fallback;
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function assertNonEmptyString(value, fieldName, sourceLabel) {
  assert(typeof value === 'string' && value.trim().length > 0, `${sourceLabel}: ${fieldName} must be a non-empty string`);
  return value.trim();
}

function assertStringArray(value, fieldName, sourceLabel) {
  assert(Array.isArray(value) && value.length > 0, `${sourceLabel}: ${fieldName} must be a non-empty array`);
  return value.map((entry, index) => assertNonEmptyString(entry, `${fieldName}[${index}]`, sourceLabel));
}

function normalizeCtaLink(value, fieldName, sourceLabel) {
  assert(isRecord(value), `${sourceLabel}: ${fieldName} must be an object`);
  return {
    label: assertNonEmptyString(value.label, `${fieldName}.label`, sourceLabel),
    href: assertNonEmptyString(value.href, `${fieldName}.href`, sourceLabel),
  };
}

function normalizeArticleBlock(block, fieldName, sourceLabel) {
  assert(isRecord(block), `${sourceLabel}: ${fieldName} must be an object`);
  const id = assertNonEmptyString(block.id, `${fieldName}.id`, sourceLabel);
  const type = assertNonEmptyString(block.type, `${fieldName}.type`, sourceLabel);

  switch (type) {
    case 'rich-text':
      return { id, type, content: assertStringArray(block.content, `${fieldName}.content`, sourceLabel) };
    case 'bullet-list':
      return { id, type, items: assertStringArray(block.items, `${fieldName}.items`, sourceLabel) };
    case 'capability-list':
      assert(Array.isArray(block.items) && block.items.length > 0, `${sourceLabel}: ${fieldName}.items must be a non-empty array`);
      return {
        id,
        type,
        items: block.items.map((item, index) => {
          const itemField = `${fieldName}.items[${index}]`;
          assert(isRecord(item), `${sourceLabel}: ${itemField} must be an object`);
          return {
            id: assertNonEmptyString(item.id, `${itemField}.id`, sourceLabel),
            title: assertNonEmptyString(item.title, `${itemField}.title`, sourceLabel),
            content: assertStringArray(item.content, `${itemField}.content`, sourceLabel),
            ...(item.bullets === undefined ? {} : { bullets: assertStringArray(item.bullets, `${itemField}.bullets`, sourceLabel) }),
          };
        }),
      };
    case 'comparison-grid':
      assert(Array.isArray(block.items) && block.items.length > 0, `${sourceLabel}: ${fieldName}.items must be a non-empty array`);
      return {
        id,
        type,
        items: block.items.map((item, index) => {
          const itemField = `${fieldName}.items[${index}]`;
          assert(isRecord(item), `${sourceLabel}: ${itemField} must be an object`);
          return {
            id: assertNonEmptyString(item.id, `${itemField}.id`, sourceLabel),
            label: assertNonEmptyString(item.label, `${itemField}.label`, sourceLabel),
            agent: assertNonEmptyString(item.agent, `${itemField}.agent`, sourceLabel),
            hagicode: assertNonEmptyString(item.hagicode, `${itemField}.hagicode`, sourceLabel),
            ...(item.combinedValue === undefined ? {} : { combinedValue: assertNonEmptyString(item.combinedValue, `${itemField}.combinedValue`, sourceLabel) }),
          };
        }),
      };
    case 'comparison-table': {
      const headers = assertStringArray(block.headers, `${fieldName}.headers`, sourceLabel);
      assert(headers.length >= 2, `${sourceLabel}: ${fieldName}.headers must contain at least two columns`);
      assert(Array.isArray(block.rows) && block.rows.length > 0, `${sourceLabel}: ${fieldName}.rows must be a non-empty array`);
      return {
        id,
        type,
        ...(block.caption === undefined ? {} : { caption: assertNonEmptyString(block.caption, `${fieldName}.caption`, sourceLabel) }),
        headers,
        rows: block.rows.map((row, index) => {
          const rowField = `${fieldName}.rows[${index}]`;
          assert(isRecord(row), `${sourceLabel}: ${rowField} must be an object`);
          const cells = assertStringArray(row.cells, `${rowField}.cells`, sourceLabel);
          assert(cells.length === headers.length, `${sourceLabel}: ${rowField}.cells must have ${headers.length} entries`);
          return { id: assertNonEmptyString(row.id, `${rowField}.id`, sourceLabel), cells };
        }),
      };
    }
    case 'callout': {
      const tone = assertNonEmptyString(block.tone, `${fieldName}.tone`, sourceLabel);
      assert(['info', 'success', 'warning'].includes(tone), `${sourceLabel}: ${fieldName}.tone must be info, success, or warning`);
      return {
        id,
        type,
        tone,
        ...(block.title === undefined ? {} : { title: assertNonEmptyString(block.title, `${fieldName}.title`, sourceLabel) }),
        content: assertStringArray(block.content, `${fieldName}.content`, sourceLabel),
      };
    }
    case 'cta-group':
      assert(Array.isArray(block.items) && block.items.length > 0, `${sourceLabel}: ${fieldName}.items must be a non-empty array`);
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
          assert(['primary', 'secondary'].includes(variantValue), `${sourceLabel}: ${itemField}.variant must be primary or secondary`);
          return { ...normalized, variant: variantValue };
        }),
      };
    default:
      throw new Error(`${sourceLabel}: unsupported structured article block type ${type}`);
  }
}

function normalizeArticleDetail(payload, sourceLabel) {
  assert(isRecord(payload), `${sourceLabel}: root must be an object`);
  assert(Array.isArray(payload.sections) && payload.sections.length > 0, `${sourceLabel}: sections must be a non-empty array`);

  return {
    schemaVersion: assertNonEmptyString(payload.schemaVersion, 'schemaVersion', sourceLabel),
    slug: assertNonEmptyString(payload.slug, 'slug', sourceLabel),
    category: assertNonEmptyString(payload.category, 'category', sourceLabel),
    locale: assertNonEmptyString(payload.locale, 'locale', sourceLabel),
    updatedAt: assertNonEmptyString(payload.updatedAt, 'updatedAt', sourceLabel),
    seo: {
      title: assertNonEmptyString(payload.seo?.title, 'seo.title', sourceLabel),
      description: assertNonEmptyString(payload.seo?.description, 'seo.description', sourceLabel),
    },
    summary: assertNonEmptyString(payload.summary, 'summary', sourceLabel),
    sections: payload.sections.map((section, sectionIndex) => {
      const sectionField = `sections[${sectionIndex}]`;
      assert(isRecord(section), `${sourceLabel}: ${sectionField} must be an object`);
      assert(Array.isArray(section.blocks) && section.blocks.length > 0, `${sourceLabel}: ${sectionField}.blocks must be a non-empty array`);
      return {
        id: assertNonEmptyString(section.id, `${sectionField}.id`, sourceLabel),
        title: assertNonEmptyString(section.title, `${sectionField}.title`, sourceLabel),
        blocks: section.blocks.map((block, blockIndex) => normalizeArticleBlock(block, `${sectionField}.blocks[${blockIndex}]`, sourceLabel)),
      };
    }),
    ...(payload.faq === undefined
      ? {}
      : {
          faq: (() => {
            assert(Array.isArray(payload.faq) && payload.faq.length > 0, `${sourceLabel}: faq must be a non-empty array`);
            return payload.faq.map((entry, index) => {
              assert(isRecord(entry), `${sourceLabel}: faq[${index}] must be an object`);
              return {
                question: assertNonEmptyString(entry.question, `faq[${index}].question`, sourceLabel),
                answer: assertNonEmptyString(entry.answer, `faq[${index}].answer`, sourceLabel),
              };
            });
          })(),
        }),
    ...(payload.cta === undefined
      ? {}
      : {
          cta: {
            ...(payload.cta?.primary === undefined ? {} : { primary: normalizeCtaLink(payload.cta.primary, 'cta.primary', sourceLabel) }),
            ...(payload.cta?.secondary === undefined ? {} : { secondary: normalizeCtaLink(payload.cta.secondary, 'cta.secondary', sourceLabel) }),
          },
        }),
  };
}

function getSiteLocaleDefinitionSafe(locale) {
  return SITE_LOCALES.find((entry) => entry.code === locale) ?? null;
}

function readArticleSnapshotIndex(snapshotRoot, locale) {
  const localeRoot = path.join(snapshotRoot, locale);
  if (!fs.existsSync(localeRoot) || !fs.statSync(localeRoot).isDirectory()) {
    return [];
  }

  return fs.readdirSync(localeRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => {
      const filePath = path.join(localeRoot, entry.name);
      const payload = readJsonFile(filePath);
      assert(isRecord(payload), `${filePath}: root must be an object`);

      const slug = assertNonEmptyString(payload.slug, 'slug', filePath);
      const category = assertNonEmptyString(payload.category, 'category', filePath);
      const title = assertNonEmptyString(payload.seo?.title, 'seo.title', filePath);

      return {
        slug,
        category,
        title,
        locale,
      };
    });
}

function buildArticleLocaleMap(category, { snapshotRoot } = {}) {
  const resolvedSnapshotRoot = resolveArticlesSnapshotRoot(snapshotRoot);
  const cacheKey = `${resolvedSnapshotRoot}::${category}`;
  const cached = ARTICLE_LOCALE_MAP_CACHE.get(cacheKey);
  if (cached) {
    return cached;
  }

  const bySlug = new Map();

  for (const locale of SUPPORTED_SITE_LOCALES) {
    for (const article of readArticleSnapshotIndex(resolvedSnapshotRoot, locale)) {
      if (article.category !== category) {
        continue;
      }

      const current = bySlug.get(article.slug);
      if (current) {
        current.locales.add(locale);
        if (!current.englishTitle && locale === 'en-US') {
          current.englishTitle = article.title;
        }
        if (!current.primaryTitle && locale === DEFAULT_LOCALE) {
          current.primaryTitle = article.title;
        }
        continue;
      }

      bySlug.set(article.slug, {
        slug: article.slug,
        locales: new Set([locale]),
        englishTitle: locale === 'en-US' ? article.title : null,
        primaryTitle: locale === DEFAULT_LOCALE ? article.title : article.title,
      });
    }
  }

  const entries = [...bySlug.values()]
    .sort((left, right) => left.slug.localeCompare(right.slug, 'en'))
    .map((entry) => ({
      slug: entry.slug,
      supportedLocales: [...entry.locales].sort((left, right) => left.localeCompare(right, 'en')),
      agentName: titleToAgentName(entry.englishTitle ?? entry.primaryTitle ?? entry.slug, entry.slug),
    }));

  ARTICLE_LOCALE_MAP_CACHE.set(cacheKey, entries);
  return entries;
}

function getSupportedArticleLocale(slug, locale, category, options = {}) {
  const requested = resolveArticleLocale(locale);
  const allArticles = buildArticleLocaleMap(category, options);
  const target = allArticles.find((article) => article.slug === slug);
  if (!target) {
    return requested;
  }

  for (const candidate of buildArticleLocaleFallbacks(requested)) {
    if (target.supportedLocales.includes(candidate)) {
      return candidate;
    }
  }

  return target.supportedLocales[0] ?? requested;
}

export function resolveArticleLocale(locale) {
  if (!locale) {
    return DEFAULT_LOCALE;
  }
  return normalizeSiteLocale(locale) ?? DEFAULT_LOCALE;
}

export function buildArticleLocaleFallbacks(locale) {
  const resolvedLocale = resolveArticleLocale(locale);
  const fallbacks = new Set([resolvedLocale]);

  const siteDefinition = SUPPORTED_SITE_LOCALES.find((code) => code === resolvedLocale);
  if (siteDefinition) {
    const definition = getSiteLocaleDefinitionSafe(resolvedLocale);
    if (definition) {
      for (const code of definition.fallbackCodes) {
        fallbacks.add(code);
      }
    }
  }

  fallbacks.add(DEFAULT_LOCALE);
  fallbacks.add('zh-CN');

  return [...fallbacks].filter((code) => SUPPORTED_SITE_LOCALES.includes(code));
}

export function getStructuredArticleSlugsByCategory(category = 'vs-hagicode', options = {}) {
  return buildArticleLocaleMap(category, options).map((article) => article.slug);
}

export function getStructuredArticleEntriesByCategory(category = 'vs-hagicode', options = {}) {
  return buildArticleLocaleMap(category, options);
}

const EXTRA_AGENT_CHOICES = [
  { slug: 'pi-vs-hagicode', agentName: 'Pi' },
  { slug: 'reasonix-vs-hagicode', agentName: 'Reasonix' },
];

export function getHomepageAgentChooserItems(locale, category = 'vs-hagicode', options = {}) {
  const requestedLocale = resolveArticleLocale(locale);
  const structuredArticles = getStructuredArticleEntriesByCategory(category, options);
  const articleSlugs = new Set(structuredArticles.map((article) => article.slug));

  const items = structuredArticles.map((article) => {
    const localizedLocale = getSupportedArticleLocale(article.slug, requestedLocale, category, options);
    return {
      slug: article.slug,
      agentName: article.agentName,
      href: `/${localizedLocale}/${article.slug}/`,
      localizedLocale,
    };
  });

  for (const extra of EXTRA_AGENT_CHOICES) {
    if (!articleSlugs.has(extra.slug)) {
      items.push({
        slug: extra.slug,
        agentName: extra.agentName,
        href: `/${requestedLocale}/faq/`,
        localizedLocale: requestedLocale,
      });
    }
  }

  return items;
}

/**
 * Index of the rows of an "at a glance" comparison table that the homepage arena previews:
 * what it is, pricing, parallel work, spec and planning. Every full-length article keeps these
 * rows at the same positions, whatever the locale.
 */
const ARENA_PREVIEW_ROW_INDEXES = [0, 2, 4, 5];

/** Stable position of an agent among all comparison pages; picks its accent colour. */
export function getAgentAccentIndex(slug, category = 'vs-hagicode', options = {}) {
  const index = getStructuredArticleEntriesByCategory(category, options).findIndex((article) => article.slug === slug);
  return index < 0 ? 0 : index;
}

/**
 * Homepage "arena" entries: one per comparison page, carrying a head-to-head preview taken from
 * the article's own comparison table so the homepage never states anything the article does not.
 * Articles without a three-column table (short locale variants) and agents without an article
 * keep an empty `rows` list.
 */
export function getHomepageCompareArenaItems(locale, category = 'vs-hagicode', options = {}) {
  const requestedLocale = resolveArticleLocale(locale);

  return getHomepageAgentChooserItems(locale, category, options).map((item) => {
    const accentIndex = getAgentAccentIndex(item.slug, category, options);
    let preview = { rows: [], summary: '', headers: null, contentLocale: item.localizedLocale };

    try {
      const { detail, resolvedLocale } = resolveStructuredArticle(item.slug, requestedLocale, options);
      const table = detail.sections
        .flatMap((section) => section.blocks)
        .find((block) => block.type === 'comparison-table' && block.headers.length === 3);

      preview = {
        summary: detail.summary,
        contentLocale: resolvedLocale,
        headers: table ? table.headers : null,
        rows: table
          ? ARENA_PREVIEW_ROW_INDEXES.map((index) => table.rows[index])
              .filter(Boolean)
              .map((row) => ({ id: row.id, label: row.cells[0], agent: row.cells[1], hagicode: row.cells[2] }))
          : [],
      };
    } catch {
      // No article behind this entry: the arena falls back to a plain link.
    }

    return { ...item, accentIndex, ...preview };
  });
}

/** Order the homepage CLI bay lists agents in; slugs without an article are skipped. */
const CLI_PROFILE_ORDER = [
  'claude',
  'codex',
  'copilot',
  'opencode',
  'hermes',
  'qoder',
  'kiro',
  'kimi',
  'gemini',
  'pi',
  'omp',
  'reasonix',
  'deepagents',
  'codebuddy',
  'dsh',
  'junie',
];

/** "Codex CLI" -> "Codex", "QoderCLI" -> "Qoder", "DeepSeek Harness (dsh)" -> "dsh". */
function toShortAgentName(agentName) {
  const alias = agentName.match(/\(([^)]{2,12})\)\s*$/u);
  return (alias ? alias[1] : agentName).replace(/\s*CLI$/u, '').trim();
}

/** Row positions of a full-length three-column comparison table (identical in every article). */
const PROFILE_ROW = { whatItIs: 0, runsOn: 1, models: 3 };

function readCliProfile(slug, locale, options) {
  const { detail, resolvedLocale } = resolveStructuredArticle(slug, locale, options);
  const table = detail.sections
    .flatMap((section) => section.blocks)
    .find((block) => block.type === 'comparison-table' && block.headers.length === 3 && block.rows.length >= 9);

  if (!table) {
    return null;
  }

  const rows = table.rows;
  // "Asking you questions" sits before the setup row and exists in some articles only (10 rows).
  const hasQuestionsRow = rows.length >= 10;
  const strengths = detail.sections
    .flatMap((section) => section.blocks)
    .find((block) => block.type === 'capability-list');

  return {
    contentLocale: resolvedLocale,
    whatItIs: rows[PROFILE_ROW.whatItIs].cells[1],
    runsOn: rows[PROFILE_ROW.runsOn].cells[1],
    models: rows[PROFILE_ROW.models].cells[1],
    start: rows[rows.length - 2].cells[1],
    questions: hasQuestionsRow ? rows[rows.length - 3].cells[2] : '',
    strengths: strengths ? strengths.items.map((item) => item.title) : [],
  };
}

/**
 * Per-CLI profiles for the homepage CLI bay, taken from each agent's own comparison article so the
 * homepage never states anything the article does not. Locales whose article keeps the short
 * template (no full comparison table) read the English article instead.
 */
export function getHomepageCliProfiles(locale, category = 'vs-hagicode', options = {}) {
  const requestedLocale = resolveArticleLocale(locale);
  const items = new Map(getHomepageAgentChooserItems(locale, category, options).map((item) => [item.slug, item]));

  return CLI_PROFILE_ORDER.map((name) => `${name}-vs-hagicode`)
    .filter((slug) => items.has(slug))
    .map((slug) => {
      const item = items.get(slug);
      let profile = null;
      for (const candidate of [requestedLocale, DEFAULT_LOCALE]) {
        try {
          profile = readCliProfile(slug, candidate, options);
        } catch {
          profile = null;
        }
        if (profile) {
          break;
        }
      }

      return profile ? { slug, key: slug.replace(/-vs-hagicode$/u, ''), agentName: item.agentName, shortName: toShortAgentName(item.agentName), href: item.href, ...profile } : null;
    })
    .filter(Boolean);
}

/** Comparison pages other than `currentSlug`, in the same shape as the homepage agent chooser. */
export function getRelatedComparisonItems(currentSlug, locale, category = 'vs-hagicode', options = {}) {
  return getHomepageAgentChooserItems(locale, category, options).filter((item) => item.slug !== currentSlug);
}

function titleToAgentName(title, slug) {
  const normalized = title
    .replace(/\s*[-—–]+\s*.*/u, '')
    .replace(/\s+Vs\s+HagiCode.*$/iu, '')
    .trim();

  if (normalized) {
    return normalized;
  }

  return slug.replace(/-vs-hagicode$/u, '').replace(/-/g, ' ');
}

export function resolveStructuredArticle(slug, locale = DEFAULT_LOCALE, { snapshotRoot } = {}) {
  const resolvedLocale = resolveArticleLocale(locale);
  const snapshotBase = resolveArticlesSnapshotRoot(snapshotRoot);
  const fallbackLocales = buildArticleLocaleFallbacks(resolvedLocale);

  for (const candidateLocale of fallbackLocales) {
    const candidatePath = path.join(snapshotBase, candidateLocale, `${slug}.json`);
    const payload = readJsonFile(candidatePath);
    if (!payload) {
      continue;
    }

    const detail = normalizeArticleDetail(payload, candidatePath);
    assert(detail.slug === slug, `${candidatePath}: slug must match the requested article slug`);
    assert(detail.locale === candidateLocale, `${candidatePath}: locale must match the snapshot folder name`);

    return {
      requestedLocale: resolvedLocale,
      resolvedLocale: candidateLocale,
      fallbackLocales,
      detail,
      snapshotPath: candidatePath,
      usedFallback: candidateLocale !== resolvedLocale,
    };
  }

  throw new Error(`Structured article ${slug} could not be resolved from snapshot locales ${fallbackLocales.join(', ')}.`);
}

export function getStructuredArticleViewModel(slug, locale = DEFAULT_LOCALE, options = {}) {
  const { requestedLocale, resolvedLocale, detail, snapshotPath, usedFallback } = resolveStructuredArticle(slug, locale, options);

  return {
    slug: detail.slug,
    title: detail.seo.title,
    description: detail.seo.description,
    summary: detail.summary,
    updatedAt: detail.updatedAt,
    requestedLocale,
    resolvedLocale,
    usedFallback,
    snapshotPath,
    sections: detail.sections,
    faq: detail.faq ?? [],
    toc: detail.sections.map((section) => ({ id: section.id, title: section.title })),
    cta: detail.cta ?? {},
    agentName:
      getStructuredArticleEntriesByCategory(detail.category ?? 'vs-hagicode', options).find((article) => article.slug === detail.slug)
        ?.agentName ?? titleToAgentName(detail.seo.title, detail.slug),
    accentIndex: getAgentAccentIndex(detail.slug, detail.category ?? 'vs-hagicode', options),
  };
}

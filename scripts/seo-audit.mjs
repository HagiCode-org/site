import fs from 'node:fs/promises';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');
const siteOrigin = 'https://www.hagicode.com';
const defaultLocale = 'en-US';
const supportedLocales = [
  'en-US',
  'zh-CN',
  'zh-Hant',
  'ja-JP',
  'ko-KR',
  'de-DE',
  'fr-FR',
  'es-ES',
  'pt-BR',
  'ru-RU',
];

const managedLocalizedRoutes = [
  '/',
  '/desktop/',
  '/about/',
];

// Container aliases no longer render a page. Each one is a noindex redirect to its locale home.
const retiredContainerRoutes = [
  { route: '/container/', file: 'container/index.html', target: '/en-US/' },
  { route: '/en/container/', file: 'en/container/index.html', target: '/en-US/' },
  ...supportedLocales.map((locale) => ({
    route: `/${locale}/container/`,
    file: `${locale}/container/index.html`,
    target: `/${locale}/`,
  })),
];

const managedEntryRoutes = [
  ...managedLocalizedRoutes,
];

const legacyEnglishRoutes = [
  '/',
  '/desktop/',
  '/about/',
];

function normalizeRoutePath(routePath) {
  if (routePath === '/') {
    return routePath;
  }

  return routePath.endsWith('/') ? routePath : `${routePath}/`;
}

function getLocalizedPath(routePath, locale) {
  const normalizedRoute = normalizeRoutePath(routePath);

  if (locale === defaultLocale) {
    return normalizedRoute === '/' ? '/en-US/' : `/en-US${normalizedRoute}`;
  }

  if (normalizedRoute === '/') {
    return `/${locale}/`;
  }

  return `/${locale}${normalizedRoute}`;
}

function getLocalizedFile(routePath, locale) {
  const localizedPath = getLocalizedPath(routePath, locale);

  if (localizedPath === '/') {
    return 'index.html';
  }

  return `${localizedPath.replace(/^\/+/, '')}index.html`;
}

function getLegacyEnglishRoute(routePath) {
  return routePath === '/' ? '/en/' : `/en${routePath}`;
}

function getLegacyEnglishFile(routePath) {
  return routePath === '/'
    ? 'en/index.html'
    : `en/${routePath.replace(/^\/+/, '')}index.html`;
}

function buildHreflangPaths(routePath) {
  const hreflangPaths = Object.fromEntries(
    supportedLocales.map((locale) => [locale, getLocalizedPath(routePath, locale)]),
  );
  const defaultPath = getLocalizedPath(routePath, defaultLocale);

  hreflangPaths.en = defaultPath;
  hreflangPaths['x-default'] = defaultPath;

  return hreflangPaths;
}

const rootEntryPages = managedEntryRoutes.map((routePath) => {
  const page = {
    route: routePath,
    file: routePath === '/' ? 'index.html' : `${routePath.replace(/^\/+/, '')}index.html`,
    canonicalPath: routePath,
  };

  // "/" is the Hagilight root transit: noindex, canonical and fallback link all point at the default locale.
  return routePath === '/'
    ? {
        ...page,
        canonicalPath: getLocalizedPath('/', defaultLocale),
        redirectTarget: getLocalizedPath('/', defaultLocale),
        requiresRobotsNoindex: true,
      }
    : page;
});

const managedPages = [
  ...managedLocalizedRoutes.flatMap((routePath) =>
    supportedLocales.map((locale) => ({
      route: getLocalizedPath(routePath, locale),
      file: getLocalizedFile(routePath, locale),
      canonicalPath: getLocalizedPath(routePath, locale),
      hreflangPaths: buildHreflangPaths(routePath),
    })),
  ),
  ...rootEntryPages,
  ...retiredContainerRoutes.map(({ route, file, target }) => ({
    route,
    file,
    canonicalPath: target,
    redirectTarget: target,
    requiresRobotsNoindex: true,
  })),
  ...legacyEnglishRoutes.map((routePath) => ({
    route: getLegacyEnglishRoute(routePath),
    file: getLegacyEnglishFile(routePath),
    canonicalPath: getLocalizedPath(routePath, defaultLocale),
    redirectTarget: getLocalizedPath(routePath, defaultLocale),
    requiresRobotsNoindex: true,
  })),
];

function parseAttributes(tagSource) {
  const attributes = {};
  const attributePattern = /([a-zA-Z0-9:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let match;

  while ((match = attributePattern.exec(tagSource)) !== null) {
    const [, name, doubleQuoted, singleQuoted, bareValue] = match;
    attributes[name.toLowerCase()] = doubleQuoted ?? singleQuoted ?? bareValue ?? '';
  }

  return attributes;
}

function findTags(html, tagName) {
  const tagPattern = new RegExp(`<${tagName}\\b[^>]*>`, 'gi');
  const matches = [];
  let match;

  while ((match = tagPattern.exec(html)) !== null) {
    matches.push(parseAttributes(match[0]));
  }

  return matches;
}

function getMetaContent(metaTags, name) {
  return metaTags.find((tag) => tag.name?.toLowerCase() === name.toLowerCase())?.content?.trim() ?? '';
}

function getLinkHref(linkTags, rel, extra = {}) {
  return (
    linkTags.find((tag) => {
      if (tag.rel?.toLowerCase() !== rel.toLowerCase()) {
        return false;
      }

      return Object.entries(extra).every(([key, value]) => tag[key]?.toLowerCase() === value.toLowerCase());
    })?.href ?? ''
  ).trim();
}

function getPathname(urlValue) {
  if (!urlValue) {
    return '';
  }

  return new URL(urlValue, siteOrigin).pathname;
}

function getH1Texts(html) {
  return [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)]
    .map((match) => match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

async function auditPage(page) {
  const htmlPath = path.join(distDir, page.file);
  const html = await fs.readFile(htmlPath, 'utf8');
  const metaTags = findTags(html, 'meta');
  const linkTags = findTags(html, 'link');
  const h1Texts = getH1Texts(html);
  const failures = [];

  const description = getMetaContent(metaTags, 'description');
  if (!description) {
    failures.push('missing `meta description`');
  }

  if (metaTags.some((tag) => tag['http-equiv']?.toLowerCase() === 'refresh')) {
    failures.push('contains forbidden `meta refresh`');
  }

  if (h1Texts.length !== 1) {
    failures.push(`expected exactly one \`h1\`, found ${h1Texts.length}`);
  }

  const canonicalHref = getLinkHref(linkTags, 'canonical');
  if (!canonicalHref) {
    failures.push('missing canonical link');
  } else if (getPathname(canonicalHref) !== page.canonicalPath) {
    failures.push(
      `canonical points to ${getPathname(canonicalHref) || canonicalHref}, expected ${page.canonicalPath}`,
    );
  }

  if (page.requiresRobotsNoindex) {
    const robots = getMetaContent(metaTags, 'robots');
    if (robots.toLowerCase() !== 'noindex,follow') {
      failures.push(`robots meta must be \`noindex,follow\`, found ${robots || 'missing'}`);
    }

    const anchorTarget = new RegExp(
      `<a\\b[^>]*href=["'][^"']*${page.redirectTarget.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`,
      'i',
    );
    if (!anchorTarget.test(html)) {
      failures.push(`missing fallback link to ${page.redirectTarget}`);
    }
  }

  if (page.hreflangPaths) {
    for (const [hreflang, expectedPath] of Object.entries(page.hreflangPaths)) {
      const href = getLinkHref(linkTags, 'alternate', { hreflang });
      if (!href) {
        failures.push(`missing hreflang ${hreflang}`);
        continue;
      }

      if (getPathname(href) !== expectedPath) {
        failures.push(`hreflang ${hreflang} points to ${getPathname(href) || href}, expected ${expectedPath}`);
      }
    }
  }

  return {
    route: page.route,
    h1Texts,
    failures,
  };
}

async function main() {
  const results = await Promise.all(managedPages.map((page) => auditPage(page)));
  const failedResults = results.filter((result) => result.failures.length > 0);

  console.log('SEO audit: checking generated HTML for managed marketing and redirect pages.');
  for (const result of results) {
    if (result.failures.length > 0) {
      console.log(`FAIL ${result.route}`);
      for (const failure of result.failures) {
        console.log(`  - ${failure}`);
      }
      continue;
    }

    console.log(`PASS ${result.route} - h1: "${result.h1Texts[0]}"`);
  }

  if (failedResults.length > 0) {
    process.exitCode = 1;
    throw new Error(`SEO audit failed for ${failedResults.length} page(s).`);
  }

  console.log(`SEO audit passed for ${results.length} managed page(s).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

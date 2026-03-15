import fs from 'node:fs/promises';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');
const siteOrigin = 'https://hagicode.com';

const managedPages = [
  {
    route: '/',
    file: 'index.html',
    canonicalPath: '/',
    hreflangPaths: {
      en: '/',
      'zh-CN': '/zh-CN/',
      'x-default': '/',
    },
  },
  {
    route: '/desktop/',
    file: 'desktop/index.html',
    canonicalPath: '/desktop/',
    hreflangPaths: {
      en: '/desktop/',
      'zh-CN': '/zh-CN/desktop/',
      'x-default': '/desktop/',
    },
  },
  {
    route: '/container/',
    file: 'container/index.html',
    canonicalPath: '/container/',
    hreflangPaths: {
      en: '/container/',
      'zh-CN': '/zh-CN/container/',
      'x-default': '/container/',
    },
  },
  {
    route: '/zh-CN/',
    file: 'zh-CN/index.html',
    canonicalPath: '/zh-CN/',
    hreflangPaths: {
      en: '/',
      'zh-CN': '/zh-CN/',
      'x-default': '/',
    },
  },
  {
    route: '/zh-CN/desktop/',
    file: 'zh-CN/desktop/index.html',
    canonicalPath: '/zh-CN/desktop/',
    hreflangPaths: {
      en: '/desktop/',
      'zh-CN': '/zh-CN/desktop/',
      'x-default': '/desktop/',
    },
  },
  {
    route: '/zh-CN/container/',
    file: 'zh-CN/container/index.html',
    canonicalPath: '/zh-CN/container/',
    hreflangPaths: {
      en: '/container/',
      'zh-CN': '/zh-CN/container/',
      'x-default': '/container/',
    },
  },
  {
    route: '/en/',
    file: 'en/index.html',
    canonicalPath: '/',
    redirectTarget: '/',
    requiresRobotsNoindex: true,
  },
  {
    route: '/en/desktop/',
    file: 'en/desktop/index.html',
    canonicalPath: '/desktop/',
    redirectTarget: '/desktop/',
    requiresRobotsNoindex: true,
  },
  {
    route: '/en/container/',
    file: 'en/container/index.html',
    canonicalPath: '/container/',
    redirectTarget: '/container/',
    requiresRobotsNoindex: true,
  },
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
    failures.push(`canonical points to ${getPathname(canonicalHref) || canonicalHref}, expected ${page.canonicalPath}`);
  }

  if (page.requiresRobotsNoindex) {
    const robots = getMetaContent(metaTags, 'robots');
    if (robots.toLowerCase() !== 'noindex,follow') {
      failures.push(`robots meta must be \`noindex,follow\`, found ${robots || 'missing'}`);
    }

    const anchorTarget = new RegExp(`<a\\b[^>]*href=["'][^"']*${page.redirectTarget.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'i');
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

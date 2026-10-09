import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

// One page per template that renders Google Analytics through src/components/GoogleAnalytics.astro.
const templatePages = {
  home: 'en-US/index.html',
  desktop: 'en-US/desktop/index.html',
  container: 'en-US/container/index.html',
  about: 'en-US/about/index.html',
  'structured article': 'en-US/claude-vs-hagicode/index.html',
  'landing redirect': 'index.html',
};

// Templates that render the shared footer and promotion banner.
const shellTemplates = new Set(['home', 'desktop', 'container', 'about', 'structured article']);

const distDir = path.resolve(process.cwd(), 'dist');

function count(html, expression) {
  return [...html.matchAll(expression)].length;
}

for (const [template, route] of Object.entries(templatePages)) {
  const html = await fs.readFile(path.join(distDir, route), 'utf8');
  const label = `${template} (${route})`;

  assert.equal(count(html, /googletagmanager\.com\/gtag\/js\?id=G-EN03FMT2Q4/g), 1, `${label}: one Google Analytics loader`);
  assert.equal(count(html, /gtag\('config'/g), 1, `${label}: one initialization`);
  assert.equal(count(html, /\/_astro\/GoogleAnalytics\.astro[^"]*\.js/g), 1, `${label}: one click listener script`);

  if (shellTemplates.has(template)) {
    assert.equal(count(html, /<hagilight-promoto-banner\b/g), 1, `${label}: promotion banner`);
    assert.equal(
      count(html, /data-ga-category="download" data-ga-label="downloadClient" data-ga-location="footer"/g),
      1,
      `${label}: shared footer download link carries its tag`,
    );
  }
}

// The promotion banner builds its call to action in the browser and tags it with the `promoto_banner`
// location, so look for that tagging in the shipped code.
const assets = await fs.readdir(path.join(distDir, '_astro'));
let bannerTagged = false;
for (const asset of assets.filter((name) => name.endsWith('.js'))) {
  const source = await fs.readFile(path.join(distDir, '_astro', asset), 'utf8');
  if (source.includes('promoto_banner')) {
    bannerTagged = true;
    break;
  }
}
assert.ok(bannerTagged, 'the promotion banner script tags its call to action');

console.log(`Google Analytics build check passed for ${Object.keys(templatePages).length} page template(s).`);

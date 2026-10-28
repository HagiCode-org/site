# HagiCode Site - Agent Configuration

## Root Configuration

Inherits all behavior from `/AGENTS.md` at the monorepo root. Local rules extend or override the root file for this repository.

## Project Context

This repository is the marketing and product website for HagiCode.

- `hagicode.com` lives here.
- `repos/docs` is the separate documentation site.
- Brand, product, and visual direction are defined primarily by `PRODUCT.md` and `DESIGN.md`.

## Working Directory

Run commands from `repos/site/`.

## Key Commands

```bash
corepack enable
pnpm install
pnpm run dev
pnpm run build
pnpm run test
pnpm run typecheck
pnpm run i18n:check
pnpm run check:registry
```

Requires Node.js 24+ (`engines` in `package.json`). `pnpm run build` also runs `sync:about-snapshot`, `seo:audit` and `verify:ga` after the Astro build.

## Key Paths

- `src/pages/`: Astro routes
- `src/page-templates/`: shared page bodies reused by the locale route files under `src/pages/`
- `src/components/`: Astro and React components
- `src/styles/`: shared styles
- `src/config/`: site configuration
- `src/lib/`: page models, locale routing, copy helpers, and `analytics/`; tests are colocated as `*.test.ts` (Vitest), with a few under `tests/`
- `src/i18n/locales/`: translation sources per locale (`en-US` is the base; checked with `hagi18n` via `hagi18n.yaml`)
- `src/i18n/generated-locales/`: Git-ignored output of `pnpm run prepare:i18n`, which `dev`, `build`, `test` and `typecheck` run first
- `scripts/`: content sync, image generation, and SEO helpers
- `PRODUCT.md`: product and brand context
- `DESIGN.md`: visual system and design rules
- `.github/workflows/`: `site-deploy-gh-pages.yml` (builds with `pnpm run build`, publishes the validated payload to `gh-pages` for `www.hagicode.com`, then warms deployment domains) and `link-check.yml` (scheduled external link check); the payload's `esa.jsonc`/`wrangler.jsonc` come from `.github/gh-pages/`
- `README.md`: project overview (translated variants sit beside it as `README_*.md`)

## Agent Guidelines

- Follow `PRODUCT.md` and `DESIGN.md` before inventing new visual or copy directions.
- Treat this repo as Astro-first; use React only where interactivity justifies it.
- Keep marketing pages intentional and distinctive rather than generic.
- Preserve SEO metadata, structured content, and i18n-aware copy when editing pages.
- Comparison article data comes from `@hagicode/hagilight-core`; do not reintroduce a local snapshot copy.
- If you change generated or synced content, check the corresponding scripts instead of editing derived outputs by hand.
- Images meant to ship as AVIF and WebP are imported at a relative path as Astro assets (rendered with `<Picture>` in Astro files, or with `getImage` sources passed to React islands); `?url` imports, `public/` paths and remote URLs skip the image service.

## R2 Images

Images from the img-gen library on R2 (`https://img-gen.hagicode.com`) follow `r2-images.manifest.json`, the single record of what the site shows and why.

- **Import**: `pnpm run import:r2-images` downloads every manifest entry, checks content type, bytes, sha256 and AVIF dimensions, checks each pool against its album `index.json`, and writes `src/assets/r2/**` through temp files only after every check passes. An invalid key or mismatch exits non-zero and changes no file. The importer is offline-safe to re-run: unchanged files are not rewritten.
- **Manifest**: each entry names its `class`, album, object key, surface, audit verdict and, for a vendored entry, the file, its dimensions, bytes and sha256, the R2 `source` it was rendered from, and the `render` it was made with. Decorative entries carry no alt text; meaningful entries need alt text in every locale. Rejected surfaces stay in `unchangedSurfaces` with a reason.
- **Three classes**: `vendored` (a default, a static decorative image or a meaningful image) is committed as the smallest rendition its display needs (for example 256 px AVIF for a 128 px card), counted in the local `totalBytes` budget. `rotating-remote` (a Fun-section world cover other than the first) is not committed: the import verifies the R2 object, and its byte count is checked against its `byteCap` (40,960 bytes). The page requests it only when the carousel activates that cover, through `src/scripts/r2-remote-frame.ts`. Random pools stay remote.
- **Defaults are Astro assets**: a vendored rendition is imported at a relative path (for example `../assets/r2/cat-head-gallery/<key>-256.avif` in `src/page-templates/HomePage.astro`) and rendered through `getImage` (AVIF and WebP) before it reaches a React island. Never use a `?url` import, a `public/` path or a literal R2 URL for a default. The only remote URL a page may reference statically is a rotating remote frame, taken from the manifest, and it is requested on activation.
- **Random pool**: only a decorative slot may declare a pool (a `pools` entry in the manifest, 12 to 200 keys from one album, each at or under the pool's byte cap). The page passes the pool to the island as a prop; the browser never fetches an album index. `src/scripts/r2-random-image.ts` (`pickR2PoolImage`) picks one entry uniformly, preloads it with `Image()`, swaps it into the same box only after it loads within 3 s, and does nothing with save-data on or an empty pool. The vendored default is what first paint, no-script readers and failures see. The picker also keeps a page-level claim set, so two slots never show the same entry. The Fun-section world covers are fixed cat heads from `cat-head-gallery`, and the hero strip is 22 fixed character heads, two from each AI model gallery (`claude-antler-girl-gallery`, `deepseek-whale-girl-gallery`, and so on); all are rendered from the vendored files, are not random, and are excluded from the persona pool. The strip marquee duration scales with the frame count (75 s for 22).
- **Tests**: `tests/r2-images.test.ts` checks manifest, files, usage, budgets and the Astro-asset rule. `src/scripts/r2-random-image.test.ts` covers the picker, including the 2 KiB minified limit. Both run under `pnpm test`.
- **Audit**: a candidate image must be text-free, current-brand, not a retired channel, and not already on the same page. A screenshot or a figure the text refers to is meaningful and never gets a pool. A new key needs the same audit (text-free, current brand, no retired channel) and an entry in the manifest with its audit notes before it is listed in a pool.

## Google Analytics Events

- Click events use the shared Hagilight vocabulary (`download_click` for installer downloads, `store_visit` for Microsoft Store and Steam listings, `link_click` for everything else; categories `download`, `store`, `navigation`, `community`, `promotion`). Store controls use category `store`, never `download`. Labels are stable ids, never localized text. Rules, labels, and locations live in the mono-root `docs/google-analytics-integration-reference.md`.
- **One mechanism per element.** A control reports either through the unified tracker (`trackEvent()` or `data-track-event`, which reaches 51LA and, through the GA mirror in `src/lib/analytics/provider-ga.ts`, Google Analytics) or through `data-ga-*` attributes from `gaEventAttributes()` (`@hagicode/hagilight-core/analytics-events`, Google Analytics only). Never both: one click would send two GA events. Use the tracker where the catalog in `src/lib/analytics/events.ts` already names the surface; tag everything else.
- A new tracker event needs the required `ga: { category, label }` field in the catalog, otherwise the type check fails. Pass `url` to `trackEvent()` when the destination is in scope.
- Test a new tracked control with `setupGaClickHarness()` from `src/lib/analytics/test-harness.ts` (jsdom): it installs the listener and the tracker over one stub `gtag`, so assert exactly one `gtag('event', …)` call per click.
- `src/components/GoogleAnalytics.astro` stays a thin wrapper around `@hagicode/hagilight-core/GoogleAnalytics`; do not add an inline `gtag` snippet. `pnpm run verify:ga` (part of `pnpm run build`) checks one loader and one initialization per page template.

## PostHog Events

Every event in `WEBSITE_TRACKING_EVENT_CATALOG` (`src/lib/analytics/events.ts`) is also mirrored to PostHog by `src/lib/analytics/provider-posthog.ts`. The mirror calls the local capture wrapper `src/lib/posthog-events.ts`, whose `SITE_POSTHOG_EVENTS` table is the allowlist: unknown events, unknown keys, non-primitive values, and strings beyond 128 characters are dropped, and the send never throws. Nothing is sent without `window.posthog`, after opt-out, or when `capture` throws. The mirror never sends the link URL.

| Event | Properties | Fires when |
|-------|------------|------------|
| `download_desktop` | `source` | Primary install/download CTA is activated |
| `open_desktop_page` | `source` | Navigation from the homepage into the Desktop page |
| `open_steam_store` | `source` | The Steam store CTA is activated |
| `download_desktop_windows` | `source`, `platform` (`windows`) | A Windows Desktop package download is activated |
| `download_desktop_macos` | `source`, `platform` (`macos`) | A macOS Desktop package download is activated |
| `download_desktop_linux` | `source`, `platform` (`linux`) | A Linux Desktop package download is activated |

- `source` is the tracked location normalized as the GA `link_location` (trimmed, hyphens to underscores, default `website`). `platform` appears only on the three download events.
- **Deduplication with `cta_click`:** the six events are sent from `trackEvent()` and never from an element tagged with `data-ga-*`, so one click produces one business event and no `cta_click`. If a control ever gains a `data-ga-*` marker, the business event is the canonical record of that click, and dashboards must not add it to `cta_click` counts.
- `src/lib/analytics/posthog-docs.test.ts` checks that this list matches the catalog.

## Package management

- The repository uses pnpm, pinned in `package.json` `packageManager`. Run `corepack enable` once, then `pnpm install`. `pnpm-lock.yaml` is the only lockfile; do not commit `package-lock.json`.
- Settings live in `pnpm-workspace.yaml`: the `vite` override and `allowBuilds`. `sharp` is approved to run its install script; `fsevents` (macOS-only, prebuilt binary) is explicitly denied. Review any new dependency that has an install script and add it there.
- A local registry mirror belongs in `~/.npmrc` only. Never commit a `registry=` line or a mirror URL; `pnpm run check:registry` (also run in CI) fails on any non-`registry.npmjs.org` `tarball` in the lockfile and on mirror hosts in tracked files.
- Undeclared imports fail under pnpm's strict layout: declare the package (for example `vite`) instead of hoisting.

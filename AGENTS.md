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
npm install
npm run dev
npm run build
npm run test
npm run typecheck
npm run i18n:check
```

Requires Node.js 24+ (`engines` in `package.json`). `npm run build` also runs `sync:about-snapshot`, `seo:audit` and `verify:ga` after the Astro build.

## Key Paths

- `src/pages/`: Astro routes
- `src/page-templates/`: shared page bodies reused by the locale route files under `src/pages/`
- `src/components/`: Astro and React components
- `src/styles/`: shared styles
- `src/config/`: site configuration
- `src/lib/`: page models, locale routing, copy helpers, and `analytics/`; tests are colocated as `*.test.ts` (Vitest), with a few under `tests/`
- `src/i18n/locales/`: translation sources per locale (`en-US` is the base; checked with `hagi18n` via `hagi18n.yaml`)
- `src/i18n/generated-locales/`: Git-ignored output of `npm run prepare:i18n`, which `dev`, `build`, `test` and `typecheck` run first
- `scripts/`: content sync, image generation, and SEO helpers
- `PRODUCT.md`: product and brand context
- `DESIGN.md`: visual system and design rules
- `.github/workflows/`: `site-deploy-gh-pages.yml` (builds with `npm run build`, publishes the validated payload to `gh-pages` for `www.hagicode.com`, then warms deployment domains) and `link-check.yml` (scheduled external link check); the payload's `esa.jsonc`/`wrangler.jsonc` come from `.github/gh-pages/`
- `README.md`: project overview (translated variants sit beside it as `README_*.md`)

## Agent Guidelines

- Follow `PRODUCT.md` and `DESIGN.md` before inventing new visual or copy directions.
- Treat this repo as Astro-first; use React only where interactivity justifies it.
- Keep marketing pages intentional and distinctive rather than generic.
- Preserve SEO metadata, structured content, and i18n-aware copy when editing pages.
- Comparison article data comes from `@hagicode/hagilight-core`; do not reintroduce a local snapshot copy.
- If you change generated or synced content, check the corresponding scripts instead of editing derived outputs by hand.
- Images meant to ship as AVIF and WebP are imported at a relative path as Astro assets (rendered with `<Picture>` in Astro files, or with `getImage` sources passed to React islands); `?url` imports, `public/` paths and remote URLs skip the image service.

## Google Analytics Events

- Click events use the shared Hagilight vocabulary (`download_click` for installer downloads, `store_visit` for Microsoft Store and Steam listings, `link_click` for everything else; categories `download`, `store`, `navigation`, `community`, `promotion`). Store controls use category `store`, never `download`. Labels are stable ids, never localized text. Rules, labels, and locations live in the mono-root `docs/google-analytics-integration-reference.md`.
- **One mechanism per element.** A control reports either through the unified tracker (`trackEvent()` or `data-track-event`, which reaches 51LA and, through the GA mirror in `src/lib/analytics/provider-ga.ts`, Google Analytics) or through `data-ga-*` attributes from `gaEventAttributes()` (`@hagicode/hagilight-core/analytics-events`, Google Analytics only). Never both: one click would send two GA events. Use the tracker where the catalog in `src/lib/analytics/events.ts` already names the surface; tag everything else.
- A new tracker event needs the required `ga: { category, label }` field in the catalog, otherwise the type check fails. Pass `url` to `trackEvent()` when the destination is in scope.
- Test a new tracked control with `setupGaClickHarness()` from `src/lib/analytics/test-harness.ts` (jsdom): it installs the listener and the tracker over one stub `gtag`, so assert exactly one `gtag('event', …)` call per click.
- `src/components/GoogleAnalytics.astro` stays a thin wrapper around `@hagicode/hagilight-core/GoogleAnalytics`; do not add an inline `gtag` snippet. `npm run verify:ga` (part of `npm run build`) checks one loader and one initialization per page template.

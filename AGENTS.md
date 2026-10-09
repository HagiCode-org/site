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
```

## Key Paths

- `src/pages/`: Astro routes
- `src/components/`: Astro and React components
- `src/styles/`: shared styles
- `src/config/`: site configuration
- `scripts/`: content sync, image generation, and SEO helpers
- `PRODUCT.md`: product and brand context
- `DESIGN.md`: visual system and design rules

## Agent Guidelines

- Follow `PRODUCT.md` and `DESIGN.md` before inventing new visual or copy directions.
- Treat this repo as Astro-first; use React only where interactivity justifies it.
- Keep marketing pages intentional and distinctive rather than generic.
- Preserve SEO metadata, structured content, and i18n-aware copy when editing pages.
- If you change generated or synced content, check the corresponding scripts instead of editing derived outputs by hand.

## Google Analytics Events

- Click events use the shared Hagilight vocabulary (`download_click` / `link_click`; categories `download`, `navigation`, `community`, `promotion`). Labels are stable ids, never localized text. Rules, labels, and locations live in the mono-root `docs/google-analytics-integration-reference.md`.
- **One mechanism per element.** A control reports either through the unified tracker (`trackEvent()` or `data-track-event`, which reaches 51LA and, through the GA mirror in `src/lib/analytics/provider-ga.ts`, Google Analytics) or through `data-ga-*` attributes from `gaEventAttributes()` (`@hagicode/hagilight-core/analytics-events`, Google Analytics only). Never both: one click would send two GA events. Use the tracker where the catalog in `src/lib/analytics/events.ts` already names the surface; tag everything else.
- A new tracker event needs the required `ga: { category, label }` field in the catalog, otherwise the type check fails. Pass `url` to `trackEvent()` when the destination is in scope.
- Test a new tracked control with `setupGaClickHarness()` from `src/lib/analytics/test-harness.ts` (jsdom): it installs the listener and the tracker over one stub `gtag`, so assert exactly one `gtag('event', …)` call per click.
- `src/components/GoogleAnalytics.astro` stays a thin wrapper around `@hagicode/hagilight-core/GoogleAnalytics`; do not add an inline `gtag` snippet. `npm run verify:ga` (part of `npm run build`) checks one loader and one initialization per page template.

## References

- `README.md`
- `PRODUCT.md`
- `DESIGN.md`

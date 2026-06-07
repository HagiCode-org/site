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

## References

- `README.md`
- `PRODUCT.md`
- `DESIGN.md`

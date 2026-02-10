# astro-site 规范变更

## MODIFIED Requirements

### Requirement: Astro Core Configuration

The repository MUST have a valid Astro configuration that enables site initialization and development with unified base path management.

#### Scenario: Base path configuration for independent domain deployment

**Given** the `astro.config.mjs` is configured for the docs site
**When** the docs site is deployed to the independent domain `docs.hagicode.com`
**Then** the site MUST use the root path `/` as the base path
**And** all internal links MUST NOT include any intermediate base prefix (e.g., `/docs/guide`)
**And** the `getDocsBasePath()` function in `@shared/links` MUST return `/` in production environment

#### Scenario: Validate Astro configuration

**Given** the `astro.config.mjs` file exists
**When** I inspect the configuration
**Then** it MUST include:
  - Site metadata (title, description, locale)
  - Integration configuration (React, Tailwind CSS, sitemap)
  - Build configuration (output: 'static')
  - Base path set to `/` for root deployment on `docs.hagicode.com`
  - Site URL set to `https://docs.hagicode.com`
  - And the configuration MUST conform to Astro 5.x schema

### Requirement: Base Path Configuration Consistency

All site resources, links, and assets MUST respect the configured base path to ensure proper functionality in all deployment scenarios.

#### Scenario: Internal link generation for independent domain

**Given** the docs site is deployed to `docs.hagicode.com` with base path `/`
**When** the site generates internal links
**Then** all documentation links MUST NOT include any intermediate path segments (e.g., `/docs/guide` is incorrect)
**And** all documentation links MUST use direct path structure (e.g., `/guide`)
**And** all blog links MUST use direct path structure (e.g., `/blog/post`)
**And** all public links in `@shared/links` MUST use `https://docs.hagicode.com/...` format in production

#### Scenario: Shared links library configuration

**Given** the `packages/shared/src/links.ts` file exists
**When** I inspect the `getDocsBasePath()` function
**Then** it MUST return `/` for production environment
**And** all `SITE_LINKS` production URLs MUST use `https://docs.hagicode.com/...` format
**And** NO production URL MUST contain `/docs/` as an intermediate path segment

#### Scenario: Asset reference handling for independent domain

**Given** the base path is set to `/` for `docs.hagicode.com`
**When** the site references static assets from the `public/` directory
**Then** all asset URLs MUST NOT include intermediate path segments
**And** images, stylesheets, and scripts MUST load correctly from root paths

#### Scenario: Sitemap generation for independent domain

**Given** the docs site is configured with base path `/` and site URL `https://docs.hagicode.com`
**When** the site generates the sitemap
**Then** all URLs in the sitemap MUST use `https://docs.hagicode.com/...` format
**And** NO URL in the sitemap MUST contain `/docs/` as an intermediate path segment
**And** the sitemap MUST be valid for the independent domain deployment

#### Scenario: Social media meta tags for independent domain

**Given** the base path is configured as `/` for `docs.hagicode.com`
**When** the site generates Open Graph and Twitter Card meta tags
**Then** all URLs in meta tags MUST use `https://docs.hagicode.com/...` format
**And** social media previews MUST work correctly with the independent domain

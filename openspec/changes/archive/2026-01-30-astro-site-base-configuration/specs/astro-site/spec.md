# astro-site Spec Delta

## MODIFIED Requirements

### Requirement: Astro Core Configuration

The repository MUST have a valid Astro configuration that enables site initialization and development with unified base path management.

#### Scenario: Initialize Astro configuration

**Given** a fresh clone of the repository
**When** I run `npm install` and `npm run dev`
**Then** the Astro development server starts successfully on `http://localhost:4321`
**And** the site MUST use the base path configured in `astro.config.mjs`

#### Scenario: Validate Astro configuration

**Given** the `astro.config.mjs` file exists
**When** I inspect the configuration
**Then** it MUST include:
  - Site metadata (title, description, locale)
  - Integration configuration (React, Tailwind CSS, sitemap)
  - Build configuration (output: 'static')
  - Base path configuration from `import.meta.env.VITE_SITE_BASE` with default value `/`
  - And the configuration MUST conform to Astro 5.x schema

#### Scenario: Base path configuration for root deployment

**Given** the `astro.config.mjs` is configured with default base path
**When** I run `npm run dev:root` or `npm run dev`
**Then** the site MUST be accessible at `http://localhost:4321/`
**And** all internal links MUST NOT include a base prefix (e.g., `/docs/guide`)

#### Scenario: Base path configuration for subpath deployment

**Given** the `astro.config.mjs` is configured or environment variable `VITE_SITE_BASE` is set
**When** I run `npm run dev:site` or `VITE_SITE_BASE=/site npm run dev`
**Then** the site MUST be accessible at `http://localhost:4321/site/`
**And** all internal links MUST include the base prefix (e.g., `/site/docs/guide`)

#### Scenario: Environment variable override

**Given** the `astro.config.mjs` has a default base path configured
**When** I set the `VITE_SITE_BASE` environment variable
**Then** the environment variable value MUST override the default configuration
**And** the site MUST use the overridden base path for all URLs and assets

#### Scenario: Production build with base path

**Given** the base path is configured in `astro.config.mjs` or via environment variable
**When** I run `npm run build`
**Then** the built site MUST use the configured base path
**And** all HTML files MUST contain correct relative URLs
**And** all assets MUST be referenced with the correct base path prefix

## ADDED Requirements

### Requirement: Unified Base Path Configuration

The site MUST provide a unified mechanism for managing the base path configuration across development, build, and deployment environments.

#### Scenario: Convenience scripts for different deployment scenarios

**Given** the `package.json` contains development scripts
**When** I inspect the `scripts` section
**Then** it MUST include:
  - `dev:root` - For testing root path deployment (`/`)
  - `dev:site` - For testing subpath deployment (`/site`)
  - And these scripts MUST set appropriate base paths via environment variables or configuration

#### Scenario: Local development testing

**Given** I want to test the site in different deployment scenarios
**When** I run `npm run dev:root`
**Then** the development server MUST start with base path `/`
**When** I run `npm run dev:site`
**Then** the development server MUST start with base path `/site`

#### Scenario: Build script flexibility

**Given** I need to build the site for different deployment targets
**When** I run `npm run build`
**Then** the site MUST build using the default base path from `astro.config.mjs`
**When** I run `VITE_SITE_BASE=/site npm run build` or `npm run build:site`
**Then** the site MUST build with base path `/site`

#### Scenario: GitHub Actions deployment configuration

**Given** the site is deployed via GitHub Actions
**When** I inspect `.github/workflows/deploy.yml`
**Then** the workflow MAY include `VITE_SITE_BASE` environment variable
**And** if included, it MUST match the deployment target (root or subpath)
**And** the workflow MUST successfully build and deploy the site

#### Scenario: Configuration documentation

**Given** a developer needs to configure the base path
**When** they consult `openspec/project.md`
**Then** they MUST find clear documentation on:
  - How to configure the default base path in `astro.config.mjs`
  - How to override it using environment variables
  - How to use convenience scripts for different deployment scenarios
  - Examples for root path and subpath deployment

### Requirement: Base Path Configuration Consistency

All site resources, links, and assets MUST respect the configured base path to ensure proper functionality in all deployment scenarios.

#### Scenario: Internal link generation

**Given** the base path is set to `/site`
**When** the site generates internal links
**Then** all documentation links MUST include the base prefix (e.g., `/site/docs/guide`)
**And** all blog links MUST include the base prefix (e.g., `/site/blog/post`)

#### Scenario: Asset reference handling

**Given** the base path is set to `/site`
**When** the site references static assets from the `public/` directory
**Then** all asset URLs MUST include the base prefix (e.g., `/site/img/logo.svg`)
**And** images, stylesheets, and scripts MUST load correctly

#### Scenario: Sitemap generation

**Given** the base path is configured
**When** the site generates the sitemap
**Then** all URLs in the sitemap MUST include the correct base path
**And** the sitemap MUST be valid for the deployment target

#### Scenario: Social media meta tags

**Given** the base path is configured
**When** the site generates Open Graph and Twitter Card meta tags
**Then** all URLs in meta tags MUST include the correct base path
**And** social media previews MUST work correctly

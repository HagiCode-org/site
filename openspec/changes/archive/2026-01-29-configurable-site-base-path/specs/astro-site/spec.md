## MODIFIED Requirements

### Requirement: Astro Core Configuration

The repository MUST have a valid Astro configuration that enables site initialization and development with support for configurable base path via environment variable.

#### Scenario: Initialize Astro configuration with configurable base path

**Given** a fresh clone of the repository
**When** I run `npm install` and `npm run dev`
**Then** the Astro development server MUST start successfully on `http://localhost:4321`
**And** the site MUST use the default base path of `/` when `VITE_SITE_BASE` is not set

#### Scenario: Validate Astro configuration with environment variable support

**Given** the `astro.config.mjs` file exists
**When** I inspect the configuration
**Then** it MUST include:
  - Site metadata (title, description, locale)
  - Integration configuration (React, Tailwind CSS, sitemap)
  - Build configuration (output: 'static')
  - Base path configuration using `process.env.VITE_SITE_BASE || '/'`
  - And the configuration MUST conform to Astro 5.x schema

#### Scenario: Configure base path via environment variable

**Given** the `astro.config.mjs` file is configured to read `VITE_SITE_BASE`
**When** I set the environment variable `VITE_SITE_BASE='/site'`
**And** I run `npm run build`
**Then** the site MUST be built with base path `/site`
**And** all URLs MUST include the `/site` prefix

#### Scenario: Use default base path when environment variable is not set

**Given** the `astro.config.mjs` file is configured to read `VITE_SITE_BASE`
**When** the `VITE_SITE_BASE` environment variable is not set
**And** I run `npm run build`
**Then** the site MUST be built with base path `/`
**And** all URLs MUST NOT include any prefix

### Requirement: Deployment

The site MUST be automatically deployed via GitHub Actions with support for configurable base path.

#### Scenario: GitHub Actions workflow with configurable base path

**Given** a commit is pushed to the `main` branch
**When** the GitHub Actions workflow runs
**And** the workflow sets `VITE_SITE_BASE='/site'` environment variable
**Then** the site MUST build successfully with base path `/site`
**And** the build artifacts MUST be deployed to GitHub Pages
**And** the deployment MUST complete without errors
**And** the deployed site MUST be accessible at `https://pcode-org.github.io/site/`

#### Scenario: Deploy to root path

**Given** the GitHub Actions workflow is configured with `VITE_SITE_BASE='/'`
**When** a commit is pushed to the `main` branch
**Then** the site MUST build successfully with base path `/`
**And** the deployed site MUST be accessible at `https://pcode-org.github.io/`

#### Scenario: Build failure respects base path configuration

**Given** the GitHub Actions workflow file is configured
**When** a commit is pushed that causes build failures
**Then** the workflow MUST mark as failed status
**And** the workflow MUST provide detailed error logs
**And** GitHub Pages MUST NOT update (maintain previous version)
**And** the developer MUST receive GitHub Actions failure notification

### Requirement: Static Build Generation

The site MUST successfully build as static HTML for deployment with configurable base path.

#### Scenario: Build production site with custom base path

**Given** the repository is properly configured
**When** I set `VITE_SITE_BASE='/custom-path'`
**And** I run `npm run build`
**Then** the site MUST build without errors
**And** static files MUST be generated in the `dist/` directory
**And** all URLs MUST include the `/custom-path/` prefix
**And** the build MUST complete in a reasonable time (< 5 minutes)

#### Scenario: Preview production build with custom base path

**Given** the site has been built with `VITE_SITE_BASE='/custom-path'`
**When** I run `npm run preview`
**Then** a preview server MUST start on `http://localhost:4321`
**And** the site MUST be accessible at `http://localhost:4321/custom-path/`
**And** the site MUST function identically to the production build

#### Scenario: Verify sitemap generation with custom base path

**Given** the site is built with `VITE_SITE_BASE='/site'`
**When** I check the `dist/sitemap-index.xml` file
**Then** all URLs MUST include the `/site/` prefix
**And** the sitemap MUST be valid XML
**And** the sitemap MUST include all documentation pages
**And** the sitemap MUST include all blog posts

## MODIFIED Requirements

### Requirement: GitHub Actions Deployment

The repository MUST have a GitHub Actions workflow that automatically builds and deploys the documentation site to GitHub Pages on push to the main branch.

#### Scenario: Deployment on push to main

**Given** the repository has a GitHub Actions workflow configured
**When** changes are pushed to the main branch
**Then** the workflow installs dependencies with `npm ci`
**And** the workflow builds the site with `npm run build`
**And** the workflow uploads the build artifacts from the `dist/` directory
**And** the workflow deploys the artifacts to GitHub Pages
**And** the deployment completes successfully

#### Scenario: Build output directory

**Given** the GitHub Actions workflow is running
**When** the site is built
**Then** the build output is stored in the `dist/` directory (Astro default)
**And** the `dist/` directory is uploaded as a Pages artifact

#### Scenario: Node.js version compatibility

**Given** the GitHub Actions workflow is configured
**When** the workflow sets up Node.js
**Then** Node.js version 20 is used (consistent with Astro requirements)
**And** npm is used as the package manager with caching enabled

#### Scenario: Environment variable support

**Given** the repository has the CLARITY_PROJECT_ID secret configured
**When** the GitHub Actions workflow runs the build
**Then** the CLARITY_PROJECT_ID environment variable is passed to the build
**And** the Microsoft Clarity tracking script includes the correct project ID

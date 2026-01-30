# astro-site Specification

## Purpose

Defines the requirements for the Hagicode documentation site built with **Astro 5.x**, serving as the primary source of truth for site functionality, content structure, and user experience.

## Context

- **Project**: Hagicode Documentation
- **Framework**: Astro 5.x
- **Language**: Chinese (Simplified) - Default and only language
- **Migration**: Migrated from Docusaurus 3.x in January 2026
- **Deployment**: GitHub Pages via GitHub Actions

---
## Requirements
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

### Requirement: Content Collections

The site MUST use Astro Content Collections for type-safe content management.

#### Scenario: Validate content collection configuration

**Given** the `src/content/config.ts` file exists
**When** I inspect the configuration
**Then** it MUST define:
  - A `docs` collection with frontmatter schema
  - A `blog` collection with frontmatter schema
  - Type-safe validation using Zod

#### Scenario: Access documentation content

**Given** the Astro site is running
**When** I navigate to `/docs`
**Then** I should see the documentation index page
**And** the page MUST render content from the `docs` collection

### Requirement: Static Build Generation

The site MUST successfully build as static HTML for deployment.

#### Scenario: Build production site

**Given** the repository is properly configured
**When** I run `npm run build`
**Then** the site MUST build without errors
**And** static files MUST be generated in the `dist/` directory
**And** the build MUST complete in a reasonable time (< 5 minutes)

#### Scenario: Preview production build

**Given** the site has been built
**When** I run `npm run preview`
**Then** a preview server MUST start on `http://localhost:4321`
**And** the site MUST function identically to the production build

### Requirement: Responsive Design

The site MUST be fully responsive and functional across all device sizes.

#### Scenario: Mobile responsiveness

**Given** the Astro site is running
**When** I view the site on a mobile device (width < 768px)
**Then** all content MUST be readable without horizontal scrolling
**And** navigation MUST be accessible via a mobile menu

#### Scenario: Tablet and desktop responsiveness

**Given** the Astro site is running
**When** I view the site on tablet (768px - 1024px) and desktop (> 1024px)
**Then** the layout MUST adapt appropriately
**And** sidebars and navigation MUST be visible and functional

### Requirement: Dark Mode Theme Support

The site MUST support both light and dark color themes.

#### Scenario: Default theme

**Given** a user visits the site for the first time
**When** the page loads
**Then** the site MUST respect the user's system preference
**And** the theme MUST be either light or dark based on `prefers-color-scheme`

#### Scenario: Manual theme toggle

**Given** a user is viewing the site
**When** they click the theme toggle button
**Then** the site MUST switch between light and dark themes
**And** the preference MUST be persisted in localStorage
**And** the theme MUST apply to all pages

#### Scenario: Theme consistency

**Given** a user has selected a theme
**When** they navigate to different pages
**Then** the selected theme MUST persist across page navigation
**And** the theme MUST NOT flash between light and dark during navigation

### Requirement: Navigation

The site MUST provide clear and consistent navigation for documentation and blog content.

#### Scenario: Documentation navigation

**Given** a user is on any documentation page
**When** they look at the left sidebar
**Then** they MUST see a structured navigation menu
**And** the menu MUST reflect the documentation structure
**And** the current page MUST be highlighted in the menu

#### Scenario: Blog navigation

**Given** a user is on any blog page
**When** they look for navigation options
**Then** they MUST see a link to return to the blog index
**And** they MUST see links to related blog posts (if applicable)

### Requirement: Code Syntax Highlighting

The site MUST apply syntax highlighting to code blocks in documentation and blog posts.

#### Scenario: Code block rendering

**Given** a documentation page contains a code block
**When** the page is rendered
**Then** the code MUST be syntax-highlighted based on the specified language
**And** the highlighting MUST support common languages (TypeScript, JavaScript, Python, etc.)

#### Scenario: Code theming

**Given** a code block is displayed
**When** the user switches between light and dark themes
**Then** the code highlighting colors MUST adapt to the current theme
**And** the code MUST remain readable in both themes

### Requirement: Mermaid Diagram Support

The site MUST support rendering Mermaid diagrams in both markdown and MDX content with automatic theme adaptation and responsive design.

#### Scenario: Mermaid diagram rendering in markdown files

- **GIVEN** a markdown file (`.md`) contains a Mermaid diagram in a code block
- **WHEN** the page is rendered
- **THEN** the Mermaid diagram MUST be rendered as an SVG
- **AND** the diagram MUST be interactive (pan/zoom if supported)
- **AND** the diagram colors MUST adapt to the current theme (light or dark)

#### Scenario: Mermaid diagram rendering in MDX files

- **GIVEN** an MDX file (`.mdx`) contains a Mermaid diagram in a code block
- **WHEN** the page is rendered and client-side hydration is complete
- **THEN** the Mermaid diagram MUST be rendered as an SVG
- **AND** the diagram MUST integrate correctly with other MDX components (Tabs, Cards, etc.)
- **AND** the rendering MUST occur after MDX hydration to ensure proper DOM structure

#### Scenario: Mermaid diagram theming

- **GIVEN** a Mermaid diagram is displayed
- **WHEN** the user switches between light and dark themes
- **THEN** the diagram MUST re-render with appropriate colors for the current theme
- **AND** the re-rendering MUST happen automatically without page refresh
- **AND** the diagram colors MUST match the site's design system

#### Scenario: Mermaid diagram responsive design

- **GIVEN** a Mermaid diagram is displayed
- **WHEN** viewed on different screen sizes (mobile, tablet, desktop)
- **THEN** the diagram MUST scale appropriately using `max-width: 100%`
- **AND** the diagram MUST maintain aspect ratio
- **AND** horizontal scrolling MUST be available for complex diagrams on small screens
- **AND** the diagram MUST NOT overflow its container

#### Scenario: Mermaid diagram error handling

- **GIVEN** a Mermaid code block contains syntax errors or unsupported diagram types
- **WHEN** the page attempts to render the diagram
- **THEN** a user-friendly error message MUST be displayed
- **AND** the error message MUST be in Chinese
- **AND** the error message MUST include a brief explanation of the problem
- **AND** technical error details MUST be available in a collapsible section
- **AND** the page MUST continue to function normally
- **AND** other diagrams on the page MUST still render correctly

#### Scenario: Mermaid diagram lazy loading

- **GIVEN** a page contains multiple Mermaid diagrams
- **WHEN** the page initially loads
- **THEN** the Mermaid library MUST only be loaded if Mermaid diagrams are present
- **AND** the diagrams MUST render progressively (either using `requestIdleCallback` or `IntersectionObserver`)
- **AND** the initial page load MUST NOT be blocked by diagram rendering
- **AND** the page performance score (Lighthouse) MUST remain above 90

#### Scenario: Mermaid diagram performance optimization

- **GIVEN** a page contains Mermaid diagrams
- **WHEN** measuring rendering performance
- **THEN** each simple diagram (< 10 nodes) MUST render in under 100ms
- **AND** the Mermaid library bundle size MUST be approximately 500KB (minified)
- **AND** the total JavaScript bundle size impact MUST be minimal due to code splitting
- **AND** the rendering MUST NOT cause layout shifts or visible flicker

#### Scenario: Mermaid diagram complexity limits

- **GIVEN** a documentation author creates a Mermaid diagram
- **WHEN** the diagram exceeds recommended complexity (> 20 nodes)
- **THEN** the diagram MUST still render but MAY show a warning in the browser console
- **AND** the documentation SHOULD recommend using static images for highly complex visualizations
- **AND** the best practices guide MUST explain the complexity recommendations

#### Scenario: Supported diagram types

- **GIVEN** a documentation author wants to create different types of technical diagrams
- **WHEN** they use Mermaid syntax
- **THEN** the following diagram types MUST be supported:
  - Flowcharts (graph TD/LR)
  - Sequence diagrams (sequenceDiagram)
  - State diagrams (stateDiagram-v2)
  - Class diagrams (classDiagram)
  - Entity Relationship diagrams (erDiagram)
- **AND** example documentation MUST be provided for each type
- **AND** the examples MUST use realistic project-related scenarios

#### Scenario: Mermaid diagram accessibility

- **GIVEN** a Mermaid diagram is displayed
- **WHEN** accessed by users with disabilities
- **THEN** the diagram MUST include a `role="img"` attribute
- **AND** complex diagrams SHOULD include an `aria-label` or `aria-describedby` with a text description
- **AND** the diagram MUST be keyboard navigable (if Mermaid supports it)
- **AND** the diagram MUST maintain sufficient color contrast in both themes (WCAG AA: 4.5:1 for normal text, 3:1 for large text)

#### Scenario: Mermaid diagram version compatibility

- **GIVEN** the project uses Mermaid v11.12.2
- **WHEN** Mermaid syntax changes in future versions
- **THEN** the existing diagrams MUST continue to render correctly
- **AND** the project documentation MUST specify the supported Mermaid version
- **AND** upgrades to Mermaid MUST be tested against all existing diagrams before deployment

#### Scenario: Mermaid integration with Starlight

- **GIVEN** the site uses Starlight as the documentation framework
- **WHEN** Mermaid code blocks are present in Starlight pages
- **THEN** the rendering script MUST integrate via `StarlightWrapper.astro`
- **AND** the script MUST use Starlight's theme detection mechanism (`data-theme` attribute)
- **AND** the diagram styling MUST be consistent with Starlight's design system
- **AND** the integration MUST not interfere with Starlight's built-in features

#### Scenario: Mermaid diagram examples and documentation

- **GIVEN** a documentation author wants to use Mermaid diagrams
- **WHEN** they consult the project documentation
- **THEN** an example page MUST exist at `/docs/examples/mermaid-diagrams`
- **AND** the example page MUST demonstrate all supported diagram types
- **AND** a best practices guide MUST be available (either separate or part of project.md)
- **AND** the guide MUST cover complexity limits, theming, and accessibility

#### Scenario: Mermaid diagram in MDX with other components

- **GIVEN** an MDX file contains both Mermaid diagrams and other MDX components
- **WHEN** the page is rendered
- **THEN** Mermaid diagrams MUST work correctly inside Tabs components
- **AND** Mermaid diagrams MUST work correctly inside Cards or other containers
- **AND** the rendering order MUST respect the component hierarchy
- **AND** there MUST NOT be conflicts between Mermaid scripts and other MDX component scripts

### Requirement: Image Optimization

All images MUST be optimized for web performance and MUST display correctly at different screen sizes.

#### Scenario: Static image loading

**Given** a markdown file includes an image: `![alt text](/img/path/to/image.png)`
**When** the page is rendered
**Then** the image MUST load from the `public/` directory
**And** the image MUST display at an appropriate size
**And** the image MUST be responsive on different devices

#### Scenario: Image alt text

**Given** an image is included in content
**When** the page is rendered
**Then** the image MUST have descriptive alt text for accessibility
**And** screenshots MUST use correct paths (`/img/path/to/image.png`)

### Requirement: Cross-Platform Content Organization

Documentation pages that include platform-specific instructions for Windows, macOS, and Linux MUST use clear organization to separate content by platform.

#### Scenario: Platform-specific instructions

**Given** a documentation page includes instructions for Windows, macOS, and Linux
**When** the page is rendered
**Then** each platform's instructions MUST be clearly separated
**And** the page MUST be easy to navigate between platforms
**And** the organization MUST be consistent across all such pages

#### Scenario: MDX support

**Given** a content file uses MDX format (`.mdx` extension)
**When** the file is processed by Astro
**Then** the file MUST render correctly with embedded React components
**And** the file extension MAY remain `.md` as Astro supports MDX in `.md` files with frontmatter configuration

### Requirement: TypeScript Configuration

The repository MUST have TypeScript configuration for type safety in Astro config and custom components.

#### Scenario: Validate TypeScript configuration

**Given** the `tsconfig.json` file exists
**When** I inspect the configuration
**Then** it MUST include:
  - `@astrojs/tsconfig` base configuration
  - Strict type checking enabled
  - Path aliases for `@/` pointing to `./src`
  - And type definitions MUST be available for Astro APIs

#### Scenario: Type checking

**Given** the `tsconfig.json` file is configured
**When** I run `npm run typecheck`
**Then** all TypeScript and Astro files MUST pass type checking
**And** IDE autocomplete MUST suggest valid Astro configuration options

### Requirement: Localization Support (Future)

While the site currently only supports Chinese (Simplified), the architecture MUST allow for future localization.

#### Scenario: Current language configuration

**Given** the Astro configuration is examined
**When** I check the site locale
**Then** it MUST be set to `zh-CN`
**And** all content MUST be in Chinese (Simplified)
**And** there MUST NOT be a language switcher in the navigation

### Requirement: Custom Homepage

The site MUST have a custom homepage that provides a welcoming introduction to the Hagicode project.

#### Scenario: Homepage rendering

**Given** a user navigates to the site root
**When** the homepage loads
**Then** they MUST see a Hero section with the project title and description
**And** they MUST see Feature highlights
**And** they MUST see a Product showcase section
**And** they MUST see a Video showcase section
**And** all components MUST use Astro-compatible CSS variables for colors

#### Scenario: Homepage responsiveness

**Given** the Astro site has a custom homepage
**When** viewed on different screen sizes
**Then** all homepage components MUST be responsive
**And** the layout MUST adapt appropriately to mobile, tablet, and desktop

### Requirement: Blog Functionality

The site MUST include a blog section for news, tutorials, and updates.

#### Scenario: Blog listing

**Given** a user navigates to `/blog`
**When** the blog page loads
**Then** they MUST see a list of blog posts in reverse chronological order
**And** each post MUST display the title, date, and excerpt
**And** each post MUST link to the full post page

#### Scenario: Blog post rendering

**Given** a user clicks on a blog post
**When** the blog post page loads
**Then** the full content MUST be displayed
**And** the post MUST include the publication date
**And** the post MUST include navigation to other posts

### Requirement: Performance

The site MUST load quickly and perform well across all metrics.

#### Scenario: Page load performance

**Given** the site is built and deployed
**When** I run Lighthouse performance audit
**Then** the performance score MUST be above 90
**And** the First Contentful Paint (FCP) MUST be under 1.5 seconds
**And** the Time to Interactive (TTI) MUST be under 3 seconds

#### Scenario: Build performance

**Given** the site is built locally
**When** I run `npm run build`
**Then** the build MUST complete in under 5 minutes
**And** there MUST NOT be any build warnings or errors

### Requirement: Accessibility

The site MUST be accessible to users with disabilities.

#### Scenario: Keyboard navigation

**Given** a user is navigating the site with a keyboard
**When** they use the Tab key
**Then** all interactive elements MUST be focusable
**And** the focus order MUST be logical
**And** there MUST be visible focus indicators

#### Scenario: Screen reader support

**Given** a user is using a screen reader
**When** they navigate the site
**Then** all images MUST have descriptive alt text
**And** all links MUST have descriptive text
**And** the page MUST use proper heading hierarchy (h1, h2, h3, etc.)

### Requirement: SEO

The site MUST be optimized for search engines.

#### Scenario: Meta tags

**Given** any page on the site
**When** I inspect the page HTML
**Then** the page MUST include:
  - A descriptive title tag
  - A meta description
  - Open Graph tags for social sharing
  - And the tags MUST be relevant to the page content

#### Scenario: Sitemap

**Given** the site is built
**When** I check the `dist/sitemap-index.xml` file
**Then** a valid sitemap MUST exist
**And** the sitemap MUST include all documentation pages
**And** the sitemap MUST include all blog posts

### Requirement: Deployment

The site MUST be automatically deployed via GitHub Actions.

#### Scenario: GitHub Actions workflow

**Given** a commit is pushed to the `feat/astro-migration` branch
**When** the GitHub Actions workflow runs
**Then** the site MUST build successfully
**And** the build artifacts MUST be deployed to GitHub Pages
**And** the deployment MUST complete without errors

#### Scenario: Preview deployment

**Given** a pull request is opened
**When** the GitHub Actions workflow runs
**Then** a preview deployment SHOULD be available (if configured)
**And** the preview MUST reflect the latest changes

---

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

### Requirement: Homepage Video Showcase Section

The homepage MUST include a video showcase section that displays product demonstration videos using the Bilibili platform.

#### Scenario: Video showcase section rendering

**Given** the homepage is loaded
**When** I scroll to the video showcase section
**Then** I MUST see a section with:
  - A section title (e.g., "每天哈基半小时,AI多任务编程实战")
  - A section description explaining the video content
  - An embedded Bilibili video player with BV ID: `BV1pirZBuEzq`
**And** the video MUST be displayed in a 16:9 aspect ratio container
**And** the section MUST use the site's design system (HUD/Sci-Fi FUI + Glassmorphism)
**And** the video MUST be playable from the Bilibili platform (https://www.bilibili.com/video/BV1pirZBuEzq/)

#### Scenario: Video showcase component structure

**Given** the video showcase section is implemented
**When** I inspect the component architecture
**Then** the component MUST be structured as:
  - `VideoShowcase.tsx` - Container component for the video section
  - `VideoShowcase.module.css` - Component-specific styles
  - Integration with existing `BilibiliVideo.tsx` component
**And** all components MUST use TypeScript with strict mode
**And** all components MUST follow PascalCase naming convention

#### Scenario: Video showcase hydration strategy

**Given** the video showcase section is on the homepage
**When** the page loads
**Then** the VideoShowcase component MUST use the `client:visible` directive
**And** the component MUST hydrate when it enters the viewport
**And** the component MUST support Framer Motion entrance animations
**And** the animation MUST only play once (`viewport: { once: true }`)

#### Scenario: Video showcase responsive design

**Given** the video showcase section is displayed
**When** I view the section on different screen sizes
**Then** on mobile (width < 768px):
  - The title MUST be at least 1.5rem in size
  - The description MUST be at least 1rem in size
  - Container padding MUST be at least 1.5rem
**And** on tablet and desktop (width >= 768px):
  - The title MUST be at least 2rem in size
  - The description MUST be at least 1.125rem in size
  - Container padding MUST be at least 2rem
**And** the video container MUST maintain 16:9 aspect ratio across all devices

#### Scenario: Video showcase integration with homepage

**Given** the homepage has multiple sections
**When** I inspect the section order
**Then** the sections MUST be ordered as:
  1. HeroSection (client:load)
  2. ActivityMetricsSection (client:visible)
  3. FeaturesShowcase (client:visible)
  4. ShowcaseSection (client:idle)
  5. VideoShowcase (client:visible)
**And** all sections MUST be properly separated with consistent vertical spacing

#### Scenario: Video showcase dark mode support

**Given** the site supports light and dark themes
**When** I toggle between themes
**Then** the video showcase section MUST adapt to the current theme
**And** all text MUST remain readable in both themes
**And** all CSS variables MUST respect the theme setting
**And** the video player container MUST use theme-appropriate colors

#### Scenario: Video showcase accessibility

**Given** the video showcase section is displayed
**When** I navigate using a keyboard
**Then** the video player MUST be focusable via Tab key
**And** the section MUST use semantic HTML (`<section>`, `<h2>`)
**And** the video iframe MUST have a descriptive title attribute
**And** the section MUST have proper ARIA labels if needed

#### Scenario: Video showcase TypeScript type safety

**Given** the VideoShowcase component is implemented
**When** I run `npm run typecheck`
**Then** the component MUST pass TypeScript strict mode checks
**And** the component MUST define a clear Props interface:
  ```typescript
  interface VideoShowcaseProps {
    title?: string;       // 区块标题,默认: "每天哈基半小时,AI多任务编程实战"
    description?: string; // 区块描述
    videoId: string;      // Bilibili 视频 BV ID,默认: "BV1pirZBuEzq"
  }
  ```
**And** all props MUST have proper type definitions
**And** there MUST NOT be any `any` types

#### Scenario: Video showcase performance optimization

**Given** the video showcase section uses a Bilibili iframe
**When** the page loads
**Then** the iframe MUST load only when the component is hydrated (client:visible)
**And** the iframe MUST use the sandbox attribute for security
**And** the component MUST NOT block initial page render
**And** the component MUST not significantly increase the initial JavaScript bundle size

#### Scenario: Video showcase styling consistency

**Given** the site has a design system defined in `src/styles/homepage.css`
**When** I inspect the VideoShowcase styles
**Then** the component MUST use CSS custom properties for:
  - Colors (`--color-primary`, `--color-secondary`, `--gradient-primary`)
  - Spacing (`--spacing-section-vertical`, `--spacing-horizontal`)
  - Border radius (`--radius-lg`, `--radius-md`)
**And** the component MUST maintain visual consistency with other homepage sections
**And** the component MUST use CSS Modules to avoid global style pollution

### Requirement: Homepage Product Screenshot Showcase Section

The homepage MUST include a product screenshot showcase section that displays actual product interface screenshots to demonstrate Hagicode's core features.

#### Scenario: Screenshot showcase section rendering

**Given** the homepage is loaded
**When** I scroll to the product showcase section
**Then** I MUST see a section with:
  - A section title (e.g., "产品展示" or "功能预览")
  - 6 product screenshots in a grid layout
  - Each screenshot includes a title and description
**And** the screenshots MUST be displayed in the following order:
  1. Light theme main interface
  2. Dark theme main interface
  3. Real-time token consumption report
  4. Efficiency improvement report with AI usage
  5. Daily achievement report
  6. Achievements earned from daily coding
**And** each screenshot MUST be in PNG format
**And** each screenshot MUST include a functional title (in Chinese)
**And** each screenshot MUST include a concise description (1-2 sentences, ~20-30 characters)
**And** each screenshot MUST have semantic alt text

#### Scenario: Screenshot showcase component structure

**Given** the screenshot showcase section is implemented
**When** I inspect the component architecture
**Then** the component MUST be structured as:
  - `ShowcaseSection.tsx` - Container component for the screenshot section
  - `ShowcaseSection.module.css` - Component-specific styles
  - TypeScript interface for screenshot data:
    ```typescript
    interface ScreenshotItem {
      src: string;        // Image path (e.g., `/img/home/亮色主题主界面.png`)
      title: string;      // Screenshot title
      description: string; // Feature description (1-2 sentences)
      alt: string;        // Image alt text
    }
    ```
**And** the component MUST use semantic HTML elements (`<figure>`, `<figcaption>`)
**And** all components MUST use TypeScript with strict mode
**And** all components MUST follow PascalCase naming convention

#### Scenario: Screenshot showcase responsive grid layout

**Given** the screenshot showcase section is displayed
**When** I view the section on different screen sizes
**Then** on desktop (width >= 996px):
  - Screenshots MUST be displayed in a 3-column grid
  - Column gap MUST be 2rem
**And** on tablet (768px - 995px):
  - Screenshots MUST be displayed in a 2-column grid
  - Column gap MUST be 1.5rem
**And** on mobile (width < 768px):
  - Screenshots MUST be displayed in a single column (vertical stack)
  - Column gap MUST be 1.5rem
**And** the layout MUST use CSS Grid technology
**And** the layout MUST be neat and free of misalignment or overlap

#### Scenario: Screenshot showcase interactive effects

**Given** the screenshot showcase section is displayed
**When** I hover over a screenshot card
**Then** the card MUST:
  - Translate upward by 8px
  - Highlight the border color (blue for light theme, cyan for dark theme)
  - Display enhanced shadow effect
  - Animate smoothly with a transition of approximately 300ms
**And** the interaction effects MUST follow the project's design style (HUD/Sci-Fi FUI + Glassmorphism)
**And** the effects MUST support both light and dark theme switching

#### Scenario: Screenshot showcase theme support

**Given** the site supports light and dark themes
**When** I toggle between themes
**Then** the screenshot showcase section MUST adapt to the current theme
**And** on light theme:
  - Border highlights MUST be blue
  - Background MUST be light-colored
**And** on dark theme:
  - Border highlights MUST be cyan
  - Background MUST be dark glassmorphic
**And** text contrast MUST meet WCAG AA standards

#### Scenario: Screenshot showcase image loading and error handling

**Given** the screenshot showcase section is on the homepage
**When** the page loads
**Then** the component MUST use Astro's `client:idle` directive for lazy loading
**And** images MUST display a fade-in animation when loaded
**And** when an image fails to load (file missing or path error):
  - The broken image element MUST be hidden
  - A friendly placeholder MUST be displayed indicating "图片加载失败"
  - The placeholder MUST maintain the same aspect ratio as other screenshots
  - The layout MUST remain stable without affecting other screenshots

#### Scenario: Screenshot showcase performance optimization

**Given** the screenshot showcase section is on the homepage
**When** the page loads
**Then** the component MUST:
  - Use the `client:idle` directive to load when the browser is idle
  - NOT block initial page render or above-the-fold content (HeroSection, FeaturesShowcase)
  - Keep the total image resource size under 1MB
  - Optionally use WebP format to reduce file size by 30-40%
  - Use browser native lazy loading (`<img loading="lazy">`)
**And** the page load time (LCP) MUST NOT be significantly affected
**And** the component MUST minimize initial JavaScript bundle size

#### Scenario: Screenshot showcase integration with homepage

**Given** the homepage has multiple sections
**When** I inspect the section order
**Then** the sections MUST be ordered as:
  1. HeroSection (client:load)
  2. ActivityMetricsSection (client:visible)
  3. FeaturesShowcase (client:visible)
  4. ShowcaseSection - Product screenshot showcase (client:idle)
  5. VideoShowcase (client:visible)
**And** the ShowcaseSection content MUST be changed from "community project links" to "product feature screenshots"
**And** all sections MUST be properly separated with consistent vertical spacing

#### Scenario: Screenshot showcase accessibility

**Given** the screenshot showcase section is displayed
**When** I navigate using assistive technologies
**Then** each screenshot MUST provide descriptive alt text for screen readers
**And** the section MUST use semantic HTML tags (`<figure>`, `<figcaption>`)
**And** titles and descriptions MUST be correctly announced by screen readers
**And** keyboard navigation MUST be supported (no interactive traps)
**And** information MUST NOT be conveyed solely through color (for color-blind users)
**And** text contrast MUST be >= 4.5:1 for body text
**And** large text contrast MUST be >= 3:1 for titles

#### Scenario: Screenshot showcase TypeScript type safety

**Given** the ShowcaseSection component is implemented
**When** I run `npm run typecheck`
**Then** the component MUST pass TypeScript strict mode checks
**And** the `ScreenshotItem` interface MUST be complete
**And** the screenshot array type MUST be correct
**And** component props types (if any) MUST be correct
**And** event handler types (e.g., `onError`) MUST be correct
**And** there MUST NOT be any `any` types

#### Scenario: Screenshot showcase production build validation

**Given** the component code is complete
**When** I run `npm run build`
**Then** the build MUST succeed without errors or warnings
**And** the 6 PNG files MUST be correctly copied to `dist/img/home/`
**And** the image paths MUST be correctly referenced after build
**And** the component MUST render correctly in the production build

### Requirement: Homepage Footer Component

The homepage MUST include a Footer component that provides navigation links, copyright information, and brand representation at the bottom of the page.

#### Scenario: Footer component rendering on homepage

**Given** a user navigates to the site root (`/`)
**When** the homepage loads
**Then** they MUST see a Footer section at the bottom of the page
**And** the Footer MUST display:
  - Copyright information (© 2026 Hagicode)
  - Navigation links (Docs, Blog, GitHub)
  - Social media links (GitHub icon/link)
**And** the Footer MUST be positioned after the main content area
**And** the Footer MUST use the site's design system (CSS Variables for colors and spacing)

#### Scenario: Footer component structure

**Given** the Footer component is implemented
**When** I inspect the component architecture
**Then** the component MUST be structured as:
  - `src/components/home/Footer.tsx` - React component with TypeScript
  - `src/components/home/Footer.module.css` - Component-specific styles
  - FooterProps interface for type safety
**And** the component MUST use semantic HTML (`<footer>`, `<nav>`)
**And** the component MUST follow PascalCase naming convention
**And** the component MUST pass TypeScript strict mode checks

#### Scenario: Footer responsive design

**Given** the Footer component is displayed on the homepage
**When** I view the Footer on different screen sizes
**Then** on mobile (width < 768px):
  - The content MUST be stacked vertically
  - Padding MUST be at least 1rem
  - Links MUST be stacked vertically
**And** on tablet and desktop (width >= 768px):
  - The content MUST be distributed horizontally
  - Padding MUST be at least 1.5rem
  - Links MAY be arranged in columns or rows
**And** the layout MUST remain consistent across all devices

#### Scenario: Footer theme support

**Given** the site supports light and dark themes
**When** I toggle between themes
**Then** the Footer MUST adapt to the current theme
**And** on light theme:
  - Background MUST be light-colored
  - Text MUST be dark-colored
  - Border MUST be visible
**And** on dark theme:
  - Background MUST be dark-colored (optionally glassmorphic)
  - Text MUST be light-colored
  - Border MUST be visible
**And** all CSS MUST use the `data-theme` attribute for theme switching
**And** the Footer MUST respect the `starlight-theme` localStorage key

#### Scenario: Footer link navigation

**Given** the Footer is displayed on the homepage
**When** I click on a Footer link
**Then** internal links (Docs, Blog) MUST navigate to the correct paths
**And** internal links MUST respect the `VITE_SITE_BASE` environment variable
**And** external links (GitHub) MUST open in a new tab or window
**And** all links MUST be accessible via keyboard navigation (Tab key)
**And** all links MUST have descriptive text or aria-labels

#### Scenario: Footer integration with homepage

**Given** the homepage has multiple sections
**When** I inspect the page structure in `src/pages/index.astro`
**Then** the component order MUST be:
  1. Navbar (existing)
  2. HeroSection (existing)
  3. ActivityMetricsSection (existing)
  4. FeaturesShowcase (existing)
  5. ShowcaseSection (existing)
  6. VideoShowcase (existing)
  7. **Footer (new)** ← ADDED
  8. Clarity (existing)
**And** the Footer MUST use the `client:load` hydration directive
**And** the Footer MUST be imported correctly in the frontmatter

#### Scenario: Footer accessibility

**Given** the Footer component is displayed
**When** I navigate using assistive technologies
**Then** the Footer MUST use semantic HTML5 tags:
  - `<footer>` for the container
  - `<nav>` for navigation sections
  - `<a>` for links
**And** all links MUST have descriptive text for screen readers
**And** keyboard focus MUST be visible on all interactive elements
**And** the Footer MUST NOT create any keyboard navigation traps
**And** color contrast MUST meet WCAG AA standards (4.5:1 for body text)

#### Scenario: Footer TypeScript type safety

**Given** the Footer component is implemented
**When** I run `npm run typecheck`
**Then** the component MUST pass TypeScript strict mode checks
**And** the component MUST define a clear FooterProps interface
**And** all props MUST have proper type definitions
**And** there MUST NOT be any `any` types in the component
**And** link data structures MUST be properly typed (e.g., FooterLink interface)

#### Scenario: Footer performance optimization

**Given** the Footer component is on the homepage
**When** the page loads
**Then** the Footer MUST use the `client:load` directive for immediate hydration
**And** the component MUST NOT significantly increase initial page load time
**And** the component bundle size MUST be under 5KB gzipped
**And** the component MUST NOT block above-the-fold content rendering
**And** images (if any) MUST use appropriate loading strategies

#### Scenario: Footer styling consistency

**Given** the site has a design system defined in `src/styles/global.css`
**When** I inspect the Footer styles
**Then** the component MUST use CSS custom properties for:
  - Colors (text, background, primary)
  - Spacing (padding, margins)
  - Border radius
  - Transitions
**And** the component MUST maintain visual consistency with other homepage sections
**And** the component MUST use CSS Modules to avoid global style pollution
**And** styles MUST be scoped to the Footer component only

#### Scenario: Footer content completeness

**Given** the Footer component is rendered
**When** I inspect the Footer content
**Then** the copyright section MUST display:
  - Copyright symbol (©)
  - Year (2026)
  - Organization name (Hagicode)
  - Rights statement (All rights reserved)
**And** the navigation section MUST include links to:
  - Documentation (`/docs` or `/product-overview`)
  - Blog (`/blog`)
  - GitHub repository
**And** the social section MUST include:
  - GitHub link matching the Starlight configuration
**And** all content MUST be in Chinese (Simplified) to match site language

#### Scenario: Footer cross-deployment compatibility

**Given** the site can be deployed with different base paths
**When** the site is deployed with `VITE_SITE_BASE` set
**Then** all internal links MUST include the correct base path prefix
**And** links MUST work correctly in root deployment (`/`)
**And** links MUST work correctly in subpath deployment (`/site/`)
**And** link resolution MUST be consistent with the rest of the site
**And** external links MUST NOT be affected by base path configuration

---

### Requirement: Custom 404 Error Page

The site MUST provide a custom 404 error page that displays friendly error messages and helpful navigation links when users access non-existent URLs.

#### Scenario: Display custom 404 page for non-existent URLs

- **GIVEN** a user navigates to a URL that does not exist on the site
- **WHEN** the page loads
- **THEN** a custom 404 page MUST be displayed at `src/pages/404.astro`
- **AND** the page MUST NOT be the Astro default 404 page
- **AND** the page MUST display a friendly Chinese error message: "页面未找到"
- **AND** the page MUST include a helpful description explaining that the requested page does not exist

#### Scenario: 404 page navigation links

- **GIVEN** the custom 404 page is displayed
- **WHEN** I view the page content
- **THEN** the page MUST provide navigation links to the following key pages:
  - **首页** (Homepage): Links to `/`
  - **安装指南** (Installation Guide): Links to `/docs/installation/docker-compose` or `/docs/installation/package-deployment`
  - **快速开始** (Quick Start): Links to `/docs/quick-start/`
  - **产品概览** (Product Overview): Links to `/docs/product-overview`
- **AND** all navigation links MUST use the `withBasePath` utility function to handle base path configuration
- **AND** all links MUST be clearly visible and easy to understand

#### Scenario: 404 page visual consistency

- **GIVEN** the custom 404 page is displayed
- **WHEN** I inspect the page design
- **THEN** the page MUST use the site's CSS custom properties for colors, spacing, and typography
- **AND** the page MUST maintain visual consistency with the homepage and documentation pages
- **AND** the page MUST integrate the Navbar component for consistent navigation
- **AND** the page MUST support both light and dark themes
- **AND** the page MUST adapt to theme switching without visual inconsistencies

#### Scenario: 404 page responsive design

- **GIVEN** the custom 404 page is displayed
- **WHEN** I view the page on different screen sizes
- **THEN** on mobile devices (width < 768px):
  - The navigation links MUST be displayed in a single-column vertical layout
  - The error code and title MUST be appropriately sized for mobile screens
- **AND** on tablet and desktop devices (width >= 768px):
  - The navigation links MAY be displayed in a grid layout (2 columns)
  - The content MUST be centered and properly spaced
- **AND** the layout MUST remain consistent and readable across all devices

#### Scenario: 404 page accessibility

- **GIVEN** the custom 404 page is displayed
- **WHEN** I navigate using assistive technologies
- **THEN** the page MUST use semantic HTML5 tags:
  - `<main>` for the main content area
  - `<nav>` for the navigation section
  - `<h1>` or `<h2>` for the error title
- **AND** all navigation links MUST have descriptive text for screen readers
- **AND** the navigation section MUST include an `aria-label="快速导航"` attribute
- **AND** keyboard navigation MUST be supported (Tab key to navigate links)
- **AND** focus indicators MUST be visible on all interactive elements
- **AND** color contrast MUST meet WCAG AA standards (4.5:1 for body text)

#### Scenario: 404 page theme initialization

- **GIVEN** a user navigates to a non-existent URL
- **WHEN** the 404 page loads
- **THEN** the page MUST initialize the theme before rendering to prevent theme flash
- **AND** the page MUST use an inline `<script is:inline>` tag for theme initialization
- **AND** the theme initialization logic MUST match the homepage (`index.astro`)
- **AND** the theme MUST be read from the `starlight-theme` localStorage key
- **AND** the theme MUST default to the system preference if no stored theme exists

#### Scenario: 404 page base path compatibility

- **GIVEN** the site is deployed with a configured base path
- **WHEN** the custom 404 page is displayed
- **THEN** all navigation links MUST respect the `VITE_SITE_BASE` environment variable
- **AND** links MUST work correctly in root deployment mode (`/`)
- **AND** links MUST work correctly in subpath deployment mode (`/site/`)
- **AND** the `withBasePath` utility function MUST be used for all internal links
- **AND** external links (if any) MUST NOT be affected by base path configuration

#### Scenario: 404 page build and deployment

- **GIVEN** the custom 404 page is implemented
- **WHEN** I run `npm run build`
- **THEN** the build MUST succeed without errors or warnings
- **AND** a `dist/404.html` file MUST be generated
- **AND** the file MUST contain the complete custom 404 page content
- **AND** when deployed, accessing non-existent URLs MUST display the custom 404 page

#### Scenario: 404 page performance optimization

- **GIVEN** the custom 404 page is implemented
- **WHEN** the page loads
- **THEN** the page MUST be a static HTML page with minimal JavaScript
- **AND** the page MUST NOT block initial rendering
- **AND** the Navbar component MUST use the `client:load` directive for hydration
- **AND** the page MUST load quickly and provide a good user experience

#### Scenario: 404 page TypeScript type safety

- **GIVEN** the custom 404 page is implemented
- **WHEN** I run `npm run typecheck`
- **THEN** the page MUST pass TypeScript strict mode checks
- **AND** all imported components and utility functions MUST have correct types
- **AND** there MUST NOT be any `any` types in the implementation
- **AND** the build MUST succeed without type errors

#### Scenario: 404 page error messaging

- **GIVEN** the custom 404 page is displayed
- **WHEN** I read the error message
- **THEN** the page MUST display a large error code: "404"
- **AND** the page MUST display a clear title: "页面未找到"
- **AND** the page MUST provide a helpful description in Chinese, such as:
  - "抱歉,您访问的页面不存在。请检查 URL 或从以下链接导航到其他页面。"
- **AND** the tone MUST be friendly and helpful
- **AND** the messaging MUST guide users toward relevant content

#### Scenario: 404 page navigation structure

- **GIVEN** the custom 404 page is displayed
- **WHEN** I inspect the navigation section
- **THEN** the navigation links MUST be organized in a clear, visually distinct section
- **AND** the links MUST be displayed as card-like elements with proper spacing
- **AND** each link MUST have a clear label indicating the destination
- **AND** the links MUST be displayed in a logical order (Homepage, Installation, Quick Start, Product Overview)
- **AND** hovering over a link MUST provide visual feedback (border highlight, shadow, or translation effect)

#### Scenario: 404 page integration with existing components

- **GIVEN** the custom 404 page is implemented
- **WHEN** I inspect the component structure
- **THEN** the page MUST import and use the `Navbar` component from `src/components/home/Navbar`
- **AND** the page MUST use the `withBasePath` utility function from `src/utils/path`
- **AND** the page MUST follow the same structure as other Astro pages (frontmatter, HTML, styles)
- **AND** the page MUST integrate seamlessly with the existing site architecture

---

### Requirement: Starlight Aside 组件支持

站点必须支持 Starlight Aside 组件(提示框)功能,用于在文档中突出显示重要信息、提示、警告和危险提示。

#### Scenario: Aside 组件基础类型支持

- **GIVEN** 文档中使用了 Aside 组件语法
- **WHEN** 页面被渲染
- **THEN** 以下 4 种类型的 Aside 必须被正确渲染:
  - `:::tip` - 提示信息(蓝色/信息样式)
  - `:::note` - 注释信息(灰色/注释样式)
  - `:::caution` - 警告信息(黄色/警告样式)
  - `:::danger` - 危险警告(红色/危险样式)

#### Scenario: Aside 组件自定义标题

- **GIVEN** 文档中使用了带自定义标题的 Aside 语法
- **WHEN** 页面被渲染
- **THEN** 自定义标题必须正确显示
- **AND** 语法格式为: `:::tip[自定义标题]`
- **AND** 标题文本必须是方括号内的内容

#### Scenario: Aside 组件复杂内容支持

- **GIVEN** Aside 组件内包含复杂内容
- **WHEN** 页面被渲染
- **THEN** 以下内容类型必须正确显示:
  - 纯文本段落
  - 列表(有序和无序)
  - 代码块(带语法高亮)
  - 链接(内部和外部)
  - 强调文本(加粗、斜体)

#### Scenario: Aside 组件主题适配

- **GIVEN** 站点支持浅色和深色主题
- **WHEN** 用户切换主题
- **THEN** Aside 组件必须适配当前主题
- **AND** 颜色和样式必须与主题保持一致
- **AND** 文字对比度必须符合 WCAG AA 标准

#### Scenario: Aside 组件响应式设计

- **GIVEN** Aside 组件被显示
- **WHEN** 在不同屏幕尺寸上查看
- **THEN** 在桌面端(> 1024px)必须正确显示
- **AND** 在平板端(768px - 1024px)必须正确显示
- **AND** 在移动端(< 768px)必须正确显示
- **AND** 文字大小和间距必须合适

#### Scenario: Aside 组件语法规范

- **GIVEN** 文档作者编写 MDX 内容
- **WHEN** 使用 Aside 组件
- **THEN** 必须使用以下语法规范:
  - **基本语法**: 使用 `:::` 开始和结束标记
  - **类型选择**: 使用 `tip`、`note`、`caution`、`danger` 之一
  - **标记闭合**: 必须正确闭合 `:::` 标记
  - **内容缩进**: 内容缩进必须正确
  - **带标题语法**: `:::tip[标题]` (使用方括号,不是空格)
  - **错误示例**: `:::tip 标题` (Docusaurus 语法,Starlight 不支持)
  - **正确示例**: `:::tip[标题]` (Starlight 语法)
  - **禁止类型**: 不得使用 `:::info`、`:::warning`、`:::error` 等不支持的类型

#### Scenario: Tabs 组件导入要求

- **GIVEN** 文档使用了 Starlight 的 Tabs 组件
- **WHEN** MDX 文件被处理
- **THEN** 文件必须在 frontmatter 后包含导入语句:
  ```mdx
  import { Tabs, TabItem } from '@astrojs/starlight/components';
  ```
- **AND** 缺少导入的文件必须导致构建错误
- **AND** 错误信息必须明确指出缺少的组件

#### Scenario: Aside 组件可访问性

- **GIVEN** Aside 组件被显示
- **WHEN** 使用辅助技术访问
- **THEN** Aside 必须使用语义化 HTML 结构
- **AND** 必须包含适当的 ARIA 角色标签
- **AND** 必须支持屏幕阅读器
- **AND** 颜色对比度必须 >= 4.5:1

#### Scenario: Aside 组件构建验证

- **GIVEN** 站点被构建
- **WHEN** 运行 `npm run build`
- **THEN** 包含 Aside 的页面必须成功构建
- **AND** 必须没有 Aside 相关的构建错误
- **AND** 生成的 HTML 必须包含正确的 aside 标签
- **AND** Starlight 默认 CSS 必须正确加载

#### Scenario: Aside 组件测试页面

- **GIVEN** 站点包含测试页面
- **WHEN** 访问 `/tests/aside-test/`
- **THEN** 必须看到所有 4 种类型的 Aside 示例
- **AND** 必须看到自定义标题示例
- **AND** 必须看到复杂内容示例(列表、代码块、链接)
- **AND** 所有示例必须正确渲染

---

## Quality Gates

- All documentation pages MUST pass HTML validation
- All TypeScript files MUST pass `npm run typecheck`
- The site MUST build successfully with `npm run build`
- All links MUST be valid (no broken links)
- All images MUST load correctly
- The site MUST pass accessibility audits (Lighthouse score > 90)
- The site MUST pass SEO audits (Lighthouse score > 90)

---

## Version History

- **2026-01-30**: Add product screenshot showcase requirements to homepage
- **2026-01-29**: Initial Astro site specification (migrated from docusaurus-site)

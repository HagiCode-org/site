# astro-site Specification Delta

## ADDED Requirements

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

## Version History

- **2026-01-30**: Add custom 404 error page requirements to astro-site specification

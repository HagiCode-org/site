# astro-site Spec Delta

本文档定义了对 `openspec/specs/astro-site/spec.md` 规范的变更,以支持在首页添加 Footer 组件。

---

## ADDED Requirements

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
  7. QuickStartSection (existing)
  8. **Footer (new)** ← ADDED
  9. Clarity (existing)
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

## Quality Gates

The Footer component MUST meet the following quality criteria before being considered complete:

- [ ] TypeScript strict mode checks pass (`npm run typecheck`)
- [ ] Production build succeeds without errors (`npm run build`)
- [ ] Footer displays correctly in local development (`npm run dev`)
- [ ] All links navigate to correct destinations
- [ ] Responsive layout works on mobile, tablet, and desktop
- [ ] Theme switching works correctly (light and dark)
- [ ] Keyboard navigation is functional
- [ ] No `any` types in the component
- [ ] CSS Modules properly scope styles
- [ ] Component uses semantic HTML
- [ ] Lighthouse accessibility score > 90
- [ ] Visual consistency with homepage design system

---

## Version History

- **2026-01-30**: Add Footer component requirements to astro-site specification

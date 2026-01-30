# astro-site Spec Delta

## MODIFIED Requirements

### Requirement: Custom Homepage

The site MUST have a comprehensive custom homepage that provides a complete introduction to the Hagicode project with interactive components, dynamic data, and engaging animations.

#### Scenario: Homepage rendering with all components

**Given** a user navigates to the site root
**When** the homepage loads
**Then** they MUST see a Hero section with the project title, description ("智能 · 便捷 · 有趣"), and CTA buttons
**And** they MUST see an Activity Metrics section displaying Docker Hub pull count and Clarity active users/sessions
**And** they MUST see a Features Showcase section highlighting Smart, Convenient, and Interesting features with animations
**And** they MUST see Video Player and Bilibili Video sections
**And** they MUST see a Community Showcase section
**And** they MUST see a Quick Start section with step-by-step guides
**And** all components MUST use Astro-compatible CSS variables for colors
**And** all interactive components MUST use appropriate client-side hydration directives (`client:load`, `client:visible`, `client:idle`, `client:lazy`)

#### Scenario: Homepage activity metrics data loading

**Given** the homepage is rendered
**When** the ActivityMetricsSection component loads
**Then** it MUST fetch data from `/activity-metrics.json`
**And** it MUST display Docker Hub pull count with number scrolling animation
**And** it MUST display Clarity active users and sessions with number scrolling animation
**And** it MUST show a skeleton loading state while data is being fetched
**And** it MUST show an empty state if data is not available
**And** it MUST handle errors gracefully with an error state

#### Scenario: Homepage animations and interactions

**Given** the homepage is loaded and the user is viewing the page
**When** interactive components come into view
**Then** the Features Showcase MUST display animated workflow stages (Idea → Proposal → Review → Tasks → Code → Test → Refactor → Docs → Archive)
**And** the efficiency chart MUST show a 300% improvement comparison
**And** number animations MUST use smooth easing (easeOutQuart)
**And** all animations MUST respect `prefers-reduced-motion` for accessibility
**And** animations MUST run at 60fps without performance issues

#### Scenario: Homepage responsive design

**Given** the Astro site has a custom homepage with multiple sections
**When** viewed on different screen sizes
**Then** all homepage components MUST be responsive:
  - Mobile (< 768px): Single column layout for metrics grid, stacked feature sections
  - Tablet (768px - 1024px): Two column layout for metrics grid
  - Desktop (> 1024px): Three column layout for metrics grid, horizontal feature sections
**And** the layout MUST adapt appropriately without horizontal scrolling
**And** text MUST remain readable at all screen sizes
**And** interactive elements (buttons, links) MUST be easily tappable on mobile

#### Scenario: Homepage theme consistency

**Given** a user has selected a theme (light or dark)
**When** they view the homepage
**Then** all homepage components MUST use Starlight CSS variables (`--sl-bg`, `--sl-text`, `--sl-color-accent`, etc.)
**And** the theme MUST be consistent across all sections (Hero, Activity Metrics, Features, Videos, Showcase, Quick Start)
**And** gradient backgrounds and card styles MUST adapt to the current theme
**And** the theme MUST persist across page navigation
**And** the theme MUST NOT flash between light and dark during initial page load

#### Scenario: Homepage performance and hydration

**Given** the homepage is built for production
**When** the page loads in a browser
**Then** the Hero section MUST hydrate immediately (`client:load`) as it's above the fold
**And** the Activity Metrics section MUST hydrate when visible (`client:visible`)
**And** the Features Showcase section MUST hydrate when visible (`client:visible`)
**And** Video components MUST hydrate lazily (`client:lazy`)
**And** the Quick Start and Showcase sections MUST hydrate when idle (`client:idle`)
**And** the total JavaScript bundle size for the homepage MUST be under 300 KB (gzip)
**And** the First Contentful Paint (FCP) MUST be under 1.5 seconds
**And** the homepage MUST pass Lighthouse performance audit with score > 90

---

## Rationale

The original "Custom Homepage" requirement was minimal and did not capture the full scope of functionality that existed in the Docusaurus version of the site. This spec delta enhances the requirement to include:

1. **Comprehensive Component Set**: All six major sections (Hero, Activity Metrics, Features, Videos, Showcase, Quick Start) that provide a complete user experience

2. **Dynamic Data Integration**: The Activity Metrics section fetches real-time data and displays it with animated counters, providing transparency into community growth

3. **Interactive Animations**: Framer Motion-based animations that engage users without sacrificing performance, including the OpenSpec workflow visualization

4. **Responsive Design**: Specific breakpoints and layout requirements for mobile, tablet, and desktop devices

5. **Theme Integration**: Explicit requirements for using Starlight CSS variables to ensure visual consistency with the documentation theme

6. **Performance Budgets**: Specific hydration strategies and bundle size limits to ensure the fast loading that Astro promises

This delta ensures that the implementation restores all functionality from the original Docusaurus homepage while leveraging Astro's performance advantages and architectural patterns.

# astro-site Specification Delta

## ADDED Requirements

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
  5. VideoShowcase (client:visible) ← NEW
  6. QuickStartSection (client:idle)
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

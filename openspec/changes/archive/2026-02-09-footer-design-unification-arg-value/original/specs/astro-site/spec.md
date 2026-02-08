## ADDED Requirements

### Requirement: Three-Column Footer Layout

The site SHALL provide a unified three-column Footer layout across both the homepage and documentation pages, displaying product information, quick links, and community/support links in an organized manner.

#### Scenario: Homepage displays three-column Footer

**Given** the homepage is loaded
**When** I scroll to the bottom of the page
**Then** I SHALL see a Footer with three columns:
  - Product information (Hagicode introduction, version info, changelog)
  - Quick links (documentation, blog, API reference, quick start)
  - Community & support (GitHub repository, license, issue tracker, contact email)
**And** the layout SHALL be responsive (single column on mobile, three columns on desktop)

#### Scenario: Documentation pages display three-column Footer

**Given** a documentation page is loaded
**When** I scroll to the bottom of the page
**Then** I SHALL see a Footer with the same three-column layout as the homepage
**And** the Footer SHALL preserve Starlight-specific features (EditLink, LastUpdated, Pagination)

#### Scenario: Footer displays copyright information

**Given** any page on the site is loaded
**When** I view the Footer
**Then** I SHALL see the copyright text "© {currentYear} Hagicode. All rights reserved."
**And** the year SHALL automatically update based on the current year

#### Scenario: Footer displays ICP filing information

**Given** any page on the site is loaded
**When** I view the Footer
**Then** I SHALL see the ICP filing number "闽ICP备2026004153号-1"
**And** the ICP link SHALL point to "https://beian.miit.gov.cn/"
**And** the link SHALL open in a new tab with proper rel attributes

### Requirement: Footer Theme Consistency

The Footer SHALL maintain visual consistency with the site's theme system, supporting both light and dark modes with smooth transitions.

#### Scenario: Footer adapts to light theme

**Given** the site theme is set to light mode
**When** I view the Footer
**Then** the Footer background SHALL be consistent with the light theme surface color
**And** all text SHALL be readable with appropriate contrast
**And** links SHALL use the theme's primary color for hover states

#### Scenario: Footer adapts to dark theme

**Given** the site theme is set to dark mode
**When** I view the Footer
**Then** the Footer background SHALL be consistent with the dark theme surface color
**And** all text SHALL be readable with appropriate contrast
**And** links SHALL use the theme's primary color for hover states

#### Scenario: Footer transitions smoothly on theme change

**Given** I am viewing the Footer
**When** I toggle the theme between light and dark modes
**Then** the Footer SHALL transition smoothly using CSS transitions
**And** the transition duration SHALL be consistent with the site's transition settings

### Requirement: Footer Responsive Design

The Footer SHALL provide an optimal viewing experience across all device sizes using responsive breakpoints.

#### Scenario: Mobile layout (less than 768px)

**Given** I am viewing the site on a mobile device (screen width < 768px)
**When** I view the Footer
**Then** the Footer SHALL display in a single-column vertical layout
**And** all sections SHALL be stacked vertically
**And** links SHALL be vertically stacked within each section
**And** touch targets SHALL be at least 44x44 pixels

#### Scenario: Tablet layout (768px to 1023px)

**Given** I am viewing the site on a tablet device (screen width 768px - 1023px)
**When** I view the Footer
**Then** the Footer SHALL display in a two-column layout
**And** the product information and quick links SHALL be in the first row
**And** the community & support section SHALL span the full width in the second row

#### Scenario: Desktop layout (1024px and above)

**Given** I am viewing the site on a desktop device (screen width ≥ 1024px)
**When** I view the Footer
**Then** the Footer SHALL display in a three-column layout
**And** each column SHALL have equal width or proportional width as designed
**And** the maximum width SHALL be constrained to 1200px centered on the page

### Requirement: Footer Accessibility

The Footer SHALL meet accessibility standards to ensure all users can navigate and interact with Footer content.

#### Scenario: Keyboard navigation

**Given** I am using a keyboard to navigate the site
**When** I press the Tab key while the Footer is focused
**Then** focus SHALL move through Footer links in a logical order
**And** each link SHALL have a visible focus indicator
**And** the focus indicator SHALL meet WCAG 2.1 AA standards for contrast

#### Scenario: Screen reader compatibility

**Given** I am using a screen reader
**When** I navigate to the Footer
**Then** the Footer SHALL be announced as a "footer" landmark
**And** each navigation section SHALL have an appropriate label
**And** all links SHALL have descriptive aria-labels where needed

#### Scenario: Sematic HTML structure

**Given** I inspect the Footer HTML structure
**When** I analyze the markup
**Then** the Footer SHALL use the `<footer>` element
**And** navigation sections SHALL use `<nav>` elements with appropriate aria-labels
**And** headings SHALL use appropriate heading levels (h3, h4)

## MODIFIED Requirements

### Requirement: Homepage Styling System

The homepage styling system SHALL provide CSS variables for Footer theming to support the unified three-column Footer design.

#### Scenario: Footer CSS variables are defined

**Given** the `src/styles/homepage.css` file exists
**When** I inspect the CSS variables
**Then** the following Footer variables SHALL be defined:
  - `--footer-bg`: Footer background color (light and dark theme variants)
  - `--footer-border`: Footer border color
  - `--footer-link-color`: Default link color
  - `--footer-link-hover`: Link hover color
  - `--footer-section-gap`: Spacing between Footer sections
  - `--footer-grid-template`: Grid template for responsive layout

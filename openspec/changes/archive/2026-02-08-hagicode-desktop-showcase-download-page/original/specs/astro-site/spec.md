# astro-site Specification Delta

## ADDED Requirements

### Requirement: Desktop Product Showcase Page

The site MUST include a dedicated page for showcasing and downloading Hagicode Desktop that integrates version information from the external download service.

#### Scenario: Desktop showcase page rendering

- **GIVEN** the site has been built with successful data fetching
- **WHEN** a user navigates to `/desktop`
- **THEN** a Desktop showcase page MUST be displayed
- **AND** the page MUST include:
  - A hero section with product title and description
  - Download buttons for Windows, macOS, and Linux platforms
  - Latest version information (version number and release date)
  - Feature highlights section
  - System requirements section
  - Installation guide section
  - Version history section
  - FAQ section

#### Scenario: Desktop page data fetching at build time

- **GIVEN** the Astro build process is running
- **WHEN** the `/desktop` page is being built
- **THEN** the build MUST fetch version data from `https://desktop.dl.hagicode.com/index.json`
- **AND** the request MUST timeout after 30 seconds
- **AND** the fetched data MUST be parsed and validated
- **AND** the page MUST be generated as static HTML with the fetched data

#### Scenario: Desktop page error handling

- **GIVEN** the build process is running
- **WHEN** fetching `index.json` fails (network error, timeout, or invalid data)
- **THEN** the page MUST still be generated
- **AND** a friendly error message MUST be displayed to users
- **AND** the error page MUST provide:
  - A clear explanation of the error
  - A link to the external download site (`desktop.dl.hagicode.com`)
  - A retry button (if applicable)
- **AND** the build MUST NOT fail

#### Scenario: Desktop page navigation integration

- **GIVEN** the site navigation is configured in `src/config/navigation.ts`
- **WHEN** the navigation is rendered on any page
- **THEN** a "桌面客户端" (Desktop Client) link MUST be present
- **AND** the link MUST point to `/desktop`
- **AND** the link MUST use the `withBasePath` utility function
- **AND** the link MUST include a laptop icon from Starlight's icon system

#### Scenario: Desktop download button functionality

- **GIVEN** a user is viewing the Desktop showcase page
- **WHEN** they click on a platform-specific download button (Windows/macOS/Linux)
- **THEN** the browser MUST initiate a download of the installation package
- **AND** the download URL MUST point to `desktop.dl.hagicode.com`
- **AND** the link MUST include `rel="noopener noreferrer"` for external links

#### Scenario: Desktop page responsive design

- **GIVEN** the Desktop showcase page is displayed
- **WHEN** viewed on different screen sizes
- **THEN** on mobile (width < 768px):
  - Download buttons MUST be stacked vertically
  - Feature cards MUST be displayed in a single column
  - All content MUST be readable without horizontal scrolling
- **AND** on tablet (768px - 1024px):
  - Download buttons MAY be displayed in 2-3 columns
  - Feature cards MUST be displayed in 2 columns
- **AND** on desktop (width >= 1024px):
  - Download buttons MUST be displayed in 3 columns
  - Feature cards MUST be displayed in 3 columns

#### Scenario: Desktop page theme support

- **GIVEN** the site supports light and dark themes
- **WHEN** a user switches between themes on the Desktop page
- **THEN** all page elements MUST adapt to the current theme
- **AND** text contrast MUST meet WCAG AA standards in both themes
- **AND** the page MUST NOT flash or display inconsistent theming

#### Scenario: Desktop page SEO optimization

- **GIVEN** the Desktop showcase page is rendered
- **WHEN** inspecting the page HTML
- **THEN** the page MUST include:
  - A descriptive `<title>` tag: "Hagicode Desktop - 下载"
  - A meta description with relevant keywords
  - Open Graph tags for social sharing
  - Canonical URL pointing to the correct base path

#### Scenario: Desktop page TypeScript type safety

- **GIVEN** the Desktop page and components are implemented
- **WHEN** I run `npm run typecheck`
- **THEN** all TypeScript files MUST pass strict mode checks
- **AND** the `DesktopVersion` interface MUST be properly defined in `src/types/desktop.ts`
- **AND** there MUST NOT be any `any` types in the implementation

#### Scenario: Desktop page build validation

- **GIVEN** the Desktop page implementation is complete
- **WHEN** I run `npm run build`
- **THEN** the build MUST succeed without errors
- **AND** a `dist/desktop/index.html` file MUST be generated
- **AND** the page MUST contain the fetched version data (if fetch succeeded)
- **AND** the page MUST contain error content (if fetch failed)

#### Scenario: Desktop page content completeness

- **GIVEN** the Desktop showcase page is rendered with valid data
- **WHEN** I inspect the page content
- **THEN** the page MUST include at least 3 feature highlights
- **AND** the page MUST include system requirements for all platforms
- **AND** the page MUST include installation steps for all platforms
- **AND** the page MUST include at least 5 FAQ items
- **AND** the page MUST display version history in reverse chronological order

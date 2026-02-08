# Navigation Capability Specification

This specification defines the navigation configuration and behavior for the Hagicode documentation site.

## ADDED Requirements

### Requirement: Desktop Client Navigation Entry

The site SHALL provide a "Desktop" navigation entry that links to the desktop client download page at `/desktop/`.

#### Scenario: User navigates to desktop client page from homepage

- **GIVEN** a user views the homepage with navigation bar
- **WHEN** they click the "客户端" (Desktop Client) navigation link
- **THEN** they are redirected to `/desktop/` page
- **AND** the desktop download page is displayed

#### Scenario: User navigates to desktop client page from documentation

- **GIVEN** a user views any documentation page with Starlight header
- **WHEN** they click the "客户端" (Desktop Client) navigation link
- **THEN** they are redirected to `/desktop/` page
- **AND** the desktop download page is displayed

#### Scenario: Navigation entry appears in mobile menu

- **GIVEN** a user views the site on a mobile device
- **WHEN** they open the mobile navigation menu
- **THEN** the "客户端" navigation link is visible
- **AND** clicking it navigates to `/desktop/`

#### Scenario: Navigation works with base path configuration

- **GIVEN** the site is deployed with a base path (e.g., `VITE_SITE_BASE=/site`)
- **WHEN** a user clicks the "客户端" navigation link
- **THEN** the link correctly resolves to `{base_path}/desktop/`
- **AND** navigation functions properly

### Requirement: Navigation Configuration Single Source of Truth

Navigation links SHALL be defined in a single configuration file (`src/config/navigation.ts`) and consumed by all navigation components.

#### Scenario: Homepage navbar uses shared navigation config

- **GIVEN** the navigation links are defined in `src/config/navigation.ts`
- **WHEN** the homepage navbar component renders
- **THEN** it imports and displays links from the shared config
- **AND** all links including "客户端" are shown

#### Scenario: Documentation header uses shared navigation config

- **GIVEN** the navigation links are defined in `src/config/navigation.ts`
- **WHEN** the Starlight documentation header renders
- **THEN** it imports and displays links from the shared config
- **AND** all links including "客户端" are shown

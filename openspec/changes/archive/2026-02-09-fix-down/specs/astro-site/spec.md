## MODIFIED Requirements

### Requirement: Custom Homepage

The site MUST have a custom homepage that provides a welcoming introduction to the Hagicode project with properly functioning install buttons that display the latest Desktop version information across all platform options.

#### Scenario: Homepage rendering

**Given** a user navigates to the site root
**When** the homepage loads
**Then** they MUST see a Hero section with the project title and description
**And** they MUST see Feature highlights
**And** they MUST see a Product showcase section
**And** they MUST see a Video showcase section
**And** all components MUST use Astro-compatible CSS variables for colors
**And** the install buttons MUST display the latest Desktop version information

#### Scenario: Homepage install button version data flow

**Given** the homepage is being built
**When** the build process executes `index.astro`
**THEN** the page MUST fetch Desktop version data using `fetchDesktopVersions()`
**AND** the data MUST be grouped by platform using `groupAssetsByPlatform()`
**AND** the version data MUST be passed to Navbar component as props
**AND** the version data MUST be passed to HeroSection component as props
**AND** both components MUST pass the data to their InstallButton components

#### Scenario: Install button displays platform options

**Given** the homepage has loaded with version data
**When** I click the install button dropdown menu
**THEN** the dropdown MUST display platform groups for Windows, macOS, and Linux
**AND** each platform MUST show available download options (e.g., installer, portable)
**AND** each option MUST include the correct download URL
**AND** the dropdown MUST include a Docker installation option
**AND** all options MUST be accessible and clickable

#### Scenario: Homepage responsiveness

**Given** the Astro site has a custom homepage
**When** viewed on different screen sizes
**Then** all homepage components MUST be responsive
**And** the layout MUST adapt appropriately to mobile, tablet, and desktop
**And** all install buttons MUST remain accessible and functional on all screen sizes
**And** the mobile menu install button MUST display the same version information as the desktop version

# Capability: Desktop Download UI

## ADDED Requirements

### Requirement: Unified Platform Button Group

The desktop download page SHALL display a unified button group showing all three platforms (Windows, macOS, Linux) simultaneously with proper visual hierarchy based on the user's detected operating system.

#### Scenario: User visits desktop page on Windows

- **WHEN** a user visits the desktop page on a Windows device
- **THEN** the Windows button SHALL be displayed as the primary button with gradient background
- **AND** the macOS and Linux buttons SHALL be displayed as secondary buttons with muted styling
- **AND** all three buttons SHALL be visible simultaneously

#### Scenario: User visits desktop page on macOS

- **WHEN** a user visits the desktop page on a macOS device
- **THEN** the macOS button SHALL be displayed as the primary button with gradient background
- **AND** the Windows and Linux buttons SHALL be displayed as secondary buttons with muted styling
- **AND** all three buttons SHALL be visible simultaneously

#### Scenario: User visits desktop page on Linux

- **WHEN** a user visits the desktop page on a Linux device
- **THEN** the Linux button SHALL be displayed as the primary button with gradient background
- **AND** the Windows and macOS buttons SHALL be displayed as secondary buttons with muted styling
- **AND** all three buttons SHALL be visible simultaneously

#### Scenario: Platform detection fails

- **WHEN** the user's operating system cannot be detected
- **THEN** all three platform buttons SHALL be displayed with equal (secondary) styling
- **AND** no button SHALL be marked as primary

### Requirement: Platform Button Styling

Each platform button SHALL support two style variants: primary (for detected OS) and secondary (for other platforms), with consistent visual design matching the InstallButton component.

#### Scenario: Primary button appearance

- **WHEN** a platform button is displayed as primary
- **THEN** it SHALL use a gradient background: `linear-gradient(135deg, #0080FF 0%, #00CCCC 50%, #22C55E 100%)`
- **AND** it SHALL have an animated gradient shift effect (3s wave animation)
- **AND** it SHALL display the platform name and "立即下载" (Download Now) text
- **AND** it SHALL include a dropdown indicator icon

#### Scenario: Secondary button appearance

- **WHEN** a platform button is displayed as secondary
- **THEN** it SHALL use a gray/muted background color
- **AND** it SHALL have reduced opacity compared to primary button
- **AND** it SHALL display the platform name and dropdown indicator
- **AND** hover effects SHALL be consistent with primary button

#### Scenario: Dark theme compatibility

- **WHEN** the dark theme is active
- **THEN** the primary button gradient SHALL remain visible with appropriate contrast
- **AND** the secondary button SHALL adjust its gray values for dark background
- **AND** all text SHALL remain readable

### Requirement: Platform Dropdown Menus

Each platform button SHALL include a dropdown menu showing all available download options for that platform, matching the functionality of the InstallButton component.

#### Scenario: Opening platform dropdown

- **WHEN** a user clicks on any platform button
- **THEN** a dropdown menu SHALL appear showing all download options for that platform
- **AND** the dropdown SHALL be positioned below the button
- **AND** only one dropdown SHALL be open at a time

#### Scenario: Dropdown menu contents for Windows

- **WHEN** the Windows dropdown is opened
- **THEN** it SHALL show a "Windows" section label
- **AND** it SHALL list available downloads: Setup (.exe), Portable (.zip), Microsoft Store
- **AND** each item SHALL be clickable to initiate download

#### Scenario: Dropdown menu contents for macOS

- **WHEN** the macOS dropdown is opened
- **THEN** it SHALL show a "macOS" section label
- **AND** it SHALL list available downloads: Apple Silicon (.dmg), Intel (.dmg)
- **AND** each item SHALL be clickable to initiate download

#### Scenario: Dropdown menu contents for Linux

- **WHEN** the Linux dropdown is opened
- **THEN** it SHALL show a "Linux" section label
- **AND** it SHALL list available downloads: AppImage, Debian/Ubuntu (.deb), Fedora/RHEL (.rpm), Tarball
- **AND** each item SHALL be clickable to initiate download

#### Scenario: Closing dropdown

- **WHEN** a user clicks outside any open dropdown
- **THEN** the dropdown SHALL close
- **AND** when a user selects a download option from the dropdown
- **THEN** the dropdown SHALL close after initiating the download
- **AND** when a user presses the Escape key
- **THEN** the dropdown SHALL close

### Requirement: Version History Access

The desktop download UI SHALL preserve the version history functionality, allowing users to access historical versions after registration.

#### Scenario: Access version history from dropdown

- **WHEN** a user opens any platform dropdown
- **THEN** a "查看历史版本" (View Version History) option SHALL be visible at the bottom of the dropdown
- **AND** clicking this option SHALL open the registration modal

#### Scenario: Registration modal display

- **WHEN** a user clicks "View Version History"
- **THEN** a modal SHALL appear requesting email registration
- **AND** the modal SHALL display the platform name in the context
- **AND** upon successful registration, the user SHALL gain access to version history

### Requirement: Responsive Design

The unified button group layout SHALL adapt gracefully to different screen sizes, maintaining usability on mobile devices.

#### Scenario: Desktop layout (>768px)

- **WHEN** the screen width is greater than 768px
- **THEN** all three platform buttons SHALL be displayed in a horizontal row
- **AND** buttons SHALL have equal width
- **AND** dropdowns SHALL extend below the buttons

#### Scenario: Tablet layout (481px-768px)

- **WHEN** the screen width is between 481px and 768px
- **THEN** the platform buttons SHALL be displayed in a horizontal row
- **AND** button text MAY use abbreviated labels if needed
- **AND** touch targets SHALL remain at least 44px tall

#### Scenario: Mobile layout (≤480px)

- **WHEN** the screen width is 480px or less
- **THEN** the platform buttons SHALL be displayed in a vertical stack
- **OR** the buttons MAY use a horizontal scrollable container
- **AND** each button SHALL be full-width
- **AND** dropdowns SHALL be positioned to avoid viewport overflow

### Requirement: Accessibility

The desktop download UI SHALL be fully accessible via keyboard navigation and screen readers.

#### Scenario: Keyboard navigation

- **WHEN** a user uses the Tab key
- **THEN** focus SHALL move through platform buttons in logical order
- **AND** when a button has focus, pressing Enter or Space SHALL open its dropdown
- **AND** arrow keys SHALL navigate within the open dropdown
- **AND** Escape SHALL close the dropdown and return focus to the button

#### Scenario: Screen reader announcements

- **WHEN** a screen reader encounters the button group
- **THEN** it SHALL announce "Download options for Windows, macOS, and Linux"
- **AND** each button SHALL announce its platform name and whether it's recommended
- **AND** dropdown state changes (open/close) SHALL be announced

### Requirement: Data Integration

The component SHALL use existing shared utilities for version data and platform detection.

#### Scenario: Version data retrieval

- **WHEN** the DesktopHero component mounts
- **THEN** it SHALL call `getDesktopVersionData()` from `@shared/version-manager`
- **AND** it SHALL handle loading state while data is being fetched
- **AND** it SHALL handle error state if data fetch fails

#### Scenario: Platform detection

- **WHEN** determining which platform button should be primary
- **THEN** the component SHALL call `detectOS()` from `@shared/desktop-utils`
- **AND** the detected OS SHALL be used to set the primary button style
- **AND** URL parameter `?os=windows|macos|linux` SHALL override detected OS for testing

#### Scenario: Channel selection

- **WHEN** a user selects the "stable" channel
- **THEN** the version data SHALL display the stable version's download options
- **AND** when a user selects the "beta" channel
- **THEN** the version data SHALL display the beta version's download options
- **AND** the channel selector SHALL remain visible below the button group

## REMOVED Requirements

### Requirement: Card-Based Platform Layout

**Reason**: The card-based layout where only the detected OS is shown prominently and other platforms are displayed in smaller cards is being replaced by the unified button group layout for better visibility and consistency.

**Migration**: All functionality from the card layout (platform selection, download initiation, version history access) is preserved in the new button group layout. The `currentOSCard` and `otherOS` CSS classes and JSX structures will be removed and replaced with the new `buttonGroup` structure.

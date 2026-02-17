## ADDED Requirements

### Requirement: Enhanced Version Display Format

The InstallButton component SHALL display comprehensive version information including version number, architecture type, and file size for each download option.

#### Scenario: User views download options

- **WHEN** user opens the InstallButton dropdown menu
- **THEN** each download option SHALL display:
  - Platform name with icon (🍎 macOS, 🪟 Windows, 🐧 Linux)
  - Asset type label (e.g., "Apple Silicon", "Setup", "AppImage")
  - Architecture identifier (e.g., "ARM64", "x64", "通用")
  - Version number (e.g., "v0.1.12")
  - File size (e.g., "102 MB")
  - Recommended indicator (⭐) for recommended options

#### Scenario: Version number unavailable

- **WHEN** version data is not available or fails to load
- **THEN** the component SHALL display a fallback label without version number
- **AND** the component SHALL still display architecture and file size information

#### Scenario: Architecture information display

- **WHEN** displaying macOS download options
- **THEN** Apple Silicon version SHALL be labeled as "ARM64"
- **AND** Intel version SHALL be labeled as "x64"

- **WHEN** displaying Windows download options
- **THEN** each option SHALL be labeled as "x64" (assuming 64-bit only)

- **WHEN** displaying Linux download options
- **THEN** AppImage SHALL be labeled as "通用" (universal)
- **AND** Debian package SHALL be labeled as "amd64"
- **AND** Tarball SHALL be labeled as "通用" (universal)

### Requirement: Expanded Dropdown Panel Dimensions

The InstallButton dropdown panel SHALL have increased dimensions to accommodate enhanced information display.

#### Scenario: Dropdown panel rendering

- **WHEN** the dropdown menu is rendered
- **THEN** the panel width SHALL be at least 380px (increased from 280px)
- **AND** the maximum height SHALL be at least 500px (increased from 400px)
- **AND** the minimum row height SHALL be 40px (increased from 32px)
- **AND** the internal padding SHALL be at least 12px (increased from 8px)

#### Scenario: Responsive design on mobile

- **WHEN** viewing on a mobile device (screen width < 480px)
- **THEN** the panel width SHALL adapt to 100% of viewport
- **AND** the maximum width SHALL be capped at 350px
- **AND** all information SHALL remain readable without horizontal scrolling

### Requirement: Visual Platform Grouping

The InstallButton dropdown SHALL visually separate different operating system platforms with enhanced group headers.

#### Scenario: Platform group headers

- **WHEN** displaying download options
- **THEN** each platform group SHALL have a header containing:
  - Platform icon (🍎 for macOS, 🪟 for Windows, 🐧 for Linux)
  - Platform name ("macOS", "Windows", "Linux")
  - Version number (e.g., "v0.1.12")

- **AND** group headers SHALL be visually distinct from download options
- **AND** group headers SHALL use different styling (e.g., bold, different background color)

#### Scenario: Recommended version indication

- **WHEN** displaying download options within a platform group
- **THEN** the recommended download SHALL have a visual indicator (⭐)
- **AND** the recommended download SHALL be listed first in the group
- **AND** the indicator SHALL be clearly visible and distinct

### Requirement: Consistent Implementation Across Sites

Both the documentation site and marketing site SHALL implement the InstallButton component with identical display formatting and behavior.

#### Scenario: Cross-site consistency

- **WHEN** users view InstallButton on docs.hagicode.com
- **AND** users view InstallButton on hagicode.com
- **THEN** both dropdown panels SHALL have identical:
  - Panel dimensions (380px width, 500px max height)
  - Display format (version + architecture + size)
  - Platform icons and grouping
  - Recommended indicators
  - Color scheme and styling

#### Scenario: Shared utility functions

- **WHEN** formatting download option labels
- **THEN** both sites SHALL use the same utility functions from `@shared/desktop-utils`
- **AND** label formatting logic SHALL NOT be duplicated in component code

## MODIFIED Requirements

### Requirement: InstallButton Component Interface

The InstallButton component SHALL accept version data as props and render an enhanced download dropdown with detailed version information.

#### Scenario: Component receives version data

- **WHEN** the InstallButton component receives `initialVersion` prop
- **AND** receives `initialPlatforms` prop
- **THEN** the component SHALL extract the version number from `initialVersion.version`
- **AND** SHALL use this version number in all display labels
- **AND** SHALL format platform labels with icons and version numbers

#### Scenario: Component renders dropdown

- **WHEN** user clicks the dropdown toggle button
- **THEN** the component SHALL render a dropdown menu with enhanced styling
- **AND** SHALL group downloads by platform (Windows, macOS, Linux)
- **AND** SHALL display each download option with full details (type, architecture, version, size)
- **AND** SHALL maintain the expanded panel dimensions (380px x 500px)

#### Scenario: Fallback when data unavailable

- **WHEN** version data is not available or fails to load
- **THEN** the component SHALL display a simple download button
- **AND** the button SHALL link to the desktop page
- **AND** no dropdown SHALL be rendered

### Requirement: Asset Type Label Formatting

The system SHALL provide enhanced labels for asset types that include architecture information when applicable.

#### Scenario: macOS asset type labels

- **WHEN** asset type is MacOSApple
- **THEN** the label SHALL be "Apple Silicon (ARM64)"

- **WHEN** asset type is MacOSIntel
- **THEN** the label SHALL be "Intel (x64)"

#### Scenario: Windows asset type labels

- **WHEN** asset type is WindowsSetup
- **THEN** the label SHALL be "安装程序 (x64) Setup"

- **WHEN** asset type is WindowsPortable
- **THEN** the label SHALL be "便携版 (x64) Portable"

- **WHEN** asset type is WindowsStore
- **THEN** the label SHALL be "Microsoft Store"

#### Scenario: Linux asset type labels

- **WHEN** asset type is LinuxAppImage
- **THEN** the label SHALL be "AppImage (通用)"

- **WHEN** asset type is LinuxDeb
- **THEN** the label SHALL be "Debian 包 (Ubuntu/Debian) amd64"

- **WHEN** asset type is LinuxTarball
- **THEN** the label SHALL be "压缩包 (Tarball)"

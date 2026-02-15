## ADDED Requirements

### Requirement: Desktop Version Channel Support

The system SHALL support multiple version channels for Hagicode Desktop downloads, allowing users to choose between stable and beta releases.

#### Scenario: Fetch version data with channels

**Given** the official Desktop API supports the new data format with `channels` field
**When** I call `fetchDesktopVersions()` function
**Then** the response MUST include:
  - `updatedAt` timestamp
  - `versions` array with complete version history
  - `channels` object containing:
    - `stable` channel with `latest` version and `versions` array
    - `beta` channel with `latest` version and `versions` array
**And** the function MUST handle both new and legacy data formats

#### Scenario: Get latest version from specific channel

**Given** the version data includes `channels` information
**When** I call `getChannelLatestVersion('stable')`
**Then** the system MUST return the `DesktopVersion` object for `channels.stable.latest`
**And** when I call `getChannelLatestVersion('beta')`
**Then** the system MUST return the `DesktopVersion` object for `channels.beta.latest`
**And** if the channel data is not available, the system MUST fall back to the first version in `versions` array

#### Scenario: Display channel selector on Desktop download page

**Given** I am on the Desktop download page
**When** the page loads
**Then** I MUST see a channel selector with two options:
  - "稳定版" (Stable)
  - "测试版 Beta" (Beta)
**And** the stable channel MUST be selected by default
**And** the page MUST display the latest version for the selected channel

#### Scenario: Switch between channels on Desktop page

**Given** I am on the Desktop download page viewing stable versions
**When** I click on the "测试版 Beta" tab
**Then** the page MUST update to show beta channel versions
**And** the version list MUST only include beta versions
**And** a warning message MUST be displayed indicating beta versions may be unstable
**And** when I click back to "稳定版"
**Then** the page MUST restore the stable channel view

#### Scenario: InstallButton displays channel information

**Given** the InstallButton component is rendered with `channel="beta"` prop
**When** the component displays the download button
**Then** the button MUST include a visual indicator (badge) showing "测试版"
**And** the download link MUST point to the latest beta version
**And** when `channel="stable"` or not specified
**Then** the button MUST NOT show the beta indicator
**And** the download link MUST point to the latest stable version

#### Scenario: Backward compatibility with legacy data format

**Given** the official Desktop API returns the legacy format (without `channels` field)
**When** any component calls `fetchDesktopVersions()`
**Then** the function MUST successfully return data
**And** the system MUST treat all versions as stable channel versions
**And** the InstallButton MUST function normally without channel selection
**And** the Desktop download page MUST display versions without channel selector

#### Scenario: Version history displays channel badges

**Given** I am viewing the version history on the Desktop page
**When** the page renders version items
**Then** each version item MUST include a channel badge:
  - "稳定版" for stable releases
  - "测试版" for beta/pre-release releases
**And** the badges MUST use distinct visual styles (colors)
**And** the latest version MUST be highlighted

#### Scenario: Channel data validation

**Given** the system receives version data with `channels` field
**When** the data is parsed
**Then** the system MUST validate:
  - `channels.stable.latest` exists and is a valid version string
  - `channels.beta.latest` exists and is a valid version string
  - `channels.stable.versions` is an array of version strings
  - `channels.beta.versions` is an array of version strings
**And** if validation fails for a specific channel
**Then** the system MUST fall back to using the main `versions` array

#### Scenario: Type safety for channel parameters

**Given** I am using TypeScript in the project
**When** I import the Desktop types
**Then** the `DesktopIndexResponse` interface MUST include:
  ```typescript
  channels?: {
    stable: ChannelInfo;
    beta: ChannelInfo;
  }
  ```
**And** the `ChannelInfo` interface MUST define:
  - `latest: string`
  - `versions: string[]`
**And** component props accepting channel MUST use `'stable' | 'beta'` type

#### Scenario: Version Monitor script handles channel data

**Given** the version-monitor script runs to check for updates
**When** it fetches the official Desktop API
**Then** if `channels` field exists
  - The script MUST compare `channels.stable.latest` with the current stable version
  - The script MUST compare `channels.beta.latest` with the current beta version (if tracking beta)
**And** if `channels` field does not exist
  - The script MUST fall back to comparing the first version in `versions` array

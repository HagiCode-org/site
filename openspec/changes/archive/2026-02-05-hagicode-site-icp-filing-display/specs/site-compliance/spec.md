# Site Compliance Specification

## ADDED Requirements

### Requirement: ICP Filing Display

The documentation site SHALL display ICP (Internet Content Provider) filing information in the footer section of all pages to comply with Chinese mainland website regulations.

#### Scenario: Homepage footer displays ICP number

- **WHEN** a user views the homepage (`/`)
- **THEN** the footer SHALL display the ICP filing number "闽ICP备2026004153号-1" at the bottom of the footer section
- **AND** the ICP number SHALL be a clickable link to https://beian.miit.gov.cn/
- **AND** the link SHALL open in a new tab with `rel="noopener noreferrer"` attributes
- **AND** the text SHALL be centered and visually consistent with the footer design

#### Scenario: Documentation pages footer displays ICP number

- **WHEN** a user views any documentation page (e.g., `/product-overview/`, `/blog/*`)
- **THEN** the footer SHALL display the ICP filing number "闽ICP备2026004153号-1" at the bottom of the footer section
- **AND** the ICP number SHALL be a clickable link to https://beian.miit.gov.cn/
- **AND** the link SHALL open in a new tab with `rel="noopener noreferrer"` attributes
- **AND** the display SHALL be consistent with Starlight theme styling

#### Scenario: ICP information visible across all themes

- **WHEN** a user switches between light, dark, or lunar new year themes
- **THEN** the ICP filing information SHALL remain visible in all themes
- **AND** the text color SHALL maintain sufficient contrast for readability (WCAG AA: 4.5:1 minimum)
- **AND** the styling SHALL adapt to theme color schemes using CSS variables

#### Scenario: ICP information accessible on mobile devices

- **WHEN** a user views the site on a mobile device (viewport width < 768px)
- **THEN** the ICP filing information SHALL be displayed without horizontal overflow
- **AND** the text SHALL be legible (font size >= 12px)
- **AND** the link SHALL be easily tappable (touch target >= 44x44px recommended)
- **AND** the layout SHALL remain centered and aligned with footer content

#### Scenario: ICP link provides accessible navigation

- **WHEN** a user interacts with the ICP filing link using keyboard navigation or screen reader
- **THEN** the link SHALL have an appropriate `aria-label` attribute describing the link purpose
- **AND** the link SHALL be focusable with visible focus indicator
- **AND** the screen reader SHALL announce "查看 ICP 备案信息" or equivalent descriptive text

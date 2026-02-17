## MODIFIED Requirements

### Requirement: Install Button Dropdown Panel Visibility
The InstallButton component's dropdown panel SHALL be fully visible and not obscured by any content elements below the Hero section on the homepage.

#### Scenario: User opens install button dropdown on homepage
- **WHEN** a user clicks the dropdown toggle button on the InstallButton component in the Hero section
- **THEN** the dropdown panel SHALL appear above all other page content elements
- **AND** the dropdown panel SHALL be completely visible without any clipping or obstruction
- **AND** the dropdown panel SHALL have a z-index value higher than all adjacent content sections

#### Scenario: User interacts with dropdown menu items
- **WHEN** the dropdown panel is open
- **THEN** all menu items SHALL be clickable and interactive
- **AND** no underlying content SHALL overlay or interfere with the dropdown panel

#### Scenario: Dropdown visibility across all themes
- **WHEN** the user switches between light, dark, and lunar-new-year themes
- **THEN** the dropdown panel SHALL maintain proper z-index stacking order
- **AND** the dropdown SHALL remain visible and functional in all themes

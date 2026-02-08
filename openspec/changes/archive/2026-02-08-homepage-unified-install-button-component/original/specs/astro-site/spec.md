## ADDED Requirements

### Requirement: Global Unified Install Button Component

The site MUST provide a unified install button component that can be used across multiple locations (Header navigation and homepage Hero section) to provide direct download links to Hagicode Desktop installation packages with automatic operating system detection.

#### Scenario: Display install button in Header navigation

**Given** I am on any page of the site
**When** I view the Header navigation bar
**Then** I MUST see an install button with the label "立即安装"
**And** the button MUST use a compact size variant suitable for navigation
**And** clicking the button MUST trigger a direct download (not navigate to another page)
**And** the button MUST display a dropdown toggle when multiple versions are available

#### Scenario: Display install button on homepage Hero section

**Given** the homepage is loaded
**When** I view the Hero section
**Then** I MUST see an install button with the label "立即安装"
**And** the button MUST use the site's gradient primary style with full size variant
**And** the button MUST display a dropdown toggle when multiple versions are available
**And** the button MUST have the same functionality as the Header button

#### Scenario: Consistent behavior across all locations

**Given** the install button is displayed in both Header and Hero section
**When** I interact with either button
**Then** both buttons MUST provide identical functionality:
  - Automatic OS detection
  - Direct download links (no page navigation)
  - Dropdown menu for version selection
  - Same platform-specific download targets
**And** both MUST use the same underlying component with only visual size differences

#### Scenario: Automatic operating system detection

**Given** the page with install button is loaded
**When** the InstallButton component initializes
**Then** it MUST automatically detect my operating system from the UserAgent string
**And** the main button MUST link to the recommended download for my detected platform:
  - Windows: Setup installer (.exe)
  - macOS: Apple Silicon (.dmg) for ARM, Intel (.dmg) for x64
  - Linux: AppImage package
**And** this MUST work consistently in both Header and Hero locations

#### Scenario: Query string platform override

**Given** I want to test the install button for a specific platform
**When** I visit any page with `?os=windows` or `?os=macos` or `?os=linux`
**Then** the InstallButton MUST override automatic detection
**And** the button MUST link to the specified platform's download
**And** this MUST affect both Header and Hero buttons
**And** this override MUST only affect the button detection, not the actual file download

#### Scenario: Dropdown menu for multiple versions

**Given** my platform has multiple installation packages available
**When** I click the dropdown toggle on the install button
**Then** a dropdown menu MUST appear showing all available versions for my platform
**And** each item MUST display the version label and file size
**And** clicking an item MUST update the main button's download link
**And** the last item in the menu MUST be "安装 Docker 版本" with a separator above it

#### Scenario: Keyboard navigation support

**Given** the install button is focused
**When** I press Tab key
**Then** focus MUST move to the dropdown toggle (if available)
**And** pressing Enter or Space MUST toggle the dropdown menu
**And** arrow keys MUST navigate between menu items
**And** Esc key MUST close the dropdown menu

#### Scenario: Fallback when version data is unavailable

**Given** the Desktop version data fails to load
**When** the InstallButton component renders
**Then** it MUST display a fallback button
**And** the fallback button MUST link to the Desktop download page (/desktop)
**And** the button MUST still display the "立即安装" label

#### Scenario: Theme consistency

**Given** the site theme is changed
**When** I view the install button
**Then** the button MUST adapt to the current theme:
  - Light theme: blue-cyan-green gradient
  - Dark theme: enhanced neon colors with stronger contrast
  - Lunar New Year theme: red-gold gradient
**And** text contrast MUST meet WCAG AA standards

#### Scenario: Responsive design

**Given** I view the site on different devices
**When** I view the install button in Header or Hero section
**Then** the button MUST be appropriately sized:
  - Desktop (> 1024px): full button with dropdown for Hero, compact for Header
  - Tablet (768px - 1024px): same as desktop
  - Mobile (< 768px): compact layout, touch-friendly targets (min 44x44px)
**And** the dropdown menu MUST not overflow the viewport on mobile devices

#### Scenario: Header button variant sizing

**Given** I am viewing the Header navigation bar
**When** I see the install button
**Then** the button MUST use a compact size variant
**And** the button MUST fit within the Header layout without overflow
**And** the button MUST remain easily clickable (min 36x36px touch target)
**And** the dropdown menu MUST be positioned to avoid covering other navigation elements

#### Scenario: Accessibility attributes

**Given** I use a screen reader
**When** I encounter the install button in either Header or Hero
**Then** it MUST have proper ARIA attributes:
  - `aria-label` describing the button action
  - `aria-expanded` on the dropdown toggle
  - `aria-haspopup="listbox"` when dropdown is available
  - `role="option"` for dropdown menu items
  - `role="separator"` for the Docker option separator

#### Scenario: Docker version menu item

**Given** the install button dropdown menu is open
**When** I view the menu items
**Then** the last item MUST be labeled "安装 Docker 版本"
**And** a separator MUST appear above this item
**And** the item MUST have a distinct visual style (different icon or color)
**And** hovering over the item MUST show a navigation indicator

#### Scenario: Navigate to Docker installation page

**Given** the install button dropdown menu is open
**When** I click the "安装 Docker 版本" menu item
**Then** the browser MUST navigate to `/installation/docker-compose`
**And** the dropdown menu MUST close
**And** the Desktop download MUST NOT be triggered

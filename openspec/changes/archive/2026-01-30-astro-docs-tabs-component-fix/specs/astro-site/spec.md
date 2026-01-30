# astro-site Spec Delta

## MODIFIED Requirements

### Requirement: Cross-Platform Content Organization

Documentation pages that include platform-specific instructions for Windows, macOS, and Linux MUST use clear organization to separate content by platform. Platform-specific content MUST be presented using tabbed interfaces that allow users to switch between platforms, implemented using native HTML structures with data attributes for client-side JavaScript initialization.

#### Scenario: Platform-specific instructions with native HTML tabs

**Given** a documentation page includes instructions for Windows, macOS, and Linux
**When** the page is rendered
**Then** each platform's instructions MUST be separated into tabbed panels
**And** the page MUST render tab buttons for Windows, macOS, and Linux
**And** only the default platform's content MUST be visible initially
**And** users MUST be able to click tab buttons to switch between platforms
**And** the tabbed interface MUST use the following HTML structure:
```html
<div class="tabs-component" data-default-value="{default-platform}">
  <div>
    <div data-value="{platform-id}" data-label="{Platform Name}"></div>
    <!-- Additional tab headers -->
  </div>
  <div>
    <div data-value="{platform-id}">
      <!-- Platform-specific content -->
    </div>
    <!-- Additional tab panels -->
  </div>
</div>
```
**And** the structure MUST include `data-default-value` attribute on the container
**And** each tab header MUST have `data-value` and `data-label` attributes
**And** the content panels MUST be direct children of the second `<div>` container
**And** the initialization script MUST automatically transform this structure into an interactive tabbed interface

#### Scenario: Tab initialization and state management

**Given** a documentation page contains one or more `.tabs-component` elements
**When** the page loads in the browser
**Then** the initialization script MUST find all `.tabs-component` elements
**And** the script MUST read the `data-default-value` attribute to determine the active tab
**And** the script MUST create button elements for each tab header
**And** the script MUST assign appropriate ARIA attributes (role, aria-selected, aria-controls, aria-labelledby)
**And** the script MUST hide all tab panels except the default one
**And** the script MUST bind click event listeners to tab buttons
**And** the script MUST bind keyboard event listeners for navigation (ArrowLeft, ArrowRight, Home, End)

#### Scenario: Tab switching with keyboard navigation

**Given** a user is viewing a page with tabbed platform-specific content
**When** they use keyboard navigation (Tab, ArrowLeft, ArrowRight, Home, End, Enter, Space)
**Then** tab buttons MUST be focusable with the Tab key
**And** pressing ArrowLeft MUST focus and activate the previous tab (wrapping to the last tab)
**And** pressing ArrowRight MUST focus and activate the next tab (wrapping to the first tab)
**And** pressing Home MUST focus and activate the first tab
**And** pressing End MUST focus and activate the last tab
**And** pressing Enter or Space on a focused tab MUST activate that tab
**And** the activated tab MUST display its corresponding content panel
**And** all other content panels MUST be hidden with the `hidden` attribute

#### Scenario: Tab visual feedback and theming

**Given** a user is viewing a page with tabbed content
**When** they view the tabbed interface
**Then** the active tab button MUST have a distinct visual style (primary color, bottom border)
**And** inactive tab buttons MUST have a neutral style
**When** they hover over an inactive tab button
**Then** the button MUST show a hover state (background color change)
**When** they click a tab button
**Then** the content panel MUST appear with a fade-in animation (0.2s ease-in-out)
**And** the animation MUST be disabled for users who prefer reduced motion
**When** they switch between light and dark themes
**Then** the tabbed interface MUST adapt its colors to match the current theme
**And** all color values MUST use CSS custom properties for theme consistency

#### Scenario: Responsive tabbed interface on mobile devices

**Given** a user is viewing a page with tabbed content on a mobile device (width < 768px)
**When** the tabbed interface has more tabs than can fit on screen
**Then** the tab buttons MUST be horizontally scrollable (overflow-x: auto)
**And** the scrollbar MUST be styled to be unobtrusive (4px height)
**And** the tab buttons MUST have reduced padding (0.625rem 1rem) and font size (0.875rem)
**And** the minimum touch target size MUST be at least 44px height
**And** the content panels MUST have appropriate padding for mobile (1rem)
**And** the entire tabbed interface MUST maintain usability with touch interactions

#### Scenario: Accessibility and screen reader support

**Given** a user is using a screen reader to navigate a page with tabbed content
**When** they encounter the tabbed interface
**Then** the tab buttons MUST be announced as "tabs" (role="tab")
**And** the active tab MUST be announced as "selected" (aria-selected="true")
**And** inactive tabs MUST be announced as "not selected" (aria-selected="false")
**And** each tab button MUST have an accessible name matching its label
**And** each tab panel MUST be properly labeled by its corresponding tab button (aria-labelledby)
**And** the tab panel MUST be announced when activated
**And** keyboard focus MUST be visible and clearly indicated

#### Scenario: MDX support for tabbed content

**Given** a content author wants to add tabbed platform-specific instructions in an MDX file
**When** they write the MDX content
**Then** they MUST NOT import React or Astro components for tabs (unreliable in MDX)
**And** they MUST use the native HTML structure with data attributes
**And** they MUST ensure all `data-value` attributes are unique within a tab group
**And** they MUST ensure the `data-default-value` matches one of the tab values
**And** the file extension MAY remain `.md` as Astro supports MDX syntax
**And** the HTML structure MUST be valid and properly nested
**Example MDX content:**
````mdx
---
title: Installation Guide
---

## Cross-Platform Installation

<div class="tabs-component" data-default-value="win">
  <div>
    <div data-value="win" data-label="Windows"></div>
    <div data-value="mac" data-label="macOS"></div>
    <div data-value="linux" data-label="Linux"></div>
  </div>
  <div>
    <div data-value="win">
      ### Windows Installation

      Run in PowerShell:
      ```powershell
      npm install -g package
      ```
    </div>
    <div data-value="mac">
      ### macOS Installation

      Run in Terminal:
      ```bash
      npm install -g package
      ```
    </div>
    <div data-value="linux">
      ### Linux Installation

      Run in Terminal:
      ```bash
      npm install -g package
      ```
    </div>
  </div>
</div>
````

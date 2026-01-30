# astro-site Spec Delta: Tabs Component Support

## MODIFIED Requirements

### Requirement: Cross-Platform Content Organization

Documentation pages that include platform-specific instructions for Windows, macOS, and Linux MUST use clear organization to separate content by platform, supported through native Astro Tabs components for interactive platform switching.

#### Scenario: Platform-specific instructions with Tabs component

**Given** a documentation page includes instructions for Windows, macOS, and Linux
**When** the page is rendered with the Tabs component
**Then** each platform's instructions MUST be separated into interactive tabs
**And** users MUST be able to click tab headers to switch between platforms
**And** only the active platform's content MUST be visible
**And** the component MUST render correctly in both light and dark themes

#### Scenario: Tabs component API usage

**Given** an MDX documentation file needs platform-specific content
**When** I use the Tabs component with the following syntax:

```jsx
import Tabs from '@/components/Tabs';
import TabItem from '@/components/TabItem';

<Tabs groupId="platform" defaultValue="win">
  <TabItem value="win" label="Windows">
    Windows-specific content
  </TabItem>
  <TabItem value="mac" label="macOS">
    macOS-specific content
  </TabItem>
  <TabItem value="linux" label="Linux">
    Linux-specific content
  </TabItem>
</Tabs>
```

**Then** the component MUST render tab headers for each platform
**And** the default tab MUST match the `defaultValue` prop
**And** clicking a tab header MUST switch the visible content
**And** the component MUST maintain accessibility attributes

#### Scenario: MDX support

**Given** a content file uses MDX format (`.md` extension)
**When** the file is processed by Astro
**Then** the file MUST render correctly with embedded Tabs and TabItem components
**And** Tabs components MUST support interactive client-side switching
**And** the components MUST hydrate correctly with `client:load` or `client:visible` directives

#### Scenario: Tabs component accessibility

**Given** a Tabs component is rendered on the page
**When** I navigate using the keyboard
**Then** tab headers MUST be focusable with the Tab key
**And** arrow keys MUST switch between tabs
**And** Enter/Space keys MUST activate the focused tab
**And** the component MUST include proper ARIA attributes (`role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`)
**And** screen readers MUST announce tab labels and content changes

#### Scenario: Tabs component theming

**Given** a Tabs component is displayed
**When** the user switches between light and dark themes
**Then** the component colors MUST adapt to the current theme
**And** the active tab MUST use the theme's primary color
**And** text contrast MUST meet WCAG AA standards in both themes

#### Scenario: Tabs component responsive design

**Given** a Tabs component is rendered on a mobile device (width < 768px)
**When** the component is displayed
**Then** tab headers MUST be large enough for touch interaction (minimum 44x44px)
**And** tabs MUST scroll horizontally if they overflow the screen width
**And** the component MUST remain fully functional on touch devices

#### Scenario: Tabs component fallback behavior

**Given** a browser with JavaScript disabled
**When** a page containing the Tabs component is loaded
**Then** ALL tab content MAY be displayed sequentially as a fallback
**Or** the component MAY provide a message indicating JavaScript is required
**And** essential content MUST remain accessible even without JavaScript

## Rationale

The MODIFIED requirement enhances the existing "Cross-Platform Content Organization" by explicitly specifying the Tabs component as the solution for interactive platform switching in documentation. This change:

1. **Restores Functionality**: Re-establishes the tabbed interface that was lost during the Docusaurus to Astro migration
2. **Improves UX**: Provides users with an easy way to view only the content relevant to their platform
3. **Maintains Accessibility**: Ensures keyboard navigation and screen reader support
4. **Theme Consistency**: Integrates with the existing light/dark theme system
5. **Performance**: Leverages Astro's client directives for optimal hydration

## Dependencies

- Requires `@astrojs/mdx` integration for component support in markdown
- Requires `src/components/Tabs.astro` and `src/components/TabItem.astro` to exist
- Requires client-side hydration via Astro's `client:load` or `client:visible` directives

## Migration Notes

When migrating from Docusaurus-style tabs:
- Replace `import Tabs from '@theme/Tabs'` with `import Tabs from '@/components/Tabs'`
- Replace `import TabItem from '@theme/TabItem'` with `import TabItem from '@/components/TabItem'`
- All existing props and child elements remain compatible
- No changes to tab content or structure are required

## MODIFIED Requirements

### Requirement: Mermaid Diagram Support

The site MUST support rendering Mermaid diagrams in both markdown and MDX content with automatic theme adaptation and responsive design.

#### Scenario: Mermaid diagram rendering in markdown files

- **GIVEN** a markdown file (`.md`) contains a Mermaid diagram in a code block
- **WHEN** the page is rendered
- **THEN** the Mermaid diagram MUST be rendered as an SVG
- **AND** the diagram MUST be interactive (pan/zoom if supported)
- **AND** the diagram colors MUST adapt to the current theme (light or dark)

#### Scenario: Mermaid diagram rendering in MDX files

- **GIVEN** an MDX file (`.mdx`) contains a Mermaid diagram in a code block
- **WHEN** the page is rendered and client-side hydration is complete
- **THEN** the Mermaid diagram MUST be rendered as an SVG
- **AND** the diagram MUST integrate correctly with other MDX components (Tabs, Cards, etc.)
- **AND** the rendering MUST occur after MDX hydration to ensure proper DOM structure

#### Scenario: Mermaid diagram theming

- **GIVEN** a Mermaid diagram is displayed
- **WHEN** the user switches between light and dark themes
- **THEN** the diagram MUST re-render with appropriate colors for the current theme
- **AND** the re-rendering MUST happen automatically without page refresh
- **AND** the diagram colors MUST match the site's design system

#### Scenario: Mermaid diagram responsive design

- **GIVEN** a Mermaid diagram is displayed
- **WHEN** viewed on different screen sizes (mobile, tablet, desktop)
- **THEN** the diagram MUST scale appropriately using `max-width: 100%`
- **AND** the diagram MUST maintain aspect ratio
- **AND** horizontal scrolling MUST be available for complex diagrams on small screens
- **AND** the diagram MUST NOT overflow its container

#### Scenario: Mermaid diagram error handling

- **GIVEN** a Mermaid code block contains syntax errors or unsupported diagram types
- **WHEN** the page attempts to render the diagram
- **THEN** a user-friendly error message MUST be displayed
- **AND** the error message MUST be in Chinese
- **AND** the error message MUST include a brief explanation of the problem
- **AND** technical error details MUST be available in a collapsible section
- **AND** the page MUST continue to function normally
- **AND** other diagrams on the page MUST still render correctly

#### Scenario: Mermaid diagram lazy loading

- **GIVEN** a page contains multiple Mermaid diagrams
- **WHEN** the page initially loads
- **THEN** the Mermaid library MUST only be loaded if Mermaid diagrams are present
- **AND** the diagrams MUST render progressively (either using `requestIdleCallback` or `IntersectionObserver`)
- **AND** the initial page load MUST NOT be blocked by diagram rendering
- **AND** the page performance score (Lighthouse) MUST remain above 90

#### Scenario: Mermaid diagram performance optimization

- **GIVEN** a page contains Mermaid diagrams
- **WHEN** measuring rendering performance
- **THEN** each simple diagram (< 10 nodes) MUST render in under 100ms
- **AND** the Mermaid library bundle size MUST be approximately 500KB (minified)
- **AND** the total JavaScript bundle size impact MUST be minimal due to code splitting
- **AND** the rendering MUST NOT cause layout shifts or visible flicker

#### Scenario: Mermaid diagram complexity limits

- **GIVEN** a documentation author creates a Mermaid diagram
- **WHEN** the diagram exceeds recommended complexity (> 20 nodes)
- **THEN** the diagram MUST still render but MAY show a warning in the browser console
- **AND** the documentation SHOULD recommend using static images for highly complex visualizations
- **AND** the best practices guide MUST explain the complexity recommendations

#### Scenario: Supported diagram types

- **GIVEN** a documentation author wants to create different types of technical diagrams
- **WHEN** they use Mermaid syntax
- **THEN** the following diagram types MUST be supported:
  - Flowcharts (graph TD/LR)
  - Sequence diagrams (sequenceDiagram)
  - State diagrams (stateDiagram-v2)
  - Class diagrams (classDiagram)
  - Entity Relationship diagrams (erDiagram)
- **AND** example documentation MUST be provided for each type
- **AND** the examples MUST use realistic project-related scenarios

#### Scenario: Mermaid diagram accessibility

- **GIVEN** a Mermaid diagram is displayed
- **WHEN** accessed by users with disabilities
- **THEN** the diagram MUST include a `role="img"` attribute
- **AND** complex diagrams SHOULD include an `aria-label` or `aria-describedby` with a text description
- **AND** the diagram MUST be keyboard navigable (if Mermaid supports it)
- **AND** the diagram MUST maintain sufficient color contrast in both themes (WCAG AA: 4.5:1 for normal text, 3:1 for large text)

#### Scenario: Mermaid diagram version compatibility

- **GIVEN** the project uses Mermaid v11.12.2
- **WHEN** Mermaid syntax changes in future versions
- **THEN** the existing diagrams MUST continue to render correctly
- **AND** the project documentation MUST specify the supported Mermaid version
- **AND** upgrades to Mermaid MUST be tested against all existing diagrams before deployment

#### Scenario: Mermaid integration with Starlight

- **GIVEN** the site uses Starlight as the documentation framework
- **WHEN** Mermaid code blocks are present in Starlight pages
- **THEN** the rendering script MUST integrate via `StarlightWrapper.astro`
- **AND** the script MUST use Starlight's theme detection mechanism (`data-theme` attribute)
- **AND** the diagram styling MUST be consistent with Starlight's design system
- **AND** the integration MUST not interfere with Starlight's built-in features

#### Scenario: Mermaid diagram examples and documentation

- **GIVEN** a documentation author wants to use Mermaid diagrams
- **WHEN** they consult the project documentation
- **THEN** an example page MUST exist at `/docs/examples/mermaid-diagrams`
- **AND** the example page MUST demonstrate all supported diagram types
- **AND** a best practices guide MUST be available (either separate or part of project.md)
- **AND** the guide MUST cover complexity limits, theming, and accessibility

#### Scenario: Mermaid diagram in MDX with other components

- **GIVEN** an MDX file contains both Mermaid diagrams and other MDX components
- **WHEN** the page is rendered
- **THEN** Mermaid diagrams MUST work correctly inside Tabs components
- **AND** Mermaid diagrams MUST work correctly inside Cards or other containers
- **AND** the rendering order MUST respect the component hierarchy
- **AND** there MUST NOT be conflicts between Mermaid scripts and other MDX component scripts

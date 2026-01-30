## RENAMED Requirements

- FROM: `specs/docusaurus-site`
- TO: `specs/astro-site`

## ADDED Requirements

### Requirement: Astro Core Configuration

The repository MUST have a valid Astro configuration that enables site initialization and development.

#### Scenario: Initialize Astro configuration

**Given** a `astro.config.mjs` file exists with valid configuration
**When** the developer runs `npm install` followed by `npm run dev`
**Then** the Astro development server starts successfully on `http://localhost:4321`
**And** no configuration errors are displayed in the console

#### Scenario: Validate configuration schema

**Given** a `astro.config.mjs` file exists
**When** the TypeScript compiler validates the file
**Then** no type errors are reported
**And** the configuration conforms to Astro 4.x schema

---

### Requirement: Static Site Generation

The system MUST generate a static HTML output without JavaScript by default for all documentation and blog pages.

#### Scenario: Zero JS by default

**Given** the site is built with `npm run build`
**When** examining the generated HTML files in the `dist/` directory
**Then** the main content is visible in plain HTML
**And** no JavaScript files are automatically included for rendering content

#### Scenario: Static build output

**Given** the site is built successfully
**When** the `dist/` directory is examined
**Then** all pages are generated as individual HTML files
**And** assets are properly optimized and fingerprinted
**And** the build directory contains a valid `_astro/` folder with optimized resources

---

### Requirement: Content Collections

The system MUST use Astro Content Collections to manage and query documentation and blog content.

#### Scenario: Collections configuration

**Given** a `src/content/config.ts` file exists with collection definitions
**When** the site is built
**Then** all documents in `src/content/docs/` are processed
**And** all posts in `src/content/blog/` are processed
**And** frontmatter validation errors are reported at build time

#### Scenario: Content querying

**Given** content collections are properly configured
**When** a developer queries the docs collection
**Then** all valid documentation files are returned
**And** frontmatter is type-safe

---

### Requirement: MDX Support

The system MUST support MDX files with JavaScript/TypeScript expressions and React components.

#### Scenario: MDX file rendering

**Given** an MDX file exists in the content collections
**When** the file is rendered
**Then** the markdown content is properly formatted
**And** embedded JSX components are rendered correctly
**And** frontmatter properties are available to the page

#### Scenario: Code syntax highlighting

**Given** an MDX file contains code blocks with language identifiers
**When** the file is rendered
**Then** code blocks are highlighted with appropriate syntax colors
**And** supported languages include: bash, csharp, fsharp, powershell

---

### Requirement: React Integration

The system MUST support importing and using React components within Astro files and MDX files.

#### Scenario: React component in Astro file

**Given** a React component exists in `src/components/`
**When** the component is imported and used in an Astro file
**Then** the component is rendered to static HTML
**And** the component can be hydrated with client directives (`client:load`, `client:visible`, etc.)

#### Scenario: React component in MDX

**Given** a React component exists in `src/components/`
**When** the component is imported and used in an MDX file
**Then** the component is rendered to static HTML
**And** interactive functionality works with hydration

---

### Requirement: Dark Theme Support

The system MUST support a dark theme that is toggleable and persistent.

#### Scenario: Default light theme

**Given** a user visits the site for the first time
**When** the page loads
**Then** the light theme is displayed by default

#### Scenario: Dark theme toggle

**Given** a user is on the site
**When** the user toggles the dark theme switch
**Then** all UI elements update to dark theme colors
**And** the theme preference is stored in localStorage

#### Scenario: Theme persistence

**Given** a user has previously selected dark theme
**When** the user revisits the site
**Then** the dark theme is applied automatically

---

### Requirement: Responsive Design

The system MUST provide a responsive layout that works on desktop, tablet, and mobile devices.

#### Scenario: Desktop layout

**Given** the viewport width is greater than 996px
**When** the page loads
**Then** the full sidebar navigation is visible
**And** the content area is properly spaced

#### Scenario: Mobile navigation

**Given** the viewport width is less than 996px
**When** the page loads
**Then** the sidebar is collapsed into a hamburger menu
**And** the hamburger menu can be toggled to show navigation

---

### Requirement: Mermaid Diagrams

The system MUST support rendering Mermaid diagrams from markdown code blocks.

#### Scenario: Mermaid diagram rendering

**Given** an MDX file contains a Mermaid diagram code block
**When** the file is rendered
**Then** the diagram is rendered as an SVG or canvas element
**And** the diagram theme matches the current site theme (light/dark)

---

### Requirement: Microsoft Clarity Integration

The system MUST integrate with Microsoft Clarity analytics.

#### Scenario: Clarity tracking enabled

**Given** the `CLARITY_PROJECT_ID` environment variable is set
**When** a page loads
**Then** the Clarity tracking script is included in the HTML
**And** the script uses the provided project ID

#### Scenario: Clarity tracking disabled

**Given** the `CLARITY_PROJECT_ID` environment variable is not set
**When** a page loads
**Then** no Clarity tracking script is included

---

### Requirement: GitHub Pages Deployment

The system MUST be deployable to GitHub Pages using GitHub Actions.

#### Scenario: Automatic deployment on push

**Given** changes are pushed to the main branch
**When** the GitHub Actions workflow runs
**Then** dependencies are installed
**And** the site is built
**And** the build output is deployed to GitHub Pages

#### Scenario: Environment variable support

**Given** the workflow has the `CLARITY_PROJECT_ID` secret configured
**When** the site is built
**Then** the Clarity tracking script includes the correct project ID

---

## REMOVED Requirements

### Requirement: Docusaurus Core Configuration

**Reason**: Replaced by Astro Core Configuration
**Migration**:
1. Remove `docusaurus.config.ts` file
2. Remove all `@docusaurus/*` dependencies from package.json
3. Replace with astro.config.mjs and Astro dependencies

### Requirement: Docusaurus Sidebar Configuration

**Reason**: Replaced by Astro Content Collections and dynamic routing
**Migration**:
1. Remove `sidebars.ts` file
2. Configure Astro Content Collections in src/content/config.ts
3. Implement dynamic routing with [...slug].astro files

### Requirement: Docusaurus Preset Configuration

**Reason**: Docusaurus presets are specific to the framework
**Migration**:
1. Remove @docusaurus/preset-classic from dependencies
2. Replace with individual Astro integrations (@astrojs/react, @astrojs/mdx, etc.)

### Requirement: Docusaurus Theme Configuration

**Reason**: Docusaurus themes are specific to the framework
**Migration**:
1. Remove @docusaurus/theme-classic and @docusaurus/theme-mermaid
2. Implement custom Astro layouts and components
3. Use @astrojs/mermaid integration

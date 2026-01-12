# docusaurus-site Specification

## Purpose
TBD - created by archiving change docusaurus-site-initialization. Update Purpose after archive.
## Requirements
### Requirement: Docusaurus Core Configuration

The repository MUST have a valid Docusaurus configuration that enables site initialization and development.

#### Scenario: Initialize Docusaurus configuration

**Given** an empty repository
**When** the developer runs `npm install` followed by `npm start`
**Then** the Docusaurus development server starts successfully on `http://localhost:3000`
**And** no configuration errors are displayed in the console

#### Scenario: Validate configuration schema

**Given** a `docusaurus.config.ts` file exists
**When** the TypeScript compiler validates the file
**Then** no type errors are reported
**And** the configuration conforms to Docusaurus 3.x schema

---

### Requirement: Documentation Structure

The repository MUST have an organized documentation directory structure with Chinese content as the primary and only language in the `docs/` directory.

#### Scenario: Chinese documentation in default location

**Given** the documentation structure exists
**When** a developer accesses the `docs/` directory
**Then** all documentation files contain Chinese content
**And** the `docs/quick-start/` directory contains Chinese installation, project creation, and session guides
**And** all `_category_.json` files contain Chinese labels

#### Scenario: No i18n directory exists

**Given** the repository is configured for single-language Chinese support
**When** listing directory contents at the repository root
**Then** no `i18n/` directory exists
**And** all content is served from the `docs/` directory

---

### Requirement: Category Configuration

Documentation categories MUST be configured using `_category_.json` files that define metadata and organization.

#### Scenario: Category metadata display

**Given** a `_category_.json` file exists in a documentation directory
**When** the Docusaurus site builds
**Then** the category displays with the configured label
**And** the category position follows the configured order
**And** the category is collapsible if configured as such

#### Scenario: Valid category schema

**Given** any `_category_.json` file in the docs structure
**When** the file is parsed
**Then** the file must contain at least a `label` property
**And** optional properties (`position`, `collapsible`) must be valid boolean or number types

---

### Requirement: Static Assets Management

The site MUST support static assets (images, logos, favicons) through a dedicated `static/` directory.

#### Scenario: Serve static image

**Given** an image file is placed in `static/img/`
**When** a markdown document references the image as `/img/filename.png`
**Then** the image loads correctly in the browser
**And** the image is accessible at the expected URL

#### Scenario: Custom favicon

**Given** a `favicon.ico` file exists in the `static/` directory
**When** the Docusaurus site loads
**Then** the browser displays the custom favicon in the tab
**And** no 404 errors occur for the favicon

---

### Requirement: Blog Infrastructure

The site MUST include blog directory structure and configuration to support future blog posts.

#### Scenario: Create blog post

**Given** the blog directory structure exists
**When** a developer creates a new markdown file in `blog/` with proper frontmatter
**Then** the post appears in the blog listing page
**And** the post displays the author, date, and excerpt correctly

#### Scenario: Blog page accessibility

**Given** the Docusaurus site is running
**When** a user navigates to `/blog`
**Then** the blog page loads successfully
**And** any example blog posts are displayed

---

### Requirement: Navigation Configuration

The site MUST have simplified navigation elements that reflect the single Quick Start category.

#### Scenario: Navbar displays configured items

**Given** the Docusaurus site is running
**When** a user views the top navigation bar
**Then** the navbar displays at minimum: Docs dropdown, Blog link
**And** all links navigate to their configured destinations

#### Scenario: Sidebar displays only Quick Start

**Given** a user is viewing documentation
**When** the sidebar is visible
**Then** only the Quick Start category and its documents are listed
**And** the current document is highlighted in the sidebar
**And** the category can be expanded and collapsed

---

### Requirement: Internationalization Structure

The site MUST be configured for single-language (Chinese) support, with Simplified Chinese (`zh-CN`) as the default and only locale.

#### Scenario: Single locale configured

**Given** the `docusaurus.config.ts` file
**When** examining the i18n configuration
**Then** the default locale is configured as `zh-CN`
**And** the locales array contains only `zh-CN`
**And** the configuration does not include English or any other locales

#### Scenario: No language switcher displayed

**Given** the Docusaurus site is running
**When** a user views the top navigation bar
**Then** no language switcher dropdown is displayed
**And** all navigation items are in Chinese
**And** the site displays Chinese content by default

#### Scenario: Chinese content at root URLs

**Given** the site is configured with `zh-CN` as the default locale
**When** a user navigates to documentation pages
**Then** the URLs do not include a locale prefix (e.g., `/docs/quick-start/installation` not `/zh-CN/docs/quick-start/installation`)
**And** the content is displayed in Chinese

---

### Requirement: Custom Styling Infrastructure

The site MUST include custom CSS infrastructure to enable theme customization.

#### Scenario: Custom CSS loads

**Given** a `src/css/custom.css` file exists
**When** the Docusaurus site builds
**Then** the custom CSS is included in the built site
**And** CSS variables defined in the file are available for use

#### Scenario: Override default theme

**Given** the custom CSS file
**When** CSS variables are set for theme colors
**Then** the site uses the configured colors instead of defaults
**And** the changes apply consistently across all pages

---

### Requirement: Development Scripts

The package.json MUST include npm scripts for common development workflows.

#### Scenario: Start development server

**Given** dependencies are installed
**When** a developer runs `npm start`
**Then** the development server starts
**And** hot-reload is enabled for file changes
**And** the server is accessible at localhost:3000

#### Scenario: Build for production

**Given** the complete site structure
**When** a developer runs `npm run build`
**Then** a production build is created in the `build/` directory
**And** no build errors occur
**And** the build includes all necessary assets

#### Scenario: Serve production build

**Given** a production build exists
**When** a developer runs `npm run serve`
**Then** the production build is served locally
**And** the site functions identically to the production deployment

---

### Requirement: TypeScript Configuration

The repository MUST have TypeScript configuration for type safety in Docusaurus config and custom components.

#### Scenario: TypeScript compilation

**Given** the `tsconfig.json` file exists
**When** `npx tsc --noEmit` is run
**Then** no type errors are reported for the configuration file
**And** type definitions are available for Docusaurus APIs

#### Scenario: Type-safe configuration

**Given** the `docusaurus.config.ts` file
**When** editing configuration properties
**Then** IDE autocomplete suggests valid Docusaurus configuration options
**And** type errors are displayed for invalid properties

---

### Requirement: Contributor Documentation

The repository MUST include clear documentation for contributors on how to use and extend the documentation site.

#### Scenario: Setup instructions work

**Given** a new contributor clones the repository
**When** they follow the instructions in README.md
**Then** they can successfully start the development server
**And** no steps are missing or incorrect

#### Scenario: Contribution guidelines clear

**Given** the contributing documentation
**When** a developer wants to add a new document
**Then** the documentation explains:
  - Where to place the file
  - Required frontmatter
  - How to configure categories
  - How to test the change

### Requirement: Quick Start Documentation Series

The documentation site MUST include a "Quick Start" category as the first item in the sidebar navigation, providing new users with accessible getting-started content.

#### Scenario: Quick Start category appears first in sidebar

**Given** the Docusaurus site is running
**When** a user views the documentation sidebar
**Then** the "Quick Start" category is displayed as the first item (position: 1)
**And** the category can be expanded to show quick-start documents

#### Scenario: Quick Start category metadata configured

**Given** the `docs/quick-start/_category_.json` file exists
**When** the file is parsed by Docusaurus
**Then** the category displays with the label "Quick Start"
**And** the category is positioned first in the sidebar
**And** a generated-index page is created for the category

#### Scenario: Quick Start Chinese category metadata configured

**Given** the Chinese `i18n/zh-CN/docusaurus-plugin-content-docs/current/quick-start/_category_.json` file exists
**When** the Chinese version of the site is displayed
**Then** the category displays with the label "快速入门"
**And** the category position matches the English version

---

### Requirement: Bilingual Quick Start Content

All Quick Start documentation MUST be available in both English and Chinese, with content parity between languages.

#### Scenario: English and Chinese installation guides match

**Given** both English and Chinese installation guides exist
**When** comparing the content structure
**Then** both documents contain the same sections in the same order
**And** all content in the English version is translated in the Chinese version
**And** code blocks and commands remain in English in both versions

#### Scenario: Code blocks use appropriate language tags

**Given** the installation guide contains command examples
**When** viewing the rendered documentation
**Then** bash commands use the `bash` language tag
**And** PowerShell commands use the `powershell` language tag
**And** configuration files use the `yaml` language tag
**And** syntax highlighting is applied correctly

---

### Requirement: Sidebar Navigation for Quick Start

The sidebar configuration MUST include the Quick Start category positioned first in the navigation hierarchy.

#### Scenario: Quick Start positioned before Installation category

**Given** the `sidebars.ts` file is configured
**When** the sidebar renders in the browser
**Then** the Quick Start category appears before the Installation category
**And** all other categories are shifted down by one position

#### Scenario: Quick Start uses generated-index

**Given** the Quick Start category is configured in `sidebars.ts`
**When** a user clicks on the Quick Start category link
**Then** a generated index page is displayed at `/quick-start`
**And** the page shows the title "Quick Start"
**And** the page shows a description of the category contents

### Requirement: Quick Start Project Creation Documentation

The Quick Start documentation series MUST include a comprehensive guide for creating and configuring the first project in PCode.

#### Scenario: Access project creation guide

**Given** the Quick Start category exists in the documentation
**When** a user navigates to the Quick Start section
**Then** a document titled "Create Your First Project" is available
**And** the document appears after the Installation guide in the sidebar order
**And** both English and Chinese versions are accessible

#### Scenario: Document covers complete workflow

**Given** the "Create Your First Project" document exists
**When** a user reads the document content
**Then** the document includes:
  - Step 1: Project preparation (Git repository requirements)
  - Step 2: Adding project in PCode interface (display name, repository URL)
  - Step 3: OpenSpec initialization (SDD Tab, initialization button)
  - Step 4: Optimizing project.md (when applicable, optimization button)
  - Step 5: Regular maintenance guidelines
**And** each step includes clear instructions and expected outcomes

#### Scenario: Chinese translation completeness

**Given** the English version of "Create Your First Project" exists
**When** the Chinese version is accessed at `i18n/zh-CN/docusaurus-plugin-content-docs/current/quick-start/create-first-project.md`
**Then** all English content is translated to Chinese
**And** technical terms are appropriately translated or kept in English where standard
**And** the document structure matches the English version
**And** proper Chinese frontmatter is included (title, description)

#### Scenario: Document follows markdown conventions

**Given** the `create-first-project.md` file exists
**When** the file is validated
**Then** the file uses kebab-case naming
**And** frontmatter includes `title` and `description` properties
**And** code blocks use appropriate syntax highlighting (bash, yaml, etc.)
**And** internal links use proper Docusaurus path format

#### Scenario: Integration with existing Quick Start

**Given** the Quick Start series already contains an installation guide
**When** the project creation guide is added
**Then** the document appears in the same Quick Start category
**And** no changes to `sidebars.ts` are required (autogenerated directory)
**And** the document is automatically included in navigation
**And** a reference to the next step (project creation) exists in installation guide if applicable

---

### Requirement: Quick Start Conversation Session Documentation

The documentation site SHALL provide a comprehensive guide for creating and using conversation sessions in PCode, as the third document in the Quick Start series.

#### Scenario: User creates their first conversation session

- **GIVEN** the user has completed PCode installation
- **AND** the user has created their first project
- **WHEN** the user navigates to the Quick Start - Creating a Conversation Session guide
- **THEN** the guide shall explain how to locate the session list
- **AND** the guide shall explain how to click "Add Chat" button
- **AND** the guide shall show that a new conversation window appears
- **AND** the user shall be able to successfully create a conversation session

#### Scenario: User understands read-only vs. edit mode

- **GIVEN** the user is reading the conversation session guide
- **WHEN** the user reaches the "Understanding Modes" section
- **THEN** the guide shall explain read-only mode is the default
- **AND** the guide shall list what AI can do in read-only mode (read files, analyze, describe)
- **AND** the guide shall list what AI cannot do in read-only mode (modify files)
- **AND** the guide shall explain how to switch to edit mode
- **AND** the guide shall explain when to use edit mode

#### Scenario: User learns about session types

- **GIVEN** the user is reading the conversation session guide
- **WHEN** the user reaches the "Session Types" section
- **THEN** the guide shall describe conversation sessions (chat-like interaction)
- **AND** the guide shall briefly mention idea sessions (idea-to-execution workflow)
- **AND** the guide shall clarify that this document covers conversation sessions
- **AND** the guide shall indicate that idea sessions are covered in the next document

#### Scenario: User finds appropriate use cases

- **GIVEN** the user has created a conversation session
- **WHEN** the user reads the "Typical Use Cases" section
- **THEN** the guide shall provide examples for analysis and understanding (project summary, code explanation)
- **AND** the guide shall provide examples for review and feedback (code review, bug spotting)
- **AND** the guide shall provide examples for planning and design (task breakdown, implementation planning)
- **AND** the guide shall provide examples for code changes in edit mode (refactoring, bug fixes)

#### Scenario: User accesses Chinese translation

- **GIVEN** the user prefers Chinese language
- **WHEN** the user switches to Chinese (zh-CN)
- **THEN** the conversation session guide shall display in Chinese
- **AND** the title shall be "创建普通会话"
- **AND** all sections shall be translated accurately
- **AND** technical terms shall use consistent Chinese terminology
- **AND** UI elements shall match the actual PCode interface

#### Scenario: User compares with traditional IDEs

- **GIVEN** the user has experience with other AI-powered IDEs
- **WHEN** the user reads the "Comparison with Traditional IDEs" section
- **THEN** the guide shall mention similarity to VS Code Copilot Chat
- **AND** the guide shall mention similarity to Cursor AI chat
- **AND** the guide shall help the user transfer existing knowledge to PCode

#### Scenario: User navigates to next document

- **GIVEN** the user has completed the conversation session guide
- **WHEN** the user reaches the "Next Steps" section
- **THEN** the guide shall provide a preview of idea sessions
- **AND** the guide shall link to the next quick-start document (Creating an Idea Session)
- **AND** the user shall understand the progression from simple chat to advanced workflow

### Requirement: Chinese Translation Configuration

The site MUST maintain a complete `current.json` translation configuration file that includes all Quick Start documentation entries for the Chinese locale.

#### Scenario: Quick Start translation entries exist in current.json

**Given** the file `i18n/zh-CN/docusaurus-plugin-content-docs/current.json` exists
**When** the file is parsed by Docusaurus
**Then** the file MUST include translation entries for:
  - Quick Start category label: "快速开始"
  - Quick Start category description
  - installation.md title: "安装指南"
  - installation.md description
  - create-first-project.md title
  - create-first-project.md description
  - conversation-session.md title
  - conversation-session.md description
  - proposal-session.md title
  - proposal-session.md description

#### Scenario: current.json is valid JSON

**Given** the `current.json` file exists
**When** the file is validated with a JSON parser
**Then** the file MUST have valid JSON syntax
**And** all translation entries MUST follow the Docusaurus translation format
**And** each entry MUST include "message" and "description" properties

---

### Requirement: Minimal Chinese Translation Stubs

For all documentation sections referenced in English pages, the site MUST provide minimal Chinese translation stubs to prevent broken link build errors.

#### Scenario: Chinese translation stubs exist for all sections

**Given** the English documentation includes links to Chinese translations
**When** the build process validates all links
**Then** Chinese translation stubs MUST exist for:
  - Configuration section (`i18n/zh-CN/docusaurus-plugin-content-docs/current/configuration/`)
  - Feature Guides section (`i18n/zh-CN/docusaurus-plugin-content-docs/current/feature-guides/`)
  - User Guide section (`i18n/zh-CN/docusaurus-plugin-content-docs/current/user-guide/`)
**And** each stub file MUST have valid frontmatter
**And** each stub file MUST indicate "Translation in Progress" or similar notice

#### Scenario: Stub files prevent build failures

**Given** minimal Chinese translation stubs exist
**When** `npm run build` is executed
**Then** the build MUST complete successfully
**And** no broken link errors MUST occur
**And** all `/zh-CN/docs/*` paths MUST resolve (even if to placeholder content)

---

### Requirement: Chinese Quick Start Pages Accessible

When users switch to Chinese locale (zh-CN), all Quick Start documentation pages MUST be accessible without 404 errors.

#### Scenario: User navigates to Chinese installation guide

**Given** the user has switched to Chinese locale (zh-CN)
**When** the user navigates to `/zh-CN/docs/quick-start/installation`
**Then** the installation guide MUST load successfully
**And** the page MUST display the Chinese translation content
**And** no 404 error MUST occur
**And** the page title MUST be "安装指南"

#### Scenario: User navigates to Chinese project creation guide

**Given** the user has switched to Chinese locale (zh-CN)
**When** the user navigates to `/zh-CN/docs/quick-start/create-first-project`
**Then** the project creation guide MUST load successfully
**And** the page MUST display the Chinese translation content
**And** no 404 error MUST occur

#### Scenario: User navigates to Chinese conversation session guide

**Given** the user has switched to Chinese locale (zh-CN)
**When** the user navigates to `/zh-CN/docs/quick-start/conversation-session`
**Then** the conversation session guide MUST load successfully
**And** the page MUST display the Chinese translation content
**And** no 404 error MUST occur

#### Scenario: User navigates to Chinese proposal session guide

**Given** the user has switched to Chinese locale (zh-CN)
**When** the user navigates to `/zh-CN/docs/quick-start/proposal-session`
**Then** the proposal session guide MUST load successfully
**And** the page MUST display the Chinese translation content
**And** no 404 error MUST occur

#### Scenario: Language switcher works correctly

**Given** the user is viewing English quick-start documentation
**When** the user clicks the language dropdown and selects "简体中文"
**Then** the page MUST reload with Chinese content
**And** the URL MUST update to `/zh-CN/docs/quick-start/[current-page]`
**And** the sidebar MUST display "快速开始" category
**And** all quick-start links MUST work without 404 errors

---

### Requirement: Build Validation for i18n

The build process MUST complete successfully without broken link errors for either English or Chinese locales.

#### Scenario: Production build succeeds

**Given** all translation files and configuration are in place
**When** `npm run build` is executed
**Then** the build MUST complete successfully for locale `en`
**And** the build MUST complete successfully for locale `zh-CN`
**And** no broken link errors MUST be reported
**And** the build output MUST show "Website will be built for all these locales: en, zh-CN"

#### Scenario: Development server serves Chinese content

**Given** the development server is running with `npm start`
**When** a user navigates to any `/zh-CN/docs/*` path
**Then** the page MUST load without 404 errors
**And** Chinese content MUST be displayed
**And** the browser console MUST NOT show missing resource errors

### Requirement: Mermaid Diagram Support

The documentation site MUST support Mermaid diagram syntax for rendering flowcharts, state diagrams, and other technical diagrams in MDX documentation files.

#### Scenario: Mermaid diagram renders in documentation

- **GIVEN** an MDX documentation file contains a Mermaid code block
- **WHEN** the documentation page is rendered
- **THEN** the Mermaid code block is converted to an SVG diagram
- **AND** the diagram is displayed inline with the documentation content
- **AND** no raw Mermaid syntax is visible to the user

#### Scenario: Flowchart diagram displays correctly

- **GIVEN** an MDX file contains a flowchart defined with Mermaid syntax (`graph` or `flowchart`)
- **WHEN** the page is viewed in a browser
- **THEN** the flowchart is rendered with proper node connections
- **AND** arrows and edges connect nodes as specified
- **AND** node labels and edge labels are displayed correctly

#### Scenario: State diagram displays correctly

- **GIVEN** an MDX file contains a state diagram defined with Mermaid syntax (`stateDiagram`)
- **WHEN** the page is viewed in a browser
- **THEN** the state diagram is rendered with proper state transitions
- **AND** state changes are represented with arrows
- **AND** start and end states are indicated appropriately

#### Scenario: Sequence diagram displays correctly

- **GIVEN** an MDX file contains a sequence diagram defined with Mermaid syntax (`sequenceDiagram`)
- **WHEN** the page is viewed in a browser
- **THEN** the sequence diagram shows participants in the correct order
- **AND** messages between participants are displayed with proper arrows
- **AND** activation boxes are rendered for message processing

#### Scenario: Class diagram displays correctly

- **GIVEN** an MDX file contains a UML class diagram defined with Mermaid syntax (`classDiagram`)
- **WHEN** the page is viewed in a browser
- **THEN** the class diagram shows classes with their attributes and methods
- **AND** relationships between classes (inheritance, association) are displayed
- **AND** visibility modifiers (public, private, protected) are indicated

---

### Requirement: Mermaid Theme Configuration

The Docusaurus configuration MUST include Mermaid theme settings that adapt to the site's light and dark color themes.

#### Scenario: Mermaid uses light theme in light mode

- **GIVEN** the user has selected the light theme
- **AND** `docusaurus.config.ts` contains `mermaid.theme.light: 'base'`
- **WHEN** a Mermaid diagram is rendered
- **THEN** the diagram uses light color scheme
- **AND** diagram elements are visible against the light background
- **AND** text colors provide adequate contrast

#### Scenario: Mermaid uses dark theme in dark mode

- **GIVEN** the user has selected the dark theme
- **AND** `docusaurus.config.ts` contains `mermaid.theme.dark: 'dark'`
- **WHEN** a Mermaid diagram is rendered
- **THEN** the diagram uses dark color scheme
- **AND** diagram elements are visible against the dark background
- **AND** text colors provide adequate contrast

#### Scenario: Theme switching updates diagrams

- **GIVEN** a user is viewing a page with Mermaid diagrams
- **WHEN** the user switches between light and dark themes
- **THEN** all Mermaid diagrams on the page update to match the new theme
- **AND** the update happens without page reload
- **AND** no diagram rendering errors occur

---

### Requirement: Mermaid Diagram Conventions

Documentation contributors MUST follow established conventions when using Mermaid diagrams in documentation files.

#### Scenario: Diagrams use appropriate syntax

- **GIVEN** a contributor is creating a new diagram
- **WHEN** writing the Mermaid code block
- **THEN** the diagram type matches the intended visualization (flowchart for processes, stateDiagram for states, etc.)
- **AND** the diagram uses consistent node naming conventions
- **AND** edge labels clearly describe the relationship or condition

#### Scenario: Diagrams remain within complexity limits

- **GIVEN** a contributor is creating a new diagram
- **WHEN** the diagram is intended for documentation
- **THEN** the diagram contains fewer than 20 nodes for clarity
- **AND** the diagram can be understood without zooming
- **AND** the diagram fits within the standard documentation content width

#### Scenario: Diagrams include descriptive context

- **GIVEN** a contributor adds a Mermaid diagram to documentation
- **WHEN** the diagram is placed in the document
- **THEN** explanatory text precedes or follows the diagram
- **AND** the diagram's purpose is clear from context
- **AND** key elements of the diagram are explained in the surrounding text


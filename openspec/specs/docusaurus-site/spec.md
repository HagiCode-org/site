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

The Quick Start documentation series MUST include a comprehensive guide for creating and configuring the first project in PCode, with visual screenshots demonstrating each key step of the workflow.

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

#### Scenario: Visual screenshots guide users through key steps

**Given** the user is reading the "Create Your First Project" document
**When** the user reaches each key operational step
**Then** the document MUST include visual screenshots demonstrating:
  - Step 2.1: Clicking the "New Project" button in the PCode interface
  - Step 2.2: Filling in project general information form
  - Step 2.3: Viewing the newly created project in the project list
  - Step 3.1: Clicking the project's SDD tab to initialize SDD
  - Step 3.2: Display state after SDD initialization is complete
  - Step 4.1: Clicking the optimize button to optimize Project.md
**And** each screenshot MUST have a descriptive alt text in Chinese
**And** screenshots MUST be placed immediately after the corresponding step description
**And** screenshots MUST use absolute paths starting with `/img/create-project/`
**And** screenshot filenames MUST match their descriptive content

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
**And** images use standard Docusaurus markdown syntax: `![alt text](/img/path/to/image.png)`

#### Scenario: Integration with existing Quick Start

**Given** the Quick Start series already contains an installation guide
**When** the project creation guide is added
**Then** the document appears in the same Quick Start category
**And** no changes to `sidebars.ts` are required (autogenerated directory)
**And** the document is automatically included in navigation
**And** a reference to the next step (project creation) exists in installation guide if applicable

### Requirement: Quick Start Conversation Session Documentation

The documentation site SHALL provide a comprehensive guide for creating and using conversation sessions in PCode, as the third document in the Quick Start series. The guide SHALL include visual demonstrations through screenshots showing actual PCode interface interactions for both read-only and edit modes.

#### Scenario: User creates their first conversation session

- **GIVEN** the user has completed PCode installation
- **AND** the user has created their first project
- **WHEN** the user navigates to the Quick Start - Creating a Conversation Session guide
- **THEN** the guide shall explain how to locate the session list
- **AND** the guide shall explain how to click "Add Chat" button
- **AND** the guide shall show screenshots of the session list interface
- **AND** the guide shall show screenshots of the new conversation window
- **AND** the user shall be able to successfully create a conversation session

#### Scenario: User understands read-only vs. edit mode

- **GIVEN** the user is reading the conversation session guide
- **WHEN** the user reaches the "Understanding Modes" section
- **THEN** the guide shall explain read-only mode is the default
- **AND** the guide shall list what AI can do in read-only mode (read files, analyze, describe)
- **AND** the guide shall list what AI cannot do in read-only mode (modify files)
- **AND** the guide shall provide a practical example with screenshots: "了解一下这个项目" (understand this project)
- **AND** the screenshots shall demonstrate AI analyzing and summarizing project structure in read-only mode
- **AND** the guide shall explain how to switch to edit mode with screenshots
- **AND** the guide shall explain when to use edit mode

#### Scenario: User sees edit mode demonstration

- **GIVEN** the user is reading the conversation session guide
- **WHEN** the user reaches the "Edit Mode" section
- **THEN** the guide shall show screenshots of switching to edit mode
- **AND** the guide shall provide a practical example with screenshots: requesting AI to update README file
- **AND** the screenshots shall demonstrate AI executing code modifications
- **AND** the guide shall explain the permissions available in edit mode
- **AND** the guide shall show the resulting file changes in screenshots

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
- **AND** each use case shall reference relevant screenshots

#### Scenario: User accesses Chinese translation

- **GIVEN** the user prefers Chinese language
- **WHEN** the user switches to Chinese (zh-CN)
- **THEN** the conversation session guide shall display in Chinese
- **AND** the title shall be "创建普通会话"
- **AND** all sections shall be translated accurately
- **AND** technical terms shall use consistent Chinese terminology
- **AND** UI elements shall match the actual PCode interface
- **AND** all screenshots shall display correctly in the Chinese version

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

#### Scenario: User views visual workflow diagrams

- **GIVEN** the user is learning about conversation sessions
- **WHEN** the user views the "Understanding Modes" section
- **THEN** the guide shall include a Mermaid flowchart diagram showing mode switching flow
- **AND** the guide shall include Mermaid sequence diagrams for read-only mode workflow
- **AND** the guide shall include Mermaid sequence diagrams for edit mode workflow
- **AND** the diagrams shall visually demonstrate the permission differences between modes

#### Scenario: All screenshots load correctly

- **GIVEN** the conversation session document includes screenshots
- **WHEN** the page loads in a browser
- **THEN** all screenshots SHALL load without broken image errors
- **AND** screenshots SHALL use correct Docusaurus static asset paths (`/img/create-normal-session/*.png`)
- **AND** screenshots SHALL include descriptive alt text for accessibility
- **AND** screenshots SHALL be responsive and display correctly on different screen sizes

#### Scenario: User learns session management

- **GIVEN** the user has created conversation sessions
- **WHEN** the user reaches the session management section
- **THEN** the guide shall show how to delete conversation sessions with screenshots
- **AND** the screenshots shall demonstrate the deletion process
- **AND** the guide shall explain when to delete or archive sessions

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

### Requirement: Cross-Platform Documentation with Tabs Component

Documentation pages that include platform-specific instructions for Windows, macOS, and Linux MUST use Docusaurus Tabs and TabItem components to organize content by platform.

#### Scenario: Installation guide uses Tabs for platform-specific instructions

- **GIVEN** the installation guide (`docs/quick-start/installation.md`) includes instructions for Docker, Node.js, and software package deployment
- **WHEN** a user views the installation guide
- **THEN** the guide MUST use `<Tabs>` and `<TabItem>` components to separate Windows, macOS, and Linux instructions
- **AND** each platform MUST have its own `<TabItem>` with `value` attribute set to "win", "mac", or "linux"
- **AND** each `<TabItem>` MUST have a `label` attribute set to "Windows", "macOS", or "Linux"
- **AND** users can click between platform tabs to view only their operating system's instructions

#### Scenario: Code blocks within TabItems maintain syntax highlighting

- **GIVEN** a TabItem contains command-line instructions
- **WHEN** the TabItem includes a code block for bash or PowerShell commands
- **THEN** the code block MUST use appropriate language tags (`bash`, `powershell`, `csharp`, `fsharp`)
- **AND** Prism.js syntax highlighting MUST be applied correctly within the TabItem
- **AND** the code block MUST display a title attribute when specified (e.g., `title="在 Ubuntu/Debian 上安装 Docker"`)

#### Scenario: Tabs improve mobile reading experience

- **GIVEN** a user is viewing documentation on a mobile device
- **WHEN** the page contains cross-platform instructions organized with Tabs
- **THEN** the user MUST be able to tap on platform labels to switch between platforms
- **AND** the page length MUST be reduced compared to listing all platforms sequentially
- **AND** scrolling MUST be minimized as users only see their selected platform's content

#### Scenario: MDX import statements are present

- **GIVEN** a markdown file uses Tabs components
- **WHEN** the file is parsed as MDX
- **THEN** the file MUST import Tabs and TabItem from `@theme/Tabs` and `@theme/TabItem`
- **AND** the import statements MUST be placed at the top of the file after frontmatter
- **AND** the file extension MAY remain `.md` as Docusaurus supports MDX in `.md` files

#### Scenario: Build validation passes with Tabs

- **GIVEN** documentation files have been updated to use Tabs components
- **WHEN** `npm run build` is executed
- **THEN** the build MUST complete successfully without MDX parsing errors
- **AND** `npm run typecheck` MUST pass without TypeScript errors
- **AND** the build MUST not report any broken links (respecting `onBrokenLinks: 'throw'` configuration)

#### Scenario: Tabs maintain consistency across documentation

- **GIVEN** multiple documentation pages contain cross-platform instructions
- **WHEN** different pages use Tabs components
- **THEN** all Tabs MUST use the same platform naming convention: "Windows", "macOS", "Linux"
- **AND** all TabItem value attributes MUST use consistent naming: "win", "mac", "linux"
- **AND** the visual appearance of Tabs MUST be consistent across all pages

#### Scenario: Search engines can index TabItem content

- **GIVEN** a documentation page uses Tabs to organize platform-specific content
- **WHEN** a user searches for commands or instructions using the site search
- **THEN** search MUST be able to find content within TabItems
- **AND** clicking a search result MUST navigate to the correct page and automatically open the relevant TabItem

#### Scenario: Future documentation follows Tabs convention

- **GIVEN** a contributor is creating new documentation with platform-specific instructions
- **WHEN** the documentation includes Windows, macOS, or Linux specific steps
- **THEN** the contributor MUST use Tabs and TabItem components instead of bullet lists
- **AND** the contributor MUST follow the established naming conventions for values and labels
- **AND** the contributor MUST ensure code blocks within TabItems have appropriate language tags

### Requirement: Related Software Installation Documentation Category

The documentation site MUST include a "相关软件安装" (Related Software Installation) category that provides installation guides for third-party software required by PCode users.

#### Scenario: Category appears in sidebar

- **GIVEN** the documentation site is running
- **WHEN** a user views the documentation sidebar
- **THEN** a "相关软件安装" category MUST be displayed
- **AND** the category MUST be positioned after Quick Start in the navigation hierarchy
- **AND** the category CAN be expanded to show software installation guides

#### Scenario: Category metadata configured

- **GIVEN** the `docs/related-software-installation/_category_.json` file exists
- **WHEN** the file is parsed by Docusaurus
- **THEN** the category displays with the label "相关软件安装"
- **AND** the category position is configured to appear after Quick Start
- **AND** a generated-index page MAY be created for the category

#### Scenario: Category supports multiple software guides

- **GIVEN** the related software installation category structure exists
- **WHEN** contributors add new installation guides
- **THEN** each software MUST have its own subdirectory (e.g., `postgresql/`, `nodejs/`, `git/`)
- **AND** each subdirectory MUST contain its own `_category_.json` with software-specific metadata
- **AND** the sidebar MUST automatically include all subdirectories

---

### Requirement: PostgreSQL on Windows Installation Guide

The documentation site MUST provide a comprehensive guide for installing PostgreSQL on Windows operating system as the first document in the Related Software Installation category.

#### Scenario: User accesses PostgreSQL installation guide

- **GIVEN** the user has navigated to the Related Software Installation category
- **WHEN** the user clicks on the PostgreSQL subdirectory
- **THEN** an installation guide titled "在 Windows 上安装 PostgreSQL" MUST be accessible
- **AND** the guide MUST appear as the first document in the PostgreSQL subdirectory

#### Scenario: Guide includes complete installation workflow

- **GIVEN** the user is reading the PostgreSQL installation guide
- **WHEN** the user views the document content
- **THEN** the guide MUST include all 11 installation steps with corresponding screenshots:
  - Step 1: 打开安装界面
  - Step 2: 设置安装的文件夹
  - Step 3: 设置安装的内容
  - Step 4: 设置之后数据库存放数据的文件夹
  - Step 5: 设置数据库初始用户的密码
  - Step 6: 设置数据库的端口
  - Step 7: 设置数据库的字符集和文化
  - Step 8: 查看安装的计划
  - Step 9: 准备开始安装
  - Step 10: 实时展示安装进度
  - Step 11: 安装已完成
- **AND** each step MUST include descriptive text in Chinese
- **AND** each step MUST include the corresponding screenshot from `static/img/install-postgres-windows/`

#### Scenario: Screenshots are correctly referenced

- **GIVEN** the installation guide includes screenshot references
- **WHEN** the documentation page is rendered
- **THEN** all images MUST load correctly from `/img/install-postgres-windows/` path
- **AND** each image MUST have appropriate alt text describing the installation step
- **AND** no broken image links MUST appear on the page

#### Scenario: Guide includes post-installation information

- **GIVEN** the user has completed reading the installation steps
- **WHEN** the user reaches the end of the document
- **THEN** the guide MUST include verification steps to confirm successful installation
- **AND** the guide MAY include tips for common configuration tasks
- **AND** the guide MAY include a troubleshooting section for common issues

#### Scenario: Document follows conventions

- **GIVEN** the `install-on-windows.md` file exists
- **WHEN** the file is validated
- **THEN** the file MUST use kebab-case naming
- **AND** frontmatter MUST include `title` and `description` properties in Chinese
- **AND** the file MUST use valid markdown syntax
- **AND** image references MUST use relative paths from the static directory

#### Scenario: Guide provides user-friendly experience

- **GIVEN** a user is new to PostgreSQL installation
- **WHEN** the user follows the guide step-by-step
- **THEN** each step MUST be clearly numbered and labeled
- **AND** screenshots MUST show the actual installation interface
- **AND** the user MUST be able to complete the installation without external references

---

### Requirement: Sidebar Configuration for Related Software Installation

The sidebar configuration MUST include the Related Software Installation category with proper positioning and metadata.

#### Scenario: Sidebar includes Related Software Installation category

- **GIVEN** the `sidebars.ts` file is configured
- **WHEN** the sidebar renders in the browser
- **THEN** the Related Software Installation category MUST appear in the sidebar
- **AND** the category MUST be positioned after Quick Start
- **AND** the category MUST use autogenerated subcategory structure

#### Scenario: PostgreSQL guide appears in correct location

- **GIVEN** the Related Software Installation category is expanded
- **WHEN** a user views the PostgreSQL subcategory
- **THEN** the "在 Windows 上安装 PostgreSQL" document MUST be listed
- **AND** the document MUST be the first item in the PostgreSQL subcategory
- **AND** clicking the document MUST navigate to the installation guide

#### Scenario: Extensibility for future software guides

- **GIVEN** the sidebar configuration uses autogenerated structure
- **WHEN** contributors add new software installation guides (e.g., Node.js, Git)
- **THEN** new subdirectories and documents MUST automatically appear in the sidebar
- **AND** no manual sidebar configuration updates MUST be required
- **AND** the structure MUST remain consistent across all software guides

### Requirement: Claude Code with ZAI Setup Guide

The documentation site MUST provide a comprehensive guide for installing and configuring Claude Code with the ZAI (智谱 AI) model as part of the Related Software Installation category.

#### Scenario: User accesses Claude Code setup guide

- **GIVEN** the user has navigated to the Related Software Installation category
- **WHEN** the user clicks on the Claude Code subdirectory (positioned alongside PostgreSQL)
- **THEN** an installation guide titled "安装和设置 Claude Code 与 ZAI" MUST be accessible
- **AND** the guide MUST appear as the first document in the Claude Code subdirectory

#### Scenario: Guide includes complete setup workflow

- **GIVEN** the user is reading the Claude Code with ZAI setup guide
- **WHEN** the user views the document content
- **THEN** the guide MUST include all essential setup sections:
  - Claude Code NPM installation steps with version verification command
  - ZAI subscription purchase guide with 10% discount link
  - API Key creation instructions with direct link to API keys page
  - ZAI configuration using `coding-helper` command-line tool
  - First-time usage instructions including initial API Key handling
  - IDE plugin installation for VSCode and JetBrains
  - Link to next step (OpenSpec integration guide)
- **AND** each section MUST include clear instructions in Chinese
- **AND** code blocks MUST use appropriate syntax highlighting (bash)

#### Scenario: ZAI subscription information is accurate

- **GIVEN** the user is reading the subscription purchase section
- **WHEN** the user views ZAI subscription options
- **THEN** the guide MUST recommend Coding Plan for daily development use
- **AND** the guide MUST include the 10% discount link: `https://www.bigmodel.cn/claude-code?ic=14BY54APZA`
- **AND** the guide MUST mention lite version for initial trial
- **AND** the guide MUST provide direct link to API Key creation page

#### Scenario: Configuration steps are actionable

- **GIVEN** the user has obtained a ZAI API Key
- **WHEN** the user follows the configuration instructions
- **THEN** the guide MUST provide the exact command: `npx @z_ai/coding-helper`
- **AND** the guide MUST explain the interactive configuration process
- **AND** the guide MUST clarify that the initial API Key prompt can use any placeholder string
- **AND** the guide MUST link to official ZAI documentation for reference

#### Scenario: IDE plugin information is provided

- **GIVEN** the user prefers IDE integration over command-line tools
- **WHEN** the user reads the IDE plugin section
- **THEN** the guide MUST provide VSCode marketplace link
- **AND** the guide MUST provide JetBrains marketplace link
- **AND** the guide MUST explain advantages of IDE plugin usage
- **AND** all plugin links MUST be current and accessible

#### Scenario: Document follows naming conventions

- **GIVEN** the `setup-claude-code-with-zai.md` file exists
- **WHEN** the file is validated
- **THEN** the file MUST use kebab-case naming
- **AND** frontmatter MUST include `title` and `description` properties in Chinese
- **AND** the file MUST use valid markdown syntax
- **AND** internal links MUST use proper Docusaurus path format

#### Scenario: Document integrates with existing structure

- **GIVEN** the Claude Code subdirectory exists in Related Software Installation
- **WHEN** the user views the documentation sidebar
- **THEN** the Claude Code subdirectory MUST appear alongside other software guides (e.g., PostgreSQL) at the same directory level
- **AND** no changes to `sidebars.ts` MUST be required (autogenerated directory)
- **AND** the document MUST be automatically included in navigation
- **AND** the Claude Code category MUST have proper `_category_.json` metadata

#### Scenario: Links to external resources are valid

- **GIVEN** the document includes external links
- **WHEN** the documentation page is rendered
- **THEN** all external links MUST be accessible:
  - ZAI official documentation: `https://docs.bigmodel.cn/cn/coding-plan/tool/claude`
  - ZAI discount link: `https://www.bigmodel.cn/claude-code?ic=14BY54APZA`
  - API Key creation: `https://bigmodel.cn/usercenter/proj-mgmt/apikeys`
  - VSCode plugin marketplace
  - JetBrains plugin marketplace
- **AND** no broken link errors MUST occur

#### Scenario: Chinese translation completeness

- **GIVEN** the PCode documentation site is Chinese-only
- **WHEN** the Claude Code setup guide is accessed
- **THEN** all content MUST be in Chinese
- **AND** technical terms MUST use consistent Chinese terminology or English where standard
- **AND** the document title MUST be "安装和设置 Claude Code 与 ZAI"
- **AND** code blocks and commands MUST remain in English

#### Scenario: Next steps guidance is provided

- **GIVEN** the user has completed Claude Code and ZAI setup
- **WHEN** the user reaches the end of the document
- **THEN** the guide MUST provide a link to the OpenSpec integration guide
- **AND** the link MUST reference the appropriate OpenSpec documentation
- **AND** the user MUST understand the progression from setup to advanced usage

---

### Requirement: Claude Code Subdirectory Category Structure

The Related Software Installation category MUST include a Claude Code subdirectory with proper category metadata configuration, positioned at the same directory level as other software guides like PostgreSQL.

#### Scenario: Claude Code subdirectory exists

- **GIVEN** the `docs/related-software-installation/` directory exists
- **WHEN** listing directory contents
- **THEN** a `claude-code/` subdirectory MUST exist alongside `postgresql/`
- **AND** the subdirectory MUST contain `_category_.json` with metadata

#### Scenario: Claude Code category metadata configured

- **GIVEN** the `docs/related-software-installation/claude-code/_category_.json` file exists
- **WHEN** the file is parsed by Docusaurus
- **THEN** the category displays with the label "Claude Code"
- **AND** the category position is configured appropriately
- **AND** the category integrates with the autogenerated sidebar structure

#### Scenario: Extensibility for future Claude Code content

- **GIVEN** the Claude Code subdirectory structure exists
- **WHEN** contributors need to add more Claude Code related documentation
- **THEN** new documents can be added to the `claude-code/` directory
- **AND** no manual sidebar configuration updates are required
- **AND** the structure remains consistent with other software subdirectories

### Requirement: OpenSpec Installation Guide

The documentation site MUST provide a comprehensive guide for installing and configuring OpenSpec as part of the Related Software Installation category, following the same structure and quality standards as the Claude Code installation guide.

#### Scenario: User accesses OpenSpec installation guide

- **GIVEN** the user has navigated to the Related Software Installation category
- **WHEN** the user clicks on the OpenSpec subdirectory
- **THEN** an installation guide titled "安装 OpenSpec" MUST be accessible
- **AND** the guide MUST appear as the first document in the OpenSpec subdirectory
- **AND** the guide MUST use the MDX format supported by Docusaurus

#### Scenario: Guide includes complete installation workflow

- **GIVEN** the user is reading the OpenSpec installation guide
- **WHEN** the user views the document content
- **THEN** the guide MUST include all essential sections:
  - OpenSpec 简介（说明 OpenSpec 的作用和在 PCode 项目中的应用场景）
  - 安装方式（通过 NPM 全局安装，多平台支持说明）
  - 安装验证步骤
  - 配置说明（基本配置、Git 集成、环境变量配置）
  - 验证和测试（安装验证命令、基本功能测试、环境验证脚本）
  - 常见问题和故障排除
- **AND** each section MUST include clear instructions in Chinese
- **AND** code blocks MUST use appropriate syntax highlighting (bash, powershell)

#### Scenario: Guide uses Tabs for multi-platform instructions

- **GIVEN** the installation guide includes instructions for Windows, macOS, and Linux
- **WHEN** a user views the installation guide
- **THEN** the guide MUST use `<Tabs>` and `<TabItem>` components to separate platform-specific instructions
- **AND** each platform MUST have its own `<TabItem>` with `value` attribute set to "win", "mac", or "linux"
- **AND** each `<TabItem>` MUST have a `label` attribute set to "Windows", "macOS", or "Linux"
- **AND** users can click between platform tabs to view only their operating system's instructions

#### Scenario: Guide includes callouts for important information

- **GIVEN** the installation guide contains important tips, notes, or warnings
- **WHEN** the user reads through the guide
- **THEN** the guide MUST use Docusaurus callout syntax (`:::tip`, `:::note`, `:::warning`)
- **AND** each callout MUST provide relevant and helpful information
- **AND** callouts MUST be appropriately placed near related content

#### Scenario: Guide includes verification steps

- **GIVEN** the user has completed the OpenSpec installation
- **WHEN** the user reaches the verification section
- **THEN** the guide MUST provide commands to verify installation:
  - `openspec --version` to check installed version
  - `openspec list` to list active changes
  - `openspec list --specs` to list specifications
- **AND** the guide MUST provide expected output examples
- **AND** the guide MUST include an environment verification script

#### Scenario: Guide includes troubleshooting section

- **GIVEN** the user encounters issues during installation
- **WHEN** the user reaches the troubleshooting section
- **THEN** the guide MUST address common issues:
  - Permission errors (npm global install permissions)
  - Network issues (npm registry access, alternative mirrors)
  - Version compatibility issues
- **AND** each issue MUST include clear resolution steps
- **AND** the guide MUST provide links to additional resources if needed

#### Scenario: Document follows naming conventions

- **GIVEN** the `setup-openspec.md` file exists
- **WHEN** the file is validated
- **THEN** the file MUST use kebab-case naming
- **AND** frontmatter MUST include `title` and `description` properties in Chinese
- **AND** the file MUST use valid markdown syntax
- **AND** the file MUST import Tabs and TabItem components if using tabs

#### Scenario: Document integrates with existing structure

- **GIVEN** the OpenSpec subdirectory exists in Related Software Installation
- **WHEN** the user views the documentation sidebar
- **THEN** the OpenSpec subdirectory MUST appear alongside other software guides (e.g., PostgreSQL, Claude Code) at the same directory level
- **AND** no changes to `sidebars.ts` MUST be required (autogenerated directory)
- **AND** the document MUST be automatically included in navigation
- **AND** the OpenSpec category MUST have proper `_category_.json` metadata

#### Scenario: Guide provides context for PCode users

- **GIVEN** the user is new to OpenSpec
- **WHEN** the user reads the introduction section
- **THEN** the guide MUST explain what OpenSpec is (spec-driven development tool)
- **AND** the guide MUST explain how OpenSpec is used in the PCode project
- **AND** the guide MUST reference the OpenSpec workflow stages (Creating Changes, Implementing Changes, Archiving Changes)
- **AND** the guide MUST link to the main installation guide for context

#### Scenario: Chinese translation completeness

- **GIVEN** the PCode documentation site is Chinese-only
- **WHEN** the OpenSpec installation guide is accessed
- **THEN** all content MUST be in Chinese
- **AND** technical terms MUST use consistent Chinese terminology or English where standard
- **AND** the document title MUST be "安装 OpenSpec"
- **AND** code blocks and commands MUST remain in English

---

### Requirement: OpenSpec Subdirectory Category Structure

The Related Software Installation category MUST include an OpenSpec subdirectory with proper category metadata configuration, positioned at the same directory level as other software guides (PostgreSQL, Claude Code).

#### Scenario: OpenSpec subdirectory exists

- **GIVEN** the `docs/related-software-installation/` directory exists
- **WHEN** listing directory contents
- **THEN** an `openspec/` subdirectory MUST exist alongside `postgresql/` and `claude-code/`
- **AND** the subdirectory MUST contain `_category_.json` with metadata

#### Scenario: OpenSpec category metadata configured

- **GIVEN** the `docs/related-software-installation/openspec/_category_.json` file exists
- **WHEN** the file is parsed by Docusaurus
- **THEN** the category displays with the label "OpenSpec"
- **AND** the category position is configured appropriately
- **AND** the category integrates with the autogenerated sidebar structure

#### Scenario: Extensibility for future OpenSpec content

- **GIVEN** the OpenSpec subdirectory structure exists
- **WHEN** contributors need to add more OpenSpec related documentation
- **THEN** new documents can be added to the `openspec/` directory
- **AND** no manual sidebar configuration updates are required
- **AND** the structure remains consistent with other software subdirectories

---

### Requirement: Installation Guide Reference in Main Installation

The main installation guide (`docs/quick-start/installation.md`) MUST include a reference link to the detailed OpenSpec installation guide in the Related Software Installation category.

#### Scenario: Main installation guide links to OpenSpec detailed guide

- **GIVEN** the user is reading the main installation guide
- **WHEN** the user reaches the OpenSpec CLI section
- **THEN** the guide MUST provide a brief installation command: `npm install -g @fission-ai/openspec@latest`
- **AND** the guide MUST include a link to the detailed OpenSpec installation guide
- **AND** the link MUST use proper Docusaurus path format
- **AND** the link text MUST be clear and descriptive (e.g., "详细安装指南请参阅：安装 OpenSpec")

#### Scenario: Link target is accessible

- **GIVEN** the main installation guide includes a link to the OpenSpec installation guide
- **WHEN** a user clicks on the link
- **THEN** the link MUST navigate to `/docs/related-software-installation/openspec/setup-openspec`
- **AND** the target page MUST load successfully
- **AND** no 404 error MUST occur

### Requirement: Custom Homepage Components

The documentation site MUST support custom React components on the homepage to provide a rich, interactive user experience that showcases PCode's core value propositions.

#### Scenario: Homepage loads with custom components

- **GIVEN** the Docusaurus site is running with custom homepage
- **WHEN** a user navigates to the root URL (`/`)
- **THEN** the homepage SHALL render using custom React components from `src/pages/index.tsx`
- **AND** the page SHALL include a Hero section with title, description, and CTA buttons
- **AND** the page SHALL include a Features section showcasing three core values
- **AND** the page SHALL include an OpenSpec workflow animation
- **AND** the page SHALL include a Showcase section with product screenshots
- **AND** all components SHALL render without errors

#### Scenario: Custom components support TypeScript

- **GIVEN** a developer creates a custom homepage component
- **WHEN** the component is written in TypeScript
- **THEN** TypeScript compilation SHALL succeed without errors
- **AND** type definitions SHALL be available for all Docusaurus and React APIs
- **AND** `npm run typecheck` SHALL pass

#### Scenario: Custom components support dark/light theme

- **GIVEN** the Docusaurus site has custom homepage components
- **WHEN** a user switches between light and dark themes
- **THEN** all homepage components SHALL update to match the selected theme
- **AND** components SHALL use Docusaurus CSS variables for colors
- **AND** no component SHALL have hardcoded colors that ignore theme settings

---

### Requirement: Homepage Hero Section

The homepage MUST include a Hero section that prominently displays the product name, tagline, and call-to-action buttons with an attractive gradient background.

#### Scenario: Hero section displays correctly

- **GIVEN** a user views the homepage
- **WHEN** the page loads
- **THEN** a Hero section SHALL be displayed at the top of the page
- **AND** the section SHALL display "PCode" as the main title
- **AND** the section SHALL display a tagline emphasizing "智能 · 便捷 · 有趣"
- **AND** the section SHALL include a "开始使用" button linking to installation guide
- **AND** the section SHALL include a "了解更多" button linking to feature guides

#### Scenario: Hero section has gradient background

- **GIVEN** the Hero section is rendered
- **WHEN** the user views the section
- **THEN** the background SHALL display a gradient from the site background color
- **AND** the gradient SHALL transition smoothly
- **AND** the gradient SHALL adapt to light and dark themes

#### Scenario: Hero section is responsive

- **GIVEN** the Hero section is displayed
- **WHEN** viewed on different screen sizes
- **THEN** on desktop (>1024px) the title SHALL be 3rem font size
- **AND** on tablet (768px-1024px) the title SHALL scale proportionally
- **AND** on mobile (<768px) the title SHALL be 2rem font size
- **AND** buttons SHALL wrap appropriately on smaller screens

---

### Requirement: Homepage Features Section

The homepage MUST include a Features section that showcases PCode's three core value propositions: 智能 (Intelligent), 便捷 (Convenient), and 有趣 (Fun/Engaging).

#### Scenario: Features section displays three cards

- **GIVEN** a user scrolls to the Features section
- **WHEN** the section is rendered
- **THEN** three feature cards SHALL be displayed in a grid layout
- **AND** the first card SHALL represent "智能" with AI-driven capabilities
- **AND** the second card SHALL represent "便捷" with user-friendly features
- **AND** the third card SHALL represent "有趣" with gamification elements
- **AND** each card SHALL have an icon, title, and description

#### Scenario: Features section includes hover effects

- **GIVEN** the Features section is displayed
- **WHEN** a user hovers over a feature card
- **THEN** the card SHALL display a visual hover effect
- **AND** the effect SHALL use CSS transitions
- **AND** the effect SHALL not cause layout shifts

#### Scenario: Features section is responsive

- **GIVEN** the Features section is displayed
- **WHEN** viewed on different screen sizes
- **THEN** on desktop (>1024px) cards SHALL be displayed in 3 columns
- **AND** on tablet (768px-1024px) cards SHALL be displayed in 2 columns with one card wrapping
- **AND** on mobile (<768px) cards SHALL be stacked vertically in a single column

---

### Requirement: OpenSpec Workflow Animation

The homepage MUST include an animated visualization of the OpenSpec workflow that demonstrates the flow from Idea to Proposal to Tasks to Archive with automatic playback and interactive hover states.

#### Scenario: Animation displays all workflow stages

- **GIVEN** a user scrolls to the OpenSpec Animation section
- **WHEN** the animation loads
- **THEN** four nodes SHALL be displayed: "💡 Idea", "📄 Proposal", "⚙️ Tasks", "✅ Archive"
- **AND** arrows SHALL connect each node in sequence
- **AND** each node SHALL have an icon and label
- **AND** the layout SHALL clearly show the progression from left to right (or top to bottom on mobile)

#### Scenario: Animation plays automatically in a loop

- **GIVEN** the OpenSpec Animation is loaded
- **WHEN** the user is not interacting with the animation
- **THEN** the animation SHALL automatically cycle through each stage
- **AND** each stage SHALL highlight in sequence with a glow effect
- **AND** arrows SHALL animate to show flow direction
- **AND** the cycle SHALL repeat continuously

#### Scenario: Animation pauses on hover and shows details

- **GIVEN** the OpenSpec Animation is playing
- **WHEN** a user hovers over any node
- **THEN** the automatic playback SHALL pause
- **AND** a tooltip SHALL appear with detailed information about that stage
- **AND** the node SHALL remain highlighted
- **AND** when the user moves the mouse away, playback SHALL resume

#### Scenario: Animation is responsive

- **GIVEN** the OpenSpec Animation is displayed
- **WHEN** viewed on different screen sizes
- **THEN** on desktop (>1024px) nodes SHALL be arranged horizontally
- **AND** on tablet and mobile (<1024px) nodes SHALL be arranged vertically
- **AND** arrow directions SHALL adjust to the layout (horizontal vs vertical)
- **AND** all elements SHALL remain clearly visible on mobile screens

#### Scenario: Animation performance is optimized

- **GIVEN** the OpenSpec Animation is running
- **WHEN** the animation plays
- **THEN** the animation SHALL use CSS transforms for position changes
- **AND** the animation SHALL use opacity for fade effects
- **AND** the animation frame rate SHALL remain at 60fps on modern devices
- **AND** the animation SHALL respect prefers-reduced-motion media query

---

### Requirement: Homepage Showcase Section

The homepage MUST include a Showcase section that displays actual product screenshots from the `static/img/home/` directory to demonstrate PCode's features in action.

#### Scenario: Showcase section displays product screenshots

- **GIVEN** a user scrolls to the Showcase section
- **WHEN** the section loads
- **THEN** screenshots SHALL be displayed in a responsive grid
- **AND** screenshots SHALL include: 亮色主题主界面.png, 暗色主题主界面.png
- **AND** screenshots SHALL include: 实时token消耗报告.png, 每日成就报告.png
- **AND** screenshots SHALL include: 使用 AI 的效率提升报告.png, 每日编写代码获得的成就.png
- **AND** each screenshot SHALL have a descriptive alt text in Chinese

#### Scenario: Showcase section uses lazy loading

- **GIVEN** the Showcase section contains multiple images
- **WHEN** the page initially loads
- **THEN** images SHALL use the native `loading="lazy"` attribute
- **AND** images SHALL load as the user scrolls near them
- **AND** initial page load SHALL NOT be blocked by image loading

#### Scenario: Showcase section has hover effects

- **GIVEN** the Showcase section is displayed
- **WHEN** a user hovers over a screenshot
- **THEN** the image SHALL display a subtle scale effect
- **AND** the effect SHALL use CSS transitions
- **AND** the effect SHALL not cause layout shifts

#### Scenario: Showcase section is responsive

- **GIVEN** the Showcase section is displayed
- **WHEN** viewed on different screen sizes
- **THEN** on desktop (>1024px) screenshots SHALL be displayed in 2 columns
- **AND** on tablet (768px-1024px) screenshots SHALL be displayed in 2 columns
- **AND** on mobile (<768px) screenshots SHALL be displayed in a single column
- **AND** images SHALL scale to fit their container

---

### Requirement: Homepage Quick Start Section

The homepage MUST include a Quick Start section at the bottom that provides navigation links to key documentation for new users.

#### Scenario: Quick Start section displays navigation links

- **GIVEN** a user scrolls to the bottom of the homepage
- **WHEN** the Quick Start section is displayed
- **THEN** the section SHALL include a link to "安装指南"
- **AND** the section SHALL include a link to "创建项目"
- **AND** the section SHALL include a link to "开始编码"
- **AND** all links SHALL use the same button style as the Hero section

#### Scenario: Quick Start links navigate correctly

- **GIVEN** the Quick Start section is displayed
- **WHEN** a user clicks on any link
- **THEN** the link SHALL navigate to the correct documentation page
- **AND** the navigation SHALL use client-side routing (no full page reload)
- **AND** the target page SHALL load successfully

---

### Requirement: Animation Library Integration

The documentation site MUST integrate Framer Motion or a similar animation library to support smooth, performant animations on the homepage.

#### Scenario: Animation library is installed

- **GIVEN** a developer runs `npm install` after adding the dependency
- **WHEN** the installation completes
- **THEN** `framer-motion` SHALL be listed in package.json dependencies
- **AND** TypeScript types SHALL be available for the library
- **AND** no peer dependency warnings SHALL be displayed

#### Scenario: Animation library components work correctly

- **GIVEN** Framer Motion is installed
- **WHEN** a component uses `motion` from framer-motion
- **THEN** the component SHALL render without errors
- **AND** animations SHALL execute smoothly
- **AND** TypeScript SHALL provide autocomplete for animation props

#### Scenario: Animation library does not block initial render

- **GIVEN** the homepage uses Framer Motion
- **WHEN** the page initially loads
- **THEN** the critical content SHALL be visible immediately
- **AND** animations SHALL enhance the content after initial render
- **AND** the First Contentful Paint (FCP) SHALL not be significantly delayed

---

### Requirement: Homepage Responsive Design

The homepage MUST be fully responsive and provide an optimal viewing experience across desktop, tablet, and mobile devices.

#### Scenario: Homepage adapts to desktop screens

- **GIVEN** a user views the homepage on a desktop screen (>1024px)
- **WHEN** the page loads
- **THEN** all sections SHALL use multi-column layouts where appropriate
- **AND** the OpenSpec animation SHALL display horizontally
- **AND** screenshots SHALL display in 2 columns
- **AND** all content SHALL be properly spaced

#### Scenario: Homepage adapts to tablet screens

- **GIVEN** a user views the homepage on a tablet screen (768px-1024px)
- **WHEN** the page loads
- **THEN** feature cards SHALL display in 2 columns
- **AND** the OpenSpec animation SHALL display vertically
- **AND** screenshots SHALL display in 2 columns
- **AND** all text SHALL remain readable without horizontal scrolling

#### Scenario: Homepage adapts to mobile screens

- **GIVEN** a user views the homepage on a mobile screen (<768px)
- **WHEN** the page loads
- **THEN** all sections SHALL use single-column layout
- **AND** feature cards SHALL stack vertically
- **AND** the OpenSpec animation SHALL display vertically with simplified styling
- **AND** screenshots SHALL display in a single column
- **AND** all buttons SHALL be easily tappable (minimum 44px height)

---

### Requirement: Homepage Accessibility

The homepage MUST meet web accessibility standards to ensure users with disabilities can effectively navigate and understand the content.

#### Scenario: All images have alt text

- **GIVEN** the homepage contains images (screenshots, icons)
- **WHEN** a screen reader encounters an image
- **THEN** every image SHALL have a descriptive alt attribute
- **AND** alt text SHALL be in Chinese for Chinese-language content
- **AND** decorative images SHALL have empty alt text (alt="")

#### Scenario: Homepage is keyboard navigable

- **GIVEN** a user navigates the homepage using only a keyboard
- **WHEN** the user presses Tab to move focus
- **THEN** all interactive elements SHALL receive focus in a logical order
- **AND** focus indicators SHALL be clearly visible
- **AND** all buttons and links SHALL be activatable via keyboard

#### Scenario: Homepage has sufficient color contrast

- **GIVEN** the homepage is displayed
- **WHEN** color contrast is evaluated
- **THEN** all text SHALL meet WCAG AA contrast requirements (4.5:1 for normal text)
- **AND** color SHALL NOT be the only means of conveying information
- **AND** the page SHALL be readable in both light and dark themes

#### Scenario: Animation respects user preferences

- **GIVEN** a user has set their operating system to prefer reduced motion
- **WHEN** the homepage loads
- **THEN** the OpenSpec animation SHALL either disable motion or provide a static alternative
- **AND** the page SHALL still convey all information without animation
- **AND** prefers-reduced-motion media query SHALL be honored


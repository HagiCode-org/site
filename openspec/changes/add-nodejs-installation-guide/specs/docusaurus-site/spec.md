## ADDED Requirements

### Requirement: Node.js Installation Guide

The documentation site MUST provide a comprehensive guide for installing Node.js runtime environment across all major operating systems (Windows, macOS, Linux) as part of the Related Software Installation category. The guide SHALL cover multiple installation methods including official installers, package managers, and version management tools, with clear version requirements (Node.js >=18.0).

#### Scenario: User accesses Node.js installation guide

- **GIVEN** the user has navigated to the Related Software Installation category
- **WHEN** the user clicks on the Node.js subdirectory (positioned alongside PostgreSQL and Claude Code)
- **THEN** an installation guide titled "安装 Node.js" MUST be accessible
- **AND** the guide MUST appear as the first document in the Node.js subdirectory

#### Scenario: Guide includes complete installation workflow for all platforms

- **GIVEN** the user is reading the Node.js installation guide
- **WHEN** the user views the document content
- **THEN** the guide MUST include the following sections:
  - Introduction and version requirements (Node.js >=18.0)
  - Windows installation methods (official installer, winget)
  - macOS installation methods (official installer, Homebrew)
  - Linux installation methods (Ubuntu/Debian, CentOS/RHEL, Fedora)
  - Version manager installation (nvm, fnm)
  - Installation verification steps
  - Troubleshooting section
- **AND** each section MUST use Docusaurus Tabs and TabItem components to organize platform-specific content
- **AND** code blocks MUST use appropriate syntax highlighting (bash, powershell)

#### Scenario: Tabs component organizes cross-platform content

- **GIVEN** the installation guide includes instructions for multiple operating systems
- **WHEN** a user views the installation guide
- **THEN** the guide MUST use `<Tabs>` and `<TabItem>` components to separate Windows, macOS, and Linux instructions
- **AND** each platform MUST have its own `<TabItem>` with `value` attribute set to "win", "mac", or "linux"
- **AND** each `<TabItem>` MUST have a `label` attribute set to "Windows", "macOS", or "Linux"
- **AND** users can click between platform tabs to view only their operating system's instructions

#### Scenario: Code blocks maintain syntax highlighting

- **GIVEN** a TabItem contains command-line instructions
- **WHEN** the TabItem includes a code block for bash or PowerShell commands
- **THEN** the code block MUST use appropriate language tags (`bash`, `powershell`)
- **AND** Prism.js syntax highlighting MUST be applied correctly within the TabItem
- **AND** the code block MAY display a title attribute for clarity (e.g., `title="使用 winget 安装 Node.js"`)

#### Scenario: Version requirements are clearly stated

- **GIVEN** the user is reading the Node.js installation guide
- **WHEN** the user views the introduction section
- **THEN** the guide MUST clearly state that PCode requires Node.js >=18.0
- **AND** the guide MUST explain how to verify the installed Node.js version
- **AND** the guide MUST provide a command to check the version: `node --version`

#### Scenario: Version manager options are provided

- **GIVEN** the user wants to install Node.js using a version manager
- **WHEN** the user reaches the version manager section
- **THEN** the guide MUST provide instructions for nvm (Node Version Manager)
- **AND** the guide MUST provide instructions for fnm (Fast Node Manager)
- **AND** the guide MUST explain the benefits of using version managers
- **AND** the guide MUST include platform-specific instructions for each version manager

#### Scenario: Installation verification steps are included

- **GIVEN** the user has completed the Node.js installation
- **WHEN** the user reaches the verification section
- **THEN** the guide MUST provide commands to verify Node.js installation: `node --version`
- **AND** the guide MUST provide commands to verify npm installation: `npm --version`
- **AND** the guide MUST explain what the expected output should look like
- **AND** the guide MUST include troubleshooting steps if verification fails

#### Scenario: Troubleshooting section addresses common issues

- **GIVEN** the user encounters issues during installation
- **WHEN** the user reads the troubleshooting section
- **THEN** the guide MUST address common issues such as:
  - Version too old (below 18.0)
  - PATH not configured correctly
  - Permission issues on Linux/macOS
  - Windows-specific issues (PowerShell execution policy)
- **AND** each issue MUST include clear resolution steps
- **AND** the guide MUST provide links to official Node.js documentation for further help

#### Scenario: Document follows naming conventions

- **GIVEN** the `installation.md` file exists in the Node.js subdirectory
- **WHEN** the file is validated
- **THEN** the file MUST use kebab-case naming
- **AND** frontmatter MUST include `title` and `description` properties in Chinese
- **AND** the file MUST use valid markdown syntax
- **AND** the file MUST import Tabs and TabItem components from `@theme/Tabs` and `@theme/TabItem`

#### Scenario: Document integrates with existing structure

- **GIVEN** the Node.js subdirectory exists in Related Software Installation
- **WHEN** the user views the documentation sidebar
- **THEN** the Node.js subdirectory MUST appear alongside other software guides (PostgreSQL, Claude Code) at the same directory level
- **AND** no changes to `sidebars.ts` MUST be required (autogenerated directory)
- **AND** the document MUST be automatically included in navigation
- **AND** the Node.js category MUST have proper `_category_.json` metadata

#### Scenario: Chinese translation completeness

- **GIVEN** the PCode documentation site is Chinese-only
- **WHEN** the Node.js installation guide is accessed
- **THEN** all content MUST be in Chinese
- **AND** technical terms MUST use consistent Chinese terminology or English where standard
- **AND** the document title MUST be "安装 Node.js"
- **AND** code blocks and commands MUST remain in English

### Requirement: Node.js Subdirectory Category Structure

The Related Software Installation category MUST include a Node.js subdirectory with proper category metadata configuration, positioned at the same directory level as other software guides like PostgreSQL and Claude Code.

#### Scenario: Node.js subdirectory exists

- **GIVEN** the `docs/related-software-installation/` directory exists
- **WHEN** listing directory contents
- **THEN** a `nodejs/` subdirectory MUST exist alongside `postgresql/` and `claude-code/`
- **AND** the subdirectory MUST contain `_category_.json` with metadata

#### Scenario: Node.js category metadata configured

- **GIVEN** the `docs/related-software-installation/nodejs/_category_.json` file exists
- **WHEN** the file is parsed by Docusaurus
- **THEN** the category displays with the label "Node.js"
- **AND** the category position is configured appropriately
- **AND** the category integrates with the autogenerated sidebar structure

#### Scenario: Extensibility for future Node.js content

- **GIVEN** the Node.js subdirectory structure exists
- **WHEN** contributors need to add more Node.js related documentation
- **THEN** new documents can be added to the `nodejs/` directory
- **AND** no manual sidebar configuration updates are required
- **AND** the structure remains consistent with other software subdirectories

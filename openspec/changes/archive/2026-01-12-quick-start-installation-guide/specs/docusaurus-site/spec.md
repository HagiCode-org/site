# docusaurus-site Specification Delta

## ADDED Requirements

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

### Requirement: Installation Guide Documentation

The documentation site MUST include a comprehensive installation guide that provides step-by-step instructions for setting up PCode on a local machine.

#### Scenario: Installation guide exists in English

**Given** the documentation structure exists
**When** accessing the file `docs/quick-start/installation.md`
**Then** the file contains frontmatter with title "Installation" and a description
**And** the document is formatted as valid markdown

#### Scenario: Installation guide exists in Chinese

**Given** the Chinese documentation structure exists
**When** accessing the file `i18n/zh-CN/docusaurus-plugin-content-docs/current/quick-start/installation.md`
**Then** the file contains frontmatter with title "安装指南" and a Chinese description
**And** the document is formatted as valid markdown

#### Scenario: Installation guide covers prerequisites

**Given** a user is reading the installation guide
**When** they review the Prerequisites section
**Then** the document lists all required dependencies:
  - PostgreSQL (with Docker installation instructions)
  - Node.js (>= 18.0)
  - npm package manager
  - OpenSpec CLI
  - Claude Code CLI
**And** installation commands are provided for each dependency

#### Scenario: Installation guide provides environment verification

**Given** a user has completed prerequisite installation
**When** they follow the Environment Verification section
**Then** an environment check script is provided
**And** the script verifies all dependencies are correctly installed
**And** clear error messages guide the user if any dependency is missing

#### Scenario: Installation guide covers platform-specific deployment

**Given** a user is deploying the PCode software package
**When** they reference the Deploy Software Package section
**Then** instructions are provided for Windows, Linux, and macOS
**And** each platform includes:
  - Package extraction steps
  - Recommended directory locations
  - Platform-specific commands or file paths

#### Scenario: Installation guide covers database configuration

**Given** a user has deployed the software package
**When** they follow the Configure Database Connection section
**Then** instructions explain how to configure the database connection in the `config` directory
**And** default credentials (postgres/postgres) are documented
**And** the user knows when configuration can be skipped (using defaults)

#### Scenario: Installation guide covers service startup

**Given** a user has configured the database connection
**When** they follow the Start Service section
**Then** Windows users are instructed to run `start.bat`
**And** Linux/macOS users are instructed to run `start.sh`
**And** the document explains that service health checks run automatically

#### Scenario: Installation guide covers access instructions

**Given** a user has started the PCode service
**When** they follow the Access Interface section
**Then** the default URL is documented (http://127.0.0.1:34567)
**And** instructions explain how to open the URL in a browser
**And** the user knows what to expect when the interface loads

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

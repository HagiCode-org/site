## ADDED Requirements

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

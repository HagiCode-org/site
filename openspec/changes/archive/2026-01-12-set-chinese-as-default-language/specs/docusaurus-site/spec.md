## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Chinese Documentation Structure

**Reason**: This requirement is being removed because Chinese content will no longer be stored in the `i18n/zh-CN/docusaurus-plugin-content-docs/current/` directory. Instead, Chinese content will be the default and only content in the `docs/` directory.

**Migration**: All Chinese documentation has been moved from `i18n/zh-CN/docusaurus-plugin-content-docs/current/` to `docs/`. The `i18n/` directory is no longer needed and has been removed from the repository.

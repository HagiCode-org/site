# docusaurus-site Specification Delta: Remove Docker Compose Builder Integration

## REMOVED Requirements

### Requirement: Docker Compose Generator Page Integration

The documentation site SHALL provide an integrated Docker Compose Generator page for generating docker-compose.yml configurations.

**REMOVAL JUSTIFICATION**: The Docker Compose Builder has migrated to a standalone site (https://hagicode-org.github.io/docker-compose-builder/) with independent versioning and release cycles. Maintaining the integration creates unnecessary coupling and maintenance burden.

#### Scenario: User accesses Docker Compose Generator from navbar

- **REMOVED**: WHEN user clicks "Docker Compose 生成器" link in the navbar
- **REMOVED**: THEN the user navigates to `/docker-compose-generator` route
- **REMOVED**: AND the interactive generator page loads
- **REMOVED**: AND user can configure Hagicode deployment options

#### Scenario: User generates docker-compose.yml configuration

- **REMOVED**: WHEN user fills in the generator form with deployment preferences
- **REMOVED**: THEN system generates valid docker-compose.yml YAML
- **REMOVED**: AND user can preview and copy the configuration
- **REMOVED**: AND configuration is persisted to LocalStorage

#### Scenario: User selects image source (Docker Hub or ACR)

- **REMOVED**: WHEN user chooses between Docker Hub and Azure Container Registry
- **REMOVED**: THEN generated YAML includes appropriate image address
- **REMOVED**: AND image source selection persists across sessions
- **REMOVED**: AND preview updates in real-time

---

## MODIFIED Requirements

### Requirement: Navigation Structure

The documentation site SHALL provide clear navigation to core documentation sections and external resources.

#### Scenario: Navbar links point to documentation sections

- **WHEN** user views the site navigation bar
- **THEN** the navbar displays links to: Docs, 博客, QQ群, 下载安装包, Docker Hub
- **AND** the navbar does NOT include a link to `/docker-compose-generator`
- **AND** all navbar items are functional and accessible

#### Scenario: Footer provides links to external resources

- **WHEN** user scrolls to the page footer
- **THEN** the footer includes a "Tools" section (if implemented)
- **AND** the footer includes a link to the standalone Docker Compose Builder
- **AND** external links open in new tabs
- **AND** link text clearly indicates the destination

---

### Requirement: Docker Compose Deployment Documentation

The installation documentation SHALL guide users through Docker Compose deployment of Hagicode and reference the standalone Docker Compose Builder tool.

#### Scenario: User reads Docker Compose deployment guide

- **WHEN** user navigates to Installation → Docker Compose Deployment
- **THEN** the documentation includes a prominent note about the standalone Docker Compose Builder
- **AND** the note explains that the Builder is now a separate tool
- **AND** the note provides the URL: https://hagicode-org.github.io/docker-compose-builder/
- **AND** the note lists benefits of using the standalone version

#### Scenario: User clicks link to Docker Compose Builder

- **WHEN** user clicks any link to the Docker Compose Builder in the documentation
- **THEN** the link opens the standalone site: https://hagicode-org.github.io/docker-compose-builder/
- **AND** the link opens in a new tab
- **AND** no internal links point to `/docker-compose-generator`
- **AND** link text indicates the standalone nature (e.g., "Docker Compose Builder (独立站点)")

#### Scenario: User follows quick start instructions

- **WHEN** user follows the "Generate Docker Compose configuration" section
- **THEN** the documentation directs them to the standalone Builder site
- **AND** all configuration instructions reference the standalone tool
- **AND** the documentation explains how to use the generated configuration

---

### Requirement: Migration and Transition Support

The documentation site SHALL provide clear guidance to users about the migration from integrated to standalone Docker Compose Builder.

#### Scenario: Documentation includes migration notice

- **WHEN** user views the Docker Compose deployment documentation
- **THEN** a prominent callout or note explains the change
- **AND** the notice states that the Builder is now a standalone tool
- **AND** the notice provides the new URL
- **AND** the note explains the benefits of the standalone version

#### Scenario: User encounters old bookmark or link

- **WHEN** user attempts to access `/docker-compose-generator` directly
- **THEN** the site returns a 404 error page
- **AND** the 404 page provides guidance to visit the standalone site
- **AND** the 404 page includes a link back to the documentation
- **AND** optional: custom 404 message explains the migration

---

## ADDED Requirements

### Requirement: External Tool References

The documentation site SHALL include references to external tools and resources that complement Hagicode but are not part of the core documentation.

#### Scenario: Footer links to external tools

- **WHEN** footer includes a "Tools" section (optional implementation)
- **THEN** the section contains links to external tools
- **AND** links include the standalone Docker Compose Builder
- **AND** each link has a clear label describing the tool
- **AND** external links are visually distinct from internal links

#### Scenario: User accesses external tool from footer

- **WHEN** user clicks a link in the footer's "Tools" section
- **THEN** the external site opens in a new tab
- **AND** the user can easily return to the documentation
- **AND** the documentation site remains open in the original tab

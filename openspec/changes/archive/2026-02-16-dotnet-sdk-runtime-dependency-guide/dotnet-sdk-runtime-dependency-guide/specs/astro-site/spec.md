## ADDED Requirements

### Requirement: Related Software Installation Documentation Focus

Documentation pages in the `related-software-installation/` category MUST focus on runtime dependency installation for end users, not development environment setup.

#### Scenario: .NET SDK documentation is runtime-focused

- **GIVEN** a user navigates to `/docs/related-software-installation/dotnet/install-dotnet-sdk`
- **WHEN** the page loads
- **THEN** the document MUST be titled "安装 .NET SDK"
- **AND** the description MUST emphasize runtime dependency rather than development environment
- **AND** the content MUST NOT include development-related commands such as `dotnet new`, `dotnet build`, or `dotnet run`
- **AND** the content MUST NOT include project creation examples
- **AND** the content MUST NOT include version management topics like global.json
- **AND** the content MUST focus on installation methods and basic verification (`dotnet --version`)

#### Scenario: Related software installation documentation structure

- **GIVEN** a documentation page exists in `related-software-installation/` category
- **WHEN** the page is rendered
- **THEN** the page MUST include:
  - Brief introduction explaining the software is a runtime dependency
  - Installation instructions for Windows, macOS, and Linux
  - Basic verification steps
  - Common troubleshooting (PATH issues, version check)
  - Optional: mirror/acceleration for China users (simplified)
- **AND** the page MUST NOT include:
  - Development tool introductions (CLI tools, compilers, templates)
  - Development command examples
  - Version management for development
  - Test project creation for verification

#### Scenario: Documentation metadata reflects runtime dependency focus

- **GIVEN** a related software installation document has frontmatter
- **WHEN** the frontmatter is inspected
- **THEN** the `title` field MUST NOT include "development environment" or "开发环境"
- **AND** the `description` field MUST emphasize runtime dependency installation
- **AND** Tip components (if any) MUST specify version requirements for running Hagicode, not for development

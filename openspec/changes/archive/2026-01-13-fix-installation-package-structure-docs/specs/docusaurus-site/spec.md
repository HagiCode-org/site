# docusaurus-site Specification Delta

## MODIFIED Requirements

### Requirement: Installation Guide Package Structure Documentation

The installation guide (`docs/quick-start/installation.md`) MUST include a "软件包结构" (Package Structure) section after the "部署软件包" (Deploy Package) section that provides users with a clear overview of the extracted package directory structure, key file locations, configuration file format (YAML), and platform-specific variations.

#### Scenario: Package structure section appears after deployment section

- **GIVEN** the user is reading the installation guide
- **WHEN** the user reaches the end of the "部署软件包" section
- **THEN** a new "软件包结构" section MUST be displayed immediately after
- **AND** the section MUST provide a comprehensive overview of the package contents
- **AND** the section MUST help users understand where key files are located

#### Scenario: Package structure uses Tabs for platform-specific views

- **GIVEN** the package structure section is displayed
- **WHEN** a user views the section
- **THEN** the section MUST use `<Tabs>` and `<TabItem>` components to separate Windows, macOS, and Linux directory structures
- **AND** each platform MUST have its own `<TabItem>` with `value` attribute set to "win", "mac", or "linux"
- **AND** each `<TabItem>` MUST have a `label` attribute set to "Windows", "macOS", or "Linux"
- **AND** users can click between platform tabs to view their operating system's package structure

#### Scenario: Directory structure is displayed with ASCII tree format

- **GIVEN** a user has selected their platform tab
- **WHEN** viewing the directory structure
- **THEN** an ASCII tree diagram MUST show the complete package directory structure
- **AND** the tree MUST include all major directories and files:
  - `config/` - User configuration override directory
  - `config/appsettings.yml` - User configuration file (YAML format, highest priority)
  - `config/README.md` - Configuration system documentation
  - `lib/` - Application dependencies and runtime files
  - `lib/PCode.Web.dll` - Main application executable
  - `lib/appsettings.yml` - Base configuration
  - `lib/appsettings.Production.yml` - Production environment configuration
  - `start.sh` (Linux/macOS) or `start.bat` (Windows) - Startup script
  - `README.md` - Package documentation (Chinese)
  - `README_en.md` - Package documentation (English)
- **AND** the tree format MUST be easy to read and understand

#### Scenario: Configuration file format and location are clearly specified

- **GIVEN** the user is reading the package structure section
- **WHEN** the user looks for configuration file information
- **THEN** the section MUST clearly state that configuration files use YAML format (`.yml`), NOT JSON format (`.json`)
- **AND** the section MUST clearly state that user configuration file `appsettings.yml` is located in the `config/` directory
- **AND** the section MUST explain the configuration loading priority (from low to high):
  1. `lib/appsettings.yml` (base configuration)
  2. `lib/appsettings.Production.yml` (production environment)
  3. `config/appsettings.yml` (user overrides, highest priority)
- **AND** the section MUST reference `config/README.md` for detailed configuration documentation
- **AND** the section MUST reference the later "配置数据库连接" section for database configuration instructions

#### Scenario: Startup script locations are documented

- **GIVEN** the user is reading the package structure section
- **WHEN** the user looks for startup script information
- **THEN** the section MUST specify that `start.sh` is used for Linux/macOS
- **AND** the section MUST specify that `start.bat` is used for Windows
- **AND** the section MUST note that the script is located at the root of the extracted package
- **AND** the section MUST explain that the script changes directory to `lib/` and runs `dotnet PCode.Web.dll`
- **AND** the section MUST reference the later "启动服务" section for detailed startup instructions

#### Scenario: File and directory purposes are explained

- **GIVEN** the user is reading the package structure section
- **WHEN** the user views the directory structure
- **THEN** each major directory and file MUST include a brief explanation of its purpose
- **AND** the explanation MUST be in Chinese
- **AND** the explanation MUST help users understand what each component does

#### Scenario: lib/ directory contents are described

- **GIVEN** the user is viewing the package structure
- **WHEN** the user sees the `lib/` directory
- **THEN** the section MUST explain that `lib/` contains application dependencies and runtime files
- **AND** the section MUST specify that `PCode.Web.dll` is the main application executable
- **AND** the section MUST note that users typically do not need to modify contents in this directory
- **AND** the section MAY mention that the directory size may be large due to included dependencies

#### Scenario: config/ directory purpose is explained

- **GIVEN** the user is viewing the package structure
- **WHEN** the user sees the `config/` directory
- **THEN** the section MUST explain that `config/` is for user configuration overrides
- **AND** the section MUST explain that files in `config/` take priority over files in `lib/`
- **AND** the section MUST mention that `config/README.md` contains detailed configuration documentation

#### Scenario: Build validation passes with updated installation guide

- **GIVEN** the installation guide has been updated with the package structure section
- **WHEN** `npm run build` is executed
- **THEN** the build MUST complete successfully without MDX parsing errors
- **AND** `npm run typecheck` MUST pass without TypeScript errors
- **AND** the build MUST not report any broken links
- **AND** the package structure section MUST render correctly in the built site

#### Scenario: Platform-specific differences are highlighted

- **GIVEN** the user is comparing package structures across platforms
- **WHEN** switching between platform tabs
- **THEN** any platform-specific differences MUST be clearly visible
- **AND** differences MUST include script file extensions (`.sh` vs `.bat`)
- **AND** any platform-specific configuration files MUST be noted

#### Scenario: Package structure section integrates with existing flow

- **GIVEN** the user is following the installation guide sequentially
- **WHEN** the user completes the "部署软件包" section
- **THEN** the package structure section MUST provide context for the next sections
- **AND** the section MUST reference the "配置数据库连接" section for database configuration details
- **AND** the section MUST reference the "启动服务" section for startup script usage
- **AND** the section MUST reference `config/README.md` for detailed configuration information

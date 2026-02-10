# monorepo-structure Specification Delta

## ADDED Requirements

### Requirement: Version Data Management in MonoRepo Architecture

The MonoRepo architecture SHALL define a clear strategy for managing version data across multiple applications.

#### Scenario: Version data storage location

- **GIVEN** the MonoRepo structure with apps and packages directories
- **WHEN** storing version data for Hagicode Desktop releases
- **THEN** the version data SHALL be stored in `apps/docs/public/version-index.json`
- **AND** this location SHALL be the single source of truth for version information

#### Scenario: Version data access from shared package

- **GIVEN** the shared package at `packages/shared`
- **WHEN** an application needs to access version data
- **THEN** the shared package SHALL provide utility functions in `packages/shared/src/version.ts`
- **AND** these functions SHALL read from `apps/docs/public/version-index.json`
- **AND** the functions SHALL be exported from `packages/shared/src/index.ts`

#### Scenario: Version data synchronization

- **GIVEN** multiple applications (docs and website) need version information
- **WHEN** Version Monitor workflow updates the version data
- **THEN** only `apps/docs/public/version-index.json` SHALL be updated
- **AND** the Website application SHALL access version data through the shared package
- **AND** there SHALL NOT be duplicate version files across applications

#### Scenario: Version Monitor workflow integration

- **GIVEN** the Version Monitor GitHub Actions workflow
- **WHEN** a new version is detected
- **THEN** the workflow SHALL create a PR updating `apps/docs/public/version-index.json`
- **AND** merging the PR SHALL trigger the Docs application deployment
- **AND** the deployed Docs application SHALL include the updated version file

#### Scenario: Version utility functions

- **GIVEN** the shared package provides version utilities
- **WHEN** importing from `@pcode-docs/shared`
- **THEN** the following functions SHALL be available:
  - `getVersionIndex()` - Returns the complete version index data
  - `getLatestVersion()` - Returns the latest version string
- **AND** all functions SHALL be typed with TypeScript
- **AND** all functions SHALL include JSDoc documentation

#### Scenario: Website application version access

- **GIVEN** the Website application needs to display version information
- **WHEN** the application imports version utilities from `@pcode-docs/shared`
- **THEN** the import SHALL resolve correctly
- **AND** the functions SHALL return version data from Docs application
- **AND** the Website application SHALL NOT maintain its own version file

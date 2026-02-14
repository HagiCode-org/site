## ADDED Requirements

### Requirement: Semantic Version Comparison

The system SHALL provide semantic version comparison utilities that correctly compare version strings following Semantic Versioning 2.0.0 specification, including support for pre-release identifiers.

#### Scenario: Compare patch versions with two-digit numbers

- **WHEN** comparing version `v0.1.9` with version `v0.1.10`
- **THEN** the system SHALL correctly identify `v0.1.10` as greater than `v0.1.9`

#### Scenario: Compare minor versions with two-digit numbers

- **WHEN** comparing version `v1.9.9` with version `v1.10.0`
- **THEN** the system SHALL correctly identify `v1.10.0` as greater than `v1.9.9`

#### Scenario: Compare major versions

- **WHEN** comparing version `v1.99.99` with version `v2.0.0`
- **THEN** the system SHALL correctly identify `v2.0.0` as greater than `v1.99.99`

#### Scenario: Compare stable version with pre-release version

- **WHEN** comparing version `v1.0.0` with version `v1.0.0-beta`
- **THEN** the system SHALL correctly identify `v1.0.0` as greater than `v1.0.0-beta`

#### Scenario: Compare pre-release versions with different identifiers

- **WHEN** comparing version `v1.0.0-alpha` with version `v1.0.0-beta`
- **THEN** the system SHALL correctly identify `v1.0.0-beta` as greater than `v1.0.0-alpha`

#### Scenario: Compare pre-release versions with numeric identifiers

- **WHEN** comparing version `v1.0.0-beta.1` with version `v1.0.0-beta.2`
- **THEN** the system SHALL correctly identify `v1.0.0-beta.2` as greater than `v1.0.0-beta.1`

#### Scenario: Equal versions comparison

- **WHEN** comparing version `v1.2.3` with version `v1.2.3`
- **THEN** the system SHALL return 0 indicating equal versions

#### Scenario: Version without 'v' prefix

- **WHEN** comparing version `1.0.0` with version `1.0.1`
- **THEN** the system SHALL correctly parse and compare the versions

### Requirement: Version Parsing Utilities

The system SHALL provide utilities to parse semantic version strings into structured components (major, minor, patch, pre-release identifiers) for programmatic access.

#### Scenario: Parse standard version

- **WHEN** parsing version string `v1.2.3`
- **THEN** the system SHALL return `{ major: 1, minor: 2, patch: 3, prerelease: [] }`

#### Scenario: Parse pre-release version

- **WHEN** parsing version string `v1.2.3-beta.1`
- **THEN** the system SHALL return `{ major: 1, minor: 2, patch: 3, prerelease: ['beta', 1] }`

#### Scenario: Parse version with complex pre-release

- **WHEN** parsing version string `v2.0.0-rc.1.preview.2`
- **THEN** the system SHALL return `{ major: 2, minor: 0, patch: 0, prerelease: ['rc', 1, 'preview', 2] }`

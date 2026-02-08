## ADDED Requirements

### Requirement: Version Monitor GitHub Actions Workflow
The system SHALL provide a GitHub Actions workflow that monitors the official website for version changes and automatically creates pull requests when new versions are detected.

#### Scenario: Workflow triggers on schedule every 30 minutes
- **WHEN** the scheduled time elapses (every 30 minutes)
- **THEN** the version monitor workflow is triggered
- **AND** the workflow executes the version monitoring script

#### Scenario: Workflow supports manual triggering
- **WHEN** a user manually triggers the workflow from GitHub Actions UI
- **THEN** the version monitor workflow is triggered immediately
- **AND** the workflow executes the version monitoring script

#### Scenario: Workflow has necessary permissions
- **WHEN** the workflow runs
- **THEN** it has `contents: write` permission to create branches and commits
- **AND** it has `pull-requests: write` permission to create pull requests

### Requirement: HTTP Version Data Fetching
The version monitor script SHALL fetch version data from the official website URL using HTTP GET requests.

#### Scenario: Successfully fetch version data from official website
- **WHEN** the script sends an HTTP GET request to the configured source URL
- **AND** the server responds with a 200 OK status
- **AND** the response contains valid JSON data
- **THEN** the script extracts the version number from the response
- **AND** the version number is logged

#### Scenario: HTTP request fails with retry
- **WHEN** the HTTP request fails (network error, timeout, or non-200 status)
- **THEN** the script waits using exponential backoff (2^i * 1000ms)
- **AND** the script retries the request up to 3 times
- **AND** if all retries fail, an error is logged and the script exits gracefully

#### Scenario: HTTP request timeout handling
- **WHEN** the HTTP request exceeds the configured timeout (default: 30 seconds)
- **THEN** the request is aborted
- **AND** the script retries the request using exponential backoff
- **AND** a warning is logged for each timeout

#### Scenario: Invalid JSON response handling
- **WHEN** the HTTP response contains invalid or malformed JSON
- **THEN** an error is logged
- **AND** the script exits gracefully

### Requirement: Version State Persistence
The system SHALL persist version monitoring state in a JSON file stored in the repository.

#### Scenario: Initial state file creation
- **WHEN** the version monitor script runs for the first time
- **AND** no version state file exists
- **THEN** a new `.github/version-state.json` file is created
- **AND** it contains the initial state structure with null version values
- **AND** the source URL is recorded

#### Scenario: Version state update on check
- **WHEN** the script checks for version changes
- **THEN** the `lastCheckedTime` is updated to the current ISO 8601 timestamp
- **AND** the `checkCount` is incremented
- **AND** the state file is saved

#### Scenario: Version state persists after version change
- **WHEN** a new version is detected
- **THEN** the `lastCheckedVersion` is updated to the new version
- **AND** the state file is committed to the repository

#### Scenario: Version state data structure
- **WHEN** the version state file is read or written
- **THEN** it contains the following fields:
  - `lastCheckedVersion`: string or null
  - `lastCheckedTime`: ISO 8601 timestamp string or null
  - `lastDeployedVersion`: string or null
  - `lastDeployedTime`: ISO 8601 timestamp string or null
  - `sourceUrl`: string representing the version data source URL
  - `checkCount`: number representing total checks performed

### Requirement: Semver Version Comparison
The version monitor script SHALL compare version strings using semantic versioning (semver) rules.

#### Scenario: Versions are equal
- **WHEN** comparing version "1.2.3" with version "1.2.3"
- **THEN** the comparison returns 0 (equal)
- **AND** no pull request is created

#### Scenario: New version is greater
- **WHEN** comparing version "1.2.4" with version "1.2.3"
- **THEN** the comparison returns 1 (greater)
- **AND** a pull request is created for the new version

#### Scenario: New version is lesser
- **WHEN** comparing version "1.2.2" with version "1.2.3"
- **THEN** the comparison returns -1 (lesser)
- **AND** no pull request is created

#### Scenario: Version with 'v' prefix is handled
- **WHEN** the version string starts with 'v' (e.g., "v1.2.3")
- **THEN** the prefix is stripped before comparison
- **AND** the comparison is performed on the numeric parts only

### Requirement: Pull Request Creation
The system SHALL create a pull request when a new version is detected.

#### Scenario: Create PR for new version
- **WHEN** a new version is detected (version comparison > 0)
- **AND** no existing PR for this version is found
- **THEN** a new branch named `update-version-x.x.x` is created
- **AND** the version state file is updated with the new version
- **AND** the changes are committed to the branch
- **AND** the branch is pushed to the remote repository
- **AND** a pull request is created with title "chore: update version to x.x.x"
- **AND** the PR body includes version details and update instructions

#### Scenario: Skip PR creation when one exists
- **WHEN** a new version is detected
- **AND** an existing PR with the same version is found
- **THEN** no new PR is created
- **AND** the script logs that a PR already exists
- **AND** the script exits successfully

#### Scenario: PR title format
- **WHEN** a pull request is created for version "1.2.3"
- **THEN** the PR title is "chore: update version to 1.2.3"

#### Scenario: PR body content
- **WHEN** a pull request is created
- **THEN** the PR body includes:
  - A header section "## Version Update"
  - The new version number
  - The source URL
  - The timestamp of the check
  - A "### Changes" section describing the version state update
  - A "### Next Steps" section explaining the CI/CD deployment
  - A footer indicating the PR was auto-generated

### Requirement: Duplicate Pull Request Detection
The system SHALL check for existing pull requests before creating a new one.

#### Scenario: Query existing open pull requests
- **WHEN** checking for duplicate PRs
- **THEN** the GitHub API is queried for open pull requests
- **AND** only open PRs are considered

#### Scenario: Match PR by title
- **WHEN** comparing PR titles
- **THEN** a PR is considered a duplicate if its title matches "chore: update version to {version}"
- **AND** the version number must exactly match

#### Scenario: GitHub API failure handling
- **WHEN** the GitHub API request to list PRs fails
- **THEN** a warning is logged
- **AND** the script continues to attempt PR creation (fail-open behavior)

### Requirement: Configurable Source URL
The system SHALL support configuration of the version data source URL through environment variables or repository variables.

#### Scenario: Use GitHub repository variable
- **WHEN** the `VERSION_SOURCE_URL` repository variable is set
- **THEN** the workflow uses that URL for fetching version data
- **AND** the URL is logged in the workflow output

#### Scenario: Default URL when not configured
- **WHEN** the `VERSION_SOURCE_URL` repository variable is not set
- **THEN** the workflow defaults to "https://hagicode.com/desktop/index.json"
- **AND** the default URL is logged in the workflow output

#### Scenario: Environment variable overrides default
- **WHEN** the `VERSION_SOURCE_URL` environment variable is passed to the script
- **THEN** the script uses the provided URL instead of the default
- **AND** the configured URL is reflected in the version state file

### Requirement: Logging and Monitoring
The version monitor script SHALL provide detailed logging for debugging and monitoring.

#### Scenario: Log levels are used appropriately
- **WHEN** the script executes
- **THEN** `[INFO]` logs are used for normal operations
- **AND** `[WARN]` logs are used for retry attempts and non-fatal issues
- **AND** `[ERROR]` logs are used for failures and exceptions
- **AND** `[DEBUG]` logs are used for detailed execution information

#### Scenario: GitHub Actions output annotations
- **WHEN** a pull request is created
- **THEN** the workflow outputs `pr_created=true`
- **AND** the workflow outputs `pr_number={number}`
- **AND** the workflow outputs `pr_url={url}`

#### Scenario: Configuration display
- **WHEN** the workflow starts
- **THEN** the configuration is displayed including:
  - Source URL
  - Request timeout
  - Max retries
  - Repository name

#### Scenario: Result display after execution
- **WHEN** the workflow completes (success or failure)
- **THEN** the version state is displayed including:
  - Last checked version
  - Last checked time
  - Last deployed version
  - Check count

### Requirement: CI/CD Integration
The version monitor system SHALL integrate with the existing CI/CD pipeline for automatic deployment.

#### Scenario: PR merge triggers deployment
- **WHEN** a version update PR is merged to the main branch
- **THEN** the existing CI/CD deployment workflow is triggered
- **AND** the site is rebuilt with the updated version information
- **AND** the site is deployed to GitHub Pages and/or Azure Static Web Apps

#### Scenario: Deployment workflow uses version state
- **WHEN** the site is built after a version update
- **THEN** the desktop download page uses the version from `.github/version-state.json`
- **AND** users see the updated version information on the website

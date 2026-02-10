# github-integration Specification Delta

## ADDED Requirements

### Requirement: Version Monitor PR Creation

Version Monitor workflow SHALL automatically create Pull Requests when new Hagicode desktop application versions are detected, using the `gh` CLI approach for consistency with other automation workflows.

#### Scenario: Version detection and PR creation
- **WHEN** a new version is detected from the version source API
- **THEN** the workflow SHALL create a new Git branch named `version-update-{version}`
- **AND** the workflow SHALL commit the updated `public/version-index.json` file
- **AND** the workflow SHALL push the branch to remote repository
- **AND** the workflow SHALL create a Pull Request using `gh` CLI
- **AND** the PR SHALL be labeled with `automation` and `version` tags

#### Scenario: PR title and body format
- **WHEN** creating a version update PR
- **THEN** the PR title SHALL follow the format `chore: update version to {version}`
- **AND** the PR body SHALL include the new version number
- **AND** the PR body SHALL include the version source URL
- **AND** the PR body SHALL include the timestamp of version check
- **AND** the PR body SHALL describe the changes made
- **AND** the PR body SHALL include next steps after merging

#### Scenario: Duplicate PR handling
- **WHEN** a new version update PR is created
- **THEN** the workflow SHALL search for existing open PRs with the same purpose
- **AND** the workflow SHALL close any previous version update PRs
- **AND** the closed PRs SHALL include a comment explaining the closure

#### Scenario: No action when version unchanged
- **WHEN** the version check runs but no new version is detected
- **THEN** the workflow SHALL NOT create any Git branch
- **AND** the workflow SHALL NOT create any Pull Request
- **AND** the workflow SHALL exit successfully with no changes

#### Scenario: Workflow permissions
- **WHEN** the Version Monitor workflow runs
- **THEN** the workflow SHALL have `contents: write` permission
- **AND** the workflow SHALL have `pull-requests: write` permission
- **AND** the workflow SHALL use `GITHUB_TOKEN` for authentication

#### Scenario: Separation of concerns
- **WHEN** version monitoring is performed
- **THEN** the `version-monitor.js` script SHALL handle version detection and data update
- **AND** the workflow SHALL handle Git operations and PR creation
- **AND** the script SHALL output `update_needed` and `new_version` for workflow consumption

#### Scenario: Error handling
- **WHEN** PR creation fails
- **THEN** the workflow SHALL log clear error messages
- **AND** the workflow SHALL NOT silently fail
- **AND** the workflow SHALL allow retry on next scheduled run

#### Scenario: Notification integration
- **WHEN** a PR is successfully created
- **THEN** the workflow SHALL trigger a Feishu notification
- **AND** the notification SHALL include the PR URL
- **AND** the notification SHALL include the new version number

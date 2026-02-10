# Implementation Tasks

## 1. Analyze Current Workflows
- [ ] 1.1 Review `.github/workflows/deploy.yml` to identify all notification jobs
- [ ] 1.2 Review `.github/workflows/version-monitor.yml` to identify all notification jobs
- [ ] 1.3 Document current Reusable Workflow syntax patterns used
- [ ] 1.4 Verify `FEISHU_WEBHOOK_URL` secret configuration

## 2. Update deploy.yml Notifications
- [ ] 2.1 Backup current `deploy.yml` file
- [ ] 2.2 Update `notify-success` job to use Composite Action syntax
  - [ ] 2.2.1 Add `runs-on: ubuntu-latest`
  - [ ] 2.2.2 Add `steps:` array
  - [ ] 2.2.3 Move `secrets:` to `env:` under the step
  - [ ] 2.2.4 Change `@main` to `@v1`
- [ ] 2.3 Update `notify-failure` job to use Composite Action syntax
  - [ ] 2.3.1 Add `runs-on: ubuntu-latest`
  - [ ] 2.3.2 Add `steps:` array
  - [ ] 2.3.3 Move `secrets:` to `env:` under the step
  - [ ] 2.3.4 Change `@main` to `@v1`

## 3. Update version-monitor.yml Notifications
- [ ] 3.1 Backup current `version-monitor.yml` file
- [ ] 3.2 Update `notify-version-update` job to use Composite Action syntax
  - [ ] 3.2.1 Add `runs-on: ubuntu-latest`
  - [ ] 3.2.2 Add `steps:` array
  - [ ] 3.2.3 Move `secrets:` to `env:` under the step
  - [ ] 3.2.4 Change `@main` to `@v1`
- [ ] 3.3 Update `notify-failure` job to use Composite Action syntax
  - [ ] 3.3.1 Add `runs-on: ubuntu-latest`
  - [ ] 3.3.2 Add `steps:` array
  - [ ] 3.3.3 Move `secrets:` to `env:` under the step
  - [ ] 3.3.4 Change `@main` to `@v1`

## 4. Validate Workflow Syntax
- [ ] 4.1 Use GitHub Actions workflow validation tools
- [ ] 4.2 Verify YAML syntax is correct
- [ ] 4.3 Check for proper indentation and structure
- [ ] 4.4 Ensure all required parameters are present

## 5. Testing in Pull Request
- [ ] 5.1 Create a feature branch for the migration
- [ ] 5.2 Push changes to remote repository
- [ ] 5.3 Create a pull request
- [ ] 5.4 Trigger deploy.yml workflow manually to test success notification
- [ ] 5.5 Verify Feishu notification is received correctly
- [ ] 5.6 Test failure notification path (if possible)
- [ ] 5.7 Test version-monitor.yml notification flow

## 6. Documentation Updates
- [ ] 6.1 Update any internal documentation referencing the old syntax
- [ ] 6.2 Document the migration in project changelog
- [ ] 6.3 Add comments in workflow files explaining the Composite Action usage

## 7. Final Verification
- [ ] 7.1 Review all changed files
- [ ] 7.2 Ensure no Reusable Workflow references remain
- [ ] 7.3 Confirm all jobs use `@v1` version tag
- [ ] 7.4 Verify secret references are correct
- [ ] 7.5 Test in production environment after merge

## 8. Post-Migration Cleanup
- [ ] 8.1 Monitor notification delivery for 1 week
- [ ] 8.2 Document any issues found and resolutions
- [ ] 8.3 Update team documentation if needed
- [ ] 8.4 Consider removing old Reusable Workflow fallback (after stable operation)

## Rollback Tasks (if needed)
- [ ] R.1 Revert `.github/workflows/deploy.yml` to previous version
- [ ] R.2 Revert `.github/workflows/version-monitor.yml` to previous version
- [ ] R.3 Verify notifications work with Reusable Workflow syntax
- [ ] R.4 Document root cause of migration failure
- [ ] R.5 Plan retry with fixes

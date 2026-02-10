# Implementation Tasks

## 1. Diagnosis and Analysis
- [ ] 1.1 Review recent Version Monitor workflow runs in GitHub Actions
- [ ] 1.2 Check workflow logs for any error messages related to PR creation
- [ ] 1.3 Verify `GITHUB_TOKEN` permissions in `version-monitor.yml`
- [ ] 1.4 Compare Version Monitor and Activity Metrics workflow implementations
- [ ] 1.5 Identify specific differences in PR creation approaches

## 2. Update version-monitor.js Script
- [ ] 2.1 Backup current `version-monitor.js` file
- [ ] 2.2 Remove PR creation function (`createPullRequest` at lines 411-473)
- [ ] 2.3 Remove existing PR check function (`hasExistingPullRequest` at lines 328-357)
- [ ] 2.4 Remove branch creation function (`createVersionBranch` at lines 360-378)
- [ ] 2.5 Remove commit and push function (`updateVersionIndexAndCommit` at lines 385-403)
- [ ] 2.6 Update main function to only handle version detection and file update
- [ ] 2.7 Modify script outputs to set `update_needed` and `new_version` only
- [ ] 2.8 Keep version fetching, comparison, and local file update logic intact
- [ ] 2.9 Test script locally to ensure version detection still works

## 3. Update version-monitor.yml Workflow
- [ ] 3.1 Backup current `version-monitor.yml` file
- [ ] 3.2 Add "Configure Git" step after monitor job
- [ ] 3.3 Add "Create feature branch" step with conditional execution
- [ ] 3.4 Add "Commit version changes" step with conditional execution
- [ ] 3.5 Add "Delete remote branch if exists" step
- [ ] 3.6 Add "Push branch" step with `--force-with-lease` flag
- [ ] 3.7 Add "Close previous version PRs" step using `gh` CLI
- [ ] 3.8 Add "Create Pull Request" step with detailed PR body
- [ ] 3.9 Update job outputs to include `pr_created` and `pr_url`
- [ ] 3.10 Update notification job to use new output variables

## 4. Update Workflow Outputs and Conditionals
- [ ] 4.1 Modify monitor job outputs to return `update_needed` and `new_version`
- [ ] 4.2 Update conditional execution for Git operations based on `update_needed`
- [ ] 4.3 Ensure notification jobs only run when PR is created
- [ ] 4.4 Verify all output references are correct

## 5. Local Testing
- [ ] 5.1 Test `version-monitor.js` script locally with mock data
- [ ] 5.2 Verify version comparison logic works correctly
- [ ] 5.3 Test local file update functionality
- [ ] 5.4 Verify script outputs correct exit codes and signals

## 6. Create Feature Branch
- [ ] 6.1 Create feature branch for the fix
- [ ] 6.2 Push changes to remote repository
- [ ] 6.3 Ensure workflow files are valid YAML

## 7. Test in Pull Request
- [ ] 7.1 Manually trigger Version Monitor workflow in PR branch
- [ ] 7.2 Verify version detection works
- [ ] 7.3 Test with unchanged version (should not create PR)
- [ ] 7.4 Test with mocked new version (if possible)
- [ ] 7.5 Verify workflow logs show clear execution steps
- [ ] 7.6 Check for any error messages or warnings

## 8. Integration Testing (after merge to main)
- [ ] 8.1 Wait for scheduled Version Monitor run
- [ ] 8.2 Verify workflow executes successfully
- [ ] 8.3 Check if PR is created (when new version detected)
- [ ] 8.4 Verify PR contains correct information
- [ ] 8.5 Confirm old PRs are closed when new version is detected
- [ ] 8.6 Verify Feishu notification is sent with PR URL

## 9. Documentation and Cleanup
- [ ] 9.1 Add comments in workflow explaining the PR creation approach
- [ ] 9.2 Document the separation of concerns between script and workflow
- [ ] 9.3 Update any related documentation if needed
- [ ] 9.4 Create summary of changes for changelog

## 10. Post-Deployment Monitoring
- [ ] 10.1 Monitor Version Monitor workflow runs for 1 week
- [ ] 10.2 Verify PR creation works consistently
- [ ] 10.3 Check notification delivery reliability
- [ ] 10.4 Document any issues found and resolutions

## Rollback Tasks (if needed)
- [ ] R.1 Revert `version-monitor.js` to include PR creation logic
- [ ] R.2 Revert `version-monitor.yml` to original workflow
- [ ] R.3 Verify version detection still works
- [ ] R.4 Manually create PR if automation completely fails
- [ ] R.5 Document root cause of failure and plan retry

## Validation Checklist
- [ ] Script detects version changes correctly
- [ ] Script updates `public/version-index.json` when needed
- [ ] Workflow creates Git branch with correct naming
- [ ] Workflow commits changes with proper message
- [ ] Workflow pushes branch to remote
- [ ] `gh` CLI creates PR with correct title and body
- [ ] Old PRs are closed when new version is detected
- [ ] Feishu notification includes PR URL
- [ ] No PR is created when version hasn't changed
- [ ] Workflow permissions are correctly configured

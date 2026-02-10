# Change: Fix Version Monitor Pull Request Creation

**Status: ExecutionCompleted**

## Why

Version Monitor is responsible for detecting new Hagicode desktop application releases and automatically creating Pull Requests to update the version index. However, the PR creation functionality is not working as expected. While the script contains comprehensive PR creation logic using GitHub API, the current implementation may have issues with authentication, workflow permissions, or error handling that prevent successful PR creation. This proposal analyzes the root cause and fixes the PR creation functionality by aligning it with the proven implementation from the Activity Metrics workflow.

## What Changes

- **BREAKING**: Modify Version Monitor PR creation implementation from direct GitHub API calls to `gh` CLI approach for consistency
- Replace GitHub API-based PR creation in `scripts/version-monitor.js` with shell-based approach using `gh` CLI
- Update `.github/workflows/version-monitor.yml` to handle PR creation in the workflow instead of the script
- Reorganize Version Monitor script responsibilities: focus on version detection and data update only
- Add comprehensive error handling and retry logic for PR creation
- Implement PR deduplication checks similar to Activity Metrics workflow
- Update workflow outputs to signal PR creation status

## Implementation Approach

### Current State Analysis

The Version Monitor currently implements PR creation in two ways:

1. **In `scripts/version-monitor.js` (lines 411-473)**: Direct GitHub API calls using `fetch()` with `GITHUB_TOKEN`
2. **In `.github/workflows/version-monitor.yml`**: Uses script outputs to trigger notifications

The Activity Metrics workflow uses a different, proven approach:

1. **In `.github/workflows/update-activity-metrics.yml` (lines 235-279)**: Uses `gh` CLI with shell commands
2. **Separates concerns**: Script updates data, workflow creates PR

### Proposed Changes

#### File: `.github/workflows/version-monitor.yml`

Add new steps after the `Run version monitor` step:

```yaml
      - name: Configure Git
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"

      - name: Create feature branch
        if: steps.monitor.outputs.update_needed == 'true'
        run: |
          BRANCH_NAME="version-update-${{ steps.monitor.outputs.new_version }}"
          git checkout -b "$BRANCH_NAME"
          echo "Created branch: $BRANCH_NAME"

      - name: Commit version changes
        if: steps.monitor.outputs.update_needed == 'true'
        run: |
          git add public/version-index.json
          git commit -m "chore: update version to ${{ steps.monitor.outputs.new_version }}"

      - name: Delete remote branch if exists
        if: steps.monitor.outputs.update_needed == 'true'
        run: |
          BRANCH_NAME="version-update-${{ steps.monitor.outputs.new_version }}"
          if git ls-remote --heads origin "$BRANCH_NAME" | grep -q "$BRANCH_NAME"; then
            git push origin --delete "$BRANCH_NAME"
          fi

      - name: Push branch
        if: steps.monitor.outputs.update_needed == 'true'
        run: |
          BRANCH_NAME="version-update-${{ steps.monitor.outputs.new_version }}"
          git push origin "$BRANCH_NAME" --force-with-lease

      - name: Close previous version PRs
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          PREVIOUS_PRS=$(gh pr list \
            --search "chore: update version to in:head" \
            --state open \
            --json number \
            --jq '.[].number')

          if [ -n "$PREVIOUS_PRS" ]; then
            echo "$PREVIOUS_PRS" | while read -r pr_number; do
              gh pr close "$pr_number" --comment "由于新的版本更新 PR 自动关闭"
            done
          fi

      - name: Create Pull Request
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          NEW_VERSION="${{ steps.monitor.outputs.new_version }}"
          PR_BODY="## Version Update

This PR updates the version index to reflect the new version detected from the official website.

- **New Version**: ${NEW_VERSION}
- **Source**: ${{ vars.VERSION_SOURCE_URL || 'https://desktop.dl.hagicode.com/index.json' }}
- **Checked At**: $(date -u +"%Y-%m-%dT%H:%M:%SZ")

### Changes
- Updated \`public/version-index.json\` with the latest version data from online API

### Next Steps
After merging this PR, the CI/CD pipeline will automatically rebuild and deploy the documentation site with the updated version information.

---
_This PR was automatically created by the [Version Monitor](${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}) workflow._"

          gh pr create \
            --title "chore: update version to ${NEW_VERSION}" \
            --body "$PR_BODY" \
            --base main \
            --head "version-update-${NEW_VERSION}" \
            --label "automation,version"

          echo "pr_created=true" >> $GITHUB_OUTPUT
          echo "pr_url=$(gh pr view --json url -q .url)" >> $GITHUB_OUTPUT
```

#### File: `scripts/version-monitor.js`

Remove PR creation responsibilities (lines 323-473) and simplify to only handle version detection and data update:

- Keep: Version fetching, comparison, and local file update
- Remove: Branch creation, commit, push, and PR creation logic
- Modify outputs to only signal version update needed status

## Migration Details

### Responsibility Separation

| Responsibility | Current Location | New Location |
|----------------|------------------|--------------|
| Version Detection | `version-monitor.js` | `version-monitor.js` |
| Version Comparison | `version-monitor.js` | `version-monitor.js` |
| Local Data Update | `version-monitor.js` | `version-monitor.js` |
| Git Configuration | N/A | `version-monitor.yml` |
| Branch Creation | `version-monitor.js` | `version-monitor.yml` |
| Commit Changes | `version-monitor.js` | `version-monitor.yml` |
| PR Creation | `version-monitor.js` | `version-monitor.yml` |
| Notification | `version-monitor.yml` | `version-monitor.yml` |

### Benefits of New Approach

1. **Consistency**: Aligns with Activity Metrics workflow pattern
2. **Separation of Concerns**: Script handles data, workflow handles Git operations
3. **Better Error Handling**: Workflow-level retries and error reporting
4. **Simplified Script**: Removes complex Git and API logic from Node.js script
5. **Proven Pattern**: Uses same approach as working Activity Metrics workflow

## Impact

- Affected specs: `github-integration` - GitHub Actions workflow and version monitoring capability
- Affected code:
  - `.github/workflows/version-monitor.yml` - Add PR creation steps after monitor job
  - `scripts/version-monitor.js` - Remove PR creation logic (lines 323-473), simplify outputs
- Benefits:
  - Fixes PR creation functionality by using proven `gh` CLI approach
  - Improves consistency across automation workflows
  - Simplifies code and reduces maintenance burden
  - Better error visibility in workflow logs
- Risks:
  - Need to ensure `gh` CLI is available in workflow environment (standard GitHub Actions runner includes it)
  - Must verify `GITHUB_TOKEN` has proper permissions
  - Testing required to ensure version detection still works correctly

## Testing Strategy

1. **Manual Trigger Test**: Use `workflow_dispatch` to test version detection and PR creation
2. **Empty State Test**: Test with no existing `public/version-index.json` file
3. **Same Version Test**: Verify no PR is created when version hasn't changed
4. **New Version Test**: Verify PR is created correctly for new versions
5. **Duplicate PR Test**: Verify old PRs are closed when new version is detected
6. **Notification Test**: Verify Feishu notification is sent after PR creation

## Rollback Plan

If issues occur:
1. Revert `version-monitor.js` to include PR creation logic
2. Keep workflow modifications or revert both files
3. No data loss - version data is still updated correctly
4. PRs can be manually created if automation fails

## Success Criteria

- [ ] Version Monitor successfully detects new versions
- [ ] Pull Request is created automatically when new version is detected
- [ ] No PR is created when version hasn't changed
- [ ] Old version update PRs are automatically closed
- [ ] Feishu notification is sent with PR URL
- [ ] Workflow logs show clear error messages if PR creation fails
- [ ] Implementation matches Activity Metrics workflow pattern

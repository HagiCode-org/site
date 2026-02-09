# Change: Migrate notification workflows to haginotifier composite action

## Why

The project currently uses the deprecated **Reusable Workflow syntax** for sending Feishu notifications via `haginotifier`. The `haginotifier` project has completed migration from Reusable Workflow to Composite Action, providing better performance, standard GitHub Actions versioning, and ecosystem best practices. This change updates all notification workflows to use the new Composite Action syntax.

## What Changes

- **BREAKING**: Update notification job syntax from Reusable Workflow to Composite Action
- Migrate `deploy.yml` notification jobs (`notify-success`, `notify-failure`) to use `HagiCode-org/haginotifier@v1`
- Migrate `version-monitor.yml` notification jobs (`notify-version-update`, `notify-failure`) to use `HagiCode-org/haginotifier@v1`
- Add `runs-on: ubuntu-latest` to all notification jobs (required for Composite Actions)
- Convert job-level `secrets:` to step-level `env:`
- Update output access from `needs.<job-id>.outputs.*` to `steps.<step-id>.outputs.*`
- Pin to version tag `@v1` instead of branch `@main` for stability

## Migration Details

### Old Syntax (Reusable Workflow) - Currently Used

```yaml
jobs:
  notify-success:
    needs: [build, deploy]
    if: success()
    uses: HagiCode-org/haginotifier/.github/workflows/notify.yml@main
    with:
      msg_type: 'post'
      title: 'Deploy Notification'
      message: |
        ## Deploy to GitHub Pages

        **状态**: ✅ 成功
        **仓库**: ${{ github.repository }}
        **分支**: ${{ github.ref_name }}
        **提交**: ${{ github.sha }}
        **触发者**: ${{ github.actor }}
        **运行详情**: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
    secrets:
      FEISHU_WEBHOOK_URL: ${{ secrets.FEISHU_WEBHOOK_URL }}
```

### New Syntax (Composite Action) - To Be Implemented

```yaml
jobs:
  notify-success:
    needs: [build, deploy]
    if: success()
    runs-on: ubuntu-latest
    steps:
      - uses: HagiCode-org/haginotifier@v1
        with:
          msg_type: 'post'
          title: 'Deploy Notification'
          message: |
            ## Deploy to GitHub Pages

            **状态**: ✅ 成功
            **仓库**: ${{ github.repository }}
            **分支**: ${{ github.ref_name }}
            **提交**: ${{ github.sha }}
            **触发者**: ${{ github.actor }}
            **运行详情**: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
        env:
          FEISHU_WEBHOOK_URL: ${{ secrets.FEISHU_WEBHOOK_URL }}
```

### Key Changes

1. Add `runs-on: ubuntu-latest` to the job
2. Add `steps:` array
3. Move `secrets:` to `env:` under the step
4. Use `@v1` version tag instead of `@main` branch
5. Use step-level outputs (if needed): `steps.<step-id>.outputs.<output-name>`

## Impact

- Affected specs: `github-integration` - GitHub Actions workflow notification capability
- Affected code:
  - `.github/workflows/deploy.yml` - Lines 63-99 (notify-success, notify-failure jobs)
  - `.github/workflows/version-monitor.yml` - Lines 77-110 (notify-version-update, notify-failure jobs)
- Benefits:
  - Faster execution (no runtime TypeScript compilation overhead)
  - Standard GitHub Actions versioning with `@v1` tag
  - Better ecosystem integration following GitHub Actions best practices
  - Improved maintainability and consistency with modern GitHub Actions patterns
- Risks:
  - Breaking change that requires workflow file updates
  - Need to verify notification delivery after migration
  - Must ensure `FEISHU_WEBHOOK_URL` secret is properly configured

## Migration Plan

1. Update `.github/workflows/deploy.yml` notification jobs
2. Update `.github/workflows/version-monitor.yml` notification jobs
3. Test notification delivery in a pull request
4. Verify both success and failure notification paths
5. Merge and monitor production deployments

## Rollback Plan

If issues occur:
1. Revert workflow files to previous Reusable Workflow syntax
2. Notifications will continue working with the old syntax (still supported by haginotifier)
3. No data loss or service interruption expected

## Status

**Status**: ExecutionCompleted

**Execution Date**: 2026-02-09

**Pull Request**: https://github.com/HagiCode-org/site/pull/99

**Completed Tasks**:
- [x] Analyzed current workflow syntax in `deploy.yml` and `version-monitor.yml`
- [x] Updated `deploy.yml` notify jobs to Composite Action syntax
- [x] Updated `version-monitor.yml` notify jobs to Composite Action syntax
- [x] Validated YAML syntax for both workflow files
- [x] Created feature branch and pull request
- [x] Verified no remaining Reusable Workflow references

**Notes**: All four notification jobs now use `HagiCode-org/haginotifier@v1` with the Composite Action syntax. PR is ready for review and merge.

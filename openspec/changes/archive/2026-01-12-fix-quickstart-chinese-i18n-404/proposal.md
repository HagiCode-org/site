# Change: Fix Quick Start Chinese i18n 404 Errors

## Metadata

- **Change ID**: `fix-quickstart-chinese-i18n-404`
- **Status**: ExecutionCompleted
- **Created**: 2026-01-12
- **Author**: AI Assistant

## Overview

Fix Chinese internationalization (i18n) 404 errors for the Quick Start documentation series in the PCode Documentation site. When users switch to Chinese (zh-CN), all Quick Start documentation pages show 404 errors despite the translation files existing in the correct location.

### Problem Statement

The PCode Documentation site has a critical i18n issue affecting Chinese users:

1. **404 errors on Chinese quick-start pages**: When users switch to Chinese (zh-CN), navigating to any Quick Start documentation page results in a 404 error
2. **Translation files exist but are inaccessible**: The Chinese translation files are present at `i18n/zh-CN/docusaurus-plugin-content-docs/current/quick-start/` with proper frontmatter and content
3. **Build failures**: The site fails to build due to broken Chinese translation links in English documentation pages
4. **Poor user experience**: Chinese users cannot access the Quick Start documentation, creating a significant barrier to onboarding

The build output shows these broken links:
- `/zh-CN/docs/configuration`
- `/zh-CN/docs/feature-guides/achievements`
- `/zh-CN/docs/feature-guides/conversation`
- `/zh-CN/docs/feature-guides/openspec`
- `/zh-CN/docs/feature-guides/project-management`
- `/zh-CN/docs/feature-guides/session-management`
- `/zh-CN/docs/feature-guides/statistics`
- `/zh-CN/docs/user-guide/appearance`
- `/zh-CN/docs/user-guide/settings`

These broken links appear in English documentation pages and reference Chinese translations that don't exist yet. The Docusaurus configuration `onBrokenLinks: 'throw'` causes build failures.

### Solution Overview

Fix the i18n 404 errors by:

1. **Investigate root cause**: Analyze why existing Chinese quick-start files aren't being served
2. **Check current.json configuration**: Verify the Chinese translation configuration includes quick-start entries
3. **Validate frontmatter format**: Ensure Chinese translation files have proper YAML frontmatter
4. **Test Docusaurus i18n config**: Verify `docusaurus.config.ts` i18n settings are correct
5. **Run build tests**: Execute build with detailed logging to identify specific errors
6. **Create missing Chinese translations**: For other sections causing build failures (configuration, feature-guides, user-guide)
7. **Update documentation translation workflow**: Document the proper process for adding Chinese translations

The solution will ensure:
- Chinese quick-start pages are accessible at `/zh-CN/docs/quick-start/*`
- Site builds successfully without broken link errors
- Language switcher works correctly for all quick-start documentation
- Future translations follow the correct pattern

## Scope

### In Scope

1. **Quick Start Chinese translations (zh-CN)**
   - `i18n/zh-CN/docusaurus-plugin-content-docs/current/quick-start/installation.md`
   - `i18n/zh-CN/docusaurus-plugin-content-docs/current/quick-start/create-first-project.md`
   - `i18n/zh-CN/docusaurus-plugin-content-docs/current/quick-start/conversation-session.md`
   - `i18n/zh-CN/docusaurus-plugin-content-docs/current/quick-start/proposal-session.md`
   - Category metadata: `_category_.json` for quick-start

2. **Translation configuration validation**
   - `i18n/zh-CN/docusaurus-plugin-content-docs/current.json` - verify quick-start entries exist
   - `docusaurus.config.ts` - verify i18n locale configuration
   - `sidebars.ts` - verify sidebar includes Quick Start category

3. **Build process validation**
   - Run `npm run build` to identify specific errors
   - Fix any configuration or file format issues
   - Verify Chinese pages render correctly

4. **Missing Chinese translation stubs** (to fix build)
   - Create placeholder/stub Chinese translations for sections referenced in broken links:
     - `i18n/zh-CN/docusaurus-plugin-content-docs/current/configuration/`
     - `i18n/zh-CN/docusaurus-plugin-content-docs/current/feature-guides/`
     - `i18n/zh-CN/docusaurus-plugin-content-docs/current/user-guide/`
   - These can be minimal translations or "Coming Soon" placeholders to unblock the build

5. **Documentation**
   - Update translation workflow documentation
   - Add troubleshooting guide for i18n issues

### Out of Scope

1. **Full Chinese translation of non-quick-start content** - only stub translations to fix build
2. **Translation quality review** - focus on functionality, not translation quality
3. **Adding new languages** - only fixing existing zh-CN locale
4. **Automated translation workflow** - manual process only
5. **Translation management system** - using Docusaurus built-in i18n only

### Affected Components

- **i18n/zh-CN/docusaurus-plugin-content-docs/current.json**: Translation configuration file
- **i18n/zh-CN/docusaurus-plugin-content-docs/current/quick-start/**: Chinese translation files
- **docusaurus.config.ts**: i18n configuration (may need minor adjustments)
- **sidebars.ts**: Sidebar configuration (verify Quick Start category)
- **Build process**: `npm run build` validation

## Success Criteria

1. **Site builds successfully**
   - `npm run build` completes without errors
   - No broken link warnings for Chinese translations
   - All quick-start Chinese pages render correctly

2. **Chinese quick-start pages are accessible**
   - `/zh-CN/docs/quick-start/installation` loads successfully
   - `/zh-CN/docs/quick-start/create-first-project` loads successfully
   - `/zh-CN/docs/quick-start/conversation-session` loads successfully
   - `/zh-CN/docs/quick-start/proposal-session` loads successfully

3. **Language switcher works correctly**
   - Switching from English to Chinese displays translated quick-start content
   - Switching from Chinese to English displays English quick-start content
   - No 404 errors when switching languages

4. **Translation files are properly configured**
   - All Chinese quick-start files have valid YAML frontmatter
   - `current.json` includes quick-start translation entries
   - Category metadata files exist and are valid JSON

5. **Documentation is updated**
   - Translation workflow is documented
   - Troubleshooting guide for common i18n issues exists

## Impact Analysis

### Benefits

1. **Improved accessibility**: Chinese users can access quick-start documentation
2. **Better onboarding**: Chinese-speaking users can complete installation and first project setup
3. **Reduced support burden**: Clear Chinese documentation reduces questions
4. **International compliance**: Meets the project's bilingual documentation commitment
5. **Foundation for expansion**: Establishes pattern for future Chinese translations

### Risks

1. **Translation quality**: Current translations may have errors or inconsistencies
   - **Mitigation**: Focus on functional correctness first; quality improvements can follow

2. **Build configuration sensitivity**: Docusaurus i18n configuration can be fragile
   - **Mitigation**: Document working configuration; validate changes incrementally

3. **Missing translations**: Creating stub translations may confuse users
   - **Mitigation**: Clearly mark stub content as "Translation in Progress" or "Coming Soon"

4. **File format issues**: Frontmatter or JSON syntax errors can break builds
   - **Mitigation**: Use JSON/YAML validation tools; test builds frequently

### Breaking Changes

None - this is a bug fix that restores intended functionality without changing APIs or data structures.

### Migration Path

Not applicable - no existing content is modified or removed. Only fixing broken i18n functionality.

## Dependencies

### External Dependencies

None - uses existing Docusaurus i18n infrastructure.

### Internal Dependencies

- Existing English quick-start documentation (`docs/quick-start/`)
- Existing Chinese quick-start translations (need validation)
- Docusaurus i18n configuration in `docusaurus.config.ts`
- Sidebar configuration in `sidebars.ts`

### Related Changes

- `quick-start-installation-guide` - Added installation guide and Chinese translation
- `first-project-creation-guide` - Added project creation guide and Chinese translation
- `creating-a-conversation-session` - Added conversation session guide and Chinese translation
- `proposal-session-workflow-guide` - Added proposal session guide and Chinese translation
- `language-switcher-button` - Added language switcher functionality

These previous changes added the Chinese translation files that are currently experiencing 404 errors.

## Implementation Notes

### Diagnosis Approach

1. **Check file structure**:
   ```bash
   ls -la docs/quick-start/
   ls -la i18n/zh-CN/docusaurus-plugin-content-docs/current/quick-start/
   ```

2. **Validate frontmatter**:
   - English files have: `title`, `description`, `sidebar_position`
   - Chinese files should have: translated `title`, translated `description`, `sidebar_position`

3. **Check current.json**:
   ```bash
   grep -i "quick-start" i18n/zh-CN/docusaurus-plugin-content-docs/current.json
   ```

4. **Run build with logging**:
   ```bash
   npm run build 2>&1 | tee build.log
   ```

5. **Test locally**:
   ```bash
   npm start
   # Navigate to http://localhost:3000/zh-CN/docs/quick-start/installation
   ```

### Expected File Structure

```
docs/quick-start/
├── _category_.json
├── installation.md
├── create-first-project.md
├── conversation-session.md
└── proposal-session.md

i18n/zh-CN/docusaurus-plugin-content-docs/current/quick-start/
├── _category_.json (Chinese label: "快速开始")
├── installation.md (Chinese content)
├── create-first-project.md (Chinese content)
├── conversation-session.md (Chinese content)
└── proposal-session.md (Chinese content)
```

### Common Issues and Fixes

**Issue 1**: Missing `current.json` entries for quick-start
- **Fix**: Add entries for each quick-start document and category

**Issue 2**: Invalid YAML frontmatter in Chinese files
- **Fix**: Ensure proper YAML syntax, correct quote escaping

**Issue 3**: Incorrect file paths in `current.json`
- **Fix**: Use relative paths without leading slashes: `docs/quick-start/installation`

**Issue 4**: Sidebar not including quick-start for Chinese locale
- **Fix**: The sidebar is shared; ensure `sidebars.ts` includes Quick Start category

**Issue 5**: Missing category metadata files
- **Fix**: Create `_category_.json` in both English and Chinese directories

### Validation Commands

```bash
# Validate JSON files
jq . i18n/zh-CN/docusaurus-plugin-content-docs/current.json
jq . docs/quick-start/_category_.json
jq . i18n/zh-CN/docusaurus-plugin-content-docs/current/quick-start/_category_.json

# Check for broken links
npm run build

# Start dev server
npm start

# Check translations
npm run write-translations -- --locale zh-CN
```

## Alternatives Considered

### Alternative 1: Remove language switcher until all translations complete

**Approach**: Hide the language switcher or remove zh-CN from config until all sections have complete Chinese translations

**Rationale for rejection**:
- Quick Start translations are already complete and should work
- Punishes all Chinese users for incomplete sections
- Against project's bilingual commitment
- Creates more work to re-enable later

### Alternative 2: Change onBrokenLinks to 'warn'

**Approach**: Modify `docusaurus.config.ts` to set `onBrokenLinks: 'warn'` instead of 'throw'

**Rationale for rejection**:
- Masks the real problem instead of fixing it
- Allows broken links to exist in production
- Poor user experience (links go to 404 pages)
- Makes it harder to catch real broken links in the future

### Alternative 3: Use Docusaurus built-in translation extraction

**Approach**: Run `npm run write-translations -- --locale zh-CN` to extract all translatable strings and create stub translations automatically

**Rationale for rejection**:
- Quick Start translations already exist manually
- Extracted translations would need manual review anyway
- Doesn't solve why existing translations aren't working
- Could overwrite or conflict with existing translations

### Alternative 4: Use subpath for Chinese content (e.g., /zh/)

**Approach**: Reconfigure i18n to use a different URL structure or subdomain

**Rationale for rejection**:
- Unnecessary architectural change
- Docusaurus standard approach works fine when configured correctly
- More complex to maintain
- Doesn't address root cause

## Open Questions

1. **Root cause confirmation**: Is the issue missing current.json entries, incorrect file paths, or something else?
   - **Approach**: Systematic diagnosis as outlined in Implementation Notes

2. **Translation stub approach**: For non-quick-start sections, should we create minimal stubs or "Coming Soon" pages?
   - **Assumption**: Create minimal stubs with "Translation in Progress" notice to unblock build

3. **Translation workflow**: What is the intended process for adding new Chinese translations?
   - **Approach**: Document based on discovered working pattern

4. **Automation**: Should we add scripts to validate i18n configuration?
   - **Assumption**: Add validation script to prevent future issues

## References

- Docusaurus i18n docs: https://docusaurus.io/docs/i18n/introduction
- OpenSpec agents guide: `openspec/AGENTS.md`
- Existing spec: `openspec/specs/docusaurus-site/spec.md`
- Related changes:
  - `openspec/changes/archive/2026-01-12-quick-start-installation-guide/`
  - `openspec/changes/archive/2026-01-12-first-project-creation-guide/`
  - `openspec/changes/archive/2026-01-12-creating-a-conversation-session/`
  - `openspec/changes/archive/2026-01-12-proposal-session-workflow-guide/`

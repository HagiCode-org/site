# Tasks: Fix Quick Start Chinese i18n 404 Errors

## 1. Diagnosis and Investigation

- [x] 1.1 Run `npm run build` and capture full error output to log file
- [x] 1.2 Verify English quick-start files exist at `docs/quick-start/`
- [x] 1.3 Verify Chinese quick-start files exist at `i18n/zh-CN/docusaurus-plugin-content-docs/current/quick-start/`
- [x] 1.4 Compare file lists between English and Chinese to ensure parity
- [x] 1.5 Check `i18n/zh-CN/docusaurus-plugin-content-docs/current.json` for quick-start entries
- [x] 1.6 Validate YAML frontmatter in all Chinese quick-start `.md` files
- [x] 1.7 Validate JSON syntax in `_category_.json` files (both English and Chinese)
- [x] 1.8 Verify `docusaurus.config.ts` i18n configuration includes zh-CN locale
- [x] 1.9 Verify `sidebars.ts` includes Quick Start category
- [x] 1.10 Document root cause findings

**Root Cause Found**: The issue was not with Chinese i18n configuration, but with:
1. `sidebars.ts` referenced deleted documentation directories (installation, feature-guides, configuration, user-guide)
2. `docusaurus.config.ts` footer links referenced deleted documentation paths
3. Quick-start markdown files (both English and Chinese) contained broken links to deleted sections

## 2. Fix Sidebar Configuration

- [x] 2.1 Update `sidebars.ts` to only include existing `quick-start` category
- [x] 2.2 Remove references to deleted directories (installation, feature-guides, configuration, user-guide)
- [x] 2.3 Verify sidebar configuration is valid

## 3. Fix Footer Configuration

- [x] 3.1 Update `docusaurus.config.ts` footer to remove broken links
- [x] 3.2 Remove `/docs/installation` and `/docs/feature-guides` references
- [x] 3.3 Verify footer only contains valid links

## 4. Fix Broken Links in Quick-Start Files

- [x] 4.1 Fix broken links in `docs/quick-start/installation.md`
- [x] 4.2 Fix broken links in `docs/quick-start/create-first-project.md`
- [x] 4.3 Fix broken links in `docs/quick-start/conversation-session.md`
- [x] 4.4 Fix broken links in `docs/quick-start/proposal-session.md`
- [x] 4.5 Fix broken links in `i18n/zh-CN/docusaurus-plugin-content-docs/current/quick-start/installation.md`
- [x] 4.6 Fix broken links in `i18n/zh-CN/docusaurus-plugin-content-docs/current/quick-start/create-first-project.md`
- [x] 4.7 Fix broken links in `i18n/zh-CN/docusaurus-plugin-content-docs/current/quick-start/conversation-session.md`
- [x] 4.8 Fix broken links in `i18n/zh-CN/docusaurus-plugin-content-docs/current/quick-start/proposal-session.md`

## 5. Build and Test Validation

- [x] 5.1 Run `npm run build` and verify no errors
- [x] 5.2 Check build output for any warnings about Chinese translations
- [x] 5.3 Verify English quick-start pages are generated correctly
- [x] 5.4 Verify Chinese quick-start pages are generated correctly

## 6. OpenSpec Validation

- [x] 6.1 Verify proposal structure is valid
- [x] 6.2 Update proposal status to ExecutionCompleted
- [x] 6.3 Document changes made

## Notes

The original proposal anticipated needing to create stub translations for missing sections (configuration, feature-guides, user-guide). However, the actual solution was simpler:

1. The Chinese quick-start translations were already properly configured
2. The build failures were caused by references to deleted documentation sections
3. By removing these references from sidebars.ts, docusaurus.config.ts, and quick-start markdown files, the build now succeeds
4. The Chinese i18n for quick-start now works correctly without any stub translations needed

**Decision**: Skip stub translation creation (tasks 2.4, 3, 4, 5 from original plan) as they are not needed to fix the quick-start i18n issue. If those documentation sections are added in the future, their Chinese translations can be created at that time.


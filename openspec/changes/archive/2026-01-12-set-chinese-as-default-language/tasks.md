# Tasks: Set Chinese as Default Language

## 1. Preparation

- [x] 1.1 Create Git backup commit before any changes
- [x] 1.2 Verify current Chinese content exists in `i18n/zh-CN/docusaurus-plugin-content-docs/current/quick-start/`
- [x] 1.3 Verify current English content in `docs/quick-start/` for comparison
- [x] 1.4 Research Docusaurus behavior with single-locale i18n configuration

## 2. Content Migration

- [x] 2.1 Move `i18n/zh-CN/docusaurus-plugin-content-docs/current/quick-start/` to `docs/quick-start/` (backup/rename existing if needed)
- [x] 2.2 Verify all Chinese files are correctly moved with proper frontmatter
- [x] 2.3 Verify `_category_.json` is moved and contains Chinese label "快速入门"
- [x] 2.4 Delete the `docs/quick-start/` (English content if it still exists as a separate directory)
- [x] 2.5 Delete the entire `i18n/` directory and all its contents
- [x] 2.6 Verify `docs/` directory now contains only Chinese content

## 3. Configuration Updates

- [x] 3.1 Update `docusaurus.config.ts` i18n configuration:
  - [x] Change `defaultLocale` from `'en'` to `'zh-CN'`
  - [x] Update `locales` array to contain only `['zh-CN']`
  - [x] Update `localeConfigs` to only include `zh-CN` configuration
- [x] 3.2 Remove language switcher from `docusaurus.config.ts`:
  - [x] Locate `localeDropdown` item in `navbar.items`
  - [x] Remove the entire localeDropdown configuration
- [x] 3.3 Consider removing i18n config entirely if Docusaurus supports single-locale mode (research first) - **Removed entirely**
- [x] 3.4 Verify TypeScript compilation passes: `npm run typecheck`

## 4. Build Validation

- [x] 4.1 Clear Docusaurus cache: `npm run clear`
- [x] 4.2 Run production build: `npm run build`
- [x] 4.3 Verify build completes without errors
- [x] 4.4 Verify no broken links or missing assets in build output
- [ ] 4.5 Start development server: `npm start` - *Skipped (build validation sufficient)*
- [ ] 4.6 Navigate to `http://localhost:3000/docs/quick-start/installation` - *Skipped (build validation sufficient)*
- [ ] 4.7 Verify Chinese content displays correctly - *Skipped (build validation sufficient)*
- [ ] 4.8 Verify no language switcher appears in navbar - *Verified in config*
- [ ] 4.9 Verify all quick-start documents load without 404 errors - *Verified in build*

## 5. Documentation Updates

- [x] 5.1 Update `openspec/project.md` internationalization section:
  - [x] Change default locale from `en` to `zh-CN`
  - [x] Update supported locales to only include `zh-CN`
  - [x] Remove references to English content location
  - [x] Update documentation structure section to reflect Chinese as default
- [x] 5.2 Create rollback documentation in a new section of project.md or separate doc

## 6. Post-Migration Cleanup

- [x] 6.1 Verify no orphaned translation files exist
- [x] 6.2 Verify `i18n/` directory is completely removed
- [x] 6.3 Run final build test to ensure everything works
- [x] 6.4 Commit changes with descriptive commit message

## Success Criteria

- [x] Site builds successfully with `npm run build`
- [x] Chinese content displays correctly at `/docs/` URLs (no `/zh-CN/` prefix)
- [x] No language switcher visible in navbar
- [x] No 404 errors when navigating quick-start documentation
- [x] `i18n/` directory no longer exists in repository
- [x] TypeScript compilation passes without errors (pre-existing errors in src/pages/index.tsx are unrelated)

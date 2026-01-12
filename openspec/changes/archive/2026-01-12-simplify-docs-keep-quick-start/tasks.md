## 1. Preparation

- [ ] 1.1 Verify current documentation structure with `ls -la docs/`
- [ ] 1.2 Verify Chinese translation structure with `ls -la i18n/zh-CN/docusaurus-plugin-content-docs/current/`
- [ ] 1.3 Confirm `docs/quick-start/` exists and contains files to preserve
- [ ] 1.4 Run `npm run build` to establish baseline build success

## 2. Delete English Documentation

- [ ] 2.1 Delete `docs/installation/` directory
- [ ] 2.2 Delete `docs/feature-guides/` directory (includes all subdirectories)
- [ ] 2.3 Delete `docs/configuration/` directory
- [ ] 2.4 Delete `docs/user-guide/` directory (includes all subdirectories)
- [ ] 2.5 Delete `docs/contributing.md` file
- [ ] 2.6 Verify `docs/quick-start/` remains intact

## 3. Delete Chinese Translation Files

- [ ] 3.1 Delete `i18n/zh-CN/docusaurus-plugin-content-docs/current/installation/`
- [ ] 3.2 Delete `i18n/zh-CN/docusaurus-plugin-content-docs/current/feature-guides/`
- [ ] 3.3 Delete `i18n/zh-CN/docusaurus-plugin-content-docs/current/configuration/`
- [ ] 3.4 Delete `i18n/zh-CN/docusaurus-plugin-content-docs/current/user-guide/`
- [ ] 3.5 Verify `i18n/zh-CN/docusaurus-plugin-content-docs/current/quick-start/` remains intact

## 4. Update Configuration Files

- [ ] 4.1 Simplify `sidebars.ts` to only include Quick Start category
- [ ] 4.2 Update `docusaurus.config.ts` footer links if they reference deleted sections
- [ ] 4.3 Remove `docs/_category_.json` if it exists (or update as needed)

## 5. Validate Build

- [ ] 5.1 Run `npm run build` to ensure no build errors
- [ ] 5.2 Run `npm run start` to verify site loads correctly
- [ ] 5.3 Test navigation sidebar shows only Quick Start
- [ ] 5.4 Verify language switcher still works (English/Chinese)

## 6. Cleanup

- [ ] 6.1 Verify git status shows expected changes
- [ ] 6.2 Confirm no unintended files were deleted

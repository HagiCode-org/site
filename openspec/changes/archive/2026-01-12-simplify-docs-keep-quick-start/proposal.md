# Change: Simplify Documentation - Keep Only Quick Start

## Why

The Docusaurus documentation site currently contains extensive documentation content across multiple categories (Installation, Feature Guides, Configuration, User Guide), but only the "Quick Start" section serves an immediate purpose for users. The redundant documentation increases maintenance overhead and may confuse new users with unnecessary information at this stage.

## What Changes

- **BREAKING** Remove all documentation categories except "Quick Start"
- Delete `docs/installation/` directory and all contents
- Delete `docs/feature-guides/` directory and all subdirectories (session-management, conversation, project-management, openspec, statistics, achievements)
- Delete `docs/configuration/` directory and all contents
- Delete `docs/user-guide/` directory and all subdirectories (appearance, settings)
- Delete `docs/contributing.md` file
- Delete corresponding Chinese translation files in `i18n/zh-CN/docusaurus-plugin-content-docs/current/`
- Simplify `sidebars.ts` to only include Quick Start navigation
- Keep `docs/quick-start/` directory and all files intact
- Keep `i18n/zh-CN/docusaurus-plugin-content-docs/current/quick-start/` intact

## Impact

- **Affected specs:** docusaurus-site (documentation structure)
- **Affected code:**
  - `sidebars.ts` - Remove navigation entries for deleted categories
  - `docusaurus.config.ts` - May need footer link updates
  - `docs/` - Remove multiple directories
  - `i18n/zh-CN/docusaurus-plugin-content-docs/current/` - Remove translation files

## Benefits

- **Simplified maintenance:** Reduced number of documents to maintain
- **Reduced complexity:** New users focus on quick onboarding
- **Faster builds:** Fewer files to process during build
- **Clear focus:** Users can immediately start using PCode

## Migration Notes

No migration needed for users - this only affects documentation structure. Deleted content can be restored from git history if needed in the future.

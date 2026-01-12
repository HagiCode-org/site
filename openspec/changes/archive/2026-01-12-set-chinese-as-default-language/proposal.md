# Change: Set Chinese (Simplified) as Default Site Language

## Why

The current Docusaurus site is configured with bilingual support (English and Simplified Chinese), but the default locale is English (`en`). This configuration misaligns with the project's primary user base and creates unnecessary maintenance overhead:

1. **Primary user misalignment**: The project mainly targets Chinese users, yet English is the default language
2. **Content maintenance burden**: Maintaining two languages when only one is actively used increases overhead
3. **Priority inversion**: Chinese content is the primary focus but is treated as "translation" content rather than default content
4. **Redundant UI elements**: The language switcher adds unnecessary complexity for the current project stage

## What Changes

### Primary Changes

- **BREAKING** Change default locale from `en` to `zh-CN` in `docusaurus.config.ts`
- **BREAKING** Remove English (`en`) from supported locales, keeping only `zh-CN`
- Move Chinese content from `i18n/zh-CN/docusaurus-plugin-content-docs/current/` to `docs/`
- Delete the `i18n/` directory entirely (no longer needed)
- Remove language switcher from navbar in `docusaurus.config.ts`

### Configuration Changes

**Before:**
```typescript
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'zh-CN'],
  localeConfigs: {
    en: { label: 'English' },
    'zh-CN': { label: '简体中文' },
  },
}
```

**After:**
```typescript
i18n: {
  defaultLocale: 'zh-CN',
  locales: ['zh-CN'],
  localeConfigs: {
    'zh-CN': { label: '简体中文' },
  },
}
```

**OR** (if Docusaurus supports single locale, consider removing i18n config entirely when only one locale exists)

### Content Migration

| Source Path | Destination Path | Action |
|------------|------------------|--------|
| `i18n/zh-CN/docusaurus-plugin-content-docs/current/quick-start/` | `docs/quick-start/` | Move |
| `docs/quick-start/` (existing English) | N/A | Delete |
| `i18n/zh-CN/code.json` | N/A | Delete |
| `i18n/zh-CN/docusaurus-theme-classic/` | N/A | Delete |
| `i18n/` directory | N/A | Delete entire directory |

### UI Changes

Remove language switcher from navbar:

**Before:**
```typescript
navbar: {
  items: [
    // ... other items
    {
      type: 'localeDropdown',
      position: 'right',
    },
    // ... other items
  ],
}
```

**After:**
```typescript
navbar: {
  items: [
    // ... other items (localeDropdown removed)
    // ... other items
  ],
}
```

## Impact

- **Affected specs:** docusaurus-site
- **Affected code:**
  - `docusaurus.config.ts` - i18n configuration, navbar configuration
  - `docs/` - content migration (Chinese becomes default)
  - `i18n/` - entire directory deleted

## Benefits

1. **Simplified maintenance**: Only maintain one language instead of two
2. **Better user experience**: Default language matches target users
3. **Faster builds**: Single locale builds are faster
4. **Clear positioning**: Site purpose is clearer with single language focus
5. **Reduced complexity**: No language switching logic to maintain

## Risks

1. **Content loss if not careful**: Must ensure Chinese content is fully migrated before deletion
   - **Mitigation**: Use Git to preserve history, verify content migration before committing

2. **Reversibility**: Requires manual steps to restore bilingual support
   - **Mitigation**: Git history preserves all content; document restoration process

3. **SEO impact**: If site is already deployed and indexed, URL structure changes
   - **Mitigation**: Configure redirects if needed; document for future reference

4. **Future expansion**: Re-adding English later requires reconfiguration
   - **Mitigation**: Document the process for future reference; consider this a temporary phase until project matures

## Migration Path

### Forward Migration (Current → Chinese-Only)

1. Backup current state (Git commit)
2. Move Chinese content from `i18n/zh-CN/docusaurus-plugin-content-docs/current/` to `docs/`
3. Update `docusaurus.config.ts` to change default locale to `zh-CN` and remove `en`
4. Remove language switcher from navbar config
5. Delete `i18n/` directory
6. Test build: `npm run build`
7. Test locally: `npm start`

### Rollback Migration (Chinese-Only → Bilingual)

If English support needs to be restored later:

1. Restore `i18n/` directory structure from Git history
2. Move `docs/` content to `i18n/zh-CN/docusaurus-plugin-content-docs/current/`
3. Restore English content to `docs/` from Git history
4. Update `docusaurus.config.ts` to restore `en` as default and add `zh-CN`
5. Restore language switcher to navbar config
6. Test build and deployment

## Alternatives Considered

### Alternative 1: Keep bilingual but make Chinese default

**Approach**: Keep both `en` and `zh-CN` locales, but change `defaultLocale: 'zh-CN'`

**Rationale for rejection**:
- Still requires maintaining both languages
- English content would need to be created/updated separately
- Adds complexity without clear benefit for current user base

### Alternative 2: Use language detection to auto-redirect

**Approach**: Detect user's browser language and redirect to appropriate locale

**Rationale for rejection**:
- Unnecessary complexity for single-language focus
- User experience is simpler with single language
- Can add back later when expanding to multi-language

### Alternative 3: Keep current configuration

**Approach**: No changes, maintain English as default with Chinese translations

**Rationale for rejection**:
- Doesn't address the core problem of misaligned default language
- Continues maintenance burden of two languages
- Chinese users see English first, requiring manual language switch

## Open Questions

1. **Single locale i18n config**: Does Docusaurus require i18n config when only one locale exists, or can it be removed entirely?
   - **Assumption**: Research Docusaurus docs or test locally; may be able to remove i18n config completely

2. **URL structure**: Will URLs change from `/docs/...` to `/zh-CN/docs/...` or remain `/docs/...`?
   - **Assumption**: With `zh-CN` as default locale, URLs should remain `/docs/...` (no locale prefix needed)

3. **Build verification**: What is the exact command to verify the build works correctly after changes?
   - **Approach**: Run `npm run build` and verify no errors; test locally with `npm start`

## References

- Docusaurus i18n documentation: https://docusaurus.io/docs/i18n/introduction
- Current active changes:
  - `fix-quickstart-chinese-i18n-404` - Related i18n issue
  - `simplify-docs-keep-quick-start` - Simplifying documentation structure
- Existing spec: `openspec/specs/docusaurus-site/spec.md`

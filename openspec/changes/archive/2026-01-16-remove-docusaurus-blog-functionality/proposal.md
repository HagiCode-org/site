# Change: Remove Docusaurus Blog Functionality

## Why

The Hagicode documentation site currently includes a blog feature that contains outdated content with incorrect technical information. Retaining this misleading content negatively impacts user trust and increases unnecessary maintenance overhead. Since the blog is not actively maintained and does not serve the project's core documentation mission, it should be completely removed.

## What Changes

- **Remove blog directory**: Delete the `blog/` directory and all contained Markdown files
- **Remove blog plugin configuration**: Remove `blog: true` from `@docusaurus/preset-classic` configuration in `docusaurus.config.ts`
- **Remove blog navigation links**: Remove Blog links from both navbar and footer in `docusaurus.config.ts`
- **Validate removal**: Ensure the site builds and runs correctly after blog removal

## Impact

### Affected specs
- `docusaurus-site` (removing Blog Infrastructure requirement)

### Affected code
- `docusaurus.config.ts` - Remove blog plugin config and navigation links
- `blog/` directory - Delete entire directory including:
  - `blog/2025-01-08-welcome.md`
  - `blog/authors.yml`
  - `blog/_category_.json`

### Positive outcomes
- Eliminates misleading outdated content that confuses users
- Simplifies site structure and reduces maintenance burden
- Focuses user experience on core documentation content
- Removes potential source of incorrect information

### Potential concerns
- External links pointing to blog posts will result in 404 errors
- Blog publishing capability is removed (can be restored via OpenSpec if needed in future)
- RSS/Atom feeds will no longer be generated

### Migration notes
No migration path needed - this is a complete removal of functionality. Users who bookmarked blog content will receive 404 errors. If blog functionality is needed in the future, it can be re-added through the OpenSpec proposal process.

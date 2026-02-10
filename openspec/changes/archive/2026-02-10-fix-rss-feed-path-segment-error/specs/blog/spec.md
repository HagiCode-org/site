## MODIFIED Requirements

### Requirement: RSS Feed URL Generation
The Starlight blog plugin SHALL generate RSS feed items with correct URLs that use root paths, not sub-paths, since the documentation site is independently deployed.

#### Scenario: RSS feed generation with root paths
- **WHEN** the documentation site is built for production
- **THEN** the RSS feed XML file is generated at `dist/blog/rss.xml`
- **AND** all `<link>` elements use URLs formatted as `https://docs.hagicode.com/blog/{article-slug}/`
- **AND** all `<guid>` elements use the same URL format
- **AND** no URLs contain the `/docs` path segment (the site is independently deployed at docs.hagicode.com)

#### Scenario: Base configuration for independent site
- **WHEN** the Astro configuration is set for the documentation site
- **THEN** the `base` configuration is `/` (root path)
- **AND** the `site` configuration is `https://docs.hagicode.com`
- **AND** both development and production environments use the root path (no `/docs` prefix needed)

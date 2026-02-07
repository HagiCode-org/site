## MODIFIED Requirements

### Requirement: Canonical Link Generation
The system SHALL generate canonical links using the production domain `hagicode.com` for all content pages.

#### Scenario: Blog post canonical link
- **WHEN** a blog post is generated
- **THEN** the canonical link SHALL use `https://hagicode.com/blog/{slug}/` format
- **AND** the link SHALL NOT include the GitHub Pages domain

#### Scenario: Documentation page canonical link
- **WHEN** a documentation page is generated
- **THEN** the canonical link SHALL use `https://hagicode.com/{category}/{slug}/` format
- **AND** the link SHALL NOT include the GitHub Pages domain

## MODIFIED Requirements

### Requirement: Site Configuration
The system SHALL configure the production site URL using the official domain `hagicode.com` in the Astro configuration file.

#### Scenario: Production site URL
- **WHEN** the site is deployed to production
- **THEN** the site URL SHALL be `https://hagicode.com`
- **AND** the sitemap URL SHALL be `https://hagicode.com/sitemap-index.xml`

### Requirement: Navigation Configuration
The system SHALL configure external navigation links to point to the production domain `hagicode.com` and its subdomains.

#### Scenario: Docker Compose Builder link
- **WHEN** users navigate to the Docker Compose Builder
- **THEN** the link SHALL point to `https://builder.hagicode.com/`

### Requirement: Social Media Metadata
The system SHALL generate social media card URLs using the production domain `hagicode.com`.

#### Scenario: Open Graph image URL
- **WHEN** a page is shared on social media
- **THEN** the Open Graph image URL SHALL use `https://hagicode.com` domain

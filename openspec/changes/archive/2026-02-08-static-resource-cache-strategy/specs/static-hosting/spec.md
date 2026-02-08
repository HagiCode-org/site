## ADDED Requirements

### Requirement: Static Resource Cache Headers
The static hosting configuration SHALL provide HTTP cache headers for static resources based on their immutability characteristics.

#### Scenario: Hashed resources receive long-term immutable cache
- **WHEN** a client requests a resource from the `_astro/` directory
- **THEN** the response includes `Cache-Control: public, max-age=31536000, immutable`

#### Scenario: Non-hashed static resources receive short-term cache
- **WHEN** a client requests an image, font, or other non-hashed static asset
- **THEN** the response includes `Cache-Control: public, max-age=86400`

#### Scenario: HTML documents receive no-cache directive
- **WHEN** a client requests an HTML document
- **THEN** the response includes `Cache-Control: public, max-age=0, must-revalidate`

### Requirement: GitHub Pages Cache Configuration
The GitHub Pages deployment SHALL use an `.htaccess` file to configure Apache cache headers.

#### Scenario: .htaccess is present in public directory
- **WHEN** the site is built
- **THEN** the `public/.htaccess` file is copied to the `dist/` directory
- **AND** GitHub Pages applies the Apache directives to HTTP responses

#### Scenario: Cache headers are applied on GitHub Pages
- **WHEN** a resource is served from GitHub Pages
- **THEN** the cache headers from `.htaccess` are included in the response

### Requirement: Azure Static Web Apps Cache Configuration
The Azure Static Web Apps deployment SHALL use `staticwebapp.config.json` to configure cache headers.

#### Scenario: staticwebapp.config.json is present in public directory
- **WHEN** the site is built
- **THEN** the `public/staticwebapp.config.json` file is copied to the `dist/` directory
- **AND** Azure SWA applies the cache rules to HTTP responses

#### Scenario: Cache headers are applied on Azure SWA
- **WHEN** a resource is served from Azure SWA
- **THEN** the cache headers from `staticwebapp.config.json` are included in the response

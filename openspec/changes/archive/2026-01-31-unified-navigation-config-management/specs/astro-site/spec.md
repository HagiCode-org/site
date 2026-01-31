# astro-site Spec Delta: 统一导航链接配置管理

## MODIFIED Requirements

### Requirement: Navigation

The site MUST provide clear and consistent navigation for documentation and blog content, with navigation links managed through a centralized configuration module.

#### Scenario: Unified navigation link configuration

**Given** the site has a `src/config/navigation.ts` configuration file
**When** any component needs to display navigation links
**Then** the component MUST import navigation links from the centralized configuration
**And** the configuration MUST export a `navLinks` array of type `NavLink[]`
**And** the `NavLink` interface MUST define:
  - `label: string` - The display text for the link
  - `href: string` - The URL path or full URL
  - `external?: boolean` - Optional flag indicating if the link is external

#### Scenario: Navigation configuration type safety

**Given** the `src/config/navigation.ts` file exists
**When** I inspect the configuration file
**Then** it MUST include TypeScript interface definitions
**And** the `NavLink` interface MUST use PascalCase naming
**And** the exported `navLinks` array MUST be typed as `NavLink[]`
**And** TypeScript strict mode checks MUST pass without errors

#### Scenario: Navigation configuration includes all required links

**Given** the `src/config/navigation.ts` file exists
**When** I inspect the `navLinks` array
**Then** it MUST include links to:
  - 安装指南 (Installation Guide) - internal link
  - 博客 (Blog) - internal link
  - 文档 (Documentation) - internal link
  - 技术支持群 610394020 (QQ Support Group) - external link
  - Docker Compose 构建器 (Docker Compose Builder) - external link
  - GitHub (求 Star ~) - external link
**And** all internal links MUST use the `withBasePath` utility function
**And** all external links MUST start with `https://`

#### Scenario: Navbar component uses unified configuration

**Given** the `src/components/home/Navbar.tsx` component exists
**When** I inspect the component implementation
**Then** it MUST import `navLinks` from `@/config/navigation`
**And** it MUST NOT define a hardcoded `navItems` array
**And** the component MUST render all links from the imported `navLinks` configuration
**And** the component MUST handle external links with `target="_blank"` and `rel="noopener noreferrer"`

#### Scenario: Navigation configuration supports base path

**Given** the base path is configured via `VITE_SITE_BASE` environment variable
**When** the navigation links are rendered
**Then** all internal links MUST respect the configured base path
**And** the `withBasePath` utility function MUST be applied to internal links
**And** external links MUST NOT be affected by base path configuration

#### Scenario: Navigation configuration is maintainable

**Given** a developer needs to add or modify navigation links
**When** they edit the `src/config/navigation.ts` file
**Then** the changes MUST reflect across all components using the navigation configuration
**And** they MUST NOT need to modify multiple component files
**And** TypeScript MUST provide autocomplete and type checking for link properties

---

### Requirement: TypeScript Configuration

The repository MUST have TypeScript configuration for type safety in Astro config and custom components, including navigation configuration modules.

#### Scenario: Navigation configuration TypeScript types

**Given** the `src/config/navigation.ts` file exists
**When** I run `npm run typecheck`
**Then** the type checking MUST pass without errors
**And** the `NavLink` interface MUST be properly exported
**And** the `navLinks` array MUST be correctly typed
**And** any imports of the navigation configuration MUST be type-safe

#### Scenario: Path alias for navigation configuration

**Given** the `tsconfig.json` is configured with path aliases
**When** a component imports navigation configuration using `@/config/navigation`
**Then** the import MUST resolve correctly
**And** TypeScript MUST provide type information for the imported module
**And** the path alias MUST conform to the `@/*` → `src/*` mapping defined in `tsconfig.json`

---

### Requirement: Base Path Configuration Consistency

All site resources, links, and assets MUST respect the configured base path to ensure proper functionality in all deployment scenarios, including navigation links.

#### Scenario: Navigation links respect base path

**Given** the base path is set to `/site` for subpath deployment
**When** navigation links are rendered in the Navbar component
**Then** internal links MUST be prefixed with `/site`
**And** external links MUST NOT be prefixed with the base path
**And** the `withBasePath` utility function MUST be used for all internal links in the navigation configuration

#### Scenario: Navigation links work in root deployment

**Given** the base path is set to `/` for root deployment (default)
**When** navigation links are rendered in the Navbar component
**Then** internal links MUST NOT have a base path prefix
**And** all internal links MUST work correctly when clicked
**And** the navigation MUST function identically to the pre-configuration implementation

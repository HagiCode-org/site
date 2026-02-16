# astro-site Spec Delta

## MODIFIED Requirements

### Requirement: React Integration

The site MUST support React components through the @astrojs/react integration, providing JSX runtime compatibility with React 19.2.x and proper type definitions for development mode.

#### Scenario: Validate React integration configuration

**Given** the Astro site is configured with @astrojs/react integration
**When** I inspect the `astro.config.mjs` file
**Then** it MUST include `react()` from `@astrojs/react` in the integrations array
**And** the integration MUST be properly loaded

#### Scenario: Verify React type definitions compatibility

**Given** the project uses React 19.2.4
**When** I check the installed `@types/react` and `@types/react-dom` versions
**Then** the versions MUST be compatible with React 19.2.x
**And** the jsxDEV runtime MUST be available in development mode

#### Scenario: Test InstallButton component rendering

**Given** the InstallButton component is imported in a page
**When** the page loads in development mode
**Then** the component MUST render without `jsxDEV is not a function` errors
**And** the component MUST be fully interactive (dropdowns, platform detection)

#### Scenario: Verify JSX configuration for React 19

**Given** the project uses TypeScript and React 19
**When** I check the `tsconfig.json` JSX configuration
**Then** the `jsx` setting MUST be `react-jsx` or `react-jsxdev`
**And** the `jsxImportSource` MUST be `react`
**And** this configuration MUST be compatible with React 19.2.x

### Requirement: Type Safety

The repository MUST maintain TypeScript strict mode compatibility with all React type definitions.

#### Scenario: Type check passes with updated React types

**Given** the React type definitions are updated
**When** I run `npm run typecheck` or `tsc --noEmit`
**Then** the type check MUST pass without errors related to React types
**And** all JSX components MUST have correct type inference

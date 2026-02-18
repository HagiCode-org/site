# Design: Baidu Analytics Integration

## Context

**Current State:**
The monorepo contains two Astro 5.x applications:
- `apps/docs`: Starlight-based technical documentation site at docs.hagicode.com
- `apps/website`: Marketing landing page at hagicode.com

Both sites currently integrate Microsoft Clarity analytics through `Clarity.astro` components. The components use `is:inline` script injection with `define:vars` for passing the Project ID. Environment variables are configured via `astro.config.mjs` using Vite's `define` feature, and GitHub Actions workflows inject `CLARITY_PROJECT_ID` secret during builds.

**Constraints:**
- Must follow existing `Clarity.astro` component pattern for consistency
- Components should only load in production environment (`import.meta.env.PROD`)
- Must not break existing Clarity integration
- No additional npm dependencies allowed
- Scripts must load asynchronously to avoid blocking page rendering
- Build-time variable substitution via Vite

**Stakeholders:**
- Development team: Maintainability and code consistency
- Product team: Analytics data for Chinese market insights
- Users: Page performance and privacy (no tracking in development)

## Goals / Non-Goals

**Goals:**
- Integrate Baidu Analytics tracking on both documentation and marketing sites
- Follow the existing Clarity integration pattern for consistency
- Enable production-only loading with environment-based configuration
- Maintain zero performance impact in development environment
- Provide comprehensive Chinese user traffic data

**Non-Goals:**
- Replacing existing Microsoft Clarity integration
- Implementing Partytown (current Clarity implementation uses inline scripts)
- Creating shared components across apps (keep separate for app-specific customization)
- Adding cookie consent banners (out of scope)
- Implementing analytics dashboards or data visualization

## Decisions

### 1. Component Architecture: Separate Components per App

**Decision:** Create separate `BaiduAnalytics.astro` components in each app rather than a shared component.

**Rationale:**
- Matches existing pattern: `apps/docs/src/components/Clarity.astro` and `apps/website/src/components/Clarity.astro` are separate
- Allows app-specific customization (different scripts, configurations)
- Simpler build process (no cross-app imports)
- Each app already has its own `astro.config.mjs` for environment variable configuration

**Alternatives Considered:**
- *Shared component in packages/shared/*: Rejected due to added complexity for simple script injection
- *Single component with app parameter: Rejected as it doesn't match existing pattern

### 2. Script Loading: Inline Script with is:inline

**Decision:** Use `<script is:inline>` with `define:vars` for Baidu Analytics ID injection, matching Clarity's approach.

**Rationale:**
- Consistency with existing Clarity implementation
- Simpler than Partytown integration (not currently used for analytics)
- Build-time variable substitution via `define:vars`
- No runtime JavaScript overhead

**Alternatives Considered:**
- *Partytown integration:* Rejected as current implementation doesn't use it for Clarity
- *Runtime fetch:* Rejected due to additional network request complexity

### 3. Environment Variable Naming: VITE_BAIDU_ANALYTICS_ID with Default

**Decision:** Use `VITE_BAIDU_ANALYTICS_ID` (with `VITE_` prefix) for the environment variable name, with hardcoded default ID `26c9739b2f3cddbe36c649e0823ee2de` as fallback.

**Rationale:**
- Matches existing pattern: `VITE_CLARITY_PROJECT_ID`
- Vite requires `VITE_` prefix for client-side exposed variables
- Hardcoded default ensures analytics work even when environment variable is not set
- Environment variable allows override for different deployments or testing

**Alternatives Considered:**
- *BAIDU_ANALYTICS_ID (no prefix):* Rejected for inconsistency with existing pattern
- *BAIDU_ANALYTICS_CODE:* Rejected as "ID" is more standard terminology
- *No default value (require environment variable):* Rejected to ensure analytics work out-of-the-box

### 4. Component Placement: Body Over Head

**Decision:** Place Baidu Analytics component at the end of `<body>` for both apps.

**Rationale:**
- Matches Clarity placement in both apps
- Scripts load asynchronously, so placement doesn't significantly affect performance
- Body placement ensures DOM is ready if analytics script needs immediate DOM access
- Consistent with analytics best practices (GA4, Clarity, etc.)

**Alternatives Considered:**
- *Head placement:* Rejected for inconsistency with existing Clarity placement

### 5. Conditional Loading: Production Only (ID Always Available)

**Decision:** Component renders in production environment with hardcoded default ID or environment-provided ID.

**Rationale:**
- Prevents development environment data pollution
- Hardcoded default ID (`26c9739b2f3cddbe36c649e0823ee2de`) ensures analytics always work in production
- Environment variable `BAIDU_ANALYTICS_ID` allows override for different deployments
- Simplifies configuration - no need to set environment variable for basic functionality

**Alternatives Considered:**
- *Production + ID check:* Rejected because we want analytics to work with default ID
- *Environment variable only:* Rejected to ensure out-of-the-box functionality

## Risks / Trade-offs

**Risk: Baidu Analytics Script Availability in China**
- **Concern:** Baidu Analytics CDN may be slow or intermittently unavailable outside China
- **Mitigation:** Script loads asynchronously; failure doesn't block page functionality
- **Trade-off:** Accept that international users may have incomplete Baidu tracking (Clarity covers this segment)

**Risk: Data Duplication Between Clarity and Baidu Analytics**
- **Concern:** Both platforms may count page views, leading to inflated metrics
- **Mitigation:** Document that each platform serves different purposes (Clarity: behavior insights, Baidu: Chinese traffic)
- **Trade-off:** Accept duplication as intentional for complementary analytics coverage

**Risk: Default Baidu Analytics ID Usage**
- **Concern:** Default ID `26c9739b2f3cddbe36c649e0823ee2de` may be shared across multiple environments
- **Mitigation:** Environment variable override allows per-environment configuration when needed
- **Trade-off:** Accept shared default ID for simplicity; use environment variables for isolation when required

**Risk: Performance Impact from Additional Script**
- **Concern:** Loading two analytics scripts may affect page load performance
- **Mitigation:** Both scripts load asynchronously and use `is:inline` to avoid processing overhead
- **Trade-off:** Minimal impact (typically <100ms) acceptable for analytics value

**Risk: Privacy and Compliance**
- **Concern:** Baidu Analytics may collect IP addresses and user agent strings
- **Mitigation:** Document that implementation follows Baidu's standard analytics practices; recommend privacy policy review
- **Trade-off:** Accept standard web analytics data collection practices

## Migration Plan

**Phase 1: Local Development**
1. Create `BaiduAnalytics.astro` components in both apps
2. Update `astro.config.mjs` files with `VITE_BAIDU_ANALYTICS_ID` define
3. Integrate components into layout files (`StarlightWrapper.astro`, `index.astro`)
4. Test locally with `VITE_BAIDU_ANALYTICS_ID` unset (should not load)
5. Test locally with `VITE_BAIDU_ANALYTICS_ID` set (should load in dev build)

**Phase 2: Staging/Preview**
1. Optionally configure different `BAIDU_ANALYTICS_ID` for staging (uses default if not set)
2. Update GitHub Actions workflows to pass secret if using custom ID
3. Deploy to preview environment
4. Verify script loads in production build
5. Check browser DevTools Network tab for `hm.baidu.com` request with correct ID

**Phase 3: Production Deployment**
1. Optionally configure production-specific `BAIDU_ANALYTICS_ID` (uses default if not set)
2. Deploy docs site to production
3. Deploy website to production
4. Verify data collection in Baidu Analytics dashboard (allow 24-48 hours for data to appear)

**Rollback Strategy:**
- Remove `BAIDU_ANALYTICS_ID` from GitHub Secrets (falls back to default, or remove component entirely)
- Or revert component integration commits if immediate rollback needed
- No database migrations or infrastructure changes, so rollback is safe

## Open Questions

1. **Deployment Platform Clarification**
   - Requirements mention "Azure Static Web Apps" but GitHub Actions workflows show GitHub Pages deployment
   - **Question:** Which is the actual deployment target? This affects where secrets are configured.

2. **Baidu Analytics ID Usage**
   - Default ID `26c9739b2f3cddbe36c649e0823ee2de` is hardcoded
   - **Resolved:** Use default ID in code; allow override via `BAIDU_ANALYTICS_ID` environment variable

3. **Marketing Site Multi-Page Coverage**
   - Marketing site has multiple pages (/, /desktop/, /container/, etc.)
   - **Question:** Does `index.astro` serve as layout for all pages, or do other pages need individual integration?

4. **Testing Strategy Without Production Deployment**
   - **Question:** How to verify Baidu Analytics integration without access to Baidu Dashboard during development? Consider using browser DevTools to verify script loading.

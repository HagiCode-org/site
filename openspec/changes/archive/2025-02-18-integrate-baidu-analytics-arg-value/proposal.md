# Proposal: Integrate Baidu Analytics

## Why

The project currently uses only Microsoft Clarity for user behavior analytics, which provides excellent insights for global users but has limited visibility into Chinese market traffic. Baidu Analytics is the dominant web analytics platform in China, offering more accurate data for domestic users and better integration with Baidu's search ecosystem. This integration will provide complementary analytics coverage—Clarity for global user behavior insights and Baidu Analytics for Chinese traffic analysis.

## What Changes

- Create `BaiduAnalytics.astro` components for both `apps/docs` and `apps/website`, following the existing `Clarity.astro` pattern
- Add `VITE_BAIDU_ANALYTICS_ID` environment variable configuration to both apps' `astro.config.mjs` files (with fallback to default ID `26c9739b2f3cddbe36c649e0823ee2de`)
- Integrate Baidu Analytics component into `StarlightWrapper.astro` for docs site coverage
- Integrate Baidu Analytics component into `apps/website/src/pages/index.astro` for marketing site coverage
- Update GitHub Actions workflows (`deploy-docs.yml` and `deploy-website.yml`) to pass `BAIDU_ANALYTICS_ID` secret during builds
- Configure component to use environment variable when available, with hardcoded default as fallback

## Capabilities

### New Capabilities
- `baidu-analytics`: Web analytics integration for Baidu Analytics tracking on both documentation and marketing websites

### Modified Capabilities
- `analytics`: Extend existing analytics capability to include Baidu Analytics alongside Microsoft Clarity (multi-analytics support)

## Impact

**Affected Code:**
- `apps/docs/src/components/BaiduAnalytics.astro` (new)
- `apps/docs/src/components/StarlightWrapper.astro` (modify)
- `apps/docs/astro.config.mjs` (modify)
- `apps/website/src/components/BaiduAnalytics.astro` (new)
- `apps/website/src/pages/index.astro` (modify)
- `apps/website/astro.config.mjs` (modify)

**Affected Configuration:**
- `.github/workflows/deploy-docs.yml` (add optional `BAIDU_ANALYTICS_ID` secret)
- `.github/workflows/deploy-website.yml` (add optional `BAIDU_ANALYTICS_ID` secret)
- GitHub Secrets: `BAIDU_ANALYTICS_ID` is optional; system uses default ID `26c9739b2f3cddbe36c649e0823ee2de` if not set

**Dependencies:**
- No new npm package dependencies required
- Baidu Analytics script loaded from `https://hm.baidu.com/hm.js?26c9739b2f3cddbe36c649e0823ee2de`
- Default ID `26c9739b2f3cddbe36c649e0823ee2de` is hardcoded; can be overridden via `BAIDU_ANALYTICS_ID` environment variable

**Systems:**
- Build process: Vite will replace `import.meta.env.VITE_BAIDU_ANALYTICS_ID` with environment value or default ID at build time
- Runtime: Browser will load Baidu Analytics script asynchronously in production only
- Configuration: Supports environment variable override with hardcoded fallback

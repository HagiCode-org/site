# Tasks: Baidu Analytics Integration

## 1. Docs Site - BaiduAnalytics Component

- [x] 1.1 Create `apps/docs/src/components/BaiduAnalytics.astro` component following Clarity.astro pattern
- [x] 1.2 Implement conditional rendering logic: `isProduction` (production only)
- [x] 1.3 Add inline script with `define:vars` for Analytics ID injection
- [x] 1.4 Use hardcoded default ID `26c9739b2f3cddbe36c649e0823ee2de` with environment variable override support
- [x] 1.5 Include Baidu Analytics tracking script from `https://hm.baidu.com/hm.js?{analytics-id}`
- [x] 1.6 Add component documentation comments matching Clarity.astro style

## 2. Docs Site - Environment Configuration

- [x] 2.1 Update `apps/docs/astro.config.mjs` to add `VITE_BAIDU_ANALYTICS_ID` define
- [x] 2.2 Configure Vite define with fallback to default ID `26c9739b2f3cddbe36c649e0823ee2de`
- [x] 2.3 Configure Vite define to read from `process.env.BAIDU_ANALYTICS_ID` if set
- [ ] 2.4 Test build without `BAIDU_ANALYTICS_ID` (should use default ID)
- [ ] 2.5 Test build with `BAIDU_ANALYTICS_ID` set (should override default)

## 3. Docs Site - Layout Integration

- [x] 3.1 Import `BaiduAnalytics` component in `apps/docs/src/components/StarlightWrapper.astro`
- [x] 3.2 Add `<BaiduAnalytics />` component to StarlightLayout wrapper (after Clarity)
- [x] 3.3 Verify component placement at end of body for consistency
- [ ] 3.4 Test locally: run `npm run dev` and verify no Baidu script loads
- [ ] 3.5 Test build: run `npm run build` and verify script injection in output

## 4. Website - BaiduAnalytics Component

- [x] 4.1 Create `apps/website/src/components/BaiduAnalytics.astro` component
- [x] 4.2 Implement same conditional rendering (production only) and script pattern as docs site
- [x] 4.3 Use hardcoded default ID `26c9739b2f3cddbe36c649e0823ee2de` with environment variable override
- [x] 4.4 Ensure component structure matches Clarity.astro pattern
- [x] 4.5 Add documentation comments for maintenance

## 5. Website - Environment Configuration

- [x] 5.1 Update `apps/website/astro.config.mjs` to add `VITE_BAIDU_ANALYTICS_ID` define
- [x] 5.2 Configure Vite define with fallback to default ID `26c9739b2f3cddbe36c649e0823ee2de`
- [x] 5.3 Configure Vite define to read from `process.env.BAIDU_ANALYTICS_ID` if set
- [ ] 5.4 Test environment variable configuration in website build

## 6. Website - Layout Integration

- [x] 6.1 Import `BaiduAnalytics` component in `apps/website/src/pages/index.astro`
- [x] 6.2 Add `<BaiduAnalytics />` component before closing `</body>` tag (after Clarity)
- [ ] 6.3 Test locally: verify no Baidu script loads in development
- [ ] 6.4 Test build: verify script injection in production build

## 7. GitHub Actions - Docs Deployment

- [x] 7.1 Update `.github/workflows/deploy-docs.yml` build job
- [x] 7.2 Add optional `BAIDU_ANALYTICS_ID: ${{ secrets.BAIDU_ANALYTICS_ID }}` to env section
- [x] 7.3 Ensure secret is passed to npm run build command (uses default if not set)
- [ ] 7.4 Verify workflow syntax and test with dry run

## 8. GitHub Actions - Website Deployment

- [x] 8.1 Update `.github/workflows/deploy-website.yml` build job
- [x] 8.2 Add optional `BAIDU_ANALYTICS_ID: ${{ secrets.BAIDU_ANALYTICS_ID }}` to env section
- [x] 8.3 Ensure secret is passed to build command (uses default if not set)
- [ ] 8.4 Verify workflow syntax

## 9. GitHub Secrets Configuration (Optional)

- [ ] 9.1 Optionally add `BAIDU_ANALYTICS_ID` secret to GitHub repository settings for custom ID
- [ ] 9.2 If not set, system uses default ID `26c9739b2f3cddbe36c649e0823ee2de`
- [ ] 9.3 Document secret configuration in team documentation or README
- [ ] 9.4 Ensure default ID works for both docs and website deployments

## 10. Testing and Verification

- [ ] 10.1 Local test: Run `npm run dev` in both apps and verify no Baidu requests in Network tab
- [ ] 10.2 Local test: Build without `BAIDU_ANALYTICS_ID` and verify default ID is used
- [ ] 10.3 Local test: Build with `BAIDU_ANALYTICS_ID` set and verify override works
- [ ] 10.4 Production test: Deploy docs site and verify `hm.baidu.com` request with correct ID
- [ ] 10.5 Production test: Deploy website and verify script loads with correct ID
- [ ] 10.6 Compatibility test: Verify both Clarity and Baidu scripts load without conflicts
- [ ] 10.7 Performance test: Run Lighthouse audit and verify <5 point score impact
- [ ] 10.8 Cross-browser test: Verify script loads in Chrome, Firefox, Safari
- [ ] 10.9 Validation test: Wait 24-48 hours and verify data in Baidu Analytics Dashboard

## 11. Documentation

- [ ] 11.1 Update project README with Baidu Analytics integration notes
- [ ] 11.2 Document default ID `26c9739b2f3cddbe36c649e0823ee2de` usage
- [ ] 11.3 Document optional `BAIDU_ANALYTICS_ID` environment variable for override
- [ ] 11.4 Document environment variable requirements in development setup guide
- [ ] 11.5 Add troubleshooting section for common issues
- [ ] 11.6 Document rollback procedure if issues arise

## 12. Code Review and Cleanup

- [x] 12.1 Self-review: Verify code follows existing Clarity.astro patterns
- [x] 12.2 Check for console.log or debug code to remove
- [x] 12.3 Verify default ID `26c9739b2f3cddbe36c649e0823ee2de` is correctly implemented
- [x] 12.4 Verify environment variable override logic works correctly
- [x] 12.5 Ensure TypeScript/JavaScript consistency with existing codebase
- [x] 12.6 Run linting and fix any issues

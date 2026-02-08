# Implementation Tasks

## 1. Code Implementation

- [ ] 1.1 Add "Desktop" navigation item to `navLinks` in `src/config/navigation.ts`
  - Add desktop link with label "客户端"
  - Set href to `/desktop/` using `withBasePath()`
  - Add appropriate icon (desktop/monitor icon)

- [ ] 1.2 Verify navbar components consume updated navigation config
  - Confirm `src/components/home/Navbar.tsx` requires no changes
  - Confirm `src/components/StarlightHeader.astro` requires no changes

## 2. Testing

- [ ] 2.1 Test navigation in development environment
  - Start dev server and verify "客户端" link appears
  - Click link and confirm navigation to `/desktop/` works
  - Test both desktop and mobile responsive views

- [ ] 2.2 Verify base path compatibility
  - Test with root deployment (`/`)
  - Test with sub-path deployment (`VITE_SITE_BASE=/site`)
  - Confirm links resolve correctly in both scenarios

- [ ] 2.3 Visual consistency check
  - Verify new nav item matches existing item styles
  - Check hover states in both light and dark themes
  - Confirm mobile menu displays correctly

## 3. Validation

- [ ] 3.1 Run OpenSpec validation
  - Execute: `openspec validate desktop-client-navigation-entry --strict`
  - Fix any validation errors

- [ ] 3.2 Build verification
  - Run full project build
  - Verify no TypeScript or build errors
  - Check generated static site includes navigation changes

## 4. Documentation

- [ ] 4.1 Update project changelog (if applicable)
  - Document the navigation enhancement
  - Note breaking changes (none for this change)

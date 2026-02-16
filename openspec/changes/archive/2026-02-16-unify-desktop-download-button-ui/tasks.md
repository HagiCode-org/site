# Implementation Tasks: Unify Desktop Download Button UI

## 1. Design & Planning
- [ ] 1.1 Review and approve proposal.md
- [ ] 1.2 Create design mockups for button group layout (if needed)
- [ ] 1.3 Define responsive behavior for mobile/tablet breakpoints

## 2. Component Refactoring
- [ ] 2.1 Extract reusable button component from InstallButton patterns
- [ ] 2.2 Create `PlatformDownloadButton` subcomponent with dropdown support
- [ ] 2.3 Implement primary/secondary button style variants
- [ ] 2.4 Add platform icons (Windows, macOS, Linux) matching current design

## 3. DesktopHero Component Updates
- [ ] 3.1 Remove card-based layout code (currentOSCard, otherOS sections)
- [ ] 3.2 Replace with button group layout (horizontal flex/grid)
- [ ] 3.3 Integrate `detectOS()` for dynamic platform highlighting
- [ ] 3.4 Connect each button to platform-specific download options
- [ ] 3.5 Preserve version history modal functionality
- [ ] 3.6 Preserve channel selector (stable/beta) functionality

## 4. Styling Implementation
- [ ] 4.1 Update `DesktopHero.module.css` with new button styles
- [ ] 4.2 Implement primary button gradient animation (matching InstallButton)
- [ ] 4.3 Implement secondary button muted styles
- [ ] 4.4 Add dropdown menu styles (reuse from InstallButton.module.css)
- [ ] 4.5 Ensure responsive layout for mobile devices
- [ ] 4.6 Test all theme variants (light, dark, lunar-new-year)

## 5. Dropdown Functionality
- [ ] 5.1 Implement dropdown state management (open/close)
- [ ] 5.2 Add click-outside handler to close dropdowns
- [ ] 5.3 Populate dropdown with platform-specific download options
- [ ] 5.4 Include "View Version History" button in dropdown
- [ ] 5.5 Test keyboard navigation (Tab, Enter, Escape, Arrow keys)

## 6. Integration & Data Flow
- [ ] 6.1 Connect to `@shared/version-manager` for version data
- [ ] 6.2 Use `@shared/desktop-utils` for platform detection and labels
- [ ] 6.3 Handle loading state during version data fetch
- [ ] 6.4 Handle error state with fallback UI

## 7. Testing
- [ ] 7.1 Test on Windows (should show Windows as primary)
- [ ] 7.2 Test on macOS (should show macOS as primary)
- [ ] 7.3 Test on Linux (should show Linux as primary)
- [ ] 7.4 Test mobile responsive design (375px, 768px breakpoints)
- [ ] 7.5 Test dropdown functionality on all platforms
- [ ] 7.6 Test theme switching (light/dark/lunar-new-year)
- [ ] 7.7 Test keyboard navigation and screen reader accessibility
- [ ] 7.8 Test version history modal still works correctly

## 8. Documentation & Cleanup
- [ ] 8.1 Update component TypeScript interfaces
- [ ] 8.2 Remove unused card-related CSS classes
- [ ] 8.3 Add JSDoc comments for new button components
- [ ] 8.4 Verify no console warnings or errors

## 9. Validation
- [ ] 9.1 Run `openspec validate unify-desktop-download-button-ui --strict`
- [ ] 9.2 Verify visual consistency with InstallButton component
- [ ] 9.3 Check bundle size impact
- [ ] 9.4 Test cross-browser compatibility (Chrome, Firefox, Safari, Edge)

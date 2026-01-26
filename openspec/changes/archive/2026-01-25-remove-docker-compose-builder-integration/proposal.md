# Remove Docker Compose Builder Integration

## Summary

Remove the integrated Docker Compose Builder functionality from the Hagicode documentation site and redirect users to the standalone Docker Compose Builder site. This change decouples the documentation site from an external dependency and simplifies maintenance.

## Background

The Hagicode documentation site currently includes an integrated Docker Compose Builder (accessed via `/docker-compose-generator`), which was originally developed as part of the documentation site. This functionality has now migrated to a standalone site with independent versioning and release cycles.

### Current State

- **Navigation Link**: Navbar includes "Docker Compose 生成器" link at `/docker-compose-generator` (docusaurus.config.ts:83-86)
- **Implementation**: Complete page component with ~890 lines of TypeScript/React code (src/pages/docker-compose-generator.tsx)
- **Styling**: Dedicated CSS module with 560+ lines (src/pages/docker-compose-generator.module.css)
- **Documentation**: Extensively referenced in docs/installation/docker-compose.md (multiple links and recommendations)
- **Features**:
  - Interactive form for generating docker-compose.yml configurations
  - Image source selection (Docker Hub vs Azure Container Registry)
  - API provider configuration (ZAI/Anthropic/Custom)
  - Database configuration (internal/external PostgreSQL)
  - Volume and mount configuration
  - Real-time YAML preview with copy functionality
  - LocalStorage persistence for user preferences

### Problem Statement

The integrated Docker Compose Builder creates several issues:

1. **Tight Coupling**: Documentation site is tightly coupled to an external feature that has its own lifecycle
2. **Maintenance Burden**: Updates to Docker Compose Builder require synchronized changes in the documentation site
3. **Separation of Concerns**: The documentation site should focus on Hagicode documentation, not hosting external tools
4. **Version Confusion**: Users may access outdated versions of the Builder through the documentation site

### Standalone Site

The Docker Compose Builder is now available at: `https://hagicode-org.github.io/docker-compose-builder/`

## Proposed Solution

### Scope

**In Scope**:
1. Remove the Docker Compose Builder page component and all related files
2. Update navigation configuration to remove the Builder link
3. Update all documentation references to point to the standalone site
4. Add migration guidance for users

**Out of Scope**:
- Content migration to the standalone site (already handled separately)
- Changes to other Docusaurus plugins or themes
- Modifications to CI/CD pipelines

### Implementation Approach

#### Phase 1: Code Removal

Remove all Docker Compose Builder implementation files:
- `src/pages/docker-compose-generator.tsx` (main component)
- `src/pages/docker-compose-generator.module.css` (styling)

#### Phase 2: Navigation Updates

Update `docusaurus.config.ts`:
- Remove navbar item linking to `/docker-compose-generator` (lines 83-86)
- Optionally add external link to standalone site in navbar or footer

#### Phase 3: Documentation Updates

Update `docs/installation/docker-compose.md`:
- Replace internal links (`/docker-compose-generator`) with external links to standalone site
- Update callouts and info boxes to reference the new location
- Ensure consistent messaging about using the standalone tool

#### Phase 4: Validation

- Verify no broken internal links remain
- Confirm navigation works correctly
- Test documentation builds successfully
- Validate all external links point to correct URLs

## Impact Analysis

### User Experience

**Positive Impacts**:
- Users will access the latest version of Docker Compose Builder with up-to-date features
- Clearer separation between documentation and tools
- Standalone site can provide more specialized user experience

**Transition Considerations**:
- Existing bookmarks to `/docker-compose-generator` will break (404)
- Users following old documentation links will need to navigate to external site
- May cause temporary confusion during transition period

**Mitigation Strategies**:
1. Add clear migration notice in documentation
2. Consider adding redirect (if supported by hosting) or custom 404 page
3. Update all references to point to standalone site explicitly

### Technical Maintenance

**Benefits**:
- **Reduced Complexity**: ~1,450 lines of code removed (TSX + CSS)
- **Faster Builds**: One less page to compile and bundle
- **Simplified Dependencies**: No need to maintain Builder-specific code
- **Clearer Focus**: Documentation site concentrates on Hagicode documentation

**Risks**:
- Low risk: Removal is straightforward and isolated to specific files
- No dependencies on other parts of the codebase
- Sidebar configuration uses auto-generation, so no manual cleanup needed there

### Documentation Changes

**Files Affected**:
1. `docusaurus.config.ts` - Remove navbar link
2. `docs/installation/docker-compose.md` - Update 6+ references to the generator

**New URL**:
- From: `/docker-compose-generator` (internal)
- To: `https://hagicode-org.github.io/docker-compose-builder/` (external)

## Alternatives Considered

### Alternative 1: Keep Integration with Deprecation Notice
- **Pros**: Less disruptive for existing users
- **Cons**: Still requires maintenance effort, creates technical debt
- **Decision**: Rejected - doesn't solve the underlying maintenance burden

### Alternative 2: Redirect to Standalone Site
- **Pros**: Seamless user experience, no broken links
- **Cons**: Requires server-side redirect configuration, may not work with static hosting
- **Decision**: Not feasible with current static hosting setup (GitHub Pages)

### Alternative 3: Complete Removal (Selected)
- **Pros**: Clean separation, zero maintenance burden
- **Cons**: Some user disruption during transition
- **Decision**: Accepted - benefits outweigh temporary inconvenience

## Success Criteria

### Functional Requirements
- [ ] All Docker Compose Builder code files are removed
- [ ] Navigation no longer includes links to the Builder
- [ ] All documentation references point to standalone site
- [ ] Site builds successfully without errors
- [ ] No broken internal links remain

### Quality Assurance
- [ ] Manual testing of navigation menu
- [ ] Verification of documentation build process
- [ ] Link checking for all external references
- [ ] Responsive design validation (navbar layout)

### Migration Verification
- [ ] Documentation clearly indicates standalone site URL
- [ ] User-facing messaging explains the change
- [ ] All links to standalone site are correct and accessible

## Timeline Estimate

**Estimated Effort**: 2-4 hours

**Breakdown**:
- Code removal: 30 minutes
- Navigation updates: 15 minutes
- Documentation updates: 1-1.5 hours
- Testing and validation: 30-60 minutes
- Buffer for unexpected issues: 30 minutes

## Dependencies

**Blockers**:
- None identified

**Prerequisites**:
- Standalone Docker Compose Builder site must be fully operational
- All features from integrated version should be available on standalone site

## Open Questions

1. **Should we add a link to the standalone site in the navbar or footer?**
   - **Recommendation**: Yes, add to footer under "Tools" or "Resources" section

2. **Should we create a custom 404 page for the old generator URL?**
   - **Recommendation**: Not necessary for initial implementation, but could be added if users report confusion

3. **Should we add a migration notice to the installation documentation?**
   - **Recommendation**: Yes, add a prominent callout explaining the change and pointing to the standalone site

## References

- Standalone Docker Compose Builder: `https://hagicode-org.github.io/docker-compose-builder/`
- Original implementation: `src/pages/docker-compose-generator.tsx`
- OpenSpec spec for generator: `openspec/specs/docker-compose-generator/spec.md`

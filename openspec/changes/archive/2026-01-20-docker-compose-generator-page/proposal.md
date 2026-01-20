# Docker Compose Generator Page

## Metadata

- **Change ID**: `docker-compose-generator-page`
- **Status**: ExecutionCompleted
- **Created**: 2025-01-20
- **Author**: AI Assistant

## Overview

Create an interactive Docker Compose configuration generator page for the Hagicode documentation site. This page will provide users with a guided, step-by-step interface to generate customized Docker Compose configurations, reducing the complexity and error-prone nature of manual configuration.

## Problem Statement

The current Docker Compose installation guide (`docs/installation/docker-compose.md`) presents users with a static YAML template and requires them to:

1. **Manually configure multiple parameters**: Port mappings, database connection strings, volume mount paths, environment variables
2. **Understand complex Docker concepts**: Network configuration, health checks, dependency management
3. **Risk configuration errors**: Typos or incorrect values can lead to deployment failures
4. **Lack guidance during configuration**: No validation or real-time feedback

This creates a steep learning curve for new users and increases support burden.

## Proposed Solution

### New Interactive Generator Page

Create a standalone page at `/docker-compose-generator` with a two-column layout:

**Left Column - Guided Configuration**:
- Multi-step wizard interface breaking down configuration into logical sections
- Form inputs with validation for each parameter
- Contextual help text explaining each option
- Real-time error feedback

**Right Column - Live Preview**:
- Dynamically generated Docker Compose YAML
- Chinese comments for each configuration section
- Syntax highlighting using `prism-react-renderer`
- One-click copy functionality

### Configuration Sections

Based on the existing `docker-compose.md` documentation, the generator will cover:

1. **Basic Settings**
   - HTTP/HTTPS port configuration
   - Container names

2. **Environment Variables**
   - ASP.NET Core environment
   - Timezone settings
   - License key configuration
   - ZAI API Key (智谱 AI)

3. **Database Configuration**
   - PostgreSQL connection parameters
   - Database name, username, password
   - Volume persistence settings

4. **Volume Mounts**
   - Work directory mapping
   - PostgreSQL data persistence

5. **Advanced Options** (optional)
   - User/Group ID mapping (PUID/PGID)
   - Health check configuration
   - Network settings

## Technical Implementation

### Page Structure

```
src/pages/
  docker-compose-generator.tsx      # Main page component
  docker-compose-generator.module.css  # Page-specific styles
```

### Component Architecture

- **DockerComposeGenerator**: Main page component with state management
- **ConfigForm**: Left column form with step-by-step inputs
- **ConfigPreview**: Right column with live YAML preview
- **CopyButton**: Floating copy button with feedback

### Dependencies

- **Docusaurus Layout**: Reuse existing `@theme/Layout`
- **Styling**: Inherit CSS variables from `src/css/custom.css`
- **Syntax Highlighting**: `prism-react-renderer` for YAML

### Navigation Updates

Add navbar entry in `docusaurus.config.ts`:

```typescript
{
  to: '/docker-compose-generator',
  label: 'Docker Compose 生成器',
  position: 'right',
}
```

Add recommendation link in `docs/installation/docker-compose.md`.

## Scope

### In Scope (Phase 1)

1. Create `docker-compose-generator.tsx` page with two-column layout
2. Implement form fields for:
   - Port configuration (HTTP port)
   - Container naming
   - Environment variables (ASPNETCORE_ENVIRONMENT, TZ, License Key)
   - ZAI API Key configuration
   - PostgreSQL database settings
   - Volume mount paths
   - Optional PUID/PGID configuration
3. Live YAML preview with Chinese comments
4. Copy to clipboard functionality
5. Navbar integration
6. Documentation cross-reference link
7. TypeScript strict mode compliance
8. Responsive design (mobile support)

### Out of Scope (Future Enhancements)

1. Advanced configuration templates
2. Configuration import/export (JSON/YAML)
3. Configuration validation beyond basic type checking
4. Preset configurations for different deployment scenarios
5. Multi-service compose files
6. Integration with Docker Compose CLI

## Design Considerations

### Theme Consistency

- Reuse existing CSS custom properties from `custom.css`
- Match visual style with homepage components
- Support both light and dark themes
- Follow existing gradient and animation patterns

### User Experience

- Progressive disclosure: Show basic options first, advanced options collapsible
- Input validation: Port ranges, path format validation
- Sensible defaults: Pre-fill common configurations
- Mobile responsive: Stack columns on small screens

### Accessibility

- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly labels
- ARIA attributes where needed

## Success Criteria

1. **Functional Requirements**
   - Page loads without errors at `/docker-compose-generator`
   - All form inputs update the preview in real-time
   - Copy button successfully copies YAML to clipboard
   - TypeScript compilation passes with strict mode

2. **Quality Requirements**
   - `npm run typecheck` passes without errors
   - `npm run build` completes successfully
   - Visual consistency with existing site design
   - Responsive layout works on mobile and desktop

3. **User Acceptance**
   - Generated YAML is syntactically valid
   - Generated YAML matches existing documentation examples
   - Navigation links work correctly
   - Help text is clear and accurate

## Implementation Tasks

See `tasks.md` for detailed implementation steps.

## Alternatives Considered

### Alternative 1: Static Form with Submit
A traditional form that generates configuration on submit. Rejected because real-time preview provides better user feedback.

### Alternative 2: Embedded in Documentation
Adding the generator as a section within the existing docs. Rejected because the generator is a tool, not documentation content, and deserves a standalone page.

### Alternative 3: External Tool
Building a separate site/app for the generator. Rejected because it would fragment the user experience and require separate deployment.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| YAML generation errors | High | Comprehensive testing, validation against Docker Compose specification |
| CSS conflicts | Medium | Use CSS Modules for isolation, test both themes |
| TypeScript type errors | Medium | Enable strict mode, use type-safe form handling |
| Mobile UX issues | Low | Responsive testing, progressive enhancement |

## References

- Existing Docker Compose documentation: `docs/installation/docker-compose.md`
- Docusaurus pages: `src/pages/index.tsx`
- Styling patterns: `src/components/home/home.module.css`
- Site configuration: `docusaurus.config.ts`

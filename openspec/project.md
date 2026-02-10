# Project Context

## Purpose
Hagicode Documentation is a **monorepo** containing two comprehensive websites built with **Astro 5.x** (migrated from Docusaurus 3.x in January 2026, restructured to monorepo in February 2026), designed to provide user guides, feature documentation, technical specifications, and product marketing for the Hagicode project. The sites support Chinese (Simplified) as the default and only language and serve as the primary source of truth for Hagicode users and contributors.

## Project Structure

### Monorepo Architecture

The project uses **npm workspaces** and **Turbopack** to manage multiple applications and shared packages:

```
pcode-docs/
├── apps/
│   ├── docs/              # Starlight-powered documentation site
│   └── website/           # Marketing landing page site
├── packages/
│   └── shared/            # Shared utilities and types
├── openspec/              # OpenSpec specification-driven development
├── scripts/               # Build and utility scripts
└── public/                # Shared static assets
```

### Applications

**apps/docs** - Technical Documentation Site
- Built with **@astrojs/starlight** (v0.37.4)
- Content: User guides, installation docs, quick start tutorials, blog articles
- Deployment: Azure Static Web Apps (docs.hagicode.com)
- Features: Blog with RSS, version monitoring, activity metrics

**apps/website** - Marketing Landing Page
- Built with **Astro 5.x** + React
- Content: Product showcase, features, activity metrics, download options
- Deployment: Azure Static Web Apps (hagicode.com)
- Features: Desktop download options, activity metrics display, responsive design

**packages/shared** - Shared Code
- Desktop utilities and types
- Version management
- Shared links and constants

## Tech Stack

### Core Framework
- **Astro 5.6** - Modern static site generator with zero-JS by default
- **React 19.2** - UI library for interactive components (via @astrojs/react)
- **TypeScript 5.3** - Type-safe configuration and component development
- **Turbopack** - High-performance build system for monorepo task orchestration

### Documentation Site (apps/docs)
- **@astrojs/starlight 0.37.4** - Documentation framework
- **@astrojs/mdx 4.3** - Enhanced markdown with JSX support
- **@astrojs/sitemap 3.7** - Automatic sitemap generation
- **starlight-blog 0.25.2** - Blog integration with RSS support
- **@astrojs/mermaid 11.12** - Diagram rendering for technical content
- **rehype-external-links 3.0** - External links security handling
- **rehype-raw 3.0** - HTML support in markdown
- **rehype-mermaid 3.0** - Mermaid diagram processing
- **sharp 0.34** - Image optimization

### Marketing Site (apps/website)
- **@astrojs/mdx 4.3** - MDX support for content
- **@astrojs/react 4.4** - React component integration
- **framer-motion 12.29** - Animation library
- **@astrojs/sitemap 3.7** - Sitemap generation
- **sharp 0.34** - Image optimization

### Development Tools
- **Node.js >=18.0** - Runtime environment
- **npm >=9.0** - Package manager requirement
- **Turbopack 2.4** - High-performance build system and task orchestration
- **playwright 1.58** - Browser automation for version monitoring

### Utilities
- **clsx 2.0** - Utility for className construction
- **dotenv 17.2** - Environment variable management
- **astro-seo 1.1** - SEO meta tags
- **astro-robots-txt 1.0** - Robots.txt generation

## Project Conventions

### Code Style
- **TypeScript**: Use strict mode for all TypeScript files (configured in tsconfig.json)
- **File Naming**: Use kebab-case for markdown files (e.g., `session-management.md`)
- **Component Naming**: Use PascalCase for React components
- **CSS**: Use CSS custom properties (variables) defined in `src/styles/`
- **Frontmatter**: All markdown documents must include `title` and `description` in frontmatter
- **Path Aliases**: Use `@/*` for src directory imports (configured in tsconfig.json)
- **Mermaid Diagrams**: Use Mermaid for diagrams that need version control and theme support
  - Flowcharts, state diagrams, sequence diagrams for technical content
  - Use mermaid code blocks with proper syntax
  - Keep diagrams simple (under 20 nodes recommended)
  - Static images reserved for highly complex visualizations

### Architecture Patterns

**Monorepo Structure**
- `apps/docs/` - Technical documentation site (Starlight)
- `apps/website/` - Marketing landing page (Astro + React)
- `packages/shared/` - Shared utilities and types
- Root `package.json` manages workspace dependencies and scripts

**Documentation Structure (apps/docs)**
- `src/content/docs/` - Main documentation content (Chinese/Simplified) using Astro Content Collections
  - `quick-start/` - Quick start guides (installation, project creation, sessions)
  - `installation/` - Installation guides (docker-compose, package deployment)
  - `related-software-installation/` - Related software setup (Claude Code, OpenSpec, Node.js, PostgreSQL)
  - `blog/` - Blog posts and articles
- `public/` - Static assets (images, favicons)
  - `img/` - Image assets organized by feature
  - `version-index.json` - Version monitoring data
- `src/` - Astro components and layouts
  - `components/` - React and Astro components
    - `Clarity.astro` - Microsoft Clarity analytics
    - `InstallButton.tsx` - Download/install button component
    - `MermaidInjector.astro` - Mermaid diagram integration
    - `StarlightFooter.astro` - Custom footer
    - `StarlightHeader.astro` - Custom header
    - `StarlightWrapper.astro` - Layout wrapper
    - `StructuredData.astro` - SEO structured data
  - `config/navigation.ts` - Site navigation configuration
  - `content.config.ts` - Content collections configuration
  - `integrations/mermaid-injector.ts` - Mermaid integration
  - `pages/index.astro` - Homepage
  - `styles/` - Global styles and CSS variables
  - `types/desktop.ts` - Desktop type definitions
  - `utils/desktop.ts` - Desktop utility functions
  - `utils/path.ts` - Path utilities

**Marketing Site Structure (apps/website)**
- `src/components/` - React components
  - `home/` - Homepage-specific components
  - `desktop/` - Desktop download components
- `src/pages/` - File-system based routing
  - `index.astro` - Homepage
  - `desktop/index.astro` - Desktop download page
- `src/config/navigation.ts` - Navigation configuration
- `src/styles/` - Global styles
- `src/types/desktop.ts` - Desktop types
- `src/utils/desktop.ts` - Desktop utilities
- `public/` - Static assets
  - `img/` - Marketing images
  - `activity-metrics.json` - Activity metrics data
  - `version-index.json` - Version data

**Routing System**
- File-system based routing in `src/pages/`
- Content collections for type-safe content management
- Docs site: Starlight handles routing automatically
- Marketing site: File-based routing with Astro
- No sidebars.ts (replaced by content collections and navigation config)

**Internationalization**
- Default locale: Simplified Chinese (`zh-CN`)
- Supported locales: Single locale only (`zh-CN`)
- All content is in Chinese
- No i18n configuration (single-language site)
- No language switcher in navbar
- URLs do not include locale prefix

**OpenSpec Integration**
- Spec-driven development workflow using OpenSpec
- Proposals require `proposal.md`, `tasks.md`, and spec deltas
- Design documents (`design.md`) for complex changes
- Validation with `openspec validate --strict` before implementation
- Archiving workflow: `changes/` → `changes/archive/YYYY-MM-DD-name/`

### Testing Strategy
- **Local Development**: Always test with `npm run dev` before committing
- **Production Build**: Validate with `npm run build` to ensure no build errors
- **Type Checking**: Run `npm run typecheck` to verify TypeScript correctness
- **Preview Build**: Use `npm run preview` to test production build locally
- **OpenSpec Validation**: Run `openspec validate --strict` for all proposals

### Git Workflow
- **Main Branch**: `main`
- **Feature Branches**: Create from `main`, descriptive names (e.g., `add-session-docs`)
- **Commit Conventions**: Clear, descriptive messages in imperative mood
- **OpenSpec Integration**: Use OpenSpec for significant changes (see openspec/AGENTS.md)
- **PR Process**: All changes go through pull requests with local testing required
- **Archive Workflow**: After deployment, create separate PR to archive changes

## Domain Context

**Websites**

- **hagicode.com** - 官方营销网站，包含产品落地页和功能展示
- **docs.hagicode.com** - 技术文档站点，包含用户指南、安装文档和博客

**Hagicode** is an AI-powered code-related tool/application with the following key feature areas:

**Core Features**
- **Session Management**: Managing sessions, concurrency, and session details
- **Conversation Features**: Message rendering, tool calls, todo tasks, view modes
- **Project Management**: Project lists, details, and creation

**Session Types**
- **Conversation Sessions**: Chat-like interaction with AI (similar to VS Code Copilot Chat, Cursor AI)
  - Read-only mode: AI can read, analyze, describe but not modify
  - Edit mode: AI can make code changes
- **Idea Sessions**: Idea-to-execution workflow (proposal-based)

**OpenSpec Integration**
- Proposal creation workflow
- Diagrams and annotations support
- Spec-driven development process
- Project.md optimization capabilities

**Configuration & UX**
- Config panel, project settings, notification settings
- Themes, languages, appearance customization
- Statistics & Achievements: Usage statistics, efficiency ratings

## Important Constraints
- **Node.js Version**: Requires Node.js >=18.0, npm >=9.0 (defined in package.json engines)
- **Build Compatibility**: All changes must pass `npm run build` without errors
- **Type Safety**: TypeScript must pass `tsc --noEmit` without errors (strict mode enabled)
- **Link Integrity**: Broken links cause build failures (onBrokenLinks: 'throw')
- **OpenSpec Compliance**: Significant changes require OpenSpec proposals (see AGENTS.md)
- **Single Language**: Sites are Chinese-only; no language switching functionality
- **Monorepo**: Changes must consider impact on both apps and shared packages

## Documentation Content Areas

### Quick Start (Current Content)
- Installation Guide (安装指南) - Docker Compose, package deployment
- Create Your First Project (创建你的第一个项目)
- Creating a Conversation Session (创建普通会话)
- Creating a Proposal Session (创建提案会话)

### Related Software Installation
- Claude Code with Zai setup
- OpenSpec setup
- Node.js installation
- PostgreSQL installation

### Blog Content
- Technical articles about Hagicode development
- Migration guides (Docusaurus to Astro)
- Integration tutorials
- Performance optimization articles

### Planned Content Areas
- Session Management (session-list, session-details, session-chat, concurrency)
- Conversation Features (message-rendering, tool-calls, todo-tasks, view-modes)
- Project Management (project-list, project-details)
- OpenSpec Proposals (overview, creating-proposals, diagrams, annotations)
- Statistics & Achievements (usage-statistics, efficiency-rating)
- Configuration (config-panel, project-settings, notification-settings)
- User Guide (appearance/themes, settings/overview)

## External Dependencies
- **GitHub**: Repository hosting (https://github.com/Hagicode-org/site)
- **Azure Static Web Apps**: Production deployment for both sites
- **Astro Framework**:
  - astro ^5.6.1
  - @astrojs/mdx ^4.3.13
  - @astrojs/react ^4.4.2
  - @astrojs/starlight ^0.37.4
  - @astrojs/mermaid ^11.12.2
  - @astrojs/sitemap ^3.7.0
  - @astrojs/partytown ^2.1.4
- **React Ecosystem**:
  - react ^19.2.4
  - react-dom ^19.2.4
  - framer-motion ^12.29.2
- **Development**:
  - typescript ~5.3.0
  - @types/react ^19.2.10
  - @types/react-dom ^19.2.3
- **Utilities**:
  - clsx ^2.0.0 (via dependencies)
  - dotenv ^17.2.3
  - sharp ^0.34.2
  - npm-run-all ^4.1.5
- **Content Processing**:
  - rehype-external-links ^3.0.0
  - rehype-mermaid ^3.0.0
  - rehype-raw ^3.0.0
  - starlight-blog ^0.25.2

## OpenSpec Integration Details

This project uses OpenSpec for spec-driven development. Key points:
- Proposals are managed in `openspec/changes/`
- Specifications live in `openspec/specs/`
- Archive of completed changes in `openspec/changes/archive/`
- See `openspec/AGENTS.md` for detailed workflow instructions
- Design guidelines in `openspec/PROPOSAL_DESIGN_GUIDELINES.md`
- Always check `openspec list` and `openspec list --specs` before starting work

### OpenSpec Development Guidelines

**Important**: When creating or modifying OpenSpec proposals, design documents, or any technical specifications that include UI designs or code flow diagrams, you must follow the guidelines in:

**@/openspec/PROPOSAL_DESIGN_GUIDELINES.md**

This document provides:
- UI design visualization standards (ASCII mockups, Mermaid sequence diagrams)
- Code flow diagram requirements (flowcharts, architecture diagrams, data flow)
- Change documentation templates (tables, before/after comparisons)
- Mermaid syntax best practices (special character handling, naming conventions)
- Review checklist for design completeness

Reference these guidelines when:
- Creating new proposals with UI/UX changes
- Writing design.md documents
- Documenting data flow or API interactions
- Including visual diagrams in proposal.md or design.md

### OpenSpec Workflow Stages

**Stage 1: Creating Changes**
- Review `openspec/project.md`, existing specs, and changes
- Choose unique verb-led `change-id` (e.g., `add-feature`, `update-behavior`)
- Scaffold: `proposal.md`, `tasks.md`, optional `design.md`, and spec deltas
- Draft spec deltas using `## ADDED|MODIFIED|REMOVED Requirements`
- Include UI/UX diagrams per PROPOSAL_DESIGN_GUIDELINES.md
- Run `openspec validate <id> --strict` before requesting approval

**Stage 2: Implementing Changes**
- Read proposal.md, design.md (if exists), and tasks.md
- Implement tasks sequentially
- Update checklist after all work is complete
- Do not start implementation until proposal is approved

**Stage 3: Archiving Changes**
- Move `changes/[name]/` → `changes/archive/YYYY-MM-DD-[name]/`
- Update `specs/` if capabilities changed
- Use `openspec archive <change-id> --skip-specs --yes` for tooling-only changes

## Development Scripts

```bash
# 开发服务器 - 启动两个站点
npm run dev                # Start both docs (port 4321) and website (port 4322)

# 单独启动各站点
npm run dev:docs           # Start docs site only (localhost:4321/)
npm run dev:website        # Start website only (localhost:4322/)

# 生产构建 - 构建两个站点
npm run build              # Build both sites
npm run build:docs         # Build docs site only
npm run build:website      # Build website site only

# 预览生产构建
npm run preview            # Preview both sites
npm run preview:docs       # Preview docs site
npm run preview:website    # Preview website site

# TypeScript 类型检查
npm run typecheck          # Check types (requires workspace-specific execution)

# 其他实用脚本
npm run update-metrics     # Update activity metrics data
npm run astro              # Run astro commands in workspaces
npm run clean              # Clean all build artifacts
npm run clean:docs         # Clean docs build artifacts
npm run clean:website      # Clean website build artifacts
```

## Deployment

### GitHub Actions CI/CD

The project uses GitHub Actions for continuous deployment to Azure Static Web Apps:

**Documentation Site**: `.github/workflows/deploy-docs.yml`
- **Trigger**: Automatic on push to `main` branch
- **Node.js Version**: 20.x (matches `package.json` engines requirement)
- **Build Steps**:
  - `npm ci` - Install dependencies with npm
  - `npm run build:docs` - Generate static site to `apps/docs/dist/` directory
- **Environment Variables**:
  - `CLARITY_PROJECT_ID`: Microsoft Clarity analytics ID (from GitHub Secrets)
- **Deployment**: Uses Azure Static Web Apps OIDC authentication
- **Output Location**: `apps/docs/dist/` directory

**Marketing Site**: `.github/workflows/deploy-website.yml`
- **Trigger**: Automatic on push to `main` branch
- **Node.js Version**: 20.x
- **Build Steps**:
  - `npm ci` - Install dependencies with npm
  - `npm run build:website` - Generate static site to `apps/website/dist/` directory
- **Environment Variables**:
  - `CLARITY_PROJECT_ID`: Microsoft Clarity analytics ID (from GitHub Secrets)
- **Deployment**: Uses Azure Static Web Apps OIDC authentication
- **Output Location**: `apps/website/dist/` directory

**Azure Static Web Apps Configuration**
- **Docs**: `apps/docs/public/staticwebapp.config.json`
- **Website**: `apps/website/public/staticwebapp.config.json`
- **Route Fallback**: Uses `navigationFallback` for SPA-style routing
- **Both sites**: Root path deployment (no subpath)

**Other Workflows**:
- `update-activity-metrics.yml` - Updates activity metrics data
- `version-monitor.yml` - Monitors Hagicode version updates
- `compress-images.yml` - Compresses images in the repository

### Deployment Considerations
- Static site deployment compatible (Azure Static Web Apps)
- Build output directories: `apps/docs/dist/`, `apps/website/dist/`
- Sites are single-language (Chinese only)
- No i18n configuration needed
- URLs are clean without locale prefix
- Monorepo structure requires workspace-aware builds

## Configuration Files

### Root package.json
- Monorepo workspace configuration
- Turbopack task orchestration
- Shared scripts for building, testing, and cleaning
- Workspace dependencies managed centrally

### apps/docs/package.json
- Documentation site dependencies
- Starlight, MDX, React integration
- Build and dev scripts
- TypeScript configuration

### apps/website/package.json
- Marketing site dependencies
- React integration for interactive components
- Build and dev scripts
- TypeScript configuration

### packages/shared/package.json
- Shared utilities package
- Exported functions and types
- No external dependencies

### astro.config.mjs (per app)
- Astro framework configuration file
- React, MDX integrations
- Sitemap generation
- Static output mode
- Vite configuration for environment variables (CLARITY_PROJECT_ID)
- Markdown processing with rehype plugins

### tsconfig.json (per app + root)
- Target: ES2020
- Strict mode enabled (extends `astro/tsconfigs/strict`)
- Path aliases: `@/*` → `src/*`
- JSX: react
- Module resolution: bundler (Vite)
- Includes: src/**/*.ts, src/**/*.tsx, src/**/*.astro

### apps/docs/src/content.config.ts
- Astro Content Collections configuration
- Type-safe frontmatter validation using Zod
- Defines `docs` and `blog` collections

### apps/website/src/content.config.ts
- Content collections for website
- Blog or other content types as needed

### staticwebapp.config.json (per app)
- Azure Static Web Apps configuration
- Route fallback configuration
- Must be in public/ directory
- Copied to dist/ during build

## Recent Changes

### 2026-02-10: Monorepo Migration
- **Architecture Change**: Restructured from single Astro site to npm workspace monorepo
- **Split Sites**: Separated documentation (apps/docs) and marketing (apps/website)
- **Shared Package**: Created packages/shared for common utilities
- **Build Scripts**: Updated for multi-site building and development
- **Deployment**: Separate Azure deployment workflows for each site
- **Documentation**: Comprehensive proposal and design in `openspec/changes/monorepo-migration/`
- **Benefits**: Better code organization, shared dependencies, independent deployments

### 2026-02-04: Microsoft Clarity Integration
- **Analytics**: Added Microsoft Clarity analytics to docs site
- **Component**: Created Clarity.astro component
- **Environment**: CLARITY_PROJECT_ID environment variable
- **Privacy**: GDPR-compliant analytics with partytown

### 2026-02-01: Starlight Docs Integration
- **Framework Migration**: Migrated from custom Astro setup to Starlight
- **Blog**: Added starlight-blog plugin with RSS support
- **Navigation**: Starlight's built-in navigation system
- **Theme**: Dark mode support with Starlight theming

### 2026-01-31: Docusaurus to Astro Migration
- **Framework Upgrade**: Complete migration from Docusaurus 3.x to Astro 5.x
- **Build System**: Faster builds, smaller bundle sizes, zero-JS by default
- **Architecture**: Astro Content Collections for type-safe content management
- **Performance**: Static HTML by default with hydration only for interactive components

### 2026-01-14: Brand Rename - PCode to Hagicode
- Updated all product name references from "PCode" to "Hagicode"
- Updated site configuration (title, tagline, metadata)
- Updated project information in package.json
- Updated GitHub organization references from `PCode-org` to `Hagicode-org`
- Updated all documentation content

### 2026-01-12: Set Chinese as Default Language
- Migrated from bilingual (English + Chinese) to single-language (Chinese only)
- Moved Chinese content from i18n to main docs directory
- Removed i18n configuration
- Removed language switcher from navbar
- URLs no longer include locale prefix

### Previous Changes
See `openspec/changes/archive/` for detailed history of all completed changes including:
- Docusaurus site initialization
- Chinese documentation structure
- Quick start guides (installation, project creation, sessions)
- Language switcher (now removed)
- Simplified docs structure

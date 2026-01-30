# Project Context

## Purpose
Hagicode Documentation is a comprehensive documentation site built with **Astro 5.x** (migrated from Docusaurus 3.x in January 2026), designed to provide user guides, feature documentation, and technical specifications for the Hagicode project. The site supports Chinese (Simplified) as the default and only language and serves as the primary source of truth for Hagicode users and contributors.

## Tech Stack
- **Astro 5.16** - Modern static site generator with zero-JS by default
- **React 18.2** - UI library for interactive components (via @astrojs/react)
- **TypeScript 5.3** - Type-safe configuration and component development
- **MDX (@astrojs/mdx 4.3)** - Enhanced markdown with JSX support
- **Node.js >=18.0** - Runtime environment
- **@astrojs/mermaid** - Diagram rendering for technical content
- **clsx 2.0** - Utility for className construction
- **Framer Motion 12.26** - Animation library for interactive components

## Project Conventions

### Code Style
- **TypeScript**: Use strict mode for all TypeScript files (configured in tsconfig.json)
- **File Naming**: Use kebab-case for markdown files (e.g., `session-management.md`)
- **Component Naming**: Use PascalCase for React components
- **CSS**: Use CSS custom properties (variables) defined in `src/css/custom.css`
- **Frontmatter**: All markdown documents must include `title` and `description` in frontmatter
- **Path Aliases**: Use `@/*` for src directory imports (configured in tsconfig.json)
- **Mermaid Diagrams**: Use Mermaid for diagrams that need version control and theme support
  - Flowcharts, state diagrams, sequence diagrams for technical content
  - Use mermaid code blocks with proper syntax
  - Keep diagrams simple (under 20 nodes recommended)
  - Static images reserved for highly complex visualizations

### Architecture Patterns

**Documentation Structure**
- `src/content/docs/` - Main documentation content (Chinese/Simplified) using Astro Content Collections
  - `quick-start/` - Quick start guides (installation, project creation, sessions)
- `src/content/blog/` - Blog posts and articles
- `public/` - Static assets (images, favicons, videos)
  - `img/` - Image assets (logo.svg, favicon.ico, social cards)
  - `videos/` - Video assets
- `src/` - Astro components and layouts
  - `layouts/` - Astro layout components (Layout.astro, DocsLayout.astro)
  - `components/` - React and Astro components
    - `home/` - Homepage React components
    - `Navbar.astro` - Navigation bar
    - `Footer.astro` - Footer component
  - `pages/` - File-system based routing
    - `index.astro` - Homepage
    - `docs/[...slug].astro` - Dynamic docs routing
    - `blog/` - Blog pages
  - `styles/global.css` - Global styles and CSS variables
- `openspec/` - OpenSpec specification-driven development
  - `specs/` - Current specifications (what IS built)
  - `changes/` - Active proposals (what SHOULD change)
  - `changes/archive/` - Completed/archived changes
  - `AGENTS.md` - OpenSpec workflow instructions for AI assistants
  - `PROPOSAL_DESIGN_GUIDELINES.md` - UI and code flow visualization standards

**Routing System**
- File-system based routing in `src/pages/`
- Dynamic routes using `[...slug].astro` pattern
- Content collections for type-safe content management
- URL structure: Configurable via `VITE_SITE_BASE` environment variable
  - Default: `/docs/*`, `/blog/*` (root path deployment)
  - With `/site`: `/site/docs/*`, `/site/blog/*` (subpath deployment)
- No sidebars.ts (replaced by content collections)

**Internationalization**
- Default locale: Simplified Chinese (`zh-CN`)
- Supported locales: Single locale only (`zh-CN`)
- All content is in Chinese and located in `docs/`
- No i18n configuration (single-language site)
- No language switcher in navbar
- URLs do not include locale prefix (e.g., `/docs/quick-start/installation`)

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
- **Node.js Version**: Requires Node.js >=18.0 (defined in package.json engines)
- **Build Compatibility**: All changes must pass `npm run build` without errors
- **Type Safety**: TypeScript must pass `tsc --noEmit` without errors (strict mode enabled)
- **Link Integrity**: Broken links cause build failures (onBrokenLinks: 'throw')
- **OpenSpec Compliance**: Significant changes require OpenSpec proposals (see AGENTS.md)
- **Single Language**: Site is Chinese-only; no language switching functionality

## Documentation Content Areas

### Quick Start (Current Content)
- Installation Guide (安装指南)
- Create Your First Project (创建你的第一个项目)
- Creating a Conversation Session (创建普通会话)
- Creating a Proposal Session (创建提案会话)

### Planned Content Areas
- Session Management (session-list, session-details, session-chat, concurrency)
- Conversation Features (message-rendering, tool-calls, todo-tasks, view-modes)
- Project Management (project-list, project-details)
- OpenSpec Proposals (overview, creating-proposals, diagrams, annotations)
- Statistics & Achievements (usage-statistics, efficiency-rating)
- Configuration (config-panel, project-settings, notification-settings)
- User Guide (appearance/themes, settings/overview)

## External Dependencies
- **GitHub**: Repository hosting (https://github.com/Hagicode-org/hagicode-docs)
- **Astro Framework**:
  - astro ^5.16.16
  - @astrojs/mdx ^4.3.13
  - @astrojs/react ^4.4.2
  - @astrojs/mermaid ^11.12.2
- **React Ecosystem**:
  - react ^18.2.0
  - react-dom ^18.2.0
  - @mdx-js/react ^3.0.0
  - framer-motion ^12.26.1
- **Development**:
  - typescript ~5.3.0
  - @types/node ^20.0.0
  - @types/react ^18.2.0
  - @types/react-dom ^18.2.0
- **Utilities**:
  - clsx ^2.0.0 (className utilities)
  - dotenv ^17.2.3 (environment variables)

## OpenSpec Integration Details

This project uses OpenSpec for spec-driven development. Key points:
- Proposals are managed in `openspec/changes/`
- Specifications live in `openspec/specs/`
- Archive of completed changes in `openspec/changes/archive/`
- See `openspec/AGENTS.md` for detailed workflow instructions
- Design guidelines in `openspec/PROPOSAL_DESIGN_GUIDELINES.md`
- Always check `openspec list` and `openspec list --specs` before starting work

### OpenSpec Workflow Stages

**Stage 1: Creating Changes**
- Review `openspec/project.md`, existing specs, and changes
- Choose unique verb-led `change-id` (e.g., `add-feature`, `update-behavior`)
- Scaffold: `proposal.md`, `tasks.md`, optional `design.md`, and spec deltas
- Draft spec deltas using `## ADDED|MODIFIED|REMOVED Requirements`
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
# 开发服务器 (使用默认配置)
npm run dev              # Start development server (localhost:4321/)

# 针对不同部署场景的开发服务器
npm run dev:root         # 根路径部署模式 (localhost:4321/)
npm run dev:site         # 子路径部署模式 (localhost:4321/site/)

# 生产构建
npm run build            # 创建生产构建 (使用默认配置)
npm run build:site       # 创建子路径部署生产构建 (VITE_SITE_BASE=/site)

# 预览生产构建
npm run preview          # 在本地预览生产构建
npm run typecheck        # TypeScript 类型检查 (tsc --noEmit)
```

**部署场景说明**:
- **根路径部署**: 适用于部署到域名根路径,如 `https://example.com/`
- **子路径部署**: 适用于部署到子路径,如 `https://example.com/site/`
- 使用 `dev:root` 和 `dev:site` 脚本可快速切换不同部署场景进行本地测试

### URL 重定向机制

站点实现了从旧 Docusaurus URL 结构到新 Astro URL 结构的自动重定向,确保所有永久链接(Permalinks)在迁移后仍然有效。

**重定向规则**:
- **博客文章**: `/blog/YYYY/MM/DD/slug` → `/blog/YYYY-MM-DD-slug/`
- **文档页面**: `/docs/category/slug` → `/category/slug/`

**实现方式**:
- 构建时根据 `redirects.json` 配置生成 HTML 重定向页面
- 使用 meta refresh 和 JavaScript 双重重定向机制
- 包含 canonical 链接以优化 SEO
- 支持根路径和子路径两种部署场景
- 自动保留查询参数(如 `?utm_source=twitter`)

**构建流程**:
1. Astro 静态站点生成 (`astro build`)
2. 生成从旧 Docusaurus URL 到新 Astro URL 的重定向页面 (`node scripts/generate-redirects.js`)
3. 生成自定义 404 错误页面 (`node scripts/custom-404.js`)

**配置文件**:
- `redirects.json`: 定义所有重定向规则
- `scripts/generate-redirects.js`: 重定向页面生成脚本

## Deployment

### GitHub Actions CI/CD

The project uses GitHub Actions for continuous deployment to GitHub Pages:

**Workflow Configuration**: `.github/workflows/deploy.yml`
- **Trigger**: Automatic on push to `main` branch
- **Node.js Version**: 20.x (matches `package.json` engines requirement)
- **Build Steps**:
  - `npm ci` - Install dependencies with exact versions
  - `npm run build` - Generate static site to `dist/` directory
- **Environment Variables**:
  - `CLARITY_PROJECT_ID`: Microsoft Clarity analytics ID (from GitHub Secrets)
  - `VITE_SITE_BASE`: Site base path configuration (可选的环境变量覆盖)
    - 如果不设置: 使用 `astro.config.mjs` 中的默认值 (`/`)
    - 设置为 `/site`: 用于子路径部署 (如 `https://pcode-org.github.io/site/`)
    - 设置为 `/`: 用于根路径部署 (如 `https://pcode-org.github.io/`)
    - 优先级: 环境变量 > astro.config.mjs 配置
- **Deployment**: Uses GitHub Pages artifact deployment
- **Target Branch**: `gh-pages`

**GitHub Configuration Required**:
- Enable GitHub Pages in repository settings
- Set source to `gh-pages` branch
- Grant GitHub Actions permissions: `contents: write`, `pages: write`, `id-token: write`

**Site Base Path Configuration**:
站点基础路径通过 `astro.config.mjs` 和 `VITE_SITE_BASE` 环境变量统一管理:

1. **配置文件默认值** (`astro.config.mjs`):
   ```javascript
   base: import.meta.env.VITE_SITE_BASE || '/'
   ```
   - 未设置环境变量时,默认为 `/` (根路径部署)

2. **环境变量覆盖机制**:
   - **本地开发**: 通过 `npm run dev:site` 或手动设置 `VITE_SITE_BASE=/site`
   - **GitHub Actions**: 在 `deploy.yml` 的 env 部分设置
   - **优先级**: 环境变量 > 配置文件默认值

3. **部署场景示例**:
   ```bash
   # 根路径部署 (https://example.com/)
   npm run build

   # 子路径部署 (https://example.com/site/)
   VITE_SITE_BASE=/site npm run build
   # 或使用便捷脚本
   npm run build:site
   ```

4. **URL 处理**:
   - Astro 会自动根据 base 路径调整所有内部链接、图片和资源
   - 无需手动修改内容中的链接路径

### Deployment Considerations
- Static site deployment compatible (GitHub Pages, Netlify, Vercel)
- Build output directory: `dist/`
- Site is single-language (Chinese only)
- No i18n configuration needed
- URLs are clean without locale prefix

## Configuration Files

### astro.config.mjs
- Astro framework configuration file
- Site base path configuration:
  - `base` 配置项从 `VITE_SITE_BASE` 环境变量读取,默认为 `/`
  - 支持环境变量覆盖,提供灵活的部署配置
  - Astro 自动根据 base 路径调整所有内部链接和资源
- React, MDX, and Mermaid integrations
- Static output mode for GitHub Pages
- Vite configuration for environment variables (CLARITY_PROJECT_ID)
- Markdown processing with rehype plugins:
  - `rehypeRaw` - 支持 HTML 在 Markdown 中
  - `rehypeMermaid` - Mermaid 图表渲染
  - `rehypeExternalLinks` - 外部链接自动添加 `target="_blank"` 和 `rel="noopener noreferrer"`

### tsconfig.json
- Target: ES2020
- Strict mode enabled (extends `astro/tsconfigs/strict`)
- Path aliases: `@/*` → `src/*`
- JSX: react
- Module resolution: bundler (Vite)
- Includes: src/**/*.ts, src/**/*.tsx, src/**/*.astro

### src/content/config.ts
- Astro Content Collections configuration
- Type-safe frontmatter validation using Zod
- Defines `docs` and `blog` collections

### src/styles/global.css
- Global styles and CSS custom properties
- Dark mode theme variables
- Migrated from Docusaurus custom.css

## Recent Changes

### 2026-01-30: Docusaurus Tip 到 Astro Aside 迁移
- **问题修复**: 修复 Starlight Aside 组件(提示框)标题语法不正确的问题
- **根因分析**:
  - Docusaurus 使用 `:::tip 标题` 语法,而 Starlight 要求 `:::tip[标题]` 语法
  - 部分文档使用了 `:::info` 语法(Starlight 不支持,应使用 `:::note` 或 `:::tip`)
  - 使用 Tabs 组件的文档缺少必要的导入语句
- **修复内容**:
  - 批量替换所有 Aside 标题语法: `:::type 标题` → `:::type[标题]`
  - 将 `:::info` 替换为 `:::note` 或 `:::tip`(根据上下文)
  - 为使用 Tabs 的文档添加 `import { Tabs, TabItem } from '@astrojs/starlight/components'`
  - 创建测试页面 `/tests/aside-test/` 验证所有 aside 类型
- **正确的 Aside 语法**:
  - 基础类型: `:::tip`、`:::note`、`:::caution`、`:::danger`
  - 带标题: `:::tip[你的标题]`
  - 带图标: `:::tip{icon="heart"}`
  - 不支持: `:::info`、`:::warning`、`:::error`
- **文档**: 完整的提案、设计和任务文档在 `openspec/changes/docusaurus-tip-to-astro-aside-migration/`

### 2026-01-30: 外部链接新标签页打开
- **功能增强**: 为所有外部链接自动添加 `target="_blank"` 和 `rel="noopener noreferrer"`
- **实现方式**: 安装并配置 `rehype-external-links` 插件
- **用户体验**: 用户可以在保持文档站点打开的同时查看外部资源
- **安全性**: 通过 `rel="noopener noreferrer"` 防止潜在的安全风险
- **测试页面**: 创建 `/tests/external-links-test` 用于验证功能
- **文档**: 完整的提案、设计和任务文档在 `openspec/changes/external-links-new-tab-opening/`

### 2026-01-29: Migration from Docusaurus to Astro
- **Framework Upgrade**: Complete migration from Docusaurus 3.x to Astro 5.x
- **Build System**: Faster builds, smaller bundle sizes, zero-JS by default
- **Architecture**: Astro Content Collections for type-safe content management
- **Performance**: Static HTML by default with hydration only for interactive components
- **Documentation**: Comprehensive proposal, design, and tasks documentation in `openspec/changes/migrate-docusaurus-to-astro/`
- **Configuration**: New `astro.config.mjs`, updated `tsconfig.json`

### 2026-01-14: Brand Rename - PCode to Hagicode
- Updated all product name references from "PCode" to "Hagicode" across the entire documentation site
- Updated site configuration (title, tagline, metadata)
- Updated project information in `package.json`
- Updated GitHub organization references from `PCode-org` to `Hagicode-org`
- Updated all documentation content (Markdown files)

### 2026-01-12: Set Chinese as Default Language
- Migrated from bilingual (English + Chinese) to single-language (Chinese only)
- Moved Chinese content from `i18n/zh-CN/docusaurus-plugin-content-docs/current/` to `docs/`
- Removed i18n configuration from docusaurus.config.ts
- Removed language switcher from navbar
- URLs no longer include locale prefix

### Previous Changes
See `openspec/changes/archive/` for detailed history of all completed changes including:
- Docusaurus site initialization
- Chinese documentation structure
- Quick start guides (installation, project creation, sessions)
- Language switcher (now removed)
- Simplified docs structure

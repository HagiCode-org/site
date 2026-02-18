# Site - Agent Configuration

## Root Configuration
Inherits all behavior from `/AGENTS.md` at monorepo root.

## Project Context

Site is the official documentation and marketing website for HagiCode (hagicode.com and docs.hagicode.com). Built with Astro, it provides:

- Product documentation and guides
- Marketing content and landing pages
- Installation instructions
- Quick start guides
- Contributor guidelines

## Tech Stack

### Core Framework
- **Astro**: 5.x static site generator
- **React**: For interactive components
- **TypeScript**: For type safety

### Content Management
- **Markdown**: Content authoring
- **MDX**: Enhanced Markdown with React components
- **Frontmatter**: Content metadata

### Styling
- **TailwindCSS**: Utility-first styling
- **Custom components**: For consistent UI

## Project Structure

```
├── src/
│   ├── pages/              # Route pages (file-based routing)
│   ├── layouts/            # Page layout components
│   ├── components/         # React/Astro components
│   └── content/            # Markdown/MDX content
├── static/                 # Static assets (images, fonts, etc.)
├── public/                 # Public files served at root
├── docs/                   # Documentation content
└── astro.config.*          # Astro configuration
```

## Agent Behavior

When working in the site submodule:

1. **Content-focused**: Primarily documentation and marketing content
2. **Astro patterns**: Use Astro's file-based routing and component islands
3. **Static generation**: All content is pre-rendered at build time
4. **i18n awareness**: Content supports multiple languages (English/Chinese)
5. **SEO important**: Proper meta tags and structured data

### Development Workflow
```bash
cd repos/site

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Specific Conventions

### Content Organization
- Documentation in `docs/` directory
- Blog posts in `blog/` directory
- Static assets in `static/` directory
- Page routes follow file-based structure

### Frontmatter Usage
All content files use frontmatter for metadata:
```yaml
title: Page Title
description: Page description
lang: en
---
```

### Styling
- Use TailwindCSS utility classes
- Follow existing component patterns
- Maintain responsive design

### i18n
- English content: Default language
- Chinese content: Use `lang: zh-CN` in frontmatter
- Separate files for each language

## Disabled Capabilities

AI assistants should NOT suggest:
- **Backend code**: No server-side logic or APIs
- **Database operations**: No data persistence
- **User authentication**: No login/auth features
- **Dynamic routing**: All routes are static
- **Server-side rendering**: Content is pre-rendered at build time
- **API routes**: No backend endpoints
- **Orleans patterns**: This is a static site, not a distributed system

## References

- **Root AGENTS.md**: `/AGENTS.md` at monorepo root
- **Monorepo CLAUDE.md**: See root directory for monorepo-wide conventions
- **OpenSpec Workflow**: Proposal-driven development happens at monorepo root level (`/openspec/`)
- **README**: `repos/site/README.md`
- **Astro Docs**: https://docs.astro.build

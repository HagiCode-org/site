# blog-feature Specification Delta

This specification delta adds blog functionality requirements to the docusaurus-site specification.

## ADDED Requirements

### Requirement: Docusaurus Blog Plugin Configuration

The Docusaurus site MUST include the blog plugin configuration to enable blog functionality for publishing project updates, technical articles, and community content.

#### Scenario: Blog plugin is configured in docusaurus.config.ts

**Given** the `docusaurus.config.ts` file exists
**When** the preset configuration is examined
**Then** the `@docusaurus/preset-classic` configuration MUST include a `blog` object
**And** the blog configuration MUST include:
  - `blogTitle` set to "博客"
  - `blogDescription` describing the blog purpose
  - `routeBasePath` set to "blog"
  - `path` set to "blog"
  - `postsPerPage` set to a positive integer (default: 10)

#### Scenario: Blog plugin generates valid routes

**Given** the blog plugin is configured
**When** the Docusaurus site builds
**Then** the blog list page MUST be accessible at `/blog`
**And** individual blog posts MUST be accessible at `/blog/YYYY/MM/DD/:slug`
**And** no 404 errors MUST occur for blog routes

#### Scenario: TypeScript validation passes

**Given** the blog plugin is configured in `docusaurus.config.ts`
**When** `npm run typecheck` is executed
**Then** no type errors MUST be reported
**And** the configuration MUST conform to Docusaurus 3.x blog plugin types

---

### Requirement: Blog Navigation Link

The site navigation bar MUST include a blog link that allows users to access the blog section from any page.

#### Scenario: Navbar displays blog link

**Given** the Docusaurus site is running
**When** a user views the top navigation bar
**Then** a "博客" link MUST be displayed
**And** the link MUST be positioned on the left side of the navbar
**And** the link MUST appear after the "Docs" link
**And** the link MUST navigate to `/blog` when clicked

#### Scenario: Blog link uses client-side routing

**Given** the navbar blog link is configured
**When** a user clicks on the "博客" link
**Then** the navigation MUST use client-side routing
**And** a full page reload MUST NOT occur
**And** the browser history MUST be updated

#### Scenario: Blog link is in Chinese

**Given** the site is configured for Chinese language only
**When** the navbar is rendered
**Then** the blog link MUST display the label "博客" (not "Blog")
**And** the label MUST be consistent with the site's language configuration

---

### Requirement: Blog Directory Structure

The site MUST include a `blog/` directory at the repository root for storing blog post files.

#### Scenario: Blog directory exists

**Given** the repository structure is examined
**When** listing directories at the repository root
**Then** a `blog/` directory MUST exist
**And** the directory MUST be at the same level as `docs/` and `src/`

#### Scenario: Blog directory contains markdown files

**Given** the `blog/` directory exists
**When** listing files in the blog directory
**Then** at least one markdown file MUST exist
**And** markdown files MUST follow the naming convention `YYYY-MM-DD-slug.md`
**And** each file MUST contain valid frontmatter

#### Scenario: Blog posts are discoverable

**Given** markdown files exist in the `blog/` directory
**When** the Docusaurus site builds
**Then** all blog posts MUST be included in the build output
**And** blog posts MUST appear on the blog list page at `/blog`
**And** each blog post MUST have a detail page accessible via its slug

---

### Requirement: Blog Post Frontmatter

All blog post files MUST include valid frontmatter with required metadata fields.

#### Scenario: Blog post includes required frontmatter fields

**Given** a markdown file exists in the `blog/` directory
**When** the file frontmatter is examined
**Then** the file MUST include a `title` field
**And** the file MUST include a `description` field
**And** the file MAY include optional fields: `authors`, `tags`, `slug`, `date`

#### Scenario: Blog post frontmatter is valid YAML

**Given** a blog post file contains frontmatter
**When** the frontmatter is parsed
**Then** the frontmatter MUST be valid YAML
**And** the frontmatter MUST be delimited by triple dashes (`---`)
**And** no parsing errors MUST occur

#### Scenario: Blog post displays frontmatter metadata

**Given** a blog post has valid frontmatter
**When** the blog post page is rendered
**Then** the page MUST display the title from the `title` field
**And** the page MUST display the author if `authors` is specified
**And** the page MUST display the publication date
**And** the page MUST display tags if `tags` are specified

---

### Requirement: Default Welcome Blog Post

The site MUST include a default welcome blog post that introduces the blog purpose to new visitors.

#### Scenario: Welcome blog post exists

**Given** the `blog/` directory exists
**When** listing files in the blog directory
**Then** a file named `2024-01-22-welcome.md` (or similar) MUST exist
**And** the file MUST contain valid markdown content
**And** the file MUST have valid frontmatter

#### Scenario: Welcome post introduces blog purpose

**Given** the welcome blog post exists
**When** a user reads the post content
**Then** the post MUST explain the blog's purpose
**And** the post MUST describe the types of content published
**And** the post MAY include links to documentation
**And** the post MAY include community links (QQ群, GitHub)

#### Scenario: Welcome post appears on blog list

**Given** the welcome blog post exists
**When** a user navigates to `/blog`
**Then** the welcome post MUST appear in the blog list
**And** the post MUST display its title, date, and description
**And** the post MUST be clickable to view the full content

---

### Requirement: Blog Content in Chinese

All blog content MUST be in Chinese to maintain consistency with the site's single-language configuration.

#### Scenario: Blog posts use Chinese language

**Given** a blog post file exists in the `blog/` directory
**When** the post content is examined
**Then** the post content MUST be written in Chinese
**And** the frontmatter `title` MUST be in Chinese
**And** the frontmatter `description` MUST be in Chinese
**And** code blocks and commands MAY remain in English

#### Scenario: Blog page UI is in Chinese

**Given** a user views any blog-related page
**When** the page UI is rendered
**Then** the blog list page title MUST be in Chinese
**And** navigation labels MUST be in Chinese
**And** any UI text (buttons, labels) MUST be in Chinese

---

### Requirement: Blog Build Validation

The build process MUST complete successfully with blog functionality enabled, producing a valid production build.

#### Scenario: Production build succeeds with blog

**Given** the blog plugin is configured
**And** blog post files exist in the `blog/` directory
**When** `npm run build` is executed
**Then** the build MUST complete successfully
**And** no build errors MUST be reported
**And** the build output MUST include blog pages
**And** no broken link errors MUST occur

#### Scenario: Development server serves blog content

**Given** the blog plugin is configured
**When** `npm start` is executed
**Then** the development server MUST start successfully
**And** navigating to `/blog` MUST display the blog list page
**And** navigating to a blog post URL MUST display the post content
**And** hot-reload MUST work for blog post edits

#### Scenario: TypeScript validation passes

**Given** the blog functionality is implemented
**When** `npm run typecheck` is executed
**Then** no TypeScript errors MUST be reported
**And** the `docusaurus.config.ts` MUST pass type checking
**And** any custom blog-related components MUST pass type checking

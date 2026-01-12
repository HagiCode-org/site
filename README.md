# PCode Documentation

Welcome to the PCode documentation site. This site is built with [Docusaurus](https://docusaurus.io/) and provides comprehensive guides and documentation for the PCode project.

## Quick Start

### Prerequisites

- **Node.js** >= 18.0
- **npm** or **yarn** package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pcode/pcode-docs.git
   cd pcode-docs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Development

### Start the Development Server

```bash
npm start
```

This command starts a local development server with hot-reloading enabled. The server will be available at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

This command creates an optimized production build in the `build/` directory.

### Serve Production Build Locally

```bash
npm run serve
```

This command serves the production build locally for testing before deployment.

## Project Structure

```
pcode-docs/
├── docusaurus.config.ts    # Main Docusaurus configuration
├── sidebars.ts              # Sidebar configuration for docs
├── package.json             # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── docs/                    # Documentation content
│   ├── installation/        # Installation guides
│   └── feature-guides/      # Feature documentation
├── blog/                    # Blog posts
│   └── authors.yml          # Blog authors configuration
├── static/                  # Static assets (images, etc.)
│   └── img/                 # Image files
├── src/                     # Custom React components and pages
│   ├── css/
│   │   └── custom.css       # Custom styles
│   └── pages/               # Custom pages
│       └── index.tsx        # Homepage
└── i18n/                    # Internationalization files
```

## Adding Documentation

### Create a New Document

1. Create a new markdown file in the appropriate directory under `docs/`
2. Add frontmatter with title and description:
   ```yaml
   ---
   title: Your Document Title
   description: A brief description of the document
   ---
   ```
3. Save the file - it will automatically appear in the sidebar

### Create a New Category

1. Create a new directory under `docs/`
2. Add a `_category_.json` file:
   ```json
   {
     "label": "Category Name",
     "position": 1
   }
   ```
3. Update `sidebars.ts` to include the new category

## Adding Blog Posts

1. Create a new markdown file in the `blog/` directory with the format `YYYY-MM-DD-title.md`
2. Add frontmatter:
   ```yaml
   ---
   slug: post-title
   title: Your Post Title
   authors: [author-key]
   tags: [tag1, tag2]
   ---

   <!-- truncate -->
   ```
3. The `<!-- truncate -->` marker separates the excerpt from the full content

## Customization

### Styling

Edit `src/css/custom.css` to customize the site's appearance. You can override CSS variables defined by Docusaurus or add your own styles.

### Configuration

Edit `docusaurus.config.ts` to customize:
- Site metadata (title, tagline, URL)
- Navigation (navbar and footer)
- Theme settings
- Plugin configurations
- Internationalization

## Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm start` and `npm run build`
5. Submit a pull request

### Content Guidelines

- Use clear, concise language
- Include code examples where applicable
- Add proper frontmatter to all documents
- Test links and ensure they work
- Follow the existing document structure

## Deployment

The site is configured for easy deployment. The `build/` directory contains all static files and can be deployed to:

- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

## License

See [LICENSE](LICENSE) file for details.

## Support

- GitHub Issues: https://github.com/pcode/pcode-docs/issues
- Documentation: https://pcode.docs

---

Built with [Docusaurus](https://docusaurus.io/).

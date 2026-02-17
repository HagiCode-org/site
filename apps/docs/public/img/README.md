# Static Images Directory

This directory contains static image files that are served directly by the Astro site.

## ⚠️ Important Note

**Document images have been migrated!**

As part of the image migration to Content Collections, all documentation-related images have been moved to `src/content/docs/img/`. This directory now only contains:

- **home/** - Images used by the root README.md (project homepage)
- **docusaurus-social-card.jpg** - Social media preview image

## Current Contents

```
public/img/
├── home/                          # Root README.md images
│   ├── 亮色主题主界面.png
│   ├── 暗色主题主界面.png
│   ├── 使用 AI 的效率提升报告.png
│   ├── 每日成就报告.png
│   └── 每日编写代码获得的成就.png
├── docusaurus-social-card.jpg      # Social media preview
└── README.md                       # This file
```

## Image Management Policy

### For Documentation Content

**DO NOT** add new documentation images to this directory.

Instead, use the new Content Collections image directory:

```
src/content/docs/img/
├── quick-start/                   # Quick start guide images
├── installation/                  # Installation guide images
├── related-software-installation/ # Related software images
├── product-overview/              # Product overview images
└── shared/                        # Shared documentation images
```

**Reference images in Markdown using relative paths:**

```markdown
<!-- In docs root (e.g., product-overview.md) -->
![Image](./img/category/image.png)

<!-- In subdirectories (e.g., quick-start/file.md) -->
![Image](../img/quick-start/category/image.png)

<!-- In nested subdirectories -->
![Image](../../img/category/image.png)
```

### For Static Site Assets

This directory is appropriate for:

- **Site-wide assets**: favicons, logos, social media images
- **Root README images**: images displayed on the project homepage
- **Public resources**: assets referenced from non-content pages

Reference these using absolute paths:

```markdown
![Image](/img/filename.png)
```

## Supported Formats

Common image formats are supported:
- PNG (.png)
- JPEG (.jpg, .jpeg)
- GIF (.gif)
- SVG (.svg)
- WebP (.webp)

## Best Practices

1. **Optimize images** - Compress images before adding them
2. **Use descriptive names** - Name files clearly (e.g., `installation-screenshot.png`)
3. **Choose the right location** - Documentation images → `src/content/docs/img/`, site assets → `public/img/`

## Migration Info

This directory was cleaned up as part of the astro-image-migration proposal. See the migration scripts in `scripts/image-migration/` for details.

---

**Last Updated**: 2025-02-17
**Migration**: astro-image-migration

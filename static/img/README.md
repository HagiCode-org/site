# Static Images Directory

This directory is for static image files that will be served by your Docusaurus site.

## Usage

Place images in this directory and reference them in your markdown files using:

```markdown
![Alt text](/img/your-image.png)
```

## Supported Formats

Common image formats are supported:
- PNG (.png)
- JPEG (.jpg, .jpeg)
- GIF (.gif)
- SVG (.svg)
- WebP (.webp)

## Best Practices

1. **Optimize images** - Compress images before adding them to keep page load times fast
2. **Use descriptive names** - Name your files clearly (e.g., `installation-screenshot.png`)
3. **Organize** - Consider creating subdirectories if you have many images

## Notes

- Files in this directory are copied to the `build/` directory as-is during the build process
- The `/img/` path is relative to the `static/` directory

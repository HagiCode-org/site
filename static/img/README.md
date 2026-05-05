# Static Image Notes

This directory is deprecated for image binaries.

## Usage

Place site-managed images in `src/assets/img/` and import them so Vite handles bundling and hashing.

```ts
import heroImage from '@/assets/img/your-image.png';
```

## Notes

- Keep `static/` and `public/` only for passthrough files that must retain stable names.
- Image binaries for the site should not be added here anymore.

# Site Image Notes

This directory is now documentation-only.

## Usage

Place site-managed images in `src/assets/img/` and import them so Vite fingerprints and bundles them.

```ts
import heroImage from '@/assets/img/your-image.png';
```

## Notes

- Keep `public/` for passthrough files that must retain stable names, such as `favicon.ico`, `robots.txt`, or verification files.
- Legacy asset-map markdown files can stay here for reference, but image binaries now live under `src/assets/img/`.

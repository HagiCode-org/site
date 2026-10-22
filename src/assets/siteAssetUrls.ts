const siteAssetModules = import.meta.glob('./**/*.{png,jpg,jpeg,webp,svg,avif,gif}', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>;

export function getSiteAssetUrl(assetPath: string): string {
  const normalizedAssetPath = assetPath.replace(/^\/+/, '');
  const modulePath = `./${normalizedAssetPath}`;
  const assetUrl = siteAssetModules[modulePath];

  if (!assetUrl) {
    throw new Error(`Unknown site asset: ${assetPath}`);
  }

  return assetUrl;
}

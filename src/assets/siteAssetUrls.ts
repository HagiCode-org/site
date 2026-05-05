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

const homeHeroAssetPaths = [
  'img/home/interesting/heroes/aurora-04.webp',
  'img/home/interesting/heroes/cat-ink-09.webp',
  'img/home/interesting/heroes/cat-line-03.webp',
  'img/home/interesting/heroes/cat-oil-09.webp',
  'img/home/interesting/heroes/cat-paper-04.webp',
  'img/home/interesting/heroes/cat-sticker-02.webp',
  'img/home/interesting/heroes/cat-sticker-08.webp',
  'img/home/interesting/heroes/royal-10.webp',
  'img/home/interesting/heroes/thorn-06.webp',
  'img/home/interesting/heroes/tide-09.webp',
] as const;

export const homeHeroImages = homeHeroAssetPaths.map(getSiteAssetUrl);

export const homeShowcaseImages = {
  proposalWorkflow: getSiteAssetUrl('img/home/showcase-proposal-workflow.png'),
  sessionBoard: getSiteAssetUrl('img/home/showcase-session-board.png'),
  tokenAnalytics: getSiteAssetUrl('img/home/showcase-token-analytics.png'),
  workspaceManagement: getSiteAssetUrl('img/home/showcase-workspace-management.png'),
  achievementProgress: getSiteAssetUrl('img/home/showcase-achievement-progress.png'),
} as const;

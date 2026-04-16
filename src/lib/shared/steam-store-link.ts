import {
  fetchCanonicalAboutSnapshot,
  getBundledAboutSnapshot,
  type AboutSnapshotData,
} from '@/lib/about-snapshot-source';

export const DEFAULT_STEAM_STORE_URL = 'https://store.steampowered.com/app/4625540/Hagicode/';

export interface SteamStoreLinkResult {
  readonly href: string;
  readonly source: 'canonical' | 'bundled' | 'fallback';
  readonly updatedAt: string | null;
}

let cachedSteamStoreLinkPromise: Promise<SteamStoreLinkResult> | null = null;

function resolveSteamHref(snapshot: AboutSnapshotData): string | null {
  const steamEntry = snapshot.entries.find(
    (entry) => entry.id === 'steam' && entry.type === 'link' && entry.url.trim().length > 0,
  );

  return steamEntry && steamEntry.type === 'link' ? steamEntry.url : null;
}

export function getBundledSteamStoreLink(): SteamStoreLinkResult {
  try {
    const snapshot = getBundledAboutSnapshot();
    return {
      href: resolveSteamHref(snapshot) ?? DEFAULT_STEAM_STORE_URL,
      source: resolveSteamHref(snapshot) ? 'bundled' : 'fallback',
      updatedAt: snapshot.updatedAt,
    };
  } catch {
    return {
      href: DEFAULT_STEAM_STORE_URL,
      source: 'fallback',
      updatedAt: null,
    };
  }
}

async function fetchSteamStoreLinkInternal(fetcher: typeof fetch = fetch): Promise<SteamStoreLinkResult> {
  try {
    const snapshot = await fetchCanonicalAboutSnapshot(fetcher);
    return {
      href: resolveSteamHref(snapshot) ?? DEFAULT_STEAM_STORE_URL,
      source: resolveSteamHref(snapshot) ? 'canonical' : 'fallback',
      updatedAt: snapshot.updatedAt,
    };
  } catch {
    return getBundledSteamStoreLink();
  }
}

export function loadSteamStoreLink(fetcher: typeof fetch = fetch): Promise<SteamStoreLinkResult> {
  if (fetcher !== fetch) {
    return fetchSteamStoreLinkInternal(fetcher);
  }

  if (!cachedSteamStoreLinkPromise) {
    cachedSteamStoreLinkPromise = fetchSteamStoreLinkInternal(fetcher);
  }

  return cachedSteamStoreLinkPromise;
}

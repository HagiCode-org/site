import {
  fetchCanonicalAboutSnapshot,
  getBundledAboutSnapshot,
  type AboutSnapshotData,
} from '@/lib/about-snapshot-source';

export const DEFAULT_WINDOWS_STORE_URL = 'https://apps.microsoft.com/detail/9N3PM0N3SVDW';

export interface WindowsStoreLinkResult {
  readonly href: string;
  readonly source: 'canonical' | 'bundled' | 'fallback';
  readonly updatedAt: string | null;
}

let cachedWindowsStoreLinkPromise: Promise<WindowsStoreLinkResult> | null = null;

function resolveWindowsStoreHref(snapshot: AboutSnapshotData): string | null {
  const windowsStoreEntry = snapshot.entries.find(
    (entry) => entry.id === 'windows-store' && entry.type === 'link' && entry.url.trim().length > 0,
  );

  return windowsStoreEntry && windowsStoreEntry.type === 'link' ? windowsStoreEntry.url : null;
}

export function getBundledWindowsStoreLink(): WindowsStoreLinkResult {
  try {
    const snapshot = getBundledAboutSnapshot();
    const href = resolveWindowsStoreHref(snapshot);
    return {
      href: href ?? DEFAULT_WINDOWS_STORE_URL,
      source: href ? 'bundled' : 'fallback',
      updatedAt: snapshot.updatedAt,
    };
  } catch {
    return {
      href: DEFAULT_WINDOWS_STORE_URL,
      source: 'fallback',
      updatedAt: null,
    };
  }
}

async function fetchWindowsStoreLinkInternal(fetcher: typeof fetch = fetch): Promise<WindowsStoreLinkResult> {
  try {
    const snapshot = await fetchCanonicalAboutSnapshot(fetcher);
    const href = resolveWindowsStoreHref(snapshot);
    return {
      href: href ?? DEFAULT_WINDOWS_STORE_URL,
      source: href ? 'canonical' : 'fallback',
      updatedAt: snapshot.updatedAt,
    };
  } catch {
    return getBundledWindowsStoreLink();
  }
}

export function loadWindowsStoreLink(fetcher: typeof fetch = fetch): Promise<WindowsStoreLinkResult> {
  if (fetcher !== fetch) {
    return fetchWindowsStoreLinkInternal(fetcher);
  }

  if (!cachedWindowsStoreLinkPromise) {
    cachedWindowsStoreLinkPromise = fetchWindowsStoreLinkInternal(fetcher);
  }

  return cachedWindowsStoreLinkPromise;
}

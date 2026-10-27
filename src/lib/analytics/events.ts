import type { GaCategory } from '@hagicode/hagilight-core/analytics-events';
import { AssetType } from '../shared/types/desktop';

export const WEBSITE_TRACKING_EVENTS = {
  downloadDesktop: 'download_desktop',
  openDesktopPage: 'open_desktop_page',
  openSteamStore: 'open_steam_store',
  downloadDesktopWindows: 'download_desktop_windows',
  downloadDesktopMacOS: 'download_desktop_macos',
  downloadDesktopLinux: 'download_desktop_linux',
} as const;

export type WebsiteTrackingEventName =
  (typeof WEBSITE_TRACKING_EVENTS)[keyof typeof WEBSITE_TRACKING_EVENTS];

/** Google Analytics category and label the unified tracker mirrors an event as. */
export interface WebsiteTrackingGaMapping {
  category: GaCategory;
  /** Stable identifier, the camelCase key of the event in `WEBSITE_TRACKING_EVENTS`. */
  label: string;
}

export type WebsiteTrackingPlatform = 'windows' | 'macos' | 'linux';

export interface WebsiteTrackingEventDefinition {
  name: WebsiteTrackingEventName;
  description: string;
  locations: readonly string[];
  meaning: string;
  ga: WebsiteTrackingGaMapping;
  /** Desktop platform of a direct download event; reported to PostHog as `platform`. */
  platform?: WebsiteTrackingPlatform;
}

export const WEBSITE_TRACKING_EVENT_CATALOG: readonly WebsiteTrackingEventDefinition[] = [
  {
    name: WEBSITE_TRACKING_EVENTS.downloadDesktop,
    description: 'Primary install/download CTA across the marketing site',
    locations: ['Homepage install button', 'Navbar install button'],
    meaning: 'User intends to install or download Hagicode Desktop',
    ga: { category: 'download', label: 'downloadDesktop' },
  },
  {
    name: WEBSITE_TRACKING_EVENTS.openDesktopPage,
    description: 'Navigation from marketing homepage into the Desktop product page',
    locations: ['Homepage install options desktop card'],
    meaning: 'User wants to learn more about the Desktop offering',
    ga: { category: 'navigation', label: 'openDesktopPage' },
  },
  {
    name: WEBSITE_TRACKING_EVENTS.openSteamStore,
    description: 'Open the Hagicode Steam store page from a marketing CTA',
    locations: ['Homepage hero Steam button'],
    meaning: 'User wants to view the Steam edition of Hagicode',
    ga: { category: 'store', label: 'openSteamStore' },
  },
  {
    name: WEBSITE_TRACKING_EVENTS.downloadDesktopWindows,
    description: 'Direct download of a Windows desktop package',
    locations: ['DesktopHero', 'InstallButton platform list'],
    meaning: 'User downloads a Windows build of Hagicode Desktop',
    ga: { category: 'download', label: 'downloadDesktopWindows' },
    platform: 'windows',
  },
  {
    name: WEBSITE_TRACKING_EVENTS.downloadDesktopMacOS,
    description: 'Direct download of a macOS desktop package',
    locations: ['DesktopHero', 'InstallButton platform list'],
    meaning: 'User downloads a macOS build of Hagicode Desktop',
    ga: { category: 'download', label: 'downloadDesktopMacOS' },
    platform: 'macos',
  },
  {
    name: WEBSITE_TRACKING_EVENTS.downloadDesktopLinux,
    description: 'Direct download of a Linux desktop package',
    locations: ['DesktopHero', 'InstallButton platform list'],
    meaning: 'User downloads a Linux build of Hagicode Desktop',
    ga: { category: 'download', label: 'downloadDesktopLinux' },
    platform: 'linux',
  },
] as const;

const TRACKING_EVENT_NAME_SET = new Set<WebsiteTrackingEventName>(
  WEBSITE_TRACKING_EVENT_CATALOG.map((eventDefinition) => eventDefinition.name),
);

export function isWebsiteTrackingEventName(value: string): value is WebsiteTrackingEventName {
  return TRACKING_EVENT_NAME_SET.has(value as WebsiteTrackingEventName);
}

export function getDesktopDownloadEventName(assetType?: AssetType): WebsiteTrackingEventName {
  if (!assetType) {
    return WEBSITE_TRACKING_EVENTS.downloadDesktop;
  }

  switch (assetType) {
    case AssetType.WindowsPortable:
    case AssetType.WindowsSetup:
    case AssetType.WindowsStore:
      return WEBSITE_TRACKING_EVENTS.downloadDesktopWindows;
    case AssetType.MacOSApple:
    case AssetType.MacOSIntel:
      return WEBSITE_TRACKING_EVENTS.downloadDesktopMacOS;
    case AssetType.LinuxAppImage:
    case AssetType.LinuxArm64AppImage:
    case AssetType.LinuxTarball:
    case AssetType.LinuxArm64Tarball:
      return WEBSITE_TRACKING_EVENTS.downloadDesktopLinux;
    case AssetType.Source:
    case AssetType.Unknown:
    default:
      return WEBSITE_TRACKING_EVENTS.downloadDesktop;
  }
}

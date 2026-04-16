import { AssetType } from '../shared/types/desktop';

export const WEBSITE_TRACKING_EVENTS = {
  downloadDesktop: 'download_desktop',
  openDesktopPage: 'open_desktop_page',
  openContainerPage: 'open_container_page',
  openSteamStore: 'open_steam_store',
  downloadDesktopWindows: 'download_desktop_windows',
  downloadDesktopMacOS: 'download_desktop_macos',
  downloadDesktopLinux: 'download_desktop_linux',
  openContainerDeploymentGuide: 'open_container_deployment_guide',
  openContainerSourceRepo: 'open_container_source_repo',
} as const;

export type WebsiteTrackingEventName =
  (typeof WEBSITE_TRACKING_EVENTS)[keyof typeof WEBSITE_TRACKING_EVENTS];

export interface WebsiteTrackingEventDefinition {
  name: WebsiteTrackingEventName;
  description: string;
  locations: readonly string[];
  meaning: string;
}

export const WEBSITE_TRACKING_EVENT_CATALOG: readonly WebsiteTrackingEventDefinition[] = [
  {
    name: WEBSITE_TRACKING_EVENTS.downloadDesktop,
    description: 'Primary install/download CTA across the marketing site',
    locations: ['Homepage install button', 'Navbar install button'],
    meaning: 'User intends to install or download Hagicode Desktop',
  },
  {
    name: WEBSITE_TRACKING_EVENTS.openDesktopPage,
    description: 'Navigation from marketing homepage into the Desktop product page',
    locations: ['Homepage install options desktop card'],
    meaning: 'User wants to learn more about the Desktop offering',
  },
  {
    name: WEBSITE_TRACKING_EVENTS.openContainerPage,
    description: 'Navigation from marketing homepage into the Container product page',
    locations: ['Homepage install options container card', 'Install button container fallback'],
    meaning: 'User wants to learn more about the Container offering',
  },
  {
    name: WEBSITE_TRACKING_EVENTS.openSteamStore,
    description: 'Open the Hagicode Steam store page from a marketing CTA',
    locations: ['Homepage hero Steam button'],
    meaning: 'User wants to view the Steam edition of Hagicode',
  },
  {
    name: WEBSITE_TRACKING_EVENTS.downloadDesktopWindows,
    description: 'Direct download of a Windows desktop package',
    locations: ['DesktopHero', 'InstallButton platform list'],
    meaning: 'User downloads a Windows build of Hagicode Desktop',
  },
  {
    name: WEBSITE_TRACKING_EVENTS.downloadDesktopMacOS,
    description: 'Direct download of a macOS desktop package',
    locations: ['DesktopHero', 'InstallButton platform list'],
    meaning: 'User downloads a macOS build of Hagicode Desktop',
  },
  {
    name: WEBSITE_TRACKING_EVENTS.downloadDesktopLinux,
    description: 'Direct download of a Linux desktop package',
    locations: ['DesktopHero', 'InstallButton platform list'],
    meaning: 'User downloads a Linux build of Hagicode Desktop',
  },
  {
    name: WEBSITE_TRACKING_EVENTS.openContainerDeploymentGuide,
    description: 'Open the Docker Compose deployment guide or related docs entry',
    locations: ['Container page CTA', 'Container page FAQ support link'],
    meaning: 'User intends to deploy Hagicode via container workflow',
  },
  {
    name: WEBSITE_TRACKING_EVENTS.openContainerSourceRepo,
    description: 'Open the source repository from the Container page CTA area',
    locations: ['Container page secondary CTA'],
    meaning: 'User wants to inspect the source repository before deployment',
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
    case AssetType.LinuxDeb:
    case AssetType.LinuxArm64Deb:
    case AssetType.LinuxTarball:
    case AssetType.LinuxArm64Tarball:
      return WEBSITE_TRACKING_EVENTS.downloadDesktopLinux;
    case AssetType.Source:
    case AssetType.Unknown:
    default:
      return WEBSITE_TRACKING_EVENTS.downloadDesktop;
  }
}

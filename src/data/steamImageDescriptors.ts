export type SteamImageDescriptor = {
  src: string;
  variant: 'store-capsule' | 'wide-capsule' | 'library-capsule' | 'hero' | string;
  alt?: string;
  width?: number;
  height?: number;
};

export type SteamProductImageRecord = {
  key: string;
  displayName: string;
  type: 'application' | 'dlc' | 'bundle';
  storeUrl: string;
  images: SteamImageDescriptor[];
};

const INDEX_ORIGIN = 'https://index.hagicode.com';

function fromIndex(path: string): string {
  return new URL(path, INDEX_ORIGIN).toString();
}

export const steamProductImageRecords: Record<string, SteamProductImageRecord> = {
  hagicode: {
    key: 'hagicode',
    displayName: 'Hagicode',
    type: 'application',
    storeUrl: 'https://store.steampowered.com/app/4625540/Hagicode/',
    images: [
      {
        src: fromIndex('/_astro/1232x706.BrEtrYAu.png'),
        variant: 'wide-capsule',
        alt: 'HagiCode wide promotional capsule',
        width: 1232,
        height: 706,
      },
    ],
  },
  'turbo-engine': {
    key: 'turbo-engine',
    displayName: 'Hagicode: Turbo Engine DLC',
    type: 'dlc',
    storeUrl: 'https://store.steampowered.com/app/4635480/Hagicode__Turbo_Engine/',
    images: [
      {
        src: fromIndex('/_astro/hagicode-turbo-engine-promo-1232x706.DEhNVCvm.png'),
        variant: 'wide-capsule',
        alt: 'Turbo Engine DLC wide promotional capsule',
        width: 1232,
        height: 706,
      },
    ],
  },
  'hagicode-plus': {
    key: 'hagicode-plus',
    displayName: 'Hagicode Plus',
    type: 'bundle',
    storeUrl: 'https://store.steampowered.com/bundle/73989/Hagicode_Plus/',
    images: [
      {
        src: fromIndex('/_astro/hagicode-plus-1232x706.DjxjwJgf.png'),
        variant: 'wide-capsule',
        alt: 'Hagicode Plus Steam bundle wide promotional capsule',
        width: 1232,
        height: 706,
      },
    ],
  },
};

export function getSteamProductImageRecord(key: string): SteamProductImageRecord | null {
  return steamProductImageRecords[key] ?? null;
}

/**
 * Hagicode Desktop 工具函数
 * 用于获取和处理版本数据。
 *
 * 官网运行时仅请求 index 站的 canonical desktop 索引。
 */

import semver from 'semver';

import type {
  DownloadAction,
  DesktopAsset,
  DesktopIndexResponse,
  DesktopPlatform,
  DesktopStructuredSourceKind,
  DownloadSourceKind,
  DownloadSourceProbeState,
  DownloadSourceProbeStateMap,
  PlatformDownload,
  PlatformGroup,
  DesktopVersion,
} from './types/desktop';
import { AssetType, CpuArchitecture } from './types/desktop';

export const PRIMARY_INDEX_JSON_URL = 'https://index.hagicode.com/desktop/index.json';
const DOWNLOAD_BASE_URL = 'https://desktop.dl.hagicode.com/';
const TIMEOUT_MS = 30000;
const DOWNLOAD_SOURCE_PROBE_TIMEOUT_MS = 1800;

// LocalStorage keys
const ARCHITECTURE_STORAGE_KEY = 'hagicode-architecture-selection';
const SOURCE_ACTION_ORDER: Record<DownloadSourceKind, number> = {
  official: 0,
  legacy: 1,
  'github-release': 2,
  torrent: 3,
};
const PROBE_ACTION_PRIORITY: DownloadSourceKind[] = ['github-release', 'official', 'legacy'];
const PROBEABLE_SOURCE_KINDS = new Set<DownloadSourceKind>(['official', 'legacy', 'github-release']);
const DEFAULT_PROBE_STATE: DownloadSourceProbeState = 'unknown';

const downloadSourceProbeStateByTarget = new Map<string, DownloadSourceProbeState>();
const downloadSourceProbePromiseByTarget = new Map<string, Promise<DownloadSourceProbeState>>();

export type DesktopVersionSource = 'primary' | 'server';

export interface DesktopVersionFetchAttempt {
  source: DesktopVersionSource;
  error: string;
}

export interface DesktopVersionFetchResult {
  data: DesktopIndexResponse;
  source: DesktopVersionSource;
  attempts: DesktopVersionFetchAttempt[];
}

export class DesktopVersionFetchError extends Error {
  attempts: DesktopVersionFetchAttempt[];

  constructor(message: string, attempts: DesktopVersionFetchAttempt[]) {
    super(message);
    this.name = 'DesktopVersionFetchError';
    this.attempts = attempts;
  }
}

const SOURCE_CONFIGS: Array<{ source: DesktopVersionSource; url: string }> = [
  { source: 'primary', url: PRIMARY_INDEX_JSON_URL },
];

/**
 * 平台推荐配置
 * 支持多架构推荐
 */
export const PLATFORM_RECOMMENDATIONS: Record<
  DesktopPlatform,
  { recommendedType: AssetType; recommendedArchitecture: CpuArchitecture; label: string; icon: string }
> = {
  windows: {
    recommendedType: AssetType.WindowsSetup,
    recommendedArchitecture: CpuArchitecture.X64,
    label: 'Windows',
    icon: 'seti:windows',
  },
  macos: {
    recommendedType: AssetType.MacOSApple,
    recommendedArchitecture: CpuArchitecture.ARM64,
    label: 'macOS',
    icon: 'seti:apple',
  },
  linux: {
    recommendedType: AssetType.LinuxAppImage,
    recommendedArchitecture: CpuArchitecture.X64,
    label: 'Linux',
    icon: 'seti:linux',
  },
};

/**
 * 平台图标常量（用于 UI 显示）
 */
export const PLATFORM_ICONS: Record<string, string> = {
  macos: '🍎',
  windows: '🪟',
  linux: '🐧',
};

export type PrimaryDownloadSourceKey = 'accelerated' | 'github';

export interface PrimaryDownloadActionPair {
  accelerated: DownloadAction | null;
  github: DownloadAction | null;
  secondary: DownloadAction[];
}

function isKnownStructuredSourceKind(kind: string): kind is DesktopStructuredSourceKind {
  return kind === 'official' || kind === 'github-release';
}

function normalizeKnownSourceKind(kind: string | undefined): DesktopStructuredSourceKind | null {
  const normalizedKind = typeof kind === 'string' ? kind.trim().toLowerCase() : '';
  return isKnownStructuredSourceKind(normalizedKind) ? normalizedKind : null;
}

function resolveAbsoluteUrl(urlValue: string): string | null {
  const trimmed = urlValue.trim();
  if (!trimmed) {
    return null;
  }

  try {
    return new URL(trimmed).toString();
  } catch {
    if (trimmed.startsWith('./') || trimmed.startsWith('../')) {
      try {
        return new URL(trimmed, PRIMARY_INDEX_JSON_URL).toString();
      } catch {
        return null;
      }
    }

    return new URL(trimmed.replace(/^\/+/, ''), DOWNLOAD_BASE_URL).toString();
  }
}

function resolveLegacyAssetUrl(asset: DesktopAsset): string | null {
  if (typeof asset.directUrl === 'string') {
    return resolveAbsoluteUrl(asset.directUrl);
  }

  if (typeof asset.path === 'string' && asset.path.trim().length > 0) {
    return resolveAbsoluteUrl(asset.path);
  }

  return null;
}

function createDownloadAction(
  kind: DownloadSourceKind,
  url: string,
  options?: Partial<Pick<DownloadAction, 'label' | 'isPrimary' | 'isStructured' | 'isLegacyFallback'>>,
): DownloadAction {
  return {
    kind,
    url,
    label: options?.label?.trim() || kind,
    isPrimary: options?.isPrimary === true,
    isStructured: options?.isStructured === true,
    isLegacyFallback: options?.isLegacyFallback === true,
  };
}

export function getDownloadActionLabel(
  kind: DownloadSourceKind,
  locale: 'zh-CN' | 'en' = 'zh-CN',
): string {
  const zhLabels: Record<DownloadSourceKind, string> = {
    official: '中国大陆加速下载',
    legacy: '中国大陆加速下载',
    'github-release': 'GitHub 下载',
    torrent: '种子下载',
  };
  const enLabels: Record<DownloadSourceKind, string> = {
    official: 'China',
    legacy: 'China',
    'github-release': 'GitHub Download',
    torrent: 'Torrent',
  };

  return (locale === 'en' ? enLabels : zhLabels)[kind];
}

export function getPrimaryDownloadSourceLabel(
  source: PrimaryDownloadSourceKey,
  locale: 'zh-CN' | 'en' = 'zh-CN',
): string {
  if (source === 'accelerated') {
    return locale === 'en' ? 'China' : '中国大陆加速';
  }

  return locale === 'en' ? 'GitHub' : 'GitHub';
}

export function normalizeDownloadActions(asset: DesktopAsset): DownloadAction[] {
  const actions: DownloadAction[] = [];
  const seen = new Set<string>();

  const addAction = (action: DownloadAction | null) => {
    if (!action) {
      return;
    }

    const key = `${action.kind}:${action.url.toLowerCase()}`;
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    actions.push(action);
  };

  const structuredSources = Array.isArray(asset.downloadSources)
    ? asset.downloadSources
        .map((source) => {
          const kind = normalizeKnownSourceKind(source?.kind);
          const url = typeof source?.url === 'string' ? resolveAbsoluteUrl(source.url) : null;
          if (!kind || !url) {
            return null;
          }

          return createDownloadAction(kind, url, {
            label: source?.label,
            isPrimary: source?.primary === true,
            isStructured: true,
          });
        })
        .filter((source): source is DownloadAction => Boolean(source))
    : [];

  const legacyUrl = resolveLegacyAssetUrl(asset);
  const hasStructuredSources = structuredSources.length > 0;
  const officialStructured = structuredSources.find((source) => source.kind === 'official') ?? null;
  const githubStructured = structuredSources.find((source) => source.kind === 'github-release') ?? null;

  if (officialStructured) {
    addAction(officialStructured);
  } else if (legacyUrl) {
    addAction(
      createDownloadAction(hasStructuredSources ? 'official' : 'legacy', legacyUrl, {
        label: hasStructuredSources ? 'official' : 'legacy',
        isPrimary: !githubStructured,
        isLegacyFallback: true,
      }),
    );
  }

  if (githubStructured) {
    addAction(githubStructured);
  }

  const torrentUrl =
    typeof asset.torrentUrl === 'string' ? resolveAbsoluteUrl(asset.torrentUrl) : null;
  if (torrentUrl) {
    addAction(
      createDownloadAction('torrent', torrentUrl, {
        label: 'torrent',
      }),
    );
  }

  actions.sort((left, right) => {
    const priorityDiff = SOURCE_ACTION_ORDER[left.kind] - SOURCE_ACTION_ORDER[right.kind];
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    if (left.isPrimary !== right.isPrimary) {
      return left.isPrimary ? -1 : 1;
    }

    return left.label.localeCompare(right.label);
  });

  return actions;
}

export function getDownloadAction(
  download: Pick<PlatformDownload, 'sourceActions'> | null | undefined,
  kind: DownloadSourceKind,
): DownloadAction | null {
  if (!download) {
    return null;
  }

  return download.sourceActions.find((action) => action.kind === kind) ?? null;
}

export function resolvePrimaryDownloadActionPair(
  download: Pick<PlatformDownload, 'sourceActions'> | null | undefined,
): PrimaryDownloadActionPair {
  const sourceActions = download?.sourceActions ?? [];
  const accelerated =
    getDownloadAction(download, 'official') ?? getDownloadAction(download, 'legacy');
  const github = getDownloadAction(download, 'github-release');
  const primaryActions = new Set([accelerated, github].filter(Boolean));

  return {
    accelerated,
    github,
    secondary: sourceActions.filter((action) => !primaryActions.has(action)),
  };
}

export function hasGithubReleaseSource(download: Pick<PlatformDownload, 'sourceActions'> | null | undefined): boolean {
  return Boolean(getDownloadAction(download, 'github-release'));
}

function getSafeFallbackAction(
  download: Pick<PlatformDownload, 'sourceActions'> | null | undefined,
): DownloadAction | null {
  return (
    getDownloadAction(download, 'official') ??
    getDownloadAction(download, 'legacy') ??
    (download?.sourceActions[0] ?? null)
  );
}

function isProbeableDownloadSourceKind(kind: DownloadSourceKind): boolean {
  return PROBEABLE_SOURCE_KINDS.has(kind);
}

function getProbeStateForAction(
  action: DownloadAction | null,
  probeStates: DownloadSourceProbeStateMap,
): DownloadSourceProbeState {
  if (!action || !isProbeableDownloadSourceKind(action.kind)) {
    return DEFAULT_PROBE_STATE;
  }

  return probeStates[action.kind] ?? DEFAULT_PROBE_STATE;
}

export function resolvePrimaryDownloadAction(
  download: Pick<PlatformDownload, 'sourceActions'> | null | undefined,
  probeStates: DownloadSourceProbeStateMap = {},
): DownloadAction | null {
  if (!download) {
    return null;
  }

  for (const kind of PROBE_ACTION_PRIORITY) {
    const action = getDownloadAction(download, kind);
    if (action && getProbeStateForAction(action, probeStates) === 'reachable') {
      return action;
    }
  }

  return getSafeFallbackAction(download) ?? null;
}

export function collectDownloadSourceProbeTargets(
  platformGroups: PlatformGroup[] | undefined,
): Partial<Record<DownloadSourceKind, string>> {
  const targets: Partial<Record<DownloadSourceKind, string>> = {};
  if (!platformGroups) {
    return targets;
  }

  for (const platformGroup of platformGroups) {
    for (const download of platformGroup.downloads) {
      for (const action of download.sourceActions) {
        if (!isProbeableDownloadSourceKind(action.kind) || targets[action.kind]) {
          continue;
        }

        const normalizedTarget = normalizeDownloadSourceProbeUrl(action.url);
        if (normalizedTarget) {
          targets[action.kind] = normalizedTarget;
        }
      }
    }
  }

  return targets;
}

function normalizeDownloadSourceProbeUrl(urlValue?: string | null): string | null {
  if (typeof urlValue !== 'string' || urlValue.trim().length === 0) {
    return null;
  }

  try {
    const parsed = new URL(urlValue);
    return new URL('/favicon.ico', parsed.origin).toString();
  } catch {
    return null;
  }
}

function getCachedProbeStateByTarget(target: string): DownloadSourceProbeState {
  return downloadSourceProbeStateByTarget.get(target) ?? DEFAULT_PROBE_STATE;
}

export function getCachedDownloadSourceProbeStates(
  probeTargets: Partial<Record<DownloadSourceKind, string>> = {},
): DownloadSourceProbeStateMap {
  const states: DownloadSourceProbeStateMap = {};

  for (const kind of Object.keys(probeTargets) as DownloadSourceKind[]) {
    const target = probeTargets[kind];
    if (!target) {
      continue;
    }

    states[kind] = getCachedProbeStateByTarget(target);
  }

  return states;
}

export function resetDownloadSourceProbeCache(): void {
  downloadSourceProbeStateByTarget.clear();
  downloadSourceProbePromiseByTarget.clear();
}

async function ensureDownloadSourceProbeTarget(target: string): Promise<DownloadSourceProbeState> {
  if (typeof window === 'undefined' || typeof fetch === 'undefined') {
    return DEFAULT_PROBE_STATE;
  }

  const cachedState = getCachedProbeStateByTarget(target);
  if (cachedState === 'reachable' || cachedState === 'unreachable') {
    return cachedState;
  }

  const cachedPromise = downloadSourceProbePromiseByTarget.get(target);
  if (cachedPromise) {
    return cachedPromise;
  }

  downloadSourceProbeStateByTarget.set(target, 'probing');
  const probePromise = (async () => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), DOWNLOAD_SOURCE_PROBE_TIMEOUT_MS);

    try {
      await fetch(target, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal,
      });
      downloadSourceProbeStateByTarget.set(target, 'reachable');
      return 'reachable';
    } catch {
      downloadSourceProbeStateByTarget.set(target, 'unreachable');
      return 'unreachable';
    } finally {
      window.clearTimeout(timeoutId);
      downloadSourceProbePromiseByTarget.delete(target);
    }
  })();

  downloadSourceProbePromiseByTarget.set(target, probePromise);
  return probePromise;
}

export async function ensureDownloadSourceProbes(
  probeTargets: Partial<Record<DownloadSourceKind, string>> = {},
): Promise<DownloadSourceProbeStateMap> {
  const kinds = Object.keys(probeTargets) as DownloadSourceKind[];
  if (kinds.length === 0) {
    return {};
  }

  await Promise.all(
    kinds.map(async (kind) => {
      const target = probeTargets[kind];
      if (!target) {
        return;
      }

      await ensureDownloadSourceProbeTarget(target);
    }),
  );

  return getCachedDownloadSourceProbeStates(probeTargets);
}

/**
 * 比较两个版本字符串
 * @param v1 - 第一个版本
 * @param v2 - 第二个版本
 * @returns -1 如果 v1 < v2, 0 如果 v1 = v2, 1 如果 v1 > v2
 */
function compareVersions(v1: string, v2: string): number {
  const cleaned1 = v1.replace(/^v/, '');
  const cleaned2 = v2.replace(/^v/, '');

  const cmp = semver.compare(cleaned1, cleaned2);
  if (cmp < 0) return -1;
  if (cmp > 0) return 1;
  return 0;
}

function normalizeFetchError(error: unknown, source: DesktopVersionSource): Error {
  if (error instanceof Error && error.name === 'AbortError') {
    return new Error(`Request timeout while fetching ${source} desktop index`);
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error(`Unknown error while fetching ${source} desktop index`);
}

function assertBrowserEnvironment(): void {
  const isBrowser = typeof window !== 'undefined' && typeof fetch !== 'undefined';
  if (!isBrowser) {
    throw new Error('fetchDesktopVersions cannot be called in SSR environment');
  }
}

function isValidChannelInfo(channel: unknown): boolean {
  if (!channel || typeof channel !== 'object') {
    return false;
  }

  const maybeChannel = channel as { latest?: unknown; versions?: unknown };
  return typeof maybeChannel.latest === 'string' && Array.isArray(maybeChannel.versions);
}

function normalizeDesktopIndexPayload(payload: unknown): DesktopIndexResponse {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid desktop index payload: expected object');
  }

  const data = payload as DesktopIndexResponse;
  if (!Array.isArray(data.versions)) {
    throw new Error('Invalid desktop index payload: missing versions array');
  }

  for (const version of data.versions) {
    if (!version || typeof version.version !== 'string' || !Array.isArray(version.assets)) {
      throw new Error('Invalid desktop index payload: malformed version entry');
    }

    if (version.files && !Array.isArray(version.files)) {
      throw new Error('Invalid desktop index payload: malformed file path list');
    }

    for (const asset of version.assets) {
      if (
        !asset ||
        typeof asset.name !== 'string' ||
        typeof asset.path !== 'string' ||
        typeof asset.size !== 'number'
      ) {
        throw new Error('Invalid desktop index payload: malformed asset entry');
      }
    }
  }

  if (data.channels) {
    if (!isValidChannelInfo(data.channels.stable) || !isValidChannelInfo(data.channels.beta)) {
      throw new Error('Invalid desktop index payload: malformed channel data');
    }
  }

  return {
    ...data,
    versions: [...data.versions]
      .map((version) => ({
        ...version,
        assets: [...version.assets],
        files: Array.isArray(version.files) ? [...version.files] : undefined,
      }))
      .sort((a, b) => compareVersions(b.version, a.version)),
    channels: data.channels
      ? {
          stable: {
            latest: data.channels.stable.latest,
            versions: [...data.channels.stable.versions],
          },
          beta: {
            latest: data.channels.beta.latest,
            versions: [...data.channels.beta.versions],
          },
        }
      : undefined,
  };
}

async function fetchDesktopIndexPayload(
  source: DesktopVersionSource,
  url: string,
): Promise<DesktopIndexResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const payload = await response.json();
    return normalizeDesktopIndexPayload(payload);
  } catch (error) {
    throw normalizeFetchError(error, source);
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchDesktopVersionResult(): Promise<DesktopVersionFetchResult> {
  assertBrowserEnvironment();

  const attempts: DesktopVersionFetchAttempt[] = [];

  for (const candidate of SOURCE_CONFIGS) {
    try {
      const data = await fetchDesktopIndexPayload(candidate.source, candidate.url);
      return {
        data,
        source: candidate.source,
        attempts,
      };
    } catch (error) {
      const normalizedError = normalizeFetchError(error, candidate.source);
      attempts.push({
        source: candidate.source,
        error: normalizedError.message,
      });
    }
  }

  const message =
    attempts.length > 0
      ? `Failed to load desktop versions: ${attempts.map((attempt) => `${attempt.source}=${attempt.error}`).join('; ')}`
      : 'Failed to load desktop versions';

  throw new DesktopVersionFetchError(message, attempts);
}

/**
 * 获取版本数据。
 * 返回的版本数组已按版本号从高到低排序。
 */
export async function fetchDesktopVersions(): Promise<DesktopIndexResponse> {
  const result = await fetchDesktopVersionResult();
  return result.data;
}

/**
 * 从文件名推断资源类型
 * 支持 ARM64 架构检测
 * @param filename - 文件名
 * @returns 资源类型枚举值
 */
export function inferAssetType(filename: string): AssetType {
  const name = filename.toLowerCase();

  // Windows
  if (name.includes('setup') && name.endsWith('.exe')) {
    return AssetType.WindowsSetup;
  }
  if (name.endsWith('.exe')) {
    return AssetType.WindowsPortable;
  }
  if (name.endsWith('.appx')) {
    return AssetType.WindowsStore;
  }

  // macOS
  if (name.includes('arm64') && name.endsWith('.dmg')) {
    return AssetType.MacOSApple;
  }
  if (name.includes('arm64-mac.zip')) {
    return AssetType.MacOSApple;
  }
  if (name.endsWith('.dmg')) {
    return AssetType.MacOSIntel;
  }
  if (name.includes('-mac.zip')) {
    return AssetType.MacOSIntel;
  }

  // Linux - 支持多架构
  if (name.includes('arm64') && name.endsWith('.appimage')) {
    return AssetType.LinuxArm64AppImage;
  }
  if (name.endsWith('.appimage')) {
    return AssetType.LinuxAppImage;
  }
  if (name.includes('arm64') && name.includes('.deb')) {
    return AssetType.LinuxArm64Deb;
  }
  if (name.includes('_amd64.deb')) {
    return AssetType.LinuxDeb;
  }
  if (name.includes('arm64') && name.includes('.tar.gz')) {
    return AssetType.LinuxArm64Tarball;
  }
  if (name.includes('.tar.gz')) {
    return AssetType.LinuxTarball;
  }

  return AssetType.Unknown;
}

/**
 * 从资源类型推断 CPU 架构
 * @param assetType - 资源类型
 * @returns CPU 架构
 */
export function inferArchitecture(assetType: AssetType): CpuArchitecture {
  switch (assetType) {
    case AssetType.MacOSApple:
    case AssetType.LinuxArm64AppImage:
    case AssetType.LinuxArm64Deb:
    case AssetType.LinuxArm64Tarball:
      return CpuArchitecture.ARM64;
    case AssetType.WindowsSetup:
    case AssetType.WindowsPortable:
    case AssetType.WindowsStore:
    case AssetType.MacOSIntel:
    case AssetType.LinuxAppImage:
    case AssetType.LinuxDeb:
    case AssetType.LinuxTarball:
      return CpuArchitecture.X64;
    default:
      return CpuArchitecture.Unknown;
  }
}

/**
 * 格式化文件大小
 * @param bytes - 文件大小（字节）
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number): string {
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) {
    return `${gb.toFixed(1)} GB`;
  }
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(0)} MB`;
}

/**
 * 获取资源类型的架构标签
 * @param assetType - 资源类型枚举值
 * @returns 架构标签（如 ARM64、x64）
 */
export function getArchitectureLabel(assetType: AssetType): string {
  const archLabels: Record<AssetType, string> = {
    [AssetType.MacOSApple]: 'ARM64',
    [AssetType.MacOSIntel]: 'x64',
    [AssetType.WindowsSetup]: 'x64',
    [AssetType.WindowsPortable]: 'x64',
    [AssetType.WindowsStore]: '',
    [AssetType.LinuxAppImage]: 'x64',
    [AssetType.LinuxArm64AppImage]: 'ARM64',
    [AssetType.LinuxDeb]: 'x64',
    [AssetType.LinuxArm64Deb]: 'ARM64',
    [AssetType.LinuxTarball]: 'x64',
    [AssetType.LinuxArm64Tarball]: 'ARM64',
    [AssetType.Source]: '',
    [AssetType.Unknown]: '',
  };
  return archLabels[assetType] || '';
}

/**
 * 获取资源类型的文件扩展名
 * @param assetType - 资源类型枚举值
 * @returns 文件扩展名（包含点号，如 .exe、.dmg）
 */
export function getFileExtension(assetType: AssetType): string {
  const extensions: Record<AssetType, string> = {
    [AssetType.WindowsSetup]: '.exe',
    [AssetType.WindowsPortable]: '.exe',
    [AssetType.WindowsStore]: '.appx',
    [AssetType.MacOSApple]: '.dmg',
    [AssetType.MacOSIntel]: '.dmg',
    [AssetType.LinuxAppImage]: '.AppImage',
    [AssetType.LinuxArm64AppImage]: '.AppImage',
    [AssetType.LinuxDeb]: '.deb',
    [AssetType.LinuxArm64Deb]: '.deb',
    [AssetType.LinuxTarball]: '.tar.gz',
    [AssetType.LinuxArm64Tarball]: '.tar.gz',
    [AssetType.Source]: '.zip',
    [AssetType.Unknown]: '',
  };
  return extensions[assetType] || '';
}

/**
 * 获取资源类型的显示名称
 * @param assetType - 资源类型枚举值
 * @returns 显示名称
 */
export function getAssetTypeLabel(assetType: AssetType): string {
  const labels: Record<AssetType, string> = {
    [AssetType.WindowsSetup]: '安装程序',
    [AssetType.WindowsPortable]: '便携版',
    [AssetType.WindowsStore]: 'Microsoft Store',
    [AssetType.MacOSApple]: 'Apple Silicon',
    [AssetType.MacOSIntel]: 'Intel 版',
    [AssetType.LinuxAppImage]: 'AppImage (x64)',
    [AssetType.LinuxArm64AppImage]: 'AppImage (ARM64)',
    [AssetType.LinuxDeb]: 'Debian 包 (x64)',
    [AssetType.LinuxArm64Deb]: 'Debian 包 (ARM64)',
    [AssetType.LinuxTarball]: '压缩包 (x64)',
    [AssetType.LinuxArm64Tarball]: '压缩包 (ARM64)',
    [AssetType.Source]: '源代码',
    [AssetType.Unknown]: '其他',
  };
  return labels[assetType] || '未知';
}

/**
 * CPU 架构检测
 * 基于 UserAgent hints 和客户端提示 API
 * @returns 检测到的 CPU 架构
 */
export function detectArchitecture(): CpuArchitecture {
  if (typeof window === 'undefined') {
    return CpuArchitecture.Unknown;
  }

  // 优先检查 URL 查询参数
  const urlParams = new URLSearchParams(window.location.search);
  const archParam = urlParams.get('arch');
  if (archParam) {
    const normalizedParam = archParam.toLowerCase();
    if (normalizedParam === 'arm64' || normalizedParam === 'aarch64') {
      return CpuArchitecture.ARM64;
    }
    if (normalizedParam === 'x64' || normalizedParam === 'amd64') {
      return CpuArchitecture.X64;
    }
  }

  // 尝试使用客户端提示 API (Chrome/Edge)
  if ('userAgentData' in navigator && (navigator as { userAgentData?: { platform?: string; architecture?: string } }).userAgentData) {
    const data = (navigator as { userAgentData: { platform?: string; architecture?: string } }).userAgentData;
    if (data.platform === 'Linux' && data.architecture) {
      const arch = data.architecture.toLowerCase();
      if (arch === 'arm' || arch === 'arm64') {
        return CpuArchitecture.ARM64;
      }
      if (arch === 'x86-64') {
        return CpuArchitecture.X64;
      }
    }
  }

  // UserAgent 基于 Heuristic 检测
  const userAgent = navigator.userAgent;

  // Apple Silicon detection
  if (userAgent.includes('Mac') && (userAgent.includes('iPhone') || userAgent.includes('iPad') || /Mac OS X.*Arm/.test(userAgent))) {
    return CpuArchitecture.ARM64;
  }

  // Linux ARM64 detection (某些 Android 设备或其他 ARM64 Linux)
  if (userAgent.includes('Linux') && (userAgent.includes('aarch64') || /armv8/i.test(userAgent))) {
    return CpuArchitecture.ARM64;
  }

  // 默认返回 x64 (最常见)
  return CpuArchitecture.X64;
}

/**
 * 保存用户的架构选择到 localStorage
 * @param architecture - 选择的架构
 */
export function saveArchitectureSelection(architecture: CpuArchitecture): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(ARCHITECTURE_STORAGE_KEY, architecture);
    } catch (error) {
      console.warn('Failed to save architecture selection:', error);
    }
  }
}

/**
 * 从 localStorage 获取用户的架构选择
 * @returns 保存的架构，如果没有则返回 null
 */
export function getSavedArchitectureSelection(): CpuArchitecture | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = localStorage.getItem(ARCHITECTURE_STORAGE_KEY);
      if (saved && (saved === CpuArchitecture.X64 || saved === CpuArchitecture.ARM64)) {
        return saved as CpuArchitecture;
      }
    } catch (error) {
      console.warn('Failed to read saved architecture selection:', error);
    }
  }
  return null;
}

/**
 * 清除保存的架构选择
 */
export function clearArchitectureSelection(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem(ARCHITECTURE_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear architecture selection:', error);
    }
  }
}

/**
 * 获取推荐的架构
 * 优先级: 用户保存的选择 > 自动检测 > 默认值
 * @param platform - 操作系统平台
 * @returns 推荐的 CPU 架构
 */
export function getRecommendedArchitecture(platform: DesktopPlatform): CpuArchitecture {
  const saved = getSavedArchitectureSelection();
  if (saved) {
    return saved;
  }

  const detected = detectArchitecture();
  if (detected !== CpuArchitecture.Unknown) {
    return detected;
  }

  return PLATFORM_RECOMMENDATIONS[platform].recommendedArchitecture;
}

/**
 * 获取指定渠道的最新版本
 * @param channel - 渠道名称 ('stable' | 'beta')
 * @returns 该渠道的最新 DesktopVersion 对象
 * @throws 当渠道数据不存在或版本未找到时抛出错误
 */
export async function getChannelLatestVersion(
  channel: 'stable' | 'beta',
): Promise<DesktopVersion> {
  const data = await fetchDesktopVersions();

  if (!data.channels || !data.channels[channel]) {
    throw new Error(`Channel '${channel}' not available in version data`);
  }

  const channelInfo = data.channels[channel];
  const latestVersionObj = data.versions.find((version) => version.version === channelInfo.latest);

  if (!latestVersionObj) {
    throw new Error(`Version '${channelInfo.latest}' not found in versions array for channel '${channel}'`);
  }

  return latestVersionObj;
}

/**
 * 获取指定渠道的所有版本
 * @param channel - 渠道名称 ('stable' | 'beta')
 * @returns 该渠道的 DesktopVersion 对象数组
 * @throws 当渠道数据不存在时抛出错误
 */
export async function getAllChannelVersions(
  channel: 'stable' | 'beta',
): Promise<DesktopVersion[]> {
  const data = await fetchDesktopVersions();

  if (!data.channels || !data.channels[channel]) {
    throw new Error(`Channel '${channel}' not available in version data`);
  }

  const channelVersions = data.channels[channel].versions;
  const versionObjects = data.versions.filter((version) =>
    channelVersions.includes(version.version),
  );

  versionObjects.sort((a, b) => compareVersions(b.version, a.version));
  return versionObjects;
}

/**
 * 将资源按平台分组
 * 支持多架构资源
 * @param assets - 文件资源数组
 * @param selectedArchitecture - 选中的架构 (可选，用于过滤)
 * @returns 按平台分组的资源
 */
export function groupAssetsByPlatform(
  assets: DesktopAsset[] | undefined,
  selectedArchitecture?: CpuArchitecture,
): PlatformGroup[] {
  if (!assets || !Array.isArray(assets)) {
    return [];
  }

  const platformGroups = new Map<DesktopPlatform, PlatformDownload[]>();
  const architectures = new Map<DesktopPlatform, Set<CpuArchitecture>>();

  for (const asset of assets) {
    const assetType = inferAssetType(asset.name);
    if (assetType === AssetType.Unknown) {
      continue;
    }

    let platform: DesktopPlatform | null = null;
    switch (assetType) {
      case AssetType.WindowsSetup:
      case AssetType.WindowsPortable:
      case AssetType.WindowsStore:
        platform = 'windows';
        break;
      case AssetType.MacOSApple:
      case AssetType.MacOSIntel:
        platform = 'macos';
        break;
      case AssetType.LinuxAppImage:
      case AssetType.LinuxArm64AppImage:
      case AssetType.LinuxDeb:
      case AssetType.LinuxArm64Deb:
      case AssetType.LinuxTarball:
      case AssetType.LinuxArm64Tarball:
        platform = 'linux';
        break;
      default:
        continue;
    }

    const architecture = inferArchitecture(assetType);

    if (selectedArchitecture && architecture !== selectedArchitecture) {
      continue;
    }

    if (!platformGroups.has(platform)) {
      platformGroups.set(platform, []);
      architectures.set(platform, new Set());
    }

    const sourceActions = normalizeDownloadActions(asset);
    const safeAction = getSafeFallbackAction({ sourceActions }) ?? sourceActions[0];
    if (!safeAction) {
      continue;
    }

    platformGroups.get(platform)?.push({
      url: safeAction.url,
      size: formatFileSize(asset.size),
      filename: asset.name,
      assetType,
      architecture,
      sourceActions,
    });

    architectures.get(platform)?.add(architecture);
  }

  const result: PlatformGroup[] = [];
  for (const [platform, downloads] of platformGroups.entries()) {
    const recommendation = PLATFORM_RECOMMENDATIONS[platform];

    downloads.sort((a, b) => {
      const aRecommended =
        a.assetType === recommendation.recommendedType &&
        a.architecture === recommendation.recommendedArchitecture;
      const bRecommended =
        b.assetType === recommendation.recommendedType &&
        b.architecture === recommendation.recommendedArchitecture;

      if (aRecommended && !bRecommended) return -1;
      if (!aRecommended && bRecommended) return 1;
      return 0;
    });

    result.push({
      platform,
      downloads,
      architectures: Array.from(architectures.get(platform) ?? []),
    });
  }

  return result;
}

/**
 * 获取平台的推荐下载项
 * 支持按架构过滤
 * @param platform - 平台名称
 * @param downloads - 下载资源列表
 * @param architecture - CPU 架构 (可选)
 * @returns 推荐的下载项，如果没有则返回第一个
 */
export function getRecommendedDownload(
  platform: DesktopPlatform,
  downloads: PlatformDownload[],
  architecture?: CpuArchitecture,
): PlatformDownload | null {
  const recommendation = PLATFORM_RECOMMENDATIONS[platform];

  let filteredDownloads = downloads;
  if (architecture) {
    filteredDownloads = downloads.filter((download) => download.architecture === architecture);
  }

  const recommended = filteredDownloads.find(
    (download) =>
      download.assetType === recommendation.recommendedType &&
      (architecture ? download.architecture === architecture : true),
  );

  return recommended || filteredDownloads[0] || null;
}

/**
 * 检测用户操作系统
 * 支持查询字符串覆盖 ?os=windows|macos|linux
 * @returns 检测到的操作系统
 */
export function detectOS(): 'windows' | 'macos' | 'linux' | 'unknown' {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const osParam = urlParams.get('os');
    if (osParam) {
      const validOS = ['windows', 'macos', 'linux'];
      const normalizedParam = osParam.toLowerCase();
      if (validOS.includes(normalizedParam)) {
        return normalizedParam as 'windows' | 'macos' | 'linux';
      }
    }

    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) {
      return 'windows';
    }
    if (
      userAgent.includes('Mac') ||
      userAgent.includes('iPhone') ||
      userAgent.includes('iPad') ||
      userAgent.includes('Mac OS')
    ) {
      return 'macos';
    }
    if (userAgent.includes('Linux')) {
      return 'linux';
    }
  }

  return 'unknown';
}

/**
 * 检查两个架构是否兼容
 * @param targetArchitecture - 目标架构
 * @param userArchitecture - 用户系统架构
 * @returns 是否兼容 (大多数情况下不兼容，除非相同)
 */
export function isArchitectureCompatible(
  targetArchitecture: CpuArchitecture,
  userArchitecture: CpuArchitecture,
): boolean {
  if (
    targetArchitecture === CpuArchitecture.Unknown ||
    userArchitecture === CpuArchitecture.Unknown
  ) {
    return true;
  }
  return targetArchitecture === userArchitecture;
}

/**
 * 获取架构不兼容警告消息
 * @param targetArchitecture - 目标架构
 * @param userArchitecture - 用户系统架构
 * @returns 警告消息或 null
 */
export function getArchitectureIncompatibilityWarning(
  targetArchitecture: CpuArchitecture,
  userArchitecture: CpuArchitecture,
): string | null {
  if (!isArchitectureCompatible(targetArchitecture, userArchitecture)) {
    return `警告：您正在下载 ${targetArchitecture} 版本，但您的系统是 ${userArchitecture} 架构。这可能会导致性能问题或无法运行。`;
  }
  return null;
}

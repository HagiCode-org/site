/**
 * Version utilities for accessing desktop app version information
 * from the Docs application's version-index.json file
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Re-export types from desktop.ts for convenience
export type {
  DesktopIndexResponse,
  DesktopVersion,
  DesktopAsset
} from './desktop';

/**
 * Get the path to the version-index.json file in the Docs app
 * This function resolves the path relative to the shared package location
 *
 * @returns {string} Absolute path to version-index.json
 */
function getVersionIndexPath(): string {
  // Get the directory of the current module (packages/shared/src/)
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const sharedDir = path.dirname(__dirname); // packages/shared/

  // Navigate from packages/shared/ to apps/docs/public/
  return path.join(sharedDir, '..', 'apps', 'docs', 'public', 'version-index.json');
}

/**
 * Load and parse the version-index.json file from the Docs app
 *
 * @returns {Promise<import('./desktop').DesktopIndexResponse>} Version index data
 * @throws {Error} If the file cannot be read or parsed
 */
export async function getVersionIndex(): Promise<import('./desktop').DesktopIndexResponse> {
  try {
    const versionPath = getVersionIndexPath();
    const content = await fs.readFile(versionPath, 'utf-8');
    return JSON.parse(content) as import('./desktop').DesktopIndexResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load version index: ${error.message}`);
    }
    throw new Error('Failed to load version index: Unknown error');
  }
}

/**
 * Get the latest version string from the version index
 *
 * @returns {Promise<string>} The latest version number (e.g., "v0.1.4")
 * @throws {Error} If no versions are available or the file cannot be read
 */
export async function getLatestVersion(): Promise<string> {
  try {
    const data = await getVersionIndex();

    if (!data.versions || data.versions.length === 0) {
      throw new Error('No versions found in version index');
    }

    return data.versions[0].version;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get latest version: ${error.message}`);
    }
    throw new Error('Failed to get latest version: Unknown error');
  }
}

/**
 * Get version data for a specific version string
 *
 * @param {string} version - Version string to look up (e.g., "v0.1.4")
 * @returns {Promise<import('./desktop').DesktopVersion | undefined>} Version data or undefined if not found
 */
export async function getVersion(version: string): Promise<import('./desktop').DesktopVersion | undefined> {
  try {
    const data = await getVersionIndex();
    return data.versions.find(v => v.version === version);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get version ${version}: ${error.message}`);
    }
    throw new Error(`Failed to get version ${version}: Unknown error`);
  }
}

/**
 * Get all available versions
 *
 * @returns {Promise<string[]>} Array of version strings
 */
export async function getAllVersions(): Promise<string[]> {
  try {
    const data = await getVersionIndex();
    return data.versions.map(v => v.version);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get all versions: ${error.message}`);
    }
    throw new Error('Failed to get all versions: Unknown error');
  }
}

import semver from 'semver';

/**
 * Parsed semantic version components
 */
export interface Semver {
  /** Major version number */
  major: number;
  /** Minor version number */
  minor: number;
  /** Patch version number */
  patch: number;
  /** Pre-release identifiers (e.g., ["beta", "1"] for "v1.2.3-beta.1") */
  prerelease: Array<string | number>;
}

/**
 * Parse a semver version string into its components using the semver library
 * @param version - Version string (e.g., "v1.2.3", "v1.2.3-beta", "v1.2.3-beta.1", "v1.2", "v1")
 * @returns Parsed Semver interface or null if invalid
 */
export function parseSemver(version: string): Semver | null {
  // Remove 'v' prefix if present and parse
  const cleaned = version.replace(/^v/, '');

  // Try to parse with strict mode first
  try {
    const sem = new semver.SemVer(cleaned);
    return {
      major: sem.major,
      minor: sem.minor,
      patch: sem.patch,
      prerelease: sem.prerelease as Array<string | number>
    };
  } catch {
    // If strict parsing fails, try coerce for partial versions like "1.2" or "1"
    const sem = semver.coerce(cleaned);
    if (!sem) return null;
    return {
      major: sem.major,
      minor: sem.minor,
      patch: sem.patch,
      prerelease: sem.prerelease as Array<string | number>
    };
  }
}

/**
 * Compare two version strings using semver specification (via semver library)
 * @param v1 - First version
 * @param v2 - Second version
 * @returns -1 if v1 < v2, 0 if v1 = v2, 1 if v1 > v2
 */
export function compareVersions(v1: string, v2: string): number {
  const cleaned1 = v1.replace(/^v/, '');
  const cleaned2 = v2.replace(/^v/, '');

  const cmp = semver.compare(cleaned1, cleaned2);
  // semver.compare returns: negative if a < b, 0 if equal, positive if a > b
  if (cmp < 0) return -1;
  if (cmp > 0) return 1;
  return 0;
}

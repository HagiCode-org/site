#!/usr/bin/env node

/**
 * Version Monitor Script
 *
 * This script monitors the version from the official website URL and updates
 * the local version index file. Pull Request creation is handled by the workflow.
 *
 * Environment Variables:
 * - VERSION_SOURCE_URL: URL to fetch version data (default: https://desktop.dl.hagicode.com/index.json)
 * - REQUEST_TIMEOUT: HTTP request timeout in milliseconds (default: 30000)
 * - MAX_RETRIES: Maximum number of retry attempts (default: 3)
 */

import { promises as fs } from 'fs';

// Logger with levels
const logger = {
  debug: (msg) => console.log(`[DEBUG] ${msg}`),
  info: (msg) => console.log(`[INFO] ${msg}`),
  warn: (msg) => console.log(`[WARN] ${msg}`),
  error: (msg) => console.log(`[ERROR] ${msg}`)
};

// Configuration from environment variables
const config = {
  sourceUrl: process.env.VERSION_SOURCE_URL || 'https://desktop.dl.hagicode.com/index.json',
  timeout: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10),
  maxRetries: parseInt(process.env.MAX_RETRIES || '3', 10),
  retryDelay: 1000 // Base retry delay in milliseconds
};

// Local version data file path
const VERSION_INDEX_FILE = 'public/version-index.json';

/**
 * Sleep utility for retry delays
 * @param {number} ms - Milliseconds to sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch with retry mechanism using exponential backoff
 * @param {string} url - URL to fetch
 * @param {object} options - Fetch options
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<Response>} Fetch response
 */
async function fetchWithRetry(url, options = {}, maxRetries = config.maxRetries) {
  const { timeout = config.timeout, ...fetchOptions } = options;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      if (error.name === 'AbortError') {
        logger.warn(`Request timeout (${timeout}ms), attempt ${i + 1}/${maxRetries}`);
      } else {
        logger.warn(`Request failed: ${error.message}, attempt ${i + 1}/${maxRetries}`);
      }

      if (i === maxRetries - 1) {
        throw error;
      }

      // Exponential backoff: wait 2^i * retryDelay milliseconds
      const waitTime = Math.pow(2, i) * config.retryDelay;
      logger.debug(`Waiting ${waitTime}ms before retry...`);
      await sleep(waitTime);
    }
  }
}

/**
 * Fetch current version from the official website URL
 * @param {string} url - Optional custom URL to fetch from
 * @returns {Promise<object>} Version data object
 */
async function fetchCurrentVersion(url) {
  const targetUrl = url || config.sourceUrl;
  logger.info(`Fetching version from: ${targetUrl}`);

  try {
    const response = await fetchWithRetry(targetUrl, {
      headers: {
        'User-Agent': 'Version-Monitor/1.0'
      }
    });

    const data = await response.json();

    // Validate that we have version data
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response: not an object');
    }

    // Extract version from common response formats
    const version = data.version || extractVersionFromData(data);

    if (!version) {
      throw new Error('No version found in response data');
    }

    logger.info(`Current version from source: ${version}`);
    return { version, raw: data };
  } catch (error) {
    logger.error(`Failed to fetch version data: ${error.message}`);
    throw error;
  }
}

/**
 * Extract version from various data structures
 * @param {object} data - Parsed JSON data
 * @returns {string|null} Version string or null
 */
function extractVersionFromData(data) {
  // Common patterns for version data
  if (data.latestVersion) return data.latestVersion;
  if (data.currentVersion) return data.currentVersion;
  if (data.release && data.release.version) return data.release.version;
  if (Array.isArray(data.versions) && data.versions[0]) {
    return data.versions[0].version || data.versions[0];
  }
  return null;
}

/**
 * Load local version from public/version-index.json
 * @returns {Promise<string|null>} Latest version from local file, or null if file doesn't exist
 */
async function loadLocalVersion() {
  try {
    const content = await fs.readFile(VERSION_INDEX_FILE, 'utf-8');
    const data = JSON.parse(content);

    if (Array.isArray(data.versions) && data.versions.length > 0) {
      const localVersion = data.versions[0].version;
      logger.info(`Local version: ${localVersion}`);
      return localVersion;
    }

    logger.warn('Local version file exists but contains no versions');
    return null;
  } catch (error) {
    if (error.code === 'ENOENT') {
      logger.info('Local version file not found, treating as empty state');
      return null;
    }
    logger.error(`Failed to load local version: ${error.message}`);
    return null;
  }
}

/**
 * Update local version data file
 * @param {object} versionData - Raw version data from online API
 */
async function updateLocalVersionIndex(versionData) {
  try {
    // Ensure public directory exists
    await fs.mkdir('public', { recursive: true });

    // Write version data to local file
    await fs.writeFile(
      VERSION_INDEX_FILE,
      JSON.stringify(versionData, null, 2),
      'utf-8'
    );

    logger.info(`Local version index updated: ${VERSION_INDEX_FILE}`);
  } catch (error) {
    logger.error(`Failed to update local version index: ${error.message}`);
    throw error;
  }
}

/**
 * Parse a semver version string into its components
 * @param {string} version - Version string (e.g., "v1.2.3", "v1.2.3-beta", "v1.2.3-beta.1")
 * @returns {object} Parsed version with major, minor, patch, and prerelease parts
 */
function parseSemver(version) {
  // Remove 'v' prefix if present
  const v = version.replace(/^v/, '');

  // Split version and pre-release parts
  const versionParts = v.split('-');
  const versionNumbers = versionParts[0].split('.');

  const major = parseInt(versionNumbers[0], 10) || 0;
  const minor = parseInt(versionNumbers[1] || '0', 10) || 0;
  const patch = parseInt(versionNumbers[2] || '0', 10) || 0;

  // Parse pre-release identifiers (e.g., "beta.1" -> ["beta", "1"])
  let prerelease = [];
  if (versionParts.length > 1) {
    prerelease = versionParts.slice(1).join('-').split('.').map(id => {
      const num = parseInt(id, 10);
      return isNaN(num) ? id : num;
    });
  }

  return { major, minor, patch, prerelease };
}

/**
 * Pre-release identifier priority for comparison
 * Lower index = lower priority (alpha < beta < preview < rc)
 * Identifiers not in this list are compared lexicographically
 */
const PRERELEASE_PRIORITY = {
  'alpha': 1,
  'beta': 2,
  'preview': 3,
  'rc': 4,
  'pre': 1
};

/**
 * Compare two pre-release identifier arrays
 * @param {Array} a - First pre-release identifiers array
 * @param {Array} b - Second pre-release identifiers array
 * @returns {number} -1 if a < b, 0 if a = b, 1 if a > b
 */
function comparePrerelease(a, b) {
  // Empty pre-release (stable) is greater than any non-empty pre-release
  if (a.length === 0 && b.length === 0) return 0;
  if (a.length === 0) return 1; // stable > prerelease
  if (b.length === 0) return -1; // prerelease < stable

  // Compare each identifier
  const maxLength = Math.max(a.length, b.length);
  for (let i = 0; i < maxLength; i++) {
    const idA = a[i] === undefined ? null : a[i];
    const idB = b[i] === undefined ? null : b[i];

    // If one array is shorter, it has lower priority
    if (idA === null && idB === null) return 0;
    if (idA === null) return -1;
    if (idB === null) return 1;

    // Compare numeric identifiers
    if (typeof idA === 'number' && typeof idB === 'number') {
      if (idA < idB) return -1;
      if (idA > idB) return 1;
    }
    // Compare string identifiers with priority
    else if (typeof idA === 'string' && typeof idB === 'string') {
      const priorityA = PRERELEASE_PRIORITY[idA] ?? 999;
      const priorityB = PRERELEASE_PRIORITY[idB] ?? 999;

      // Both have defined priority
      if (priorityA !== 999 && priorityB !== 999) {
        if (priorityA < priorityB) return -1;
        if (priorityA > priorityB) return 1;
      }
      // One has defined priority
      else if (priorityA !== 999) return -1;
      else if (priorityB !== 999) return 1;
      // Neither has defined priority - compare lexicographically
      else {
        const cmp = idA.localeCompare(idB);
        if (cmp !== 0) return cmp < 0 ? -1 : 1;
      }
    }
    // Mixed types: numeric < string
    else if (typeof idA === 'number') return -1;
    else return 1;
  }

  return 0;
}

/**
 * Compare two version strings using semver specification
 * @param {string} v1 - First version
 * @param {string} v2 - Second version
 * @returns {number} -1 if v1 < v2, 0 if v1 = v2, 1 if v1 > v2
 */
function compareVersions(v1, v2) {
  const semver1 = parseSemver(v1);
  const semver2 = parseSemver(v2);

  // Compare major, minor, patch
  if (semver1.major !== semver2.major) {
    return semver1.major < semver2.major ? -1 : 1;
  }
  if (semver1.minor !== semver2.minor) {
    return semver1.minor < semver2.minor ? -1 : 1;
  }
  if (semver1.patch !== semver2.patch) {
    return semver1.patch < semver2.patch ? -1 : 1;
  }

  // Compare pre-release identifiers
  return comparePrerelease(semver1.prerelease, semver2.prerelease);
}

/**
 * Main execution function
 */
async function main() {
  try {
    logger.info('Starting version monitor...');
    logger.debug(`Configuration: ${JSON.stringify({
      sourceUrl: config.sourceUrl,
      timeout: config.timeout,
      maxRetries: config.maxRetries
    })}`);

    // Fetch current version from source
    const { version: currentVersion, raw: versionData } = await fetchCurrentVersion();

    // Load local version from public/version-index.json
    const localVersion = await loadLocalVersion();

    // Check if version has changed
    // Empty state (localVersion is null) is treated as a new version scenario
    const hasEmptyState = !localVersion;

    if (!hasEmptyState) {
      const versionComparison = compareVersions(currentVersion, localVersion);

      if (versionComparison === 0) {
        logger.info('Version unchanged - no update needed');
        return;
      }

      logger.info(`Version changed: ${localVersion} -> ${currentVersion}`);
    } else {
      logger.info('Empty state detected - treating as new version scenario');
    }

    // Update local version index file
    await updateLocalVersionIndex(versionData);

    // Set GitHub Actions outputs for workflow to use
    if (process.env.GITHUB_OUTPUT) {
      const outputs = [
        `update_needed=true`,
        `new_version=${currentVersion}`
      ];
      await fs.appendFile(process.env.GITHUB_OUTPUT, outputs.join('\n') + '\n');
      logger.info(`Set outputs: update_needed=true, new_version=${currentVersion}`);
    }

    logger.info('Version monitor completed successfully - version index updated');

  } catch (error) {
    logger.error(`Version monitor failed: ${error.message}`);
    throw error;
  }
}

// Run the script
main().catch(error => {
  logger.error(`Fatal error: ${error.message}`);
  process.exit(1);
});

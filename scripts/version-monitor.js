#!/usr/bin/env node

/**
 * Version Monitor Script
 *
 * This script monitors the version from the official website URL and updates
 * the local version index files for both the documentation site and marketing site.
 * Pull Request creation is handled by the workflow.
 *
 * Updates the following files atomically:
 * - apps/docs/public/version-index.json (primary)
 * - apps/website/public/version-index.json (secondary)
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

// Local version data file paths for both sites
const VERSION_INDEX_FILES = [
  'apps/docs/public/version-index.json',  // Primary: documentation site
  'apps/website/public/version-index.json' // Secondary: marketing site
];
const VERSION_INDEX_PRIMARY = VERSION_INDEX_FILES[0];

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

  // For versions array, need to find the latest (highest) version
  if (Array.isArray(data.versions) && data.versions.length > 0) {
    logger.info(`[extractVersionFromData] Found ${data.versions.length} versions in array`);
    logger.debug(`[extractVersionFromData] Versions: ${data.versions.map(v => v.version || v).join(', ')}`);

    logger.info('[extractVersionFromData] Searching for latest version by comparing all versions...');
    let latestVersion = data.versions[0];
    let latestVersionObj = data.versions[0];

    for (const versionObj of data.versions) {
      const v1 = versionObj.version || versionObj;
      const v2 = latestVersionObj.version || latestVersionObj;

      logger.debug(`[extractVersionFromData] Comparing: "${v1}" vs current latest "${v2}"`);

      const comparison = compareVersions(v1, v2);

      if (comparison === 1) {
        logger.info(`[extractVersionFromData] Found newer version: "${v1}" > "${v2}"`);
        latestVersion = v1;
        latestVersionObj = versionObj;
      } else if (comparison === 0) {
        logger.debug(`[extractVersionFromData] Versions are equal: "${v1}" = "${v2}"`);
      }
    }

    logger.info(`[extractVersionFromData] Latest version from array: ${latestVersion}`);
    return latestVersion;
  }

  logger.warn('[extractVersionFromData] No version found in data');
  return null;

  logger.warn('[extractVersionFromData] No version found in data');
  return null;
}

/**
 * Load local version from primary site's version-index.json
 * @returns {Promise<string|null>} Latest version from local file, or null if file doesn't exist
 */
async function loadLocalVersion() {
  try {
    const content = await fs.readFile(VERSION_INDEX_PRIMARY, 'utf-8');
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
 * Update local version data files for both sites
 * Writes to both files atomically - if either write fails, both are rolled back
 * @param {object} versionData - Raw version data from online API
 */
async function updateLocalVersionIndex(versionData) {
  const writtenFiles = [];
  const content = JSON.stringify(versionData, null, 2);

  try {
    // Write to both files
    for (const filePath of VERSION_INDEX_FILES) {
      // Ensure directory exists
      const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
      await fs.mkdir(dirPath, { recursive: true });

      // Write file
      await fs.writeFile(filePath, content, 'utf-8');
      writtenFiles.push(filePath);
      logger.info(`Version index updated: ${filePath}`);
    }

    logger.info('All version index files updated successfully');
  } catch (error) {
    // Rollback: delete any files that were successfully written
    logger.error(`Write failed: ${error.message}`);
    logger.info('Rolling back written files...');

    for (const filePath of writtenFiles) {
      try {
        await fs.unlink(filePath);
        logger.debug(`Rolled back: ${filePath}`);
      } catch (unlinkError) {
        logger.warn(`Failed to rollback ${filePath}: ${unlinkError.message}`);
      }
    }

    throw new Error(`Failed to update version index files: ${error.message}`);
  }
}

/**
 * Parse a semver version string into its components
 * @param {string} version - Version string (e.g., "v1.2.3", "v1.2.3-beta", "v1.2.3-beta.1")
 * @returns {object} Parsed version with major, minor, patch, and prerelease parts
 */
function parseSemver(version) {
  logger.debug(`[parseSemver] Parsing version: "${version}"`);

  // Remove 'v' prefix if present
  const v = version.replace(/^v/, '');
  logger.debug(`[parseSemver] Removed 'v' prefix: "${v}"`);

  // Split version and pre-release parts
  const versionParts = v.split('-');
  const versionNumbers = versionParts[0].split('.');

  const major = parseInt(versionNumbers[0], 10) || 0;
  const minor = parseInt(versionNumbers[1] || '0', 10) || 0;
  const patch = parseInt(versionNumbers[2] || '0', 10) || 0;

  logger.debug(`[parseSemver] Parsed numbers: major=${major}, minor=${minor}, patch=${patch}`);

  // Parse pre-release identifiers (e.g., "beta.1" -> ["beta", "1"])
  let prerelease = [];
  if (versionParts.length > 1) {
    prerelease = versionParts.slice(1).join('-').split('.').map(id => {
      const num = parseInt(id, 10);
      return isNaN(num) ? id : num;
    });
    logger.debug(`[parseSemver] Parsed prerelease: [${prerelease.join(', ')}]`);
  }

  const result = { major, minor, patch, prerelease };
  logger.debug(`[parseSemver] Result: ${result.major}.${result.minor}.${result.patch}${prerelease.length > 0 ? '-' + prerelease.join('.') : ''}`);

  return result;
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
  if (a.length === 0) {
    logger.debug(`[comparePrerelease] a=[] (stable) > b=[${b.join(', ')}] (prerelease)`);
    return 1; // stable > prerelease
  }
  if (b.length === 0) {
    logger.debug(`[comparePrerelease] a=[${a.join(', ')}] (prerelease) < b=[] (stable)`);
    return -1; // prerelease < stable
  }

  // Compare each identifier
  const maxLength = Math.max(a.length, b.length);
  for (let i = 0; i < maxLength; i++) {
    const idA = a[i] === undefined ? null : a[i];
    const idB = b[i] === undefined ? null : b[i];

    // If one array is shorter, it has lower priority
    if (idA === null && idB === null) return 0;
    if (idA === null) {
      logger.debug(`[comparePrerelease] Index ${i}: a is shorter => a < b`);
      return -1;
    }
    if (idB === null) {
      logger.debug(`[comparePrerelease] Index ${i}: b is shorter => a > b`);
      return 1;
    }

    // Compare numeric identifiers
    if (typeof idA === 'number' && typeof idB === 'number') {
      if (idA < idB) {
        logger.debug(`[comparePrerelease] Index ${i}: ${idA} < ${idB} => a < b`);
        return -1;
      }
      if (idA > idB) {
        logger.debug(`[comparePrerelease] Index ${i}: ${idA} > ${idB} => a > b`);
        return 1;
      }
    }
    // Compare string identifiers with priority
    else if (typeof idA === 'string' && typeof idB === 'string') {
      const priorityA = PRERELEASE_PRIORITY[idA] ?? 999;
      const priorityB = PRERELEASE_PRIORITY[idB] ?? 999;

      // Both have defined priority
      if (priorityA !== 999 && priorityB !== 999) {
        if (priorityA < priorityB) {
          logger.debug(`[comparePrerelease] Index ${i}: "${idA}" (priority ${priorityA}) < "${idB}" (priority ${priorityB}) => a < b`);
          return -1;
        }
        if (priorityA > priorityB) {
          logger.debug(`[comparePrerelease] Index ${i}: "${idA}" (priority ${priorityA}) > "${idB}" (priority ${priorityB}) => a > b`);
          return 1;
        }
      }
      // One has defined priority
      else if (priorityA !== 999) {
        logger.debug(`[comparePrerelease] Index ${i}: "${idA}" (priority ${priorityA}) < "${idB}" (no priority) => a < b`);
        return -1;
      }
      else if (priorityB !== 999) {
        logger.debug(`[comparePrerelease] Index ${i}: "${idA}" (no priority) > "${idB}" (priority ${priorityB}) => a > b`);
        return 1;
      }
      // Neither has defined priority - compare lexicographically
      else {
        const cmp = idA.localeCompare(idB);
        if (cmp !== 0) {
          logger.debug(`[comparePrerelease] Index ${i}: "${idA}" ${cmp < 0 ? '<' : '>'} "${idB}" (lexicographic) => ${cmp < 0 ? 'a < b' : 'a > b'}`);
          return cmp < 0 ? -1 : 1;
        }
      }
    }
    // Mixed types: numeric < string
    else if (typeof idA === 'number') {
      logger.debug(`[comparePrerelease] Index ${i}: ${idA} (number) < "${idB}" (string) => a < b`);
      return -1;
    }
    else {
      logger.debug(`[comparePrerelease] Index ${i}: "${idA}" (string) > ${idB} (number) => a > b`);
      return 1;
    }
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
  logger.info(`[compareVersions] Comparing versions: "${v1}" vs "${v2}"`);

  const semver1 = parseSemver(v1);
  const semver2 = parseSemver(v2);

  // Compare major, minor, patch
  if (semver1.major !== semver2.major) {
    const result = semver1.major < semver2.major ? -1 : 1;
    logger.info(`[compareVersions] Major version differs: ${semver1.major} vs ${semver2.major} => ${result === -1 ? v1 + ' < ' + v2 : v1 + ' > ' + v2}`);
    return result;
  }
  if (semver1.minor !== semver2.minor) {
    const result = semver1.minor < semver2.minor ? -1 : 1;
    logger.info(`[compareVersions] Minor version differs: ${semver1.minor} vs ${semver2.minor} => ${result === -1 ? v1 + ' < ' + v2 : v1 + ' > ' + v2}`);
    return result;
  }
  if (semver1.patch !== semver2.patch) {
    const result = semver1.patch < semver2.patch ? -1 : 1;
    logger.info(`[compareVersions] Patch version differs: ${semver1.patch} vs ${semver2.patch} => ${result === -1 ? v1 + ' < ' + v2 : v1 + ' > ' + v2}`);
    return result;
  }

  // Compare pre-release identifiers
  const prereleaseResult = comparePrerelease(semver1.prerelease, semver2.prerelease);
  if (prereleaseResult !== 0) {
    logger.info(`[compareVersions] Prerelease differs: [${semver1.prerelease.join(', ')}] vs [${semver2.prerelease.join(', ')}] => ${prereleaseResult === -1 ? v1 + ' < ' + v2 : v1 + ' > ' + v2}`);
  } else {
    logger.info(`[compareVersions] Versions are equal: ${v1} = ${v2}`);
  }

  return prereleaseResult;
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
      logger.info('='.repeat(60));
      logger.info('VERSION COMPARISON START');
      logger.info('='.repeat(60));
      logger.info(`Local version: "${localVersion}"`);
      logger.info(`Current version: "${currentVersion}"`);
      logger.info('Critical edge cases to verify:');
      logger.info('  - Multi-digit comparison (e.g., v0.1.9 vs v0.1.10)');
      logger.info('  - Multi-digit version numbers (e.g., v1.10.0 vs v1.9.9)');
      logger.info('  - Pre-release comparison (e.g., alpha < beta < rc < stable)');
      logger.info('-'.repeat(60));

      const versionComparison = compareVersions(currentVersion, localVersion);

      logger.info('-'.repeat(60));
      if (versionComparison === 0) {
        logger.info('✅ Version unchanged - no update needed');
        logger.info('='.repeat(60));
        return;
      }

      const comparisonSymbol = versionComparison === -1 ? '<' : '>';
      logger.info(`📊 Version comparison result: "${currentVersion}" ${comparisonSymbol} "${localVersion}"`);
      logger.info(`🔄 Version changed: ${localVersion} -> ${currentVersion}`);
      logger.info('='.repeat(60));
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

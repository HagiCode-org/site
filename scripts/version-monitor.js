#!/usr/bin/env node

/**
 * Version Monitor Script
 *
 * This script monitors the version from the official website URL and creates
 * a Pull Request when a new version is detected.
 *
 * Environment Variables:
 * - GITHUB_TOKEN: GitHub token for API calls (automatically provided by GitHub Actions)
 * - REPO_OWNER: Repository owner (e.g., "newbe36524")
 * - REPO_NAME: Repository name (e.g., "pcode-docs")
 * - VERSION_SOURCE_URL: URL to fetch version data (default: https://hagicode.com/desktop/index.json)
 * - REQUEST_TIMEOUT: HTTP request timeout in milliseconds (default: 30000)
 * - MAX_RETRIES: Maximum number of retry attempts (default: 3)
 */

import { promises as fs } from 'fs';
import { execSync } from 'child_process';

// Logger with levels
const logger = {
  debug: (msg) => console.log(`[DEBUG] ${msg}`),
  info: (msg) => console.log(`[INFO] ${msg}`),
  warn: (msg) => console.log(`[WARN] ${msg}`),
  error: (msg) => console.log(`[ERROR] ${msg}`)
};

// Configuration from environment variables
const config = {
  repoOwner: process.env.REPO_OWNER || '',
  repoName: process.env.REPO_NAME || '',
  githubToken: process.env.GITHUB_TOKEN || '',
  sourceUrl: process.env.VERSION_SOURCE_URL || 'https://hagicode.com/desktop/index.json',
  timeout: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10),
  maxRetries: parseInt(process.env.MAX_RETRIES || '3', 10),
  retryDelay: 1000 // Base retry delay in milliseconds
};

// Version state file path
const VERSION_STATE_FILE = '.github/version-state.json';

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
 * Load version state from file
 * @returns {Promise<object>} Version state object
 */
async function loadVersionState() {
  try {
    const content = await fs.readFile(VERSION_STATE_FILE, 'utf-8');
    const state = JSON.parse(content);
    logger.info(`Loaded version state: last checked version = ${state.lastCheckedVersion}`);
    return state;
  } catch (error) {
    if (error.code === 'ENOENT') {
      logger.info('Version state file not found, creating initial state');
      return createInitialVersionState();
    }
    logger.error(`Failed to load version state: ${error.message}`);
    throw error;
  }
}

/**
 * Create initial version state
 * @returns {object} Initial version state object
 */
function createInitialVersionState() {
  return {
    lastCheckedVersion: null,
    lastCheckedTime: new Date().toISOString(),
    lastDeployedVersion: null,
    lastDeployedTime: null,
    sourceUrl: config.sourceUrl,
    checkCount: 0
  };
}

/**
 * Save version state to file
 * @param {object} state - Version state object
 */
async function saveVersionState(state) {
  try {
    await fs.writeFile(VERSION_STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
    logger.info('Version state saved successfully');
  } catch (error) {
    logger.error(`Failed to save version state: ${error.message}`);
    throw error;
  }
}

/**
 * Compare two version strings using semver
 * @param {string} v1 - First version
 * @param {string} v2 - Second version
 * @returns {number} -1 if v1 < v2, 0 if v1 = v2, 1 if v1 > v2
 */
function compareVersions(v1, v2) {
  // Simple semver comparison
  const parseVersion = (v) => {
    const parts = v.replace(/^v/, '').split('-')[0].split('.');
    return parts.map(p => parseInt(p, 10) || 0);
  };

  const parts1 = parseVersion(v1);
  const parts2 = parseVersion(v2);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;

    if (p1 < p2) return -1;
    if (p1 > p2) return 1;
  }

  return 0;
}

/**
 * Check if a pull request for the given version already exists
 * @param {string} version - Version to check
 * @returns {Promise<boolean>} True if PR exists
 */
async function hasExistingPullRequest(version) {
  try {
    const response = await fetchWithRetry(
      `https://api.github.com/repos/${config.repoOwner}/${config.repoName}/pulls?state=open`,
      {
        headers: {
          'Authorization': `Bearer ${config.githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Version-Monitor/1.0'
        }
      }
    );

    const pulls = await response.json();
    const prTitle = `chore: update version to ${version}`;

    const existingPR = pulls.find(pr => pr.title === prTitle);

    if (existingPR) {
      logger.info(`Existing PR found for version ${version}: #${existingPR.number}`);
      return true;
    }

    return false;
  } catch (error) {
    logger.warn(`Failed to check existing PRs: ${error.message}`);
    // Return false to allow attempting PR creation
    return false;
  }
}

/**
 * Create a new branch for version update
 * @param {string} version - New version number
 * @returns {string} Branch name
 */
function createVersionBranch(version) {
  const sanitizedName = version.replace(/[^a-zA-Z0-9.-]/g, '-');
  const branchName = `update-version-${sanitizedName}`;

  logger.info(`Creating branch: ${branchName}`);

  try {
    // Create and checkout new branch
    execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });
    return branchName;
  } catch (error) {
    logger.error(`Failed to create branch: ${error.message}`);
    throw error;
  }
}

/**
 * Update version state and commit to current branch
 * @param {object} state - Version state object
 * @param {string} branch - Branch name
 */
async function updateVersionStateAndCommit(state, branch) {
  try {
    // Update state
    state.checkCount = (state.checkCount || 0) + 1;

    // Save to file
    await saveVersionState(state);

    // Commit changes
    execSync('git add .github/version-state.json', { stdio: 'inherit' });
    execSync(`git commit -m "chore: update version to ${state.lastCheckedVersion}"`, { stdio: 'inherit' });

    // Push to remote
    execSync(`git push origin ${branch}`, { stdio: 'inherit' });

    logger.info(`Version state committed and pushed to ${branch}`);
  } catch (error) {
    logger.error(`Failed to commit version state: ${error.message}`);
    throw error;
  }
}

/**
 * Create a pull request
 * @param {string} version - New version number
 * @param {string} branch - Branch name
 * @returns {Promise<number>} Pull request number
 */
async function createPullRequest(version, branch) {
  try {
    const prTitle = `chore: update version to ${version}`;
    const prBody = `## Version Update

This PR updates the version state to reflect the new version detected from the official website.

- **New Version**: ${version}
- **Source**: ${config.sourceUrl}
- **Checked At**: ${new Date().toISOString()}

### Changes
- Updated \`.github/version-state.json\` with the new version information

### Next Steps
After merging this PR, the CI/CD pipeline will automatically rebuild and deploy the documentation site with the updated version information.

---
_This PR was automatically created by the Version Monitor workflow._`;

    logger.info(`Creating pull request: ${prTitle}`);

    const response = await fetchWithRetry(
      `https://api.github.com/repos/${config.repoOwner}/${config.repoName}/pulls`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Version-Monitor/1.0'
        },
        body: JSON.stringify({
          title: prTitle,
          body: prBody,
          head: branch,
          base: 'main'
        })
      }
    );

    const pr = await response.json();

    if (response.status !== 201) {
      throw new Error(`Failed to create PR: ${pr.message}`);
    }

    logger.info(`Pull request created successfully: #${pr.number}`);
    logger.info(`PR URL: ${pr.html_url}`);

    // Set GitHub Actions output for use in workflow
    if (process.env.GITHUB_OUTPUT) {
      const fs = await import('fs');
      await fs.promises.appendFile(process.env.GITHUB_OUTPUT,
        `pr_created=true\npr_number=${pr.number}\npr_url=${pr.html_url}\n`);
    }

    return pr.number;
  } catch (error) {
    logger.error(`Failed to create pull request: ${error.message}`);
    throw error;
  }
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
      maxRetries: config.maxRetries,
      repoOwner: config.repoOwner,
      repoName: config.repoName
    })}`);

    // Fetch current version from source
    const { version: currentVersion } = await fetchCurrentVersion();

    // Load current state
    let state = await loadVersionState();

    // Update check time and count
    state.lastCheckedTime = new Date().toISOString();
    state.checkCount = (state.checkCount || 0) + 1;
    state.sourceUrl = config.sourceUrl;

    // Check if version has changed
    const lastVersion = state.lastCheckedVersion || state.lastDeployedVersion;

    if (!lastVersion) {
      logger.info('No previous version found, initializing state');
      state.lastCheckedVersion = currentVersion;
      await saveVersionState(state);
      logger.info('Initial version state saved');
      return;
    }

    const versionComparison = compareVersions(currentVersion, lastVersion);

    if (versionComparison === 0) {
      logger.info('Version unchanged - no update needed');
      state.lastCheckedVersion = currentVersion;
      await saveVersionState(state);
      return;
    }

    logger.info(`Version changed: ${lastVersion} -> ${currentVersion}`);

    // Check if PR already exists for this version
    if (await hasExistingPullRequest(currentVersion)) {
      logger.info('Pull request already exists for this version, skipping creation');
      state.lastCheckedVersion = currentVersion;
      await saveVersionState(state);
      return;
    }

    // Create new branch
    const branch = createVersionBranch(currentVersion);

    // Update state and commit
    state.lastCheckedVersion = currentVersion;
    await updateVersionStateAndCommit(state, branch);

    // Create pull request
    await createPullRequest(currentVersion, branch);

    logger.info('Version monitor completed successfully - PR created');

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

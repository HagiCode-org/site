#!/usr/bin/env node

/**
 * Copy version-index.json from Docs app to Website app
 * This ensures the Website app has access to the same version data during build
 *
 * Note: Docs app has been migrated to a separate repository (HagiCode-org/docs)
 * This script now performs a no-op since website has its own version-index.json
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const SOURCE_FILE = path.join(rootDir, 'apps', 'docs', 'public', 'version-index.json');
const TARGET_DIR = path.join(rootDir, 'apps', 'website', 'public');
const TARGET_FILE = path.join(TARGET_DIR, 'version-index.json');

async function main() {
  try {
    // Ensure target directory exists
    await fs.mkdir(TARGET_DIR, { recursive: true });

    // Check if source file exists (docs app)
    try {
      await fs.access(SOURCE_FILE);
      // If source exists, copy it
      await fs.copyFile(SOURCE_FILE, TARGET_FILE);
      console.log(`✅ Copied version-index.json to ${TARGET_FILE}`);
    } catch (accessError) {
      // Source file doesn't exist - docs app has been migrated
      // Check if target file exists (website should have its own)
      try {
        await fs.access(TARGET_FILE);
        console.log(`ℹ️  Docs app not found. Website has its own version-index.json`);
      } catch (targetError) {
        // Neither file exists - this is an error state
        console.error(`❌ version-index.json not found in either docs or website app`);
        process.exit(1);
      }
    }
  } catch (error) {
    console.error(`❌ Failed to handle version-index.json: ${error.message}`);
    process.exit(1);
  }
}

main();

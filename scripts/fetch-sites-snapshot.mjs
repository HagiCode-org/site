import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { updateFooterSitesSnapshot } from '../../../scripts/footer-sites-snapshot-workflow.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(repoRoot, 'src', 'data', 'footer-sites.snapshot.json');

await updateFooterSitesSnapshot({ outputPath });
console.log(`Footer sites snapshot updated at ${path.relative(repoRoot, outputPath)}`);

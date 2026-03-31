import {
  ABOUT_SNAPSHOT_URL,
  resolveAboutSnapshotOutputPath,
  updateAboutSnapshot,
} from './lib/about-snapshot-workflow.mjs';

async function main() {
  const outputPath = resolveAboutSnapshotOutputPath();
  const result = await updateAboutSnapshot({ outputPath });

  console.log(`About snapshot updated from ${ABOUT_SNAPSHOT_URL}`);
  console.log(`Output: ${result.outputPath}`);
  console.log(`Version: ${result.payload.version}`);
  console.log(`Updated at: ${result.payload.updatedAt}`);
  console.log(`Entries: ${result.payload.entries.length}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

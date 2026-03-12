#!/usr/bin/env node
import path from 'node:path';
import {
  defaultOutputName,
  executeBatchJobs,
  executeGenerateJob,
  getSiteRoot,
  loadBasePromptConfig,
  loadBatchConfig,
  parseCliArgs,
  resolveImgBinRuntime,
  resolveSinglePromptInput
} from './lib/imgbin-workflow.mjs';

function printHelp() {
  console.log(`generate-image.mjs - ImgBin-backed site image generation\n\nUSAGE:\n  node scripts/generate-image.mjs --prompt "A doodle" [options]\n  node scripts/generate-image.mjs --prompt-file scripts/prompts/product-images/example/prompt.json --output public/img/example.png\n  node scripts/generate-image.mjs --batch-config scripts/product-images-batch.json [--force]\n\nOPTIONS:\n  --prompt <text>           Raw prompt input for a single image\n  --prompt-file <path>      Site-managed prompt.json file\n  --load-prompt <path>      Existing prompt.json to reuse as-is\n  --save-prompt <path>      Persist the generated prompt.json before running ImgBin\n  --output <path>           Final exported image path for single-image mode\n  --batch-config <path>     Batch config with jobs[] entries\n  --size <value>            Generation size override (default: 1024x1024)\n  --quality <value>         Generation quality override (default: high)\n  --format <value>          Generation format override (default: png)\n  --context <key>           Context key from scripts/image-base-prompt.json\n  --custom-prompt <text>    Additional prompt fragment appended before the user prompt\n  --use-base-prompt         Force-enable the hand-drawn base prompt\n  --no-base-prompt          Disable the hand-drawn base prompt for this run\n  --slug <slug>             Forward slug to ImgBin\n  --title <title>           Forward title to ImgBin\n  --tag <tag>               Forward one or more tags to ImgBin\n  --analysis-prompt <path>  Claude metadata prompt override\n  --no-annotate             Skip Claude metadata analysis\n  --thumbnail               Ask ImgBin to create a thumbnail\n  --force                   Overwrite exported files when they already exist\n  --dry-run                 Forward dry-run to ImgBin\n  --verbose                 Print extra execution details\n  -h, --help                Show this help text\n\nIMG BIN CONTRACT:\n  The site wrapper validates only ImgBin-facing configuration. By default it uses\n  ../imgbin/dist/cli.js and ../imgbin as the working directory. Override with:\n    IMGBIN_EXECUTABLE\n    IMGBIN_WORKDIR\n    IMGBIN_LIBRARY_ROOT\n\nNOTES:\n  - GPT Image 1.5 is responsible for image generation only.\n  - Metadata generation still depends on Claude via ImgBin's annotate step.\n  - The default style remains the existing hand-drawn base prompt set.\n`);
}

function logSection(title) {
  console.log(`\n${title}`);
}

function relativeToSite(candidate) {
  return path.relative(getSiteRoot(), candidate) || '.';
}

async function runSingle(options) {
  const runtime = await resolveImgBinRuntime();
  const basePromptConfig = await loadBasePromptConfig();
  const promptInput = await resolveSinglePromptInput(options, basePromptConfig);

  const outputPath = path.resolve(
    getSiteRoot(),
    options.output ?? defaultOutputName(promptInput.format)
  );

  try {
    const result = await executeGenerateJob({
      promptFile: promptInput.promptFile,
      exportTo: outputPath,
      slug: options.slug,
      title: options.title,
      tags: options.tags,
      annotate: options.annotate,
      thumbnail: options.thumbnail,
      analysisPrompt: options.analysisPrompt ? path.resolve(getSiteRoot(), options.analysisPrompt) : undefined,
      force: options.force,
      dryRun: options.dryRun
    }, runtime);

    if (options.verbose) {
      logSection('ImgBin runtime');
      console.log(`- executable: ${runtime.executableLabel}`);
      console.log(`- workdir: ${relativeToSite(runtime.workdir)}`);
      console.log(`- libraryRoot: ${relativeToSite(runtime.libraryRoot)}`);
      console.log(`- promptFile: ${relativeToSite(promptInput.promptFile)}`);
    }

    logSection('Single image result');
    for (const line of result.summaryLines) {
      console.log(`- ${line}`);
    }

    if (result.parsed.failed || result.exportError) {
      process.exitCode = 1;
    }
  } finally {
    await promptInput.cleanup?.();
  }
}

async function runBatch(options) {
  const runtime = await resolveImgBinRuntime();
  const batchConfig = await loadBatchConfig(options.batchConfig);
  batchConfig.jobs = batchConfig.jobs.map((job) => ({
    ...job,
    force: options.force || job.force,
    dryRun: options.dryRun || job.dryRun
  }));
  const results = await executeBatchJobs(batchConfig, runtime);

  if (options.verbose) {
    logSection('ImgBin runtime');
    console.log(`- executable: ${runtime.executableLabel}`);
    console.log(`- workdir: ${relativeToSite(runtime.workdir)}`);
    console.log(`- libraryRoot: ${relativeToSite(runtime.libraryRoot)}`);
    console.log(`- batchConfig: ${relativeToSite(batchConfig.path)}`);
  }

  logSection(`Batch result (${results.length} jobs)`);
  let failed = 0;
  for (const result of results) {
    const label = result.job.slug ?? result.job.promptFile ?? result.job.exportTo ?? 'unnamed-job';
    console.log(`- ${label}`);
    for (const line of result.summaryLines) {
      console.log(`  * ${line}`);
    }
    if (result.parsed.failed || result.exportError || (!result.parsed.assetDir && !result.job.dryRun)) {
      failed += 1;
    }
  }

  if (failed > 0) {
    process.exitCode = 1;
  }
}

async function main() {
  const options = parseCliArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  if (options.batchConfig) {
    await runBatch(options);
    return;
  }

  await runSingle(options);
}

try {
  await main();
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  const details = error && typeof error === 'object' ? error.details : undefined;

  console.error(`Error: ${message}`);
  if (details?.help) {
    console.error(`How to fix: ${details.help}`);
  }
  if (details?.executable) {
    console.error(`Executable: ${details.executable}`);
  }
  if (details?.workdir) {
    console.error(`Workdir: ${details.workdir}`);
  }
  if (details?.output) {
    console.error(`Output: ${details.output}`);
  }
  if (details?.batchConfigPath) {
    console.error(`Batch config: ${details.batchConfigPath}`);
  }
  process.exitCode = 1;
}

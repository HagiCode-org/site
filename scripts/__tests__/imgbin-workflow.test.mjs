import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  buildImgBinGenerateArgs,
  buildPromptDocument,
  executeBatchJobs,
  exportGeneratedAsset,
  getSiteRoot,
  loadBasePromptConfig,
  loadBatchConfig,
  loadSiteRuntimeEnv,
  parseImgBinExecution,
  resolveImgBinRuntime
} from '../lib/imgbin-workflow.mjs';

const tempDirs = [];

async function createTempDir(prefix) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

async function createManagedAsset(rootDir, slug, { recognition = 'succeeded' } = {}) {
  const assetDir = path.join(rootDir, slug);
  await fs.mkdir(assetDir, { recursive: true });
  const originalFilename = 'original.png';
  await fs.writeFile(path.join(assetDir, originalFilename), 'png-bits');
  await fs.writeFile(
    path.join(assetDir, 'metadata.json'),
    JSON.stringify(
      {
        paths: {
          original: originalFilename
        },
        status: {
          generation: 'succeeded',
          recognition,
          thumbnail: 'skipped'
        }
      },
      null,
      2
    )
  );
  return assetDir;
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe('site ImgBin workflow helpers', () => {
  it('builds prompt documents with the existing hand-drawn base prompt', async () => {
    const basePromptConfig = await loadBasePromptConfig();
    const document = buildPromptDocument({
      prompt: 'A new onboarding doodle',
      context: 'desktop-app',
      customPrompt: 'Include smiling users.',
      useBasePrompt: true,
      basePromptConfig,
      generationParams: {
        size: '1024x1024',
        quality: 'high',
        format: 'png'
      }
    });

    expect(document.basePrompt).toContain("Children's hand-drawing style");
    expect(document.userPrompt).toContain('Include smiling users.');
    expect(document.userPrompt).toContain('A new onboarding doodle');
    expect(document._metadata.defaultStyle).toBe('hand-drawn');
  });

  it('assembles ImgBin generate args with annotate and prompt-file inputs', () => {
    const args = buildImgBinGenerateArgs({
      promptFile: '/tmp/prompt.json',
      libraryRoot: '/tmp/library',
      slug: 'hero-card',
      title: 'Hero card',
      tags: ['docs', 'hand-drawn'],
      annotate: true,
      thumbnail: true,
      analysisPrompt: '/tmp/analysis.txt',
      dryRun: false
    });

    expect(args).toEqual([
      'generate',
      '--prompt-file',
      '/tmp/prompt.json',
      '--output',
      '/tmp/library',
      '--slug',
      'hero-card',
      '--title',
      'Hero card',
      '--tag',
      'docs',
      '--tag',
      'hand-drawn',
      '--annotate',
      '--thumbnail',
      '--analysis-prompt',
      '/tmp/analysis.txt'
    ]);
  });

  it('parses ImgBin output and distinguishes metadata failures from image generation success', () => {
    const parsed = parseImgBinExecution({
      exitCode: 1,
      stdout: [
        'Generated asset with warnings at /tmp/library/hero-card',
        '- SUCCEEDED normalize: Loaded docs prompt file /tmp/prompt.json',
        '- SUCCEEDED generate: Generated image asset at /tmp/library/hero-card',
        '- FAILED recognition: Metadata analysis failed (Codex timed out)'
      ].join('\n'),
      stderr: 'Codex timed out'
    });

    expect(parsed.assetDir).toBe('/tmp/library/hero-card');
    expect(parsed.generationSucceeded).toBe(true);
    expect(parsed.metadataSucceeded).toBe(false);
    expect(parsed.metadataError).toBe('Codex timed out');
  });

  it('exports a generated asset into the repository target path', async () => {
    const tempDir = await createTempDir('site-imgbin-export-');
    const assetDir = await createManagedAsset(tempDir, 'hero-card');
    const targetPath = path.join(tempDir, 'public', 'img', 'hero-card.png');

    const exported = await exportGeneratedAsset(assetDir, targetPath, { force: true });

    expect(await fs.readFile(targetPath, 'utf8')).toBe('png-bits');
    expect(exported.outputPath).toBe(targetPath);
    expect(exported.metadataPath).toBe(path.join(assetDir, 'metadata.json'));
  });

  it('runs batch jobs, exports files, and preserves per-job summaries', async () => {
    const tempDir = await createTempDir('site-imgbin-batch-');
    const assetRoot = path.join(tempDir, 'library');
    const firstAsset = await createManagedAsset(assetRoot, 'first-card');
    const secondAsset = await createManagedAsset(assetRoot, 'second-card', { recognition: 'failed' });
    const exportsRoot = path.join(tempDir, 'exports');

    const batchConfig = {
      path: path.join(getSiteRoot(), 'scripts', 'product-images-batch.json'),
      defaults: {},
      jobs: [
        {
          slug: 'first-card',
          promptFile: path.join(getSiteRoot(), 'scripts', 'prompts', 'product-images', 'value-proposition-proposal-driven', 'prompt.json'),
          exportTo: path.join(exportsRoot, 'first-card.png'),
          annotate: true,
          force: true
        },
        {
          slug: 'second-card',
          promptFile: path.join(getSiteRoot(), 'scripts', 'prompts', 'product-images', 'story-team-knowledge', 'prompt.json'),
          exportTo: path.join(exportsRoot, 'second-card.png'),
          annotate: true,
          force: true
        }
      ]
    };

    let callIndex = 0;
    const results = await executeBatchJobs(
      batchConfig,
      {
        executable: process.execPath,
        executableLabel: process.execPath,
        argsPrefix: [],
        workdir: tempDir,
        libraryRoot: assetRoot
      },
      {
        runProcess: async () => {
          callIndex += 1;
          if (callIndex === 1) {
            return {
              exitCode: 0,
              stdout: [
                `Generated asset at ${firstAsset}`,
                `- SUCCEEDED generate: Generated image asset at ${firstAsset}`,
                '- SUCCEEDED recognition: Metadata analysis succeeded using default-analysis-prompt.txt'
              ].join('\n'),
              stderr: ''
            };
          }

          return {
            exitCode: 1,
            stdout: [
              `Generated asset with warnings at ${secondAsset}`,
              `- SUCCEEDED generate: Generated image asset at ${secondAsset}`,
              '- FAILED recognition: Metadata analysis failed (Codex unavailable)'
            ].join('\n'),
            stderr: 'Codex unavailable'
          };
        }
      }
    );

    expect(results).toHaveLength(2);
    expect(await fs.readFile(path.join(exportsRoot, 'first-card.png'), 'utf8')).toBe('png-bits');
    expect(await fs.readFile(path.join(exportsRoot, 'second-card.png'), 'utf8')).toBe('png-bits');
    expect(results[0].summaryLines).toContain(`export: ${path.join(exportsRoot, 'first-card.png')}`);
    expect(results[1].summaryLines).toContain('metadata analysis (Codex): failed (Codex unavailable)');
  });

  it('loads site runtime env from .env files and applies the OmniRoute Codex defaults', async () => {
    const tempDir = await createTempDir('site-imgbin-env-');
    await fs.writeFile(
      path.join(tempDir, '.env'),
      'IMGBIN_CODEX_MODEL=from-dot-env\nIMGBIN_ANALYSIS_PROVIDER=http\n',
      'utf8'
    );
    await fs.writeFile(
      path.join(tempDir, '.env.local'),
      'IMGBIN_CODEX_MODEL=from-dot-env-local\n',
      'utf8'
    );

    const env = await loadSiteRuntimeEnv(
      {
        IMGBIN_CODEX_BASE_URL: 'http://shell.example/v1'
      },
      {
        siteRoot: tempDir
      }
    );

    expect(env.IMGBIN_ANALYSIS_PROVIDER).toBe('http');
    expect(env.IMGBIN_CODEX_MODEL).toBe('from-dot-env-local');
    expect(env.IMGBIN_CODEX_BASE_URL).toBe('http://shell.example/v1');

    const defaultsOnly = await loadSiteRuntimeEnv({}, { siteRoot: await createTempDir('site-imgbin-env-defaults-') });
    expect(defaultsOnly.IMGBIN_ANALYSIS_PROVIDER).toBe('codex');
    expect(defaultsOnly.IMGBIN_CODEX_MODEL).toBe('lemon/gpt-5.4');
    expect(defaultsOnly.IMGBIN_CODEX_BASE_URL).toBe('http://localhost:36129/v1');
  });

  it('loads the redesigned product image batch config and resolves prompt paths', async () => {
    const config = await loadBatchConfig('scripts/product-images-batch.json');
    const promptFile = JSON.parse(await fs.readFile(config.jobs[0].promptFile, 'utf8'));

    expect(config.jobs).toHaveLength(12);
    expect(config.jobs[0].promptFile).toContain(path.join('scripts', 'prompts', 'product-images'));
    expect(config.jobs[0].exportTo).toContain(path.join('public', 'img', 'product-overview'));
    expect(promptFile.basePrompt).toContain("Children's hand-drawing style");
    expect(promptFile._metadata.defaultStyle).toBe('hand-drawn');
  });

  it('fails early when ImgBin-facing configuration is missing', async () => {
    await expect(
      resolveImgBinRuntime({
        IMGBIN_WORKDIR: './repos/site/does-not-exist',
        IMGBIN_EXECUTABLE: './repos/site/does-not-exist/cli.js'
      })
    ).rejects.toThrow(/ImgBin workdir is missing/);
  });
});

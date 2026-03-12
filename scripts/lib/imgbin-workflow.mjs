import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(moduleDir, '../..');
const defaultWorkdir = path.resolve(siteRoot, '../imgbin');
const defaultExecutable = path.join(defaultWorkdir, 'dist/cli.js');
const defaultLibraryRoot = path.join(siteRoot, '.imgbin-library');
const defaultBasePromptPath = path.join(siteRoot, 'scripts', 'image-base-prompt.json');
const cliStepPattern = /^-\s+([A-Z]+)\s+(\w+):\s+(.*?)(?:\s+\((.*)\))?$/;
const assetDirPattern = /Generated asset(?: with warnings)? at (.+)$/;

export function getSiteRoot() {
  return siteRoot;
}

export function splitCommandLine(value) {
  if (!value) {
    return [];
  }

  const parts = [];
  let current = '';
  let quote = null;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (quote) {
      if (char === quote) {
        quote = null;
      } else if (char === '\\' && index + 1 < value.length) {
        index += 1;
        current += value[index];
      } else {
        current += char;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (/\s/.test(char)) {
      if (current) {
        parts.push(current);
        current = '';
      }
      continue;
    }

    if (char === '\\' && index + 1 < value.length) {
      index += 1;
      current += value[index];
      continue;
    }

    current += char;
  }

  if (current) {
    parts.push(current);
  }

  return parts;
}

export function createScriptError(message, details) {
  const error = new Error(message);
  error.details = details;
  return error;
}

export async function loadJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

export async function pathExists(candidate) {
  try {
    await fs.access(candidate);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function loadBasePromptConfig(basePromptPath = defaultBasePromptPath) {
  const raw = await loadJson(basePromptPath);
  return {
    path: basePromptPath,
    basePrompt: typeof raw.basePrompt === 'string' ? raw.basePrompt.trim() : '',
    defaultEnabled: raw.defaultEnabled !== false,
    contexts: typeof raw.contexts === 'object' && raw.contexts ? raw.contexts : {}
  };
}

export async function resolveImgBinRuntime(env = process.env) {
  const workdir = path.resolve(siteRoot, env.IMGBIN_WORKDIR ?? defaultWorkdir);
  const explicitExecutable = env.IMGBIN_EXECUTABLE;
  const executableInput = explicitExecutable
    ? explicitExecutable.includes(path.sep) || explicitExecutable.endsWith('.js') || explicitExecutable.endsWith('.mjs')
      ? path.resolve(siteRoot, explicitExecutable)
      : explicitExecutable
    : defaultExecutable;
  const extraArgs = splitCommandLine(env.IMGBIN_EXECUTABLE_ARGS);
  const libraryRoot = path.resolve(siteRoot, env.IMGBIN_LIBRARY_ROOT ?? defaultLibraryRoot);

  if (!(await pathExists(workdir))) {
    throw createScriptError('ImgBin workdir is missing.', {
      workdir,
      help: 'Set IMGBIN_WORKDIR to a valid ImgBin checkout or install a reachable ImgBin executable.'
    });
  }

  const hasPathSeparator = executableInput.includes(path.sep) || executableInput.endsWith('.js') || executableInput.endsWith('.mjs');
  if (hasPathSeparator && !(await pathExists(executableInput))) {
    throw createScriptError('ImgBin executable is missing.', {
      executable: executableInput,
      help: 'Build ImgBin first or set IMGBIN_EXECUTABLE to a valid executable path.'
    });
  }

  await ensureDir(libraryRoot);

  if (executableInput.endsWith('.js') || executableInput.endsWith('.mjs')) {
    return {
      workdir,
      executable: process.execPath,
      argsPrefix: [...extraArgs, executableInput],
      libraryRoot,
      executableLabel: executableInput
    };
  }

  return {
    workdir,
    executable: executableInput,
    argsPrefix: extraArgs,
    libraryRoot,
    executableLabel: executableInput
  };
}

export function resolveContextPrompt(config, contextKey) {
  if (!contextKey) {
    return '';
  }
  const value = config.contexts?.[contextKey];
  return typeof value === 'string' ? value.trim() : '';
}

export function composeFinalPrompt({ prompt, useBasePrompt, basePromptConfig, contextKey, customPrompt }) {
  const parts = [];
  if (useBasePrompt && basePromptConfig.basePrompt) {
    parts.push(basePromptConfig.basePrompt);
  }

  const contextPrompt = resolveContextPrompt(basePromptConfig, contextKey);
  if (contextPrompt) {
    parts.push(contextPrompt);
  }

  if (customPrompt?.trim()) {
    parts.push(customPrompt.trim());
  }

  parts.push(prompt.trim());

  return {
    finalPrompt: parts.join('\n\n'),
    contextPrompt
  };
}

export function buildPromptDocument({
  prompt,
  context,
  customPrompt,
  useBasePrompt,
  basePromptConfig,
  generationParams,
  metadata = {}
}) {
  const { finalPrompt, contextPrompt } = composeFinalPrompt({
    prompt,
    useBasePrompt,
    basePromptConfig,
    contextKey: context,
    customPrompt
  });

  return {
    _comment: 'Generated by the Hagicode site ImgBin wrapper.',
    basePrompt: useBasePrompt ? basePromptConfig.basePrompt : '',
    context: context ?? '',
    customPrompt: customPrompt ?? '',
    userPrompt: finalPrompt,
    generationParams,
    _metadata: {
      ...metadata,
      promptInput: prompt,
      contextPrompt,
      promptBuilder: 'site-imgbin-wrapper',
      generatedAt: new Date().toISOString(),
      basePromptPath: basePromptConfig.path,
      defaultStyle: 'hand-drawn'
    }
  };
}

export async function writeJson(filePath, value) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export async function createTempPromptFile(document) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'site-imgbin-prompt-'));
  const promptFile = path.join(tempDir, 'prompt.json');
  await writeJson(promptFile, document);
  return {
    promptFile,
    cleanup: async () => fs.rm(tempDir, { recursive: true, force: true })
  };
}

export function defaultOutputName(format = 'png') {
  return `generated_image.${format}`;
}

export async function loadPromptMetadata(promptFile) {
  const document = await loadJson(promptFile);
  const format = document.generationParams?.format;
  return {
    document,
    format: typeof format === 'string' ? format : 'png'
  };
}

export function parseCliArgs(argv) {
  const options = {
    annotate: true,
    force: false,
    dryRun: false,
    useBasePrompt: undefined,
    verbose: false,
    tags: []
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const takeValue = () => {
      const value = argv[index + 1];
      if (value == null) {
        throw createScriptError(`Missing value for ${arg}.`);
      }
      index += 1;
      return value;
    };

    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--prompt') {
      options.prompt = takeValue();
    } else if (arg.startsWith('--prompt=')) {
      options.prompt = arg.slice('--prompt='.length);
    } else if (arg === '--prompt-file') {
      options.promptFile = takeValue();
    } else if (arg.startsWith('--prompt-file=')) {
      options.promptFile = arg.slice('--prompt-file='.length);
    } else if (arg === '--output' || arg === '-o') {
      options.output = takeValue();
    } else if (arg.startsWith('--output=')) {
      options.output = arg.slice('--output='.length);
    } else if (arg === '--save-prompt') {
      options.savePrompt = takeValue();
    } else if (arg.startsWith('--save-prompt=')) {
      options.savePrompt = arg.slice('--save-prompt='.length);
    } else if (arg === '--load-prompt') {
      options.loadPrompt = takeValue();
    } else if (arg.startsWith('--load-prompt=')) {
      options.loadPrompt = arg.slice('--load-prompt='.length);
    } else if (arg === '--batch-config') {
      options.batchConfig = takeValue();
    } else if (arg.startsWith('--batch-config=')) {
      options.batchConfig = arg.slice('--batch-config='.length);
    } else if (arg === '--size' || arg === '-s') {
      options.size = takeValue();
    } else if (arg.startsWith('--size=')) {
      options.size = arg.slice('--size='.length);
    } else if (arg === '--quality' || arg === '-q') {
      options.quality = takeValue();
    } else if (arg.startsWith('--quality=')) {
      options.quality = arg.slice('--quality='.length);
    } else if (arg === '--format' || arg === '-f') {
      options.format = takeValue();
    } else if (arg.startsWith('--format=')) {
      options.format = arg.slice('--format='.length);
    } else if (arg === '--context') {
      options.context = takeValue();
    } else if (arg.startsWith('--context=')) {
      options.context = arg.slice('--context='.length);
    } else if (arg === '--custom-prompt') {
      options.customPrompt = takeValue();
    } else if (arg.startsWith('--custom-prompt=')) {
      options.customPrompt = arg.slice('--custom-prompt='.length);
    } else if (arg === '--slug') {
      options.slug = takeValue();
    } else if (arg.startsWith('--slug=')) {
      options.slug = arg.slice('--slug='.length);
    } else if (arg === '--title') {
      options.title = takeValue();
    } else if (arg.startsWith('--title=')) {
      options.title = arg.slice('--title='.length);
    } else if (arg === '--tag') {
      options.tags.push(takeValue());
    } else if (arg.startsWith('--tag=')) {
      options.tags.push(arg.slice('--tag='.length));
    } else if (arg === '--analysis-prompt') {
      options.analysisPrompt = takeValue();
    } else if (arg.startsWith('--analysis-prompt=')) {
      options.analysisPrompt = arg.slice('--analysis-prompt='.length);
    } else if (arg === '--force' || arg === '--no-skip') {
      options.force = true;
    } else if (arg === '--annotate') {
      options.annotate = true;
    } else if (arg === '--no-annotate') {
      options.annotate = false;
    } else if (arg === '--thumbnail') {
      options.thumbnail = true;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--use-base-prompt') {
      options.useBasePrompt = true;
    } else if (arg === '--no-base-prompt') {
      options.useBasePrompt = false;
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    } else {
      throw createScriptError(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

export async function loadBatchConfig(batchConfigPath) {
  const resolvedPath = path.resolve(siteRoot, batchConfigPath);
  const raw = await loadJson(resolvedPath);
  const manifestDir = path.dirname(resolvedPath);
  const defaults = raw.defaults ?? {};
  const jobs = Array.isArray(raw.jobs)
    ? raw.jobs.map((job) => ({
        ...defaults,
        ...job,
        promptFile: job.promptFile ? path.resolve(manifestDir, job.promptFile) : undefined,
        exportTo: job.exportTo ? path.resolve(manifestDir, job.exportTo) : undefined,
        analysisPrompt: job.analysisPrompt ? path.resolve(manifestDir, job.analysisPrompt) : undefined
      }))
    : [];

  if (jobs.length === 0) {
    throw createScriptError('Batch config must include a non-empty jobs array.', { batchConfigPath: resolvedPath });
  }

  return {
    path: resolvedPath,
    defaults,
    jobs
  };
}

export function buildImgBinGenerateArgs({ promptFile, libraryRoot, slug, title, tags = [], annotate = true, thumbnail = false, analysisPrompt, dryRun }) {
  const args = ['generate', '--prompt-file', promptFile, '--output', libraryRoot];

  if (slug) {
    args.push('--slug', slug);
  }
  if (title) {
    args.push('--title', title);
  }
  for (const tag of tags) {
    args.push('--tag', tag);
  }
  if (annotate) {
    args.push('--annotate');
  }
  if (thumbnail) {
    args.push('--thumbnail');
  }
  if (analysisPrompt) {
    args.push('--analysis-prompt', analysisPrompt);
  }
  if (dryRun) {
    args.push('--dry-run');
  }

  return args;
}

export async function runProcess({ executable, args, cwd, env, onStdout, onStderr }) {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, {
      cwd,
      env,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      const text = chunk.toString();
      stdout += text;
      onStdout?.(text);
    });

    child.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      stderr += text;
      onStderr?.(text);
    });

    child.on('error', reject);
    child.on('close', (exitCode) => {
      resolve({ exitCode: exitCode ?? 1, stdout, stderr });
    });
  });
}

export function parseImgBinExecution(result) {
  const combined = `${result.stdout}\n${result.stderr}`;
  const lines = combined
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const steps = [];
  let assetDir;

  for (const line of lines) {
    const assetMatch = line.match(assetDirPattern);
    if (assetMatch) {
      assetDir = assetMatch[1].trim();
    }

    const stepMatch = line.match(cliStepPattern);
    if (stepMatch) {
      steps.push({
        status: stepMatch[1].toLowerCase(),
        step: stepMatch[2],
        message: stepMatch[3],
        error: stepMatch[4]
      });
    }
  }

  const generateStep = steps.find((step) => step.step === 'generate');
  const recognitionStep = steps.find((step) => step.step === 'recognition');
  const isDryRun = lines.some((line) => line.includes('[dry-run]'));

  return {
    exitCode: result.exitCode,
    stdout: result.stdout,
    stderr: result.stderr,
    lines,
    steps,
    assetDir,
    dryRun: isDryRun,
    generationSucceeded: generateStep?.status === 'succeeded',
    metadataSucceeded: recognitionStep ? recognitionStep.status === 'succeeded' : undefined,
    metadataError: recognitionStep?.status === 'failed' ? recognitionStep.error ?? recognitionStep.message : undefined,
    failed: result.exitCode !== 0,
    errorMessage: lines.at(-1)
  };
}

export async function readManagedAsset(assetDir) {
  const metadataPath = path.join(assetDir, 'metadata.json');
  const metadata = await loadJson(metadataPath);
  const originalPath = path.join(assetDir, metadata.paths.original);
  return {
    metadataPath,
    metadata,
    originalPath
  };
}

export async function exportGeneratedAsset(assetDir, targetPath, { force = false } = {}) {
  const resolvedTargetPath = path.resolve(siteRoot, targetPath);
  if (!force && (await pathExists(resolvedTargetPath))) {
    throw createScriptError('Target output already exists.', {
      output: resolvedTargetPath,
      help: 'Delete the file first or rerun with --force.'
    });
  }

  const asset = await readManagedAsset(assetDir);
  await ensureDir(path.dirname(resolvedTargetPath));
  await fs.copyFile(asset.originalPath, resolvedTargetPath);

  return {
    outputPath: resolvedTargetPath,
    metadataPath: asset.metadataPath,
    originalPath: asset.originalPath,
    metadata: asset.metadata
  };
}

export async function resolveSinglePromptInput(options, basePromptConfig) {
  const generationParams = {
    size: options.size ?? '1024x1024',
    quality: options.quality ?? 'high',
    format: options.format ?? 'png'
  };

  if (options.loadPrompt) {
    const promptFile = path.resolve(siteRoot, options.loadPrompt);
    const promptInfo = await loadPromptMetadata(promptFile);
    return {
      promptFile,
      cleanup: null,
      format: promptInfo.format
    };
  }

  if (options.promptFile) {
    const sourcePath = path.resolve(siteRoot, options.promptFile);
    const promptInfo = await loadPromptMetadata(sourcePath);
    if (options.size || options.quality || options.format) {
      const merged = {
        ...promptInfo.document,
        generationParams: {
          ...(promptInfo.document.generationParams ?? {}),
          ...generationParams
        }
      };
      const created = await createTempPromptFile(merged);
      return {
        promptFile: created.promptFile,
        cleanup: created.cleanup,
        format: merged.generationParams.format ?? promptInfo.format
      };
    }

    return {
      promptFile: sourcePath,
      cleanup: null,
      format: promptInfo.format
    };
  }

  if (!options.prompt) {
    throw createScriptError('Provide either --prompt, --prompt-file, or --load-prompt.');
  }

  const useBasePrompt = options.useBasePrompt ?? basePromptConfig.defaultEnabled;
  const document = buildPromptDocument({
    prompt: options.prompt,
    context: options.context,
    customPrompt: options.customPrompt,
    useBasePrompt,
    basePromptConfig,
    generationParams,
    metadata: {
      source: 'single-generate',
      handDrawnStyle: useBasePrompt
    }
  });

  if (options.savePrompt) {
    const promptFile = path.resolve(siteRoot, options.savePrompt);
    await writeJson(promptFile, document);
    return {
      promptFile,
      cleanup: null,
      format: generationParams.format
    };
  }

  const created = await createTempPromptFile(document);
  return {
    promptFile: created.promptFile,
    cleanup: created.cleanup,
    format: generationParams.format
  };
}

export function summarizeExecution(parsed, exportResult) {
  const lines = [];
  if (parsed.dryRun) {
    lines.push('image generation: dry-run previewed');
  } else if (parsed.generationSucceeded) {
    lines.push(`image generation: succeeded (${parsed.assetDir ?? 'asset unknown'})`);
  } else {
    lines.push(`image generation: failed${parsed.errorMessage ? ` (${parsed.errorMessage})` : ''}`);
  }

  if (parsed.metadataSucceeded === true) {
    lines.push('metadata analysis (Claude): succeeded');
  } else if (parsed.metadataSucceeded === false) {
    lines.push(`metadata analysis (Claude): failed${parsed.metadataError ? ` (${parsed.metadataError})` : ''}`);
  }

  if (exportResult) {
    lines.push(`export: ${exportResult.outputPath}`);
  }

  return lines;
}

export async function executeGenerateJob(job, runtime, hooks = {}) {
  const args = [
    ...runtime.argsPrefix,
    ...buildImgBinGenerateArgs({
      promptFile: job.promptFile,
      libraryRoot: job.libraryRoot ?? runtime.libraryRoot,
      slug: job.slug,
      title: job.title,
      tags: job.tags,
      annotate: job.annotate,
      thumbnail: job.thumbnail,
      analysisPrompt: job.analysisPrompt,
      dryRun: job.dryRun
    })
  ];

  const rawResult = await (hooks.runProcess ?? runProcess)({
    executable: runtime.executable,
    args,
    cwd: runtime.workdir,
    env: process.env,
    onStdout: hooks.onStdout,
    onStderr: hooks.onStderr
  });

  const parsed = parseImgBinExecution(rawResult);
  let exportResult;
  let exportError;
  if (job.exportTo && parsed.assetDir && parsed.generationSucceeded && !job.dryRun) {
    try {
      exportResult = await exportGeneratedAsset(parsed.assetDir, job.exportTo, { force: job.force });
    } catch (error) {
      exportError = error instanceof Error ? error.message : 'Unknown export error';
    }
  }

  return {
    job,
    rawResult,
    parsed,
    exportResult,
    exportError,
    summaryLines: [
      ...summarizeExecution(parsed, exportResult),
      ...(exportError ? [`export: failed (${exportError})`] : [])
    ]
  };
}

export async function executeBatchJobs(batchConfig, runtime, hooks = {}) {
  const results = [];
  for (const job of batchConfig.jobs) {
    try {
      results.push(
        await executeGenerateJob(
          {
            ...job,
            libraryRoot: batchConfig.defaults.libraryRoot ? path.resolve(path.dirname(batchConfig.path), batchConfig.defaults.libraryRoot) : runtime.libraryRoot
          },
          runtime,
          hooks
        )
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown batch job error';
      results.push({
        job,
        rawResult: { exitCode: 1, stdout: '', stderr: message },
        parsed: {
          exitCode: 1,
          stdout: '',
          stderr: message,
          lines: [message],
          steps: [],
          assetDir: undefined,
          generationSucceeded: false,
          metadataSucceeded: undefined,
          metadataError: undefined,
          failed: true,
          errorMessage: message
        },
        exportResult: undefined,
        summaryLines: [`image generation: failed (${message})`]
      });
    }
  }
  return results;
}

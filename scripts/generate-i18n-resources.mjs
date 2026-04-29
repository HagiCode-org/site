import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { load } from 'js-yaml';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDirectory, '..');
const defaultLocalesRoot = path.join(siteRoot, 'src/i18n/locales');
const defaultGeneratedRoot = path.join(siteRoot, 'src/i18n/generated-locales');
const defaultLocaleMetadataPath = path.join(siteRoot, 'src/i18n/locale-metadata.ts');
const defaultNamespacesPath = path.join(siteRoot, 'src/i18n/namespaces.ts');

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeNames(values) {
  return [...values].sort((left, right) => left.localeCompare(right));
}

function formatJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function parseQuotedStrings(sourceText) {
  return [...sourceText.matchAll(/'([^']+)'|"([^"]+)"/g)].map((match) => match[1] ?? match[2]);
}

async function readExpectedLocaleCodes(localeMetadataPath) {
  const sourceText = await fs.readFile(localeMetadataPath, 'utf8');
  const localeCodes = [...sourceText.matchAll(/\bcode:\s*'([^']+)'/g)].map((match) => match[1]);
  assert(localeCodes.length > 0, `Could not find site locale codes in ${localeMetadataPath}`);
  return normalizeNames(localeCodes);
}

async function readExpectedNamespaces(namespacesPath) {
  const sourceText = await fs.readFile(namespacesPath, 'utf8');
  const namespaceMatch = sourceText.match(/\bSITE_I18N_NAMESPACES\s*=\s*\[([\s\S]*?)\]/m);
  assert(namespaceMatch, `Could not find site i18n namespaces in ${namespacesPath}`);
  const namespaces = parseQuotedStrings(namespaceMatch[1]);
  assert(namespaces.length > 0, `Could not parse site i18n namespaces from ${namespacesPath}`);
  return normalizeNames(namespaces);
}

async function resolveMetadata(options = {}) {
  const expectedLocales = options.expectedLocales
    ? normalizeNames(options.expectedLocales)
    : await readExpectedLocaleCodes(options.localeMetadataPath ?? defaultLocaleMetadataPath);
  const expectedNamespaces = options.expectedNamespaces
    ? normalizeNames(options.expectedNamespaces)
    : await readExpectedNamespaces(options.namespacesPath ?? defaultNamespacesPath);

  return {
    localesRoot: path.resolve(options.localesRoot ?? defaultLocalesRoot),
    generatedRoot: path.resolve(options.generatedRoot ?? defaultGeneratedRoot),
    expectedLocales,
    expectedNamespaces,
  };
}

async function listDirectoryNames(directoryPath) {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  return normalizeNames(entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name));
}

async function readLocaleSourceFile(localeDirectory, namespace) {
  const ymlPath = path.join(localeDirectory, `${namespace}.yml`);
  const yamlPath = path.join(localeDirectory, `${namespace}.yaml`);
  const ymlExists = await fs.access(ymlPath).then(() => true).catch(() => false);
  const yamlExists = await fs.access(yamlPath).then(() => true).catch(() => false);

  assert(
    !(ymlExists && yamlExists),
    `Found both .yml and .yaml for ${path.relative(siteRoot, localeDirectory)}/${namespace}`,
  );
  assert(ymlExists || yamlExists, `Missing YAML namespace file for ${path.relative(siteRoot, localeDirectory)}/${namespace}`);

  const filePath = ymlExists ? ymlPath : yamlPath;
  const raw = await fs.readFile(filePath, 'utf8');
  const data = load(raw);
  assert(
    isPlainObject(data),
    `Locale source ${path.relative(siteRoot, filePath)} must be a top-level mapping`,
  );

  return { filePath, data };
}

async function loadYamlLocaleTree(options = {}) {
  const { localesRoot, expectedLocales, expectedNamespaces } = await resolveMetadata(options);
  const actualLocales = await listDirectoryNames(localesRoot);
  assert.deepEqual(
    actualLocales,
    expectedLocales,
    `Locale directories in ${path.relative(siteRoot, localesRoot)} must match site locale metadata`,
  );

  const resources = {};

  for (const locale of expectedLocales) {
    const localeDirectory = path.join(localesRoot, locale);
    const sourceEntries = await fs.readdir(localeDirectory, { withFileTypes: true });
    const actualNamespaces = normalizeNames(
      sourceEntries
        .filter((entry) => entry.isFile() && /\.(?:ya?ml)$/u.test(entry.name))
        .map((entry) => entry.name.replace(/\.(?:ya?ml)$/u, '')),
    );

    assert.deepEqual(
      actualNamespaces,
      expectedNamespaces,
      `${locale} YAML namespaces must match site i18n namespaces`,
    );

    resources[locale] = {};
    for (const namespace of expectedNamespaces) {
      const namespaceFile = await readLocaleSourceFile(localeDirectory, namespace);
      resources[locale][namespace] = namespaceFile.data;
    }
  }

  return {
    localesRoot,
    expectedLocales,
    expectedNamespaces,
    resources,
  };
}

async function loadGeneratedLocaleTree(options = {}) {
  const { generatedRoot, expectedLocales, expectedNamespaces } = await resolveMetadata(options);
  const actualLocales = await listDirectoryNames(generatedRoot);
  assert.deepEqual(
    actualLocales,
    expectedLocales,
    `Generated locale directories in ${path.relative(siteRoot, generatedRoot)} must match site locale metadata`,
  );

  const resources = {};

  for (const locale of expectedLocales) {
    const localeDirectory = path.join(generatedRoot, locale);
    const generatedEntries = await fs.readdir(localeDirectory, { withFileTypes: true });
    const actualNamespaces = normalizeNames(
      generatedEntries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
        .map((entry) => entry.name.replace(/\.json$/u, '')),
    );

    assert.deepEqual(
      actualNamespaces,
      expectedNamespaces,
      `${locale} generated namespaces must match site i18n namespaces`,
    );

    resources[locale] = {};
    for (const namespace of expectedNamespaces) {
      const filePath = path.join(localeDirectory, `${namespace}.json`);
      const raw = await fs.readFile(filePath, 'utf8');
      resources[locale][namespace] = JSON.parse(raw);
    }
  }

  return {
    generatedRoot,
    expectedLocales,
    expectedNamespaces,
    resources,
  };
}

function collectParityErrors(sourceResources, generatedResources, expectedLocales, expectedNamespaces) {
  const errors = [];

  for (const locale of expectedLocales) {
    for (const namespace of expectedNamespaces) {
      const sourceJson = formatJson(sourceResources[locale][namespace]);
      const generatedJson = formatJson(generatedResources[locale][namespace]);
      if (sourceJson !== generatedJson) {
        errors.push(`${locale}/${namespace}.json is stale; rerun npm run i18n:generate`);
      }
    }
  }

  return errors;
}

export async function generateI18nResources(options = {}) {
  const { generatedRoot, expectedLocales, expectedNamespaces } = await resolveMetadata(options);
  const { resources } = await loadYamlLocaleTree(options);

  await fs.rm(generatedRoot, { recursive: true, force: true });

  for (const locale of expectedLocales) {
    await fs.mkdir(path.join(generatedRoot, locale), { recursive: true });
    for (const namespace of expectedNamespaces) {
      await fs.writeFile(
        path.join(generatedRoot, locale, `${namespace}.json`),
        formatJson(resources[locale][namespace]),
        'utf8',
      );
    }
  }

  return {
    generatedRoot,
    localeCount: expectedLocales.length,
    namespaceCount: expectedNamespaces.length,
  };
}

export async function verifyGeneratedI18nResources(options = {}) {
  const { expectedLocales, expectedNamespaces } = await resolveMetadata(options);
  const { resources: sourceResources } = await loadYamlLocaleTree(options);
  const { resources: generatedResources } = await loadGeneratedLocaleTree(options);
  const errors = collectParityErrors(sourceResources, generatedResources, expectedLocales, expectedNamespaces);
  assert.equal(errors.length, 0, errors.join('\n'));

  return {
    localeCount: expectedLocales.length,
    namespaceCount: expectedNamespaces.length,
  };
}

function parseCliArgs(argv) {
  const options = {};

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    switch (argument) {
      case '--check':
        options.check = true;
        break;
      case '--locales-root':
        options.localesRoot = argv[index + 1];
        index += 1;
        break;
      case '--generated-root':
        options.generatedRoot = argv[index + 1];
        index += 1;
        break;
      case '--locale-metadata-path':
        options.localeMetadataPath = argv[index + 1];
        index += 1;
        break;
      case '--namespaces-path':
        options.namespacesPath = argv[index + 1];
        index += 1;
        break;
      default:
        throw new Error(`Unknown argument: ${argument}`);
    }
  }

  return options;
}

const cliOptions = parseCliArgs(process.argv.slice(2));

if (cliOptions.check) {
  const result = await verifyGeneratedI18nResources(cliOptions);
  console.log(
    `Verified generated site i18n resources for ${result.localeCount} locales across ${result.namespaceCount} namespaces.`,
  );
} else {
  const result = await generateI18nResources(cliOptions);
  console.log(
    `Generated site i18n resources at ${path.relative(siteRoot, result.generatedRoot)} for ${result.localeCount} locales across ${result.namespaceCount} namespaces.`,
  );
}

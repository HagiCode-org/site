#!/usr/bin/env node
// Registry-neutrality guard.
// Fails when a tracked pnpm-lock.yaml has a tarball outside the public registry, when a tracked
// registry config points elsewhere, or when any tracked file contains a private-mirror URL.
// Dependency free. Copied verbatim into each repository (see the pnpm migration change).
//
// Usage: node scripts/check-registry-neutrality.mjs [--root <dir>] [--deny-host <host>]...
//          [--allow-host <host>]... [--allow-tarball-prefix <url>]...
import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { join, basename, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const PUBLIC_REGISTRY_HOST = 'registry.npmjs.org';
const PUBLIC_TARBALL_PREFIX = `https://${PUBLIC_REGISTRY_HOST}/`;
const MAX_BYTES = 8 * 1024 * 1024;

// Mirror URL shapes. The shapes avoid naming any concrete mirror host.
const MIRROR_SHAPES = [
  { name: 'http URL to a .local host with a port', re: /http:\/\/[A-Za-z0-9._-]+\.local:\d+/ },
  { name: 'proxy repository path', re: /\/repository\/npm-[A-Za-z0-9_-]+/ },
];

const REGISTRY_CONFIG_FILE =
  /(^|\/)(\.npmrc|\.yarnrc(\.yml)?|pnpm-workspace\.yaml|Dockerfile[^/]*|[^/]*\.dockerfile|\.github\/workflows\/[^/]+\.ya?ml)$/;
const REGISTRY_SETTING =
  /(?:^|[\s"'@\w-]:?)(?:registry|registry-url|npmRegistryServer)\s*[=:]\s*["']?(https?:\/\/[^\s"']+)/i;
const BINARY_EXT = /\.(png|jpe?g|gif|webp|avif|ico|icns|svgz|woff2?|ttf|otf|eot|zip|gz|tgz|7z|pdf|mp[34]|mov|wasm|node|exe|dll|so|dylib|bin|asar)$/i;

const hostOf = (url) => {
  try {
    return new URL(url).host.toLowerCase();
  } catch {
    return '';
  }
};

/**
 * @param {{ files: Array<{path: string, text: string}>, denyHosts?: string[], allowHosts?: string[], allowTarballPrefixes?: string[] }} input
 * @returns {Array<{file: string, line: number, rule: string, message: string, snippet: string, pkg?: string}>}
 */
export function checkFiles({ files, denyHosts = [], allowHosts = [], allowTarballPrefixes = [] }) {
  const violations = [];
  const deny = denyHosts.map((h) => h.toLowerCase());
  const allowedHosts = new Set([PUBLIC_REGISTRY_HOST, ...allowHosts.map((h) => h.toLowerCase())]);
  const tarballPrefixes = [PUBLIC_TARBALL_PREFIX, ...allowTarballPrefixes];

  for (const { path, text } of files) {
    const lines = text.split('\n');
    const isLock = basename(path) === 'pnpm-lock.yaml';
    const isRegistryConfig = REGISTRY_CONFIG_FILE.test(path);
    let currentPkg = '';

    lines.forEach((raw, index) => {
      const line = index + 1;
      const snippet = raw.trim().slice(0, 200);
      const add = (rule, message, extra = {}) => violations.push({ file: path, line, rule, message, snippet, ...extra });

      if (isLock) {
        const key = /^ {2}(['"]?)(\S.*?)\1:\s*$/.exec(raw);
        if (key) currentPkg = key[2];
        const tarball = /\btarball:\s*['"]?([^\s,'"}]+)/.exec(raw);
        if (tarball && !tarballPrefixes.some((p) => tarball[1].startsWith(p))) {
          add('lockfile-tarball', `tarball is not on ${PUBLIC_REGISTRY_HOST}: ${tarball[1]}`, { pkg: currentPkg || '(unknown)' });
        }
      }

      if (isRegistryConfig) {
        const setting = REGISTRY_SETTING.exec(raw);
        if (setting && !allowedHosts.has(hostOf(setting[1]))) {
          add('registry-config', `registry setting points at ${setting[1]}`);
        }
      }

      for (const shape of MIRROR_SHAPES) {
        if (shape.re.test(raw)) add('mirror-url', `mirror-shaped URL (${shape.name})`);
      }
      const lower = raw.toLowerCase();
      for (const host of deny) {
        if (host && lower.includes(host)) add('deny-host', `contains denied host ${host}`);
      }
    });
  }
  return violations;
}

export function listTrackedFiles(root) {
  const out = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], {
    cwd: root,
    maxBuffer: 256 * 1024 * 1024,
  }).toString('utf8');
  return out.split('\0').filter(Boolean);
}

export function readTextFiles(root, paths) {
  const files = [];
  for (const path of paths) {
    if (BINARY_EXT.test(path)) continue;
    const full = join(root, path);
    try {
      const st = statSync(full);
      if (!st.isFile() || st.size > MAX_BYTES) continue;
      const buf = readFileSync(full);
      if (buf.includes(0)) continue;
      files.push({ path: path.split('\\').join('/'), text: buf.toString('utf8') });
    } catch {
      // deleted or unreadable path: nothing to scan
    }
  }
  return files;
}

export function parseArgs(argv) {
  const opts = { root: process.cwd(), denyHosts: [], allowHosts: [], allowTarballPrefixes: [] };
  const env = (process.env.REGISTRY_GUARD_DENY_HOSTS || '').split(',').map((s) => s.trim()).filter(Boolean);
  opts.denyHosts.push(...env);
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      i += 1;
      if (argv[i] === undefined) throw new Error(`Missing value for ${arg}`);
      return argv[i];
    };
    if (arg === '--root') opts.root = resolve(next());
    else if (arg === '--deny-host') opts.denyHosts.push(next());
    else if (arg === '--allow-host') opts.allowHosts.push(next());
    else if (arg === '--allow-tarball-prefix') opts.allowTarballPrefixes.push(next());
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return opts;
}

export function run(argv = process.argv.slice(2), io = { log: console.log, error: console.error }) {
  const opts = parseArgs(argv);
  const paths = listTrackedFiles(opts.root);
  const files = readTextFiles(opts.root, paths);
  const violations = checkFiles({ files, ...opts });
  if (violations.length === 0) {
    io.log(`registry-neutrality: ok (${files.length} files scanned)`);
    return 0;
  }
  for (const v of violations) {
    io.error(`${v.file}:${v.line}: [${v.rule}] ${v.message}${v.pkg ? ` (package ${v.pkg})` : ''}\n    ${v.snippet}`);
  }
  io.error(`registry-neutrality: ${violations.length} violation(s)`);
  return 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    process.exitCode = run();
  } catch (error) {
    console.error(`registry-neutrality: ${error.message}`);
    process.exitCode = 2;
  }
}

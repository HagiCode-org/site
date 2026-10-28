import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { checkFiles, run } from './check-registry-neutrality.mjs';

// Fixtures build mirror-shaped strings at run time so this file stays clean under its own check.
const mirrorHost = ['mirror', 'local'].join('.');
const mirrorUrl = `http://${mirrorHost}:${30451}/${['repository', 'npm-proxy'].join('/')}/`;
const npmjs = 'https://registry.npmjs.org/';

const lock = (resolutions) =>
  ['lockfileVersion: 9.0', '', 'packages:', '', ...resolutions].join('\n');

const lockWith = (tarball) =>
  lock(['  left-pad@1.3.0:', `    resolution: {integrity: sha512-abc, tarball: ${tarball}}`, '']);

const check = (path, text, extra = {}) => checkFiles({ files: [{ path, text }], ...extra });

test('lockfile with a mirror tarball fails and names file, package and URL', () => {
  const found = check('pnpm-lock.yaml', lockWith(`${mirrorUrl}left-pad/-/left-pad-1.3.0.tgz`));
  const tarball = found.find((v) => v.rule === 'lockfile-tarball');
  assert.ok(tarball);
  assert.equal(tarball.file, 'pnpm-lock.yaml');
  assert.equal(tarball.pkg, 'left-pad@1.3.0');
  assert.match(tarball.message, new RegExp(mirrorHost));
});

test('lockfile with only public-registry tarballs passes', () => {
  assert.deepEqual(check('pnpm-lock.yaml', lockWith(`${npmjs}left-pad/-/left-pad-1.3.0.tgz`)), []);
});

test('lockfile without tarball fields passes', () => {
  const text = lock(['  left-pad@1.3.0:', '    resolution: {integrity: sha512-abc}', '']);
  assert.deepEqual(check('pnpm-lock.yaml', text), []);
});

test('quoted scoped package name is reported', () => {
  const text = lock([`  '@scope/pkg@2.0.0':`, `    resolution: {integrity: sha512-x, tarball: ${mirrorUrl}x.tgz}`]);
  assert.equal(check('pnpm-lock.yaml', text).find((v) => v.rule === 'lockfile-tarball').pkg, '@scope/pkg@2.0.0');
});

test('git tarball needs an explicit allowance', () => {
  const text = lockWith('https://codeload.github.com/o/r/tar.gz/abc');
  assert.equal(check('pnpm-lock.yaml', text).length, 1);
  assert.deepEqual(check('pnpm-lock.yaml', text, { allowTarballPrefixes: ['https://codeload.github.com/'] }), []);
});

test('.npmrc with a mirror registry fails with line number', () => {
  const found = check('.npmrc', `strict-peer-dependencies=false\nregistry=${mirrorUrl}\n`);
  const reg = found.find((v) => v.rule === 'registry-config');
  assert.ok(reg);
  assert.equal(reg.line, 2);
});

test('.npmrc scoped registry on another host fails, public host passes', () => {
  assert.ok(check('.npmrc', `@acme:registry=https://npm.example.org/\n`).some((v) => v.rule === 'registry-config'));
  assert.deepEqual(check('.npmrc', `registry=${npmjs}\n`), []);
  assert.deepEqual(check('.npmrc', `@acme:registry=https://npm.example.org/\n`, { allowHosts: ['npm.example.org'] }), []);
});

test('workflow registry-url on the public registry passes', () => {
  assert.deepEqual(check('.github/workflows/ci.yml', `        registry-url: ${npmjs}\n`), []);
});

test('tracked file with a mirror-shaped URL fails', () => {
  const found = check('docs/setup.md', `Install via ${mirrorUrl}\n`);
  assert.ok(found.some((v) => v.rule === 'mirror-url' && v.file === 'docs/setup.md' && v.line === 1));
});

test('localhost development URLs are not mirror-shaped', () => {
  assert.deepEqual(check('README.md', 'open http://localhost:3000 or http://127.0.0.1:8080/repository/\n'), []);
});

test('configured deny host fails', () => {
  assert.ok(check('notes.txt', 'use Corp-Mirror.example\n', { denyHosts: ['corp-mirror.example'] }).length === 1);
});

test('clean tree passes', () => {
  assert.deepEqual(check('README.md', '# Hello\nRun `pnpm install`.\n'), []);
});

test('script source contains no mirror host or shape', () => {
  const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'check-registry-neutrality.mjs'), 'utf8');
  assert.deepEqual(check('scripts/check-registry-neutrality.mjs', source), []);
  assert.doesNotMatch(source, new RegExp(['true', 'nas'].join(''), 'i'));
});

test('run() scans git-tracked files and exits non-zero on a violation', () => {
  const dir = mkdtempSync(join(tmpdir(), 'registry-guard-'));
  try {
    const git = (...args) => execFileSync('git', args, { cwd: dir, stdio: 'ignore' });
    git('init', '-q');
    writeFileSync(join(dir, 'README.md'), '# ok\n');
    mkdirSync(join(dir, 'docs'));
    const logs = [];
    const errors = [];
    const io = { log: (m) => logs.push(m), error: (m) => errors.push(m) };
    assert.equal(run(['--root', dir], io), 0);
    writeFileSync(join(dir, 'docs', 'bad.md'), `registry ${mirrorUrl}\n`);
    assert.equal(run(['--root', dir], io), 1);
    assert.match(errors.join('\n'), /docs\/bad\.md:1/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

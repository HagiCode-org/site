import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const projectRoot = process.cwd();
const astroBin = resolve(projectRoot, 'node_modules/.bin/astro');
let fixtureRoot: string;

async function writeFixture(config: string, files: Record<string, string> = {}) {
  await mkdir(resolve(fixtureRoot, 'src/pages'), { recursive: true });
  await symlink(resolve(projectRoot, 'node_modules'), resolve(fixtureRoot, 'node_modules'), 'dir');
  await writeFile(resolve(fixtureRoot, 'package.json'), '{"type":"module"}\n');
  await writeFile(resolve(fixtureRoot, 'src/pages/index.astro'), '<html><body>fixture</body></html>\n');
  await writeFile(resolve(fixtureRoot, 'astro.config.mjs'), config);
  for (const [filename, contents] of Object.entries(files)) {
    const destination = resolve(fixtureRoot, filename);
    await mkdir(resolve(destination, '..'), { recursive: true });
    await writeFile(destination, contents);
  }
}

function buildFixture() {
  return spawnSync(astroBin, ['build'], {
    cwd: fixtureRoot,
    encoding: 'utf8',
    timeout: 120_000,
  });
}

const config = (options = '{}', site = "'https://rss-fixture.example'", base = "'/'") => `
import { defineConfig } from 'astro/config';
import { hagilight } from '@hagicode/hagilight/integration';
export default defineConfig({ site: ${site}, base: ${base}, integrations: [hagilight(${options})] });
`;

describe('Hagilight RSS configuration diagnostics', () => {
  beforeEach(async () => {
    fixtureRoot = await mkdtemp(resolve(tmpdir(), 'hagilight-rss-fixture-'));
  });

  afterEach(async () => {
    await rm(fixtureRoot, { recursive: true, force: true });
  });

  it('fails with guidance when an RSS-enabled site has no absolute site URL', async () => {
    await writeFixture(config('{}', 'undefined'));
    const result = buildFixture();

    expect(result.status).not.toBe(0);
    expect(`${result.stdout}\n${result.stderr}`).toContain('Set `site` in astro.config.mjs');
  });

  it('fails when a consumer page conflicts with the generated root feed', async () => {
    await writeFixture(config(), {
      'src/pages/rss.xml.ts': 'export const GET = () => new Response("<rss/>");\n',
    });
    const result = buildFixture();

    expect(result.status).not.toBe(0);
    expect(`${result.stdout}\n${result.stderr}`).toMatch(/rss\.xml|RSS route/u);
  });

  it('fails explicitly when an explicit feed callback returns invalid content', async () => {
    await writeFixture(
      config("{ rss: { getFeed: './feed.mjs' } }"),
      { 'feed.mjs': "export default () => ({ title: '', description: '', items: [] });\n" },
    );
    const result = buildFixture();

    expect(result.status).not.toBe(0);
    expect(`${result.stdout}\n${result.stderr}`).toContain('must return a non-empty title');
  });

  it('fails explicitly when the configured feed callback module is missing', async () => {
    await writeFixture(config("{ rss: { getFeed: './missing-feed.mjs' } }"));
    const result = buildFixture();

    expect(result.status).not.toBe(0);
    expect(`${result.stdout}\n${result.stderr}`).toContain('was not found relative to the Astro project root');
  });

  it('builds the default empty feeds under the configured base path without a callback', async () => {
    await writeFixture(config('{}', "'https://rss-fixture.example'", "'/preview/'"));
    const result = buildFixture();

    expect(result.status).toBe(0);
    const xml = await readFile(resolve(fixtureRoot, 'dist/rss.xml'), 'utf8');
    expect(xml).toMatch(/<language>en<\/language>/u);
    expect(xml).toContain('<link>https://rss-fixture.example/preview/</link>');
    expect(xml).not.toMatch(/<item>/u);
  });
});

import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ABOUT_SNAPSHOT_URL,
  loadPreferredAboutSnapshot,
  normalizeAboutSnapshotPayload,
  updateAboutSnapshot,
} from '../lib/about-snapshot-workflow.mjs';

const tempDirs = [];

const fixture = {
  version: '1.0.0',
  updatedAt: '2026-04-20T00:00:00.000Z',
  entries: [
    {
      id: 'youtube',
      type: 'link',
      label: 'YouTube',
      regionPriority: 'international-first',
      url: 'https://www.youtube.com/@hagicode',
    },
    {
      id: 'product-hunt',
      type: 'link',
      label: 'Product Hunt',
      regionPriority: 'international-first',
      url: 'https://www.producthunt.com/products/hagicode',
    },
    {
      id: 'steam',
      type: 'link',
      label: 'Steam',
      regionPriority: 'international-first',
      url: 'https://store.steampowered.com/app/4625540/Hagicode/',
    },
    {
      id: 'bilibili',
      type: 'link',
      label: 'Bilibili',
      regionPriority: 'china-first',
      url: 'https://space.bilibili.com/272265720',
    },
    {
      id: 'xiaohongshu',
      type: 'contact',
      label: '小红书',
      regionPriority: 'china-first',
      value: '11671904293',
      url: 'https://www.xiaohongshu.com/user/profile/demo',
    },
    {
      id: 'douyin-account',
      type: 'contact',
      label: '抖音',
      regionPriority: 'china-first',
      value: 'hagicode',
    },
    {
      id: 'douyin-qr',
      type: 'qr',
      label: '抖音二维码',
      regionPriority: 'china-first',
      description: '扫码查看 Hagicode 抖音账号。',
      imageUrl: '/_astro/douyin.hash.png',
      width: 1061,
      height: 1059,
      alt: 'HagiCode 抖音二维码',
    },
    {
      id: 'qq-group',
      type: 'contact',
      label: 'QQ群',
      regionPriority: 'china-first',
      value: '610394020',
      url: 'https://qm.qq.com/q/ZWPYvrYRYQ',
    },
    {
      id: 'feishu-group',
      type: 'qr',
      label: '飞书群',
      regionPriority: 'china-first',
      imageUrl: '/_astro/feishu.hash.png',
      width: 778,
      height: 724,
      alt: 'HagiCode 飞书群二维码',
      url: 'https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=demo',
    },
    {
      id: 'discord',
      type: 'link',
      label: 'Discord',
      regionPriority: 'international-first',
      url: 'https://discord.gg/demo',
    },
    {
      id: 'wechat-account',
      type: 'qr',
      label: '微信公众号',
      regionPriority: 'china-first',
      imageUrl: '/_astro/wechat.hash.jpg',
      width: 430,
      height: 430,
      alt: 'HagiCode 微信公众号二维码',
    },
  ],
};

async function createTempDir(prefix) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

function createJsonResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(body),
  };
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe('about snapshot workflow', () => {
  it('fetches the canonical endpoint and persists the validated snapshot', async () => {
    const outputDir = await createTempDir('site-about-snapshot-');
    const outputPath = path.join(outputDir, 'about.snapshot.json');
    const fetchMock = vi.fn().mockResolvedValue(createJsonResponse(structuredClone(fixture)));

    const result = await updateAboutSnapshot({
      fetchImpl: fetchMock,
      outputPath,
      localInputPath: path.join(outputDir, 'missing-about.json'),
    });
    const written = JSON.parse(await fs.readFile(outputPath, 'utf8'));

    expect(fetchMock).toHaveBeenCalledWith(ABOUT_SNAPSHOT_URL, {
      headers: {
        accept: 'application/json',
      },
    });
    expect(result.source).toEqual({
      kind: 'url',
      value: ABOUT_SNAPSHOT_URL,
    });
    expect(result.payload.entries).toHaveLength(11);
    expect(written.updatedAt).toBe('2026-04-20T00:00:00.000Z');
    expect(written.entries.find((entry) => entry.id === 'steam')?.url).toBe(
      'https://store.steampowered.com/app/4625540/Hagicode/',
    );
    expect(written.entries.find((entry) => entry.id === 'douyin-qr')?.imageUrl).toBe('/_astro/douyin.hash.png');
    expect(written.entries[0].regionPriority).toBe('international-first');
  });

  it('prefers the local repos/index about payload when it is available', async () => {
    const outputDir = await createTempDir('site-about-snapshot-local-');
    const outputPath = path.join(outputDir, 'about.snapshot.json');
    const localInputPath = path.join(outputDir, 'about.json');
    const fetchMock = vi.fn();

    await fs.writeFile(localInputPath, `${JSON.stringify(structuredClone(fixture), null, 2)}\n`, 'utf8');

    const selected = await loadPreferredAboutSnapshot({
      fetchImpl: fetchMock,
      localInputPath,
    });
    const result = await updateAboutSnapshot({
      fetchImpl: fetchMock,
      outputPath,
      localInputPath,
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(selected.source).toEqual({
      kind: 'file',
      value: localInputPath,
    });
    expect(result.source).toEqual({
      kind: 'file',
      value: localInputPath,
    });
    expect(result.payload.entries.find((entry) => entry.id === 'product-hunt')?.url).toBe(
      'https://www.producthunt.com/products/hagicode',
    );
  });

  it('rejects invalid payloads before writing a new snapshot file', async () => {
    const outputDir = await createTempDir('site-about-snapshot-invalid-');
    const outputPath = path.join(outputDir, 'about.snapshot.json');
    const fetchMock = vi.fn().mockResolvedValue(
      createJsonResponse({
        ...structuredClone(fixture),
        entries: fixture.entries.filter((entry) => entry.id !== 'youtube'),
      }),
    );

    await expect(
      updateAboutSnapshot({
        fetchImpl: fetchMock,
        outputPath,
        localInputPath: path.join(outputDir, 'missing-about.json'),
      }),
    ).rejects.toThrow('missing required entries youtube');
    await expect(fs.readFile(outputPath, 'utf8')).rejects.toThrow();
  });

  it('validates media dimensions and asset paths during normalization', () => {
    const normalized = normalizeAboutSnapshotPayload(structuredClone(fixture));

    expect(normalized.entries[0].id).toBe('youtube');
    expect(normalized.entries.find((entry) => entry.id === 'douyin-qr')?.width).toBe(1061);

    expect(() =>
      normalizeAboutSnapshotPayload({
        ...structuredClone(fixture),
        entries: fixture.entries.map((entry) =>
          entry.id === 'wechat-account'
            ? { ...entry, imageUrl: '/raw/wechat-account.jpg' }
            : entry,
        ),
      }),
    ).toThrow('wechat-account.imageUrl');
  });

  it('rejects payloads missing region priority markers during normalization', () => {
    expect(() =>
      normalizeAboutSnapshotPayload({
        ...structuredClone(fixture),
        entries: fixture.entries.map((entry) =>
          entry.id === 'discord'
            ? { ...entry, regionPriority: undefined }
            : entry,
        ),
      }),
    ).toThrow('discord.regionPriority');
  });
});

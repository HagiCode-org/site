import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { buildAboutPageModel } from '@/lib/about-page-model';
import { normalizeAboutSnapshotData } from '@/lib/about-snapshot-source';
import { AboutSnapshotRuntimeView } from './AboutSnapshotRuntime';

const fetchedSnapshotFixture = normalizeAboutSnapshotData({
  version: '1.0.0',
  updatedAt: '2026-04-04T00:00:00.000Z',
  entries: [
    {
      id: 'youtube',
      type: 'link',
      label: 'YouTube',
      regionPriority: 'international-first',
      url: 'https://www.youtube.com/@hagicode',
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
      url: 'https://www.douyin.com/user/demo',
    },
    {
      id: 'douyin-qr',
      type: 'qr',
      label: '抖音二维码',
      regionPriority: 'china-first',
      imageUrl: '/_astro/douyin.latest.png',
      width: 1061,
      height: 1059,
      alt: 'HagiCode 抖音二维码',
      url: 'https://www.douyin.com/user/demo',
    },
    {
      id: 'qq-group',
      type: 'contact',
      label: 'QQ群',
      regionPriority: 'china-first',
      value: '610394020',
      url: 'https://qm.qq.com/q/demo',
    },
    {
      id: 'feishu-group',
      type: 'qr',
      label: '飞书群',
      regionPriority: 'china-first',
      imageUrl: '/_astro/feishu.latest.png',
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
      imageUrl: '/_astro/wechat.latest.jpg',
      width: 430,
      height: 430,
      alt: 'HagiCode 微信公众号二维码',
    },
  ],
});

describe('AboutSnapshotRuntimeView', () => {
  it('renders English snapshot metadata in the static-first shell', () => {
    const markup = renderToStaticMarkup(
      <AboutSnapshotRuntimeView model={buildAboutPageModel('en')} refreshState="static" />,
    );

    expect(markup).toContain('Bundled snapshot ready');
    expect(markup).toContain('Version');
    expect(markup).toContain('Updated');
    expect(markup).toContain('Grow through exchange');
  });

  it('renders refreshed Chinese media cards with the latest resolved image URLs', () => {
    const refreshedModel = buildAboutPageModel('zh-CN', fetchedSnapshotFixture);
    const markup = renderToStaticMarkup(
      <AboutSnapshotRuntimeView model={refreshedModel} refreshState="synced" />,
    );

    expect(markup).toContain('已同步最新 Index 数据');
    expect(markup).toContain('2026-04-04T00:00:00Z');
    expect(markup).toContain('https://index.hagicode.com/_astro/douyin.latest.png');
    expect(markup).toContain('https://index.hagicode.com/_astro/wechat.latest.jpg');
    expect(markup).toContain('抖音');
    expect(markup).toContain('关注团队持续发布的内容');
  });
});

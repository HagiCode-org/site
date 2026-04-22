import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import FeaturesShowcase from './FeaturesShowcase';

describe('FeaturesShowcase', () => {
  it('keeps the English Hero Dungeon marketing section free of Chinese dungeon copy', () => {
    const markup = renderToStaticMarkup(<FeaturesShowcase locale="en" />);

    expect(markup).toContain('Proposal Dungeon');
    expect(markup).toContain('OpenSpec generate / apply / archive');
    expect(markup).toContain('Current captain roster');
    expect(markup).toContain('Today&#x27;s dungeon report');
    expect(markup).not.toContain('提案副本');
    expect(markup).not.toContain('OpenSpec 生成 / 执行 / 归档');
    expect(markup).not.toContain('当前队长编组');
    expect(markup).not.toContain('今日副本战报');
    expect(markup).not.toContain('多个副本并行推进时，战报会把经验、等级与执行结果聚合展示。');
  });
});

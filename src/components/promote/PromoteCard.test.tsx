import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { PromoteCard } from './PromoteCard';

const activePromotion = {
  id: 'p1',
  title: '立即添加到愿望单',
  description: '中文文案',
  link: 'https://example.invalid/one',
  platform: 'steam',
};

describe('PromoteCard', () => {
  it('renders the full-width bottom shell with dismiss and CTA controls', () => {
    const markup = renderToStaticMarkup(
      <PromoteCard locale="zh-CN" className="test-promote" initialPromotion={activePromotion} />,
    );

    expect(markup).toContain('data-promote-card="true"');
    expect(markup).toContain('立即添加到愿望单');
    expect(markup).toContain('中文文案');
    expect(markup).toContain('promote-card__inner');
    expect(markup).toContain('promote-card__close');
    expect(markup).toContain('promote-card__surface');
    expect(markup).toContain('aria-label="关闭推广信息"');
    expect(markup).toContain('aria-label="打开推广链接: 立即添加到愿望单"');
  });

  it('renders nothing when no active promotion exists', () => {
    const markup = renderToStaticMarkup(<PromoteCard locale="en" initialPromotion={null} />);

    expect(markup).toBe('');
  });
});

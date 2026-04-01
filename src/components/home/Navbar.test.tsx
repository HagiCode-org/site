import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Navbar from './Navbar';

describe('Navbar support link', () => {
  it('renders a single canonical support entry for the English header and mobile menu', () => {
    const markup = renderToStaticMarkup(<Navbar locale="en" />);

    expect(markup).toContain('/about/');
    expect((markup.match(/Get Support/g) ?? [])).toHaveLength(2);
    expect(markup).not.toContain('qm.qq.com');
    expect(markup).not.toContain('discord.gg/qY662sJK');
  });

  it('renders a single canonical support entry for the Chinese header and mobile menu', () => {
    const markup = renderToStaticMarkup(<Navbar locale="zh-CN" />);

    expect(markup).toContain('/zh-CN/about/');
    expect((markup.match(/获取技术支持/g) ?? [])).toHaveLength(2);
    expect(markup).not.toContain('qm.qq.com');
    expect(markup).not.toContain('discord.gg/qY662sJK');
  });
});

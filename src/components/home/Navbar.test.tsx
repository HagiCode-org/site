import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { getHomepageInteractiveCopy } from '@/lib/homepage-runtime-copy';
import Navbar from './Navbar';

describe('Navbar support link', () => {
  it('renders a single canonical support entry for the English header and mobile menu', () => {
    const copy = getHomepageInteractiveCopy('en-US');
    const markup = renderToStaticMarkup(
      <Navbar
        locale="en-US"
        copy={copy.navbar}
        themeToggleCopy={copy.themeToggle}
        languageSwitcherCopy={copy.languageSwitcher}
      />,
    );

    expect(markup).toContain('/about/');
    expect((markup.match(/Get Support/g) ?? [])).toHaveLength(2);
    expect(markup).not.toContain('qm.qq.com');
    expect(markup).not.toContain('discord.gg/qY662sJK');
    expect(markup).toContain('aria-haspopup="dialog"');
    expect(markup).toContain('title="English"');
    expect(markup).toContain('>English<');
    expect(markup).not.toContain('<select');
  });

  it('renders a single canonical support entry for the Chinese header and mobile menu', () => {
    const copy = getHomepageInteractiveCopy('zh-CN');
    const markup = renderToStaticMarkup(
      <Navbar
        locale="zh-CN"
        copy={copy.navbar}
        themeToggleCopy={copy.themeToggle}
        languageSwitcherCopy={copy.languageSwitcher}
      />,
    );

    expect(markup).toContain('/zh-CN/about/');
    expect((markup.match(/获取技术支持/g) ?? [])).toHaveLength(2);
    expect(markup).not.toContain('qm.qq.com');
    expect(markup).not.toContain('discord.gg/qY662sJK');
    expect(markup).toContain('title="简体中文"');
    expect(markup).toContain('>简体中文<');
  });
});

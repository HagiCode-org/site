import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Footer from './Footer';

describe('Footer about link', () => {
  it('renders the English about page in the marketing footer', () => {
    const markup = renderToStaticMarkup(<Footer locale="en" />);

    expect(markup).toContain('/about/');
    expect(markup).toContain('About');
  });

  it('renders the Chinese about page in the marketing footer', () => {
    const markup = renderToStaticMarkup(<Footer locale="zh-CN" />);

    expect(markup).toContain('/zh-CN/about/');
    expect(markup).toContain('关于');
  });
});

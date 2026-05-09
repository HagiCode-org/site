import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { getHeroWorkflowBoardCopy } from '@/lib/homepage-runtime-copy';
import HeroWorkflowBoard from './HeroWorkflowBoard';

describe('HeroWorkflowBoard localization', () => {
  it('resolves non-English workflow board copy from generated i18n resources', () => {
    const copy = getHeroWorkflowBoardCopy('de-DE');

    expect(copy.titleLines[0]).toBe('Mainstream-Agenten unterstützt');
    expect(copy.titleLines).not.toContain('Mainstream Agents Supported');
  });

  it('renders localized title lines for non-English locales', () => {
    const html = renderToStaticMarkup(
      <HeroWorkflowBoard locale="de-DE" copy={getHeroWorkflowBoardCopy('de-DE')} />,
    );

    expect(html).toContain('Mainstream-Agenten unterstützt');
    expect(html).not.toContain('Mainstream Agents Supported');
  });

  it('renders deterministic SSR markup for the initial board snapshot', () => {
    const copy = getHeroWorkflowBoardCopy('en-US');
    const firstHtml = renderToStaticMarkup(<HeroWorkflowBoard locale="en-US" copy={copy} />);
    const secondHtml = renderToStaticMarkup(<HeroWorkflowBoard locale="en-US" copy={copy} />);

    expect(firstHtml).toBe(secondHtml);
  });
});

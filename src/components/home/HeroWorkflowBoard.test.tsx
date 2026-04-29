import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import HeroWorkflowBoard, { getHeroWorkflowBoardCopy } from './HeroWorkflowBoard';

describe('HeroWorkflowBoard localization', () => {
  it('resolves non-English workflow board copy from generated i18n resources', () => {
    const copy = getHeroWorkflowBoardCopy('de-DE');

    expect(copy.titleLines[0]).toBe('Mainstream-Agenten unterstützt');
    expect(copy.titleLines).not.toContain('Mainstream Agents Supported');
  });

  it('renders localized title lines for non-English locales', () => {
    const html = renderToStaticMarkup(<HeroWorkflowBoard locale="de-DE" />);

    expect(html).toContain('Mainstream-Agenten unterstützt');
    expect(html).not.toContain('Mainstream Agents Supported');
  });
});

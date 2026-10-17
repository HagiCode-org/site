import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { getHeroWorkflowBoardCopy } from '@/lib/homepage-runtime-copy';
import HeroWorkflowBoard from './HeroWorkflowBoard';

const render = (locale: 'en-US' | 'de-DE' | 'zh-CN') =>
  renderToStaticMarkup(<HeroWorkflowBoard locale={locale} copy={getHeroWorkflowBoardCopy(locale)} />);

describe('HeroWorkflowBoard', () => {
  it('resolves non-English board copy from generated i18n resources', () => {
    const copy = getHeroWorkflowBoardCopy('de-DE');

    expect(copy.title).toBe('Viele Agenten, jede Phase, dauerhaft in Bewegung');
    expect(copy.title).not.toBe(getHeroWorkflowBoardCopy('en-US').title);
    expect(copy.tasks).toHaveLength(4);
    expect(copy.steps).toHaveLength(4);
    expect(copy.activeStates).toHaveLength(4);
  });

  it('renders the localized title and description', () => {
    const html = render('de-DE');

    expect(html).toContain('Viele Agenten, jede Phase, dauerhaft in Bewegung');
    expect(html).not.toContain('Many agents, every stage, always running');
  });

  it('shows several agents, all four stages and every task on one board', () => {
    const html = render('en-US');

    for (const agent of ['Claude Code', 'Codex', 'GitHub Copilot', 'OpenCode', 'Hermes']) {
      expect(html).toContain(agent);
    }
    for (const stage of ['Ideate', 'Propose', 'Execute', 'Archive']) {
      expect(html).toContain(stage);
    }
    for (const task of ['New CRUD Module', 'Comprehensive Code Review', 'API Documentation', 'Test Case Pack']) {
      expect(html).toContain(task);
    }
    expect(html.match(/data-stage="3"/g)?.length).toBeGreaterThanOrEqual(5);
  });

  it('describes the diagram once for assistive technology and fills every placeholder', () => {
    const html = render('en-US');
    const label = /role="img" aria-label="([^"]*)"/.exec(html)?.[1] ?? '';

    expect(label).toContain('Claude Code');
    expect(label).toContain('Hermes');
    expect(label).toContain('Ideate');
    expect(label).toContain('Archive');
    expect(label).not.toMatch(/[{}]/);
  });

  it('labels the animation as illustrative and does not claim a speed-up', () => {
    const html = render('en-US');

    expect(html).toContain('Illustrative run');
    expect(html).not.toMatch(/\d+(\.\d+)?x\b/i);
    expect(html).not.toMatch(/efficiency/i);
  });

  it('offers a pause control without any per-frame state', () => {
    const html = render('en-US');

    expect(html).toContain('aria-label="Pause animation"');
    expect(html).not.toContain('data-paused');
  });

  it('renders deterministic SSR markup', () => {
    expect(render('en-US')).toBe(render('en-US'));
    expect(render('zh-CN')).toBe(render('zh-CN'));
  });
});

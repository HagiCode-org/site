import { describe, expect, it } from 'vitest';

import { SUPPORTED_SITE_LOCALES } from '@/i18n/locale-metadata';
import { getHomepageShowcaseCopy, getHomepageWorkflowStepsCopy } from './homepage-section-copy';

describe('homepage showcase copy', () => {
  it('reads localized screenshot copy from the common namespace', () => {
    const englishCopy = getHomepageShowcaseCopy('en-US');
    const chineseCopy = getHomepageShowcaseCopy('zh-CN');

    expect(englishCopy.title).toBe('See HagiCode at work');
    expect(chineseCopy.title).toBe('看看 HagiCode 如何工作');
    expect(chineseCopy.controls.current).toBe('当前主图');
    expect(englishCopy.screenshots[0]?.title).toBe('Session board');
    expect(chineseCopy.screenshots[0]?.title).toBe('会话看板');
    expect(chineseCopy.screenshots[0]?.alt).toContain('HagiCode 会话看板');
  });

  it('lists ten feature areas with real copy in every locale', () => {
    for (const locale of SUPPORTED_SITE_LOCALES) {
      const { screenshots } = getHomepageShowcaseCopy(locale);

      expect(screenshots.map((screenshot) => screenshot.id), locale).toEqual([
        'sessionBoard',
        'proposalWorkflow',
        'agentRoster',
        'agentCli',
        'skillsGallery',
        'vault',
        'tokenUsage',
        'achievements',
        'gitManagement',
        'scheduledPlans',
      ]);
      for (const screenshot of screenshots) {
        for (const field of ['title', 'description', 'alt'] as const) {
          expect(screenshot[field], `${locale}:${screenshot.id}.${field}`).toBeTruthy();
          expect(screenshot[field], `${locale}:${screenshot.id}.${field}`).not.toMatch(/^showcase\./);
        }
      }
    }
  });
});

describe('homepage workflow steps copy', () => {
  it('has three ordered steps with real copy in every locale', () => {
    for (const locale of SUPPORTED_SITE_LOCALES) {
      const copy = getHomepageWorkflowStepsCopy(locale);

      expect(copy.title, locale).not.toBe('workflowSteps.title');
      expect(copy.loopLabel, locale).toBeTruthy();
      expect(copy.loopLabel, locale).not.toBe('workflowSteps.loopLabel');
      expect(copy.steps.map((step) => step.key), locale).toEqual(['proposal', 'execution', 'archive']);
      for (const step of copy.steps) {
        expect(step.label, `${locale}:${step.key}`).toBeTruthy();
        expect(step.description, `${locale}:${step.key}`).not.toMatch(/^workflowSteps\./);
      }
    }
  });
});

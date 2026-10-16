import { describe, expect, it } from 'vitest';

import { SUPPORTED_SITE_LOCALES } from '@/i18n/locale-metadata';
import { getHomepageShowcaseCopy, getHomepageWorkflowStepsCopy } from './homepage-section-copy';

describe('homepage showcase copy', () => {
  it('reads localized screenshot copy from the common namespace', () => {
    const englishCopy = getHomepageShowcaseCopy('en-US');
    const chineseCopy = getHomepageShowcaseCopy('zh-CN');

    expect(englishCopy.title).toBe('Latest Product Views');
    expect(chineseCopy.title).toBe('最新产品界面');
    expect(chineseCopy.controls.current).toBe('当前主图');
    expect(chineseCopy.screenshots[0]?.title).toBe('提案执行总览');
    expect(chineseCopy.screenshots[0]?.description).toContain('OpenSpec 提案');
    expect(chineseCopy.screenshots[0]?.alt).toContain('HagiCode 提案执行完成界面截图');
  });
});

describe('homepage workflow steps copy', () => {
  it('has three ordered steps with real copy in every locale', () => {
    for (const locale of SUPPORTED_SITE_LOCALES) {
      const copy = getHomepageWorkflowStepsCopy(locale);

      expect(copy.title, locale).not.toBe('workflowSteps.title');
      expect(copy.steps.map((step) => step.key), locale).toEqual(['proposal', 'execution', 'archive']);
      for (const step of copy.steps) {
        expect(step.label, `${locale}:${step.key}`).toBeTruthy();
        expect(step.description, `${locale}:${step.key}`).not.toMatch(/^workflowSteps\./);
      }
    }
  });
});

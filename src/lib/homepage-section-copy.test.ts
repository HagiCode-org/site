import { describe, expect, it } from 'vitest';

import { getHomepageShowcaseCopy } from './homepage-section-copy';

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

import { describe, expect, it } from 'vitest';

import { getTranslation } from './ui';

describe('site i18n translation lookup', () => {
  it('resolves numeric path segments inside YAML arrays', () => {
    const { t } = getTranslation('en-US');

    expect(t('features.convenient.agentMatrix.supportedNames.names.1')).toBe('Codex');
    expect(t('features.convenient.agentMatrix.agents.claude.instances.1')).toBe('Check design');
  });

  it('falls back to the key when an array index does not exist', () => {
    const { t } = getTranslation('en-US');

    expect(t('features.convenient.agentMatrix.supportedNames.names.99')).toBe(
      'features.convenient.agentMatrix.supportedNames.names.99',
    );
  });

  it('uses localized Hero Dungeon subtitles outside the base locale', () => {
    const englishSubtitle = 'Hero Dungeon makes campus collaboration and practice feel alive';

    expect(getTranslation('zh-CN').t('features.interesting.subtitle')).toBe(
      'Hero Dungeon 让高校协作和训练更有趣',
    );
    expect(getTranslation('zh-Hant').t('features.interesting.subtitle')).toBe(
      'Hero Dungeon 讓校園協作與實作訓練更有生命力',
    );
    expect(getTranslation('ja-JP').t('features.interesting.subtitle')).not.toBe(englishSubtitle);
    expect(getTranslation('ko-KR').t('features.interesting.subtitle')).not.toBe(englishSubtitle);
    expect(getTranslation('de-DE').t('features.interesting.subtitle')).not.toBe(englishSubtitle);
    expect(getTranslation('fr-FR').t('features.interesting.subtitle')).not.toBe(englishSubtitle);
    expect(getTranslation('es-ES').t('features.interesting.subtitle')).not.toBe(englishSubtitle);
    expect(getTranslation('pt-BR').t('features.interesting.subtitle')).not.toBe(englishSubtitle);
    expect(getTranslation('ru-RU').t('features.interesting.subtitle')).not.toBe(englishSubtitle);
  });

  it('localizes pricing row labels outside the base locale', () => {
    const englishLabel = 'All free features included';

    expect(getTranslation('zh-CN').t('pricing.title')).toBe('版本与定价');
    expect(getTranslation('zh-CN').t('pricing.rows.allFreeFeaturesIncluded')).toBe('全部免费特性已包含');
    expect(getTranslation('zh-Hant').t('pricing.rows.allFreeFeaturesIncluded')).toBe('已包含全部免費功能');
    expect(getTranslation('ja-JP').t('pricing.rows.allFreeFeaturesIncluded')).not.toBe(englishLabel);
    expect(getTranslation('ko-KR').t('pricing.rows.allFreeFeaturesIncluded')).not.toBe(englishLabel);
    expect(getTranslation('de-DE').t('pricing.rows.allFreeFeaturesIncluded')).not.toBe(englishLabel);
    expect(getTranslation('fr-FR').t('pricing.rows.allFreeFeaturesIncluded')).not.toBe(englishLabel);
    expect(getTranslation('es-ES').t('pricing.rows.allFreeFeaturesIncluded')).not.toBe(englishLabel);
    expect(getTranslation('pt-BR').t('pricing.rows.allFreeFeaturesIncluded')).not.toBe(englishLabel);
    expect(getTranslation('ru-RU').t('pricing.rows.allFreeFeaturesIncluded')).not.toBe(englishLabel);
    expect(getTranslation('de-DE').t('pricing.rows.maximumConcurrentProposals')).toBe(
      'Maximale gleichzeitige Vorschläge',
    );
    expect(getTranslation('fr-FR').t('pricing.values.viewOnSteam')).toBe('Voir sur Steam');
  });

  it('localizes workflow board title lines outside the base locale', () => {
    const englishTitleLine = 'Mainstream Agents Supported';

    expect(getTranslation('zh-CN').t('workflowBoard.titleLines.0')).toBe('主流 Agent 全面支持');
    expect(getTranslation('zh-Hant').t('workflowBoard.titleLines.0')).toBe('主流 Agent 全面支援');
    expect(getTranslation('ja-JP').t('workflowBoard.titleLines.0')).not.toBe(englishTitleLine);
    expect(getTranslation('ko-KR').t('workflowBoard.titleLines.0')).not.toBe(englishTitleLine);
    expect(getTranslation('de-DE').t('workflowBoard.titleLines.0')).not.toBe(englishTitleLine);
    expect(getTranslation('fr-FR').t('workflowBoard.titleLines.0')).not.toBe(englishTitleLine);
    expect(getTranslation('es-ES').t('workflowBoard.titleLines.0')).not.toBe(englishTitleLine);
    expect(getTranslation('pt-BR').t('workflowBoard.titleLines.0')).not.toBe(englishTitleLine);
    expect(getTranslation('ru-RU').t('workflowBoard.titleLines.0')).not.toBe(englishTitleLine);
  });
});

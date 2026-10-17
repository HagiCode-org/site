import { describe, expect, it } from 'vitest';

import { getPageTranslationResources, getServerTranslationResources } from './translation-resources';
import { getTranslation } from './ui';

describe('site i18n translation lookup', () => {
  const serverResources = getServerTranslationResources();

  it('resolves numeric path segments inside YAML arrays', () => {
    const { t } = getTranslation('en-US', { resources: serverResources });

    expect(t('features.interesting.worlds.items.fantasyAdventure.name')).toBe('Fantasy Adventure');
    expect(t('features.convenient.agentMatrix.agents.claude.instances.1')).toBe('Check design');
  });

  it('falls back to the key when an array index does not exist', () => {
    const { t } = getTranslation('en-US', { resources: serverResources });

    expect(t('features.convenient.agentMatrix.agents.claude.instances.99')).toBe(
      'features.convenient.agentMatrix.agents.claude.instances.99',
    );
  });

  it('uses localized Fun card subtitles outside the base locale', () => {
    const englishSubtitle = 'Every agent gets a face, a personality and a world to live in';

    expect(getTranslation('zh-CN', { resources: serverResources }).t('features.interesting.subtitle')).toBe(
      '每个 Agent 都有脸、有性格，还有一个属于它的世界',
    );
    expect(getTranslation('zh-Hant', { resources: serverResources }).t('features.interesting.subtitle')).toBe(
      '每個 Agent 都有臉、有個性，還有一個屬於它的世界',
    );
    for (const locale of ['ja-JP', 'ko-KR', 'de-DE', 'fr-FR', 'es-ES', 'pt-BR', 'ru-RU']) {
      expect(getTranslation(locale, { resources: serverResources }).t('features.interesting.subtitle')).not.toBe(englishSubtitle);
    }
  });

  it('localizes pricing row labels outside the base locale', () => {
    const englishLabel = 'All free features included';

    expect(getTranslation('zh-CN', { resources: serverResources }).t('pricing.title')).toBe('版本与定价');
    expect(getTranslation('zh-CN', { resources: serverResources }).t('pricing.rows.allFreeFeaturesIncluded')).toBe('全部免费特性');
    expect(getTranslation('zh-Hant', { resources: serverResources }).t('pricing.rows.allFreeFeaturesIncluded')).toBe('包含所有免費功能');
    expect(getTranslation('ja-JP', { resources: serverResources }).t('pricing.rows.allFreeFeaturesIncluded')).not.toBe(englishLabel);
    expect(getTranslation('ko-KR', { resources: serverResources }).t('pricing.rows.allFreeFeaturesIncluded')).not.toBe(englishLabel);
    expect(getTranslation('de-DE', { resources: serverResources }).t('pricing.rows.allFreeFeaturesIncluded')).not.toBe(englishLabel);
    expect(getTranslation('fr-FR', { resources: serverResources }).t('pricing.rows.allFreeFeaturesIncluded')).not.toBe(englishLabel);
    expect(getTranslation('es-ES', { resources: serverResources }).t('pricing.rows.allFreeFeaturesIncluded')).not.toBe(englishLabel);
    expect(getTranslation('pt-BR', { resources: serverResources }).t('pricing.rows.allFreeFeaturesIncluded')).not.toBe(englishLabel);
    expect(getTranslation('ru-RU', { resources: serverResources }).t('pricing.rows.allFreeFeaturesIncluded')).not.toBe(englishLabel);
    expect(getTranslation('de-DE', { resources: serverResources }).t('pricing.rows.maximumConcurrentProposals')).toBe(
      'Maximale Anzahl gleichzeitiger Vorschläge',
    );
    expect(getTranslation('fr-FR', { resources: serverResources }).t('pricing.rows.documentThemes')).toBe('Thèmes de documents');
  });

  it('localizes the workflow board title outside the base locale', () => {
    const englishTitle = 'Many agents, every stage, always running';

    expect(getTranslation('zh-CN', { resources: serverResources }).t('workflowBoard.title')).toBe('多个 Agent，每个阶段，持续运行');
    expect(getTranslation('zh-Hant', { resources: serverResources }).t('workflowBoard.title')).toBe('多個 Agent，每個階段，持續運行');
    expect(getTranslation('ja-JP', { resources: serverResources }).t('workflowBoard.title')).not.toBe(englishTitle);
    expect(getTranslation('ko-KR', { resources: serverResources }).t('workflowBoard.title')).not.toBe(englishTitle);
    expect(getTranslation('de-DE', { resources: serverResources }).t('workflowBoard.title')).not.toBe(englishTitle);
    expect(getTranslation('fr-FR', { resources: serverResources }).t('workflowBoard.title')).not.toBe(englishTitle);
    expect(getTranslation('es-ES', { resources: serverResources }).t('workflowBoard.title')).not.toBe(englishTitle);
    expect(getTranslation('pt-BR', { resources: serverResources }).t('workflowBoard.title')).not.toBe(englishTitle);
    expect(getTranslation('ru-RU', { resources: serverResources }).t('workflowBoard.title')).not.toBe(englishTitle);
  });

  it('supports page-scoped resource subsets with locale fallback intact', () => {
    const homeOnlyResources = getPageTranslationResources('zh-Hant', ['home']);
    const { t } = getTranslation('zh-Hant', { resources: homeOnlyResources });

    expect(t('workflowBoard.title')).toBe('多個 Agent，每個階段，持續運行');
    expect(t('navbar.home')).toBe('navbar.home');
  });
});

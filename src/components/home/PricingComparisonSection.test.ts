import { describe, expect, it } from 'vitest';

import { getPricingContent } from '@/lib/homepage-section-copy';

describe('PricingComparisonSection content', () => {
  it('uses localized pricing section and table copy for non-English locales', () => {
    const content = getPricingContent('de-DE');
    const rowLabels = content.rows.map((row) => row.feature);

    expect(content.title).toBe('Editionen und Preise');
    expect(content.featureHeader).toBe('Artikel');
    expect(content.includedLabel).toBe('Enthalten');
    expect(content.notIncludedLabel).toBe('Nicht enthalten');
    expect(rowLabels).toContain('Alle kostenlosen Funktionen inklusive');
    expect(rowLabels).toContain('Maximale Anzahl gleichzeitiger Vorschläge');
    expect(rowLabels).toContain('Dokumentthemen');
    expect(rowLabels).not.toContain('Preis');
    expect(content.microsoftStoreEdition.title).toBe('Microsoft Store');
    expect(content.rows.find((candidate) => candidate.feature === 'Maximale Anzahl gleichzeitiger Vorschläge')?.microsoftStore.value).toBe('32');
    expect(rowLabels).not.toContain('All free features included');
    expect(rowLabels).not.toContain('Maximum concurrent proposals');
    expect(rowLabels).not.toContain('Hagicode Plus');
  });

  it('keeps the base locale pricing row label in English', () => {
    const content = getPricingContent('en-US');
    const row = content.rows.find((candidate) => candidate.feature === 'All free features included');
    const entryPointRow = content.rows.find((candidate) => candidate.feature === 'Entry point');

    expect(content.title).toBe('Editions & Pricing');
    expect(content.microsoftStoreEdition.title).toBe('Microsoft Store');
    expect(entryPointRow?.microsoftStore.value).toBe('Microsoft Store install');
    expect(entryPointRow?.desktop.href).toBe(content.desktopEdition.action?.href);
    expect(entryPointRow?.container.href).toBe(content.containerEdition.action?.href);
    expect(entryPointRow?.microsoftStore.href).toBe(content.microsoftStoreEdition.action?.href);
    expect(entryPointRow?.microsoftStore.external).toBe(true);
    expect(row).toBeDefined();
  });
});

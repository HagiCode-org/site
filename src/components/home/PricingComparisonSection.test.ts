import { describe, expect, it } from 'vitest';

import { getPricingContent } from '@/lib/homepage-section-copy';

describe('PricingComparisonSection content', () => {
  it('uses localized pricing section and table copy for non-English locales', () => {
    const content = getPricingContent('de-DE');
    const rowLabels = content.rows.map((row) => row.feature);

    expect(content.title).toBe('Editionen und Preise');
    expect(content.featureHeader).toBe('Funktion');
    expect(content.includedLabel).toBe('Enthalten');
    expect(content.notIncludedLabel).toBe('Nicht enthalten');
    expect(rowLabels).toContain('Alle kostenlosen Funktionen enthalten');
    expect(rowLabels).toContain('Maximale gleichzeitige Vorschläge');
    expect(rowLabels).toContain('Cloud-Speicher-Unterstützung');
    expect(content.rows[0]?.desktop.value).toBe('Kostenlos');
    expect(content.rows[0]?.steam.value).toBe('Pending');
    expect(content.steamEdition.title).toBe('Steam (Pending)');
    expect(content.turboEdition.title).toBe('Hagicode Plus (Pending)');
    expect(content.plusDescription).toBe('Pending');
    expect(content.steamPreviewLabels.bundlePending).toBe('Bundle-Bilder ausstehend');
    expect(content.dlcItems).toHaveLength(0);
    expect(rowLabels).not.toContain('All free features included');
    expect(rowLabels).not.toContain('Maximum concurrent proposals');
    expect(rowLabels).not.toContain('Cloud save support');
  });

  it('keeps the base locale pricing row label in English', () => {
    const content = getPricingContent('en-US');
    const row = content.rows.find((candidate) => candidate.feature === 'All free features included');

    expect(content.title).toBe('Editions & Pricing');
    expect(content.steamEdition.title).toBe('Steam (Pending)');
    expect(content.turboEdition.title).toBe('Hagicode Plus (Pending)');
    expect(content.dlcItems).toHaveLength(0);
    expect(row).toBeDefined();
  });
});

import { describe, expect, it } from 'vitest';

import { getPricingContent } from './PricingComparisonSection';

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
    expect(content.rows[0]?.steam.value).toBe('Auf Steam ansehen');
    expect(content.dlcLabel).toBe('DLCs und Bundles');
    expect(content.dlcTitle).toBe('Optionale Pakete');
    expect(content.steamPreviewLabels.bundlePending).toBe('Bundle-Bilder ausstehend');
    expect(content.dlcItems[0]?.category).toBe('Kostenloser DLC');
    expect(content.dlcItems[0]?.price).toBe('Kostenlos');
    expect(content.dlcItems[0]?.action.label).toBe('Steam öffnen');
    expect(content.dlcItems[1]?.category).toBe('Performance-DLC');
    expect(content.dlcItems[1]?.bullets).toContain('Erweitert das maximale Limit paralleler Vorschläge auf 32');
    expect(content.dlcItems[3]?.category).toBe('Unterstützer-DLC');
    expect(rowLabels).not.toContain('All free features included');
    expect(rowLabels).not.toContain('Maximum concurrent proposals');
    expect(rowLabels).not.toContain('Cloud save support');
    expect(content.dlcLabel).not.toBe('DLC & Bundles');
    expect(content.dlcTitle).not.toBe('Optional packs');
  });

  it('keeps the base locale pricing row label in English', () => {
    const content = getPricingContent('en-US');
    const row = content.rows.find((candidate) => candidate.feature === 'All free features included');

    expect(content.title).toBe('Editions & Pricing');
    expect(content.dlcLabel).toBe('DLC & Bundles');
    expect(row).toBeDefined();
  });
});

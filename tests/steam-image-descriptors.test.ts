import { describe, expect, it } from 'vitest';
import { steamProductImageRecords } from '../src/data/steamImageDescriptors';

describe('site Steam image descriptor snapshot', () => {
  it('keeps static generation-safe records for Steam app, DLC, and bundle products', () => {
    expect(Object.keys(steamProductImageRecords).sort()).toEqual([
      'hagicode',
      'hagicode-plus',
      'turbo-engine',
    ]);

    for (const record of Object.values(steamProductImageRecords)) {
      expect(record.displayName).toBeTruthy();
      expect(record.storeUrl).toMatch(/^https:\/\/store\.steampowered\.com\//);
      expect(Array.isArray(record.images)).toBe(true);
      expect(record.images.length).toBeGreaterThan(0);

      for (const image of record.images) {
        expect(image.src).toMatch(/^https:\/\/index\.hagicode\.com\//);
        expect(image.variant).toBeTruthy();
        expect(image.alt).toBeTruthy();
        expect(image.width).toBeGreaterThan(0);
        expect(image.height).toBeGreaterThan(0);
      }
    }
  });
});

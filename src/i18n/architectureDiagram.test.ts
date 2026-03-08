import { describe, expect, it } from 'vitest';
import zhCN from './zh-CN.json';
import en from './en.json';

const emojiPattern = /[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/u;

type LocaleData = typeof zhCN;

function getDiagramData(data: LocaleData) {
  const architecture = data.architectureDiagram as { diagram?: any };
  return architecture.diagram;
}

describe('architectureDiagram i18n structure', () => {
  it('keeps aligned four-layer structure in zh-CN and en', () => {
    const locales = [zhCN, en];

    for (const locale of locales) {
      const diagram = getDiagramData(locale);
      expect(Array.isArray(diagram.layers)).toBe(true);
      expect(diagram.layers).toHaveLength(4);

      for (const layer of diagram.layers) {
        expect(typeof layer.name).toBe('string');
        expect(typeof layer.coreValue).toBe('string');
        expect(Array.isArray(layer.supportItems)).toBe(true);
        expect(layer.supportItems.length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it('uses icon keys instead of emoji for execution and model entities', () => {
    const locales = [zhCN, en];

    for (const locale of locales) {
      const diagram = getDiagramData(locale);
      const criticalLayers = diagram.layers.filter((layer: any) => ['execution', 'models'].includes(layer.id));

      for (const layer of criticalLayers) {
        expect(Array.isArray(layer.entities)).toBe(true);

        for (const entity of layer.entities) {
          expect(typeof entity.iconKey).toBe('string');
          expect(emojiPattern.test(entity.iconKey)).toBe(false);
          expect(emojiPattern.test(entity.name)).toBe(false);
        }
      }
    }
  });
});

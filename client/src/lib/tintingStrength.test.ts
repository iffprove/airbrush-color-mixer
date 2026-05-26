import { describe, test, expect } from 'vitest';
import { estimateTintingStrength } from './tintingStrength';
import { allPaints } from './paintDatabase';

describe('tinting strength heuristic', () => {
  test('strong organic pigments rank above earth pigments', () => {
    const phthalo = estimateTintingStrength({ name: 'Phthalo Blue', category: 'transparent', brand: 'createx-wicked' });
    const oxide   = estimateTintingStrength({ name: 'Yellow Oxide', category: 'opaque', brand: 'createx-wicked' });
    expect(phthalo).toBeGreaterThan(oxide);
  });

  test('candies are stronger than transparent base colours', () => {
    const candy = estimateTintingStrength({ name: 'Candy Red', category: 'transparent', brand: 'createx-candy2o' });
    const trans = estimateTintingStrength({ name: 'Red', category: 'transparent', brand: 'createx-wicked' });
    expect(candy).toBeGreaterThan(trans);
  });

  test('white is weaker than carbon black', () => {
    const white = estimateTintingStrength({ name: 'Titanium White', category: 'opaque', brand: 'createx-wicked' });
    const black = estimateTintingStrength({ name: 'Carbon Black', category: 'opaque', brand: 'createx-wicked' });
    expect(black).toBeGreaterThan(white);
  });

  test('metallics rank below standard opaques per unit volume', () => {
    const metallic = estimateTintingStrength({ name: 'Silver', category: 'metallic', brand: 'createx-wicked' });
    expect(metallic).toBeLessThan(1.0);
  });
});

describe('database provenance', () => {
  test('every paint has a tintingStrengthSource', () => {
    for (const p of allPaints) {
      expect(p.tintingStrengthSource).toBeDefined();
    }
  });

  test('estimated paints have plausible tinting strength range', () => {
    for (const p of allPaints) {
      if (p.tintingStrengthSource === 'estimated') {
        expect(p.tintingStrength).toBeGreaterThan(0.2);
        expect(p.tintingStrength).toBeLessThan(5.0);
      }
    }
  });
});

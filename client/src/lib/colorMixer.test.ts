import { describe, test, expect } from 'vitest';
import { mixPaintsSpectral, mixPaintsLegacy } from './colorMixer';
import type { Paint } from './paintDatabase';

const make = (rgb: [number, number, number], opacity: number, tintingStrength = 1): Paint =>
  ({ code: 'TEST', name: 'test', brand: 'createx-wicked', category: 'opaque', rgb, opacity, tintingStrength });

describe('spectral mixing', () => {
  test('yellow + blue mixes toward green (canonical subtractive test)', () => {
    const yellow = make([242, 214, 0], 0.4);
    const blue   = make([0, 51, 153], 0.5);
    const [r, g, b] = mixPaintsSpectral([yellow, blue], [0.5, 0.5]);
    expect(g).toBeGreaterThan(r);
    expect(g).toBeGreaterThan(b);
  });

  test('single paint returns its own RGB unchanged', () => {
    const p = make([123, 45, 67], 0.5);
    expect(mixPaintsSpectral([p], [1])).toEqual([123, 45, 67]);
  });

  test('3-paint mix stays in 0–255 gamut', () => {
    const r = make([255, 0, 0], 0.8);
    const g = make([0, 255, 0], 0.8);
    const b = make([0, 0, 255], 0.8);
    const result = mixPaintsSpectral([r, g, b], [1, 1, 1]);
    for (const v of result) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(255);
    }
  });

  test('tinting strength shifts mix toward the stronger pigment', () => {
    const strong = make([255, 0, 0], 0.8, 3);
    const weak   = make([0, 0, 255], 0.8, 1);
    const [r, , b] = mixPaintsSpectral([strong, weak], [0.5, 0.5]);
    expect(r).toBeGreaterThan(b);
  });
});

describe('legacy mixer (documents what fails)', () => {
  test('yellow + blue does NOT reach green in legacy model', () => {
    const yellow = make([242, 214, 0], 0.4);
    const blue   = make([0, 51, 153], 0.5);
    const [r, g] = mixPaintsLegacy([yellow, blue], [0.5, 0.5]);
    expect(g).toBeLessThanOrEqual(r);
  });
});

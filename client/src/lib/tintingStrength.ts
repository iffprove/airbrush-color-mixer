import type { PaintBrand, PaintCategory } from './paintDatabase';

/**
 * Heuristic tinting-strength estimate based on the paint's name and category.
 * Values are informed by general pigment-chemistry knowledge (phthalos and
 * quinacridones are strong tinters; earth pigments and whites are weak;
 * candies are pure dye and dominate any mix).
 *
 * IMPORTANT: These are educated guesses, not measurements. A paint marked
 * 'estimated' may be off by ±50%. Real values come from the spray-out
 * validation loop (future work).
 */
export function estimateTintingStrength(params: {
  name: string;
  category: PaintCategory;
  brand: PaintBrand;
}): number {
  const name = params.name.toLowerCase();
  const cat = params.category;
  const brand = params.brand;

  // Candies — pure dye, no white base, dominate any mix
  if (cat === 'transparent' && (name.includes('candy') || brand === 'createx-candy2o')) {
    return 4.0;
  }

  // Very strong: modern organic pigments
  if (/phthalo|phthalocyanine|quinacridone|dioxazine|hansa|naphthol/.test(name)) {
    return 3.5;
  }

  // Pure blacks
  if (name === 'black' || /\bjet black\b|carbon black|mars black/.test(name)) {
    return 3.0;
  }

  // Strong-medium: classic bright pigments
  if (/cadmium|crimson|magenta|alizarin/.test(name)) return 2.0;
  if (/ultramarine|cobalt|prussian|cerulean/.test(name)) return 1.8;

  // Transparent paints generally — no white diluting the pigment
  if (cat === 'transparent') return 1.5;

  // Earth pigments — traditional weak tinters
  if (/oxide|umber|sienna|ochre|earth|raw |burnt /.test(name)) return 0.7;

  // Whites — counterintuitively weak as tinters
  if (/\bwhite\b|titanium/.test(name)) return 0.4;

  // Effect paints — physical/optical effect dominates over pigment strength
  if (cat === 'metallic' || cat === 'pearl') return 0.6;
  if (cat === 'fluorescent') return 0.8;

  // Default fallback
  return 1.0;
}

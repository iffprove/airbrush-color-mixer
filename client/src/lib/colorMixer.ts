/**
 * Color Mixing Algorithm for Createx Wicked Paints
 * 
 * Uses a weighted subtractive color mixing approach in CIELAB color space
 * for perceptually accurate color matching. The algorithm finds the best
 * combination of 1-4 paints that approximates the target color.
 */

import { Paint, wickedColors } from './paintDatabase';

// ============ Color Space Conversions ============

function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  // RGB to XYZ (sRGB D65)
  let rr = r / 255;
  let gg = g / 255;
  let bb = b / 255;

  rr = rr > 0.04045 ? Math.pow((rr + 0.055) / 1.055, 2.4) : rr / 12.92;
  gg = gg > 0.04045 ? Math.pow((gg + 0.055) / 1.055, 2.4) : gg / 12.92;
  bb = bb > 0.04045 ? Math.pow((bb + 0.055) / 1.055, 2.4) : bb / 12.92;

  let x = (rr * 0.4124564 + gg * 0.3575761 + bb * 0.1804375) / 0.95047;
  let y = (rr * 0.2126729 + gg * 0.7151522 + bb * 0.0721750) / 1.00000;
  let z = (rr * 0.0193339 + gg * 0.1191920 + bb * 0.9503041) / 1.08883;

  x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;

  const L = (116 * y) - 16;
  const a = 500 * (x - y);
  const bVal = 200 * (y - z);

  return [L, a, bVal];
}

function labToRgb(L: number, a: number, b: number): [number, number, number] {
  let y = (L + 16) / 116;
  let x = a / 500 + y;
  let z = y - b / 200;

  const y3 = Math.pow(y, 3);
  const x3 = Math.pow(x, 3);
  const z3 = Math.pow(z, 3);

  y = y3 > 0.008856 ? y3 : (y - 16 / 116) / 7.787;
  x = x3 > 0.008856 ? x3 : (x - 16 / 116) / 7.787;
  z = z3 > 0.008856 ? z3 : (z - 16 / 116) / 7.787;

  x *= 0.95047;
  y *= 1.00000;
  z *= 1.08883;

  let rr = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  let gg = x * -0.9692660 + y * 1.8760108 + z * 0.0415560;
  let bb = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

  rr = rr > 0.0031308 ? 1.055 * Math.pow(rr, 1 / 2.4) - 0.055 : 12.92 * rr;
  gg = gg > 0.0031308 ? 1.055 * Math.pow(gg, 1 / 2.4) - 0.055 : 12.92 * gg;
  bb = bb > 0.0031308 ? 1.055 * Math.pow(bb, 1 / 2.4) - 0.055 : 12.92 * bb;

  return [
    Math.max(0, Math.min(255, Math.round(rr * 255))),
    Math.max(0, Math.min(255, Math.round(gg * 255))),
    Math.max(0, Math.min(255, Math.round(bb * 255))),
  ];
}

// CIEDE2000 color difference (simplified)
function deltaE(lab1: [number, number, number], lab2: [number, number, number]): number {
  const [L1, a1, b1] = lab1;
  const [L2, a2, b2] = lab2;
  const dL = L1 - L2;
  const da = a1 - a2;
  const db = b1 - b2;
  // CIE76 formula (simpler, good enough for our use case)
  return Math.sqrt(dL * dL + da * da + db * db);
}

// ============ Subtractive Mixing ============

/**
 * Mix paints subtractively using weighted average in LAB space.
 * This is a simplified model that works well for opaque/semi-opaque paints.
 */
function mixPaintsLab(paints: Paint[], ratios: number[]): [number, number, number] {
  const total = ratios.reduce((s, r) => s + r, 0);
  if (total === 0) return [0, 0, 0];

  const normalizedRatios = ratios.map(r => r / total);

  // Convert all paints to LAB
  const labs = paints.map(p => rgbToLab(p.rgb[0], p.rgb[1], p.rgb[2]));

  // Weighted average in LAB space (approximation of subtractive mixing)
  let L = 0, a = 0, b = 0;
  for (let i = 0; i < labs.length; i++) {
    // Weight darker colors more heavily (subtractive behavior)
    const darknessWeight = 1 + (1 - labs[i][0] / 100) * 0.3;
    const effectiveRatio = normalizedRatios[i] * darknessWeight;
    L += labs[i][0] * normalizedRatios[i]; // Lightness mixes linearly
    a += labs[i][1] * effectiveRatio;
    b += labs[i][2] * effectiveRatio;
  }

  // Normalize a and b back
  const totalEffective = normalizedRatios.reduce((s, r, i) => {
    const darknessWeight = 1 + (1 - labs[i][0] / 100) * 0.3;
    return s + r * darknessWeight;
  }, 0);
  a /= totalEffective;
  b /= totalEffective;

  return [L, a, b];
}

function mixedColorRgb(paints: Paint[], ratios: number[]): [number, number, number] {
  const lab = mixPaintsLab(paints, ratios);
  return labToRgb(lab[0], lab[1], lab[2]);
}

// ============ Formula Finding ============

export interface MixFormula {
  paints: Paint[];
  ratios: number[]; // parts (e.g., [3, 2, 1] means 3:2:1)
  percentages: number[]; // percentage of each paint
  resultRgb: [number, number, number];
  matchScore: number; // 0-100, higher is better
  deltaE: number; // color difference (lower is better)
}

/**
 * Find the best single paint match
 */
function findBestSingle(targetLab: [number, number, number], availablePaints: Paint[]): MixFormula | null {
  let bestPaint: Paint | null = null;
  let bestDelta = Infinity;

  for (const paint of availablePaints) {
    const paintLab = rgbToLab(paint.rgb[0], paint.rgb[1], paint.rgb[2]);
    const d = deltaE(targetLab, paintLab);
    if (d < bestDelta) {
      bestDelta = d;
      bestPaint = paint;
    }
  }

  if (!bestPaint) return null;

  return {
    paints: [bestPaint],
    ratios: [1],
    percentages: [100],
    resultRgb: bestPaint.rgb,
    matchScore: Math.max(0, 100 - bestDelta * 1.5),
    deltaE: bestDelta,
  };
}

/**
 * Find the best two-paint mix
 */
function findBestPair(targetLab: [number, number, number], availablePaints: Paint[]): MixFormula | null {
  let bestFormula: MixFormula | null = null;
  let bestDelta = Infinity;

  const ratioSteps = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

  for (let i = 0; i < availablePaints.length; i++) {
    for (let j = i + 1; j < availablePaints.length; j++) {
      const p1 = availablePaints[i];
      const p2 = availablePaints[j];

      for (const r of ratioSteps) {
        const mixLab = mixPaintsLab([p1, p2], [r, 1 - r]);
        const d = deltaE(targetLab, mixLab);

        if (d < bestDelta) {
          bestDelta = d;
          const r1 = Math.round(r * 10);
          const r2 = 10 - r1;
          const total = r1 + r2;
          bestFormula = {
            paints: [p1, p2],
            ratios: [r1, r2],
            percentages: [Math.round((r1 / total) * 100), Math.round((r2 / total) * 100)],
            resultRgb: labToRgb(mixLab[0], mixLab[1], mixLab[2]),
            matchScore: Math.max(0, 100 - d * 1.5),
            deltaE: d,
          };
        }
      }
    }
  }

  return bestFormula;
}

/**
 * Find the best three-paint mix
 */
function findBestTriple(targetLab: [number, number, number], availablePaints: Paint[]): MixFormula | null {
  let bestFormula: MixFormula | null = null;
  let bestDelta = Infinity;

  // Pre-filter: only consider paints that are somewhat close to the target
  const candidates = availablePaints
    .map(p => ({
      paint: p,
      delta: deltaE(targetLab, rgbToLab(p.rgb[0], p.rgb[1], p.rgb[2]))
    }))
    .sort((a, b) => a.delta - b.delta)
    .slice(0, 15) // Top 15 closest paints
    .map(c => c.paint);

  const steps = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];

  for (let i = 0; i < candidates.length; i++) {
    for (let j = i + 1; j < candidates.length; j++) {
      for (let k = j + 1; k < candidates.length; k++) {
        const p1 = candidates[i];
        const p2 = candidates[j];
        const p3 = candidates[k];

        for (const r1 of steps) {
          for (const r2 of steps) {
            const r3 = 1 - r1 - r2;
            if (r3 < 0.05 || r3 > 0.9) continue;

            const mixLab = mixPaintsLab([p1, p2, p3], [r1, r2, r3]);
            const d = deltaE(targetLab, mixLab);

            if (d < bestDelta) {
              bestDelta = d;
              const parts1 = Math.round(r1 * 10);
              const parts2 = Math.round(r2 * 10);
              const parts3 = Math.round(r3 * 10);
              const total = parts1 + parts2 + parts3;
              bestFormula = {
                paints: [p1, p2, p3],
                ratios: [parts1, parts2, parts3],
                percentages: [
                  Math.round((parts1 / total) * 100),
                  Math.round((parts2 / total) * 100),
                  Math.round((parts3 / total) * 100),
                ],
                resultRgb: labToRgb(mixLab[0], mixLab[1], mixLab[2]),
                matchScore: Math.max(0, 100 - d * 1.5),
                deltaE: d,
              };
            }
          }
        }
      }
    }
  }

  return bestFormula;
}

// ============ Main API ============

export interface MixResult {
  targetRgb: [number, number, number];
  targetHex: string;
  formulas: MixFormula[];
  bestFormula: MixFormula;
}

/**
 * Main function: Given a target RGB color, find the best mixing formulas
 * using Createx Wicked paints.
 */
export function findMixFormula(
  targetR: number,
  targetG: number,
  targetB: number,
  options?: {
    categories?: Paint['category'][];
    maxPaints?: number;
  }
): MixResult {
  const categories = options?.categories || ['transparent', 'opaque', 'detail'];
  const maxPaints = options?.maxPaints || 3;

  // Filter available paints by category
  const availablePaints = wickedColors.filter(p => categories.includes(p.category));

  const targetLab = rgbToLab(targetR, targetG, targetB);
  const targetHex = '#' + [targetR, targetG, targetB].map(x => x.toString(16).padStart(2, '0')).join('');

  const formulas: MixFormula[] = [];

  // Find best single paint
  const single = findBestSingle(targetLab, availablePaints);
  if (single) formulas.push(single);

  // Find best pair
  if (maxPaints >= 2) {
    const pair = findBestPair(targetLab, availablePaints);
    if (pair) formulas.push(pair);
  }

  // Find best triple
  if (maxPaints >= 3) {
    const triple = findBestTriple(targetLab, availablePaints);
    if (triple) formulas.push(triple);
  }

  // Sort by match score (best first)
  formulas.sort((a, b) => b.matchScore - a.matchScore);

  return {
    targetRgb: [targetR, targetG, targetB],
    targetHex,
    formulas,
    bestFormula: formulas[0] || {
      paints: [],
      ratios: [],
      percentages: [],
      resultRgb: [0, 0, 0],
      matchScore: 0,
      deltaE: 100,
    },
  };
}

/**
 * Get a human-readable description of the mix formula
 */
export function formulaToString(formula: MixFormula): string {
  if (formula.paints.length === 1) {
    return `Use ${formula.paints[0].code} ${formula.paints[0].name} straight`;
  }
  return formula.paints
    .map((p, i) => `${formula.ratios[i]} parts ${p.code} ${p.name}`)
    .join(' + ');
}

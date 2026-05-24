/**
 * Color Mixing Algorithm — v2
 * 
 * Major improvements over v1:
 * - Dual mixing model: CMY-style (inverted linear RGB) for opaques,
 *   opacity-weighted LAB for transparent/semi-transparent blends
 * - Opacity field is now used: transparent paints contribute less
 *   pigment power per unit volume than opaques
 * - Steeper match score curve — ΔE is shown raw alongside %
 * - Category-aware defaults: washes, primers, inks excluded unless opted in
 * 
 * Supports 9 brands, 400+ paints.
 */

import { Paint, PaintBrand, PaintCategory, allPaints } from './paintDatabase';

// ============ Color Space Conversions ============

function srgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c: number): number {
  const v = Math.max(0, Math.min(1, c));
  return v <= 0.0031308
    ? Math.round(v * 12.92 * 255)
    : Math.round((1.055 * Math.pow(v, 1 / 2.4) - 0.055) * 255);
}

function rgbToLinear(r: number, g: number, b: number): [number, number, number] {
  return [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)];
}

function linearToRgb(lr: number, lg: number, lb: number): [number, number, number] {
  return [linearToSrgb(lr), linearToSrgb(lg), linearToSrgb(lb)];
}

export function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  let rr = srgbToLinear(r);
  let gg = srgbToLinear(g);
  let bb = srgbToLinear(b);

  let x = (rr * 0.4124564 + gg * 0.3575761 + bb * 0.1804375) / 0.95047;
  let y = (rr * 0.2126729 + gg * 0.7151522 + bb * 0.0721750) / 1.00000;
  let z = (rr * 0.0193339 + gg * 0.1191920 + bb * 0.9503041) / 1.08883;

  const f = (t: number) => t > 0.008856 ? Math.pow(t, 1 / 3) : (7.787 * t) + 16 / 116;
  x = f(x);
  y = f(y);
  z = f(z);

  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)];
}

function labToRgb(L: number, a: number, b: number): [number, number, number] {
  let y = (L + 16) / 116;
  let x = a / 500 + y;
  let z = y - b / 200;

  const finv = (t: number) => {
    const t3 = t * t * t;
    return t3 > 0.008856 ? t3 : (t - 16 / 116) / 7.787;
  };
  x = finv(x) * 0.95047;
  y = finv(y) * 1.00000;
  z = finv(z) * 1.08883;

  let rr = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  let gg = x * -0.9692660 + y * 1.8760108 + z * 0.0415560;
  let bb = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

  return [linearToSrgb(rr), linearToSrgb(gg), linearToSrgb(bb)];
}

// ============ Color Difference ============

/** CIE76 Delta E — Euclidean distance in LAB */
export function deltaE(lab1: [number, number, number], lab2: [number, number, number]): number {
  const dL = lab1[0] - lab2[0];
  const da = lab1[1] - lab2[1];
  const db = lab1[2] - lab2[2];
  return Math.sqrt(dL * dL + da * da + db * db);
}

// ============ Mixing Models ============

/**
 * Model A: CMY-style mixing in inverted linear RGB.
 * Best for opaque paints where pigments absorb light.
 * 
 * Logic: Convert to linear RGB, invert to get absorption (CMY),
 * weighted-average the absorption, invert back.
 * Opacity is used as "pigment power" — a paint with opacity 0.3
 * contributes 30% of the absorption that a fully opaque paint would.
 */
function mixCMY(paints: Paint[], ratios: number[]): [number, number, number] {
  const total = ratios.reduce((s, r) => s + r, 0);
  if (total === 0) return [0, 0, 0];

  let absR = 0, absG = 0, absB = 0;
  let totalWeight = 0;

  for (let i = 0; i < paints.length; i++) {
    const [lr, lg, lb] = rgbToLinear(paints[i].rgb[0], paints[i].rgb[1], paints[i].rgb[2]);
    const ratio = ratios[i] / total;
    // Pigment power scales with opacity — transparent paint contributes less absorption
    const power = ratio * (0.3 + paints[i].opacity * 0.7);
    
    // Absorption = 1 - reflectance (in linear space)
    absR += (1 - lr) * power;
    absG += (1 - lg) * power;
    absB += (1 - lb) * power;
    totalWeight += power;
  }

  if (totalWeight === 0) return [128, 128, 128];

  // Normalize and convert back to reflectance
  const mixR = 1 - (absR / totalWeight);
  const mixG = 1 - (absG / totalWeight);
  const mixB = 1 - (absB / totalWeight);

  return linearToRgb(mixR, mixG, mixB);
}

/**
 * Model B: Opacity-weighted LAB mixing.
 * Better for transparent/candy paints where layering matters.
 * 
 * Transparent paints shift chromaticity but barely affect lightness.
 * Opaque paints dominate both.
 */
function mixLAB(paints: Paint[], ratios: number[]): [number, number, number] {
  const total = ratios.reduce((s, r) => s + r, 0);
  if (total === 0) return [0, 0, 0];

  const labs = paints.map(p => rgbToLab(p.rgb[0], p.rgb[1], p.rgb[2]));
  let L = 0, a = 0, b = 0;
  let lightnessWeight = 0;
  let chromaWeight = 0;

  for (let i = 0; i < paints.length; i++) {
    const ratio = ratios[i] / total;
    const opacity = paints[i].opacity;
    
    // Lightness: opaque paints dominate, transparent paints barely shift L
    const lw = ratio * (0.2 + opacity * 0.8);
    L += labs[i][0] * lw;
    lightnessWeight += lw;

    // Chromaticity: all paints contribute, but darker/more opaque ones more
    const darknessBoost = 1 + (1 - labs[i][0] / 100) * 0.5;
    const cw = ratio * darknessBoost * (0.4 + opacity * 0.6);
    a += labs[i][1] * cw;
    b += labs[i][2] * cw;
    chromaWeight += cw;
  }

  if (lightnessWeight > 0) L /= lightnessWeight;
  if (chromaWeight > 0) { a /= chromaWeight; b /= chromaWeight; }

  return labToRgb(L, a, b);
}

/**
 * Hybrid mixer: blends CMY and LAB results based on average opacity of the mix.
 * Mostly-opaque mixes lean CMY. Mostly-transparent mixes lean LAB.
 */
function mixPaints(paints: Paint[], ratios: number[]): [number, number, number] {
  const total = ratios.reduce((s, r) => s + r, 0);
  if (total === 0) return [0, 0, 0];

  // Compute weighted average opacity
  let avgOpacity = 0;
  for (let i = 0; i < paints.length; i++) {
    avgOpacity += paints[i].opacity * (ratios[i] / total);
  }

  const cmyResult = mixCMY(paints, ratios);
  const labResult = mixLAB(paints, ratios);

  // Blend: high opacity → more CMY, low opacity → more LAB
  const cmyWeight = avgOpacity;
  const labWeight = 1 - avgOpacity;

  return [
    Math.round(cmyResult[0] * cmyWeight + labResult[0] * labWeight),
    Math.round(cmyResult[1] * cmyWeight + labResult[1] * labWeight),
    Math.round(cmyResult[2] * cmyWeight + labResult[2] * labWeight),
  ];
}

// ============ Match Scoring ============

/**
 * Steeper scoring curve. ΔE interpretation:
 *   0-1:   imperceptible difference
 *   1-2:   perceptible through close observation
 *   2-3.5: perceptible at a glance
 *   3.5-5: significant difference
 *   5-10:  clearly different colour
 *   10+:   different colour entirely
 * 
 * New curve: score = 100 × e^(-ΔE/8)
 * This gives: ΔE 2 → 78%, ΔE 5 → 53%, ΔE 10 → 29%, ΔE 20 → 8%
 * Much more honest than the old linear curve.
 */
function computeMatchScore(dE: number): number {
  return Math.round(100 * Math.exp(-dE / 8));
}

/**
 * Human-readable quality label for a ΔE value.
 */
export function deltaELabel(dE: number): string {
  if (dE <= 1) return 'Imperceptible';
  if (dE <= 2) return 'Very close';
  if (dE <= 3.5) return 'Close match';
  if (dE <= 5) return 'Noticeable difference';
  if (dE <= 10) return 'Clearly different';
  return 'Poor match';
}

export function deltaESeverity(dE: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (dE <= 2) return 'excellent';
  if (dE <= 5) return 'good';
  if (dE <= 10) return 'fair';
  return 'poor';
}

// ============ Formula Finding ============

export interface MixFormula {
  paints: Paint[];
  ratios: number[];
  percentages: number[];
  resultRgb: [number, number, number];
  matchScore: number;
  deltaE: number;
  mixModel: 'hybrid' | 'cmy' | 'lab';
}

function evaluateMix(paints: Paint[], ratios: number[], targetLab: [number, number, number]): { rgb: [number, number, number]; dE: number } {
  const rgb = mixPaints(paints, ratios);
  const resultLab = rgbToLab(rgb[0], rgb[1], rgb[2]);
  const dE = deltaE(targetLab, resultLab);
  return { rgb, dE };
}

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
    matchScore: computeMatchScore(bestDelta),
    deltaE: bestDelta,
    mixModel: 'hybrid',
  };
}

function findBestPair(targetLab: [number, number, number], availablePaints: Paint[]): MixFormula | null {
  let bestFormula: MixFormula | null = null;
  let bestDelta = Infinity;

  // Finer ratio steps: 5% increments
  const ratioSteps = [0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50,
                      0.55, 0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90, 0.95];

  for (let i = 0; i < availablePaints.length; i++) {
    for (let j = i + 1; j < availablePaints.length; j++) {
      const p1 = availablePaints[i];
      const p2 = availablePaints[j];

      for (const r of ratioSteps) {
        const { rgb, dE } = evaluateMix([p1, p2], [r, 1 - r], targetLab);

        if (dE < bestDelta) {
          bestDelta = dE;
          const r1 = Math.round(r * 20);
          const r2 = 20 - r1;
          const gcd = gcdTwo(r1, r2);
          const sr1 = r1 / gcd;
          const sr2 = r2 / gcd;
          const total = sr1 + sr2;
          bestFormula = {
            paints: [p1, p2],
            ratios: [sr1, sr2],
            percentages: [Math.round((sr1 / total) * 100), Math.round((sr2 / total) * 100)],
            resultRgb: rgb,
            matchScore: computeMatchScore(dE),
            deltaE: dE,
            mixModel: 'hybrid',
          };
        }
      }
    }
  }

  return bestFormula;
}

function findBestTriple(targetLab: [number, number, number], availablePaints: Paint[]): MixFormula | null {
  let bestFormula: MixFormula | null = null;
  let bestDelta = Infinity;

  // Pre-filter: top 15 closest paints
  const candidates = availablePaints
    .map(p => ({
      paint: p,
      delta: deltaE(targetLab, rgbToLab(p.rgb[0], p.rgb[1], p.rgb[2]))
    }))
    .sort((a, b) => a.delta - b.delta)
    .slice(0, 15)
    .map(c => c.paint);

  const steps = [0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.50, 0.60, 0.70];

  for (let i = 0; i < candidates.length; i++) {
    for (let j = i + 1; j < candidates.length; j++) {
      for (let k = j + 1; k < candidates.length; k++) {
        const p1 = candidates[i];
        const p2 = candidates[j];
        const p3 = candidates[k];

        for (const r1 of steps) {
          for (const r2 of steps) {
            const r3 = 1 - r1 - r2;
            if (r3 < 0.05 || r3 > 0.85) continue;

            const { rgb, dE } = evaluateMix([p1, p2, p3], [r1, r2, r3], targetLab);

            if (dE < bestDelta) {
              bestDelta = dE;
              const parts1 = Math.round(r1 * 20);
              const parts2 = Math.round(r2 * 20);
              const parts3 = Math.round(r3 * 20);
              const g = gcdThree(parts1, parts2, parts3);
              const sp1 = parts1 / g;
              const sp2 = parts2 / g;
              const sp3 = parts3 / g;
              const total = sp1 + sp2 + sp3;
              bestFormula = {
                paints: [p1, p2, p3],
                ratios: [sp1, sp2, sp3],
                percentages: [
                  Math.round((sp1 / total) * 100),
                  Math.round((sp2 / total) * 100),
                  Math.round((sp3 / total) * 100),
                ],
                resultRgb: rgb,
                matchScore: computeMatchScore(dE),
                deltaE: dE,
                mixModel: 'hybrid',
              };
            }
          }
        }
      }
    }
  }

  return bestFormula;
}

// ============ Utility ============

function gcdTwo(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

function gcdThree(a: number, b: number, c: number): number {
  return gcdTwo(gcdTwo(a, b), c);
}

// ============ Main API ============

export interface MixResult {
  targetRgb: [number, number, number];
  targetHex: string;
  formulas: MixFormula[];
  bestFormula: MixFormula;
}

export interface MixOptions {
  brands?: PaintBrand[];
  categories?: PaintCategory[];
  maxPaints?: number;
  /** If provided, only these paint keys ("brand:code") are considered */
  inventoryFilter?: Set<string>;
}

/** Categories excluded from mixing by default (user can opt in) */
const EXCLUDED_CATEGORIES: PaintCategory[] = ['primer', 'wash', 'ink'];

/**
 * Main function: Given a target RGB color, find the best mixing formulas.
 * Supports filtering by brand, category, and user inventory.
 */
export function findMixFormula(
  targetR: number,
  targetG: number,
  targetB: number,
  options?: MixOptions
): MixResult {
  const selectedBrands = options?.brands || ['createx-wicked'];
  const categories = options?.categories || ['transparent', 'opaque', 'detail', 'standard', 'pearl', 'metallic', 'fluorescent'];
  const maxPaints = options?.maxPaints || 3;
  const inventoryFilter = options?.inventoryFilter;

  // Filter available paints by brand, category, and inventory
  let availablePaints = allPaints.filter(p => {
    if (!selectedBrands.includes(p.brand)) return false;
    if (!categories.includes(p.category)) return false;
    // Exclude problematic categories unless explicitly included
    if (EXCLUDED_CATEGORIES.includes(p.category) && !categories.includes(p.category)) return false;
    return true;
  });

  // If inventory filter is active, restrict to owned paints only
  if (inventoryFilter && inventoryFilter.size > 0) {
    availablePaints = availablePaints.filter(p => inventoryFilter.has(`${p.brand}:${p.code}`));
  }

  const targetLab = rgbToLab(targetR, targetG, targetB);
  const targetHex = '#' + [targetR, targetG, targetB].map(x => x.toString(16).padStart(2, '0')).join('');

  const formulas: MixFormula[] = [];

  // Find best single paint
  const single = findBestSingle(targetLab, availablePaints);
  if (single) formulas.push(single);

  // Find best pair
  if (maxPaints >= 2 && availablePaints.length >= 2) {
    const pair = findBestPair(targetLab, availablePaints);
    if (pair) formulas.push(pair);
  }

  // Find best triple
  if (maxPaints >= 3 && availablePaints.length >= 3) {
    const triple = findBestTriple(targetLab, availablePaints);
    if (triple) formulas.push(triple);
  }

  // Sort by deltaE (lowest first = best match)
  formulas.sort((a, b) => a.deltaE - b.deltaE);

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
      mixModel: 'hybrid',
    },
  };
}

/**
 * Convert a ratio-based formula to ml amounts given a total volume.
 */
export function formulaToMl(formula: MixFormula, totalMl: number): number[] {
  const totalParts = formula.ratios.reduce((s, r) => s + r, 0);
  if (totalParts === 0) return formula.ratios.map(() => 0);
  return formula.ratios.map(r => Math.round((r / totalParts) * totalMl * 10) / 10);
}

/**
 * Convert ml to approximate drops (1 drop ≈ 0.05ml from a standard dropper bottle)
 */
export function mlToDrops(ml: number): number {
  return Math.round(ml / 0.05);
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

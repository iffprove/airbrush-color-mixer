/**
 * Color Mixing Algorithm — v3
 *
 * Mixing engine: Spectral.js (Kubelka-Munk) via mixPaintsSpectral (default).
 * Legacy CMY+LAB hybrid retained as mixPaintsLegacy for A/B comparison.
 * Toggle USE_SPECTRAL_MIX to switch between them.
 *
 * Supports 9 brands, 400+ paints.
 */

import * as spectral from 'spectral.js';
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
 */
function mixCMY(paints: Paint[], ratios: number[]): [number, number, number] {
  const total = ratios.reduce((s, r) => s + r, 0);
  if (total === 0) return [0, 0, 0];

  let absR = 0, absG = 0, absB = 0;
  let totalWeight = 0;

  for (let i = 0; i < paints.length; i++) {
    const [lr, lg, lb] = rgbToLinear(paints[i].rgb[0], paints[i].rgb[1], paints[i].rgb[2]);
    const ratio = ratios[i] / total;
    const power = ratio * (0.3 + paints[i].opacity * 0.7);

    absR += (1 - lr) * power;
    absG += (1 - lg) * power;
    absB += (1 - lb) * power;
    totalWeight += power;
  }

  if (totalWeight === 0) return [128, 128, 128];

  const mixR = 1 - (absR / totalWeight);
  const mixG = 1 - (absG / totalWeight);
  const mixB = 1 - (absB / totalWeight);

  return linearToRgb(mixR, mixG, mixB);
}

/**
 * Model B: Opacity-weighted LAB mixing.
 * Better for transparent/candy paints where layering matters.
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

    const lw = ratio * (0.2 + opacity * 0.8);
    L += labs[i][0] * lw;
    lightnessWeight += lw;

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
 * Legacy hybrid mixer: blends CMY and LAB results based on average opacity.
 * Kept for A/B comparison via USE_SPECTRAL_MIX flag.
 */
export function mixPaintsLegacy(paints: Paint[], ratios: number[]): [number, number, number] {
  const total = ratios.reduce((s, r) => s + r, 0);
  if (total === 0) return [0, 0, 0];

  let avgOpacity = 0;
  for (let i = 0; i < paints.length; i++) {
    avgOpacity += paints[i].opacity * (ratios[i] / total);
  }

  const cmyResult = mixCMY(paints, ratios);
  const labResult = mixLAB(paints, ratios);

  const cmyWeight = avgOpacity;
  const labWeight = 1 - avgOpacity;

  return [
    Math.round(cmyResult[0] * cmyWeight + labResult[0] * labWeight),
    Math.round(cmyResult[1] * cmyWeight + labResult[1] * labWeight),
    Math.round(cmyResult[2] * cmyWeight + labResult[2] * labWeight),
  ];
}

// ============ Spectral Mixing (Kubelka-Munk) ============

const rgbToHex = ([r, g, b]: [number, number, number]) =>
  '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
};

/**
 * Spectral mixing via Kubelka-Munk theory (spectral.js).
 *
 * Uses iterative pairwise mixing with cumulative weights. This is
 * mathematically correct because K/S mixing is linear: mix(mix(A,B), C)
 * with t_i = w_i / (accumulated_w + w_i) is equivalent to a true N-way
 * weighted average. Do NOT use naive 0.5 ratios for 3-paint mixes.
 *
 * Adapted for spectral.js v3 API which uses Color objects and [Color, factor]
 * pairs instead of the (hexA, hexB, t) signature the spec originally assumed.
 */
export function mixPaintsSpectral(
  paints: Paint[],
  ratios: number[],
): [number, number, number] {
  const total = ratios.reduce((s, r) => s + r, 0);
  if (total === 0) return [0, 0, 0];
  if (paints.length === 1) return paints[0].rgb;

  const weights = paints.map((p, i) => (ratios[i] / total) * p.tintingStrength);

  // v3 API: Color objects, pairwise cumulative mixing
  let mixedColor = new spectral.Color(paints[0].rgb as number[]);
  let cumulative = weights[0];

  for (let i = 1; i < paints.length; i++) {
    const w = weights[i];
    const t = w / (cumulative + w);
    const nextColor = new spectral.Color(paints[i].rgb as number[]);
    mixedColor = spectral.mix([mixedColor, 1 - t], [nextColor, t]);
    cumulative += w;
  }

  const [r, g, b] = mixedColor.sRGB;
  return [Math.round(r), Math.round(g), Math.round(b)];
}

// ============ Feature Flag ============

/** Feature flag — flip to false to compare against legacy heuristic during validation. */
export const USE_SPECTRAL_MIX = true;

function mixPaints(paints: Paint[], ratios: number[]): [number, number, number] {
  return USE_SPECTRAL_MIX
    ? mixPaintsSpectral(paints, ratios)
    : mixPaintsLegacy(paints, ratios);
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
 * score = 100 × e^(-ΔE/8)
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
  // TODO(scope): currently defaults to Wicked-only to match repo description.
  // Pre-launch decision: (a) flip default to all 9 brands and update package
  // metadata, or (b) ship as Wicked-only v1 and update README + brand picker.
  const selectedBrands = options?.brands || ['createx-wicked'];
  const categories = options?.categories || ['transparent', 'opaque', 'detail', 'standard', 'pearl', 'metallic', 'fluorescent'];
  const maxPaints = options?.maxPaints || 3;
  const inventoryFilter = options?.inventoryFilter;

  let availablePaints = allPaints.filter(p => {
    if (!selectedBrands.includes(p.brand)) return false;
    if (!categories.includes(p.category)) return false;
    return true;
  });

  if (inventoryFilter && inventoryFilter.size > 0) {
    availablePaints = availablePaints.filter(p => inventoryFilter.has(`${p.brand}:${p.code}`));
  }

  const targetLab = rgbToLab(targetR, targetG, targetB);
  const targetHex = '#' + [targetR, targetG, targetB].map(x => x.toString(16).padStart(2, '0')).join('');

  const formulas: MixFormula[] = [];

  const single = findBestSingle(targetLab, availablePaints);
  if (single) formulas.push(single);

  if (maxPaints >= 2 && availablePaints.length >= 2) {
    const pair = findBestPair(targetLab, availablePaints);
    if (pair) formulas.push(pair);
  }

  if (maxPaints >= 3 && availablePaints.length >= 3) {
    const triple = findBestTriple(targetLab, availablePaints);
    if (triple) formulas.push(triple);
  }

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

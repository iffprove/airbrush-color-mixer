/**
 * FormulaDisplay Component — v2
 * 
 * Shows paint mixing formulas with:
 * - Raw ΔE value prominently displayed alongside match %
 * - Honest severity labels (not inflated)
 * - Volume calculator: user sets total ml, gets per-paint amounts + drops
 * - Brand info for each paint
 * 
 * Design: Workshop Industrial
 */

import { useState } from 'react';
import { MixFormula, MixResult, deltaELabel, deltaESeverity, formulaToMl, mlToDrops } from '@/lib/colorMixer';
import { brands } from '@/lib/paintDatabase';
import { Beaker, AlertTriangle, Droplets } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface FormulaDisplayProps {
  result: MixResult;
}

function getBrandShortName(brandId: string): string {
  return brands.find(b => b.id === brandId)?.shortName || brandId;
}

function DeltaEBadge({ dE }: { dE: number }) {
  const severity = deltaESeverity(dE);
  const label = deltaELabel(dE);

  const styles = {
    excellent: 'bg-green-900/50 text-green-400 border-green-700/50',
    good: 'bg-amber/10 text-amber border-amber/30',
    fair: 'bg-orange-900/50 text-orange-400 border-orange-700/50',
    poor: 'bg-red-900/50 text-red-400 border-red-700/50',
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono border ${styles[severity]}`}>
        {severity === 'poor' && <AlertTriangle className="w-3 h-3" />}
        {label}
      </span>
      <span className="text-xs font-mono text-muted-foreground" title="CIE76 Delta E — lower is better. Under 2 = imperceptible, under 5 = close.">
        ΔE {dE.toFixed(1)}
      </span>
    </div>
  );
}

function VolumeCalculator({ formula }: { formula: MixFormula }) {
  const [totalMl, setTotalMl] = useState(10);

  const mlAmounts = formulaToMl(formula, totalMl);

  return (
    <div className="p-3 rounded-md bg-[oklch(0.14_0.005_285)] border border-[oklch(0.22_0.005_285)] space-y-3">
      <div className="flex items-center gap-2">
        <Droplets className="w-3.5 h-3.5 text-blue-400" />
        <Label className="text-xs font-mono text-muted-foreground">VOLUME CALCULATOR</Label>
      </div>
      <div className="flex items-center gap-3">
        <Label className="text-xs font-mono text-muted-foreground whitespace-nowrap">TOTAL:</Label>
        <Slider
          value={[totalMl]}
          onValueChange={([v]) => setTotalMl(v)}
          min={1}
          max={60}
          step={1}
          className="flex-1"
        />
        <span className="text-sm font-mono text-amber w-12 text-right">{totalMl}ml</span>
      </div>
      <div className="space-y-1.5">
        {formula.paints.map((paint, i) => (
          <div key={`${paint.brand}-${paint.code}`} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: `rgb(${paint.rgb.join(',')})` }}
              />
              <span className="font-mono text-muted-foreground">{paint.code}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-foreground">{mlAmounts[i]}ml</span>
              <span className="font-mono text-muted-foreground/70 w-16 text-right">
                ~{mlToDrops(mlAmounts[i])} drops
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[9px] text-muted-foreground/50">
        1 drop ≈ 0.05ml (standard dropper bottle). Adjust for your bottle type.
      </p>
    </div>
  );
}

function FormulaCard({ formula, index }: { formula: MixFormula; index: number }) {
  const totalParts = formula.ratios.reduce((s, r) => s + r, 0);

  return (
    <div className="workshop-panel rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Beaker className="w-4 h-4 text-amber" />
          <span className="font-mono text-sm text-muted-foreground">
            FORMULA {index + 1} — {formula.paints.length} {formula.paints.length === 1 ? 'PAINT' : 'PAINTS'}
          </span>
        </div>
        <DeltaEBadge dE={formula.deltaE} />
      </div>

      {/* Color comparison */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground font-mono mb-1">PREDICTED RESULT</p>
          <div
            className="h-10 rounded paint-chip w-full"
            style={{ backgroundColor: `rgb(${formula.resultRgb.join(',')})` }}
          />
        </div>
        <div className="text-center px-3">
          <p className="text-[10px] text-muted-foreground font-mono">SCORE</p>
          <p className="text-lg font-bold text-amber font-mono">{formula.matchScore}%</p>
          <p className="text-[9px] text-muted-foreground/60 font-mono">simulated</p>
        </div>
      </div>

      {/* Paint list with ratio bars */}
      <div className="space-y-3">
        {formula.paints.map((paint, i) => (
          <div key={`${paint.brand}-${paint.code}`} className="space-y-1">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-sm paint-chip flex-shrink-0"
                  style={{ backgroundColor: `rgb(${paint.rgb.join(',')})` }}
                />
                <span className="font-mono text-sm text-amber">{paint.code}</span>
                <span className="text-sm text-foreground">{paint.name}</span>
                <span className="text-[10px] text-muted-foreground bg-[oklch(0.22_0.005_285)] px-1.5 py-0.5 rounded font-mono">
                  {getBrandShortName(paint.brand)}
                </span>
                <span className="text-[9px] text-muted-foreground/50">
                  {paint.opacity < 0.4 ? 'trans' : paint.opacity < 0.7 ? 'semi' : 'opaque'}
                </span>
              </div>
              <span className="font-mono text-sm text-muted-foreground">
                {formula.ratios[i]} {formula.ratios[i] === 1 ? 'part' : 'parts'} ({formula.percentages[i]}%)
              </span>
            </div>
            {/* Ratio bar */}
            <div className="h-2 bg-[oklch(0.18_0.005_285)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(formula.ratios[i] / totalParts) * 100}%`,
                  backgroundColor: `rgb(${paint.rgb.join(',')})`,
                  boxShadow: `0 0 8px rgb(${paint.rgb.join(',')}, 0.4)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Volume calculator */}
      {formula.paints.length > 1 && (
        <VolumeCalculator formula={formula} />
      )}

      {/* Mixing instruction */}
      <div className="pt-2 border-t border-[oklch(0.30_0.01_285)]">
        <p className="text-xs text-muted-foreground font-mono">
          MIX RATIO: {formula.ratios.join(' : ')} (by volume)
        </p>
      </div>
    </div>
  );
}

export default function FormulaDisplay({ result }: FormulaDisplayProps) {
  if (!result.formulas.length) {
    return (
      <div className="workshop-panel rounded-lg p-6 text-center">
        <p className="text-muted-foreground">No formula found. Try a different color or enable more brands/categories.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Target color header */}
      <div className="flex items-center gap-3 px-1">
        <div
          className="w-10 h-10 rounded-lg paint-chip"
          style={{ backgroundColor: result.targetHex }}
        />
        <div>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">TARGET COLOR</p>
          <p className="font-mono text-foreground">{result.targetHex.toUpperCase()}</p>
          <p className="text-[10px] text-muted-foreground/60 font-mono">
            RGB({result.targetRgb.join(', ')})
          </p>
        </div>
      </div>

      {/* Formula cards */}
      {result.formulas.map((formula, i) => (
        <FormulaCard key={i} formula={formula} index={i} />
      ))}

      {/* Honest disclaimer */}
      <div className="px-4 py-3 rounded-lg bg-[oklch(0.18_0.005_285)] border border-[oklch(0.25_0.005_285)]">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-amber font-mono">IMPORTANT:</span> These formulas are <strong>simulated predictions</strong> based on approximate RGB values.
          Real paint mixing depends on pigment chemistry, coat thickness, substrate, and reducer ratio.
          The ΔE score measures predicted accuracy — but actual spray-out may differ.
          <strong> Always mix a small test batch on scrap material first.</strong>
        </p>
      </div>
    </div>
  );
}

/**
 * FormulaDisplay Component
 * Shows the paint mixing formula with visual ratio bars and paint details.
 * Styled like a workshop work-order / instruction card.
 */

import { MixFormula, MixResult } from '@/lib/colorMixer';
import { rgbToHex } from '@/lib/paintDatabase';
import { Beaker, Check, AlertTriangle } from 'lucide-react';

interface FormulaDisplayProps {
  result: MixResult;
}

function MatchBadge({ score }: { score: number }) {
  if (score >= 85) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-green-900/50 text-green-400 border border-green-700/50">
        <Check className="w-3 h-3" />
        EXCELLENT
      </span>
    );
  }
  if (score >= 65) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-amber/10 text-amber border border-amber/30">
        <Check className="w-3 h-3" />
        GOOD
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-orange-900/50 text-orange-400 border border-orange-700/50">
      <AlertTriangle className="w-3 h-3" />
      APPROXIMATE
    </span>
  );
}

function FormulaCard({ formula, index }: { formula: MixFormula; index: number }) {
  const totalParts = formula.ratios.reduce((s, r) => s + r, 0);

  return (
    <div className="workshop-panel rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Beaker className="w-4 h-4 text-amber" />
          <span className="font-mono text-sm text-muted-foreground">
            FORMULA {index + 1} — {formula.paints.length} {formula.paints.length === 1 ? 'PAINT' : 'PAINTS'}
          </span>
        </div>
        <MatchBadge score={formula.matchScore} />
      </div>

      {/* Color comparison */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground font-mono mb-1">RESULT</p>
          <div
            className="h-10 rounded paint-chip w-full"
            style={{ backgroundColor: `rgb(${formula.resultRgb.join(',')})` }}
          />
        </div>
        <div className="text-center px-2">
          <p className="text-xs text-muted-foreground font-mono">MATCH</p>
          <p className="text-lg font-bold text-amber font-mono">{Math.round(formula.matchScore)}%</p>
        </div>
      </div>

      {/* Paint list with ratio bars */}
      <div className="space-y-3">
        {formula.paints.map((paint, i) => (
          <div key={paint.code} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-sm paint-chip flex-shrink-0"
                  style={{ backgroundColor: `rgb(${paint.rgb.join(',')})` }}
                />
                <span className="font-mono text-sm text-amber">{paint.code}</span>
                <span className="text-sm text-foreground">{paint.name}</span>
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
        <p className="text-muted-foreground">No formula found. Try a different color.</p>
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
        </div>
      </div>

      {/* Formula cards */}
      {result.formulas.map((formula, i) => (
        <FormulaCard key={i} formula={formula} index={i} />
      ))}

      {/* Tips */}
      <div className="px-4 py-3 rounded-lg bg-[oklch(0.18_0.005_285)] border border-[oklch(0.25_0.005_285)]">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-amber font-mono">TIP:</span> Start with the lightest color and gradually add darker colors.
          Mix small test batches first. Wicked Colors are transparent — layer multiple coats for full coverage.
          Use W030 Opaque White as a base for lighter colors.
        </p>
      </div>
    </div>
  );
}

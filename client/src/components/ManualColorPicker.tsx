/**
 * ManualColorPicker Component
 * Allows manual color input via hex code or RGB sliders.
 */

import { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface ManualColorPickerProps {
  onColorPick: (r: number, g: number, b: number) => void;
  initialColor?: [number, number, number];
}

export default function ManualColorPicker({ onColorPick, initialColor }: ManualColorPickerProps) {
  const [r, setR] = useState(initialColor?.[0] ?? 128);
  const [g, setG] = useState(initialColor?.[1] ?? 64);
  const [b, setB] = useState(initialColor?.[2] ?? 64);
  const [hexInput, setHexInput] = useState('');

  useEffect(() => {
    if (initialColor) {
      setR(initialColor[0]);
      setG(initialColor[1]);
      setB(initialColor[2]);
    }
  }, [initialColor]);

  const hexValue = '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('').toUpperCase();

  const handleHexChange = useCallback((value: string) => {
    setHexInput(value);
    const cleaned = value.replace('#', '');
    if (cleaned.length === 6) {
      const parsed = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleaned);
      if (parsed) {
        const nr = parseInt(parsed[1], 16);
        const ng = parseInt(parsed[2], 16);
        const nb = parseInt(parsed[3], 16);
        setR(nr);
        setG(ng);
        setB(nb);
        onColorPick(nr, ng, nb);
      }
    }
  }, [onColorPick]);

  const handleSliderChange = useCallback((channel: 'r' | 'g' | 'b', value: number) => {
    let nr = r, ng = g, nb = b;
    if (channel === 'r') { nr = value; setR(value); }
    if (channel === 'g') { ng = value; setG(value); }
    if (channel === 'b') { nb = value; setB(value); }
    onColorPick(nr, ng, nb);
    setHexInput('');
  }, [r, g, b, onColorPick]);

  const handleNativePickerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    const parsed = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (parsed) {
      const nr = parseInt(parsed[1], 16);
      const ng = parseInt(parsed[2], 16);
      const nb = parseInt(parsed[3], 16);
      setR(nr);
      setG(ng);
      setB(nb);
      onColorPick(nr, ng, nb);
      setHexInput('');
    }
  }, [onColorPick]);

  return (
    <div className="workshop-panel rounded-lg p-5 space-y-5">
      <div className="flex items-center gap-4">
        {/* Large color preview */}
        <div className="relative">
          <div
            className="w-20 h-20 rounded-lg paint-chip"
            style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
          />
          {/* Native color picker overlay */}
          <input
            type="color"
            value={hexValue.toLowerCase()}
            onChange={handleNativePickerChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Click to open color picker"
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
            Hex Code
          </Label>
          <Input
            value={hexInput || hexValue}
            onChange={(e) => handleHexChange(e.target.value)}
            placeholder="#FF6600"
            className="font-mono text-lg bg-[oklch(0.18_0.005_285)] border-[oklch(0.30_0.01_285)] text-foreground"
          />
        </div>
      </div>

      {/* RGB Sliders */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Red</Label>
            <span className="font-mono text-sm text-foreground">{r}</span>
          </div>
          <Slider
            value={[r]}
            onValueChange={([v]) => handleSliderChange('r', v)}
            max={255}
            step={1}
            className="[&_[role=slider]]:bg-red-500 [&_[role=slider]]:border-red-600"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Green</Label>
            <span className="font-mono text-sm text-foreground">{g}</span>
          </div>
          <Slider
            value={[g]}
            onValueChange={([v]) => handleSliderChange('g', v)}
            max={255}
            step={1}
            className="[&_[role=slider]]:bg-green-500 [&_[role=slider]]:border-green-600"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Blue</Label>
            <span className="font-mono text-sm text-foreground">{b}</span>
          </div>
          <Slider
            value={[b]}
            onValueChange={([v]) => handleSliderChange('b', v)}
            max={255}
            step={1}
            className="[&_[role=slider]]:bg-blue-500 [&_[role=slider]]:border-blue-600"
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Click the color swatch to open the system color picker, or adjust sliders manually
      </p>
    </div>
  );
}

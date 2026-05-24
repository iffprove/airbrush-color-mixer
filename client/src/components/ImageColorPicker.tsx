/**
 * ImageColorPicker Component
 * Photo upload + color sampling with TWO-POINT calibration.
 * 
 * Calibration math:
 *   1. Gamma-decode sampled RGB to linear (sRGB gamma)
 *   2. corrected_linear = (sample_linear - black_ref_linear) / (white_ref_linear - black_ref_linear)
 *   3. Gamma-encode back to sRGB
 * 
 * This corrects both colour cast AND exposure non-linearity.
 * Light theme, high-contrast, large touch targets.
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, Upload, X, Grid3X3, Crosshair, CircleDot, RotateCcw, AlertTriangle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ImageColorPickerProps {
  onColorPick: (r: number, g: number, b: number) => void;
}

// sRGB gamma decode: sRGB [0-255] → linear [0-1]
function srgbToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

// sRGB gamma encode: linear [0-1] → sRGB [0-255]
function linearToSrgb(c: number): number {
  const clamped = Math.max(0, Math.min(1, c));
  const s = clamped <= 0.0031308 ? clamped * 12.92 : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  return Math.round(s * 255);
}

interface CalibrationData {
  whiteLinear: [number, number, number];
  blackLinear: [number, number, number];
  whiteRgb: [number, number, number];
  blackRgb: [number, number, number];
}

type CalibrationStep = 'none' | 'awaiting-white' | 'awaiting-black' | 'calibrated';

export default function ImageColorPicker({ onColorPick }: ImageColorPickerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [hoveredColor, setHoveredColor] = useState<[number, number, number] | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedColor, setSelectedColor] = useState<[number, number, number] | null>(null);
  const [areaMode, setAreaMode] = useState(true);
  const [sampleSize, setSampleSize] = useState(10);

  // Two-point calibration state
  const [calStep, setCalStep] = useState<CalibrationStep>('none');
  const [calData, setCalData] = useState<CalibrationData | null>(null);

  const loadImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setSelectedColor(null);
        setCalStep('none');
        setCalData(null);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  useEffect(() => {
    if (!image || !canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const containerWidth = container.clientWidth;
    const containerHeight = Math.min(400, window.innerHeight * 0.45);
    const scale = Math.min(containerWidth / image.width, containerHeight / image.height);
    canvas.width = image.width * scale;
    canvas.height = image.height * scale;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }, [image]);

  const getRawColorAtPosition = useCallback((x: number, y: number): [number, number, number] | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    if (!areaMode) {
      const pixel = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
      return [pixel[0], pixel[1], pixel[2]];
    }

    const size = sampleSize;
    const startX = Math.max(0, Math.round(x - size));
    const startY = Math.max(0, Math.round(y - size));
    const endX = Math.min(canvas.width, Math.round(x + size));
    const endY = Math.min(canvas.height, Math.round(y + size));
    const width = endX - startX;
    const height = endY - startY;
    if (width <= 0 || height <= 0) return null;

    const imageData = ctx.getImageData(startX, startY, width, height).data;
    let totalR = 0, totalG = 0, totalB = 0, count = 0;
    for (let i = 0; i < imageData.length; i += 4) {
      totalR += imageData[i];
      totalG += imageData[i + 1];
      totalB += imageData[i + 2];
      count++;
    }
    if (count === 0) return null;
    return [Math.round(totalR / count), Math.round(totalG / count), Math.round(totalB / count)];
  }, [areaMode, sampleSize]);

  // Two-point calibration correction
  const applyCalibration = useCallback((raw: [number, number, number]): [number, number, number] => {
    if (!calData) return raw;

    const rLin = srgbToLinear(raw[0]);
    const gLin = srgbToLinear(raw[1]);
    const bLin = srgbToLinear(raw[2]);

    const wR = calData.whiteLinear[0], bR = calData.blackLinear[0];
    const wG = calData.whiteLinear[1], bG = calData.blackLinear[1];
    const wB = calData.whiteLinear[2], bB = calData.blackLinear[2];

    // Avoid division by zero
    const rangeR = Math.max(wR - bR, 0.001);
    const rangeG = Math.max(wG - bG, 0.001);
    const rangeB = Math.max(wB - bB, 0.001);

    const corrR = (rLin - bR) / rangeR;
    const corrG = (gLin - bG) / rangeG;
    const corrB = (bLin - bB) / rangeB;

    return [linearToSrgb(corrR), linearToSrgb(corrG), linearToSrgb(corrB)];
  }, [calData]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const raw = getRawColorAtPosition(x, y);
    if (raw) {
      const isCalibrating = calStep === 'awaiting-white' || calStep === 'awaiting-black';
      setHoveredColor(isCalibrating ? raw : applyCalibration(raw));
      setCursorPos({ x, y });
    }
  }, [getRawColorAtPosition, applyCalibration, calStep]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const raw = getRawColorAtPosition(x, y);
    if (!raw) return;

    if (calStep === 'awaiting-white') {
      // Store white reference and move to black
      const wLin: [number, number, number] = [srgbToLinear(raw[0]), srgbToLinear(raw[1]), srgbToLinear(raw[2])];
      setCalData(prev => ({
        whiteLinear: wLin,
        blackLinear: prev?.blackLinear || [0, 0, 0],
        whiteRgb: raw,
        blackRgb: prev?.blackRgb || [0, 0, 0],
      }));
      setCalStep('awaiting-black');
    } else if (calStep === 'awaiting-black') {
      // Store black reference and complete calibration
      const bLin: [number, number, number] = [srgbToLinear(raw[0]), srgbToLinear(raw[1]), srgbToLinear(raw[2])];
      setCalData(prev => prev ? {
        ...prev,
        blackLinear: bLin,
        blackRgb: raw,
      } : null);
      setCalStep('calibrated');
    } else {
      const corrected = applyCalibration(raw);
      setSelectedColor(corrected);
      onColorPick(corrected[0], corrected[1], corrected[2]);
    }
  }, [getRawColorAtPosition, applyCalibration, calStep, onColorPick]);

  const handleTouch = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.changedTouches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const raw = getRawColorAtPosition(x, y);
    if (!raw) return;

    if (calStep === 'awaiting-white') {
      const wLin: [number, number, number] = [srgbToLinear(raw[0]), srgbToLinear(raw[1]), srgbToLinear(raw[2])];
      setCalData(prev => ({
        whiteLinear: wLin,
        blackLinear: prev?.blackLinear || [0, 0, 0],
        whiteRgb: raw,
        blackRgb: prev?.blackRgb || [0, 0, 0],
      }));
      setCalStep('awaiting-black');
    } else if (calStep === 'awaiting-black') {
      const bLin: [number, number, number] = [srgbToLinear(raw[0]), srgbToLinear(raw[1]), srgbToLinear(raw[2])];
      setCalData(prev => prev ? {
        ...prev,
        blackLinear: bLin,
        blackRgb: raw,
      } : null);
      setCalStep('calibrated');
    } else {
      const corrected = applyCalibration(raw);
      setSelectedColor(corrected);
      onColorPick(corrected[0], corrected[1], corrected[2]);
    }
  }, [getRawColorAtPosition, applyCalibration, calStep, onColorPick]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadImage(file);
  }, [loadImage]);

  const clearImage = useCallback(() => {
    setImage(null);
    setSelectedColor(null);
    setHoveredColor(null);
    setCursorPos(null);
    setCalStep('none');
    setCalData(null);
  }, []);

  const resetCalibration = useCallback(() => {
    setCalStep('none');
    setCalData(null);
  }, []);

  const startCalibration = useCallback(() => {
    setCalStep('awaiting-white');
    setCalData(null);
  }, []);

  const isCalibrating = calStep === 'awaiting-white' || calStep === 'awaiting-black';
  const crosshairSize = areaMode ? sampleSize * 2 + 4 : 40;

  return (
    <div className="space-y-4">
      {!image ? (
        <div className="workshop-panel rounded-lg p-6">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-bold mb-1">Upload or capture a photo</p>
                <p className="text-muted-foreground text-sm">
                  Take a photo of the surface you want to match
                </p>
              </div>
              <div className="flex gap-3 flex-wrap justify-center">
                <Button
                  onClick={() => cameraInputRef.current?.click()}
                  className="bg-primary text-primary-foreground hover:bg-amber-dark h-12 px-6 text-base font-bold"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Take Photo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-border text-foreground hover:bg-accent h-12 px-6 text-base font-bold"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Image
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground max-w-xs">
                Tip: Place a calibration card (white + black patches) next to the surface for accurate color capture.
              </p>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />
        </div>
      ) : (
        <div className="workshop-panel rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground font-mono font-bold">
              {calStep === 'awaiting-white' && '⬜ TAP THE WHITE PATCH'}
              {calStep === 'awaiting-black' && '⬛ TAP THE BLACK PATCH'}
              {calStep === 'none' && 'TAP IMAGE TO SAMPLE COLOR'}
              {calStep === 'calibrated' && 'TAP IMAGE TO SAMPLE COLOR'}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearImage}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>

          {/* Two-Point Calibration Panel */}
          <div className={`p-3 rounded-md border-2 ${
            calStep === 'calibrated' ? 'bg-green-50 border-green-300' :
            isCalibrating ? 'bg-blue-50 border-blue-300' :
            'bg-secondary border-border'
          }`}>
            <div className="flex items-start gap-2">
              <CircleDot className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                calStep === 'calibrated' ? 'text-green-700' :
                isCalibrating ? 'text-blue-600' : 'text-muted-foreground'
              }`} />
              <div className="flex-1 min-w-0">
                {calStep === 'calibrated' && calData && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-green-800 font-bold">2-POINT CALIBRATED</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-sm border-2 border-gray-300"
                          style={{ backgroundColor: `rgb(${calData.whiteRgb.join(',')})` }}
                          title="White reference" />
                        <span className="text-[9px] text-muted-foreground">W</span>
                        <div className="w-4 h-4 rounded-sm border-2 border-gray-300"
                          style={{ backgroundColor: `rgb(${calData.blackRgb.join(',')})` }}
                          title="Black reference" />
                        <span className="text-[9px] text-muted-foreground">B</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={resetCalibration}
                        className="h-5 px-1 text-muted-foreground hover:text-foreground">
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-[10px] text-green-700">
                      Color cast and exposure corrected. Sampling is now calibrated.
                    </p>
                  </div>
                )}
                {calStep === 'awaiting-white' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-blue-800 font-bold animate-pulse">
                      STEP 1/2: TAP WHITE PATCH
                    </span>
                    <Button variant="ghost" size="sm" onClick={resetCalibration}
                      className="h-5 px-2 text-xs text-muted-foreground">Cancel</Button>
                  </div>
                )}
                {calStep === 'awaiting-black' && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-blue-800 font-bold animate-pulse">
                        STEP 2/2: TAP BLACK PATCH
                      </span>
                      <Button variant="ghost" size="sm" onClick={resetCalibration}
                        className="h-5 px-2 text-xs text-muted-foreground">Cancel</Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-blue-700">White captured:</span>
                      <div className="w-3 h-3 rounded-sm border border-gray-300"
                        style={{ backgroundColor: calData ? `rgb(${calData.whiteRgb.join(',')})` : '#fff' }} />
                    </div>
                  </div>
                )}
                {calStep === 'none' && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] text-foreground font-bold">Calibration:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={startCalibration}
                      className="h-6 px-2 text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-100 font-bold"
                    >
                      Start 2-Point Cal
                    </Button>
                    <span className="text-[10px] text-muted-foreground">
                      (white patch → black patch → sample)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sampling mode controls */}
          <div className="flex items-center gap-4 p-3 rounded-md bg-secondary border-2 border-border">
            <div className="flex items-center gap-2">
              {areaMode ? (
                <Grid3X3 className="w-4 h-4 text-primary" />
              ) : (
                <Crosshair className="w-4 h-4 text-muted-foreground" />
              )}
              <Label className="text-xs font-mono text-foreground whitespace-nowrap font-bold">
                AREA AVG
              </Label>
              <Switch
                checked={areaMode}
                onCheckedChange={setAreaMode}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            {areaMode && (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Label className="text-xs font-mono text-muted-foreground whitespace-nowrap font-bold">
                  SIZE:
                </Label>
                <Slider
                  value={[sampleSize]}
                  onValueChange={([v]) => setSampleSize(v)}
                  min={3}
                  max={30}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs font-mono text-primary w-10 text-right font-bold">
                  {sampleSize * 2}px
                </span>
              </div>
            )}
          </div>

          {/* Canvas area */}
          <div ref={containerRef} className="relative overflow-hidden rounded-md border-2 border-border bg-gray-100">
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onClick={handleClick}
              onTouchEnd={handleTouch}
              className={`block mx-auto ${isCalibrating ? 'cursor-cell' : 'cursor-crosshair'}`}
              style={{ maxWidth: '100%' }}
            />
            {isCalibrating && (
              <div className={`absolute inset-0 pointer-events-none border-2 rounded-md ${
                calStep === 'awaiting-white' ? 'bg-blue-500/5 border-blue-400/40' : 'bg-gray-900/5 border-gray-600/40'
              }`} />
            )}
            {cursorPos && (
              <div
                className="pointer-events-none absolute"
                style={{
                  left: cursorPos.x - crosshairSize / 2,
                  top: cursorPos.y - crosshairSize / 2,
                  width: crosshairSize,
                  height: crosshairSize,
                }}
              >
                {areaMode ? (
                  <svg width={crosshairSize} height={crosshairSize} viewBox={`0 0 ${crosshairSize} ${crosshairSize}`}>
                    <rect x="2" y="2" width={crosshairSize - 4} height={crosshairSize - 4}
                      fill="none" stroke={isCalibrating ? '#2563eb' : '#000'} strokeWidth="2" strokeDasharray="4 2" opacity="0.9" />
                    <rect x="2" y="2" width={crosshairSize - 4} height={crosshairSize - 4}
                      fill="none" stroke="white" strokeWidth="1" opacity="0.5" />
                    <circle cx={crosshairSize / 2} cy={crosshairSize / 2} r="2" fill={isCalibrating ? '#2563eb' : '#000'} opacity="0.9" />
                  </svg>
                ) : (
                  <svg width="40" height="40" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="12" fill="none" stroke="#000" strokeWidth="2" opacity="0.8" />
                    <circle cx="20" cy="20" r="12" fill="none" stroke="white" strokeWidth="1" opacity="0.5" />
                    <line x1="20" y1="4" x2="20" y2="14" stroke="#000" strokeWidth="2" opacity="0.8" />
                    <line x1="20" y1="26" x2="20" y2="36" stroke="#000" strokeWidth="2" opacity="0.8" />
                    <line x1="4" y1="20" x2="14" y2="20" stroke="#000" strokeWidth="2" opacity="0.8" />
                    <line x1="26" y1="20" x2="36" y2="20" stroke="#000" strokeWidth="2" opacity="0.8" />
                  </svg>
                )}
              </div>
            )}
          </div>

          {/* Color info bar */}
          {(hoveredColor || selectedColor) && !isCalibrating && (
            <div className="flex items-center gap-3 text-sm font-mono p-2 bg-secondary rounded-md border border-border">
              <div
                className="w-8 h-8 rounded paint-chip"
                style={{ backgroundColor: `rgb(${(selectedColor || hoveredColor)!.join(',')})` }}
              />
              <span className="text-foreground font-bold">
                RGB({(selectedColor || hoveredColor)!.join(', ')})
              </span>
              <span className="text-primary font-bold">
                #{(selectedColor || hoveredColor)!.map(c => c.toString(16).padStart(2, '0')).join('').toUpperCase()}
              </span>
              {areaMode && (
                <span className="text-[10px] text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border">
                  {sampleSize * 2}x{sampleSize * 2}px avg
                </span>
              )}
              {calData && calStep === 'calibrated' && (
                <span className="text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 font-bold">
                  CAL
                </span>
              )}
            </div>
          )}

          {/* Metamerism warning */}
          {calStep === 'calibrated' && (
            <div className="flex items-start gap-2 p-2.5 rounded-md bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-800 leading-relaxed">
                <span className="font-bold">Calibration active.</span> This corrects white balance and exposure but cannot fix camera metamerism — 
                your phone sensor sees colour differently than your eye. Expect ~80% accuracy; always spray a test card before committing.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

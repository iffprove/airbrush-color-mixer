/**
 * ImageColorPicker Component
 * Allows users to upload/capture a photo and pick a color from it.
 * Features: crosshair overlay, area-average sampling, white-balance calibration.
 * 
 * WB Calibration: User taps a known white/neutral area in the photo.
 * The app computes the offset from pure white (255,255,255) and applies
 * that correction to all subsequent samples. This compensates for phone
 * camera auto-WB shifts (which can swing 10-20 ΔE on reds/oranges).
 * 
 * Design: Workshop Industrial
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, Upload, X, Grid3X3, Crosshair, CircleDot, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ImageColorPickerProps {
  onColorPick: (r: number, g: number, b: number) => void;
}

type WBCorrection = { rScale: number; gScale: number; bScale: number } | null;

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

  // White balance calibration
  const [wbMode, setWbMode] = useState(false); // true = "tap white reference" mode
  const [wbCorrection, setWbCorrection] = useState<WBCorrection>(null);
  const [wbReferenceColor, setWbReferenceColor] = useState<[number, number, number] | null>(null);

  const loadImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setSelectedColor(null);
        setWbCorrection(null);
        setWbReferenceColor(null);
        setWbMode(false);
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

  /** Get raw (uncorrected) color at a position */
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
    let totalR = 0, totalG = 0, totalB = 0;
    let count = 0;

    for (let i = 0; i < imageData.length; i += 4) {
      totalR += imageData[i];
      totalG += imageData[i + 1];
      totalB += imageData[i + 2];
      count++;
    }

    if (count === 0) return null;
    return [Math.round(totalR / count), Math.round(totalG / count), Math.round(totalB / count)];
  }, [areaMode, sampleSize]);

  /** Apply WB correction to a raw color */
  const applyWB = useCallback((raw: [number, number, number]): [number, number, number] => {
    if (!wbCorrection) return raw;
    return [
      Math.max(0, Math.min(255, Math.round(raw[0] * wbCorrection.rScale))),
      Math.max(0, Math.min(255, Math.round(raw[1] * wbCorrection.gScale))),
      Math.max(0, Math.min(255, Math.round(raw[2] * wbCorrection.bScale))),
    ];
  }, [wbCorrection]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const raw = getRawColorAtPosition(x, y);
    if (raw) {
      setHoveredColor(wbMode ? raw : applyWB(raw));
      setCursorPos({ x, y });
    }
  }, [getRawColorAtPosition, applyWB, wbMode]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const raw = getRawColorAtPosition(x, y);
    if (!raw) return;

    if (wbMode) {
      // Calibrating: compute WB correction from this "white" reference
      // The reference should be white (255,255,255). Compute scale factors.
      const maxChannel = Math.max(raw[0], raw[1], raw[2], 1);
      setWbCorrection({
        rScale: maxChannel / Math.max(raw[0], 1),
        gScale: maxChannel / Math.max(raw[1], 1),
        bScale: maxChannel / Math.max(raw[2], 1),
      });
      setWbReferenceColor(raw);
      setWbMode(false);
    } else {
      const corrected = applyWB(raw);
      setSelectedColor(corrected);
      onColorPick(corrected[0], corrected[1], corrected[2]);
    }
  }, [getRawColorAtPosition, applyWB, wbMode, onColorPick]);

  const handleTouch = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.changedTouches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const raw = getRawColorAtPosition(x, y);
    if (!raw) return;

    if (wbMode) {
      const maxChannel = Math.max(raw[0], raw[1], raw[2], 1);
      setWbCorrection({
        rScale: maxChannel / Math.max(raw[0], 1),
        gScale: maxChannel / Math.max(raw[1], 1),
        bScale: maxChannel / Math.max(raw[2], 1),
      });
      setWbReferenceColor(raw);
      setWbMode(false);
    } else {
      const corrected = applyWB(raw);
      setSelectedColor(corrected);
      onColorPick(corrected[0], corrected[1], corrected[2]);
    }
  }, [getRawColorAtPosition, applyWB, wbMode, onColorPick]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadImage(file);
  }, [loadImage]);

  const clearImage = useCallback(() => {
    setImage(null);
    setSelectedColor(null);
    setHoveredColor(null);
    setCursorPos(null);
    setWbCorrection(null);
    setWbReferenceColor(null);
    setWbMode(false);
  }, []);

  const resetWB = useCallback(() => {
    setWbCorrection(null);
    setWbReferenceColor(null);
  }, []);

  const crosshairSize = areaMode ? sampleSize * 2 + 4 : 40;

  return (
    <div className="space-y-4">
      {!image ? (
        <div className="workshop-panel rounded-lg p-6">
          <div className="border-2 border-dashed border-[oklch(0.35_0.01_285)] rounded-lg p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[oklch(0.25_0.005_285)] flex items-center justify-center">
                <Camera className="w-8 h-8 text-amber" />
              </div>
              <div>
                <p className="text-foreground font-medium mb-1">Upload or capture a photo</p>
                <p className="text-muted-foreground text-sm">
                  Take a photo of the surface you want to match
                </p>
              </div>
              <div className="flex gap-3 flex-wrap justify-center">
                <Button
                  onClick={() => cameraInputRef.current?.click()}
                  className="bg-primary text-primary-foreground hover:bg-amber-dark"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-[oklch(0.35_0.01_285)] text-foreground hover:bg-accent"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground/60 max-w-xs">
                Tip: Include a white card or paper in your photo for white-balance calibration. This improves colour accuracy significantly.
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="workshop-panel rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-mono">
              {wbMode ? '⚪ TAP A WHITE/NEUTRAL AREA' : 'TAP IMAGE TO SAMPLE COLOR'}
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

          {/* White Balance Calibration Controls */}
          <div className="flex items-center gap-2 p-3 rounded-md bg-[oklch(0.14_0.005_285)] border border-[oklch(0.25_0.005_285)]">
            <CircleDot className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              {wbCorrection ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-green-400">WB CALIBRATED</span>
                  <div
                    className="w-4 h-4 rounded-sm border border-white/20"
                    style={{ backgroundColor: wbReferenceColor ? `rgb(${wbReferenceColor.join(',')})` : '#fff' }}
                    title="Reference point sampled"
                  />
                  <span className="text-[10px] text-muted-foreground">
                    R×{wbCorrection.rScale.toFixed(2)} G×{wbCorrection.gScale.toFixed(2)} B×{wbCorrection.bScale.toFixed(2)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetWB}
                    className="h-5 px-1 text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                </div>
              ) : wbMode ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-blue-400 animate-pulse">TAP WHITE AREA NOW...</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setWbMode(false)}
                    className="h-5 px-2 text-xs text-muted-foreground"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">White balance:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setWbMode(true)}
                    className="h-5 px-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                  >
                    Calibrate
                  </Button>
                  <span className="text-[10px] text-muted-foreground/50">
                    (tap a white/grey area in photo)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Sampling mode controls */}
          <div className="flex items-center gap-4 p-3 rounded-md bg-[oklch(0.16_0.005_285)] border border-[oklch(0.25_0.005_285)]">
            <div className="flex items-center gap-2">
              {areaMode ? (
                <Grid3X3 className="w-4 h-4 text-amber" />
              ) : (
                <Crosshair className="w-4 h-4 text-muted-foreground" />
              )}
              <Label className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                AREA AVG
              </Label>
              <Switch
                checked={areaMode}
                onCheckedChange={setAreaMode}
                className="data-[state=checked]:bg-amber"
              />
            </div>
            {areaMode && (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Label className="text-xs font-mono text-muted-foreground whitespace-nowrap">
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
                <span className="text-xs font-mono text-amber w-10 text-right">
                  {sampleSize * 2}px
                </span>
              </div>
            )}
          </div>

          {/* Canvas area */}
          <div ref={containerRef} className="relative overflow-hidden rounded-md bg-black">
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onClick={handleClick}
              onTouchEnd={handleTouch}
              className={`block mx-auto ${wbMode ? 'cursor-cell' : 'cursor-crosshair'}`}
              style={{ maxWidth: '100%' }}
            />
            {/* WB mode overlay tint */}
            {wbMode && (
              <div className="absolute inset-0 bg-blue-500/10 pointer-events-none border-2 border-blue-400/30 rounded-md" />
            )}
            {/* Crosshair / area overlay */}
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
                    <rect
                      x="2" y="2"
                      width={crosshairSize - 4} height={crosshairSize - 4}
                      fill="none"
                      stroke={wbMode ? '#60a5fa' : 'white'}
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                      opacity="0.9"
                    />
                    <circle cx={crosshairSize / 2} cy={crosshairSize / 2} r="2" fill={wbMode ? '#60a5fa' : 'white'} opacity="0.9" />
                  </svg>
                ) : (
                  <svg width="40" height="40" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="12" fill="none" stroke={wbMode ? '#60a5fa' : 'white'} strokeWidth="1.5" opacity="0.8" />
                    <line x1="20" y1="4" x2="20" y2="14" stroke={wbMode ? '#60a5fa' : 'white'} strokeWidth="1" opacity="0.8" />
                    <line x1="20" y1="26" x2="20" y2="36" stroke={wbMode ? '#60a5fa' : 'white'} strokeWidth="1" opacity="0.8" />
                    <line x1="4" y1="20" x2="14" y2="20" stroke={wbMode ? '#60a5fa' : 'white'} strokeWidth="1" opacity="0.8" />
                    <line x1="26" y1="20" x2="36" y2="20" stroke={wbMode ? '#60a5fa' : 'white'} strokeWidth="1" opacity="0.8" />
                  </svg>
                )}
              </div>
            )}
          </div>

          {/* Color info bar */}
          {(hoveredColor || selectedColor) && !wbMode && (
            <div className="flex items-center gap-3 text-sm font-mono">
              <div
                className="w-8 h-8 rounded paint-chip"
                style={{
                  backgroundColor: `rgb(${(selectedColor || hoveredColor)!.join(',')})`
                }}
              />
              <span className="text-muted-foreground">
                RGB({(selectedColor || hoveredColor)!.join(', ')})
              </span>
              <span className="text-amber">
                #{(selectedColor || hoveredColor)!.map(c => c.toString(16).padStart(2, '0')).join('').toUpperCase()}
              </span>
              {areaMode && (
                <span className="text-[10px] text-muted-foreground bg-[oklch(0.18_0.005_285)] px-1.5 py-0.5 rounded">
                  {sampleSize * 2}x{sampleSize * 2}px avg
                </span>
              )}
              {wbCorrection && (
                <span className="text-[10px] text-green-400 bg-green-900/20 px-1.5 py-0.5 rounded">
                  WB
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

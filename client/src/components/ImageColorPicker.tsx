/**
 * ImageColorPicker Component
 * Allows users to upload/capture a photo and pick a color from it.
 * Features crosshair overlay and area-average sampling mode.
 * 
 * Design: Workshop Industrial
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, Upload, X, Grid3X3, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ImageColorPickerProps {
  onColorPick: (r: number, g: number, b: number) => void;
}

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
  const [sampleSize, setSampleSize] = useState(10); // radius in pixels

  const loadImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setSelectedColor(null);
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

  const getColorAtPosition = useCallback((x: number, y: number): [number, number, number] | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    if (!areaMode) {
      // Single pixel mode
      const pixel = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
      return [pixel[0], pixel[1], pixel[2]];
    }

    // Area-average mode: sample a square region
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

    return [
      Math.round(totalR / count),
      Math.round(totalG / count),
      Math.round(totalB / count),
    ];
  }, [areaMode, sampleSize]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const color = getColorAtPosition(x, y);
    if (color) {
      setHoveredColor(color);
      setCursorPos({ x, y });
    }
  }, [getColorAtPosition]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const color = getColorAtPosition(x, y);
    if (color) {
      setSelectedColor(color);
      onColorPick(color[0], color[1], color[2]);
    }
  }, [getColorAtPosition, onColorPick]);

  const handleTouch = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.changedTouches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const color = getColorAtPosition(x, y);
    if (color) {
      setSelectedColor(color);
      onColorPick(color[0], color[1], color[2]);
    }
  }, [getColorAtPosition, onColorPick]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadImage(file);
  }, [loadImage]);

  const clearImage = useCallback(() => {
    setImage(null);
    setSelectedColor(null);
    setHoveredColor(null);
    setCursorPos(null);
  }, []);

  // Crosshair size based on mode
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
              TAP IMAGE TO SAMPLE COLOR
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
              className="block mx-auto cursor-crosshair"
              style={{ maxWidth: '100%' }}
            />
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
                  // Area sampling indicator (square region)
                  <svg width={crosshairSize} height={crosshairSize} viewBox={`0 0 ${crosshairSize} ${crosshairSize}`}>
                    <rect
                      x="2"
                      y="2"
                      width={crosshairSize - 4}
                      height={crosshairSize - 4}
                      fill="none"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                      opacity="0.9"
                    />
                    <rect
                      x="2"
                      y="2"
                      width={crosshairSize - 4}
                      height={crosshairSize - 4}
                      fill="none"
                      stroke="black"
                      strokeWidth="0.5"
                      opacity="0.4"
                    />
                    {/* Center dot */}
                    <circle cx={crosshairSize / 2} cy={crosshairSize / 2} r="2" fill="white" opacity="0.9" />
                  </svg>
                ) : (
                  // Single pixel crosshair
                  <svg width="40" height="40" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="12" fill="none" stroke="white" strokeWidth="1.5" opacity="0.8" />
                    <circle cx="20" cy="20" r="12" fill="none" stroke="black" strokeWidth="0.5" opacity="0.4" />
                    <line x1="20" y1="4" x2="20" y2="14" stroke="white" strokeWidth="1" opacity="0.8" />
                    <line x1="20" y1="26" x2="20" y2="36" stroke="white" strokeWidth="1" opacity="0.8" />
                    <line x1="4" y1="20" x2="14" y2="20" stroke="white" strokeWidth="1" opacity="0.8" />
                    <line x1="26" y1="20" x2="36" y2="20" stroke="white" strokeWidth="1" opacity="0.8" />
                  </svg>
                )}
              </div>
            )}
          </div>

          {/* Color info bar */}
          {(hoveredColor || selectedColor) && (
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}

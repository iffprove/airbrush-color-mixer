/**
 * ImageColorPicker Component
 * Allows users to upload/capture a photo and pick a color from it.
 * Features a crosshair overlay for precise color sampling.
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

    // Fit image to container
    const containerWidth = container.clientWidth;
    const containerHeight = Math.min(400, window.innerHeight * 0.45);
    const scale = Math.min(containerWidth / image.width, containerHeight / image.height);
    
    canvas.width = image.width * scale;
    canvas.height = image.height * scale;
    
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }, [image]);

  const getColorAtPosition = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const pixel = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
    return [pixel[0], pixel[1], pixel[2]] as [number, number, number];
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const color = getColorAtPosition(e);
    if (color) {
      setHoveredColor(color);
      const rect = canvasRef.current!.getBoundingClientRect();
      setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, [getColorAtPosition]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const color = getColorAtPosition(e);
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
        <div className="workshop-panel rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
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
          <div ref={containerRef} className="relative overflow-hidden rounded-md bg-black">
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onClick={handleClick}
              onTouchEnd={(e) => {
                const touch = e.changedTouches[0];
                const canvas = canvasRef.current;
                if (!canvas) return;
                const rect = canvas.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                const pixel = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
                const color: [number, number, number] = [pixel[0], pixel[1], pixel[2]];
                setSelectedColor(color);
                onColorPick(color[0], color[1], color[2]);
              }}
              className="block mx-auto cursor-crosshair"
              style={{ maxWidth: '100%' }}
            />
            {/* Crosshair overlay */}
            {cursorPos && (
              <div
                className="pointer-events-none absolute"
                style={{
                  left: cursorPos.x - 20,
                  top: cursorPos.y - 20,
                  width: 40,
                  height: 40,
                }}
              >
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="12" fill="none" stroke="white" strokeWidth="1.5" opacity="0.8" />
                  <circle cx="20" cy="20" r="12" fill="none" stroke="black" strokeWidth="0.5" opacity="0.4" />
                  <line x1="20" y1="4" x2="20" y2="14" stroke="white" strokeWidth="1" opacity="0.8" />
                  <line x1="20" y1="26" x2="20" y2="36" stroke="white" strokeWidth="1" opacity="0.8" />
                  <line x1="4" y1="20" x2="14" y2="20" stroke="white" strokeWidth="1" opacity="0.8" />
                  <line x1="26" y1="20" x2="36" y2="20" stroke="white" strokeWidth="1" opacity="0.8" />
                </svg>
              </div>
            )}
          </div>
          {/* Color info bar */}
          {(hoveredColor || selectedColor) && (
            <div className="mt-3 flex items-center gap-3 text-sm font-mono">
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}

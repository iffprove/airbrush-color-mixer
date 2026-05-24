/**
 * Home Page — Airbrush Color Mixer
 * 
 * Design: Workshop Industrial
 * - Dark charcoal base with warm amber accents
 * - Chunky card panels stacked like tool-chest drawers
 * - Monospaced type for paint codes and ratios
 * - Paint swatches that look like physical color chips
 */

import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Camera, Palette, BookOpen, Crosshair, Zap } from 'lucide-react';
import ImageColorPicker from '@/components/ImageColorPicker';
import ManualColorPicker from '@/components/ManualColorPicker';
import FormulaDisplay from '@/components/FormulaDisplay';
import CategoryFilter from '@/components/CategoryFilter';
import PaintCatalog from '@/components/PaintCatalog';
import { findMixFormula, MixResult } from '@/lib/colorMixer';
import { Paint, PaintBrand, PaintCategory } from '@/lib/paintDatabase';

const HERO_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663689557676/4ZgWXbNjMZfvXRearFfQHB/hero-workshop-ioxQCiL97J44iDCA378o5Q.webp';
const MIXING_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663689557676/4ZgWXbNjMZfvXRearFfQHB/color-mixing-abstract-cnu7oG5HuCLWYUF5izwuA6.webp';

export default function Home() {
  const [targetColor, setTargetColor] = useState<[number, number, number] | null>(null);
  const [mixResult, setMixResult] = useState<MixResult | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<PaintBrand[]>(['createx-wicked']);
  const [selectedCategories, setSelectedCategories] = useState<PaintCategory[]>(['transparent', 'opaque', 'detail', 'standard']);
  const [activeTab, setActiveTab] = useState('camera');
  const [showCatalog, setShowCatalog] = useState(false);

  const recalculate = useCallback((r: number, g: number, b: number, brands: PaintBrand[], categories: PaintCategory[]) => {
    const result = findMixFormula(r, g, b, { brands, categories });
    setMixResult(result);
  }, []);

  const handleColorPick = useCallback((r: number, g: number, b: number) => {
    setTargetColor([r, g, b]);
    recalculate(r, g, b, selectedBrands, selectedCategories);
  }, [selectedBrands, selectedCategories, recalculate]);

  const handleBrandsChange = useCallback((newBrands: PaintBrand[]) => {
    setSelectedBrands(newBrands);
    if (targetColor) {
      recalculate(targetColor[0], targetColor[1], targetColor[2], newBrands, selectedCategories);
    }
  }, [targetColor, selectedCategories, recalculate]);

  const handleCategoriesChange = useCallback((newCategories: PaintCategory[]) => {
    setSelectedCategories(newCategories);
    if (targetColor) {
      recalculate(targetColor[0], targetColor[1], targetColor[2], selectedBrands, newCategories);
    }
  }, [targetColor, selectedBrands, recalculate]);

  const handlePaintSelect = useCallback((paint: Paint) => {
    setTargetColor(paint.rgb);
    recalculate(paint.rgb[0], paint.rgb[1], paint.rgb[2], selectedBrands, selectedCategories);
    setShowCatalog(false);
  }, [selectedBrands, selectedCategories, recalculate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="relative container py-8 sm:py-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber/20 flex items-center justify-center">
              <Crosshair className="w-5 h-5 text-amber" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Color Mixer
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg">
            Match any color to airbrush paint formulas from <span className="text-amber font-medium">7 popular brands</span>.
            Snap a photo or pick a color — get your mixing recipe instantly.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container pb-12 space-y-6">
        {/* Input Section */}
        <section>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 bg-[oklch(0.20_0.005_285)] border border-[oklch(0.30_0.01_285)]">
              <TabsTrigger
                value="camera"
                className="font-mono text-sm data-[state=active]:bg-amber/20 data-[state=active]:text-amber"
              >
                <Camera className="w-4 h-4 mr-2" />
                Photo
              </TabsTrigger>
              <TabsTrigger
                value="manual"
                className="font-mono text-sm data-[state=active]:bg-amber/20 data-[state=active]:text-amber"
              >
                <Palette className="w-4 h-4 mr-2" />
                Manual
              </TabsTrigger>
            </TabsList>
            <TabsContent value="camera" className="mt-4">
              <ImageColorPicker onColorPick={handleColorPick} />
            </TabsContent>
            <TabsContent value="manual" className="mt-4">
              <ManualColorPicker
                onColorPick={handleColorPick}
                initialColor={targetColor || undefined}
              />
            </TabsContent>
          </Tabs>
        </section>

        {/* Brand & Category Filter */}
        <section>
          <CategoryFilter
            selectedBrands={selectedBrands}
            selectedCategories={selectedCategories}
            onBrandsChange={handleBrandsChange}
            onCategoriesChange={handleCategoriesChange}
          />
        </section>

        {/* Results Section */}
        {mixResult && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber" />
              <h2 className="font-mono text-sm text-muted-foreground uppercase tracking-wider">
                MIXING FORMULA
              </h2>
            </div>
            <FormulaDisplay result={mixResult} />
          </section>
        )}

        {/* Paint Catalog Toggle */}
        <section>
          <Button
            variant="outline"
            onClick={() => setShowCatalog(!showCatalog)}
            className="w-full border-[oklch(0.30_0.01_285)] text-foreground hover:bg-accent font-mono"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {showCatalog ? 'HIDE' : 'BROWSE'} PAINT CATALOG
          </Button>
          {showCatalog && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <PaintCatalog onSelectPaint={handlePaintSelect} />
            </div>
          )}
        </section>

        {/* How It Works */}
        {!mixResult && (
          <section className="workshop-panel rounded-lg p-6">
            <h2 className="font-mono text-sm text-amber uppercase tracking-wider mb-4">
              HOW IT WORKS
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-amber" />
                </div>
                <h3 className="font-medium text-foreground text-sm">1. Capture Color</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Take a photo of the surface you want to match, or enter a color manually using hex codes or RGB sliders.
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center">
                  <Crosshair className="w-5 h-5 text-amber" />
                </div>
                <h3 className="font-medium text-foreground text-sm">2. Sample Point</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tap precisely on the photo to sample the exact color you need. The crosshair helps you pick the right spot.
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber" />
                </div>
                <h3 className="font-medium text-foreground text-sm">3. Get Formula</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Instantly receive a mixing formula with exact paint codes and ratios by volume from your selected brands.
                </p>
              </div>
            </div>
            {/* Supported brands */}
            <div className="mt-6 pt-4 border-t border-[oklch(0.25_0.005_285)]">
              <p className="text-xs text-muted-foreground font-mono mb-2">SUPPORTED BRANDS:</p>
              <div className="flex flex-wrap gap-2">
                {['Createx Wicked', 'Createx Illustration', 'Vallejo Model Air', 'Vallejo Game Air', "E'TAC", 'Badger Minitaire', 'Com-Art'].map(name => (
                  <span key={name} className="text-[10px] font-mono px-2 py-1 rounded bg-[oklch(0.18_0.005_285)] text-muted-foreground border border-[oklch(0.25_0.005_285)]">
                    {name}
                  </span>
                ))}
              </div>
            </div>
            {/* Feature image */}
            <div className="mt-6 rounded-lg overflow-hidden opacity-80">
              <img
                src={MIXING_IMAGE}
                alt="Paint mixing visualization"
                className="w-full h-32 sm:h-48 object-cover"
              />
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[oklch(0.25_0.005_285)] py-6">
        <div className="container">
          <p className="text-xs text-muted-foreground text-center font-mono">
            AIRBRUSH COLOR MIXER — Multi-Brand Paint Formula Calculator
          </p>
          <p className="text-[10px] text-muted-foreground/60 text-center mt-1">
            Color values are approximations. Always test mix on scrap material first.
          </p>
        </div>
      </footer>
    </div>
  );
}

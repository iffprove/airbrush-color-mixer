/**
 * Home Page — Airbrush Color Mixer v2
 * 
 * Design: Light, high-contrast workshop theme
 * - Bright white/warm-grey base for visibility under shop lighting
 * - Bold dark text and strong orange-amber accents
 * - Large touch targets for dirty/gloved hands
 * - Monospaced type for paint codes and ratios
 */

import { useState, useCallback } from 'react';
import { downloadCalibrationCard } from '@/lib/calibrationCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Camera, Palette, BookOpen, Crosshair, Zap, Package, Download, AlertTriangle, Info, ChevronDown, ChevronRight } from 'lucide-react';
import ImageColorPicker from '@/components/ImageColorPicker';
import ManualColorPicker from '@/components/ManualColorPicker';
import FormulaDisplay from '@/components/FormulaDisplay';
import CategoryFilter from '@/components/CategoryFilter';
import PaintCatalog from '@/components/PaintCatalog';
import SavedRecipes from '@/components/SavedRecipes';
import PaintInventory from '@/components/PaintInventory';
import { useInventory } from '@/hooks/useInventory';
import { findMixFormula, MixResult } from '@/lib/colorMixer';
import { Paint, PaintBrand, PaintCategory } from '@/lib/paintDatabase';

export default function Home() {
  const [targetColor, setTargetColor] = useState<[number, number, number] | null>(null);
  const [mixResult, setMixResult] = useState<MixResult | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<PaintBrand[]>(['createx-wicked']);
  const [selectedCategories, setSelectedCategories] = useState<PaintCategory[]>(['transparent', 'opaque', 'detail', 'standard', 'pearl', 'metallic', 'fluorescent']);
  const [activeTab, setActiveTab] = useState('camera');
  const [showCatalog, setShowCatalog] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showCalibration, setShowCalibration] = useState(false);

  const inventory = useInventory();

  const recalculate = useCallback((
    r: number, g: number, b: number,
    brands: PaintBrand[],
    categories: PaintCategory[],
    useInvOnly: boolean,
    ownedSet: Set<string>
  ) => {
    const result = findMixFormula(r, g, b, {
      brands,
      categories,
      inventoryFilter: useInvOnly && ownedSet.size > 0 ? ownedSet : undefined,
    });
    setMixResult(result);
  }, []);

  const handleColorPick = useCallback((r: number, g: number, b: number) => {
    setTargetColor([r, g, b]);
    recalculate(r, g, b, selectedBrands, selectedCategories, inventory.useInventoryOnly, inventory.ownedPaints);
  }, [selectedBrands, selectedCategories, inventory.useInventoryOnly, inventory.ownedPaints, recalculate]);

  const handleBrandsChange = useCallback((newBrands: PaintBrand[]) => {
    setSelectedBrands(newBrands);
    if (targetColor) {
      recalculate(targetColor[0], targetColor[1], targetColor[2], newBrands, selectedCategories, inventory.useInventoryOnly, inventory.ownedPaints);
    }
  }, [targetColor, selectedCategories, inventory.useInventoryOnly, inventory.ownedPaints, recalculate]);

  const handleCategoriesChange = useCallback((newCategories: PaintCategory[]) => {
    setSelectedCategories(newCategories);
    if (targetColor) {
      recalculate(targetColor[0], targetColor[1], targetColor[2], selectedBrands, newCategories, inventory.useInventoryOnly, inventory.ownedPaints);
    }
  }, [targetColor, selectedBrands, inventory.useInventoryOnly, inventory.ownedPaints, recalculate]);

  const handlePaintSelect = useCallback((paint: Paint) => {
    setTargetColor(paint.rgb);
    recalculate(paint.rgb[0], paint.rgb[1], paint.rgb[2], selectedBrands, selectedCategories, inventory.useInventoryOnly, inventory.ownedPaints);
    setShowCatalog(false);
  }, [selectedBrands, selectedCategories, inventory.useInventoryOnly, inventory.ownedPaints, recalculate]);

  const handleInventoryToggle = useCallback(() => {
    inventory.toggleUseInventoryOnly();
    if (targetColor) {
      const newUseInvOnly = !inventory.useInventoryOnly;
      recalculate(targetColor[0], targetColor[1], targetColor[2], selectedBrands, selectedCategories, newUseInvOnly, inventory.ownedPaints);
    }
  }, [targetColor, selectedBrands, selectedCategories, inventory, recalculate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-border bg-card">
        <div className="container py-5 sm:py-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-primary/30">
              <Crosshair className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Color Mixer
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg font-medium">
            Match any color to airbrush paint formulas from <span className="text-primary font-bold">9 brands</span>.
            Photo → formula → spray.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 pb-12 space-y-6">
        {/* Input Section */}
        <section>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 bg-secondary border-2 border-border h-12">
              <TabsTrigger
                value="camera"
                className="font-mono text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-10"
              >
                <Camera className="w-4 h-4 mr-2" />
                Photo
              </TabsTrigger>
              <TabsTrigger
                value="manual"
                className="font-mono text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-10"
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

        {/* Paint Inventory */}
        <section>
          <Button
            variant="outline"
            onClick={() => setShowInventory(!showInventory)}
            className="w-full border-2 border-border text-foreground hover:bg-accent font-mono font-bold h-12"
          >
            <Package className="w-4 h-4 mr-2" />
            {showInventory ? 'HIDE' : 'MANAGE'} MY PAINT SHELF
            {inventory.ownedCount > 0 && (
              <span className="ml-2 text-xs text-primary-foreground bg-primary px-2 py-0.5 rounded font-bold">
                {inventory.ownedCount} owned
              </span>
            )}
          </Button>
          {showInventory && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <PaintInventory
                ownedPaints={inventory.ownedPaints}
                useInventoryOnly={inventory.useInventoryOnly}
                onTogglePaint={inventory.togglePaint}
                onAddAllFromBrand={inventory.addAllFromBrand}
                onRemoveAllFromBrand={inventory.removeAllFromBrand}
                onClearAll={inventory.clearAll}
                onToggleUseInventoryOnly={handleInventoryToggle}
                isOwned={inventory.isOwned}
              />
            </div>
          )}
        </section>

        {/* Results Section */}
        {mixResult && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-primary" />
              <h2 className="font-mono text-sm text-foreground uppercase tracking-wider font-bold">
                MIXING FORMULA
              </h2>
              {inventory.useInventoryOnly && inventory.ownedCount > 0 && (
                <span className="text-[10px] font-mono text-green-800 bg-green-100 px-2 py-0.5 rounded border border-green-300 font-bold">
                  SHELF ONLY
                </span>
              )}
            </div>
            <FormulaDisplay result={mixResult} />
          </section>
        )}

        {/* Saved Recipes */}
        <section>
          <SavedRecipes currentResult={mixResult} />
        </section>

        {/* Paint Catalog Toggle */}
        <section>
          <Button
            variant="outline"
            onClick={() => setShowCatalog(!showCatalog)}
            className="w-full border-2 border-border text-foreground hover:bg-accent font-mono font-bold h-12"
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

        {/* Calibration Card & Accuracy Info — Collapsible */}
        <section className="workshop-panel rounded-lg overflow-hidden">
          <button
            onClick={() => setShowCalibration(!showCalibration)}
            className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors duration-150"
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-primary" />
              <span className="font-mono text-xs text-foreground uppercase tracking-wider font-bold">
                CALIBRATION & ACCURACY
              </span>
            </div>
            {showCalibration ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          {!showCalibration && (
            <div className="px-4 pb-3">
              <p className="text-[10px] text-muted-foreground">Download calibration card, learn about accuracy limits</p>
            </div>
          )}
          {showCalibration && (
            <div className="px-4 pb-4 space-y-4 animate-in fade-in slide-in-from-top-1 duration-150">
              <p className="text-xs text-muted-foreground leading-relaxed">
                For accurate color capture, print this calibration card on <span className="font-bold text-foreground">matte cardstock</span> and
                keep it in your workshop. Place it next to the surface you're photographing, then use the 2-point calibration
                (white patch + black patch) to correct color cast and exposure.
              </p>
              <div className="flex flex-wrap gap-3 items-center">
                <button
                  onClick={downloadCalibrationCard}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground font-mono text-sm font-bold hover:bg-amber-dark transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Calibration Card (PNG)
                </button>
                <span className="text-[10px] text-muted-foreground">Free - print on matte cardstock</span>
              </div>
              <div className="p-3 rounded-md bg-blue-50 border border-blue-200">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                  <div className="text-[11px] text-blue-900 leading-relaxed space-y-1">
                    <p><span className="font-bold">For professionals:</span> A Kodak/X-Rite 18% gray card ($10-20 from camera stores) provides even more reliable reference than printed patches.</p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-md bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div className="text-[11px] text-amber-900 leading-relaxed space-y-1">
                    <p><span className="font-bold">Honest limitation:</span> Even with perfect calibration, phone cameras have different spectral sensitivity than human eyes (metamerism). Two colors that look identical to you can read as different RGB values on camera, and vice versa.</p>
                    <p>Calibration gets you ~80% of the way. The remaining 20% is a fundamental limit of phone photography. <span className="font-bold">Always spray a test card before committing to a job.</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* How It Works */}
        {!mixResult && (
          <section className="workshop-panel rounded-lg p-6">
            <h2 className="font-mono text-sm text-primary uppercase tracking-wider mb-4 font-bold">
              HOW IT WORKS
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Camera className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-sm">1. Capture Color</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Take a photo with your calibration card in frame. Run 2-point cal (white + black patches) for corrected sampling.
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Crosshair className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-sm">2. Sample Area</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Use area-average sampling for textured surfaces, or single-pixel for flat colours. Adjust sample size for best results.
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-sm">3. Get Formula</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Get a mixing formula with raw \u0394E rating, ml/drops calculator, and the option to restrict to paints you own.
                </p>
              </div>
            </div>
            {/* Supported brands */}
            <div className="mt-6 pt-4 border-t-2 border-border">
              <p className="text-xs text-muted-foreground font-mono mb-2 font-bold">SUPPORTED BRANDS:</p>
              <div className="flex flex-wrap gap-2">
                {['Createx Wicked', 'Createx Illustration', 'Candy2o', 'Auto-Air', 'Vallejo Model Air', 'Vallejo Game Air', "E'TAC", 'Badger Minitaire', 'Com-Art'].map(name => (
                  <span key={name} className="text-[10px] font-mono px-2 py-1 rounded bg-secondary text-foreground border-2 border-border font-bold">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-border py-6 bg-card">
        <div className="container">
          <p className="text-xs text-muted-foreground text-center font-mono font-bold">
            AIRBRUSH COLOR MIXER — Multi-Brand Paint Formula Calculator
          </p>
          <p className="text-[10px] text-muted-foreground/80 text-center mt-1">
            Color values are approximations. Always test mix on scrap material first.
          </p>
        </div>
      </footer>
    </div>
  );
}

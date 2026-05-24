/**
 * PaintCatalog Component
 * Displays paint catalogs organized by brand and category.
 * Users can browse and tap a paint to use it as a target color.
 */

import { useState } from 'react';
import { Paint, PaintBrand, PaintCategory, brands, getPaintsByBrand, getPaintsByBrandAndCategory, getBrandCategories } from '@/lib/paintDatabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaintCatalogProps {
  onSelectPaint?: (paint: Paint) => void;
}

const categoryLabels: Record<PaintCategory, string> = {
  transparent: 'Transparent',
  opaque: 'Opaque',
  detail: 'Detail',
  pearl: 'Pearl',
  metallic: 'Metallic',
  fluorescent: 'Fluorescent',
  standard: 'Standard',
  primer: 'Primer',
  wash: 'Wash',
  ink: 'Ink',
};

function PaintSwatch({ paint, onClick }: { paint: Paint; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors duration-150 w-full text-left"
      title={`${paint.code} — ${paint.name}`}
    >
      <div
        className="w-8 h-8 rounded paint-chip flex-shrink-0 group-hover:scale-110 transition-transform duration-150"
        style={{ backgroundColor: `rgb(${paint.rgb.join(',')})` }}
      />
      <div className="min-w-0 flex-1">
        <p className="font-mono text-xs text-amber truncate">{paint.code}</p>
        <p className="text-xs text-foreground truncate">{paint.name}</p>
      </div>
    </button>
  );
}

export default function PaintCatalog({ onSelectPaint }: PaintCatalogProps) {
  const [selectedBrand, setSelectedBrand] = useState<PaintBrand>('createx-wicked');
  const brandCategories = getBrandCategories(selectedBrand);
  const defaultCategory = brandCategories[0] || 'standard';

  return (
    <div className="workshop-panel rounded-lg p-4 space-y-4">
      {/* Brand selector */}
      <div className="flex items-center gap-3">
        <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap">
          BRAND:
        </h3>
        <Select value={selectedBrand} onValueChange={(v) => setSelectedBrand(v as PaintBrand)}>
          <SelectTrigger className="bg-[oklch(0.18_0.005_285)] border-[oklch(0.30_0.01_285)] text-foreground font-mono text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[oklch(0.20_0.005_285)] border-[oklch(0.30_0.01_285)]">
            {brands.map(brand => (
              <SelectItem key={brand.id} value={brand.id} className="font-mono text-sm">
                {brand.shortName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brand description */}
      <p className="text-xs text-muted-foreground">
        {brands.find(b => b.id === selectedBrand)?.description}
      </p>

      {/* Category tabs */}
      <Tabs defaultValue={defaultCategory} key={selectedBrand} className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-[oklch(0.18_0.005_285)] p-1 rounded-md">
          {brandCategories.map(cat => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="flex-1 min-w-[60px] text-xs font-mono data-[state=active]:bg-amber/20 data-[state=active]:text-amber"
            >
              {categoryLabels[cat] || cat}
            </TabsTrigger>
          ))}
        </TabsList>
        {brandCategories.map(cat => (
          <TabsContent key={cat} value={cat} className="mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-[300px] overflow-y-auto pr-1">
              {getPaintsByBrandAndCategory(selectedBrand, cat).map(paint => (
                <PaintSwatch
                  key={paint.code}
                  paint={paint}
                  onClick={() => onSelectPaint?.(paint)}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <p className="text-[10px] text-muted-foreground text-center">
        {getPaintsByBrand(selectedBrand).length} colors available • Tap a swatch to use as target
      </p>
    </div>
  );
}

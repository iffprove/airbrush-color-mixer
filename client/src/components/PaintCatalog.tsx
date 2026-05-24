/**
 * PaintCatalog Component
 * Displays the full Createx Wicked Colors catalog organized by category.
 * Users can browse and tap a paint to use it as a target color.
 */

import { useState } from 'react';
import { Paint, wickedColors, getPaintsByCategory } from '@/lib/paintDatabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PaintCatalogProps {
  onSelectPaint?: (paint: Paint) => void;
}

const categories: { key: Paint['category']; label: string }[] = [
  { key: 'transparent', label: 'Standard' },
  { key: 'opaque', label: 'Opaque' },
  { key: 'detail', label: 'Detail' },
  { key: 'pearl', label: 'Pearl' },
  { key: 'metallic', label: 'Metallic' },
  { key: 'fluorescent', label: 'Fluoro' },
];

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
  return (
    <div className="workshop-panel rounded-lg p-4">
      <h3 className="font-mono text-sm text-muted-foreground uppercase tracking-wider mb-3">
        CREATEX WICKED COLORS CATALOG
      </h3>
      <Tabs defaultValue="transparent" className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-[oklch(0.18_0.005_285)] p-1 rounded-md">
          {categories.map(cat => (
            <TabsTrigger
              key={cat.key}
              value={cat.key}
              className="flex-1 min-w-[60px] text-xs font-mono data-[state=active]:bg-amber/20 data-[state=active]:text-amber"
            >
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map(cat => (
          <TabsContent key={cat.key} value={cat.key} className="mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-[300px] overflow-y-auto pr-1">
              {getPaintsByCategory(cat.key).map(paint => (
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
    </div>
  );
}

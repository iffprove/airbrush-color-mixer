/**
 * PaintInventory Component
 * Allows users to manage which paints they own.
 * Features bulk add/remove by brand, search, and visual indicators.
 * 
 * Design: Workshop Industrial
 */

import { useState, useMemo } from 'react';
import { Paint, PaintBrand, brands, allPaints, getPaintsByBrand } from '@/lib/paintDatabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check, Package, Search, PlusCircle, MinusCircle, Trash2 } from 'lucide-react';

interface PaintInventoryProps {
  ownedPaints: Set<string>;
  useInventoryOnly: boolean;
  onTogglePaint: (brand: PaintBrand, code: string) => void;
  onAddAllFromBrand: (brand: PaintBrand, codes: string[]) => void;
  onRemoveAllFromBrand: (brand: PaintBrand, codes: string[]) => void;
  onClearAll: () => void;
  onToggleUseInventoryOnly: () => void;
  isOwned: (brand: PaintBrand, code: string) => boolean;
}

export default function PaintInventory({
  ownedPaints,
  useInventoryOnly,
  onTogglePaint,
  onAddAllFromBrand,
  onRemoveAllFromBrand,
  onClearAll,
  onToggleUseInventoryOnly,
  isOwned,
}: PaintInventoryProps) {
  const [selectedBrand, setSelectedBrand] = useState<PaintBrand>('createx-wicked');
  const [searchQuery, setSearchQuery] = useState('');

  const brandPaints = useMemo(() => getPaintsByBrand(selectedBrand), [selectedBrand]);

  const filteredPaints = useMemo(() => {
    if (!searchQuery.trim()) return brandPaints;
    const q = searchQuery.toLowerCase();
    return brandPaints.filter(
      p => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
    );
  }, [brandPaints, searchQuery]);

  const ownedInBrand = useMemo(() => {
    return brandPaints.filter(p => isOwned(p.brand, p.code)).length;
  }, [brandPaints, isOwned]);

  const handleAddAll = () => {
    const codes = filteredPaints.map(p => p.code);
    onAddAllFromBrand(selectedBrand, codes);
  };

  const handleRemoveAll = () => {
    const codes = filteredPaints.map(p => p.code);
    onRemoveAllFromBrand(selectedBrand, codes);
  };

  return (
    <div className="workshop-panel rounded-lg p-4 space-y-4">
      {/* Header with inventory toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-amber" />
          <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            MY PAINT SHELF
          </h3>
          <span className="text-xs font-mono text-amber bg-amber/10 px-2 py-0.5 rounded">
            {ownedPaints.size} owned
          </span>
        </div>
      </div>

      {/* Use inventory only toggle */}
      <div className="flex items-center justify-between p-3 rounded-md bg-[oklch(0.16_0.005_285)] border border-[oklch(0.25_0.005_285)]">
        <div className="flex items-center gap-2">
          <Label className="text-xs font-mono text-muted-foreground">
            MIX ONLY FROM MY SHELF
          </Label>
        </div>
        <Switch
          checked={useInventoryOnly}
          onCheckedChange={onToggleUseInventoryOnly}
          className="data-[state=checked]:bg-amber"
        />
      </div>
      {useInventoryOnly && ownedPaints.size === 0 && (
        <p className="text-xs text-orange-400 bg-orange-900/20 border border-orange-700/30 rounded px-3 py-2">
          You haven't added any paints yet. The mixer needs at least a few paints to generate formulas. Add your paints below.
        </p>
      )}

      {/* Brand selector */}
      <div className="flex items-center gap-2">
        <Select value={selectedBrand} onValueChange={(v) => { setSelectedBrand(v as PaintBrand); setSearchQuery(''); }}>
          <SelectTrigger className="bg-[oklch(0.18_0.005_285)] border-[oklch(0.30_0.01_285)] text-foreground font-mono text-sm flex-1">
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
        <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
          {ownedInBrand}/{brandPaints.length}
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or code..."
          className="pl-9 bg-[oklch(0.16_0.005_285)] border-[oklch(0.30_0.01_285)] text-foreground text-sm placeholder:text-muted-foreground/50"
        />
      </div>

      {/* Bulk actions */}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddAll}
          className="text-xs text-green-400 hover:text-green-300 hover:bg-green-900/20 font-mono"
        >
          <PlusCircle className="w-3 h-3 mr-1" />
          Add All{searchQuery ? ' Filtered' : ''}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemoveAll}
          className="text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20 font-mono"
        >
          <MinusCircle className="w-3 h-3 mr-1" />
          Remove All{searchQuery ? ' Filtered' : ''}
        </Button>
        {ownedPaints.size > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-xs text-muted-foreground hover:text-destructive font-mono ml-auto"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Clear Shelf
          </Button>
        )}
      </div>

      {/* Paint grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-[320px] overflow-y-auto pr-1">
        {filteredPaints.map(paint => {
          const owned = isOwned(paint.brand, paint.code);
          return (
            <button
              key={paint.code}
              onClick={() => onTogglePaint(paint.brand, paint.code)}
              className={`group flex items-center gap-2 p-2 rounded-md transition-colors duration-150 w-full text-left ${
                owned
                  ? 'bg-amber/10 border border-amber/30'
                  : 'hover:bg-accent border border-transparent'
              }`}
            >
              {/* Owned indicator */}
              <div className={`w-5 h-5 rounded-sm flex items-center justify-center flex-shrink-0 transition-colors ${
                owned ? 'bg-amber text-black' : 'bg-[oklch(0.22_0.005_285)] text-transparent group-hover:text-muted-foreground/30'
              }`}>
                <Check className="w-3 h-3" />
              </div>
              {/* Color swatch */}
              <div
                className="w-6 h-6 rounded paint-chip flex-shrink-0"
                style={{ backgroundColor: `rgb(${paint.rgb.join(',')})` }}
              />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[11px] text-amber truncate">{paint.code}</p>
                <p className="text-[11px] text-foreground truncate">{paint.name}</p>
              </div>
            </button>
          );
        })}
      </div>

      {filteredPaints.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">
          No paints match your search.
        </p>
      )}
    </div>
  );
}

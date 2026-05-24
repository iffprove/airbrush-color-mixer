/**
 * PaintInventory Component
 * Manage owned paints. Light theme, high-contrast.
 */

import { useState, useMemo } from 'react';
import { PaintBrand, brands, getPaintsByBrand } from '@/lib/paintDatabase';
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-primary" />
          <h3 className="font-mono text-xs text-foreground uppercase tracking-wider font-bold">
            MY PAINT SHELF
          </h3>
          <span className="text-xs font-mono text-primary-foreground bg-primary px-2 py-0.5 rounded font-bold">
            {ownedPaints.size} owned
          </span>
        </div>
      </div>

      {/* Use inventory only toggle */}
      <div className="flex items-center justify-between p-3 rounded-md bg-secondary border-2 border-border">
        <Label className="text-xs font-mono text-foreground font-bold">
          MIX ONLY FROM MY SHELF
        </Label>
        <Switch
          checked={useInventoryOnly}
          onCheckedChange={onToggleUseInventoryOnly}
          className="data-[state=checked]:bg-primary"
        />
      </div>
      {useInventoryOnly && ownedPaints.size === 0 && (
        <p className="text-xs text-orange-800 bg-orange-100 border-2 border-orange-300 rounded px-3 py-2 font-bold">
          You haven't added any paints yet. The mixer needs at least a few paints to generate formulas.
        </p>
      )}

      {/* Brand selector */}
      <div className="flex items-center gap-2">
        <Select value={selectedBrand} onValueChange={(v) => { setSelectedBrand(v as PaintBrand); setSearchQuery(''); }}>
          <SelectTrigger className="bg-card border-2 border-border text-foreground font-mono text-sm flex-1 font-bold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-2 border-border">
            {brands.map(brand => (
              <SelectItem key={brand.id} value={brand.id} className="font-mono text-sm font-bold">
                {brand.shortName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs font-mono text-muted-foreground font-bold whitespace-nowrap">
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
          className="pl-9 bg-card border-2 border-border text-foreground text-sm font-bold placeholder:text-muted-foreground/60"
        />
      </div>

      {/* Bulk actions */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddAll}
          className="text-xs text-green-700 hover:text-green-900 hover:bg-green-100 font-mono font-bold"
        >
          <PlusCircle className="w-3 h-3 mr-1" />
          Add All{searchQuery ? ' Filtered' : ''}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemoveAll}
          className="text-xs text-red-700 hover:text-red-900 hover:bg-red-100 font-mono font-bold"
        >
          <MinusCircle className="w-3 h-3 mr-1" />
          Remove All{searchQuery ? ' Filtered' : ''}
        </Button>
        {ownedPaints.size > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-xs text-muted-foreground hover:text-destructive font-mono font-bold ml-auto"
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
              className={`group flex items-center gap-2 p-2.5 rounded-md transition-colors duration-150 w-full text-left touch-target ${
                owned
                  ? 'bg-primary/10 border-2 border-primary/40'
                  : 'hover:bg-accent border-2 border-transparent hover:border-border'
              }`}
            >
              <div className={`w-5 h-5 rounded-sm flex items-center justify-center flex-shrink-0 transition-colors ${
                owned ? 'bg-primary text-white' : 'bg-secondary border-2 border-border text-transparent group-hover:text-muted-foreground/30'
              }`}>
                <Check className="w-3 h-3" />
              </div>
              <div
                className="w-6 h-6 rounded paint-chip flex-shrink-0"
                style={{ backgroundColor: `rgb(${paint.rgb.join(',')})` }}
              />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[11px] text-primary font-bold truncate">{paint.code}</p>
                <p className="text-[11px] text-foreground truncate">{paint.name}</p>
              </div>
            </button>
          );
        })}
      </div>

      {filteredPaints.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4 font-bold">
          No paints match your search.
        </p>
      )}
    </div>
  );
}

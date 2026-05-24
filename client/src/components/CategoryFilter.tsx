/**
 * BrandAndCategoryFilter Component
 * Collapsible sections — starts collapsed with a summary of selections.
 * Light theme, high-contrast for workshop use.
 */

import { useState } from 'react';
import { PaintBrand, PaintCategory, brands } from '@/lib/paintDatabase';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronRight, Paintbrush, Layers } from 'lucide-react';

interface CategoryFilterProps {
  selectedBrands: PaintBrand[];
  selectedCategories: PaintCategory[];
  onBrandsChange: (brands: PaintBrand[]) => void;
  onCategoriesChange: (categories: PaintCategory[]) => void;
}

const allCategories: { key: PaintCategory; label: string; description: string }[] = [
  { key: 'transparent', label: 'Transparent', description: 'Layering colors' },
  { key: 'opaque', label: 'Opaque', description: 'Full coverage' },
  { key: 'detail', label: 'Detail', description: 'Fine-line work' },
  { key: 'standard', label: 'Standard', description: 'General purpose' },
  { key: 'pearl', label: 'Pearl', description: 'Pearlescent effects' },
  { key: 'metallic', label: 'Metallic', description: 'Metal flake' },
  { key: 'fluorescent', label: 'Fluorescent', description: 'UV reactive' },
];

export default function CategoryFilter({ selectedBrands, selectedCategories, onBrandsChange, onCategoriesChange }: CategoryFilterProps) {
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const toggleBrand = (brand: PaintBrand) => {
    if (selectedBrands.includes(brand)) {
      if (selectedBrands.length > 1) {
        onBrandsChange(selectedBrands.filter(b => b !== brand));
      }
    } else {
      onBrandsChange([...selectedBrands, brand]);
    }
  };

  const toggleCategory = (cat: PaintCategory) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        onCategoriesChange(selectedCategories.filter(c => c !== cat));
      }
    } else {
      onCategoriesChange([...selectedCategories, cat]);
    }
  };

  // Build summary strings
  const selectedBrandNames = brands
    .filter(b => selectedBrands.includes(b.id))
    .map(b => b.shortName);

  const selectedCatNames = allCategories
    .filter(c => selectedCategories.includes(c.key))
    .map(c => c.label);

  return (
    <div className="workshop-panel rounded-lg overflow-hidden">
      {/* Brand Selection — Collapsible */}
      <div className="border-b-2 border-border">
        <button
          onClick={() => setBrandsOpen(!brandsOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors duration-150"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Paintbrush className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="font-mono text-xs text-foreground uppercase tracking-wider font-bold flex-shrink-0">
              BRANDS
            </span>
            <span className="text-xs text-primary font-bold flex-shrink-0">
              ({selectedBrands.length})
            </span>
            {!brandsOpen && (
              <span className="text-[10px] text-muted-foreground truncate ml-1 hidden sm:inline">
                {selectedBrandNames.length <= 3
                  ? selectedBrandNames.join(', ')
                  : `${selectedBrandNames.slice(0, 2).join(', ')} +${selectedBrandNames.length - 2} more`}
              </span>
            )}
          </div>
          {brandsOpen ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          )}
        </button>

        {/* Collapsed summary chips */}
        {!brandsOpen && (
          <div className="px-4 pb-3 flex flex-wrap gap-1.5">
            {selectedBrandNames.map(name => (
              <span key={name} className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/30 font-bold">
                {name}
              </span>
            ))}
          </div>
        )}

        {/* Expanded brand grid */}
        {brandsOpen && (
          <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {brands.map(brand => (
                <label
                  key={brand.id}
                  className={`flex items-center gap-2 p-3 rounded cursor-pointer transition-colors duration-150 touch-target ${
                    selectedBrands.includes(brand.id)
                      ? 'bg-primary/10 border-2 border-primary/40'
                      : 'bg-secondary border-2 border-border hover:border-primary/20'
                  }`}
                >
                  <Checkbox
                    checked={selectedBrands.includes(brand.id)}
                    onCheckedChange={() => toggleBrand(brand.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground">{brand.shortName}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{brand.description.split(',')[0]}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Selection — Collapsible */}
      <div>
        <button
          onClick={() => setCategoriesOpen(!categoriesOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors duration-150"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Layers className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="font-mono text-xs text-foreground uppercase tracking-wider font-bold flex-shrink-0">
              PAINT TYPES
            </span>
            <span className="text-xs text-primary font-bold flex-shrink-0">
              ({selectedCategories.length}/{allCategories.length})
            </span>
            {!categoriesOpen && (
              <span className="text-[10px] text-muted-foreground truncate ml-1 hidden sm:inline">
                {selectedCatNames.length <= 4
                  ? selectedCatNames.join(', ')
                  : `${selectedCatNames.slice(0, 3).join(', ')} +${selectedCatNames.length - 3} more`}
              </span>
            )}
          </div>
          {categoriesOpen ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          )}
        </button>

        {/* Collapsed summary chips */}
        {!categoriesOpen && (
          <div className="px-4 pb-3 flex flex-wrap gap-1.5">
            {selectedCatNames.map(name => (
              <span key={name} className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/30 font-bold">
                {name}
              </span>
            ))}
          </div>
        )}

        {/* Expanded category grid */}
        {categoriesOpen && (
          <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {allCategories.map(cat => (
                <label
                  key={cat.key}
                  className={`flex items-center gap-2 p-3 rounded cursor-pointer transition-colors duration-150 touch-target ${
                    selectedCategories.includes(cat.key)
                      ? 'bg-primary/10 border-2 border-primary/40'
                      : 'bg-secondary border-2 border-border hover:border-primary/20'
                  }`}
                >
                  <Checkbox
                    checked={selectedCategories.includes(cat.key)}
                    onCheckedChange={() => toggleCategory(cat.key)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div>
                    <p className="text-xs font-bold text-foreground">{cat.label}</p>
                    <p className="text-[10px] text-muted-foreground">{cat.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

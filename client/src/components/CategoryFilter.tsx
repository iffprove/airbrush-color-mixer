/**
 * BrandAndCategoryFilter Component
 * Allows users to select which paint brands and categories to use in mixing.
 */

import { Paint, PaintBrand, PaintCategory, brands } from '@/lib/paintDatabase';
import { Checkbox } from '@/components/ui/checkbox';

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

  return (
    <div className="workshop-panel rounded-lg p-4 space-y-4">
      {/* Brand Selection */}
      <div>
        <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-3">
          PAINT BRANDS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {brands.map(brand => (
            <label
              key={brand.id}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors duration-150 ${
                selectedBrands.includes(brand.id)
                  ? 'bg-amber/10 border border-amber/30'
                  : 'bg-[oklch(0.18_0.005_285)] border border-transparent hover:border-[oklch(0.30_0.01_285)]'
              }`}
            >
              <Checkbox
                checked={selectedBrands.includes(brand.id)}
                onCheckedChange={() => toggleBrand(brand.id)}
                className="data-[state=checked]:bg-amber data-[state=checked]:border-amber"
              />
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground">{brand.shortName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{brand.description.split(',')[0]}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-3">
          PAINT TYPES
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {allCategories.map(cat => (
            <label
              key={cat.key}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors duration-150 ${
                selectedCategories.includes(cat.key)
                  ? 'bg-amber/10 border border-amber/30'
                  : 'bg-[oklch(0.18_0.005_285)] border border-transparent hover:border-[oklch(0.30_0.01_285)]'
              }`}
            >
              <Checkbox
                checked={selectedCategories.includes(cat.key)}
                onCheckedChange={() => toggleCategory(cat.key)}
                className="data-[state=checked]:bg-amber data-[state=checked]:border-amber"
              />
              <div>
                <p className="text-xs font-medium text-foreground">{cat.label}</p>
                <p className="text-[10px] text-muted-foreground">{cat.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * BrandAndCategoryFilter Component
 * Light theme, high-contrast for workshop use.
 */

import { PaintBrand, PaintCategory, brands } from '@/lib/paintDatabase';
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
        <h3 className="font-mono text-xs text-foreground uppercase tracking-wider mb-3 font-bold">
          PAINT BRANDS
        </h3>
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

      {/* Category Selection */}
      <div>
        <h3 className="font-mono text-xs text-foreground uppercase tracking-wider mb-3 font-bold">
          PAINT TYPES
        </h3>
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
    </div>
  );
}

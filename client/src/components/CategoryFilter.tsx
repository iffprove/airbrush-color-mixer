/**
 * CategoryFilter Component
 * Allows users to select which paint categories should be used in the mixing formula.
 */

import { Paint } from '@/lib/paintDatabase';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CategoryFilterProps {
  selected: Paint['category'][];
  onChange: (categories: Paint['category'][]) => void;
}

const allCategories: { key: Paint['category']; label: string; description: string }[] = [
  { key: 'transparent', label: 'Transparent', description: 'Standard Wicked Colors' },
  { key: 'opaque', label: 'Opaque', description: 'Full coverage' },
  { key: 'detail', label: 'Detail', description: 'Fine-line work' },
  { key: 'pearl', label: 'Pearl', description: 'Pearlescent effects' },
  { key: 'metallic', label: 'Metallic', description: 'Metal flake' },
  { key: 'fluorescent', label: 'Fluorescent', description: 'UV reactive' },
];

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const toggle = (cat: Paint['category']) => {
    if (selected.includes(cat)) {
      if (selected.length > 1) {
        onChange(selected.filter(c => c !== cat));
      }
    } else {
      onChange([...selected, cat]);
    }
  };

  return (
    <div className="workshop-panel rounded-lg p-4">
      <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-3">
        PAINT TYPES TO USE
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {allCategories.map(cat => (
          <label
            key={cat.key}
            className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors duration-150 ${
              selected.includes(cat.key)
                ? 'bg-amber/10 border border-amber/30'
                : 'bg-[oklch(0.18_0.005_285)] border border-transparent hover:border-[oklch(0.30_0.01_285)]'
            }`}
          >
            <Checkbox
              checked={selected.includes(cat.key)}
              onCheckedChange={() => toggle(cat.key)}
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
  );
}

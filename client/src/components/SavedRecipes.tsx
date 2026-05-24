/**
 * SavedRecipes Component
 * Allows users to save mixing formulas, view them in a list,
 * and export as a printable work order.
 * 
 * Design: Workshop Industrial
 */

import { useState, useEffect, useCallback } from 'react';
import { MixFormula, MixResult, formulaToString } from '@/lib/colorMixer';
import { brands } from '@/lib/paintDatabase';
import { Save, Trash2, FileText, Download, X, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export interface SavedRecipe {
  id: string;
  name: string;
  targetHex: string;
  targetRgb: [number, number, number];
  formula: MixFormula;
  savedAt: string;
  notes?: string;
}

const STORAGE_KEY = 'airbrush-mixer-recipes';

function loadRecipes(): SavedRecipe[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveRecipes(recipes: SavedRecipe[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

function getBrandShortName(brandId: string): string {
  return brands.find(b => b.id === brandId)?.shortName || brandId;
}

function generateWorkOrder(recipes: SavedRecipe[]): string {
  const now = new Date().toLocaleString();
  let text = `╔══════════════════════════════════════════════════════════╗\n`;
  text += `║          AIRBRUSH COLOR MIXER — WORK ORDER             ║\n`;
  text += `╚══════════════════════════════════════════════════════════╝\n\n`;
  text += `Generated: ${now}\n`;
  text += `Total Recipes: ${recipes.length}\n`;
  text += `${'─'.repeat(58)}\n\n`;

  recipes.forEach((recipe, index) => {
    text += `┌─ RECIPE ${index + 1}: ${recipe.name} ${'─'.repeat(Math.max(0, 40 - recipe.name.length))}┐\n`;
    text += `│ Target: ${recipe.targetHex.toUpperCase()} (RGB ${recipe.targetRgb.join(', ')})\n`;
    text += `│ Match:  ${Math.round(recipe.formula.matchScore)}%\n`;
    text += `│\n`;
    text += `│ PAINTS:\n`;
    recipe.formula.paints.forEach((paint, i) => {
      text += `│   ${recipe.formula.ratios[i]} parts — ${paint.code} ${paint.name} [${getBrandShortName(paint.brand)}]\n`;
    });
    text += `│\n`;
    text += `│ RATIO: ${recipe.formula.ratios.join(' : ')} (by volume)\n`;
    if (recipe.notes) {
      text += `│ NOTES: ${recipe.notes}\n`;
    }
    text += `└${'─'.repeat(57)}┘\n\n`;
  });

  text += `${'─'.repeat(58)}\n`;
  text += `TIPS:\n`;
  text += `• Start with the lightest color, add darker colors gradually\n`;
  text += `• Mix small test batches on scrap material first\n`;
  text += `• Ratios are by volume — use measuring cups or syringes\n`;
  text += `• When mixing across brands, test compatibility first\n`;

  return text;
}

interface SavedRecipesProps {
  currentResult?: MixResult | null;
}

export default function SavedRecipes({ currentResult }: SavedRecipesProps) {
  const [recipes, setRecipes] = useState<SavedRecipe[]>(loadRecipes);
  const [showList, setShowList] = useState(false);
  const [recipeName, setRecipeName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    saveRecipes(recipes);
  }, [recipes]);

  const handleSave = useCallback(() => {
    if (!currentResult || !currentResult.bestFormula) return;
    
    const name = recipeName.trim() || `Mix ${recipes.length + 1}`;
    const newRecipe: SavedRecipe = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name,
      targetHex: currentResult.targetHex,
      targetRgb: currentResult.targetRgb,
      formula: currentResult.bestFormula,
      savedAt: new Date().toISOString(),
    };

    setRecipes(prev => [newRecipe, ...prev]);
    setRecipeName('');
    setShowSaveForm(false);
    toast.success('Recipe saved!', {
      description: `"${name}" added to your work order.`,
    });
  }, [currentResult, recipeName, recipes.length]);

  const handleDelete = useCallback((id: string) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
    toast.info('Recipe removed');
  }, []);

  const handleSaveNote = useCallback((id: string) => {
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, notes: noteText } : r));
    setEditingNotes(null);
    setNoteText('');
  }, [noteText]);

  const handleExport = useCallback(() => {
    if (recipes.length === 0) {
      toast.error('No recipes to export');
      return;
    }

    const text = generateWorkOrder(recipes);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `airbrush-work-order-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Work order exported!');
  }, [recipes]);

  const handleCopyAll = useCallback(() => {
    if (recipes.length === 0) return;
    const text = generateWorkOrder(recipes);
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy');
    });
  }, [recipes]);

  return (
    <div className="space-y-3">
      {/* Save current formula */}
      {currentResult && currentResult.bestFormula && currentResult.bestFormula.paints.length > 0 && (
        <div className="workshop-panel rounded-lg p-4">
          {!showSaveForm ? (
            <Button
              onClick={() => setShowSaveForm(true)}
              className="w-full bg-amber/20 text-amber hover:bg-amber/30 border border-amber/30 font-mono"
            >
              <Save className="w-4 h-4 mr-2" />
              SAVE THIS FORMULA
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded paint-chip flex-shrink-0"
                  style={{ backgroundColor: currentResult.targetHex }}
                />
                <Input
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  placeholder="Recipe name (e.g., 'Candy Red Hood')"
                  className="bg-[oklch(0.16_0.005_285)] border-[oklch(0.30_0.01_285)] text-foreground font-mono text-sm placeholder:text-muted-foreground/50"
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="bg-amber text-black hover:bg-amber/80 font-mono"
                >
                  <Save className="w-3 h-3 mr-1" />
                  Save
                </Button>
                <Button
                  onClick={() => setShowSaveForm(false)}
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground font-mono"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Saved recipes list toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => setShowList(!showList)}
          className="flex-1 border-[oklch(0.30_0.01_285)] text-foreground hover:bg-accent font-mono"
        >
          <ClipboardList className="w-4 h-4 mr-2" />
          {showList ? 'HIDE' : 'VIEW'} SAVED RECIPES ({recipes.length})
        </Button>
        {recipes.length > 0 && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleExport}
            className="border-[oklch(0.30_0.01_285)] text-amber hover:bg-amber/10"
            title="Export work order"
          >
            <Download className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Recipes list */}
      {showList && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {recipes.length === 0 ? (
            <div className="workshop-panel rounded-lg p-6 text-center">
              <ClipboardList className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No saved recipes yet.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Mix a color and tap "Save This Formula" to start building your work order.
              </p>
            </div>
          ) : (
            <>
              {/* Export actions */}
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyAll}
                  className="text-xs text-muted-foreground hover:text-foreground font-mono"
                >
                  <FileText className="w-3 h-3 mr-1" />
                  Copy All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExport}
                  className="text-xs text-amber hover:text-amber/80 font-mono"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Export .txt
                </Button>
              </div>

              {/* Recipe cards */}
              {recipes.map(recipe => (
                <div key={recipe.id} className="workshop-panel rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-6 h-6 rounded paint-chip flex-shrink-0"
                        style={{ backgroundColor: recipe.targetHex }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{recipe.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          {recipe.targetHex.toUpperCase()} • {Math.round(recipe.formula.matchScore)}% match
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(recipe.id)}
                      className="text-muted-foreground hover:text-destructive flex-shrink-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Paint list */}
                  <div className="pl-8 space-y-1">
                    {recipe.formula.paints.map((paint, i) => (
                      <div key={`${paint.brand}-${paint.code}`} className="flex items-center gap-2 text-xs">
                        <div
                          className="w-3 h-3 rounded-sm flex-shrink-0"
                          style={{ backgroundColor: `rgb(${paint.rgb.join(',')})` }}
                        />
                        <span className="font-mono text-amber">{recipe.formula.ratios[i]}p</span>
                        <span className="text-muted-foreground truncate">
                          {paint.code} {paint.name}
                        </span>
                        <span className="text-[9px] text-muted-foreground/60 bg-[oklch(0.18_0.005_285)] px-1 rounded">
                          {getBrandShortName(paint.brand)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Notes */}
                  {editingNotes === recipe.id ? (
                    <div className="pl-8 flex gap-2">
                      <Input
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add a note..."
                        className="bg-[oklch(0.16_0.005_285)] border-[oklch(0.30_0.01_285)] text-foreground text-xs h-7"
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveNote(recipe.id)}
                        autoFocus
                      />
                      <Button size="sm" className="h-7 text-xs bg-amber text-black" onClick={() => handleSaveNote(recipe.id)}>
                        OK
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setEditingNotes(null)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="pl-8">
                      {recipe.notes ? (
                        <p className="text-[10px] text-muted-foreground italic cursor-pointer hover:text-foreground"
                           onClick={() => { setEditingNotes(recipe.id); setNoteText(recipe.notes || ''); }}>
                          Note: {recipe.notes}
                        </p>
                      ) : (
                        <button
                          onClick={() => { setEditingNotes(recipe.id); setNoteText(''); }}
                          className="text-[10px] text-muted-foreground/50 hover:text-muted-foreground"
                        >
                          + add note
                        </button>
                      )}
                    </div>
                  )}

                  <p className="text-[9px] text-muted-foreground/40 font-mono pl-8">
                    Saved {new Date(recipe.savedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

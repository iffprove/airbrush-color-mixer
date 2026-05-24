/**
 * useInventory Hook
 * Manages the user's paint inventory (which paints they own) in localStorage.
 * Provides methods to add/remove paints and check ownership.
 */

import { useState, useCallback, useEffect } from 'react';
import { PaintBrand } from '@/lib/paintDatabase';

const STORAGE_KEY = 'airbrush-mixer-inventory';

export interface InventoryState {
  ownedPaints: Set<string>; // Set of "brand:code" keys
  useInventoryOnly: boolean;
}

function paintKey(brand: PaintBrand, code: string): string {
  return `${brand}:${code}`;
}

function loadInventory(): { owned: string[]; useOnly: boolean } {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return { owned: parsed.owned || [], useOnly: parsed.useOnly ?? false };
    }
  } catch { /* ignore */ }
  return { owned: [], useOnly: false };
}

function saveInventory(owned: string[], useOnly: boolean) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ owned, useOnly }));
}

export function useInventory() {
  const [ownedPaints, setOwnedPaints] = useState<Set<string>>(() => {
    const { owned } = loadInventory();
    return new Set(owned);
  });
  const [useInventoryOnly, setUseInventoryOnly] = useState<boolean>(() => {
    const { useOnly } = loadInventory();
    return useOnly;
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    saveInventory(Array.from(ownedPaints), useInventoryOnly);
  }, [ownedPaints, useInventoryOnly]);

  const togglePaint = useCallback((brand: PaintBrand, code: string) => {
    const key = paintKey(brand, code);
    setOwnedPaints(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const addPaint = useCallback((brand: PaintBrand, code: string) => {
    const key = paintKey(brand, code);
    setOwnedPaints(prev => {
      if (prev.has(key)) return prev;
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }, []);

  const removePaint = useCallback((brand: PaintBrand, code: string) => {
    const key = paintKey(brand, code);
    setOwnedPaints(prev => {
      if (!prev.has(key)) return prev;
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const isOwned = useCallback((brand: PaintBrand, code: string): boolean => {
    return ownedPaints.has(paintKey(brand, code));
  }, [ownedPaints]);

  const addAllFromBrand = useCallback((brand: PaintBrand, codes: string[]) => {
    setOwnedPaints(prev => {
      const next = new Set(prev);
      codes.forEach(code => next.add(paintKey(brand, code)));
      return next;
    });
  }, []);

  const removeAllFromBrand = useCallback((brand: PaintBrand, codes: string[]) => {
    setOwnedPaints(prev => {
      const next = new Set(prev);
      codes.forEach(code => next.delete(paintKey(brand, code)));
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setOwnedPaints(new Set());
  }, []);

  const toggleUseInventoryOnly = useCallback(() => {
    setUseInventoryOnly(prev => !prev);
  }, []);

  return {
    ownedPaints,
    ownedCount: ownedPaints.size,
    useInventoryOnly,
    togglePaint,
    addPaint,
    removePaint,
    isOwned,
    addAllFromBrand,
    removeAllFromBrand,
    clearAll,
    setUseInventoryOnly,
    toggleUseInventoryOnly,
  };
}

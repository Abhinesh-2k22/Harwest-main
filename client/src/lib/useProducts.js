import { useEffect, useState } from 'react';
import { PRODUCTS as FALLBACK } from '../config/siteContent';
import { api } from './api';

const STORAGE_KEY = 'hw_products_cache';

// In-memory cache across tab clicks
let memoryProducts = null;

function getInitialProducts() {
  if (memoryProducts && Array.isArray(memoryProducts) && memoryProducts.length > 0) {
    return memoryProducts;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryProducts = parsed;
        return parsed;
      }
    }
  } catch {}
  return FALLBACK;
}

/**
 * Single source of truth for products on the PUBLIC site (Home + Products page).
 * Uses cached data on first render to prevent layout shifts or remount glitches.
 */
export function useProducts() {
  const [state, setState] = useState(() => {
    const initial = getInitialProducts();
    return {
      items: initial,
      loading: false,
      offline: false,
    };
  });

  useEffect(() => {
    let alive = true;
    api
      .getProducts()
      .then((data) => {
        if (!alive || !Array.isArray(data) || data.length === 0) return;
        memoryProducts = data;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch {}

        setState((prev) => {
          // Prevent re-render if items haven't changed
          if (JSON.stringify(prev.items) === JSON.stringify(data)) {
            return prev;
          }
          return { items: data, loading: false, offline: false };
        });
      })
      .catch(() => {
        if (alive) setState((prev) => ({ ...prev, loading: false, offline: true }));
      });

    return () => {
      alive = false;
    };
  }, []);

  return state;
}

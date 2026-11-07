import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { ASSET_DEFAULTS } from '../config/assets';
import { api } from '../lib/api';
import { optimizeCloudinaryUrl } from '../lib/media';

const MediaContext = createContext(null);
const STORAGE_KEY = 'hw_media_overrides';

function getInitialOverrides() {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
}

/** Merges admin overrides (from the server) over the defaults in config/assets.js. */
export function MediaProvider({ children }) {
  // Synchronously initialize from localStorage so video URLs are known immediately on first paint
  const [overrides, setOverrides] = useState(getInitialOverrides);

  const refresh = useCallback(async () => {
    try {
      const data = await api.getMedia();
      if (data && typeof data === 'object') {
        setOverrides(data);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch {}
      }
    } catch {
      /* server offline: fall back to cached / defaults */
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const value = useMemo(
    () => ({
      overrides,
      refresh,
      get: (key) => {
        const raw = overrides[key] || ASSET_DEFAULTS[key]?.url || '';
        return optimizeCloudinaryUrl(raw);
      },
    }),
    [overrides, refresh]
  );
  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
}

export const useMedia = () => useContext(MediaContext);
export const useAsset = (key) => useContext(MediaContext).get(key);

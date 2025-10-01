import { useState, useEffect, useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheConfig {
  ttl?: number; // Default TTL in milliseconds
  staleWhileRevalidate?: boolean; // Serve stale data while revalidating
  backgroundRefresh?: boolean; // Refresh data in background
}

class DataCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes
  private readonly staleThreshold = 2 * 60 * 1000; // 2 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    const age = now - entry.timestamp;

    // Check if expired
    if (age > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  isStale(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return true;

    const now = Date.now();
    const age = now - entry.timestamp;
    return age > this.staleThreshold;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  // Generate cache key from parameters
  generateKey(baseKey: string, params?: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) {
      return baseKey;
    }
    
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    return `${baseKey}?${sortedParams}`;
  }
}

// Global cache instance
const globalCache = new DataCache();

/**
 * Hook para cache inteligente de datos con TTL y revalidación en background
 */
export function useDataCache<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  config: CacheConfig = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);
  
  const {
    ttl = 5 * 60 * 1000, // 5 minutes
    staleWhileRevalidate = true,
    backgroundRefresh = true
  } = config;

  const fetchData = useCallback(async (forceRefresh = false) => {
    const key = cacheKey;
    const cachedData = globalCache.get<T>(key);
    const cachedIsStale = globalCache.isStale(key);

    // Return cached data if available and not forcing refresh
    if (cachedData && !forceRefresh) {
      setData(cachedData);
      setIsStale(cachedIsStale);

      // Background refresh if stale and background refresh is enabled
      if (cachedIsStale && backgroundRefresh) {
        fetchDataInBackground(key);
      }
      return cachedData;
    }

    // Fetch fresh data
    try {
      setLoading(true);
      setError(null);
      
      const freshData = await fetchFn();
      
      // Cache the fresh data
      globalCache.set(key, freshData, ttl);
      
      setData(freshData);
      setIsStale(false);
      
      return freshData;
    } catch (err: any) {
      setError(err.message || 'Error fetching data');
      
      // Return stale data if available and staleWhileRevalidate is enabled
      if (cachedData && staleWhileRevalidate) {
        setData(cachedData);
        setIsStale(true);
        return cachedData;
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cacheKey, fetchFn, ttl, staleWhileRevalidate, backgroundRefresh]);

  const fetchDataInBackground = useCallback(async (key: string) => {
    try {
      const freshData = await fetchFn();
      globalCache.set(key, freshData, ttl);
      
      // Only update state if current data is stale
      if (isStale) {
        setData(freshData);
        setIsStale(false);
      }
    } catch (err) {
      console.warn('Background refresh failed:', err);
    }
  }, [fetchFn, ttl, isStale]);

  const invalidate = useCallback(() => {
    globalCache.delete(cacheKey);
    setData(null);
    setIsStale(false);
  }, [cacheKey]);

  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    isStale,
    refresh,
    invalidate
  };
}

/**
 * Hook para cache de datos con parámetros (para filtros, etc.)
 */
export function useDataCacheWithParams<T>(
  baseKey: string,
  params: Record<string, any>,
  fetchFn: (params: Record<string, any>) => Promise<T>,
  config: CacheConfig = {}
) {
  const cacheKey = globalCache.generateKey(baseKey, params);
  
  const fetchWithParams = useCallback(() => {
    return fetchFn(params);
  }, [fetchFn, params]);

  return useDataCache(cacheKey, fetchWithParams, config);
}

/**
 * Hook para cache de estadísticas (TTL más largo)
 */
export function useStatsCache<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>
) {
  return useDataCache(cacheKey, fetchFn, {
    ttl: 10 * 60 * 1000, // 10 minutes for stats
    staleWhileRevalidate: true,
    backgroundRefresh: true
  });
}

/**
 * Hook para cache de datos de usuario (TTL corto para datos críticos)
 */
export function useUserDataCache<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>
) {
  return useDataCache(cacheKey, fetchFn, {
    ttl: 2 * 60 * 1000, // 2 minutes for user data
    staleWhileRevalidate: false,
    backgroundRefresh: false
  });
}

export { globalCache };

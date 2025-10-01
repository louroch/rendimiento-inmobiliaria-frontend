import { useState, useCallback, useRef, useEffect } from 'react';

interface LoadingState {
  isLoading: boolean;
  isStale: boolean;
  error: string | null;
  progress: number;
  estimatedTime?: number;
}

interface LoadingConfig {
  minLoadingTime?: number; // Tiempo mínimo de loading para evitar flash
  showProgress?: boolean;
  enableStale?: boolean;
}

/**
 * Hook para manejar estados de loading optimizados
 * Aprovecha las mejoras de performance del backend
 */
export function useOptimizedLoading(config: LoadingConfig = {}) {
  const {
    minLoadingTime = 300, // 300ms mínimo
    showProgress = true,
    enableStale = true
  } = config;

  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    isStale: false,
    error: null,
    progress: 0
  });

  const loadingStartTime = useRef<number>(0);
  const loadingTimeout = useRef<NodeJS.Timeout>();

  const startLoading = useCallback(() => {
    loadingStartTime.current = Date.now();
    
    setLoadingState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      progress: 0,
      isStale: false
    }));

    // Simular progreso si está habilitado
    if (showProgress) {
      const progressInterval = setInterval(() => {
        setLoadingState(prev => {
          const elapsed = Date.now() - loadingStartTime.current;
          const progress = Math.min(90, (elapsed / 2000) * 100); // Max 90% en 2 segundos
          
          return {
            ...prev,
            progress,
            estimatedTime: Math.max(0, 2000 - elapsed)
          };
        });
      }, 50);

      loadingTimeout.current = setTimeout(() => {
        clearInterval(progressInterval);
      }, 2000);
    }
  }, [showProgress]);

  const finishLoading = useCallback((error?: string) => {
    const elapsed = Date.now() - loadingStartTime.current;
    const remainingTime = Math.max(0, minLoadingTime - elapsed);

    const completeLoading = () => {
      setLoadingState(prev => ({
        ...prev,
        isLoading: false,
        progress: 100,
        error: error || null,
        isStale: enableStale && !error ? false : prev.isStale
      }));

      // Reset progress después de un momento
      setTimeout(() => {
        setLoadingState(prev => ({
          ...prev,
          progress: 0,
          estimatedTime: undefined
        }));
      }, 500);
    };

    if (remainingTime > 0) {
      setTimeout(completeLoading, remainingTime);
    } else {
      completeLoading();
    }

    // Limpiar timeout de progreso
    if (loadingTimeout.current) {
      clearTimeout(loadingTimeout.current);
    }
  }, [minLoadingTime, enableStale]);

  const setStale = useCallback((isStale: boolean) => {
    setLoadingState(prev => ({
      ...prev,
      isStale
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setLoadingState(prev => ({
      ...prev,
      error,
      isLoading: false
    }));
  }, []);

  const reset = useCallback(() => {
    setLoadingState({
      isLoading: false,
      isStale: false,
      error: null,
      progress: 0
    });
  }, []);

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }
    };
  }, []);

  return {
    ...loadingState,
    startLoading,
    finishLoading,
    setStale,
    setError,
    reset
  };
}

/**
 * Hook especializado para loading de API con cache
 */
export function useApiLoading() {
  const loading = useOptimizedLoading({
    minLoadingTime: 200,
    showProgress: true,
    enableStale: true
  });

  const executeWithLoading = useCallback(async <T>(
    apiCall: () => Promise<T>,
    options: { showStaleIndicator?: boolean } = {}
  ): Promise<T | null> => {
    try {
      loading.startLoading();
      const result = await apiCall();
      loading.finishLoading();
      return result;
    } catch (error: any) {
      loading.finishLoading(error.message || 'Error en la operación');
      return null;
    }
  }, [loading]);

  return {
    ...loading,
    executeWithLoading
  };
}

/**
 * Hook para loading de estadísticas (aprovecha cache del backend)
 */
export function useStatsLoading() {
  const loading = useOptimizedLoading({
    minLoadingTime: 150, // Menos tiempo porque usa cache
    showProgress: true,
    enableStale: true
  });

  const loadStats = useCallback(async <T>(
    statsCall: () => Promise<T>,
    isCached: boolean = false
  ): Promise<T | null> => {
    try {
      loading.startLoading();
      
      // Si es cache, mostrar como stale inmediatamente
      if (isCached) {
        loading.setStale(true);
      }
      
      const result = await statsCall();
      loading.finishLoading();
      
      return result;
    } catch (error: any) {
      loading.finishLoading(error.message || 'Error cargando estadísticas');
      return null;
    }
  }, [loading]);

  return {
    ...loading,
    loadStats
  };
}

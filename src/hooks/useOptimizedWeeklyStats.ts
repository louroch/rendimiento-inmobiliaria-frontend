import { useDataCacheWithParams, useDataCache } from './useDataCache';
import { WeeklyService, WeeklyFilters } from '../services/weeklyService';
import { WeeklyStats, WeeklyAgentsStats, WeeklyTeamStats } from '../types/performance';

/**
 * Hook optimizado para estadísticas semanales con cache inteligente
 * Aprovecha las optimizaciones del backend con Redis
 */
export function useOptimizedWeeklyStats(filters: WeeklyFilters = {}) {
  // Cache para estadísticas generales (TTL más largo - 10 minutos)
  const generalStats = useDataCacheWithParams(
    'weekly-general',
    filters,
    WeeklyService.getWeeklyStats,
    {
      ttl: 10 * 60 * 1000, // 10 minutes
      staleWhileRevalidate: true,
      backgroundRefresh: true
    }
  );

  // Cache para estadísticas por agente (TTL más largo - 10 minutos)
  const agentsStats = useDataCacheWithParams(
    'weekly-agents',
    filters,
    WeeklyService.getWeeklyAgentsStats,
    {
      ttl: 10 * 60 * 1000, // 10 minutes
      staleWhileRevalidate: true,
      backgroundRefresh: true
    }
  );

  // Cache para estadísticas del equipo (TTL más largo - 10 minutos)
  const teamStats = useDataCacheWithParams(
    'weekly-team',
    filters,
    WeeklyService.getWeeklyTeamStats,
    {
      ttl: 10 * 60 * 1000, // 10 minutes
      staleWhileRevalidate: true,
      backgroundRefresh: true
    }
  );

  // Estado combinado
  const loading = generalStats.loading || agentsStats.loading || teamStats.loading;
  const error = generalStats.error || agentsStats.error || teamStats.error;
  const isStale = generalStats.isStale || agentsStats.isStale || teamStats.isStale;

  // Función para refrescar todos los datos
  const refreshAll = async () => {
    const results = await Promise.allSettled([
      generalStats.refresh(),
      agentsStats.refresh(),
      teamStats.refresh()
    ]);
    
    return {
      general: results[0].status === 'fulfilled' ? results[0].value : null,
      agents: results[1].status === 'fulfilled' ? results[1].value : null,
      team: results[2].status === 'fulfilled' ? results[2].value : null
    };
  };

  // Función para invalidar cache
  const invalidateAll = () => {
    generalStats.invalidate();
    agentsStats.invalidate();
    teamStats.invalidate();
  };

  return {
    data: {
      general: generalStats.data,
      agents: agentsStats.data,
      team: teamStats.data
    },
    loading,
    error,
    isStale,
    refresh: refreshAll,
    invalidate: invalidateAll
  };
}

/**
 * Hook optimizado para estadísticas de Tokko con cache inteligente
 */
export function useOptimizedTokkoStats(filters: { startDate?: string; endDate?: string; userId?: string } = {}) {
  const { TokkoService } = require('../services/tokkoService');
  
  return useDataCacheWithParams(
    'tokko-stats',
    filters,
    TokkoService.getTokkoStatsWithFallback,
    {
      ttl: 15 * 60 * 1000, // 15 minutes (Tokko data changes less frequently)
      staleWhileRevalidate: true,
      backgroundRefresh: true
    }
  );
}

/**
 * Hook optimizado para datos de usuario con cache corto
 */
export function useOptimizedUserData() {
  const { api } = require('../services/api');
  
  return useDataCache(
    'users-data',
    async () => {
      const response = await api.get('/users');
      return response.data.users;
    },
    {
      ttl: 5 * 60 * 1000, // 5 minutes
      staleWhileRevalidate: true,
      backgroundRefresh: true
    }
  );
}

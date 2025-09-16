import { api } from './api';
import { WeeklyStats, WeeklyAgentsStats, WeeklyTeamStats, WeeklyExportData } from '../types/performance';

export interface WeeklyFilters {
  date?: string;
  weekNumber?: number;
  year?: number;
}

export class WeeklyService {
  /**
   * Obtiene las métricas semanales generales
   */
  static async getWeeklyStats(filters: WeeklyFilters = {}): Promise<WeeklyStats> {
    try {
      const response = await api.get('/performance/stats/weekly', {
        params: {
          date: filters.date || undefined,
          weekNumber: filters.weekNumber || undefined,
          year: filters.year || undefined,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo métricas semanales:', error);
      throw error;
    }
  }

  /**
   * Obtiene las métricas semanales por agente
   */
  static async getWeeklyAgentsStats(filters: WeeklyFilters = {}): Promise<WeeklyAgentsStats> {
    try {
      const response = await api.get('/performance/stats/weekly/agents', {
        params: {
          date: filters.date || undefined,
          weekNumber: filters.weekNumber || undefined,
          year: filters.year || undefined,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo métricas semanales por agente:', error);
      throw error;
    }
  }

  /**
   * Obtiene las métricas semanales consolidadas del equipo
   */
  static async getWeeklyTeamStats(filters: WeeklyFilters = {}): Promise<WeeklyTeamStats> {
    try {
      const response = await api.get('/performance/stats/weekly/team', {
        params: {
          date: filters.date || undefined,
          weekNumber: filters.weekNumber || undefined,
          year: filters.year || undefined,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo métricas semanales del equipo:', error);
      throw error;
    }
  }

  /**
   * Obtiene los datos para exportación PDF
   */
  static async getWeeklyExportData(filters: WeeklyFilters = {}): Promise<WeeklyExportData> {
    try {
      const response = await api.get('/performance/stats/weekly/export', {
        params: {
          date: filters.date || undefined,
          weekNumber: filters.weekNumber || undefined,
          year: filters.year || undefined,
          format: 'pdf'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo datos para exportación:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las métricas semanales en una sola llamada
   */
  static async getAllWeeklyStats(filters: WeeklyFilters = {}): Promise<{
    general: WeeklyStats;
    agents: WeeklyAgentsStats;
    team: WeeklyTeamStats;
  }> {
    try {
      const [general, agents, team] = await Promise.all([
        this.getWeeklyStats(filters),
        this.getWeeklyAgentsStats(filters),
        this.getWeeklyTeamStats(filters)
      ]);

      return { general, agents, team };
    } catch (error) {
      console.error('Error obteniendo todas las métricas semanales:', error);
      throw error;
    }
  }
}

export default WeeklyService;

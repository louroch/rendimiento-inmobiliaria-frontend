import { api } from './api';
import { TokkoStats } from '../types/performance';

export interface TokkoFilters {
  startDate?: string;
  endDate?: string;
  userId?: string;
}

export class TokkoService {
  /**
   * Obtiene las métricas completas de Tokko CRM
   */
  static async getTokkoStats(filters: TokkoFilters = {}): Promise<TokkoStats> {
    try {
      const response = await api.get('/performance/stats/tokko', {
        params: {
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          userId: filters.userId || undefined,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo métricas de Tokko:', error);
      throw error;
    }
  }

  /**
   * Obtiene las métricas de Tokko desde el endpoint de records
   */
  static async getTokkoRecordsStats(filters: TokkoFilters = {}): Promise<TokkoStats> {
    try {
      const response = await api.get('/records/stats/tokko', {
        params: {
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          userId: filters.userId || undefined,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo métricas de Tokko desde records:', error);
      throw error;
    }
  }

  /**
   * Obtiene las métricas de Tokko con fallback automático
   * Intenta primero el endpoint de performance, luego el de records
   */
  static async getTokkoStatsWithFallback(filters: TokkoFilters = {}): Promise<TokkoStats> {
    try {
      return await this.getTokkoStats(filters);
    } catch (error) {
      console.warn('Fallback a endpoint de records:', error);
      return await this.getTokkoRecordsStats(filters);
    }
  }
}

export default TokkoService;

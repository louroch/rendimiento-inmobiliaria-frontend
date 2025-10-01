import { useState, useEffect } from 'react';
import { api } from '../services/api';

interface GeminiFilters {
  startDate?: string;
  endDate?: string;
  userId?: string;
  includeTokko?: boolean;
  includeWeekly?: boolean;
}

interface GeminiResponse {
  recommendations: string[];
  metrics?: {
    totalConsultas: number;
    totalMuestras: number;
    totalOperaciones: number;
    conversionRates?: {
      consultasToMuestras: string;
      muestrasToOperaciones: string;
    };
  };
  personalMetrics?: {
    totalConsultas: number;
    totalMuestras: number;
    totalOperaciones: number;
  };
}

export const useGeminiRecommendations = (type: 'general' | 'personal' | 'advanced' = 'general', filters: GeminiFilters = {}) => {
  const [data, setData] = useState<GeminiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async (retryCount = 0) => {
    setLoading(true);
    setError(null);
    
    try {
      let endpoint = '';
      
      switch (type) {
        case 'personal':
          endpoint = '/gemini/advisor-recommendations';
          break;
        case 'advanced':
          endpoint = '/gemini/advanced-analysis';
          break;
        default:
          endpoint = '/gemini/recommendations';
      }
      
      const response = await api.post(endpoint, filters);
      setData(response.data);
    } catch (err: any) {
      console.error('Error fetching Gemini recommendations:', err);
      
      // Manejar errores de autenticación específicamente
      if (err.message?.includes('403') || err.message?.includes('Token inválido') || err.message?.includes('Forbidden')) {
        setError('Error de autenticación: Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        return;
      }
      
      // Manejar errores específicos de Gemini
      if (err.message?.includes('GoogleGenerativeAI Error') || err.message?.includes('gemini-1.5-flash')) {
        setError('Error en el servicio de IA: El modelo de Gemini no está disponible. Contacta al administrador del sistema.');
        return;
      }
      
      // Manejar errores de modelo no encontrado
      if (err.message?.includes('models/gemini-1.5-flash is not found')) {
        setError('Error de configuración: El modelo de IA no está disponible. El administrador debe verificar la configuración de Gemini.');
        return;
      }
      
      // Si es un error de timeout o conectividad y no hemos agotado los reintentos
      if ((err.message?.includes('Timeout') || err.message?.includes('No se puede conectar')) && retryCount < 2) {
        console.log(`Reintentando... (${retryCount + 1}/3)`);
        setTimeout(() => fetchRecommendations(retryCount + 1), 2000);
        return;
      }
      
      setError(err.message || 'Error generando recomendaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [type, JSON.stringify(filters)]);

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchRecommendations 
  };
};

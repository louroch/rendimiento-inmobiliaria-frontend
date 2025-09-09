import React, { useState } from 'react';
import { api } from '../services/api';
import { Brain, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

interface PerformanceData {
  id: string;
  fecha: string;
  consultasRecibidas: number;
  muestrasRealizadas: number;
  operacionesCerradas: number;
  seguimiento: boolean;
  usoTokko: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface GeminiRecommendationsProps {
  filters: {
    userId: string;
    startDate: string;
    endDate: string;
  };
  performanceData: PerformanceData[];
}

const GeminiRecommendations: React.FC<GeminiRecommendationsProps> = ({ 
  filters, 
  performanceData 
}) => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);

  const generateRecommendations = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.post('/gemini/recommendations', {
        userId: filters.userId || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      });

      setRecommendations(response.data.recommendations);
      setLastGenerated(new Date());
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error generando recomendaciones');
    } finally {
      setLoading(false);
    }
  };

  const generatePersonalRecommendations = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.post('/gemini/advisor-recommendations', {
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      });

      setRecommendations(response.data.recommendations);
      setLastGenerated(new Date());
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error generando recomendaciones personales');
    } finally {
      setLoading(false);
    }
  };

  if (performanceData.length === 0) {
    return (
      <div className="text-center py-8">
        <Brain className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay datos</h3>
        <p className="mt-1 text-sm text-gray-500">
          Necesitas datos de desempeño para generar recomendaciones.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Botones de acción */}
      <div className="flex space-x-3">
        <button
          onClick={generateRecommendations}
          disabled={loading}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Brain className="h-4 w-4" />
          )}
          <span>Recomendaciones Generales</span>
        </button>
        
        <button
          onClick={generatePersonalRecommendations}
          disabled={loading}
          className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Brain className="h-4 w-4" />
          )}
          <span>Recomendaciones Personales</span>
        </button>
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <RefreshCw className="mx-auto h-8 w-8 text-primary-600 animate-spin" />
            <p className="mt-2 text-sm text-gray-600">
              Generando recomendaciones con IA...
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recomendaciones */}
      {recommendations.length > 0 && !loading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900 flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Recomendaciones Generadas
            </h4>
            {lastGenerated && (
              <span className="text-xs text-gray-500">
                Generado: {lastGenerated.toLocaleTimeString('es-ES')}
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-600">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {recommendation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información sobre la IA */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start">
          <Brain className="h-5 w-5 text-gray-400 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-gray-900">Powered by Gemini AI</h4>
            <p className="mt-1 text-xs text-gray-600">
              Las recomendaciones son generadas por inteligencia artificial basándose en los datos de desempeño del equipo.
              Se actualizan automáticamente según los filtros aplicados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiRecommendations;

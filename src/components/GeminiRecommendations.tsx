import React from 'react';
import { useGeminiRecommendations } from '../hooks/useGeminiRecommendations';
import { Brain, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

interface GeminiRecommendationsProps {
  type?: 'general' | 'personal' | 'advanced';
  filters?: {
    startDate?: string;
    endDate?: string;
    userId?: string;
    includeTokko?: boolean;
    includeWeekly?: boolean;
  };
  title?: string;
  showRefresh?: boolean;
  className?: string;
}

const GeminiRecommendations: React.FC<GeminiRecommendationsProps> = ({ 
  type = 'general', 
  filters = {},
  title = 'Recomendaciones de IA',
  showRefresh = true,
  className = ''
}) => {
  const { data, loading, error, refetch } = useGeminiRecommendations(type, filters);

  const formatRecommendation = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h4 key={i} className="font-semibold text-gray-900 mb-2 mt-4 first:mt-0">
            {line.replace(/\*\*/g, '')}
          </h4>
        );
      } else if (line.startsWith('**')) {
        return (
          <h5 key={i} className="font-medium text-gray-800 mb-1 mt-3 first:mt-0">
            {line.replace(/\*\*/g, '')}
          </h5>
        );
      } else if (line.trim()) {
        return (
          <p key={i} className="text-gray-700 mb-2 leading-relaxed">
            {line}
          </p>
        );
      }
      return null;
    });
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>🤖 Generando recomendaciones...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-red-200 p-6 ${className}`}>
        <div className="flex items-center space-x-2 text-red-600 mb-2">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Error generando recomendaciones</span>
        </div>
        <p className="text-red-600 text-sm mb-4">{error}</p>
        
        {error.includes('Error de autenticación') && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-800 text-sm">
              <strong>🔐 Sesión expirada:</strong> Tu sesión ha expirado. Por favor, inicia sesión nuevamente para continuar.
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
            >
              Ir al Login
            </button>
          </div>
        )}
        
        {error.includes('No se puede conectar') && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-yellow-800 text-sm">
              <strong>💡 Solución:</strong> Verifica que el backend esté funcionando en <code>http://localhost:5000</code>
            </p>
          </div>
        )}
        
        {error.includes('Timeout') && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-blue-800 text-sm">
              <strong>⏱️ El servidor tardó demasiado en responder.</strong> Esto puede ser normal para análisis complejos.
            </p>
          </div>
        )}
        
        {error.includes('Error en el servicio de IA') && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
            <p className="text-purple-800 text-sm">
              <strong>🤖 Error del servicio de IA:</strong> El modelo de Gemini no está disponible. Contacta al administrador del sistema.
            </p>
          </div>
        )}
        
        {error.includes('Error de configuración') && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4">
            <p className="text-indigo-800 text-sm">
              <strong>⚙️ Error de configuración:</strong> El modelo de IA no está disponible. El administrador debe verificar la configuración de Gemini.
            </p>
            <div className="mt-2 text-xs text-indigo-700">
              <strong>Posibles soluciones:</strong>
              <ul className="list-disc list-inside mt-1">
                <li>Verificar que la API key de Gemini esté configurada correctamente</li>
                <li>Confirmar que el modelo gemini-1.5-flash esté disponible</li>
                <li>Revisar la configuración de la API de Google Generative AI</li>
              </ul>
            </div>
          </div>
        )}
        
        {error.includes('500') && !error.includes('Error de autenticación') && !error.includes('Error en el servicio de IA') && !error.includes('Error de configuración') && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <p className="text-orange-800 text-sm">
              <strong>🚨 Error del servidor:</strong> El servidor está experimentando problemas. Intenta nuevamente en unos minutos.
            </p>
          </div>
        )}
        
        {showRefresh && (
          <button
            onClick={() => refetch(0)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Intentar nuevamente
          </button>
        )}
      </div>
    );
  }

  if (!data?.recommendations || data.recommendations.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <Brain className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>No hay recomendaciones disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          {showRefresh && (
            <button
              onClick={() => refetch(0)}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Actualizar recomendaciones"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>

        <div className="space-y-4">
          {data.recommendations.map((recommendation, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border-l-4 border-purple-400"
            >
              <div className="prose prose-sm max-w-none">
                {formatRecommendation(recommendation)}
              </div>
            </div>
          ))}
        </div>

        {data.metrics && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Métricas del Período</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{data.metrics.totalConsultas}</div>
                <div className="text-xs text-gray-600">Consultas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{data.metrics.totalMuestras}</div>
                <div className="text-xs text-gray-600">Muestras</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{data.metrics.totalOperaciones}</div>
                <div className="text-xs text-gray-600">Operaciones</div>
              </div>
              {data.metrics.conversionRates && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {data.metrics.conversionRates.consultasToMuestras}%
                  </div>
                  <div className="text-xs text-gray-600">Conversión</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiRecommendations;
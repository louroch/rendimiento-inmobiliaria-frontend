import React, { memo } from 'react';
import { Card, Text } from '@tremor/react';
import { Loader2, Database, Zap, Clock } from 'lucide-react';

interface OptimizedLoadingProps {
  type?: 'default' | 'stats' | 'chart' | 'table' | 'api';
  message?: string;
  showOptimization?: boolean;
  className?: string;
}

const OptimizedLoading: React.FC<OptimizedLoadingProps> = memo(({ 
  type = 'default', 
  message, 
  showOptimization = true,
  className = ''
}) => {
  const getLoadingConfig = () => {
    switch (type) {
      case 'stats':
        return {
          icon: <Database className="h-8 w-8 text-blue-600" />,
          defaultMessage: 'Cargando estadísticas optimizadas...',
          optimizationMessage: 'Aprovechando cache Redis del backend'
        };
      case 'chart':
        return {
          icon: <Zap className="h-8 w-8 text-purple-600" />,
          defaultMessage: 'Generando gráficos...',
          optimizationMessage: 'Renderizado acelerado con memoización'
        };
      case 'table':
        return {
          icon: <Database className="h-8 w-8 text-green-600" />,
          defaultMessage: 'Cargando datos de tabla...',
          optimizationMessage: 'Paginación y virtualización activas'
        };
      case 'api':
        return {
          icon: <Clock className="h-8 w-8 text-orange-600" />,
          defaultMessage: 'Conectando con el servidor...',
          optimizationMessage: 'Backend optimizado con Redis cache'
        };
      default:
        return {
          icon: <Loader2 className="h-8 w-8 text-gray-600" />,
          defaultMessage: 'Cargando...',
          optimizationMessage: 'Aplicación optimizada con lazy loading'
        };
    }
  };

  const config = getLoadingConfig();

  return (
    <Card className={`p-8 text-center ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        {/* Icono animado */}
        <div className="animate-spin">
          {config.icon}
        </div>

        {/* Mensaje principal */}
        <div className="space-y-2">
          <Text className="text-lg font-medium text-gray-900">
            {message || config.defaultMessage}
          </Text>
          
          {/* Mensaje de optimización */}
          {showOptimization && (
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Zap className="h-4 w-4 text-yellow-500" />
              <Text className="text-sm">
                {config.optimizationMessage}
              </Text>
            </div>
          )}
        </div>

        {/* Indicador de progreso sutil */}
        <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </Card>
  );
});

OptimizedLoading.displayName = 'OptimizedLoading';

export default OptimizedLoading;

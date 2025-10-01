import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Users,
  Eye,
  CheckCircle,
  Percent,
  Target
} from 'lucide-react';
import { Card, Metric, Text, Flex, Button, Select, SelectItem } from '@tremor/react';
import AdminLayout from '../components/AdminLayout';
import AdminChart from '../components/AdminChart';
import AdminTable from '../components/AdminTable';
import OptimizedLoading from '../components/OptimizedLoading';
import { useApiLoading } from '../hooks/useOptimizedLoading';
import { formatDateForExport } from '../utils/dateUtils';

interface PerformanceData {
  id: string;
  fecha: string;
  consultasRecibidas: number;
  muestrasRealizadas: number;
  operacionesCerradas: number;
  seguimiento: boolean;
  usoTokko: string | null;
  numeroCaptaciones?: number | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    performance: number;
  };
}

const AdminDashboard: React.FC = memo(() => {
  const navigate = useNavigate();
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error' | 'unknown'>('unknown');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  
  // Loading optimizado para aprovechar las mejoras del backend
  const { loading, isStale, error: loadingError, startLoading, finishLoading } = useApiLoading();
  const [filters, setFilters] = useState({
    userId: '',
    startDate: '',
    endDate: ''
  });
  const [stats, setStats] = useState({
    totalRecords: 0,
    totals: {
      consultasRecibidas: 0,
      muestrasRealizadas: 0,
      operacionesCerradas: 0,
      numeroCaptaciones: 0
    },
    averages: {
      consultasRecibidas: 0,
      muestrasRealizadas: 0,
      operacionesCerradas: 0,
      numeroCaptaciones: 0
    },
    conversionRates: {
      consultasToMuestras: 0,
      muestrasToOperaciones: 0
    }
  });

  const fetchData = useCallback(async () => {
    // Evitar llamadas concurrentes
    if (isFetching) {
      return;
    }
    
    try {
      setIsFetching(true);
      startLoading();
      setApiStatus('checking');
      
      // Preparar parámetros para la consulta
      const queryParams = {
        userId: filters.userId || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };
      
      // Obtener datos de desempeño (aprovecha cache Redis del backend)
      const performanceResponse = await api.get('/performance', {
        params: queryParams
      });
      
      // Ordenar los datos en el frontend por createdAt para asegurar el orden correcto
      const sortedData = performanceResponse.data.performance.sort((a: any, b: any) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      setPerformanceData(sortedData);

      // Obtener estadísticas generales (optimizadas con índices de BD)
      const statsResponse = await api.get('/performance/stats/overview', {
        params: {
          userId: filters.userId || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined
        }
      });
      
      setStats(statsResponse.data);

      // Obtener usuarios (cache más frecuente)
      const usersResponse = await api.get('/users');
      setUsers(usersResponse.data.users);
      
      setApiStatus('connected');
      setLastUpdate(new Date());
      finishLoading();
    } catch (error: any) {
      setApiStatus('error');
      console.error('Error obteniendo datos:', error);
      finishLoading(error.message || 'Error cargando datos del dashboard');
    } finally {
      setIsFetching(false);
    }
  }, [filters.userId, filters.startDate, filters.endDate, startLoading, finishLoading]);

  // Cargar datos al montar el componente y cuando cambien los filtros
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sincronización automática
  useEffect(() => {
    if (!autoSyncEnabled) return;
    const interval = setInterval(() => {
      fetchData();
    }, 30000); // 30 segundos
    return () => clearInterval(interval);
  }, [fetchData, autoSyncEnabled]);

  // Memoizar cálculos pesados
  const memoizedStats = useMemo(() => {
    if (!stats) return null;
    
    return {
      ...stats,
      conversionRate: stats.totals.consultasRecibidas > 0 
        ? (stats.totals.operacionesCerradas / stats.totals.consultasRecibidas * 100).toFixed(1)
        : '0',
      avgConsultas: stats.averages.consultasRecibidas.toFixed(1),
      avgMuestras: stats.averages.muestrasRealizadas.toFixed(1),
      avgOperaciones: stats.averages.operacionesCerradas.toFixed(1)
    };
  }, [stats]);

  const memoizedUserOptions = useMemo(() => {
    return users.map(user => ({
      value: user.id,
      text: user.name
    }));
  }, [users]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      userId: '',
      startDate: '',
      endDate: ''
    });
  }, []);

  const exportData = useCallback(() => {
    const csvContent = [
      ['Fecha', 'Asesor', 'Consultas', 'Muestras', 'Operaciones', 'Captaciones', 'Seguimiento', 'Tokko'],
      ...performanceData.map(record => [
        formatDateForExport(record.fecha),
        record.user.name,
        record.consultasRecibidas,
        record.muestrasRealizadas,
        record.operacionesCerradas,
        record.numeroCaptaciones || 0,
        record.seguimiento ? 'Sí' : 'No',
        record.usoTokko || 'No'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `desempeno_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [performanceData]);

  const hasActiveFilters = filters.userId || filters.startDate || filters.endDate;

  return (
    <AdminLayout title="Dashboard de Administración">
      <div className="space-y-6">
        {/* Filtros */}
        <Card className="p-4 bg-white">
          <div className="flex items-center space-x-2 mb-3">
            <Filter className="h-5 w-5 text-gray-600" />
            <Text className="text-lg font-medium">Filtros</Text>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Text className="text-sm font-medium mb-2">Asesor</Text>
              <Select
                value={filters.userId}
                onValueChange={(value) => handleFilterChange('userId', value)}
                placeholder="Todos los asesores"
              >
                <SelectItem value="">Todos los asesores</SelectItem>
                {memoizedUserOptions.map(user => (
                  <SelectItem key={user.value} value={user.value}>
                    {user.text}
                  </SelectItem>
                ))}
              </Select>
            </div>
            
            <div>
              <Text className="text-sm font-medium mb-2">Fecha Inicio</Text>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <Text className="text-sm font-medium mb-2">Fecha Fin</Text>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-end space-x-2">
              <Button
                onClick={clearFilters}
                variant="secondary"
                size="sm"
                className="flex-1"
              >
                Limpiar
              </Button>
              <Button
                onClick={exportData}
                variant="secondary"
                size="sm"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Indicadores de estado */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  apiStatus === 'connected' ? 'bg-green-500' : 
                  apiStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <Text className="text-xs text-gray-500">
                  API: {apiStatus === 'connected' ? 'Conectado' : 
                        apiStatus === 'error' ? 'Error' : 'Verificando...'}
                </Text>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  autoSyncEnabled ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'
                }`}></div>
                <Text className="text-xs text-gray-500">
                  Auto-sync: {autoSyncEnabled ? 'Activo' : 'Inactivo'}
                </Text>
              </div>
              
              {lastUpdate && (
                <Text className="text-xs text-gray-500">
                  Última actualización: {lastUpdate.toLocaleTimeString()}
                </Text>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
                variant="secondary"
                size="sm"
                style={{ 
                  backgroundColor: autoSyncEnabled ? '#10b981' : '#6b7280',
                  color: 'white'
                }}
              >
                {autoSyncEnabled ? 'OFF' : 'ON'}
              </Button>
              <Button
                onClick={fetchData}
                variant="secondary"
                size="sm"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </div>
        </Card>

        {/* Indicador de filtro activo */}
        {hasActiveFilters && (
          <Card className="p-3 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-blue-600" />
                <Text className="text-sm text-blue-800">
                  Filtros activos: {filters.userId && 'Asesor'} {filters.startDate && 'Fecha inicio'} {filters.endDate && 'Fecha fin'}
                </Text>
              </div>
              <Button
                onClick={clearFilters}
                variant="secondary"
                size="sm"
                style={{ backgroundColor: '#3b82f6', color: 'white' }}
              >
                Limpiar filtros
              </Button>
            </div>
          </Card>
        )}

        {/* Loading optimizado */}
        {loading && (
          <OptimizedLoading 
            type="stats" 
            message="Cargando dashboard optimizado..."
            showOptimization={true}
          />
        )}

        {/* Indicador de datos stale */}
        {isStale && !loading && (
          <Card className="p-3 bg-yellow-50 border-yellow-200">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <Text className="text-sm text-yellow-800">
                Datos en caché - Actualizando en segundo plano...
              </Text>
            </div>
          </Card>
        )}

        {/* Error de loading */}
        {loadingError && !loading && (
          <Card className="p-3 bg-red-50 border-red-200">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <Text className="text-sm text-red-800">
                {loadingError}
              </Text>
            </div>
          </Card>
        )}

        {/* Contenido principal - solo mostrar si no está cargando */}
        {!loading && (
          <>
            {/* Estadísticas generales */}
        <Card className="p-4 bg-white">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <Text className="text-lg font-medium">Estadísticas Generales</Text>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Text className="text-xl font-bold text-blue-600">{stats.totalRecords || 0}</Text>
              <Text className="text-sm text-gray-600">Total Registros</Text>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Text className="text-xl font-bold text-green-600">{stats.totals.consultasRecibidas || 0}</Text>
              <Text className="text-sm text-gray-600">Consultas</Text>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <Text className="text-xl font-bold text-yellow-600">{stats.totals.muestrasRealizadas || 0}</Text>
              <Text className="text-sm text-gray-600">Muestras</Text>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Text className="text-xl font-bold text-purple-600">{stats.totals.operacionesCerradas || 0}</Text>
              <Text className="text-sm text-gray-600">Operaciones</Text>
            </div>
            <div className="text-center p-3 bg-indigo-50 rounded-lg">
              <Text className="text-xl font-bold text-indigo-600">{stats.totals.numeroCaptaciones || 0}</Text>
              <Text className="text-sm text-gray-600">Captaciones</Text>
            </div>
          </div>
        </Card>

        {/* Tasas de conversión */}
        <Card className="p-4 bg-white">
          <div className="flex items-center space-x-2 mb-4">
            <Percent className="h-5 w-5 text-indigo-600" />
            <Text className="text-lg font-medium">Tasas de Conversión</Text>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-sm text-gray-600">Consultas → Muestras</Text>
                  <Text className="text-2xl font-bold text-green-600">
                    {typeof stats.conversionRates.consultasToMuestras === 'number' 
                      ? stats.conversionRates.consultasToMuestras.toFixed(1) 
                      : '0.0'}%
                  </Text>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-sm text-gray-600">Muestras → Operaciones</Text>
                  <Text className="text-2xl font-bold text-blue-600">
                    {typeof stats.conversionRates.muestrasToOperaciones === 'number' 
                      ? stats.conversionRates.muestrasToOperaciones.toFixed(1) 
                      : '0.0'}%
                  </Text>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>
        </Card>

        {/* Gráficos */}
        <Card className="p-6 bg-white">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <Text className="text-lg font-medium">Análisis de Desempeño</Text>
          </div>
          <div className="min-h-[600px]">
            <AdminChart data={performanceData} />
          </div>
        </Card>

        {/* Tabla de registros */}
        <Card className="p-4 bg-white">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-5 w-5 text-indigo-600" />
            <Text className="text-lg font-medium">Registros de Desempeño</Text>
          </div>
          <div className="w-full overflow-hidden">
            <AdminTable 
              data={performanceData} 
              onUpdate={fetchData}
            />
          </div>
        </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
});

AdminDashboard.displayName = 'AdminDashboard';

export default AdminDashboard;
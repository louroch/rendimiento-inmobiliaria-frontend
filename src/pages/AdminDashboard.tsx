import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Database,
  Users,
  Eye,
  CheckCircle,
  Percent,
  Building2
} from 'lucide-react';
import { Card, Metric, Text, Flex, Button, Select, SelectItem } from '@tremor/react';
import AdminLayout from '../components/AdminLayout';
import AdminChart from '../components/AdminChart';
import AdminTable from '../components/AdminTable';
import GeminiRecommendations from '../components/GeminiRecommendations';

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

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
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
      operacionesCerradas: 0
    },
    averages: {
      consultasRecibidas: 0,
      muestrasRealizadas: 0,
      operacionesCerradas: 0
    },
    conversionRates: {
      consultasToMuestras: 0,
      muestrasToOperaciones: 0
    }
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Obtener datos de desempeño
      const performanceResponse = await api.get('/performance', {
        params: {
          userId: filters.userId || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          limit: 100
        }
      });
      setPerformanceData(performanceResponse.data.performance);

      // Obtener estadísticas generales
      const statsResponse = await api.get('/performance/stats/overview', {
        params: {
          userId: filters.userId || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined
        }
      });
      setStats(statsResponse.data);

      // Obtener usuarios (siempre para mantener el select disponible)
      const usersResponse = await api.get('/users');
      setUsers(usersResponse.data.users);
    } catch (error) {
      console.error('Error obteniendo datos:', error);
    } finally {
      setLoading(false);
    }
  }, [filters.userId, filters.startDate, filters.endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      userId: '',
      startDate: '',
      endDate: ''
    });
  };

  const exportData = () => {
    const csvContent = [
      ['Fecha', 'Asesor', 'Consultas', 'Muestras', 'Operaciones', 'Seguimiento', 'Tokko'],
      ...performanceData.map(item => [
        new Date(item.fecha).toLocaleDateString('es-ES'),
        item.user.name,
        item.consultasRecibidas,
        item.muestrasRealizadas,
        item.operacionesCerradas,
        item.seguimiento ? 'Sí' : 'No',
        item.usoTokko || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rendimiento-inmobiliario-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <AdminLayout title="Panel de Administración" subtitle="Cargando datos...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#240046' }}></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Panel de Administración" 
      subtitle="Monitoreo y análisis del desempeño del equipo inmobiliario"
    >
      <div className="w-full space-y-3 sm:space-y-4" style={{ minWidth: 0 }}>
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end" style={{ 
          flexDirection: 'column',
          display: 'flex'
        }}>
          <Button
            onClick={() => navigate('/admin/tokko')}
            variant="secondary"
            icon={Building2}
            size="sm"
            className="w-full sm:w-auto"
            style={{ width: '100%', marginBottom: '0.5rem' }}
          >
            <span className="hidden sm:inline">Dashboard Tokko</span>
            <span className="sm:hidden">Tokko</span>
          </Button>
          <Button
            onClick={() => navigate('/admin/records')}
            variant="secondary"
            icon={Database}
            size="sm"
            className="w-full sm:w-auto"
            style={{ width: '100%', marginBottom: '0.5rem' }}
          >
            <span className="hidden sm:inline">Ver Registros</span>
            <span className="sm:hidden">Registros</span>
          </Button>
          <Button
            onClick={exportData}
            variant="secondary"
            icon={Download}
            size="sm"
            className="w-full sm:w-auto"
            style={{ width: '100%', marginBottom: '0.5rem' }}
          >
            Exportar
          </Button>
          <Button
            onClick={fetchData}
            icon={RefreshCw}
            size="sm"
            className="w-full sm:w-auto"
            style={{ 
              backgroundColor: '#240046', 
              borderColor: '#240046', 
              color: 'white',
              width: '100%'
            }}
          >
            Actualizar
          </Button>
        </div>

        {/* Filtros */}
        <Card className="p-3 sm:p-4">
          <Flex alignItems="center" justifyContent="between" className="mb-3">
            <Flex alignItems="center" className="space-x-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <Text className="text-sm sm:text-base font-medium text-gray-900">Filtros</Text>
            </Flex>
          </Flex>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <Text className="text-sm font-medium text-gray-700 mb-2">Asesor</Text>
              <Select
                value={filters.userId}
                onValueChange={(value) => handleFilterChange('userId', value)}
                placeholder="Todos los asesores"
                className="bg-white"
              >
                <SelectItem value="" className="bg-white text-gray-900 hover:bg-gray-100">Todos los asesores</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id} className="bg-white text-gray-900 hover:bg-gray-100">
                    {user.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
            
            <div>
              <Text className="text-sm font-medium text-gray-700 mb-2">Fecha Inicio</Text>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-transparent text-sm"
              />
            </div>
            
            <div>
              <Text className="text-sm font-medium text-gray-700 mb-2">Fecha Fin</Text>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-transparent text-sm"
              />
            </div>
            
            <div className="flex items-end sm:col-span-2 lg:col-span-1">
              <Button
                onClick={clearFilters}
                variant="secondary"
                size="sm"
                className="w-full"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </Card>

        {/* Indicador de filtro activo */}
        {filters.userId && (
          <Card className="p-3 bg-blue-50 border-blue-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <Text className="text-blue-800 font-medium text-sm">
                Mostrando estadísticas de: {users.find(u => u.id === filters.userId)?.name || 'Agente seleccionado'}
              </Text>
              <Button
                onClick={() => handleFilterChange('userId', '')}
                variant="secondary"
                size="xs"
                className="ml-auto"
              >
                Ver todos
              </Button>
            </div>
          </Card>
        )}

        {/* Estadísticas Generales */}
        <div className="grid gap-3 sm:gap-4 w-full" style={{ 
          gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
          display: 'grid'
        }}>
          {/* Total Consultas */}
          <Card className="p-3 sm:p-4" style={{ width: '100%', marginBottom: '0.75rem' }}>
            <Flex alignItems="center" justifyContent="between" style={{ width: '100%' }}>
              <div className="min-w-0 flex-1" style={{ minWidth: 0, flex: 1 }}>
                <Text className="text-xs font-medium text-gray-600 truncate" style={{ fontSize: '0.75rem' }}>
                  {filters.userId ? 'Consultas del Agente' : 'Total Consultas'}
                </Text>
                <Metric className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontSize: '1.125rem' }}>{stats.totals.consultasRecibidas}</Metric>
                <Text className="text-xs text-gray-500" style={{ fontSize: '0.75rem' }}>Promedio: {stats.averages.consultasRecibidas}</Text>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0 ml-2" style={{ padding: '0.5rem', marginLeft: '0.5rem' }}>
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" style={{ height: '1rem', width: '1rem' }} />
              </div>
            </Flex>
          </Card>

          {/* Total Muestras */}
          <Card className="p-3 sm:p-4" style={{ width: '100%', marginBottom: '0.75rem' }}>
            <Flex alignItems="center" justifyContent="between" style={{ width: '100%' }}>
              <div className="min-w-0 flex-1" style={{ minWidth: 0, flex: 1 }}>
                <Text className="text-xs font-medium text-gray-600 truncate" style={{ fontSize: '0.75rem' }}>
                  {filters.userId ? 'Muestras del Agente' : 'Total Muestras'}
                </Text>
                <Metric className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontSize: '1.125rem' }}>{stats.totals.muestrasRealizadas}</Metric>
                <Text className="text-xs text-gray-500" style={{ fontSize: '0.75rem' }}>Promedio: {stats.averages.muestrasRealizadas}</Text>
              </div>
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0 ml-2" style={{ padding: '0.5rem', marginLeft: '0.5rem' }}>
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" style={{ height: '1rem', width: '1rem' }} />
              </div>
            </Flex>
          </Card>

          {/* Total Operaciones */}
          <Card className="p-3 sm:p-4" style={{ width: '100%', marginBottom: '0.75rem' }}>
            <Flex alignItems="center" justifyContent="between" style={{ width: '100%' }}>
              <div className="min-w-0 flex-1" style={{ minWidth: 0, flex: 1 }}>
                <Text className="text-xs font-medium text-gray-600 truncate" style={{ fontSize: '0.75rem' }}>
                  {filters.userId ? 'Operaciones del Agente' : 'Total Operaciones'}
                </Text>
                <Metric className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontSize: '1.125rem' }}>{stats.totals.operacionesCerradas}</Metric>
                <Text className="text-xs text-gray-500" style={{ fontSize: '0.75rem' }}>Promedio: {stats.averages.operacionesCerradas}</Text>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0 ml-2" style={{ padding: '0.5rem', marginLeft: '0.5rem' }}>
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" style={{ height: '1rem', width: '1rem' }} />
              </div>
            </Flex>
          </Card>

          {/* Conversión General */}
          <Card className="p-3 sm:p-4" style={{ width: '100%', marginBottom: '0.75rem' }}>
            <Flex alignItems="center" justifyContent="between" style={{ width: '100%' }}>
              <div className="min-w-0 flex-1" style={{ minWidth: 0, flex: 1 }}>
                <Text className="text-xs font-medium text-gray-600 truncate" style={{ fontSize: '0.75rem' }}>
                  {filters.userId ? 'Conversión del Agente' : 'Conversión General'}
                </Text>
                <Metric className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontSize: '1.125rem' }}>
                  {stats.totals.consultasRecibidas > 0 
                    ? (stats.totals.operacionesCerradas / stats.totals.consultasRecibidas * 100).toFixed(1)
                    : 0}%
                </Metric>
                <Text className="text-xs text-gray-500" style={{ fontSize: '0.75rem' }}>{stats.totalRecords} registros</Text>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0 ml-2" style={{ padding: '0.5rem', marginLeft: '0.5rem' }}>
                <Percent className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" style={{ height: '1rem', width: '1rem' }} />
              </div>
            </Flex>
          </Card>
        </div>

        {/* Tasas de Conversión Detalladas */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Card className="p-3 sm:p-4">
            <Flex alignItems="center" className="space-x-2 mb-3">
              <TrendingUp className="h-4 w-4 text-gray-600" />
              <Text className="text-sm sm:text-base font-medium text-gray-900">Tasas de Conversión</Text>
            </Flex>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Flex alignItems="center" justifyContent="between">
                  <div className="min-w-0 flex-1">
                    <Text className="text-xs font-medium text-blue-900 truncate">Consultas → Muestras</Text>
                    <Metric className="text-base sm:text-lg font-bold text-blue-600">
                      {stats.conversionRates.consultasToMuestras}%
                    </Metric>
                  </div>
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 flex-shrink-0 ml-2" />
                </Flex>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <Flex alignItems="center" justifyContent="between">
                  <div className="min-w-0 flex-1">
                    <Text className="text-xs font-medium text-green-900 truncate">Muestras → Operaciones</Text>
                    <Metric className="text-base sm:text-lg font-bold text-green-600">
                      {stats.conversionRates.muestrasToOperaciones}%
                    </Metric>
                  </div>
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 flex-shrink-0 ml-2" />
                </Flex>
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-4">
            <Text className="text-sm sm:text-base font-medium text-gray-900 mb-3">Resumen de Eficiencia</Text>
            <div className="space-y-2">
              <Flex justifyContent="between" alignItems="center">
                <Text className="text-xs text-gray-600 truncate">Consultas por día promedio:</Text>
                <span className="text-xs font-medium text-gray-900 flex-shrink-0 ml-2">{stats.averages.consultasRecibidas}</span>
              </Flex>
              <Flex justifyContent="between" alignItems="center">
                <Text className="text-xs text-gray-600 truncate">Muestras por día promedio:</Text>
                <span className="text-xs font-medium text-gray-900 flex-shrink-0 ml-2">{stats.averages.muestrasRealizadas}</span>
              </Flex>
              <Flex justifyContent="between" alignItems="center">
                <Text className="text-xs text-gray-600 truncate">Operaciones por día promedio:</Text>
                <span className="text-xs font-medium text-gray-900 flex-shrink-0 ml-2">{stats.averages.operacionesCerradas}</span>
              </Flex>
              <div className="border-t pt-2">
                <Flex justifyContent="between" alignItems="center">
                  <Text className="text-xs font-medium text-gray-900 truncate">Eficiencia general:</Text>
                  <span className="text-xs font-bold text-green-600 flex-shrink-0 ml-2">
                    {stats.totals.consultasRecibidas > 0 
                      ? (stats.totals.operacionesCerradas / stats.totals.consultasRecibidas * 100).toFixed(1)
                      : 0}%
                  </span>
                </Flex>
              </div>
            </div>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Card className="p-3 sm:p-4">
            <Flex alignItems="center" className="space-x-2 mb-3">
              <BarChart3 className="h-4 w-4 text-gray-600" />
              <Text className="text-sm sm:text-base font-medium text-gray-900">Tendencias de Desempeño</Text>
            </Flex>
            <AdminChart data={performanceData} />
          </Card>

          <Card className="p-3 sm:p-4">
            <Flex alignItems="center" className="space-x-2 mb-3">
              <TrendingUp className="h-4 w-4 text-gray-600" />
              <Text className="text-sm sm:text-base font-medium text-gray-900">Recomendaciones IA</Text>
            </Flex>
            <GeminiRecommendations 
              filters={filters}
              performanceData={performanceData}
            />
          </Card>
        </div>

        {/* Tabla de Desempeño */}
        <Card className="p-3 sm:p-4">
          <Flex alignItems="center" className="space-x-2 mb-3">
            <Calendar className="h-4 w-4 text-gray-600" />
            <Text className="text-sm sm:text-base font-medium text-gray-900">Registros de Desempeño</Text>
          </Flex>
          <div className="overflow-x-auto">
            <AdminTable 
              data={performanceData}
              onUpdate={fetchData}
            />
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

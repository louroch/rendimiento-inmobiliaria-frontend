import React, { useState, useEffect, useCallback } from 'react';
import { 
  Filter, 
  Download, 
  Users,
  Eye,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { Card, Metric, Text, Flex, Badge, Button, Select, SelectItem } from '@tremor/react';
import { api } from '../services/api';
import AdminLayout from '../components/AdminLayout';

interface Record {
  id: string;
  fecha: string;
  consultasRecibidas: number;
  muestrasRealizadas: number;
  operacionesCerradas: number;
  seguimiento: boolean;
  usoTokko: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface Stats {
  totalConsultas: number;
  totalMuestras: number;
  totalOperaciones: number;
  promedioConsultas: number;
  promedioMuestras: number;
  promedioOperaciones: number;
}

const AdminRecords: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    userId: '',
    startDate: '',
    endDate: ''
  });

  const [users, setUsers] = useState<Array<{id: string, name: string, email: string}>>([]);

  const loadUsers = useCallback(async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
    }
  }, []);

  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await api.get(`/records?${params.toString()}`);
      setRecords(response.data.records);
      setStats(response.data.stats);
    } catch (err: any) {
      console.error('Error cargando registros:', err);
      setError(err.response?.data?.message || 'Error cargando registros');
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.limit, filters.userId, filters.startDate, filters.endDate]);

  useEffect(() => {
    loadUsers();
    loadRecords();
  }, [loadUsers, loadRecords]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset page when filters change
    }));
  };

  const exportToCSV = () => {
    const headers = ['Fecha', 'Agente', 'Email', 'Consultas', 'Muestras', 'Operaciones', 'Seguimiento', 'Uso Tokko'];
    const csvData = records.map(record => [
      new Date(record.fecha).toLocaleDateString(),
      record.user.name,
      record.user.email,
      record.consultasRecibidas,
      record.muestrasRealizadas,
      record.operacionesCerradas,
      record.seguimiento ? 'Sí' : 'No',
      record.usoTokko || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registros-desempeno-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const calculateConversionRate = (from: number, to: number) => {
    if (from === 0) return 0;
    return Math.round((to / from) * 100);
  };

  return (
    <AdminLayout 
      title="Registros de Desempeño" 
      subtitle="Vista consolidada de todos los registros"
      showBackButton={true}
      backPath="/admin"
    >
      <div className="space-y-6">
        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 justify-end">
          <Button
            onClick={exportToCSV}
            variant="secondary"
            icon={Download}
            size="sm"
          >
            Exportar CSV
          </Button>
        </div>

        {/* Estadísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 bg-white">
              <Flex alignItems="center" justifyContent="between">
                <div>
                  <Text className="text-sm font-medium text-gray-600">Total Consultas</Text>
                  <Metric className="text-2xl font-bold text-gray-900">{stats.totalConsultas}</Metric>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </Flex>
            </Card>

            <Card className="p-6 bg-white">
              <Flex alignItems="center" justifyContent="between">
                <div>
                  <Text className="text-sm font-medium text-gray-600">Total Muestras</Text>
                  <Metric className="text-2xl font-bold text-gray-900">{stats.totalMuestras}</Metric>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
              </Flex>
            </Card>

            <Card className="p-6 bg-white">
              <Flex alignItems="center" justifyContent="between">
                <div>
                  <Text className="text-sm font-medium text-gray-600">Total Operaciones</Text>
                  <Metric className="text-2xl font-bold text-gray-900">{stats.totalOperaciones}</Metric>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
              </Flex>
            </Card>

            <Card className="p-6 bg-white">
              <Flex alignItems="center" justifyContent="between">
                <div>
                  <Text className="text-sm font-medium text-gray-600">Conversión</Text>
                  <Metric className="text-2xl font-bold text-gray-900">
                    {calculateConversionRate(stats.totalConsultas, stats.totalOperaciones)}%
                  </Metric>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </Flex>
            </Card>
          </div>
        )}

        {/* Filtros */}
        <Card className="p-6 bg-white">
          <Flex alignItems="center" className="space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <Text className="text-lg font-medium text-gray-900">Filtros</Text>
          </Flex>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Text className="text-sm font-medium text-gray-700 mb-2">Agente</Text>
              <Select
                value={filters.userId}
                onValueChange={(value) => handleFilterChange('userId', value)}
                placeholder="Todos los agentes"
                className="bg-white"
              >
                <SelectItem value="" className="bg-white text-gray-900 hover:bg-gray-100">Todos los agentes</SelectItem>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-transparent"
              />
            </div>

            <div>
              <Text className="text-sm font-medium text-gray-700 mb-2">Fecha Fin</Text>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-transparent"
              />
            </div>

            <div>
              <Text className="text-sm font-medium text-gray-700 mb-2">Registros por página</Text>
              <Select
                value={filters.limit.toString()}
                onValueChange={(value) => handleFilterChange('limit', value)}
                placeholder="10"
                className="bg-white"
              >
                <SelectItem value="10" className="bg-white text-gray-900 hover:bg-gray-100">10</SelectItem>
                <SelectItem value="25" className="bg-white text-gray-900 hover:bg-gray-100">25</SelectItem>
                <SelectItem value="50" className="bg-white text-gray-900 hover:bg-gray-100">50</SelectItem>
                <SelectItem value="100" className="bg-white text-gray-900 hover:bg-gray-100">100</SelectItem>
              </Select>
            </div>
          </div>
        </Card>

        {/* Tabla de registros */}
        <Card className="p-6 bg-white">
          <Text className="text-lg font-medium text-gray-900 mb-4">Registros</Text>

          {loading ? (
            <div className="p-8 text-center bg-white">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: '#240046' }}></div>
              <p className="mt-2 text-gray-600">Cargando registros...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-white">
              <p className="text-red-600">{error}</p>
            </div>
          ) : records.length === 0 ? (
            <div className="p-8 text-center bg-white">
              <p className="text-gray-600">No se encontraron registros</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Consultas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Muestras
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Operaciones
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversión
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seguimiento
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.map((record) => {
                    const conversionRate = calculateConversionRate(record.consultasRecibidas, record.operacionesCerradas);
                    return (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(record.fecha).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{record.user.name}</div>
                            <div className="text-sm text-gray-500">{record.user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.consultasRecibidas}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.muestrasRealizadas}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.operacionesCerradas}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <Badge 
                            color={
                              conversionRate >= 20 ? 'green' :
                              conversionRate >= 10 ? 'yellow' : 'red'
                            }
                            size="sm"
                          >
                            {conversionRate}%
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            color={record.seguimiento ? 'green' : 'gray'}
                            size="sm"
                          >
                            {record.seguimiento ? 'Sí' : 'No'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminRecords;

import React, { useState } from 'react';
import { 
  Brain, 
  Filter, 
  RefreshCw, 
  Calendar,
  Users,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Card, Text, Flex, Button, Select, SelectItem } from '@tremor/react';
import AdminLayout from '../components/AdminLayout';
import GeminiRecommendations from '../components/GeminiRecommendations';
import { api } from '../services/api';

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

const AIRecommendations: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    userId: '',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      userId: '',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <AdminLayout 
      title="Recomendaciones de IA" 
      subtitle="Análisis inteligente y recomendaciones basadas en datos de rendimiento"
    >
      <div className="space-y-6">
        {/* Header con información */}
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <Flex alignItems="center" className="space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <Text className="text-lg font-semibold text-gray-900">Inteligencia Artificial</Text>
              <Text className="text-sm text-gray-600">
                Obtén recomendaciones personalizadas basadas en el análisis de datos de rendimiento
              </Text>
            </div>
          </Flex>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <Text className="text-sm text-gray-700">Análisis automático de tendencias</Text>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <Text className="text-sm text-gray-700">Recomendaciones personalizadas</Text>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-500" />
              <Text className="text-sm text-gray-700">Insights por agente y equipo</Text>
            </div>
          </div>
        </Card>

        {/* Filtros */}
        <Card className="p-6">
          <Flex alignItems="center" className="space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <Text className="text-lg font-semibold text-gray-900">Filtros de Análisis</Text>
          </Flex>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Text className="text-sm font-medium text-gray-700 mb-2">Asesor</Text>
              <Select
                value={filters.userId}
                onValueChange={(value) => handleFilterChange('userId', value)}
                placeholder="Todos los asesores"
                className="bg-white"
              >
                <SelectItem value="" className="bg-white text-gray-900 hover:bg-gray-100">
                  Todos los asesores
                </SelectItem>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>
            
            <div>
              <Text className="text-sm font-medium text-gray-700 mb-2">Fecha Fin</Text>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>
            
            <div className="flex items-end">
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
          <Card className="p-4 bg-blue-50 border-blue-200">
            <Flex alignItems="center" className="space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <Text className="text-blue-800 font-medium text-sm">
                Analizando datos de: {users.find(u => u.id === filters.userId)?.name || 'Agente seleccionado'}
              </Text>
              <Button
                onClick={() => handleFilterChange('userId', '')}
                variant="secondary"
                size="xs"
                className="ml-auto"
              >
                Ver todos
              </Button>
            </Flex>
          </Card>
        )}

        {/* Recomendaciones Generales */}
        <GeminiRecommendations 
          type="general"
          filters={{
            startDate: filters.startDate,
            endDate: filters.endDate,
            userId: filters.userId
          }}
          title="Recomendaciones Generales del Equipo"
          showRefresh={true}
        />

        {/* Análisis Avanzado */}
        <GeminiRecommendations 
          type="advanced"
          filters={{
            startDate: filters.startDate,
            endDate: filters.endDate,
            userId: filters.userId,
            includeTokko: true,
            includeWeekly: true
          }}
          title="Análisis Avanzado con IA"
          showRefresh={true}
        />

        {/* Información adicional */}
        <Card className="p-6 bg-gray-50 border-gray-200">
          <Flex alignItems="center" className="space-x-2 mb-3">
            <Calendar className="h-5 w-5 text-gray-600" />
            <Text className="text-lg font-semibold text-gray-900">Sobre las Recomendaciones</Text>
          </Flex>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Las recomendaciones se generan automáticamente basándose en los datos de rendimiento del período seleccionado.</p>
            <p>• El análisis incluye métricas de consultas, muestras, operaciones y datos de Tokko CRM.</p>
            <p>• Las recomendaciones se actualizan en tiempo real cuando cambias los filtros.</p>
            <p>• Puedes hacer clic en el botón de actualizar para regenerar las recomendaciones.</p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AIRecommendations;

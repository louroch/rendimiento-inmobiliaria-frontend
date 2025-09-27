import React, { useState, useEffect, useCallback } from 'react';
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  Users, 
  Filter
} from 'lucide-react';
import { Card, Text, Flex, Button, Badge } from '@tremor/react';
import { api } from '../services/api';
import AdminLayout from '../components/AdminLayout';

interface AgentRanking {
  userId: string;
  name: string;
  email: string;
  totalConsultas: number;
  totalMuestras: number;
  totalOperaciones: number;
  totalCaptaciones: number;
  totalRegistros: number;
  eficiencia: number;
}

const AdminUsers: React.FC = () => {
  const [ranking, setRanking] = useState<AgentRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  });

  const fetchRanking = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await api.get(`/users/ranking?${params.toString()}`);
      setRanking(response.data.ranking);
    } catch (error) {
      console.error('Error obteniendo ranking:', error);
    } finally {
      setLoading(false);
    }
  }, [filters.startDate, filters.endDate]);

  useEffect(() => {
    fetchRanking();
  }, [fetchRanking]);

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-600">#{position}</span>;
    }
  };

  const getRankColor = (position: number) => {
    switch (position) {
      case 1: return 'bg-yellow-50 border-yellow-200';
      case 2: return 'bg-gray-50 border-gray-200';
      case 3: return 'bg-amber-50 border-amber-200';
      default: return 'bg-white border-gray-200';
    }
  };

  const clearFilters = () => {
    setFilters({ startDate: '', endDate: '' });
  };

  return (
    <AdminLayout 
      title="Ranking de Agentes" 
      subtitle="Clasificación por eficiencia y desempeño"
    >
      <div className="space-y-6">
        {/* Filtros */}
        <Card className="p-6 bg-white">
          <Flex alignItems="center" className="space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <Text className="text-lg font-medium text-gray-900">Filtros</Text>
          </Flex>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Text className="text-sm font-medium text-gray-700 mb-2">Fecha Inicio</Text>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-transparent"
              />
            </div>

            <div>
              <Text className="text-sm font-medium text-gray-700 mb-2">Fecha Fin</Text>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-transparent"
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

        {/* Ranking */}
        <Card className="p-6 bg-white">
          <Flex alignItems="center" className="space-x-2 mb-6">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <Text className="text-xl font-bold text-gray-900">Ranking de Agentes</Text>
            <Badge color="blue" size="sm">
              {ranking.length} agentes
            </Badge>
          </Flex>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: '#240046' }}></div>
              <p className="mt-2 text-gray-600">Cargando ranking...</p>
            </div>
          ) : ranking.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay datos de agentes para mostrar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ranking.map((agent, index) => (
                <div
                  key={agent.userId}
                  className={`p-6 rounded-lg border-2 transition-all hover:shadow-md ${getRankColor(index + 1)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12">
                        {getRankIcon(index + 1)}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                        <p className="text-sm text-gray-600">{agent.email}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">
                          {agent.eficiencia}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Eficiencia</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{agent.totalConsultas}</p>
                      <p className="text-sm text-gray-600">Consultas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{agent.totalMuestras}</p>
                      <p className="text-sm text-gray-600">Muestras</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{agent.totalOperaciones}</p>
                      <p className="text-sm text-gray-600">Operaciones</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-600">{agent.totalCaptaciones}</p>
                      <p className="text-sm text-gray-600">Captaciones</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-600">{agent.totalRegistros}</p>
                      <p className="text-sm text-gray-600">Registros</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;

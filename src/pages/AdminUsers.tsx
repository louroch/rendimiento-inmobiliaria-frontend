import React, { useState, useEffect, useCallback } from 'react';
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  Users, 
  Filter,
  BarChart3
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

interface AgentWithConversion extends AgentRanking {
  conversionRates: {
    consultaToMuestra: number;
    muestraToOperacion: number;
    consultaToOperacion: number;
  };
}

const AdminUsers: React.FC = () => {
  const [ranking, setRanking] = useState<AgentWithConversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  });

  // Función para calcular tasas de conversión
  const calculateConversionRates = (agent: AgentRanking) => {
    const consultaToMuestra = agent.totalConsultas > 0 ? (agent.totalMuestras / agent.totalConsultas) * 100 : 0;
    const muestraToOperacion = agent.totalMuestras > 0 ? (agent.totalOperaciones / agent.totalMuestras) * 100 : 0;
    const consultaToOperacion = agent.totalConsultas > 0 ? (agent.totalOperaciones / agent.totalConsultas) * 100 : 0;
    
    return {
      consultaToMuestra: Math.round(consultaToMuestra * 10) / 10,
      muestraToOperacion: Math.round(muestraToOperacion * 10) / 10,
      consultaToOperacion: Math.round(consultaToOperacion * 10) / 10
    };
  };

  // Función para procesar y enriquecer los datos del ranking
  const processRankingData = (data: AgentRanking[]): AgentWithConversion[] => {
    return data.map(agent => {
      const conversionRates = calculateConversionRates(agent);
      
      return {
        ...agent,
        conversionRates
      };
    }).sort((a, b) => b.totalOperaciones - a.totalOperaciones); // Ordenar por operaciones cerradas
  };

  const fetchRanking = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await api.get(`/users/ranking?${params.toString()}`);
      const processedData = processRankingData(response.data.ranking);
      setRanking(processedData);
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
      case 1: return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 2: return <Medal className="h-7 w-7 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-600">#{position}</span>;
    }
  };

  const getRankColor = (position: number) => {
    switch (position) {
      case 1: return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300 shadow-lg';
      case 2: return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 shadow-md';
      case 3: return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-300 shadow-md';
      default: return 'bg-white border-gray-200';
    }
  };

  const clearFilters = () => {
    setFilters({ startDate: '', endDate: '' });
  };

  return (
    <AdminLayout 
      title="Ranking de Agentes" 
      subtitle="Clasificación por operaciones cerradas y tasas de conversión"
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
                  {/* Header con posición y nombre */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12">
                        {getRankIcon(index + 1)}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                        <p className="text-sm text-gray-600">{agent.email}</p>
                      </div>
                    </div>

                    {/* Operaciones cerradas como métrica principal */}
                    
                  </div>

                  {/* Métricas principales */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
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

                  {/* Tasas de conversión */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <BarChart3 className="h-5 w-5 text-indigo-600" />
                      <h4 className="text-sm font-semibold text-gray-900">Tasas de Conversión</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-indigo-600">{agent.conversionRates.consultaToMuestra}%</p>
                        <p className="text-xs text-gray-600">Consulta → Muestra</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-indigo-600">{agent.conversionRates.muestraToOperacion}%</p>
                        <p className="text-xs text-gray-600">Muestra → Operación</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-indigo-600">{agent.conversionRates.consultaToOperacion}%</p>
                        <p className="text-xs text-gray-600">Consulta → Operación</p>
                      </div>
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

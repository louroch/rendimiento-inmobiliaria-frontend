import React, { useState, useEffect, useCallback } from 'react';
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Filter,
  Download,
  BarChart3,
  Target,
  Percent,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { Card, Text, Flex, Button, Select, SelectItem } from '@tremor/react';
import AdminLayout from '../components/AdminLayout';
import ExportButton from '../components/ExportButton';
import { reportsService, DashboardData, AgentRanking } from '../services/reportsService';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const ReportsDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  });

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await reportsService.getDashboard({
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      });
      setDashboardData(data);
    } catch (error) {
      console.error('Error obteniendo datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [filters.startDate, filters.endDate]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-4 w-4 text-amber-600" />;
      default: return <span className="text-sm font-bold text-gray-600">#{position}</span>;
    }
  };

  const getRankColor = (position: number) => {
    switch (position) {
      case 1: return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300';
      case 2: return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300';
      case 3: return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-300';
      default: return 'bg-white border-gray-200';
    }
  };

  const clearFilters = () => {
    setFilters({ startDate: '', endDate: '' });
  };


  const exportToExcel = async () => {
    try {
      const blob = await reportsService.exportToExcel({
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_dashboard_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exportando Excel:', error);
    }
  };

  const renderRankingCard = (title: string, rankings: AgentRanking[], icon: React.ReactNode) => (
    <Card className="p-6 bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gray-50 rounded-lg">
          {icon}
        </div>
        <Text className="text-lg font-semibold text-gray-900">{title}</Text>
      </div>
      
      <div className="space-y-3">
        {rankings.slice(0, 5).map((agent, index) => {
          // Determinar el valor a mostrar según el tipo de ranking
          let displayValue = 0;
          let displayLabel = '';
          let valueColor = 'text-gray-900';
          
          if (title.includes('Captaciones')) {
            displayValue = agent.numeroCaptaciones;
            displayLabel = '';
            valueColor = 'text-amber-600';
          } else if (title.includes('Muestras')) {
            displayValue = agent.muestrasRealizadas;
            displayLabel = '';
            valueColor = 'text-green-600';
          } else if (title.includes('Operaciones')) {
            displayValue = agent.operacionesCerradas;
            displayLabel = '';
            valueColor = 'text-purple-600';
          } else if (title.includes('Conversión Consultas')) {
            displayValue = parseFloat(agent.conversionRates.consultasToMuestras);
            displayLabel = '%';
            valueColor = 'text-blue-600';
          } else if (title.includes('Conversión Muestras')) {
            displayValue = agent.conversionRates.muestrasToOperaciones;
            displayLabel = '%';
            valueColor = 'text-indigo-600';
          } else if (title.includes('General')) {
            displayValue = agent.score;
            displayLabel = '';
            valueColor = 'text-gray-700';
          }
          
          return (
            <div
              key={`${agent.agente.id}-${index}`}
              className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-sm ${
                index === 0 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200' :
                index === 1 ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200' :
                index === 2 ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200' :
                'bg-white border-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 min-w-0 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border">
                    {getRankIcon(index + 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Text className="font-semibold text-gray-900 truncate">
                      {agent.agente.name}
                    </Text>
                    <Text className="text-xs text-gray-500 truncate">
                      {agent.agente.email}
                    </Text>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {agent.consultasRecibidas} consultas
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className={`text-2xl font-bold ${valueColor}`}>
                    {displayValue}{displayLabel}
                  </div>
                  <Text className="text-xs text-gray-500 mt-1">
                    {index === 0 ? 'Líder' : index === 1 ? 'Segundo' : index === 2 ? 'Tercero' : `#${index + 1}`}
                  </Text>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );

  if (loading) {
    return (
      <AdminLayout title="Reportes" subtitle="Dashboard de análisis y rankings">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#240046' }}></div>
          <Text className="ml-2 text-gray-600">Cargando reportes...</Text>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Reportes" subtitle="Dashboard de análisis y rankings">
      <div className="space-y-6">
        {/* Filtros */}
        <Card className="p-4 bg-white">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <Text className="text-lg font-medium">Filtros</Text>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Text className="text-sm font-medium mb-2">Fecha Inicio</Text>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-transparent"
              />
            </div>

            <div>
              <Text className="text-sm font-medium mb-2">Fecha Fin</Text>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-transparent"
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
                onClick={fetchDashboardData}
                variant="secondary"
                size="sm"
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>

            <div className="flex items-end space-x-2">
              <ExportButton
                templateType="dashboard"
                startDate={filters.startDate}
                endDate={filters.endDate}
                variant="secondary"
                size="sm"
                className="flex-1"
              />
              <Button
                onClick={exportToExcel}
                variant="secondary"
                size="sm"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>
          </div>
        </Card>

        {/* Métricas del equipo */}
        {dashboardData && (
          <Card className="p-6 bg-white">
            <div className="flex items-center space-x-2 mb-6">
              <Users className="h-6 w-6 text-indigo-600" />
              <Text className="text-xl font-bold">Métricas del Equipo</Text>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Text className="text-2xl font-bold text-blue-600">{dashboardData.teamMetrics.totalAgentes}</Text>
                <Text className="text-sm text-gray-600">Agentes</Text>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Text className="text-2xl font-bold text-green-600">{dashboardData.teamMetrics.totalConsultas}</Text>
                <Text className="text-sm text-gray-600">Consultas</Text>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Text className="text-2xl font-bold text-yellow-600">{dashboardData.teamMetrics.totalMuestras}</Text>
                <Text className="text-sm text-gray-600">Muestras</Text>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Text className="text-2xl font-bold text-purple-600">{dashboardData.teamMetrics.totalOperaciones}</Text>
                <Text className="text-sm text-gray-600">Operaciones</Text>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <Text className="text-2xl font-bold text-indigo-600">
                  {dashboardData.teamMetrics.conversionRates.consultasToMuestras}%
                </Text>
                <Text className="text-sm text-gray-600">Conv. Consultas</Text>
              </div>
            </div>

            {/* Tasas de conversión */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Text className="text-sm text-gray-600">Consultas → Muestras</Text>
                    <Text className="text-2xl font-bold text-green-600">
                      {dashboardData.teamMetrics.conversionRates.consultasToMuestras}%
                    </Text>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Text className="text-sm text-gray-600">Muestras → Operaciones</Text>
                    <Text className="text-2xl font-bold text-blue-600">
                      {dashboardData.teamMetrics.conversionRates.muestrasToOperaciones}%
                    </Text>
                  </div>
                  <Target className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Rankings */}
        {dashboardData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {dashboardData.rankings?.captaciones && dashboardData.rankings.captaciones.length > 0 && renderRankingCard(
              "Top Captaciones",
              dashboardData.rankings.captaciones,
              <Trophy className="h-5 w-5 text-yellow-500" />
            )}
            
            {dashboardData.rankings?.muestras && dashboardData.rankings.muestras.length > 0 && renderRankingCard(
              "Top Muestras",
              dashboardData.rankings.muestras,
              <BarChart3 className="h-5 w-5 text-green-500" />
            )}
            
            {dashboardData.rankings?.operaciones && dashboardData.rankings.operaciones.length > 0 && renderRankingCard(
              "Top Operaciones",
              dashboardData.rankings.operaciones,
              <Target className="h-5 w-5 text-purple-500" />
            )}
            
            {dashboardData.rankings?.conversionConsultas && dashboardData.rankings.conversionConsultas.length > 0 && renderRankingCard(
              "Mejor Conversión Consultas",
              dashboardData.rankings.conversionConsultas,
              <Percent className="h-5 w-5 text-blue-500" />
            )}
            
            {dashboardData.rankings?.conversionMuestras && dashboardData.rankings.conversionMuestras.length > 0 && renderRankingCard(
              "Mejor Conversión Muestras",
              dashboardData.rankings.conversionMuestras,
              <TrendingUp className="h-5 w-5 text-indigo-500" />
            )}
            
            {dashboardData.rankings?.scoreGeneral && dashboardData.rankings.scoreGeneral.length > 0 && renderRankingCard(
              "Ranking General",
              dashboardData.rankings.scoreGeneral,
              <Award className="h-5 w-5 text-amber-500" />
            )}
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default ReportsDashboard;

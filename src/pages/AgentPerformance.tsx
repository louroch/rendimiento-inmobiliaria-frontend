import React, { useState, useEffect, useCallback } from 'react';
import { 
  User, 
  TrendingUp, 
  TrendingDown,
  Target,
  Percent,
  Calendar,
  Filter,
  RefreshCw,
  BarChart3,
  Award,
  Users
} from 'lucide-react';
import { Card, Text, Flex, Button, Select, SelectItem } from '@tremor/react';
import AdminLayout from '../components/AdminLayout';
import ExportButton from '../components/ExportButton';
import { reportsService, AgentPerformanceData } from '../services/reportsService';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const AgentPerformance: React.FC = () => {
  const [agentData, setAgentData] = useState<AgentPerformanceData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    includeWeekly: false
  });

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users);
      if (response.data.users.length > 0 && !selectedAgent) {
        setSelectedAgent(response.data.users[0].id);
      }
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
    }
  }, [selectedAgent]);

  const fetchAgentData = useCallback(async () => {
    if (!selectedAgent) return;
    
    try {
      setLoading(true);
      const data = await reportsService.getAgentPerformance(selectedAgent, {
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        includeWeekly: filters.includeWeekly
      });
      setAgentData(data);
    } catch (error) {
      console.error('Error obteniendo datos del agente:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedAgent, filters.startDate, filters.endDate, filters.includeWeekly]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchAgentData();
  }, [fetchAgentData]);

  const clearFilters = () => {
    setFilters({ startDate: '', endDate: '', includeWeekly: false });
  };

  const getPositionColor = (position: number, total: number) => {
    const percentage = (position / total) * 100;
    if (percentage <= 20) return 'text-green-600 bg-green-100';
    if (percentage <= 40) return 'text-blue-600 bg-blue-100';
    if (percentage <= 60) return 'text-yellow-600 bg-yellow-100';
    if (percentage <= 80) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getPositionText = (position: number, total: number) => {
    const percentage = (position / total) * 100;
    if (percentage <= 20) return 'Excelente';
    if (percentage <= 40) return 'Muy Bueno';
    if (percentage <= 60) return 'Bueno';
    if (percentage <= 80) return 'Regular';
    return 'Necesita Mejora';
  };

  if (loading) {
    return (
      <AdminLayout title="Análisis de Agente" subtitle="Rendimiento individual y comparativo">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#240046' }}></div>
          <Text className="ml-2 text-gray-600">Cargando datos del agente...</Text>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Análisis de Agente" subtitle="Rendimiento individual y comparativo">
      <div className="space-y-6">
        {/* Filtros */}
        <Card className="p-4 bg-white">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <Text className="text-lg font-medium">Filtros</Text>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Text className="text-sm font-medium mb-2">Agente</Text>
              <Select
                value={selectedAgent}
                onValueChange={setSelectedAgent}
                placeholder="Seleccionar agente"
              >
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

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

            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.includeWeekly}
                  onChange={(e) => setFilters(prev => ({ ...prev, includeWeekly: e.target.checked }))}
                  className="rounded border-gray-300 text-[#240046] focus:ring-[#240046]"
                />
                <Text className="text-sm">Análisis Semanal</Text>
              </label>
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
                onClick={fetchAgentData}
                variant="secondary"
                size="sm"
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>

          {/* Botón de exportación */}
          {selectedAgent && (
            <div className="mt-4 flex justify-end">
              <ExportButton
                templateType="agent-performance"
                agentId={selectedAgent}
                startDate={filters.startDate}
                endDate={filters.endDate}
                variant="secondary"
                size="sm"
              />
            </div>
          )}
        </Card>

        {/* Información del agente */}
        {agentData && (
          <>
            <Card className="p-6 bg-white">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <User className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <Text className="text-2xl font-bold text-gray-900">{agentData.agent.name}</Text>
                  <Text className="text-gray-600">{agentData.agent.email}</Text>
                  <Text className="text-sm text-gray-500 capitalize">{agentData.agent.role}</Text>
                </div>
                <div className="ml-auto">
                  <div className={`px-4 py-2 rounded-full ${getPositionColor(agentData.ranking.position, agentData.ranking.totalAgents)}`}>
                    <Text className="font-semibold">
                      Posición #{agentData.ranking.position} de {agentData.ranking.totalAgents}
                    </Text>
                    <Text className="text-xs">
                      {getPositionText(agentData.ranking.position, agentData.ranking.totalAgents)}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>

            {/* Métricas principales */}
            <Card className="p-6 bg-white">
              <div className="flex items-center space-x-2 mb-6">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
                <Text className="text-xl font-bold">Métricas de Rendimiento</Text>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Text className="text-2xl font-bold text-blue-600">{agentData.metrics.totalConsultas}</Text>
                  <Text className="text-sm text-gray-600">Consultas</Text>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Text className="text-2xl font-bold text-green-600">{agentData.metrics.totalMuestras}</Text>
                  <Text className="text-sm text-gray-600">Muestras</Text>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Text className="text-2xl font-bold text-purple-600">{agentData.metrics.totalOperaciones}</Text>
                  <Text className="text-sm text-gray-600">Operaciones</Text>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Text className="text-2xl font-bold text-yellow-600">{agentData.metrics.totalCaptaciones}</Text>
                  <Text className="text-sm text-gray-600">Captaciones</Text>
                </div>
              </div>

              {/* Tasas de conversión */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <Text className="text-sm text-gray-600">Consultas → Muestras</Text>
                      <Text className="text-2xl font-bold text-green-600">
                        {agentData.metrics.conversionRates.consultasToMuestras}%
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
                        {agentData.metrics.conversionRates.muestrasToOperaciones}%
                      </Text>
                    </div>
                    <Target className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Análisis semanal */}
            {agentData.weeklyAnalysis && (
              <Card className="p-6 bg-white">
                <div className="flex items-center space-x-2 mb-6">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                  <Text className="text-xl font-bold">Análisis Semanal</Text>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <Text className="text-lg font-semibold text-gray-900 mb-3">Semana Actual</Text>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Text className="text-sm text-gray-600">Consultas:</Text>
                        <Text className="font-semibold">{agentData.weeklyAnalysis.currentWeek.consultas || 0}</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text className="text-sm text-gray-600">Muestras:</Text>
                        <Text className="font-semibold">{agentData.weeklyAnalysis.currentWeek.muestras || 0}</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text className="text-sm text-gray-600">Operaciones:</Text>
                        <Text className="font-semibold">{agentData.weeklyAnalysis.currentWeek.operaciones || 0}</Text>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <Text className="text-lg font-semibold text-gray-900 mb-3">Semana Anterior</Text>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Text className="text-sm text-gray-600">Consultas:</Text>
                        <Text className="font-semibold">{agentData.weeklyAnalysis.previousWeek.consultas || 0}</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text className="text-sm text-gray-600">Muestras:</Text>
                        <Text className="font-semibold">{agentData.weeklyAnalysis.previousWeek.muestras || 0}</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text className="text-sm text-gray-600">Operaciones:</Text>
                        <Text className="font-semibold">{agentData.weeklyAnalysis.previousWeek.operaciones || 0}</Text>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cambios */}
                {agentData.weeklyAnalysis.changes && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <Text className="text-lg font-semibold text-gray-900 mb-3">Cambios vs Semana Anterior</Text>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        {agentData.weeklyAnalysis.changes.consultas > 0 ? (
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-500" />
                        )}
                        <Text className="text-sm">
                          Consultas: {agentData.weeklyAnalysis.changes.consultas > 0 ? '+' : ''}{agentData.weeklyAnalysis.changes.consultas}
                        </Text>
                      </div>
                      <div className="flex items-center space-x-2">
                        {agentData.weeklyAnalysis.changes.muestras > 0 ? (
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-500" />
                        )}
                        <Text className="text-sm">
                          Muestras: {agentData.weeklyAnalysis.changes.muestras > 0 ? '+' : ''}{agentData.weeklyAnalysis.changes.muestras}
                        </Text>
                      </div>
                      <div className="flex items-center space-x-2">
                        {agentData.weeklyAnalysis.changes.operaciones > 0 ? (
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-500" />
                        )}
                        <Text className="text-sm">
                          Operaciones: {agentData.weeklyAnalysis.changes.operaciones > 0 ? '+' : ''}{agentData.weeklyAnalysis.changes.operaciones}
                        </Text>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AgentPerformance;

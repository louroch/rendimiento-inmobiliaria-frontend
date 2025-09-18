import React, { useState, useEffect } from 'react';
import { Card, Metric, Text, Flex, Badge, Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell, Button } from '@tremor/react';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  CheckCircle, 
  Building2,
  Download,
  RefreshCw,
  AlertTriangle,
  Target
} from 'lucide-react';
import { WeeklyService, WeeklyFilters } from '../services/weeklyService';
import { WeeklyStats, WeeklyAgentsStats, WeeklyTeamStats } from '../types/performance';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface WeeklyDashboardProps {
  filters?: WeeklyFilters;
  className?: string;
}

const WeeklyDashboard: React.FC<WeeklyDashboardProps> = ({ filters = {}, className = '' }) => {
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [agentsStats, setAgentsStats] = useState<WeeklyAgentsStats | null>(null);
  const [teamStats, setTeamStats] = useState<WeeklyTeamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeeklyData();
  }, [filters.date, filters.weekNumber, filters.year]);

  const fetchWeeklyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const { general, agents, team } = await WeeklyService.getAllWeeklyStats(filters);
      setWeeklyStats(general);
      setAgentsStats(agents);
      setTeamStats(team);
    } catch (err) {
      console.error('Error obteniendo métricas semanales:', err);
      setError('Error al cargar las métricas semanales');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#240046' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <Text className="text-red-600">{error}</Text>
      </div>
    );
  }

  if (!weeklyStats || !agentsStats || !teamStats) {
    return (
      <div className="text-center py-8">
        <Text className="text-gray-500">No hay datos semanales disponibles</Text>
      </div>
    );
  }

  // Datos para gráficos
  const agentesChartData = agentsStats.agentes.slice(0, 10).map(agente => ({
    name: agente.agente.name.split(' ')[0], // Solo primer nombre
    consultas: agente.semanaActual.consultasRecibidas,
    muestras: agente.semanaActual.muestrasRealizadas,
    operaciones: agente.semanaActual.operacionesCerradas,
    captaciones: agente.semanaActual.numeroCaptaciones || 0
  }));

  const conversionData = [
    { name: 'Consultas → Muestras', value: teamStats.tasasConversion.consultasToMuestras, color: '#3b82f6' },
    { name: 'Muestras → Operaciones', value: teamStats.tasasConversion.muestrasToOperaciones, color: '#10b981' },
    { name: 'Consultas → Operaciones', value: teamStats.tasasConversion.consultasToOperaciones, color: '#8b5cf6' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Información de la semana */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <Text className="text-lg font-semibold text-gray-900">
              Semana {weeklyStats.semana.numero} de 2024
            </Text>
            <Text className="text-sm text-gray-600">
              {weeklyStats.semana.inicioFormateado} - {weeklyStats.semana.finFormateado}
            </Text>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <Text className="text-sm text-gray-500">Desempeño Semanal</Text>
          </div>
        </div>
      </Card>

      {/* Métricas principales del equipo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <Flex alignItems="center" justifyContent="between">
            <div>
              <Text className="text-sm font-medium text-gray-600">Total Consultas</Text>
              <Metric className="text-2xl font-bold text-gray-900">
                {weeklyStats.resumen.consultasRecibidas.toLocaleString()}
              </Metric>
              <div className="flex items-center space-x-1 mt-1">
                {getTrendIcon(weeklyStats.cambios.consultas.trend)}
                <Text className={`text-xs ${getTrendColor(weeklyStats.cambios.consultas.trend)}`}>
                  {weeklyStats.cambios.consultas.percentage > 0 ? '+' : ''}{weeklyStats.cambios.consultas.percentage}%
                </Text>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </Flex>
        </Card>

        <Card className="p-4">
          <Flex alignItems="center" justifyContent="between">
            <div>
              <Text className="text-sm font-medium text-gray-600">Total Muestras</Text>
              <Metric className="text-2xl font-bold text-gray-900">
                {weeklyStats.resumen.muestrasRealizadas.toLocaleString()}
              </Metric>
              <div className="flex items-center space-x-1 mt-1">
                {getTrendIcon(weeklyStats.cambios.muestras.trend)}
                <Text className={`text-xs ${getTrendColor(weeklyStats.cambios.muestras.trend)}`}>
                  {weeklyStats.cambios.muestras.percentage > 0 ? '+' : ''}{weeklyStats.cambios.muestras.percentage}%
                </Text>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
          </Flex>
        </Card>

        <Card className="p-4">
          <Flex alignItems="center" justifyContent="between">
            <div>
              <Text className="text-sm font-medium text-gray-600">Total Operaciones</Text>
              <Metric className="text-2xl font-bold text-gray-900">
                {weeklyStats.resumen.operacionesCerradas.toLocaleString()}
              </Metric>
              <div className="flex items-center space-x-1 mt-1">
                {getTrendIcon(weeklyStats.cambios.operaciones.trend)}
                <Text className={`text-xs ${getTrendColor(weeklyStats.cambios.operaciones.trend)}`}>
                  {weeklyStats.cambios.operaciones.percentage > 0 ? '+' : ''}{weeklyStats.cambios.operaciones.percentage}%
                </Text>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
          </Flex>
        </Card>

        <Card className="p-4">
          <Flex alignItems="center" justifyContent="between">
            <div>
              <Text className="text-sm font-medium text-gray-600">Total Captaciones</Text>
              <Metric className="text-2xl font-bold text-gray-900">
                {weeklyStats.resumen.numeroCaptaciones.toLocaleString()}
              </Metric>
              <div className="flex items-center space-x-1 mt-1">
                {getTrendIcon(weeklyStats.cambios.captaciones.trend)}
                <Text className={`text-xs ${getTrendColor(weeklyStats.cambios.captaciones.trend)}`}>
                  {weeklyStats.cambios.captaciones.percentage > 0 ? '+' : ''}{weeklyStats.cambios.captaciones.percentage}%
                </Text>
              </div>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <Target className="h-6 w-6 text-amber-600" />
            </div>
          </Flex>
        </Card>

        <Card className="p-4">
          <Flex alignItems="center" justifyContent="between">
            <div>
              <Text className="text-sm font-medium text-gray-600">Propiedades Tokko</Text>
              <Metric className="text-2xl font-bold text-gray-900">
                {weeklyStats.resumen.propiedadesTokko.toLocaleString()}
              </Metric>
              <div className="flex items-center space-x-1 mt-1">
                {getTrendIcon(weeklyStats.cambios.propiedades.trend)}
                <Text className={`text-xs ${getTrendColor(weeklyStats.cambios.propiedades.trend)}`}>
                  {weeklyStats.cambios.propiedades.percentage > 0 ? '+' : ''}{weeklyStats.cambios.propiedades.percentage}%
                </Text>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Building2 className="h-6 w-6 text-orange-600" />
            </div>
          </Flex>
        </Card>
      </div>

      {/* Métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <Text className="text-sm font-medium text-gray-600 mb-2">Seguimiento</Text>
          <Metric className="text-xl font-bold text-gray-900">
            {weeklyStats.resumen.porcentajeSeguimiento}%
          </Metric>
          <Text className="text-xs text-gray-500">de registros con seguimiento</Text>
        </Card>

        <Card className="p-4">
          <Text className="text-sm font-medium text-gray-600 mb-2">Dificultades</Text>
          <Metric className="text-xl font-bold text-gray-900">
            {weeklyStats.resumen.porcentajeDificultad}%
          </Metric>
          <Text className="text-xs text-gray-500">reportaron dificultades</Text>
        </Card>

        <Card className="p-4">
          <Text className="text-sm font-medium text-gray-600 mb-2">Promedio Diario</Text>
          <Metric className="text-xl font-bold text-gray-900">
            {weeklyStats.promedios.consultasPorDia}
          </Metric>
          <Text className="text-xs text-gray-500">consultas por día</Text>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ranking de agentes */}
        <Card className="p-4">
          <Text className="text-lg font-semibold mb-4">Top 10 Agentes por Consultas</Text>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentesChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="consultas" fill="#3b82f6" />
                <Bar dataKey="captaciones" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Tasas de conversión */}
        <Card className="p-4">
          <Text className="text-lg font-semibold mb-4">Tasas de Conversión</Text>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conversionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {conversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Tabla de ranking de agentes */}
      <Card className="p-4">
        <Text className="text-lg font-semibold mb-4">Ranking de Agentes</Text>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Posición</TableHeaderCell>
              <TableHeaderCell>Agente</TableHeaderCell>
              <TableHeaderCell>Consultas</TableHeaderCell>
              <TableHeaderCell>Muestras</TableHeaderCell>
              <TableHeaderCell>Operaciones</TableHeaderCell>
              <TableHeaderCell>Captaciones</TableHeaderCell>
              <TableHeaderCell>Propiedades</TableHeaderCell>
              <TableHeaderCell>Tendencia</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agentsStats.agentes.map((agente, index) => (
              <TableRow key={agente.agente.id}>
                <TableCell>
                  <Badge color={index < 3 ? 'blue' : 'gray'} size="sm">
                    #{index + 1}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <Text className="font-medium">{agente.agente.name}</Text>
                    <Text className="text-sm text-gray-500">{agente.agente.email}</Text>
                  </div>
                </TableCell>
                <TableCell>
                  <Text className="font-semibold">{agente.semanaActual.consultasRecibidas}</Text>
                </TableCell>
                <TableCell>
                  <Text>{agente.semanaActual.muestrasRealizadas}</Text>
                </TableCell>
                <TableCell>
                  <Text>{agente.semanaActual.operacionesCerradas}</Text>
                </TableCell>
                <TableCell>
                  <Text className="font-semibold text-amber-600">{agente.semanaActual.numeroCaptaciones || 0}</Text>
                </TableCell>
                <TableCell>
                  <Text>{agente.semanaActual.propiedadesTokko}</Text>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(agente.cambios.consultas.trend)}
                    <Text className={`text-xs ${getTrendColor(agente.cambios.consultas.trend)}`}>
                      {agente.cambios.consultas.percentage > 0 ? '+' : ''}{agente.cambios.consultas.percentage}%
                    </Text>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default WeeklyDashboard;

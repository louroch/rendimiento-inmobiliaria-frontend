import React, { useState, useEffect } from 'react';
import { Card, Metric, Text, Flex, Badge, Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell } from '@tremor/react';
import { 
  Building2, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  TrendingUp,
  Calendar,
  FileText
} from 'lucide-react';
import { TokkoService, TokkoFilters } from '../services/tokkoService';
import { TokkoStats } from '../types/performance';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface TokkoDashboardProps {
  filters?: TokkoFilters;
  className?: string;
}

const TokkoDashboard: React.FC<TokkoDashboardProps> = ({ filters = {}, className = '' }) => {
  const [tokkoStats, setTokkoStats] = useState<TokkoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTokkoStats();
  }, [filters.startDate, filters.endDate, filters.userId]);

  const fetchTokkoStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await TokkoService.getTokkoStatsWithFallback(filters);
      setTokkoStats(stats);
    } catch (err) {
      console.error('Error obteniendo métricas de Tokko:', err);
      setError('Error al cargar las métricas de Tokko');
    } finally {
      setLoading(false);
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

  if (!tokkoStats) {
    return (
      <div className="text-center py-8">
        <Text className="text-gray-500">No hay datos de Tokko disponibles</Text>
      </div>
    );
  }

  // Datos para gráficos
  const dificultadData = [
    { name: 'Sin Dificultad', value: tokkoStats.dificultadUso.no, color: '#10b981' },
    { name: 'Con Dificultad', value: tokkoStats.dificultadUso.si, color: '#ef4444' }
  ];

  const usoData = tokkoStats.usoTokko.distribucion.map(item => ({
    name: item.tipo,
    value: item.cantidad
  }));

  const propiedadesPorAgente = tokkoStats.porAgente.map(agente => ({
    name: agente.agente.name,
    propiedades: agente.totalPropiedades
  }));

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Card className="p-4">
          <Flex alignItems="center" justifyContent="between">
            <div>
              <Text className="text-sm font-medium text-gray-600">Total Propiedades</Text>
              <Metric className="text-2xl font-bold text-gray-900">
                {tokkoStats.resumen.totalPropiedadesCargadas.toLocaleString()}
              </Metric>
              <Text className="text-xs text-gray-500">
                Promedio: {tokkoStats.resumen.promedioPropiedadesPorRegistro}
              </Text>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </Flex>
        </Card>

        <Card className="p-4">
          <Flex alignItems="center" justifyContent="between">
            <div>
              <Text className="text-sm font-medium text-gray-600">Registros con Tokko</Text>
              <Metric className="text-2xl font-bold text-gray-900">
                {tokkoStats.resumen.totalRegistrosConTokko}
              </Metric>
              <Text className="text-xs text-gray-500">
                {tokkoStats.resumen.totalRegistrosConPropiedades} con propiedades
              </Text>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </Flex>
        </Card>

        <Card className="p-4">
          <Flex alignItems="center" justifyContent="between">
            <div>
              <Text className="text-sm font-medium text-gray-600">Dificultad de Uso</Text>
              <Metric className="text-2xl font-bold text-gray-900">
                {tokkoStats.dificultadUso.porcentajes.si}%
              </Metric>
              <Text className="text-xs text-gray-500">
                {tokkoStats.dificultadUso.si} de {tokkoStats.dificultadUso.total} reportes
              </Text>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
          </Flex>
        </Card>

        <Card className="p-4">
          <Flex alignItems="center" justifyContent="between">
            <div>
              <Text className="text-sm font-medium text-gray-600">Uso de Tokko</Text>
              <Metric className="text-2xl font-bold text-gray-900">
                {tokkoStats.usoTokko.totalRegistros}
              </Metric>
              <Text className="text-xs text-gray-500">
                {tokkoStats.usoTokko.distribucion.length} tipos de uso
              </Text>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </Flex>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gráfico de Dificultad */}
        <Card className="p-4">
          <Text className="text-lg font-semibold mb-3">Dificultad de Uso de Tokko</Text>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dificultadData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dificultadData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Gráfico de Uso */}
        <Card className="p-4">
          <Text className="text-lg font-semibold mb-3">Distribución de Uso</Text>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#240046" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Propiedades por Agente */}
      <Card className="p-4">
        <Text className="text-lg font-semibold mb-3">Propiedades Cargadas por Agente</Text>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={propiedadesPorAgente} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="propiedades" fill="#5a189a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Dificultades Detalladas */}
      {tokkoStats.dificultadesDetalladas.length > 0 && (
        <Card className="p-4">
          <Text className="text-lg font-semibold mb-3">Dificultades Reportadas</Text>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Agente</TableHeaderCell>
                <TableHeaderCell>Fecha</TableHeaderCell>
                <TableHeaderCell>Detalle</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tokkoStats.dificultadesDetalladas.map((dificultad, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Text className="font-medium">{dificultad.agente}</Text>
                  </TableCell>
                  <TableCell>
                    <Text className="text-sm text-gray-500">
                      {new Date(dificultad.fecha).toLocaleDateString()}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text className="text-sm">{dificultad.detalle}</Text>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Tabla de Agentes */}
      <Card className="p-4">
        <Text className="text-lg font-semibold mb-3">Métricas por Agente</Text>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Agente</TableHeaderCell>
              <TableHeaderCell>Total Propiedades</TableHeaderCell>
              <TableHeaderCell>Total Registros</TableHeaderCell>
              <TableHeaderCell>Promedio por Registro</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tokkoStats.porAgente.map((agente, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div>
                    <Text className="font-medium">{agente.agente.name}</Text>
                    <Text className="text-sm text-gray-500">{agente.agente.email}</Text>
                  </div>
                </TableCell>
                <TableCell>
                  <Text className="font-semibold">{agente.totalPropiedades}</Text>
                </TableCell>
                <TableCell>
                  <Text>{agente.totalRegistros}</Text>
                </TableCell>
                <TableCell>
                  <Text>
                    {agente.totalRegistros > 0 
                      ? Math.round(agente.totalPropiedades / agente.totalRegistros)
                      : 0
                    }
                  </Text>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default TokkoDashboard;

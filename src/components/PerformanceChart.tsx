import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface PerformanceData {
  id: string;
  fecha: string;
  consultasRecibidas: number;
  muestrasRealizadas: number;
  operacionesCerradas: number;
  seguimiento: boolean;
  usoTokko: string | null;
  createdAt: string;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  // Preparar datos para el gráfico
  const chartData = data
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .map(item => ({
      fecha: new Date(item.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
      consultas: item.consultasRecibidas,
      muestras: item.muestrasRealizadas,
      operaciones: item.operacionesCerradas,
      conversionRate: item.consultasRecibidas > 0 
        ? (item.operacionesCerradas / item.consultasRecibidas * 100).toFixed(1)
        : 0
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Gráfico de líneas */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Tendencias Diarias</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="fecha" 
              stroke="#666"
              fontSize={10}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="#666"
              fontSize={10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="consultas" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Consultas"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="muestras" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Muestras"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="operaciones" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              name="Operaciones"
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de barras para comparación */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Comparación de Actividades</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="fecha" 
              stroke="#666"
              fontSize={10}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="#666"
              fontSize={10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="consultas" fill="#3b82f6" name="Consultas" />
            <Bar dataKey="muestras" fill="#10b981" name="Muestras" />
            <Bar dataKey="operaciones" fill="#8b5cf6" name="Operaciones" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Resumen de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">
            {data.reduce((sum, item) => sum + item.consultasRecibidas, 0)}
          </div>
          <div className="text-xs sm:text-sm text-gray-500">Total Consultas</div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            {data.reduce((sum, item) => sum + item.muestrasRealizadas, 0)}
          </div>
          <div className="text-xs sm:text-sm text-gray-500">Total Muestras</div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-purple-600">
            {data.reduce((sum, item) => sum + item.operacionesCerradas, 0)}
          </div>
          <div className="text-xs sm:text-sm text-gray-500">Total Operaciones</div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;

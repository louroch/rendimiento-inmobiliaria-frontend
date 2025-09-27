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
import { Text } from '@tremor/react';
import { TrendsData, WeeklyData } from '../services/reportsService';

interface TrendsChartProps {
  data: TrendsData;
}

const TrendsChart: React.FC<TrendsChartProps> = ({ data }) => {
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

  const getTrendIcon = (direction: string) => {
    return direction === 'up' ? '📈' : direction === 'down' ? '📉' : '➡️';
  };

  const getTrendColor = (direction: string) => {
    return direction === 'up' ? 'text-green-600' : direction === 'down' ? 'text-red-600' : 'text-gray-600';
  };

  if (!data.weeklyData || data.weeklyData.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-sm">
          No hay datos suficientes para mostrar tendencias
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen de tendencias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm text-gray-600">Consultas</Text>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getTrendIcon(data.trends.consultas.direction)}</span>
                <Text className={`text-lg font-bold ${getTrendColor(data.trends.consultas.direction)}`}>
                  {data.trends.consultas.percentage}%
                </Text>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm text-gray-600">Muestras</Text>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getTrendIcon(data.trends.muestras.direction)}</span>
                <Text className={`text-lg font-bold ${getTrendColor(data.trends.muestras.direction)}`}>
                  {data.trends.muestras.percentage}%
                </Text>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm text-gray-600">Operaciones</Text>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getTrendIcon(data.trends.operaciones.direction)}</span>
                <Text className={`text-lg font-bold ${getTrendColor(data.trends.operaciones.direction)}`}>
                  {data.trends.operaciones.percentage}%
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de líneas - Tendencias */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Tendencias Semanales</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="startFormatted" 
              stroke="#666"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="metrics.consultasRecibidas" 
              stroke="#240046" 
              strokeWidth={2}
              name="Consultas"
              dot={{ fill: '#240046', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="metrics.muestrasRealizadas" 
              stroke="#5a189a" 
              strokeWidth={2}
              name="Muestras"
              dot={{ fill: '#5a189a', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="metrics.operacionesCerradas" 
              stroke="#9d4edd" 
              strokeWidth={2}
              name="Operaciones"
              dot={{ fill: '#9d4edd', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="metrics.numeroCaptaciones" 
              stroke="#f59e0b" 
              strokeWidth={2}
              name="Captaciones"
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de barras - Comparación semanal */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Comparación Semanal</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="startFormatted" 
              stroke="#666"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="metrics.consultasRecibidas" fill="#240046" name="Consultas" />
            <Bar dataKey="metrics.muestrasRealizadas" fill="#5a189a" name="Muestras" />
            <Bar dataKey="metrics.operacionesCerradas" fill="#9d4edd" name="Operaciones" />
            <Bar dataKey="metrics.numeroCaptaciones" fill="#f59e0b" name="Captaciones" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top performers de la semana actual */}
      {data.topPerformersCurrentWeek && data.topPerformersCurrentWeek.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Top Performers - Semana Actual</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.topPerformersCurrentWeek.slice(0, 6).map((performer: any, index: number) => (
              <div key={performer.agentId || index} className="p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Text className="font-semibold text-gray-900">{performer.name}</Text>
                  <span className="text-sm font-bold text-indigo-600">#{index + 1}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Consultas:</span>
                    <span className="font-medium">{performer.consultas || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Muestras:</span>
                    <span className="font-medium">{performer.muestras || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Operaciones:</span>
                    <span className="font-medium">{performer.operaciones || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendsChart;

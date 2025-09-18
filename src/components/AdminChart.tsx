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
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { formatDateForChart } from '../utils/dateUtils';

interface PerformanceData {
  id: string;
  fecha: string;
  consultasRecibidas: number;
  muestrasRealizadas: number;
  operacionesCerradas: number;
  seguimiento: boolean;
  usoTokko: string | null;
  numeroCaptaciones?: number | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface AdminChartProps {
  data: PerformanceData[];
}

const AdminChart: React.FC<AdminChartProps> = ({ data }) => {
  // Preparar datos para gráficos
  const chartData = data
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .map(item => ({
      fecha: formatDateForChart(item.fecha),
      consultas: item.consultasRecibidas,
      muestras: item.muestrasRealizadas,
      operaciones: item.operacionesCerradas,
      captaciones: item.numeroCaptaciones || 0,
      asesor: item.user.name
    }));

  // Agrupar por asesor
  const asesorData = data.reduce((acc, item) => {
    const asesor = item.user.name;
    if (!acc[asesor]) {
      acc[asesor] = {
        asesor,
        consultas: 0,
        muestras: 0,
        operaciones: 0,
        captaciones: 0
      };
    }
    acc[asesor].consultas += item.consultasRecibidas;
    acc[asesor].muestras += item.muestrasRealizadas;
    acc[asesor].operaciones += item.operacionesCerradas;
    acc[asesor].captaciones += item.numeroCaptaciones || 0;
    return acc;
  }, {} as Record<string, any>);

  const asesorChartData = Object.values(asesorData);

  // Colores para el gráfico de pie - usando la paleta personalizada
  const COLORS = ['#240046', '#5a189a', '#9d4edd', '#c77dff', '#e0aaff'];

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

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-sm">
          No hay datos suficientes para mostrar gráficos
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gráfico de líneas - Tendencias generales */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Tendencias Generales</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="fecha" 
              stroke="#666"
              fontSize={12}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="consultas" 
              stroke="#240046" 
              strokeWidth={2}
              name="Consultas"
              dot={{ fill: '#240046', strokeWidth: 2, r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="muestras" 
              stroke="#5a189a" 
              strokeWidth={2}
              name="Muestras"
              dot={{ fill: '#5a189a', strokeWidth: 2, r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="operaciones" 
              stroke="#9d4edd" 
              strokeWidth={2}
              name="Operaciones"
              dot={{ fill: '#9d4edd', strokeWidth: 2, r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="captaciones" 
              stroke="#f59e0b" 
              strokeWidth={2}
              name="Captaciones"
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de barras - Comparación por asesor */}
      {asesorChartData.length > 1 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Desempeño por Asesor</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={asesorChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="asesor" 
                stroke="#666"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="consultas" fill="#240046" name="Consultas" />
              <Bar dataKey="muestras" fill="#5a189a" name="Muestras" />
              <Bar dataKey="operaciones" fill="#9d4edd" name="Operaciones" />
              <Bar dataKey="captaciones" fill="#f59e0b" name="Captaciones" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Gráfico de pie - Distribución de operaciones */}
      {asesorChartData.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Distribución de Operaciones por Asesor</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={asesorChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ asesor, operaciones }) => `${asesor}: ${operaciones}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="operaciones"
              >
                {asesorChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Métricas de resumen */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-lg font-bold" style={{ color: '#240046' }}>
            {data.reduce((sum, item) => sum + item.consultasRecibidas, 0)}
          </div>
          <div className="text-xs text-gray-500">Total Consultas</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold" style={{ color: '#5a189a' }}>
            {data.reduce((sum, item) => sum + item.muestrasRealizadas, 0)}
          </div>
          <div className="text-xs text-gray-500">Total Muestras</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold" style={{ color: '#9d4edd' }}>
            {data.reduce((sum, item) => sum + item.operacionesCerradas, 0)}
          </div>
          <div className="text-xs text-gray-500">Total Operaciones</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold" style={{ color: '#f59e0b' }}>
            {data.reduce((sum, item) => sum + (item.numeroCaptaciones || 0), 0)}
          </div>
          <div className="text-xs text-gray-500">Total Captaciones</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold" style={{ color: '#c77dff' }}>
            {data.length}
          </div>
          <div className="text-xs text-gray-500">Registros</div>
        </div>
      </div>
    </div>
  );
};

export default AdminChart;

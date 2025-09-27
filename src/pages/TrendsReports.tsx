import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Filter,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { Card, Text, Flex, Button } from '@tremor/react';
import AdminLayout from '../components/AdminLayout';
import ExportButton from '../components/ExportButton';
import TrendsChart from '../components/TrendsChart';
import { reportsService, TrendsData } from '../services/reportsService';

const TrendsReports: React.FC = () => {
  const [trendsData, setTrendsData] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    weeks: 4
  });

  const fetchTrendsData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await reportsService.getTrends({
        weeks: filters.weeks,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      });
      setTrendsData(data);
    } catch (error) {
      console.error('Error obteniendo datos de tendencias:', error);
    } finally {
      setLoading(false);
    }
  }, [filters.weeks, filters.startDate, filters.endDate]);

  useEffect(() => {
    fetchTrendsData();
  }, [fetchTrendsData]);

  const clearFilters = () => {
    setFilters({ startDate: '', endDate: '', weeks: 4 });
  };

  if (loading) {
    return (
      <AdminLayout title="Tendencias" subtitle="Análisis de tendencias temporales y comparativas">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#240046' }}></div>
          <Text className="ml-2 text-gray-600">Cargando tendencias...</Text>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Tendencias" subtitle="Análisis de tendencias temporales y comparativas">
      <div className="space-y-6">
        {/* Filtros */}
        <Card className="p-4 bg-white">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <Text className="text-lg font-medium">Filtros de Tendencias</Text>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

            <div>
              <Text className="text-sm font-medium mb-2">Semanas</Text>
              <select
                value={filters.weeks}
                onChange={(e) => setFilters(prev => ({ ...prev, weeks: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-transparent"
              >
                <option value={2}>2 semanas</option>
                <option value={4}>4 semanas</option>
                <option value={8}>8 semanas</option>
                <option value={12}>12 semanas</option>
              </select>
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
                onClick={fetchTrendsData}
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
          <div className="mt-4 flex justify-end">
            <ExportButton
              templateType="trends"
              startDate={filters.startDate}
              endDate={filters.endDate}
              variant="secondary"
              size="sm"
            />
          </div>
        </Card>

        {/* Gráficos de tendencias */}
        {trendsData && (
          <Card className="p-6 bg-white">
            <div className="flex items-center space-x-2 mb-6">
              <BarChart3 className="h-6 w-6 text-indigo-600" />
              <Text className="text-xl font-bold">Análisis de Tendencias</Text>
            </div>
            
            <TrendsChart data={trendsData} />
          </Card>
        )}

        {/* Información adicional */}
        <Card className="p-4 bg-gray-50">
          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <Text className="text-sm font-medium text-gray-900 mb-1">Sobre el análisis de tendencias</Text>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Las tendencias muestran la dirección del cambio (📈 subida, 📉 bajada, ➡️ estable)</li>
                <li>• Los porcentajes indican el cambio relativo respecto al período anterior</li>
                <li>• Los gráficos de líneas muestran la evolución temporal</li>
                <li>• Los gráficos de barras permiten comparar semanas específicas</li>
                <li>• Los top performers se basan en el rendimiento de la semana actual</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default TrendsReports;

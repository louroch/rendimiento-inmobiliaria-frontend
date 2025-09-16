import React, { useState, useEffect } from 'react';
import { Button, Select, SelectItem, Card } from '@tremor/react';
import { Calendar, Download, RefreshCw, Filter } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import WeeklyDashboard from '../components/WeeklyDashboard';
import { WeeklyFilters } from '../services/weeklyService';
import { WeeklyService } from '../services/weeklyService';

const WeeklyDashboardPage: React.FC = () => {
  const [filters, setFilters] = useState<WeeklyFilters>({
    date: '',
    weekNumber: undefined,
    year: new Date().getFullYear()
  });
  const [loading, setLoading] = useState(false);

  // Generar opciones de semanas del año actual
  const generateWeekOptions = () => {
    const currentYear = new Date().getFullYear();
    const weeks = [];
    for (let i = 1; i <= 52; i++) {
      weeks.push({ value: i, label: `Semana ${i}` });
    }
    return weeks;
  };

  const weekOptions = generateWeekOptions();

  const handleFilterChange = (key: keyof WeeklyFilters, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      date: '',
      weekNumber: undefined,
      year: new Date().getFullYear()
    });
  };

  const exportToPDF = async () => {
    try {
      setLoading(true);
      const exportData = await WeeklyService.getWeeklyExportData(filters);
      
      // Aquí implementarías la generación del PDF
      // Por ahora solo mostramos los datos en consola
      console.log('Datos para PDF:', exportData);
      
      // TODO: Implementar generación de PDF con jsPDF o react-pdf
      alert('Funcionalidad de exportación PDF en desarrollo. Los datos están disponibles en la consola.');
    } catch (error) {
      console.error('Error exportando PDF:', error);
      alert('Error al exportar el PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout 
      title="Desempeño Semanal" 
      subtitle="Análisis semanal del rendimiento del equipo inmobiliario"
      showBackButton={true}
      backPath="/admin"
    >
      <div className="space-y-6">
        {/* Filtros */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Fecha de Referencia
              </label>
              <input
                type="date"
                value={filters.date || ''}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-[#240046] transition-colors"
              />
            </div>

            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Semana
              </label>
              <Select
                value={filters.weekNumber?.toString() || ''}
                onValueChange={(value) => handleFilterChange('weekNumber', value ? parseInt(value) : undefined)}
                placeholder="Seleccionar semana"
                className="w-full"
              >
                <SelectItem value="">Todas las semanas</SelectItem>
                {weekOptions.map((week) => (
                  <SelectItem key={week.value} value={week.value.toString()}>
                    {week.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año
              </label>
              <input
                type="number"
                value={filters.year || ''}
                onChange={(e) => handleFilterChange('year', parseInt(e.target.value) || new Date().getFullYear())}
                min="2020"
                max="2030"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-[#240046] transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={clearFilters}
                variant="secondary"
                icon={Filter}
                size="sm"
              >
                Limpiar
              </Button>
              <Button
                onClick={exportToPDF}
                variant="secondary"
                icon={Download}
                size="sm"
                disabled={loading}
              >
                {loading ? 'Exportando...' : 'Exportar PDF'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Dashboard Semanal */}
        <WeeklyDashboard filters={filters} />
      </div>
    </AdminLayout>
  );
};

export default WeeklyDashboardPage;

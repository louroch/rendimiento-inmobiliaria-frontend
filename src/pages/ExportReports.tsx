import React, { useState, useEffect, useCallback } from 'react';
import { 
  Download, 
  FileText, 
  FileSpreadsheet,
  Calendar,
  Filter,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, Text, Flex, Button } from '@tremor/react';
import AdminLayout from '../components/AdminLayout';
import { reportsService, ExportData } from '../services/reportsService';

const ExportReports: React.FC = () => {
  const [exportData, setExportData] = useState<ExportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  });

  const fetchExportData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await reportsService.getExportData({
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        format: 'json'
      });
      setExportData(data);
    } catch (error) {
      console.error('Error obteniendo datos de exportación:', error);
    } finally {
      setLoading(false);
    }
  }, [filters.startDate, filters.endDate]);

  useEffect(() => {
    fetchExportData();
  }, [fetchExportData]);

  const clearFilters = () => {
    setFilters({ startDate: '', endDate: '' });
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      setExporting(format);
      
      let blob: Blob;
      let filename: string;
      
      if (format === 'pdf') {
        blob = await reportsService.exportToPDF({
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          templateType: 'dashboard'
        });
        filename = `reporte_completo_${new Date().toISOString().split('T')[0]}.pdf`;
      } else {
        blob = await reportsService.exportToExcel({
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined
        });
        filename = `reporte_completo_${new Date().toISOString().split('T')[0]}.xlsx`;
      }
      
      // Verificar que el blob sea válido
      if (!blob || blob.size === 0) {
        throw new Error(`El archivo ${format.toUpperCase()} está vacío o es inválido`);
      }
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar URL después de un breve delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
      
    } catch (error) {
      console.error(`Error exportando ${format}:`, error);
      
      let errorMessage = `Error al exportar el archivo ${format.toUpperCase()}`;
      
      if (error instanceof Error) {
        if (error.message.includes('timeout') || error.message.includes('Timeout')) {
          errorMessage = `El servidor tardó demasiado en generar el ${format.toUpperCase()}. Intenta con un rango de fechas más pequeño.`;
        } else if (error.message.includes('vacío') || error.message.includes('empty')) {
          errorMessage = `El ${format.toUpperCase()} generado está vacío. Verifica que haya datos para exportar.`;
        } else if (error.message.includes('network') || error.message.includes('conect')) {
          errorMessage = 'Error de conexión. Verifica que el servidor esté funcionando.';
        } else if (error.message.includes('401') || error.message.includes('unauthorized')) {
          errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
        }
      }
      
      alert(errorMessage);
    } finally {
      setExporting(null);
    }
  };

  const exportToCSV = () => {
    if (!exportData || !exportData.data || !exportData.data.agents) return;
    
    try {
      const csvContent = [
        ['Tipo', 'Nombre', 'Email', 'Consultas', 'Muestras', 'Operaciones', 'Captaciones', 'Seguimiento %'],
        ...exportData.data.agents.map(agent => [
          'Agente',
          agent.name || '',
          agent.email || '',
          agent.metrics?.totalConsultas || 0,
          agent.metrics?.totalMuestras || 0,
          agent.metrics?.totalOperaciones || 0,
          agent.metrics?.totalCaptaciones || 0,
          agent.metrics?.percentages?.seguimiento || '0'
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `reporte_agentes_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exportando CSV:', error);
      alert('Error al exportar el archivo CSV');
    }
  };

  return (
    <AdminLayout title="Exportar Reportes" subtitle="Generar y descargar reportes en diferentes formatos">
      <div className="space-y-6">
        {/* Filtros */}
        <Card className="p-4 bg-white">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <Text className="text-lg font-medium">Filtros de Exportación</Text>
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
                onClick={fetchExportData}
                variant="secondary"
                size="sm"
                className="flex-1"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </div>
        </Card>

        {/* Resumen de datos */}
        {exportData && exportData.data && exportData.data.metadata && (
          <Card className="p-6 bg-white">
            <div className="flex items-center space-x-2 mb-6">
              <FileText className="h-6 w-6 text-indigo-600" />
              <Text className="text-xl font-bold">Resumen de Datos</Text>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Text className="text-2xl font-bold text-blue-600">{exportData.data.metadata.totalAgents || 0}</Text>
                <Text className="text-sm text-gray-600">Agentes</Text>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Text className="text-2xl font-bold text-green-600">{exportData.data.metadata.totalRecords || 0}</Text>
                <Text className="text-sm text-gray-600">Registros</Text>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Text className="text-2xl font-bold text-yellow-600">{exportData.data.summary?.totalConsultas || 0}</Text>
                <Text className="text-sm text-gray-600">Consultas</Text>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Text className="text-2xl font-bold text-purple-600">{exportData.data.summary?.totalOperaciones || 0}</Text>
                <Text className="text-sm text-gray-600">Operaciones</Text>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <Text>Generado el: {exportData.data.metadata.generated ? new Date(exportData.data.metadata.generated).toLocaleString() : 'N/A'}</Text>
            </div>
          </Card>
        )}

        {/* Opciones de exportación */}
        <Card className="p-6 bg-white">
          <div className="flex items-center space-x-2 mb-6">
            <Download className="h-6 w-6 text-indigo-600" />
            <Text className="text-xl font-bold">Opciones de Exportación</Text>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* PDF */}
            <div className="p-6 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <Text className="text-lg font-semibold">Reporte PDF</Text>
                  <Text className="text-sm text-gray-600">Documento completo con gráficos</Text>
                </div>
              </div>
              <Button
                onClick={() => handleExport('pdf')}
                disabled={exporting === 'pdf' || !exportData}
                className="w-full"
                style={{ backgroundColor: '#dc2626', color: 'white' }}
              >
                {exporting === 'pdf' ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {exporting === 'pdf' ? 'Generando...' : 'Descargar PDF'}
              </Button>
            </div>

            {/* Excel */}
            <div className="p-6 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileSpreadsheet className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <Text className="text-lg font-semibold">Reporte Excel</Text>
                  <Text className="text-sm text-gray-600">Hoja de cálculo con datos</Text>
                </div>
              </div>
              <Button
                onClick={() => handleExport('excel')}
                disabled={exporting === 'excel' || !exportData}
                className="w-full"
                style={{ backgroundColor: '#059669', color: 'white' }}
              >
                {exporting === 'excel' ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {exporting === 'excel' ? 'Generando...' : 'Descargar Excel'}
              </Button>
            </div>

            {/* CSV */}
            <div className="p-6 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <Text className="text-lg font-semibold">Reporte CSV</Text>
                  <Text className="text-sm text-gray-600">Datos de agentes en CSV</Text>
                </div>
              </div>
              <Button
                onClick={exportToCSV}
                disabled={!exportData}
                className="w-full"
                style={{ backgroundColor: '#2563eb', color: 'white' }}
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar CSV
              </Button>
            </div>
          </div>
        </Card>

        {/* Estado de exportación */}
        {exporting && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
              <Text className="text-blue-800">
                Generando archivo {exporting.toUpperCase()}... Por favor espere.
              </Text>
            </div>
          </Card>
        )}

        {/* Información adicional */}
        <Card className="p-4 bg-gray-50">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <Text className="text-sm font-medium text-gray-900 mb-1">Información sobre las exportaciones</Text>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>PDF:</strong> Incluye gráficos, rankings y métricas completas</li>
                <li>• <strong>Excel:</strong> Datos estructurados en hojas de cálculo</li>
                <li>• <strong>CSV:</strong> Datos de agentes en formato de texto plano</li>
                <li>• Los archivos se generan con los filtros de fecha aplicados</li>
                <li>• El nombre del archivo incluye la fecha de generación</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ExportReports;

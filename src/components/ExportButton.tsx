import React, { useState } from 'react';
import { Download, FileText, BarChart3, User, TrendingUp } from 'lucide-react';
import { Button } from '@tremor/react';
import { reportsService } from '../services/reportsService';

interface ExportButtonProps {
  templateType?: 'dashboard' | 'agent-performance' | 'trends' | 'summary';
  agentId?: string;
  startDate?: string;
  endDate?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  templateType = 'dashboard',
  agentId,
  startDate,
  endDate,
  variant = 'secondary',
  size = 'sm',
  className = ''
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const getTemplateIcon = () => {
    switch (templateType) {
      case 'dashboard':
        return <BarChart3 className="h-4 w-4" />;
      case 'agent-performance':
        return <User className="h-4 w-4" />;
      case 'trends':
        return <TrendingUp className="h-4 w-4" />;
      case 'summary':
        return <FileText className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  const getTemplateLabel = () => {
    switch (templateType) {
      case 'dashboard':
        return 'Dashboard';
      case 'agent-performance':
        return 'Análisis Individual';
      case 'trends':
        return 'Tendencias';
      case 'summary':
        return 'Resumen';
      default:
        return 'PDF';
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const blob = await reportsService.exportToPDF({
        templateType,
        agentId,
        startDate,
        endDate
      });

      // Verificar que el blob sea válido
      if (!blob || blob.size === 0) {
        throw new Error('El archivo PDF está vacío o es inválido');
      }

      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generar nombre de archivo único
      const timestamp = new Date().toISOString().split('T')[0];
      const templateName = templateType.replace('-', '_');
      const agentSuffix = agentId ? `_agente_${agentId.slice(-4)}` : '';
      link.download = `reporte_${templateName}${agentSuffix}_${timestamp}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar URL después de un breve delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
      
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      
      let errorMessage = 'Error al exportar el PDF. Por favor, inténtalo de nuevo.';
      
      if (error instanceof Error) {
        if (error.message.includes('timeout') || error.message.includes('Timeout')) {
          errorMessage = 'El servidor tardó demasiado en generar el PDF. Intenta con un rango de fechas más pequeño.';
        } else if (error.message.includes('vacío') || error.message.includes('empty')) {
          errorMessage = 'El PDF generado está vacío. Verifica que haya datos para exportar.';
        } else if (error.message.includes('network') || error.message.includes('conect')) {
          errorMessage = 'Error de conexión. Verifica que el servidor esté funcionando.';
        } else if (error.message.includes('401') || error.message.includes('unauthorized')) {
          errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      variant={variant}
      size={size}
      disabled={isExporting}
      className={`flex items-center space-x-2 ${className}`}
    >
      {isExporting ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          <span>Exportando...</span>
        </>
      ) : (
        <>
          {getTemplateIcon()}
          <span>Exportar {getTemplateLabel()}</span>
        </>
      )}
    </Button>
  );
};

export default ExportButton;

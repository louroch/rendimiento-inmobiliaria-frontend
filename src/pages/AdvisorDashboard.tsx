import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Plus, 
  TrendingUp, 
  Users, 
  Eye, 
  CheckCircle,
  Calendar,
  BarChart3
} from 'lucide-react';
import PerformanceForm from '../components/PerformanceForm';
import PerformanceTable from '../components/PerformanceTable';
import PerformanceChart from '../components/PerformanceChart';

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

const AdvisorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalConsultas: 0,
    totalMuestras: 0,
    totalOperaciones: 0,
    conversionRate: 0
  });

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/performance');
      setPerformanceData(response.data.performance);
      
      // Calcular estadísticas
      const data = response.data.performance;
      const totalConsultas = data.reduce((sum: number, p: PerformanceData) => sum + p.consultasRecibidas, 0);
      const totalMuestras = data.reduce((sum: number, p: PerformanceData) => sum + p.muestrasRealizadas, 0);
      const totalOperaciones = data.reduce((sum: number, p: PerformanceData) => sum + p.operacionesCerradas, 0);
      
      setStats({
        totalConsultas,
        totalMuestras,
        totalOperaciones,
        conversionRate: totalConsultas > 0 ? (totalOperaciones / totalConsultas * 100) : 0
      });
    } catch (error) {
      console.error('Error obteniendo datos de desempeño:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePerformanceAdded = () => {
    fetchPerformanceData();
    setShowForm(false);
  };

  const handlePerformanceUpdated = () => {
    fetchPerformanceData();
  };

  const handlePerformanceDeleted = () => {
    fetchPerformanceData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
            ¡Hola, {user?.name}! 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Registra tu desempeño diario y mantén el seguimiento de tus metas
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Nuevo Registro</span>
          <span className="sm:hidden">Nuevo</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Consultas Recibidas</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalConsultas}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Muestras Realizadas</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalMuestras}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Operaciones Cerradas</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalOperaciones}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Tasa de Conversión</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.conversionRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      {performanceData.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Tendencias de Desempeño
            </h3>
          </div>
          <PerformanceChart data={performanceData} />
        </div>
      )}

      {/* Performance Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Historial de Desempeño
          </h3>
        </div>
        <PerformanceTable 
          data={performanceData}
          onUpdate={handlePerformanceUpdated}
          onDelete={handlePerformanceDeleted}
        />
      </div>

      {/* Performance Form Modal */}
      {showForm && (
        <PerformanceForm
          onClose={() => setShowForm(false)}
          onSuccess={handlePerformanceAdded}
        />
      )}
    </div>
  );
};

export default AdvisorDashboard;

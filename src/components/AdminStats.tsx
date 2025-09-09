import React from 'react';
import { Users, Eye, CheckCircle, TrendingUp, Percent } from 'lucide-react';

interface AdminStatsProps {
  stats: {
    totalRecords: number;
    totals: {
      consultasRecibidas: number;
      muestrasRealizadas: number;
      operacionesCerradas: number;
    };
    averages: {
      consultasRecibidas: number;
      muestrasRealizadas: number;
      operacionesCerradas: number;
    };
    conversionRates: {
      consultasToMuestras: number;
      muestrasToOperaciones: number;
    };
  };
}

const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Consultas */}
      <div className="card">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Consultas</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totals.consultasRecibidas}</p>
            <p className="text-xs text-gray-500">
              Promedio: {stats.averages.consultasRecibidas}
            </p>
          </div>
        </div>
      </div>

      {/* Total Muestras */}
      <div className="card">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Eye className="h-8 w-8 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Muestras</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totals.muestrasRealizadas}</p>
            <p className="text-xs text-gray-500">
              Promedio: {stats.averages.muestrasRealizadas}
            </p>
          </div>
        </div>
      </div>

      {/* Total Operaciones */}
      <div className="card">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CheckCircle className="h-8 w-8 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Operaciones</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totals.operacionesCerradas}</p>
            <p className="text-xs text-gray-500">
              Promedio: {stats.averages.operacionesCerradas}
            </p>
          </div>
        </div>
      </div>

      {/* Tasa de Conversión */}
      <div className="card">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Percent className="h-8 w-8 text-orange-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Conversión General</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totals.consultasRecibidas > 0 
                ? (stats.totals.operacionesCerradas / stats.totals.consultasRecibidas * 100).toFixed(1)
                : 0}%
            </p>
            <p className="text-xs text-gray-500">
              {stats.totalRecords} registros
            </p>
          </div>
        </div>
      </div>

      {/* Tasas de Conversión Detalladas */}
      <div className="card md:col-span-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Tasas de Conversión
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Consultas → Muestras</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.conversionRates.consultasToMuestras}%
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900">Muestras → Operaciones</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.conversionRates.muestrasToOperaciones}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Resumen de Eficiencia */}
      <div className="card md:col-span-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Eficiencia</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Consultas por día promedio:</span>
            <span className="font-medium">
              {stats.averages.consultasRecibidas}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Muestras por día promedio:</span>
            <span className="font-medium">
              {stats.averages.muestrasRealizadas}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Operaciones por día promedio:</span>
            <span className="font-medium">
              {stats.averages.operacionesCerradas}
            </span>
          </div>
          <div className="flex justify-between items-center border-t pt-3">
            <span className="text-sm font-medium text-gray-900">Eficiencia general:</span>
            <span className="font-bold text-lg text-primary-600">
              {stats.totals.consultasRecibidas > 0 
                ? (stats.totals.operacionesCerradas / stats.totals.consultasRecibidas * 100).toFixed(1)
                : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;

import React, { useState } from 'react';
import { api } from '../services/api';
import { 
  Edit, 
  Trash2, 
  Calendar, 
  Users, 
  Eye, 
  CheckCircle,
  MessageSquare
} from 'lucide-react';
import PerformanceForm from './PerformanceForm';

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

interface PerformanceTableProps {
  data: PerformanceData[];
  onUpdate: () => void;
  onDelete: () => void;
}

const PerformanceTable: React.FC<PerformanceTableProps> = ({ data, onUpdate, onDelete }) => {
  const [editingItem, setEditingItem] = useState<PerformanceData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      return;
    }

    try {
      setDeletingId(id);
      await api.delete(`/performance/${id}`);
      onDelete();
    } catch (error) {
      console.error('Error eliminando registro:', error);
      alert('Error al eliminar el registro');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (item: PerformanceData) => {
    setEditingItem(item);
  };

  const handleEditSuccess = () => {
    setEditingItem(null);
    onUpdate();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay registros</h3>
        <p className="mt-1 text-sm text-gray-500">
          Comienza agregando tu primer registro de desempeño.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Users className="h-4 w-4 inline mr-1" />
                <span className="hidden sm:inline">Consultas</span>
                <span className="sm:hidden">C</span>
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Eye className="h-4 w-4 inline mr-1" />
                <span className="hidden sm:inline">Muestras</span>
                <span className="sm:hidden">M</span>
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <CheckCircle className="h-4 w-4 inline mr-1" />
                <span className="hidden sm:inline">Operaciones</span>
                <span className="sm:hidden">O</span>
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="hidden sm:inline">Seguimiento</span>
                <span className="sm:hidden">S</span>
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Tokko
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                  {formatDate(item.fecha)}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center">
                  {item.consultasRecibidas}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center">
                  {item.muestrasRealizadas}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center">
                  {item.operacionesCerradas}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    item.seguimiento 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.seguimiento ? 'Sí' : 'No'}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 max-w-xs hidden sm:table-cell">
                  {item.usoTokko ? (
                    <div className="flex items-center">
                      <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1 flex-shrink-0" />
                      <span className="truncate" title={item.usoTokko}>
                        {item.usoTokko}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                  <div className="flex space-x-1 sm:space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-primary-600 hover:text-primary-900 p-1"
                      title="Editar"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50 p-1"
                      title="Eliminar"
                    >
                      {deletingId === item.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <PerformanceForm
          editData={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
};

export default PerformanceTable;

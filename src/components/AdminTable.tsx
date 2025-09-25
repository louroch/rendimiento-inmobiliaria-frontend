import React, { useState } from 'react';
import { api } from '../services/api';
import { 
  Edit, 
  Trash2, 
  Calendar, 
  Users, 
  Eye, 
  CheckCircle,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';
import PerformanceForm from './PerformanceForm';
import { PerformanceData } from '../types/performance';
import { formatDateForTable } from '../utils/dateUtils';

interface AdminTableProps {
  data: PerformanceData[];
  onUpdate: () => void;
}

const AdminTable: React.FC<AdminTableProps> = ({ data, onUpdate }) => {
  const [editingItem, setEditingItem] = useState<PerformanceData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingItem, setViewingItem] = useState<PerformanceData | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      return;
    }

    try {
      setDeletingId(id);
      await api.delete(`/performance/${id}`);
      onUpdate();
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

  const handleViewDetail = async (id: string) => {
    try {
      setLoadingDetail(id);
      const response = await api.get(`/performance/${id}`);
      setViewingItem(response.data.performance);
    } catch (error) {
      console.error('Error obteniendo detalles del registro:', error);
      alert('Error al cargar los detalles del registro');
    } finally {
      setLoadingDetail(null);
    }
  };

  const formatDate = (dateString: string) => {
    return formatDateForTable(dateString);
  };

  // Paginación
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay registros</h3>
        <p className="mt-1 text-sm text-gray-500">
          No se encontraron registros con los filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
                Fecha
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
                Asesor
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-16">
                <Users className="h-3 w-3 inline mr-1" />
                Cons.
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-16">
                <Eye className="h-3 w-3 inline mr-1" />
                Muest.
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-16">
                <CheckCircle className="h-3 w-3 inline mr-1" />
                Oper.
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
                Seg.
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-16">
                Prop.
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
                Dif.
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((item, index) => (
              <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="text-xs font-medium text-gray-900">{formatDate(item.fecha)}</div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div>
                    <div className="text-xs font-semibold text-gray-900 truncate">{item.user?.name || 'N/A'}</div>
                    <div className="text-xs text-gray-500 truncate">{item.user?.email || 'N/A'}</div>
                  </div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-center">
                  <div className="text-sm font-semibold text-gray-900">{item.consultasRecibidas}</div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-center">
                  <div className="text-sm font-semibold text-gray-900">{item.muestrasRealizadas}</div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-center">
                  <div className="text-sm font-semibold text-gray-900">{item.operacionesCerradas}</div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                    item.seguimiento 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.seguimiento ? 'Sí' : 'No'}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-center">
                  <div className="text-sm font-semibold text-gray-900">{item.cantidadPropiedadesTokko || '-'}</div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-center">
                  {item.dificultadTokko !== null ? (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                      item.dificultadTokko 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.dificultadTokko ? 'Sí' : 'No'}
                    </span>
                  ) : (
                    <span className="text-gray-400 font-medium">-</span>
                  )}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetail(item.id)}
                      disabled={loadingDetail === item.id}
                      className="text-blue-600 hover:text-blue-900 disabled:opacity-50 transition-colors duration-150"
                      title="Ver detalles"
                    >
                      {loadingDetail === item.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                      ) : (
                        <FileText className="h-3 w-3" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-primary-600 hover:text-primary-900 transition-colors duration-150"
                      title="Editar"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50 transition-colors duration-150"
                      title="Eliminar"
                    >
                      {deletingId === item.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
                <span className="font-medium">{Math.min(endIndex, data.length)}</span> de{' '}
                <span className="font-medium">{data.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <PerformanceForm
          editData={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Detail Modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setViewingItem(null)}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Detalles del Registro
                  </h3>
                  <button
                    onClick={() => setViewingItem(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información del Usuario */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Información del Usuario</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Nombre:</span>
                        <p className="text-sm text-gray-900">{viewingItem.user?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Email:</span>
                        <p className="text-sm text-gray-900">{viewingItem.user?.email || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Fecha del Registro:</span>
                        <p className="text-sm text-gray-900">{formatDate(viewingItem.fecha)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Métricas Principales */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Métricas Principales</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{viewingItem.consultasRecibidas}</div>
                        <div className="text-xs text-gray-600">Consultas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{viewingItem.muestrasRealizadas}</div>
                        <div className="text-xs text-gray-600">Muestras</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{viewingItem.operacionesCerradas}</div>
                        <div className="text-xs text-gray-600">Operaciones</div>
                      </div>
                    </div>
                  </div>

                  {/* Seguimiento */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Seguimiento</h4>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        viewingItem.seguimiento 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {viewingItem.seguimiento ? 'Sí' : 'No'}
                      </span>
                    </div>
                  </div>

                  {/* Tokko */}
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Información de Tokko</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Propiedades:</span>
                        <p className="text-sm text-gray-900">{viewingItem.cantidadPropiedadesTokko || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Uso:</span>
                        <p className="text-sm text-gray-900">{viewingItem.usoTokko || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Dificultad:</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          viewingItem.dificultadTokko 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {viewingItem.dificultadTokko ? 'Sí' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Observaciones */}
                {viewingItem.observaciones && (
                  <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Observaciones</h4>
                    <p className="text-sm text-gray-900">{viewingItem.observaciones}</p>
                  </div>
                )}

                {/* Detalle de Dificultad */}
                {viewingItem.detalleDificultadTokko && (
                  <div className="mt-4 bg-red-50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Detalle de Dificultad</h4>
                    <p className="text-sm text-gray-900">{viewingItem.detalleDificultadTokko}</p>
                  </div>
                )}

                {/* Links de Tokko */}
                {viewingItem.linksTokko && (
                  <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Links de Tokko</h4>
                    <div className="text-sm text-gray-900 break-all">{viewingItem.linksTokko}</div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setViewingItem(null)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminTable;

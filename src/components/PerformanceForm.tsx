import React, { useState } from 'react';
import { api } from '../services/api';
import { X, Calendar, Users, Eye, CheckCircle, MessageSquare } from 'lucide-react';

interface PerformanceFormProps {
  onClose: () => void;
  onSuccess: () => void;
  editData?: any;
}

const PerformanceForm: React.FC<PerformanceFormProps> = ({ onClose, onSuccess, editData }) => {
  const [formData, setFormData] = useState({
    fecha: editData?.fecha ? new Date(editData.fecha).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    consultasRecibidas: editData?.consultasRecibidas || 0,
    muestrasRealizadas: editData?.muestrasRealizadas || 0,
    operacionesCerradas: editData?.operacionesCerradas || 0,
    seguimiento: editData?.seguimiento || false,
    usoTokko: editData?.usoTokko || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editData) {
        await api.put(`/performance/${editData.id}`, formData);
      } else {
        await api.post('/performance', formData);
      }
      onSuccess();
    } catch (err: any) {
      console.error('Error en PerformanceForm:', err);
      console.error('Response data:', err.response?.data);
      console.error('Request data:', formData);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.errors?.map((e: any) => e.msg).join(', ') ||
                          'Error al guardar el registro';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: any = value;
    
    // Convertir valores numéricos
    if (type === 'number') {
      processedValue = value === '' ? 0 : parseInt(value, 10);
    } else if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {editData ? 'Editar Registro' : 'Nuevo Registro de Desempeño'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="h-4 w-4 inline mr-1" />
                Fecha
              </label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Users className="h-4 w-4 inline mr-1" />
                Consultas Recibidas
              </label>
              <input
                type="number"
                name="consultasRecibidas"
                value={formData.consultasRecibidas}
                onChange={handleChange}
                min="0"
                required
                className="input-field"
                placeholder="Número de nuevos leads"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Eye className="h-4 w-4 inline mr-1" />
                Muestras Realizadas
              </label>
              <input
                type="number"
                name="muestrasRealizadas"
                value={formData.muestrasRealizadas}
                onChange={handleChange}
                min="0"
                required
                className="input-field"
                placeholder="Número de visitas/demostraciones"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <CheckCircle className="h-4 w-4 inline mr-1" />
                Operaciones Cerradas
              </label>
              <input
                type="number"
                name="operacionesCerradas"
                value={formData.operacionesCerradas}
                onChange={handleChange}
                min="0"
                required
                className="input-field"
                placeholder="Número de ventas/acuerdos finalizados"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="seguimiento"
                checked={formData.seguimiento}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Realicé seguimiento a clientes
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MessageSquare className="h-4 w-4 inline mr-1" />
                Uso de Tokko CRM
              </label>
              <textarea
                name="usoTokko"
                value={formData.usoTokko}
                onChange={handleChange}
                rows={3}
                className="input-field"
                placeholder="Describe cómo usaste el CRM Tokko hoy..."
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {loading ? 'Guardando...' : editData ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PerformanceForm;

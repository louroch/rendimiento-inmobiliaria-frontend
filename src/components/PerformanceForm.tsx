import React, { useState } from 'react';
import { api } from '../services/api';
import { X, Calendar, Users, Eye, CheckCircle, MessageSquare, Link, AlertCircle, FileText } from 'lucide-react';
import { PerformanceData } from '../types/performance';

interface PerformanceFormProps {
  onClose: () => void;
  onSuccess: () => void;
  editData?: PerformanceData;
}

const PerformanceForm: React.FC<PerformanceFormProps> = ({ onClose, onSuccess, editData }) => {
  const [formData, setFormData] = useState({
    fecha: editData?.fecha ? new Date(editData.fecha).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    consultasRecibidas: editData?.consultasRecibidas || 0,
    muestrasRealizadas: editData?.muestrasRealizadas || 0,
    operacionesCerradas: editData?.operacionesCerradas || 0,
    seguimiento: editData?.seguimiento || false,
    usoTokko: editData?.usoTokko || '',
    // Nuevos campos
    cantidadPropiedadesTokko: editData?.cantidadPropiedadesTokko || '',
    linksTokko: editData?.linksTokko || '',
    dificultadTokko: editData?.dificultadTokko !== undefined ? editData.dificultadTokko : null,
    detalleDificultadTokko: editData?.detalleDificultadTokko || '',
    observaciones: editData?.observaciones || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDetalleDificultad, setShowDetalleDificultad] = useState(editData?.dificultadTokko === true);

  // Obtener la fecha de hoy para validación
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Preparar datos para envío, convirtiendo valores vacíos a null
      const dataToSend = {
        ...formData,
        cantidadPropiedadesTokko: formData.cantidadPropiedadesTokko || null,
        linksTokko: formData.linksTokko || null,
        detalleDificultadTokko: formData.detalleDificultadTokko || null,
        observaciones: formData.observaciones || null
      };

      if (editData) {
        await api.put(`/performance/${editData.id}`, dataToSend);
      } else {
        await api.post('/performance', dataToSend);
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

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === 'true';
    setFormData({
      ...formData,
      dificultadTokko: value
    });
    setShowDetalleDificultad(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate pr-2">
              {editData ? 'Editar Registro' : 'Nuevo Registro de Desempeño'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
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
                min={today}
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

            {/* Nuevos campos de Tokko */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Información adicional de Tokko</h3>
              
              {/* Cantidad de Propiedades */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FileText className="h-4 w-4 inline mr-1" />
                  Cantidad de propiedades cargadas en Tokko
                </label>
                <input
                  type="number"
                  name="cantidadPropiedadesTokko"
                  value={formData.cantidadPropiedadesTokko}
                  onChange={handleChange}
                  min="0"
                  className="input-field"
                  placeholder="Ej: 5"
                />
              </div>

              {/* Links de Propiedades */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Link className="h-4 w-4 inline mr-1" />
                  Links de las propiedades
                </label>
                <textarea
                  name="linksTokko"
                  value={formData.linksTokko}
                  onChange={handleChange}
                  rows={3}
                  className="input-field"
                  placeholder="https://ejemplo1.com, https://ejemplo2.com"
                />
                <p className="text-xs text-gray-500 mt-1">Separa múltiples links con comas</p>
              </div>

              {/* Dificultad con Tokko */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  ¿Se te dificultó el uso de Tokko?
                </label>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="dificultadTokko"
                      value="true"
                      checked={formData.dificultadTokko === true}
                      onChange={handleRadioChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Sí</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="dificultadTokko"
                      value="false"
                      checked={formData.dificultadTokko === false}
                      onChange={handleRadioChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {/* Campo condicional para detalle de dificultad */}
              {showDetalleDificultad && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Detalla las dificultades encontradas
                  </label>
                  <textarea
                    name="detalleDificultadTokko"
                    value={formData.detalleDificultadTokko}
                    onChange={handleChange}
                    rows={3}
                    className="input-field"
                    placeholder="Describe las dificultades que tuviste..."
                  />
                </div>
              )}

              {/* Observaciones */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FileText className="h-4 w-4 inline mr-1" />
                  Observaciones
                </label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  rows={3}
                  className="input-field"
                  placeholder="Cualquier observación adicional..."
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary text-sm sm:text-base"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 text-sm sm:text-base"
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

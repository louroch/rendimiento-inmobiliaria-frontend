import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Save, Calendar, Users, Eye, CheckCircle, BarChart3, LogOut, Link, AlertCircle, FileText } from 'lucide-react';
import { api } from '../services/api';

interface FormData {
  fecha: string;
  consultasRecibidas: number;
  muestrasRealizadas: number;
  operacionesCerradas: number;
  seguimiento: boolean;
  usoTokko: string;
  // Nuevos campos
  cantidadPropiedadesTokko: string | number;
  linksTokko: string;
  dificultadTokko: boolean | null;
  detalleDificultadTokko: string;
  observaciones: string;
}

const NewRecord: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    fecha: new Date().toISOString().split('T')[0],
    consultasRecibidas: 0,
    muestrasRealizadas: 0,
    operacionesCerradas: 0,
    seguimiento: false,
    usoTokko: '',
    // Nuevos campos
    cantidadPropiedadesTokko: '',
    linksTokko: '',
    dificultadTokko: null,
    detalleDificultadTokko: '',
    observaciones: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showDetalleDificultad, setShowDetalleDificultad] = useState(false);

  // Obtener la fecha de hoy para validación
  const today = new Date().toISOString().split('T')[0];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Preparar datos para envío, convirtiendo valores vacíos a null
      const dataToSend = {
        ...formData,
        cantidadPropiedadesTokko: formData.cantidadPropiedadesTokko || null,
        linksTokko: formData.linksTokko || null,
        detalleDificultadTokko: formData.detalleDificultadTokko || null,
        observaciones: formData.observaciones || null
      };

      await api.post('/performance', dataToSend);
      setSuccess(true);
      
      // Resetear formulario después de 2 segundos
      setTimeout(() => {
        setFormData({
          fecha: new Date().toISOString().split('T')[0],
          consultasRecibidas: 0,
          muestrasRealizadas: 0,
          operacionesCerradas: 0,
          seguimiento: false,
          usoTokko: '',
          cantidadPropiedadesTokko: '',
          linksTokko: '',
          dificultadTokko: null,
          detalleDificultadTokko: '',
          observaciones: ''
        });
        setShowDetalleDificultad(false);
        setSuccess(false);
      }, 2000);

    } catch (err: any) {
      console.error('Error enviando registro:', err);
      setError(err.response?.data?.message || 'Error al enviar el registro');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header superior fijo para agentes */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#240046] rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">Sistema de Rendimiento</h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate">Bienvenido, {user?.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="py-4 sm:py-6 lg:py-8">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-6">
          {/* Card del formulario */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header del card */}
            <div className="bg-gradient-to-r from-[#240046] to-[#5a189a] p-4 sm:p-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg flex-shrink-0">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-white truncate">Registro de Desempeño Diario</h2>
                  <p className="text-xs sm:text-sm text-gray-200">Completa tus métricas del día</p>
                </div>
              </div>
            </div>

            {/* Contenido del formulario */}
            <div className="p-4 sm:p-6">
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">¡Registro enviado exitosamente!</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-red-800 font-medium">{error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Fecha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Fecha
                  </label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    min={today}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-[#240046] transition-colors"
                    required
                  />
                </div>

                {/* Métricas en tres columnas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="h-4 w-4 inline mr-2" />
                      Consultas Recibidas
                    </label>
                    <input
                      type="number"
                      name="consultasRecibidas"
                      value={formData.consultasRecibidas}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-[#240046] transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Eye className="h-4 w-4 inline mr-2" />
                      Muestras Realizadas
                    </label>
                    <input
                      type="number"
                      name="muestrasRealizadas"
                      value={formData.muestrasRealizadas}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-[#240046] transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CheckCircle className="h-4 w-4 inline mr-2" />
                      Operaciones Cerradas
                    </label>
                    <input
                      type="number"
                      name="operacionesCerradas"
                      value={formData.operacionesCerradas}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-[#240046] transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Seguimiento */}
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="seguimiento"
                      checked={formData.seguimiento}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#240046] focus:ring-[#240046] border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Realizó seguimiento</span>
                  </label>
                </div>

                {/* Uso de Tokko */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Uso de Tokko
                  </label>
                  <textarea
                    name="usoTokko"
                    value={formData.usoTokko}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe brevemente cómo usaste Tokko hoy..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-[#240046] transition-colors"
                  />
                </div>

                {/* Nuevos campos de Tokko */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Información adicional de Tokko</h3>
                  
                  {/* Cantidad de Propiedades */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="h-4 w-4 inline mr-2" />
                      Cantidad de propiedades cargadas en Tokko
                    </label>
                    <input
                      type="number"
                      name="cantidadPropiedadesTokko"
                      value={formData.cantidadPropiedadesTokko}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-[#240046] transition-colors"
                      placeholder="Ej: 5"
                    />
                  </div>

                  {/* Links de Propiedades */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Link className="h-4 w-4 inline mr-2" />
                      Links de las propiedades
                    </label>
                    <textarea
                      name="linksTokko"
                      value={formData.linksTokko}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-[#240046] transition-colors"
                      placeholder="https://ejemplo1.com, https://ejemplo2.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separa múltiples links con comas</p>
                  </div>

                  {/* Dificultad con Tokko */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <AlertCircle className="h-4 w-4 inline mr-2" />
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
                          className="h-4 w-4 text-[#240046] focus:ring-[#240046] border-gray-300"
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
                          className="h-4 w-4 text-[#240046] focus:ring-[#240046] border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">No</span>
                      </label>
                    </div>
                  </div>

                  {/* Campo condicional para detalle de dificultad */}
                  {showDetalleDificultad && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Detalla las dificultades encontradas
                      </label>
                      <textarea
                        name="detalleDificultadTokko"
                        value={formData.detalleDificultadTokko}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-[#240046] transition-colors"
                        placeholder="Describe las dificultades que tuviste..."
                      />
                    </div>
                  )}

                  {/* Observaciones */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="h-4 w-4 inline mr-2" />
                      Observaciones
                    </label>
                    <textarea
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-[#240046] transition-colors"
                      placeholder="Cualquier observación adicional..."
                    />
                  </div>
                </div>

                {/* Botones alineados a la derecha */}
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                    style={{ backgroundColor: '#5a189a' }}
                    onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#9d4edd'}
                    onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#5a189a'}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span className="hidden sm:inline">Enviar Registro</span>
                        <span className="sm:hidden">Enviar</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRecord;

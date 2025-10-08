import React from 'react';
import { AlertCircle, Lock } from 'lucide-react';

const MaintenanceMode: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icono */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500 opacity-20 rounded-full blur-xl"></div>
              <div className="relative bg-gradient-to-br from-amber-400 to-amber-600 p-6 rounded-full">
                <Lock className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Sistema Temporalmente Desactivado
          </h1>

          {/* Mensaje */}
          <div className="mb-6">
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-left text-sm text-amber-800">
                El sistema de registro de rendimiento se encuentra temporalmente fuera de servicio.
              </p>
            </div>
            
            <p className="text-gray-600 text-sm leading-relaxed">
              Si necesitas acceso urgente o tienes alguna consulta, por favor contacta con el administrador del sistema.
            </p>
          </div>

          {/* Información adicional */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-xs text-gray-500">
              Gracias por tu comprensión
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Sistema de Rendimiento Inmobiliaria
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode;


import React, { useState } from 'react';
import { api } from '../services/api';

const ConnectionTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult('Probando conexión...');

    try {
      // Probar endpoint de autenticación
      const authResponse = await api.get('/auth/me');
      setTestResult(`✅ Conexión exitosa. Usuario: ${authResponse.data.user?.name || 'No disponible'}`);
    } catch (error: any) {
      console.error('Error de conexión:', error);
      setTestResult(`❌ Error de conexión: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testPerformanceEndpoint = async () => {
    setLoading(true);
    setTestResult('Probando endpoint de performance...');

    try {
      // Datos de prueba
      const testData = {
        fecha: new Date().toISOString().split('T')[0],
        consultasRecibidas: 1,
        muestrasRealizadas: 1,
        operacionesCerradas: 1,
        seguimiento: false,
        usoTokko: 'Prueba de conexión',
        cantidadPropiedadesTokko: null,
        linksTokko: null,
        dificultadTokko: null,
        detalleDificultadTokko: null,
        observaciones: null
      };

      const response = await api.post('/performance', testData);
      setTestResult(`✅ Endpoint de performance funcionando. Status: ${response.status}`);
    } catch (error: any) {
      console.error('Error en endpoint de performance:', error);
      setTestResult(`❌ Error en endpoint de performance: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Prueba de Conexión</h3>
      <div className="space-y-2">
        <button
          onClick={testConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Probar Conexión General
        </button>
        <button
          onClick={testPerformanceEndpoint}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 ml-2"
        >
          Probar Endpoint Performance
        </button>
      </div>
      {testResult && (
        <div className="mt-4 p-3 bg-white rounded border">
          <pre className="text-sm">{testResult}</pre>
        </div>
      )}
    </div>
  );
};

export default ConnectionTest;

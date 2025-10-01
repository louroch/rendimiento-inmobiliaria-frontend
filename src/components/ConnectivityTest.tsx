import React, { useState } from 'react';
import { api } from '../services/api';
import { CheckCircle, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';

const ConnectivityTest: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    health: 'pending' | 'success' | 'error';
    gemini: 'pending' | 'success' | 'error';
    loading: boolean;
  }>({
    health: 'pending',
    gemini: 'pending',
    loading: false
  });

  const runTests = async () => {
    setTestResults({
      health: 'pending',
      gemini: 'pending',
      loading: true
    });

    // Test 1: Health endpoint
    try {
      const healthResponse = await api.get('/health');
      console.log('✅ Health check successful:', healthResponse.data);
      setTestResults(prev => ({ ...prev, health: 'success' }));
    } catch (error) {
      console.error('❌ Health check failed:', error);
      setTestResults(prev => ({ ...prev, health: 'error' }));
    }

    // Test 2: Gemini endpoint
    try {
      const geminiResponse = await api.post('/gemini/recommendations', {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString()
      });
      console.log('✅ Gemini test successful:', geminiResponse.data);
      setTestResults(prev => ({ ...prev, gemini: 'success' }));
    } catch (error: any) {
      console.error('❌ Gemini test failed:', error);
      
      // Si es error de autenticación, mostrar mensaje específico
      if (error.response?.status === 403 || error.message?.includes('Token inválido')) {
        console.log('🔐 Error de autenticación detectado en prueba de conectividad');
      }
      
      setTestResults(prev => ({ ...prev, gemini: 'error' }));
    }

    setTestResults(prev => ({ ...prev, loading: false }));
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />;
    }
  };

  const getStatusText = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return 'Conectado';
      case 'error':
        return 'Error';
      default:
        return 'Probando...';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900">Prueba de Conectividad</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {getStatusIcon(testResults.health)}
            <span className="font-medium">Health Check</span>
          </div>
          <span className={`text-sm ${
            testResults.health === 'success' ? 'text-green-600' : 
            testResults.health === 'error' ? 'text-red-600' : 'text-gray-500'
          }`}>
            {getStatusText(testResults.health)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {getStatusIcon(testResults.gemini)}
            <span className="font-medium">Gemini AI</span>
          </div>
          <span className={`text-sm ${
            testResults.gemini === 'success' ? 'text-green-600' : 
            testResults.gemini === 'error' ? 'text-red-600' : 'text-gray-500'
          }`}>
            {getStatusText(testResults.gemini)}
          </span>
        </div>
      </div>

      <button
        onClick={runTests}
        disabled={testResults.loading}
        className="w-full mt-4 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {testResults.loading ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Probando conectividad...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4 mr-2" />
            Ejecutar Pruebas
          </>
        )}
      </button>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Consejo:</strong> Si las pruebas fallan, verifica que el backend esté funcionando en <code>http://localhost:5000</code>
        </p>
      </div>
    </div>
  );
};

export default ConnectivityTest;

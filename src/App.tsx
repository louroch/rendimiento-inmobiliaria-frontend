import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Layout from './components/Layout';

// Función para manejar errores de carga de chunks
const handleChunkError = (error: Error): Promise<never> => {
  console.error('Chunk loading error:', error);
  
  // Si es un error de chunk, intentar recargar la página
  if (error.message.includes('Loading chunk') || error.message.includes('ChunkLoadError')) {
    console.log('Chunk loading failed, attempting page reload...');
    window.location.reload();
  }
  
  // Retornar una Promise que nunca se resuelve (ya que recargamos la página)
  return Promise.reject(error);
};

// Lazy loading de componentes pesados con manejo de errores
const AdvisorDashboard = lazy(() => 
  import('./pages/AdvisorDashboard').catch(handleChunkError)
);
const AdminDashboard = lazy(() => 
  import('./pages/AdminDashboard').catch(handleChunkError)
);
const NewRecord = lazy(() => 
  import('./pages/NewRecord').catch(handleChunkError)
);
const AdminRecords = lazy(() => 
  import('./pages/AdminRecords').catch(handleChunkError)
);
const NewAgent = lazy(() => 
  import('./pages/NewAgent').catch(handleChunkError)
);
const AdminUsers = lazy(() => 
  import('./pages/AdminUsers').catch(handleChunkError)
);
const TokkoDashboard = lazy(() => 
  import('./pages/TokkoDashboard').catch(handleChunkError)
);
const WeeklyDashboard = lazy(() => 
  import('./pages/WeeklyDashboard').catch(handleChunkError)
);
const AIRecommendations = lazy(() => 
  import('./pages/AIRecommendations').catch(handleChunkError)
);
const ReportsDashboard = lazy(() => 
  import('./pages/ReportsDashboard').catch(handleChunkError)
);
const AgentPerformance = lazy(() => 
  import('./pages/AgentPerformance').catch(handleChunkError)
);
const TrendsReports = lazy(() => 
  import('./pages/TrendsReports').catch(handleChunkError)
);
const ExportReports = lazy(() => 
  import('./pages/ExportReports').catch(handleChunkError)
);

// Componente de Loading optimizado con mejor manejo de errores
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-sm">Cargando módulo...</p>
      <p className="text-gray-400 text-xs mt-2">Si tarda mucho, verifica tu conexión</p>
    </div>
  </div>
);

// Componente de fallback para errores de chunk
const ChunkErrorFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center max-w-md mx-auto p-6">
      <div className="p-3 bg-yellow-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
        <RefreshCw className="h-8 w-8 text-yellow-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Problema de Carga
      </h2>
      <p className="text-gray-600 mb-4">
        Hubo un problema al cargar este módulo. Esto puede deberse a una actualización en curso o un problema de conectividad.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Recargar Página
      </button>
    </div>
  </div>
);

// Componente para redirección inteligente basada en el rol
const RoleBasedRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirigir según el rol del usuario
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else if (user.role === 'agent') {
    return <Navigate to="/nuevo-registro" replace />;
  }

  // Fallback (no debería llegar aquí)
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <ErrorBoundary fallback={<ChunkErrorFallback />}>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Rutas para agentes */}
              <Route path="/nuevo-registro" element={
                <ProtectedRoute requireAgent>
                  <NewRecord />
                </ProtectedRoute>
              } />
              
              {/* Rutas para administradores */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/records" element={
                <ProtectedRoute requireAdmin>
                  <AdminRecords />
                </ProtectedRoute>
              } />
              <Route path="/admin/new-agent" element={
                <ProtectedRoute requireAdmin>
                  <NewAgent />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requireAdmin>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/tokko" element={
                <ProtectedRoute requireAdmin>
                  <TokkoDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/weekly" element={
                <ProtectedRoute requireAdmin>
                  <WeeklyDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/ai-recommendations" element={
                <ProtectedRoute requireAdmin>
                  <AIRecommendations />
                </ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute requireAdmin>
                  <ReportsDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/agent-performance" element={
                <ProtectedRoute requireAdmin>
                  <AgentPerformance />
                </ProtectedRoute>
              } />
              <Route path="/admin/trends" element={
                <ProtectedRoute requireAdmin>
                  <TrendsReports />
                </ProtectedRoute>
              } />
              <Route path="/admin/export" element={
                <ProtectedRoute requireAdmin>
                  <ExportReports />
                </ProtectedRoute>
              } />
              
              {/* Ruta raíz con redirección inteligente basada en rol */}
              <Route path="/" element={<RoleBasedRedirect />} />
              
              {/* Ruta legacy del dashboard para compatibilidad */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<AdvisorDashboard />} />
              </Route>
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

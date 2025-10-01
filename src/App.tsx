import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Layout from './components/Layout';

// Lazy loading de componentes pesados
const AdvisorDashboard = lazy(() => import('./pages/AdvisorDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NewRecord = lazy(() => import('./pages/NewRecord'));
const AdminRecords = lazy(() => import('./pages/AdminRecords'));
const NewAgent = lazy(() => import('./pages/NewAgent'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const TokkoDashboard = lazy(() => import('./pages/TokkoDashboard'));
const WeeklyDashboard = lazy(() => import('./pages/WeeklyDashboard'));
const AIRecommendations = lazy(() => import('./pages/AIRecommendations'));
const ReportsDashboard = lazy(() => import('./pages/ReportsDashboard'));
const AgentPerformance = lazy(() => import('./pages/AgentPerformance'));
const TrendsReports = lazy(() => import('./pages/TrendsReports'));
const ExportReports = lazy(() => import('./pages/ExportReports'));

// Componente de Loading optimizado
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-sm">Cargando...</p>
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
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

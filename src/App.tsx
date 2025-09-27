import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import AdvisorDashboard from './pages/AdvisorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NewRecord from './pages/NewRecord';
import AdminRecords from './pages/AdminRecords';
import NewAgent from './pages/NewAgent';
import AdminUsers from './pages/AdminUsers';
import TokkoDashboard from './pages/TokkoDashboard';
import WeeklyDashboard from './pages/WeeklyDashboard';
import AIRecommendations from './pages/AIRecommendations';
import ReportsDashboard from './pages/ReportsDashboard';
import AgentPerformance from './pages/AgentPerformance';
import TrendsReports from './pages/TrendsReports';
import ExportReports from './pages/ExportReports';
import Layout from './components/Layout';

// Componente para redirección inteligente basada en el rol
const RoleBasedRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
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
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

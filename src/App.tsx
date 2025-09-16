import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import AdvisorDashboard from './pages/AdvisorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NewRecord from './pages/NewRecord';
import AdminRecords from './pages/AdminRecords';
import NewAgent from './pages/NewAgent';
import AdminUsers from './pages/AdminUsers';
import TokkoDashboard from './pages/TokkoDashboard';
import Layout from './components/Layout';

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
            
            {/* Rutas legacy para compatibilidad */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<AdvisorDashboard />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

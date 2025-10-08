import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MaintenanceMode from './MaintenanceMode';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireAgent?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false, requireAgent = false }) => {
  const { user, loading } = useAuth();
  
  // Verificar si el modo mantenimiento está activado
  const isMaintenanceMode = process.env.REACT_APP_MAINTENANCE_MODE === 'true';

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

  // Si el modo mantenimiento está activado y el usuario es un agente, mostrar el mensaje
  if (isMaintenanceMode && user.role === 'agent') {
    return <MaintenanceMode />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/nuevo-registro" replace />;
  }

  if (requireAgent && user.role !== 'agent') {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  BarChart3, 
  Database, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  ArrowLeft,
  Home,
  TrendingUp,
  UserPlus
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backPath?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  showBackButton = false, 
  backPath = '/admin' 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home, current: location.pathname === '/admin' },
    { name: 'Registros', href: '/admin/records', icon: Database, current: location.pathname === '/admin/records' },
    { name: 'Nuevo Agente', href: '/admin/new-agent', icon: UserPlus, current: location.pathname === '/admin/new-agent' },
    { name: 'Usuarios', href: '/admin/users', icon: Users, current: location.pathname === '/admin/users' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 h-screen bg-[#240046] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col justify-between h-screen bg-[#240046]">
          {/* Top Section - Logo and Navigation */}
          <div className="flex-1">
            {/* Logo Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-[#5a189a]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="h-6 w-6 text-[#240046]" />
                </div>
                <div>
                  <span className="text-white font-bold text-lg">Admin Panel</span>
                  <p className="text-xs text-gray-300">Sistema de Rendimiento</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-white hover:text-gray-300 p-1 rounded-md hover:bg-[#5a189a]"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="px-4 py-6">
              <div className="space-y-2">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.href);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      item.current
                        ? 'bg-[#5a189a] text-white shadow-lg'
                        : 'text-gray-300 hover:bg-[#5a189a] hover:text-white hover:shadow-md'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="text-left">{item.name}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Bottom Section - User Info and Logout */}
          <div className="p-4 border-t border-[#5a189a] bg-[#240046]">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-[#9d4edd] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-300 truncate">
                  {user?.role === 'admin' ? 'Administrador' : 'Asesor'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200 hover:shadow-md"
            >
              <LogOut className="mr-3 h-4 w-4 flex-shrink-0" />
              <span className="text-left">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Top header */}
        <div className="bg-white border-b border-gray-200 shadow-sm pt-0 mt-0">
          <div className="flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 p-1"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              {showBackButton && (
                <button
                  onClick={() => navigate(backPath)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm font-medium">Volver</span>
                </button>
              )}
              
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-gray-600">{subtitle}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                <TrendingUp className="h-3 w-3" />
                <span>Sistema de Rendimiento</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 pt-0 mt-0 overflow-auto bg-white">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Wifi, WifiOff } from 'lucide-react';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const { login } = useAuth();
  const navigate = useNavigate();

  // Verificar estado del servidor
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://rendimiento-inmobiliaria-production.up.railway.app/api'}/health`, {
          method: 'GET',
          mode: 'cors',
        });
        if (response.ok) {
          setServerStatus('online');
        } else {
          setServerStatus('offline');
        }
      } catch (error) {
        console.error('Error verificando servidor:', error);
        setServerStatus('offline');
      }
    };

    checkServerStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = await login(formData.email, formData.password);
      
      // Redirigir según el rol
      if (userData.role === 'admin') {
        navigate('/admin');
      } else if (userData.role === 'agent') {
        navigate('/nuevo-registro');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Welcome Section */}
      <div className="hidden lg:flex lg:w-2/3 relative overflow-hidden">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/descarga.jpeg)' }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-8 xl:px-16 text-white">
          {/* Logo */}
          <div className="flex items-center mb-6 xl:mb-8">
            <img 
              src="/images/metric.png" 
              alt="Logo" 
              className="w-10 h-10 xl:w-12 xl:h-12 mr-3 xl:mr-4"
            />
            <span className="text-xl xl:text-3xl font-bold uppercase tracking-wider" style={{ fontFamily: 'Special Gothic Expanded One, sans-serif' }}>Sistema de Rendimiento Inmobiliario</span>
          </div>
          
          {/* Description */}
          <p className="text-lg xl:text-xl text-white leading-relaxed max-w-md ml-0 xl:ml-16" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Ingresá tu rendimiento diario para evaluar tu progreso
          </p>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-r from-[#240046] to-[#5a189a] text-white p-4">
        <div className="flex items-center justify-center">
          <img 
            src="/images/metric.png" 
            alt="Logo" 
            className="w-8 h-8 mr-3"
          />
          <h1 className="text-lg font-bold">Sistema de Rendimiento Inmobiliario</h1>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white rounded-xl lg:rounded-2xl shadow-xl lg:shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-transparent transition-colors"
                  placeholder="name@mail.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-transparent transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Indicador de estado del servidor */}
            <div className="flex items-center justify-center space-x-2 text-sm">
              {serverStatus === 'checking' && (
                <div className="flex items-center text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
                  Verificando servidor...
                </div>
              )}
              {serverStatus === 'online' && (
                <div className="flex items-center text-green-600">
                  <Wifi className="h-4 w-4 mr-2" />
                  Servidor conectado
                </div>
              )}
              {serverStatus === 'offline' && (
                <div className="flex items-center text-red-600">
                  <WifiOff className="h-4 w-4 mr-2" />
                  Servidor no disponible
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Action button */}
            <div>
              <button
                type="submit"
                disabled={loading || serverStatus === 'offline'}
                className="w-full text-white py-3 px-6 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#240046] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ backgroundColor: '#240046' }}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#1a0033'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#240046'}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                ) : (
                  'Ingresar'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

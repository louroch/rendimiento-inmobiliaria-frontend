import axios from 'axios';
import getApiConfig from '../config/api';

const config = getApiConfig();

export const api = axios.create(config);

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en petición API:', error);
    console.error('Detalles del error de API:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      headers: error.response?.headers
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.code === 'ERR_NETWORK_CHANGED' || error.code === 'ERR_NETWORK' || !error.response) {
      // Error de red - el servidor no está disponible
      console.error('Error de conectividad con el servidor:', error.message);
      throw new Error('No se puede conectar con el servidor. Verifica que el backend esté funcionando.');
    }
    
    return Promise.reject(error);
  }
);

export default api;

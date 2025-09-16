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
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.code === 'ECONNABORTED') {
      // Timeout
      console.error('Timeout: El servidor tardó demasiado en responder');
      throw new Error('Timeout: El servidor tardó demasiado en responder. Intenta nuevamente.');
    } else if (error.code === 'ERR_NETWORK_CHANGED' || error.code === 'ERR_NETWORK' || !error.response) {
      // Error de red - el servidor no está disponible
      console.error('Error de conectividad con el servidor:', error.message);
      throw new Error('No se puede conectar con el servidor. Verifica que el backend esté funcionando en http://localhost:5000');
    } else if (error.response) {
      // El servidor respondió con un código de error
      console.error(`Error del servidor: ${error.response.status} - ${error.response.statusText}`);
      throw new Error(`Error del servidor: ${error.response.status} - ${error.response.statusText}`);
    } else {
      // Error en la configuración de la petición
      console.error(`Error de configuración: ${error.message}`);
      throw new Error(`Error de configuración: ${error.message}`);
    }
  }
);

export default api;

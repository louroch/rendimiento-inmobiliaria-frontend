// Configuración de API con fallbacks
const getApiConfig = () => {
  // URLs de fallback en orden de prioridad
  const fallbackUrls = [
    process.env.REACT_APP_API_URL,
    'https://rendimiento-inmobiliaria-production.up.railway.app/api',
    'http://localhost:5000/api'
  ];

  // Encontrar la primera URL válida
  const validUrl = fallbackUrls.find(url => url && url.trim() !== '');
  
  if (!validUrl) {
    throw new Error('No hay URLs de API configuradas');
  }

  return {
    baseURL: validUrl,
    timeout: 30000, // 30 segundos de timeout
    headers: {
      'Content-Type': 'application/json',
    }
  };
};

export default getApiConfig;

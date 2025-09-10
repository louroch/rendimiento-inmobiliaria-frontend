/**
 * Script de Prueba para la API del Sistema de Rendimiento
 * 
 * Este script prueba la integración con el backend y verifica
 * que los datos se envían y reciben correctamente.
 * 
 * Para ejecutar:
 * 1. Asegúrate de que el backend esté corriendo
 * 2. Abre la consola del navegador (F12)
 * 3. Copia y pega este script
 * 4. Ejecuta: testAPI()
 */

// Configuración de la API
const API_CONFIG = {
  baseUrl: 'http://localhost:5000', // Cambia por tu URL del backend
  endpoints: {
    performance: '/api/performance',
    auth: '/api/auth/login',
    users: '/api/users'
  }
};

// Datos de prueba
const TEST_DATA = {
  performance: {
    fecha: new Date().toISOString().split('T')[0],
    consultasRecibidas: 5,
    muestrasRealizadas: 3,
    operacionesCerradas: 2,
    seguimiento: true,
    usoTokko: 'Cargué 3 propiedades nuevas y actualicé contactos',
    cantidadPropiedadesTokko: 3,
    linksTokko: 'https://ejemplo1.com, https://ejemplo2.com',
    dificultadTokko: true,
    detalleDificultadTokko: 'La interfaz es confusa para subir fotos',
    observaciones: 'Todo funcionó bien en general, solo algunos problemas menores'
  },
  auth: {
    email: 'test@ejemplo.com',
    password: 'password123'
  }
};

// Utilidades para testing de API
const APITestUtils = {
  // Hacer petición HTTP
  async makeRequest(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      const data = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        data: data,
        response: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  },
  
  // Verificar estructura de datos
  validatePerformanceData(data) {
    const requiredFields = [
      'fecha', 'consultasRecibidas', 'muestrasRealizadas', 
      'operacionesCerradas', 'seguimiento', 'usoTokko'
    ];
    
    const newFields = [
      'cantidadPropiedadesTokko', 'linksTokko', 'dificultadTokko',
      'detalleDificultadTokko', 'observaciones'
    ];
    
    const hasRequiredFields = requiredFields.every(field => 
      data.hasOwnProperty(field)
    );
    
    const hasNewFields = newFields.every(field => 
      data.hasOwnProperty(field)
    );
    
    return {
      hasRequiredFields,
      hasNewFields,
      allFields: hasRequiredFields && hasNewFields
    };
  },
  
  // Generar token de autenticación (simulado)
  async getAuthToken() {
    // En un entorno real, aquí harías login
    // Por ahora, simulamos un token
    return 'mock-token-12345';
  }
};

// Pruebas de API
const APITests = {
  // Prueba 1: Verificar que el backend esté disponible
  async testBackendAvailability() {
    console.log('🧪 Probando disponibilidad del backend...');
    
    try {
      const result = await APITestUtils.makeRequest(`${API_CONFIG.baseUrl}/health`);
      
      if (result.success) {
        console.log('✅ Backend disponible');
        return true;
      } else {
        console.log('❌ Backend no disponible:', result.status);
        return false;
      }
    } catch (error) {
      console.log('❌ Error conectando con el backend:', error);
      return false;
    }
  },
  
  // Prueba 2: Crear un registro de performance
  async testCreatePerformance() {
    console.log('🧪 Probando creación de registro de performance...');
    
    try {
      const token = await APITestUtils.getAuthToken();
      
      const result = await APITestUtils.makeRequest(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.performance}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(TEST_DATA.performance)
        }
      );
      
      if (result.success) {
        console.log('✅ Registro creado exitosamente');
        console.log('Datos recibidos:', result.data);
        
        // Verificar que los datos nuevos están en la respuesta
        const validation = APITestUtils.validatePerformanceData(result.data);
        console.log('Validación de campos:', validation);
        
        return validation.allFields;
      } else {
        console.log('❌ Error creando registro:', result.data);
        return false;
      }
    } catch (error) {
      console.log('❌ Error en la petición:', error);
      return false;
    }
  },
  
  // Prueba 3: Obtener registros de performance
  async testGetPerformance() {
    console.log('🧪 Probando obtención de registros de performance...');
    
    try {
      const token = await APITestUtils.getAuthToken();
      
      const result = await APITestUtils.makeRequest(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.performance}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (result.success) {
        console.log('✅ Registros obtenidos exitosamente');
        console.log('Cantidad de registros:', result.data.length);
        
        // Verificar que los registros tienen los nuevos campos
        if (result.data.length > 0) {
          const firstRecord = result.data[0];
          const validation = APITestUtils.validatePerformanceData(firstRecord);
          console.log('Validación del primer registro:', validation);
          return validation.allFields;
        }
        
        return true;
      } else {
        console.log('❌ Error obteniendo registros:', result.data);
        return false;
      }
    } catch (error) {
      console.log('❌ Error en la petición:', error);
      return false;
    }
  },
  
  // Prueba 4: Actualizar un registro de performance
  async testUpdatePerformance() {
    console.log('🧪 Probando actualización de registro de performance...');
    
    try {
      const token = await APITestUtils.getAuthToken();
      
      // Primero obtener un registro existente
      const getResult = await APITestUtils.makeRequest(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.performance}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!getResult.success || getResult.data.length === 0) {
        console.log('❌ No hay registros para actualizar');
        return false;
      }
      
      const recordId = getResult.data[0].id;
      const updatedData = {
        ...TEST_DATA.performance,
        observaciones: 'Observaciones actualizadas desde el test'
      };
      
      const updateResult = await APITestUtils.makeRequest(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.performance}/${recordId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedData)
        }
      );
      
      if (updateResult.success) {
        console.log('✅ Registro actualizado exitosamente');
        return true;
      } else {
        console.log('❌ Error actualizando registro:', updateResult.data);
        return false;
      }
    } catch (error) {
      console.log('❌ Error en la petición:', error);
      return false;
    }
  },
  
  // Prueba 5: Validar estructura de respuesta
  async testResponseStructure() {
    console.log('🧪 Probando estructura de respuesta...');
    
    try {
      const token = await APITestUtils.getAuthToken();
      
      const result = await APITestUtils.makeRequest(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.performance}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (result.success) {
        const data = result.data;
        
        // Verificar que es un array
        const isArray = Array.isArray(data);
        console.log('Es array:', isArray ? '✅' : '❌');
        
        if (isArray && data.length > 0) {
          const record = data[0];
          
          // Verificar campos básicos
          const basicFields = ['id', 'fecha', 'consultasRecibidas', 'muestrasRealizadas', 'operacionesCerradas'];
          const hasBasicFields = basicFields.every(field => record.hasOwnProperty(field));
          console.log('Campos básicos:', hasBasicFields ? '✅' : '❌');
          
          // Verificar campos nuevos
          const newFields = ['cantidadPropiedadesTokko', 'linksTokko', 'dificultadTokko', 'detalleDificultadTokko', 'observaciones'];
          const hasNewFields = newFields.every(field => record.hasOwnProperty(field));
          console.log('Campos nuevos:', hasNewFields ? '✅' : '❌');
          
          // Verificar tipos de datos
          const typeChecks = {
            consultasRecibidas: typeof record.consultasRecibidas === 'number',
            muestrasRealizadas: typeof record.muestrasRealizadas === 'number',
            operacionesCerradas: typeof record.operacionesCerradas === 'number',
            seguimiento: typeof record.seguimiento === 'boolean',
            dificultadTokko: record.dificultadTokko === null || typeof record.dificultadTokko === 'boolean'
          };
          
          console.log('Tipos de datos:', typeChecks);
          const allTypesCorrect = Object.values(typeChecks).every(Boolean);
          console.log('Todos los tipos correctos:', allTypesCorrect ? '✅' : '❌');
          
          return hasBasicFields && hasNewFields && allTypesCorrect;
        }
        
        return true;
      } else {
        console.log('❌ Error obteniendo datos:', result.data);
        return false;
      }
    } catch (error) {
      console.log('❌ Error en la petición:', error);
      return false;
    }
  }
};

// Función principal de testing de API
async function testAPI() {
  console.log('🚀 Iniciando pruebas de API del Sistema de Rendimiento');
  console.log('=' .repeat(60));
  
  const results = {
    backendAvailable: false,
    createPerformance: false,
    getPerformance: false,
    updatePerformance: false,
    responseStructure: false
  };
  
  try {
    // Ejecutar todas las pruebas
    results.backendAvailable = await APITests.testBackendAvailability();
    
    if (results.backendAvailable) {
      results.createPerformance = await APITests.testCreatePerformance();
      results.getPerformance = await APITests.testGetPerformance();
      results.updatePerformance = await APITests.testUpdatePerformance();
      results.responseStructure = await APITests.testResponseStructure();
    } else {
      console.log('⚠️  Backend no disponible, saltando pruebas de API');
    }
    
  } catch (error) {
    console.error('❌ Error durante las pruebas de API:', error);
  }
  
  // Mostrar resumen de resultados
  console.log('\n📊 RESUMEN DE PRUEBAS DE API');
  console.log('=' .repeat(60));
  
  const testNames = {
    backendAvailable: 'Backend disponible',
    createPerformance: 'Crear registro',
    getPerformance: 'Obtener registros',
    updatePerformance: 'Actualizar registro',
    responseStructure: 'Estructura de respuesta'
  };
  
  Object.entries(results).forEach(([key, passed]) => {
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testNames[key]}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Resultado: ${passedTests}/${totalTests} pruebas de API pasaron`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ¡Todas las pruebas de API pasaron! La integración está funcionando correctamente.');
  } else {
    console.log('⚠️  Algunas pruebas de API fallaron. Revisa la configuración del backend.');
  }
  
  return results;
}

// Función para probar solo la creación de registros
async function testCreateOnly() {
  console.log('🧪 Probando solo la creación de registros...');
  
  const results = {
    backendAvailable: await APITests.testBackendAvailability(),
    createPerformance: false
  };
  
  if (results.backendAvailable) {
    results.createPerformance = await APITests.testCreatePerformance();
  }
  
  console.log('\n📊 RESULTADOS DE CREACIÓN');
  console.log('=' .repeat(40));
  
  Object.entries(results).forEach(([key, passed]) => {
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${key}`);
  });
  
  return results;
}

// Exportar funciones para uso global
window.testAPI = testAPI;
window.testCreateOnly = testCreateOnly;
window.APITests = APITests;
window.APITestUtils = APITestUtils;

console.log('🔧 Script de pruebas de API cargado. Usa:');
console.log('- testAPI() para pruebas completas de API');
console.log('- testCreateOnly() para probar solo la creación');
console.log('- APITests para funciones individuales');

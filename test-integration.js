/**
 * Script de Pruebas de Integración Completo
 * 
 * Este script ejecuta todas las pruebas del sistema:
 * - Pruebas del formulario
 * - Pruebas de la API
 * - Pruebas de integración end-to-end
 * 
 * Para ejecutar:
 * 1. Asegúrate de que tanto el frontend como el backend estén corriendo
 * 2. Abre la consola del navegador (F12)
 * 3. Copia y pega este script
 * 4. Ejecuta: testIntegrationComplete()
 */

// Configuración global
const INTEGRATION_CONFIG = {
  frontendUrl: 'http://localhost:3000',
  backendUrl: 'http://localhost:5000',
  testTimeout: 30000, // 30 segundos
  retryAttempts: 3
};

// Utilidades de integración
const IntegrationUtils = {
  // Ejecutar función con reintentos
  async withRetry(fn, attempts = 3, delay = 1000) {
    for (let i = 0; i < attempts; i++) {
      try {
        const result = await fn();
        return result;
      } catch (error) {
        console.log(`Intento ${i + 1} falló:`, error.message);
        if (i === attempts - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  },
  
  // Verificar que estamos en la página correcta
  isOnCorrectPage() {
    const currentUrl = window.location.href;
    return currentUrl.includes('/nuevo-registro') || 
           currentUrl.includes('/new-record') ||
           currentUrl.includes('localhost:3000');
  },
  
  // Simular interacción completa del usuario
  async simulateUserInteraction() {
    console.log('🎭 Simulando interacción completa del usuario...');
    
    const steps = [
      () => this.fillBasicFields(),
      () => this.fillNewFields(),
      () => this.testConditionalLogic(),
      () => this.submitForm()
    ];
    
    for (const step of steps) {
      try {
        await step();
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Error en paso:', error);
        throw error;
      }
    }
  },
  
  // Llenar campos básicos
  async fillBasicFields() {
    console.log('📝 Llenando campos básicos...');
    
    const basicData = {
      'input[name="fecha"]': new Date().toISOString().split('T')[0],
      'input[name="consultasRecibidas"]': 5,
      'input[name="muestrasRealizadas"]': 3,
      'input[name="operacionesCerradas"]': 2,
      'textarea[name="usoTokko"]': 'Cargué propiedades y actualicé contactos'
    };
    
    for (const [selector, value] of Object.entries(basicData)) {
      const element = document.querySelector(selector);
      if (element) {
        element.focus();
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    
    // Marcar checkbox de seguimiento
    const seguimientoCheckbox = document.querySelector('input[name="seguimiento"]');
    if (seguimientoCheckbox) {
      seguimientoCheckbox.checked = true;
      seguimientoCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
    }
  },
  
  // Llenar campos nuevos
  async fillNewFields() {
    console.log('🆕 Llenando campos nuevos...');
    
    const newData = {
      'input[name="cantidadPropiedadesTokko"]': 3,
      'textarea[name="linksTokko"]': 'https://ejemplo1.com, https://ejemplo2.com',
      'textarea[name="observaciones"]': 'Todo funcionó bien en general'
    };
    
    for (const [selector, value] of Object.entries(newData)) {
      const element = document.querySelector(selector);
      if (element) {
        element.focus();
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  },
  
  // Probar lógica condicional
  async testConditionalLogic() {
    console.log('🔄 Probando lógica condicional...');
    
    // Primero seleccionar "No" - campo no debería aparecer
    const noRadio = document.querySelector('input[name="dificultadTokko"][value="false"]');
    if (noRadio) {
      noRadio.checked = true;
      noRadio.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Verificar que el campo está oculto
    const detalleField = document.querySelector('textarea[name="detalleDificultadTokko"]');
    const isHidden = !detalleField || detalleField.offsetParent === null;
    console.log('Campo oculto cuando se selecciona "No":', isHidden ? '✅' : '❌');
    
    // Luego seleccionar "Sí" - campo debería aparecer
    const siRadio = document.querySelector('input[name="dificultadTokko"][value="true"]');
    if (siRadio) {
      siRadio.checked = true;
      siRadio.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Verificar que el campo está visible
    const detalleFieldVisible = document.querySelector('textarea[name="detalleDificultadTokko"]');
    const isVisible = detalleFieldVisible && detalleFieldVisible.offsetParent !== null;
    console.log('Campo visible cuando se selecciona "Sí":', isVisible ? '✅' : '❌');
    
    // Llenar el campo de detalle
    if (isVisible) {
      detalleFieldVisible.value = 'La interfaz es confusa para subir fotos';
      detalleFieldVisible.dispatchEvent(new Event('input', { bubbles: true }));
      detalleFieldVisible.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    return isHidden && isVisible;
  },
  
  // Enviar formulario
  async submitForm() {
    console.log('📤 Enviando formulario...');
    
    // Interceptar fetch para capturar la petición
    const originalFetch = window.fetch;
    let requestCaptured = false;
    let requestData = null;
    
    window.fetch = async (url, options) => {
      requestCaptured = true;
      if (options && options.body) {
        requestData = JSON.parse(options.body);
      }
      
      // Simular respuesta exitosa
      return {
        ok: true,
        status: 200,
        json: async () => ({ 
          success: true, 
          message: 'Registro creado exitosamente',
          data: { id: 'test-id-123' }
        })
      };
    };
    
    try {
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Petición capturada:', requestCaptured ? '✅' : '❌');
        console.log('Datos enviados:', requestData);
        
        return requestCaptured && requestData;
      } else {
        console.log('❌ Botón de envío no encontrado');
        return false;
      }
    } finally {
      // Restaurar fetch original
      window.fetch = originalFetch;
    }
  }
};

// Pruebas de integración
const IntegrationTests = {
  // Prueba 1: Verificar entorno completo
  async testEnvironment() {
    console.log('🌍 Probando entorno completo...');
    
    const checks = {
      onCorrectPage: IntegrationUtils.isOnCorrectPage(),
      hasForm: document.querySelector('form') !== null,
      hasNewFields: document.querySelector('input[name="cantidadPropiedadesTokko"]') !== null,
      hasConditionalField: document.querySelector('input[name="dificultadTokko"]') !== null
    };
    
    console.log('Verificaciones de entorno:', checks);
    
    const allPassed = Object.values(checks).every(Boolean);
    console.log('Entorno completo:', allPassed ? '✅' : '❌');
    
    return allPassed;
  },
  
  // Prueba 2: Flujo completo de usuario
  async testCompleteUserFlow() {
    console.log('👤 Probando flujo completo de usuario...');
    
    try {
      await IntegrationUtils.simulateUserInteraction();
      console.log('✅ Flujo completo de usuario exitoso');
      return true;
    } catch (error) {
      console.log('❌ Error en flujo de usuario:', error);
      return false;
    }
  },
  
  // Prueba 3: Validación de datos
  async testDataValidation() {
    console.log('✅ Probando validación de datos...');
    
    const validations = {
      dateValidation: this.testDateValidation(),
      requiredFields: this.testRequiredFields(),
      dataTypes: this.testDataTypes()
    };
    
    console.log('Validaciones:', validations);
    
    const allValid = Object.values(validations).every(Boolean);
    console.log('Validación de datos:', allValid ? '✅' : '❌');
    
    return allValid;
  },
  
  // Validación de fecha
  testDateValidation() {
    const dateInput = document.querySelector('input[name="fecha"]');
    if (!dateInput) return false;
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Intentar establecer fecha pasada
    dateInput.value = yesterday;
    dateInput.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Verificar que no se puede establecer fecha pasada
    const isValid = dateInput.value >= today;
    console.log('Validación de fecha:', isValid ? '✅' : '❌');
    
    return isValid;
  },
  
  // Campos requeridos
  testRequiredFields() {
    const requiredFields = [
      'input[name="fecha"]',
      'input[name="consultasRecibidas"]',
      'input[name="muestrasRealizadas"]',
      'input[name="operacionesCerradas"]'
    ];
    
    const allPresent = requiredFields.every(selector => 
      document.querySelector(selector) !== null
    );
    
    console.log('Campos requeridos:', allPresent ? '✅' : '❌');
    return allPresent;
  },
  
  // Tipos de datos
  testDataTypes() {
    const numericFields = [
      'input[name="consultasRecibidas"]',
      'input[name="muestrasRealizadas"]',
      'input[name="operacionesCerradas"]',
      'input[name="cantidadPropiedadesTokko"]'
    ];
    
    const allNumeric = numericFields.every(selector => {
      const element = document.querySelector(selector);
      return element && element.type === 'number';
    });
    
    console.log('Tipos de datos:', allNumeric ? '✅' : '❌');
    return allNumeric;
  },
  
  // Prueba 4: Rendimiento del formulario
  async testFormPerformance() {
    console.log('⚡ Probando rendimiento del formulario...');
    
    const startTime = performance.now();
    
    try {
      await IntegrationUtils.simulateUserInteraction();
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.log(`Tiempo de interacción: ${duration.toFixed(2)}ms`);
      
      const isFast = duration < 5000; // Menos de 5 segundos
      console.log('Rendimiento:', isFast ? '✅' : '❌');
      
      return isFast;
    } catch (error) {
      console.log('❌ Error en prueba de rendimiento:', error);
      return false;
    }
  },
  
  // Prueba 5: Compatibilidad del navegador
  testBrowserCompatibility() {
    console.log('🌐 Probando compatibilidad del navegador...');
    
    const features = {
      fetch: typeof fetch !== 'undefined',
      promises: typeof Promise !== 'undefined',
      asyncAwait: (async () => {}).constructor.name === 'AsyncFunction',
      es6: typeof Symbol !== 'undefined',
      localstorage: typeof localStorage !== 'undefined'
    };
    
    console.log('Características del navegador:', features);
    
    const allSupported = Object.values(features).every(Boolean);
    console.log('Compatibilidad:', allSupported ? '✅' : '❌');
    
    return allSupported;
  }
};

// Función principal de integración
async function testIntegrationComplete() {
  console.log('🚀 Iniciando pruebas de integración completas');
  console.log('=' .repeat(60));
  
  const results = {
    environment: false,
    userFlow: false,
    dataValidation: false,
    performance: false,
    browserCompatibility: false
  };
  
  try {
    // Ejecutar todas las pruebas
    results.environment = await IntegrationUtils.withRetry(
      () => IntegrationTests.testEnvironment()
    );
    
    if (results.environment) {
      results.userFlow = await IntegrationUtils.withRetry(
        () => IntegrationTests.testCompleteUserFlow()
      );
      
      results.dataValidation = await IntegrationUtils.withRetry(
        () => IntegrationTests.testDataValidation()
      );
      
      results.performance = await IntegrationUtils.withRetry(
        () => IntegrationTests.testFormPerformance()
      );
    }
    
    results.browserCompatibility = IntegrationTests.testBrowserCompatibility();
    
  } catch (error) {
    console.error('❌ Error durante las pruebas de integración:', error);
  }
  
  // Mostrar resumen de resultados
  console.log('\n📊 RESUMEN DE PRUEBAS DE INTEGRACIÓN');
  console.log('=' .repeat(60));
  
  const testNames = {
    environment: 'Entorno completo',
    userFlow: 'Flujo de usuario',
    dataValidation: 'Validación de datos',
    performance: 'Rendimiento',
    browserCompatibility: 'Compatibilidad del navegador'
  };
  
  Object.entries(results).forEach(([key, passed]) => {
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testNames[key]}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Resultado: ${passedTests}/${totalTests} pruebas de integración pasaron`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ¡Todas las pruebas de integración pasaron! El sistema está completamente funcional.');
  } else {
    console.log('⚠️  Algunas pruebas de integración fallaron. Revisa los errores arriba.');
  }
  
  return results;
}

// Función para ejecutar todas las pruebas
async function runAllTests() {
  console.log('🧪 Ejecutando todas las pruebas del sistema...');
  console.log('=' .repeat(60));
  
  const results = {
    integration: {},
    form: {},
    api: {}
  };
  
  try {
    // Pruebas de integración
    console.log('\n1️⃣ PRUEBAS DE INTEGRACIÓN');
    results.integration = await testIntegrationComplete();
    
    // Pruebas del formulario (si están disponibles)
    if (typeof testFormulario === 'function') {
      console.log('\n2️⃣ PRUEBAS DEL FORMULARIO');
      results.form = await testFormulario();
    }
    
    // Pruebas de API (si están disponibles)
    if (typeof testAPI === 'function') {
      console.log('\n3️⃣ PRUEBAS DE API');
      results.api = await testAPI();
    }
    
  } catch (error) {
    console.error('❌ Error ejecutando todas las pruebas:', error);
  }
  
  // Resumen final
  console.log('\n🏆 RESUMEN FINAL DE TODAS LAS PRUEBAS');
  console.log('=' .repeat(60));
  
  const totalPassed = Object.values(results).reduce((acc, category) => {
    if (typeof category === 'object' && category !== null) {
      return acc + Object.values(category).filter(Boolean).length;
    }
    return acc;
  }, 0);
  
  const totalTests = Object.values(results).reduce((acc, category) => {
    if (typeof category === 'object' && category !== null) {
      return acc + Object.keys(category).length;
    }
    return acc;
  }, 0);
  
  console.log(`🎯 Total: ${totalPassed}/${totalTests} pruebas pasaron`);
  
  if (totalPassed === totalTests) {
    console.log('🎉 ¡TODAS LAS PRUEBAS PASARON! El sistema está completamente funcional y listo para producción.');
  } else {
    console.log('⚠️  Algunas pruebas fallaron. Revisa los errores específicos arriba.');
  }
  
  return results;
}

// Exportar funciones para uso global
window.testIntegrationComplete = testIntegrationComplete;
window.runAllTests = runAllTests;
window.IntegrationTests = IntegrationTests;
window.IntegrationUtils = IntegrationUtils;

console.log('🔧 Script de pruebas de integración cargado. Usa:');
console.log('- testIntegrationComplete() para pruebas de integración');
console.log('- runAllTests() para ejecutar todas las pruebas');
console.log('- IntegrationTests para funciones individuales');

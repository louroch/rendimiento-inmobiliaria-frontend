/**
 * Script de Prueba para el Sistema de Rendimiento Inmobiliario
 * 
 * Este script simula las interacciones del usuario y verifica
 * la funcionalidad del formulario y del sistema en general.
 * 
 * Para ejecutar:
 * 1. Abre la consola del navegador (F12)
 * 2. Copia y pega este script
 * 3. Ejecuta: testSistemaRendimiento()
 */

// Configuración de la prueba
const CONFIG = {
  baseUrl: 'http://localhost:3000', // Cambia por tu URL de desarrollo
  testUser: {
    email: 'test@ejemplo.com',
    password: 'password123'
  },
  testData: {
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
  }
};

// Utilidades de testing
const TestUtils = {
  // Simula un delay para que las animaciones se completen
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Verifica si un elemento existe
  elementExists: (selector) => document.querySelector(selector) !== null,
  
  // Obtiene el valor de un elemento
  getElementValue: (selector) => {
    const element = document.querySelector(selector);
    return element ? element.value : null;
  },
  
  // Simula escribir en un campo
  typeInField: (selector, value) => {
    const element = document.querySelector(selector);
    if (element) {
      element.focus();
      element.value = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    return false;
  },
  
  // Simula hacer clic en un elemento
  clickElement: (selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.click();
      return true;
    }
    return false;
  },
  
  // Verifica si un checkbox está marcado
  isCheckboxChecked: (selector) => {
    const element = document.querySelector(selector);
    return element ? element.checked : false;
  },
  
  // Simula marcar/desmarcar un checkbox
  toggleCheckbox: (selector, checked = true) => {
    const element = document.querySelector(selector);
    if (element) {
      element.checked = checked;
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    return false;
  },
  
  // Simula seleccionar un radio button
  selectRadio: (name, value) => {
    const element = document.querySelector(`input[name="${name}"][value="${value}"]`);
    if (element) {
      element.checked = true;
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    return false;
  }
};

// Funciones de prueba específicas
const FormTests = {
  // Prueba 1: Verificar que todos los campos nuevos existen
  testNewFieldsExist: () => {
    console.log('🧪 Probando existencia de campos nuevos...');
    
    const newFields = [
      'input[name="cantidadPropiedadesTokko"]',
      'textarea[name="linksTokko"]',
      'input[name="dificultadTokko"][value="true"]',
      'input[name="dificultadTokko"][value="false"]',
      'textarea[name="detalleDificultadTokko"]',
      'textarea[name="observaciones"]'
    ];
    
    const results = newFields.map(selector => ({
      field: selector,
      exists: TestUtils.elementExists(selector)
    }));
    
    const allExist = results.every(r => r.exists);
    console.log('Resultados:', results);
    console.log(allExist ? '✅ Todos los campos nuevos existen' : '❌ Faltan algunos campos');
    
    return allExist;
  },
  
  // Prueba 2: Verificar validación de fecha
  testDateValidation: () => {
    console.log('🧪 Probando validación de fecha...');
    
    const dateInput = document.querySelector('input[name="fecha"]');
    if (!dateInput) {
      console.log('❌ Campo de fecha no encontrado');
      return false;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Intentar establecer una fecha pasada
    dateInput.value = yesterday;
    dateInput.dispatchEvent(new Event('change', { bubbles: true }));
    
    const isValid = dateInput.value === today || dateInput.value >= today;
    console.log(isValid ? '✅ Validación de fecha funciona' : '❌ Validación de fecha no funciona');
    
    return isValid;
  },
  
  // Prueba 3: Llenar formulario completo
  testFillCompleteForm: async () => {
    console.log('🧪 Llenando formulario completo...');
    
    const testData = CONFIG.testData;
    let success = true;
    
    try {
      // Campos básicos
      TestUtils.typeInField('input[name="fecha"]', testData.fecha);
      TestUtils.typeInField('input[name="consultasRecibidas"]', testData.consultasRecibidas);
      TestUtils.typeInField('input[name="muestrasRealizadas"]', testData.muestrasRealizadas);
      TestUtils.typeInField('input[name="operacionesCerradas"]', testData.operacionesCerradas);
      
      // Checkbox de seguimiento
      TestUtils.toggleCheckbox('input[name="seguimiento"]', testData.seguimiento);
      
      // Uso de Tokko
      TestUtils.typeInField('textarea[name="usoTokko"]', testData.usoTokko);
      
      // Nuevos campos
      TestUtils.typeInField('input[name="cantidadPropiedadesTokko"]', testData.cantidadPropiedadesTokko);
      TestUtils.typeInField('textarea[name="linksTokko"]', testData.linksTokko);
      
      // Radio buttons de dificultad
      TestUtils.selectRadio('dificultadTokko', 'true');
      await TestUtils.delay(500); // Esperar a que aparezca el campo condicional
      
      // Campo condicional de detalle
      TestUtils.typeInField('textarea[name="detalleDificultadTokko"]', testData.detalleDificultadTokko);
      
      // Observaciones
      TestUtils.typeInField('textarea[name="observaciones"]', testData.observaciones);
      
      console.log('✅ Formulario llenado correctamente');
      success = true;
      
    } catch (error) {
      console.log('❌ Error llenando formulario:', error);
      success = false;
    }
    
    return success;
  },
  
  // Prueba 4: Verificar campo condicional
  testConditionalField: async () => {
    console.log('🧪 Probando campo condicional...');
    
    // Primero seleccionar "No" - el campo no debería aparecer
    TestUtils.selectRadio('dificultadTokko', 'false');
    await TestUtils.delay(300);
    
    const fieldHidden = !TestUtils.elementExists('textarea[name="detalleDificultadTokko"]');
    console.log('Campo oculto cuando se selecciona "No":', fieldHidden ? '✅' : '❌');
    
    // Luego seleccionar "Sí" - el campo debería aparecer
    TestUtils.selectRadio('dificultadTokko', 'true');
    await TestUtils.delay(300);
    
    const fieldVisible = TestUtils.elementExists('textarea[name="detalleDificultadTokko"]');
    console.log('Campo visible cuando se selecciona "Sí":', fieldVisible ? '✅' : '❌');
    
    return fieldHidden && fieldVisible;
  },
  
  // Prueba 5: Verificar envío del formulario
  testFormSubmission: async () => {
    console.log('🧪 Probando envío del formulario...');
    
    // Interceptar la petición fetch para simular el envío
    const originalFetch = window.fetch;
    let requestData = null;
    let requestUrl = null;
    
    window.fetch = async (url, options) => {
      requestUrl = url;
      if (options && options.body) {
        requestData = JSON.parse(options.body);
      }
      // Simular respuesta exitosa
      return {
        ok: true,
        status: 200,
        json: async () => ({ success: true, message: 'Registro creado exitosamente' })
      };
    };
    
    try {
      // Hacer clic en el botón de envío
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.click();
        await TestUtils.delay(1000);
        
        // Verificar que se enviaron los datos correctos
        const dataSent = requestData !== null;
        const correctUrl = requestUrl && requestUrl.includes('/performance');
        
        console.log('Datos enviados:', dataSent ? '✅' : '❌');
        console.log('URL correcta:', correctUrl ? '✅' : '❌');
        console.log('Datos enviados:', requestData);
        
        return dataSent && correctUrl;
      } else {
        console.log('❌ Botón de envío no encontrado');
        return false;
      }
    } catch (error) {
      console.log('❌ Error en envío:', error);
      return false;
    } finally {
      // Restaurar fetch original
      window.fetch = originalFetch;
    }
  }
};

// Funciones de prueba del sistema general
const SystemTests = {
  // Prueba 6: Verificar navegación
  testNavigation: () => {
    console.log('🧪 Probando navegación del sistema...');
    
    const currentUrl = window.location.href;
    const isOnCorrectPage = currentUrl.includes('/nuevo-registro') || currentUrl.includes('/new-record');
    
    console.log('URL actual:', currentUrl);
    console.log('En página correcta:', isOnCorrectPage ? '✅' : '❌');
    
    return isOnCorrectPage;
  },
  
  // Prueba 7: Verificar elementos de la interfaz
  testUIElements: () => {
    console.log('🧪 Probando elementos de la interfaz...');
    
    const elements = [
      'h1', // Título del sistema
      'h2', // Título del formulario
      'input[name="fecha"]',
      'input[name="consultasRecibidas"]',
      'input[name="muestrasRealizadas"]',
      'input[name="operacionesCerradas"]',
      'input[name="seguimiento"]',
      'textarea[name="usoTokko"]',
      'button[type="submit"]'
    ];
    
    const results = elements.map(selector => ({
      element: selector,
      exists: TestUtils.elementExists(selector)
    }));
    
    const allExist = results.every(r => r.exists);
    console.log('Elementos de UI:', results);
    console.log(allExist ? '✅ Todos los elementos existen' : '❌ Faltan algunos elementos');
    
    return allExist;
  },
  
  // Prueba 8: Verificar responsividad
  testResponsiveness: () => {
    console.log('🧪 Probando responsividad...');
    
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    console.log('Viewport actual:', viewport);
    
    // Verificar que el formulario es responsive
    const form = document.querySelector('form');
    const isResponsive = form && form.offsetWidth > 0;
    
    console.log('Formulario responsive:', isResponsive ? '✅' : '❌');
    
    return isResponsive;
  }
};

// Función principal de testing
async function testSistemaRendimiento() {
  console.log('🚀 Iniciando pruebas del Sistema de Rendimiento Inmobiliario');
  console.log('=' .repeat(60));
  
  const results = {
    newFieldsExist: false,
    dateValidation: false,
    formFill: false,
    conditionalField: false,
    formSubmission: false,
    navigation: false,
    uiElements: false,
    responsiveness: false
  };
  
  try {
    // Ejecutar todas las pruebas
    results.newFieldsExist = FormTests.testNewFieldsExist();
    await TestUtils.delay(500);
    
    results.dateValidation = FormTests.testDateValidation();
    await TestUtils.delay(500);
    
    results.formFill = await FormTests.testFillCompleteForm();
    await TestUtils.delay(500);
    
    results.conditionalField = await FormTests.testConditionalField();
    await TestUtils.delay(500);
    
    results.formSubmission = await FormTests.testFormSubmission();
    await TestUtils.delay(500);
    
    results.navigation = SystemTests.testNavigation();
    await TestUtils.delay(500);
    
    results.uiElements = SystemTests.testUIElements();
    await TestUtils.delay(500);
    
    results.responsiveness = SystemTests.testResponsiveness();
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  }
  
  // Mostrar resumen de resultados
  console.log('\n📊 RESUMEN DE PRUEBAS');
  console.log('=' .repeat(60));
  
  const testNames = {
    newFieldsExist: 'Campos nuevos existen',
    dateValidation: 'Validación de fecha',
    formFill: 'Llenado de formulario',
    conditionalField: 'Campo condicional',
    formSubmission: 'Envío de formulario',
    navigation: 'Navegación',
    uiElements: 'Elementos de UI',
    responsiveness: 'Responsividad'
  };
  
  Object.entries(results).forEach(([key, passed]) => {
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testNames[key]}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Resultado: ${passedTests}/${totalTests} pruebas pasaron`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ¡Todas las pruebas pasaron! El sistema está funcionando correctamente.');
  } else {
    console.log('⚠️  Algunas pruebas fallaron. Revisa los errores arriba.');
  }
  
  return results;
}

// Función para probar solo el formulario
async function testFormulario() {
  console.log('🧪 Probando solo el formulario...');
  
  const results = {
    newFieldsExist: FormTests.testNewFieldsExist(),
    dateValidation: FormTests.testDateValidation(),
    formFill: await FormTests.testFillCompleteForm(),
    conditionalField: await FormTests.testConditionalField(),
    formSubmission: await FormTests.testFormSubmission()
  };
  
  console.log('\n📊 RESULTADOS DEL FORMULARIO');
  console.log('=' .repeat(40));
  
  Object.entries(results).forEach(([key, passed]) => {
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${key}`);
  });
  
  return results;
}

// Exportar funciones para uso global
window.testSistemaRendimiento = testSistemaRendimiento;
window.testFormulario = testFormulario;
window.TestUtils = TestUtils;

console.log('🔧 Script de pruebas cargado. Usa:');
console.log('- testSistemaRendimiento() para pruebas completas');
console.log('- testFormulario() para pruebas solo del formulario');
console.log('- TestUtils para utilidades de testing');

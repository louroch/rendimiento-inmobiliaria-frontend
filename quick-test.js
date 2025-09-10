/**
 * 🚀 PRUEBA RÁPIDA DEL SISTEMA DE RENDIMIENTO
 * 
 * Este es un script de prueba rápida que puedes ejecutar inmediatamente
 * en la consola del navegador para verificar que todo funciona.
 * 
 * INSTRUCCIONES:
 * 1. Ve a http://localhost:3000/nuevo-registro
 * 2. Abre la consola del navegador (F12)
 * 3. Copia y pega este script completo
 * 4. Presiona Enter
 * 
 * El script ejecutará automáticamente todas las pruebas y te mostrará los resultados.
 */

console.log('🚀 INICIANDO PRUEBA RÁPIDA DEL SISTEMA DE RENDIMIENTO');
console.log('=' .repeat(60));

// Función de prueba rápida
async function quickTest() {
  const results = {
    pageLoaded: false,
    formExists: false,
    newFieldsExist: false,
    dateValidation: false,
    conditionalField: false,
    formSubmission: false
  };
  
  try {
    // 1. Verificar que la página esté cargada
    console.log('1️⃣ Verificando página...');
    results.pageLoaded = window.location.href.includes('nuevo-registro') || 
                        window.location.href.includes('new-record');
    console.log('Página correcta:', results.pageLoaded ? '✅' : '❌');
    
    // 2. Verificar que el formulario existe
    console.log('\n2️⃣ Verificando formulario...');
    const form = document.querySelector('form');
    results.formExists = form !== null;
    console.log('Formulario encontrado:', results.formExists ? '✅' : '❌');
    
    if (!results.formExists) {
      console.log('❌ No se encontró el formulario. Asegúrate de estar en la página correcta.');
      return results;
    }
    
    // 3. Verificar campos nuevos
    console.log('\n3️⃣ Verificando campos nuevos...');
    const newFields = [
      'input[name="cantidadPropiedadesTokko"]',
      'textarea[name="linksTokko"]',
      'input[name="dificultadTokko"][value="true"]',
      'input[name="dificultadTokko"][value="false"]',
      'textarea[name="detalleDificultadTokko"]',
      'textarea[name="observaciones"]'
    ];
    
    const fieldsFound = newFields.map(selector => ({
      field: selector.split('[')[0].split('"')[1],
      exists: document.querySelector(selector) !== null
    }));
    
    console.log('Campos encontrados:', fieldsFound);
    results.newFieldsExist = fieldsFound.every(f => f.exists);
    console.log('Todos los campos nuevos:', results.newFieldsExist ? '✅' : '❌');
    
    // 4. Probar validación de fecha
    console.log('\n4️⃣ Probando validación de fecha...');
    const dateInput = document.querySelector('input[name="fecha"]');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      // Intentar establecer fecha pasada
      dateInput.value = yesterday;
      dateInput.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Verificar que no se puede establecer fecha pasada
      results.dateValidation = dateInput.value >= today;
      console.log('Validación de fecha:', results.dateValidation ? '✅' : '❌');
      
      // Restaurar fecha actual
      dateInput.value = today;
    } else {
      console.log('❌ Campo de fecha no encontrado');
    }
    
    // 5. Probar campo condicional
    console.log('\n5️⃣ Probando campo condicional...');
    const noRadio = document.querySelector('input[name="dificultadTokko"][value="false"]');
    const siRadio = document.querySelector('input[name="dificultadTokko"][value="true"]');
    const detalleField = document.querySelector('textarea[name="detalleDificultadTokko"]');
    
    if (noRadio && siRadio && detalleField) {
      // Seleccionar "No" - campo no debería estar visible
      noRadio.checked = true;
      noRadio.dispatchEvent(new Event('change', { bubbles: true }));
      
      const hidden = detalleField.offsetParent === null;
      console.log('Campo oculto con "No":', hidden ? '✅' : '❌');
      
      // Seleccionar "Sí" - campo debería estar visible
      siRadio.checked = true;
      siRadio.dispatchEvent(new Event('change', { bubbles: true }));
      
      const visible = detalleField.offsetParent !== null;
      console.log('Campo visible con "Sí":', visible ? '✅' : '❌');
      
      results.conditionalField = hidden && visible;
    } else {
      console.log('❌ Campos de dificultad no encontrados');
    }
    
    // 6. Probar envío del formulario
    console.log('\n6️⃣ Probando envío del formulario...');
    const submitButton = document.querySelector('button[type="submit"]');
    
    if (submitButton) {
      // Interceptar fetch para capturar la petición
      const originalFetch = window.fetch;
      let requestCaptured = false;
      
      window.fetch = async (url, options) => {
        requestCaptured = true;
        console.log('📤 Petición capturada:', url);
        if (options && options.body) {
          const data = JSON.parse(options.body);
          console.log('📦 Datos enviados:', data);
        }
        
        // Simular respuesta exitosa
        return {
          ok: true,
          status: 200,
          json: async () => ({ success: true, message: 'Registro creado exitosamente' })
        };
      };
      
      // Llenar algunos campos básicos
      const fechaInput = document.querySelector('input[name="fecha"]');
      const consultasInput = document.querySelector('input[name="consultasRecibidas"]');
      
      if (fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];
      if (consultasInput) consultasInput.value = '5';
      
      // Hacer clic en enviar
      submitButton.click();
      
      // Esperar un momento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      results.formSubmission = requestCaptured;
      console.log('Envío del formulario:', results.formSubmission ? '✅' : '❌');
      
      // Restaurar fetch original
      window.fetch = originalFetch;
    } else {
      console.log('❌ Botón de envío no encontrado');
    }
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  }
  
  // Mostrar resultados
  console.log('\n📊 RESULTADOS DE LA PRUEBA RÁPIDA');
  console.log('=' .repeat(60));
  
  const testNames = {
    pageLoaded: 'Página cargada correctamente',
    formExists: 'Formulario existe',
    newFieldsExist: 'Campos nuevos presentes',
    dateValidation: 'Validación de fecha funciona',
    conditionalField: 'Campo condicional funciona',
    formSubmission: 'Envío del formulario funciona'
  };
  
  Object.entries(results).forEach(([key, passed]) => {
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testNames[key]}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Resultado: ${passedTests}/${totalTests} pruebas pasaron`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ¡EXCELENTE! Todas las pruebas pasaron. El sistema está funcionando perfectamente.');
    console.log('💡 Los nuevos campos de Tokko están correctamente implementados.');
  } else if (passedTests >= totalTests * 0.8) {
    console.log('👍 ¡MUY BIEN! La mayoría de las pruebas pasaron. El sistema está funcionando bien.');
    console.log('⚠️  Revisa las pruebas que fallaron para mejorar la funcionalidad.');
  } else {
    console.log('⚠️  ALGUNAS PRUEBAS FALLARON. Revisa la implementación de los nuevos campos.');
    console.log('💡 Asegúrate de que estés en la página correcta y que el código esté actualizado.');
  }
  
  return results;
}

// Ejecutar la prueba automáticamente
quickTest().then(results => {
  console.log('\n🔧 Para ejecutar pruebas más detalladas:');
  console.log('- Carga test-script.js para pruebas completas del formulario');
  console.log('- Carga test-api.js para pruebas de la API');
  console.log('- Carga test-integration.js para pruebas de integración');
  console.log('\n📖 Lee TESTING-GUIDE.md para más información');
});

// Exportar función para uso manual
window.quickTest = quickTest;

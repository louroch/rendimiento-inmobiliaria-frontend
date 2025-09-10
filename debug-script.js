/**
 * 🔍 SCRIPT DE DIAGNÓSTICO
 * 
 * Este script nos ayudará a identificar exactamente qué está pasando
 * con los nuevos campos y por qué no aparecen.
 */

console.log('🔍 INICIANDO DIAGNÓSTICO DEL SISTEMA');
console.log('=' .repeat(60));

// Función de diagnóstico
function debugSystem() {
  const results = {
    url: window.location.href,
    formFound: false,
    formFields: [],
    newFieldsStatus: {},
    errors: []
  };
  
  try {
    // 1. Verificar URL
    console.log('1️⃣ URL actual:', results.url);
    
    // 2. Buscar formulario
    const form = document.querySelector('form');
    results.formFound = form !== null;
    console.log('2️⃣ Formulario encontrado:', results.formFound ? '✅' : '❌');
    
    if (!results.formFound) {
      results.errors.push('No se encontró el formulario');
      return results;
    }
    
    // 3. Listar todos los campos del formulario
    console.log('3️⃣ Analizando campos del formulario...');
    const allInputs = form.querySelectorAll('input, textarea, select');
    results.formFields = Array.from(allInputs).map(input => ({
      name: input.name,
      type: input.type,
      id: input.id,
      className: input.className,
      placeholder: input.placeholder
    }));
    
    console.log('Campos encontrados en el formulario:');
    results.formFields.forEach(field => {
      console.log(`  - ${field.name} (${field.type})`);
    });
    
    // 4. Verificar campos nuevos específicamente
    console.log('4️⃣ Verificando campos nuevos...');
    const newFields = [
      'cantidadPropiedadesTokko',
      'linksTokko', 
      'dificultadTokko',
      'detalleDificultadTokko',
      'observaciones'
    ];
    
    newFields.forEach(fieldName => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      results.newFieldsStatus[fieldName] = {
        exists: field !== null,
        element: field,
        type: field ? field.type : null
      };
      
      console.log(`${fieldName}:`, field ? '✅' : '❌');
    });
    
    // 5. Verificar si hay sección de "Información adicional de Tokko"
    console.log('5️⃣ Verificando sección de Tokko...');
    const tokkoSection = form.querySelector('h3');
    const hasTokkoSection = tokkoSection && tokkoSection.textContent.includes('Tokko');
    console.log('Sección de Tokko:', hasTokkoSection ? '✅' : '❌');
    
    if (tokkoSection) {
      console.log('Título de sección:', tokkoSection.textContent);
    }
    
    // 6. Verificar estructura del DOM
    console.log('6️⃣ Analizando estructura del DOM...');
    const formHTML = form.innerHTML;
    const hasTokkoContent = formHTML.includes('cantidadPropiedadesTokko') || 
                           formHTML.includes('linksTokko') ||
                           formHTML.includes('dificultadTokko');
    console.log('Contenido de Tokko en HTML:', hasTokkoContent ? '✅' : '❌');
    
    // 7. Verificar si estamos en la página correcta
    console.log('7️⃣ Verificando página...');
    const isCorrectPage = results.url.includes('nuevo-registro') || 
                         results.url.includes('new-record') ||
                         results.url.includes('localhost:3000');
    console.log('Página correcta:', isCorrectPage ? '✅' : '❌');
    
    // 8. Verificar si hay errores de JavaScript
    console.log('8️⃣ Verificando errores...');
    const hasErrors = results.errors.length > 0;
    console.log('Errores encontrados:', hasErrors ? '❌' : '✅');
    if (hasErrors) {
      results.errors.forEach(error => console.log('  -', error));
    }
    
  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error);
    results.errors.push(error.message);
  }
  
  return results;
}

// Función para verificar si los cambios están desplegados
function checkDeployment() {
  console.log('\n🚀 VERIFICANDO DESPLIEGUE...');
  console.log('=' .repeat(40));
  
  // Verificar si el archivo NewRecord.tsx tiene los cambios
  const form = document.querySelector('form');
  if (!form) {
    console.log('❌ No se puede verificar - formulario no encontrado');
    return false;
  }
  
  const formHTML = form.innerHTML;
  const indicators = [
    'cantidadPropiedadesTokko',
    'Información adicional de Tokko',
    'dificultadTokko',
    'detalleDificultadTokko',
    'observaciones'
  ];
  
  const foundIndicators = indicators.filter(indicator => 
    formHTML.includes(indicator)
  );
  
  console.log('Indicadores encontrados:', foundIndicators.length, 'de', indicators.length);
  foundIndicators.forEach(indicator => console.log('  ✅', indicator));
  
  const missingIndicators = indicators.filter(indicator => 
    !formHTML.includes(indicator)
  );
  
  if (missingIndicators.length > 0) {
    console.log('Indicadores faltantes:');
    missingIndicators.forEach(indicator => console.log('  ❌', indicator));
  }
  
  const isDeployed = foundIndicators.length >= indicators.length * 0.8; // 80% de los indicadores
  console.log('Despliegue:', isDeployed ? '✅ COMPLETO' : '❌ INCOMPLETO');
  
  return isDeployed;
}

// Función para sugerir soluciones
function suggestSolutions(results) {
  console.log('\n💡 SUGERENCIAS DE SOLUCIÓN...');
  console.log('=' .repeat(40));
  
  if (!results.formFound) {
    console.log('1. Asegúrate de estar en la página correcta:');
    console.log('   - Ve a http://localhost:3000/nuevo-registro');
    console.log('   - O http://localhost:3000/new-record');
    return;
  }
  
  const newFieldsCount = Object.values(results.newFieldsStatus).filter(f => f.exists).length;
  
  if (newFieldsCount === 0) {
    console.log('2. Los nuevos campos no están presentes. Posibles causas:');
    console.log('   - Los cambios no se han desplegado correctamente');
    console.log('   - Hay un error en el código que impide que se rendericen');
    console.log('   - Estás viendo una versión en caché del sitio');
    
    console.log('\n3. Soluciones:');
    console.log('   a) Verifica que el archivo NewRecord.tsx tenga los cambios');
    console.log('   b) Reinicia el servidor de desarrollo (npm start)');
    console.log('   c) Limpia la caché del navegador (Ctrl+Shift+R)');
    console.log('   d) Verifica que no haya errores de compilación');
  } else if (newFieldsCount < 5) {
    console.log('4. Algunos campos están presentes pero no todos:');
    console.log('   - Verifica que todos los campos estén en el código');
    console.log('   - Revisa si hay errores de JavaScript que impidan el renderizado');
  } else {
    console.log('5. Todos los campos están presentes. El problema puede ser:');
    console.log('   - Error en la lógica de validación');
    console.log('   - Problema con el backend');
    console.log('   - Error en el envío de datos');
  }
}

// Ejecutar diagnóstico
const diagnosticResults = debugSystem();
const deploymentStatus = checkDeployment();
suggestSolutions(diagnosticResults);

// Mostrar resumen
console.log('\n📊 RESUMEN DEL DIAGNÓSTICO');
console.log('=' .repeat(60));
console.log('URL:', diagnosticResults.url);
console.log('Formulario encontrado:', diagnosticResults.formFound ? '✅' : '❌');
console.log('Campos nuevos presentes:', Object.values(diagnosticResults.newFieldsStatus).filter(f => f.exists).length, '/ 5');
console.log('Despliegue completo:', deploymentStatus ? '✅' : '❌');
console.log('Errores:', diagnosticResults.errors.length);

// Exportar para uso manual
window.debugSystem = debugSystem;
window.checkDeployment = checkDeployment;
window.suggestSolutions = suggestSolutions;

console.log('\n🔧 Funciones disponibles:');
console.log('- debugSystem() - Ejecutar diagnóstico completo');
console.log('- checkDeployment() - Verificar estado del despliegue');
console.log('- suggestSolutions() - Ver sugerencias de solución');

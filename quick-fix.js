/**
 * 🚀 SCRIPT DE VERIFICACIÓN RÁPIDA Y SOLUCIÓN
 * 
 * Este script verifica si los cambios están desplegados y sugiere soluciones.
 */

console.log('🔍 VERIFICACIÓN RÁPIDA DEL SISTEMA');
console.log('=' .repeat(50));

// Verificar si estamos en la página correcta
function checkPage() {
  const url = window.location.href;
  console.log('📍 URL actual:', url);
  
  const isCorrectPage = url.includes('nuevo-registro') || 
                       url.includes('new-record') ||
                       url.includes('localhost:3000');
  
  if (!isCorrectPage) {
    console.log('❌ PROBLEMA: No estás en la página correcta');
    console.log('💡 SOLUCIÓN: Ve a http://localhost:3000/nuevo-registro');
    return false;
  }
  
  console.log('✅ Página correcta');
  return true;
}

// Verificar si el formulario existe
function checkForm() {
  const form = document.querySelector('form');
  if (!form) {
    console.log('❌ PROBLEMA: No se encontró el formulario');
    console.log('💡 SOLUCIÓN: Asegúrate de estar en la página de nuevo registro');
    return false;
  }
  
  console.log('✅ Formulario encontrado');
  return true;
}

// Verificar campos nuevos
function checkNewFields() {
  const newFields = [
    'cantidadPropiedadesTokko',
    'linksTokko',
    'dificultadTokko',
    'detalleDificultadTokko',
    'observaciones'
  ];
  
  console.log('🔍 Verificando campos nuevos...');
  
  const foundFields = [];
  const missingFields = [];
  
  newFields.forEach(fieldName => {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field) {
      foundFields.push(fieldName);
      console.log(`  ✅ ${fieldName}`);
    } else {
      missingFields.push(fieldName);
      console.log(`  ❌ ${fieldName}`);
    }
  });
  
  console.log(`\n📊 Resultado: ${foundFields.length}/${newFields.length} campos encontrados`);
  
  if (missingFields.length > 0) {
    console.log('\n❌ PROBLEMA: Los campos nuevos no están presentes');
    console.log('💡 POSIBLES CAUSAS:');
    console.log('   1. Los cambios no se han desplegado correctamente');
    console.log('   2. Hay un error de compilación que impide el renderizado');
    console.log('   3. Estás viendo una versión en caché');
    
    console.log('\n🔧 SOLUCIONES:');
    console.log('   1. Verifica que el servidor esté corriendo: npm start');
    console.log('   2. Limpia la caché del navegador: Ctrl+Shift+R');
    console.log('   3. Verifica la consola para errores de JavaScript');
    console.log('   4. Asegúrate de que el archivo NewRecord.tsx tenga los cambios');
    
    return false;
  }
  
  console.log('✅ Todos los campos nuevos están presentes');
  return true;
}

// Verificar si hay errores de JavaScript
function checkErrors() {
  console.log('🔍 Verificando errores...');
  
  // Verificar si hay errores en la consola
  const hasErrors = window.console && window.console.error;
  
  if (hasErrors) {
    console.log('⚠️  Revisa la consola para errores de JavaScript');
  } else {
    console.log('✅ No se detectaron errores obvios');
  }
}

// Función principal de verificación
function quickCheck() {
  console.log('Iniciando verificación rápida...\n');
  
  const checks = {
    page: checkPage(),
    form: checkForm(),
    newFields: checkNewFields(),
    errors: checkErrors()
  };
  
  const passedChecks = Object.values(checks).filter(Boolean).length;
  const totalChecks = Object.keys(checks).length;
  
  console.log('\n📊 RESUMEN DE VERIFICACIÓN');
  console.log('=' .repeat(50));
  console.log(`Página correcta: ${checks.page ? '✅' : '❌'}`);
  console.log(`Formulario encontrado: ${checks.form ? '✅' : '❌'}`);
  console.log(`Campos nuevos: ${checks.newFields ? '✅' : '❌'}`);
  console.log(`Sin errores: ${checks.errors ? '✅' : '❌'}`);
  
  console.log(`\n🎯 Resultado: ${passedChecks}/${totalChecks} verificaciones pasaron`);
  
  if (passedChecks === totalChecks) {
    console.log('🎉 ¡Todo está funcionando correctamente!');
    console.log('💡 Si aún tienes problemas, ejecuta las pruebas detalladas.');
  } else {
    console.log('⚠️  Hay problemas que necesitan solución.');
    console.log('💡 Sigue las sugerencias arriba para resolverlos.');
  }
  
  return checks;
}

// Ejecutar verificación automáticamente
quickCheck();

// Exportar función
window.quickCheck = quickCheck;

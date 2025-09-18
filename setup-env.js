#!/usr/bin/env node

/**
 * Script para configurar las variables de entorno del frontend
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando variables de entorno para el frontend...\n');

const envContent = `# URL del backend API (Railway - Producción)
REACT_APP_BACKEND_URL=https://rendimiento-inmobiliaria-production.up.railway.app

# URL completa del API (Local - Desarrollo)
REACT_APP_API_URL=http://localhost:5000/api

# Configuración de entorno
REACT_APP_ENV=development
`;

try {
  // Verificar si ya existe un archivo .env
  if (fs.existsSync('.env')) {
    console.log('⚠️  El archivo .env ya existe. Creando backup...');
    fs.copyFileSync('.env', '.env.backup');
    console.log('✅ Backup creado como .env.backup');
  }
  
  // Crear el archivo .env
  fs.writeFileSync('.env', envContent);
  console.log('✅ Archivo .env creado exitosamente');
  
  // Verificar que se creó correctamente
  const createdContent = fs.readFileSync('.env', 'utf8');
  console.log('\n📄 Contenido del archivo .env:');
  console.log(createdContent);
  
  console.log('\n🎉 Configuración completada. Ahora puedes iniciar el servidor con: npm start');
  
} catch (error) {
  console.error('❌ Error creando el archivo .env:', error.message);
  process.exit(1);
}

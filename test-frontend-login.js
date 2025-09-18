#!/usr/bin/env node

/**
 * Script para probar el login del frontend simulando las peticiones del navegador
 */

const http = require('http');

console.log('🧪 Probando login del frontend...\n');

// Simular la petición que hace el frontend
function testFrontendLogin() {
  const loginData = JSON.stringify({
    email: 'agente1@inmobiliaria.com',
    password: 'TempPassword123!'
  });
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData),
      'Origin': 'http://localhost:3000', // Simular el origen del frontend
      'Referer': 'http://localhost:3000/'
    }
  };
  
  console.log('🔐 Probando login con agente1@inmobiliaria.com...');
  console.log(`📡 Enviando petición a: http://localhost:5000${options.path}`);
  console.log(`🌐 Origen: ${options.headers.Origin}`);
  
  const req = http.request(options, (res) => {
    let data = '';
    
    console.log(`📊 Status Code: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('\n📄 Respuesta del servidor:');
      try {
        const response = JSON.parse(data);
        console.log(JSON.stringify(response, null, 2));
        
        if (res.statusCode === 200) {
          console.log('\n✅ Login exitoso!');
          console.log(`👤 Usuario: ${response.user.name}`);
          console.log(`📧 Email: ${response.user.email}`);
          console.log(`🔑 Rol: ${response.user.role}`);
          console.log(`🎫 Token: ${response.token.substring(0, 30)}...`);
        } else {
          console.log('\n❌ Login falló');
        }
      } catch (error) {
        console.log('❌ Error parseando respuesta:', error.message);
        console.log('📄 Respuesta raw:', data);
      }
    });
  });
  
  req.on('error', (error) => {
    console.log('❌ Error en la petición:', error.message);
  });
  
  req.write(loginData);
  req.end();
}

// Probar también con admin
function testAdminLogin() {
  const loginData = JSON.stringify({
    email: 'rayuelaagenciadigital@gmail.com',
    password: 'rayuela2025violeta**'
  });
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData),
      'Origin': 'http://localhost:3000',
      'Referer': 'http://localhost:3000/'
    }
  };
  
  console.log('\n🔐 Probando login con admin...');
  
  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (res.statusCode === 200) {
          console.log('✅ Login de admin exitoso!');
          console.log(`👤 Usuario: ${response.user.name}`);
          console.log(`🔑 Rol: ${response.user.role}`);
        } else {
          console.log('❌ Login de admin falló');
        }
      } catch (error) {
        console.log('❌ Error parseando respuesta de admin:', error.message);
      }
    });
  });
  
  req.on('error', (error) => {
    console.log('❌ Error en petición de admin:', error.message);
  });
  
  req.write(loginData);
  req.end();
}

// Ejecutar pruebas
testFrontendLogin();
setTimeout(testAdminLogin, 2000);

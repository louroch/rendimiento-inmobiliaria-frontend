#!/usr/bin/env node

/**
 * Script de prueba para verificar la conectividad del frontend con el backend
 */

const https = require('https');
const http = require('http');

console.log('🧪 Probando conectividad del frontend con el backend...\n');

// URLs a probar
const urls = [
  'http://localhost:5000/api/health',
  'https://rendimiento-inmobiliaria-production.up.railway.app/api/health',
  'http://localhost:5000/api/auth/login'
];

async function testUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    
    console.log(`🔍 Probando: ${url}`);
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ ${url} - Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
          console.log(`   Respuesta: ${data.substring(0, 100)}...`);
        }
        resolve({ url, status: res.statusCode, data });
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ ${url} - Error: ${error.message}`);
      resolve({ url, status: 'ERROR', error: error.message });
    });
    
    req.setTimeout(5000, () => {
      console.log(`⏰ ${url} - Timeout`);
      req.destroy();
      resolve({ url, status: 'TIMEOUT' });
    });
  });
}

async function testLogin() {
  console.log('\n🔐 Probando login con agente...');
  
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
      'Content-Length': Buffer.byteLength(loginData)
    }
  };
  
  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Login - Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
          const response = JSON.parse(data);
          console.log(`   Usuario: ${response.user.name} (${response.user.role})`);
          console.log(`   Token: ${response.token.substring(0, 20)}...`);
        } else {
          console.log(`   Error: ${data}`);
        }
        resolve({ status: res.statusCode, data });
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Login - Error: ${error.message}`);
      resolve({ status: 'ERROR', error: error.message });
    });
    
    req.write(loginData);
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Iniciando pruebas de conectividad...\n');
  
  // Probar URLs de salud
  for (const url of urls) {
    await testUrl(url);
  }
  
  // Probar login
  await testLogin();
  
  console.log('\n📊 Resumen de pruebas completado');
}

runTests().catch(console.error);

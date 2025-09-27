// Script de prueba para verificar la exportación a PDF
// Ejecutar con: node test-pdf-export.js

const axios = require('axios');

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function testPDFExport() {
  console.log('🧪 Probando exportación a PDF...');
  console.log(`📍 URL base: ${API_BASE}`);
  
  try {
    // Primero, probar el endpoint de exportación con formato JSON
    console.log('\n1️⃣ Probando endpoint de exportación JSON...');
    const jsonResponse = await axios.get(`${API_BASE}/reports/export?format=json`, {
      timeout: 10000
    });
    
    if (jsonResponse.data.success) {
      console.log('✅ Endpoint JSON funcionando correctamente');
      console.log(`📊 Total agentes: ${jsonResponse.data.data.metadata.totalAgents}`);
      console.log(`📋 Total registros: ${jsonResponse.data.data.metadata.totalRecords}`);
    }
    
    // Luego, probar el endpoint de exportación PDF
    console.log('\n2️⃣ Probando endpoint de exportación PDF...');
    const pdfResponse = await axios.get(`${API_BASE}/reports/export?format=pdf&templateType=dashboard`, {
      responseType: 'blob',
      timeout: 60000,
      headers: {
        'Accept': 'application/pdf, application/octet-stream'
      }
    });
    
    if (pdfResponse.data && pdfResponse.data.size > 0) {
      console.log('✅ Endpoint PDF funcionando correctamente');
      console.log(`📄 Tamaño del PDF: ${(pdfResponse.data.size / 1024).toFixed(2)} KB`);
      
      // Verificar que el contenido sea realmente un PDF
      const buffer = Buffer.from(await pdfResponse.data.arrayBuffer());
      const isPDF = buffer.toString('ascii', 0, 4) === '%PDF';
      
      if (isPDF) {
        console.log('✅ El archivo generado es un PDF válido');
      } else {
        console.log('❌ El archivo generado NO es un PDF válido');
      }
    } else {
      console.log('❌ El PDF generado está vacío');
    }
    
    // Probar diferentes tipos de template
    console.log('\n3️⃣ Probando diferentes templates...');
    const templates = ['dashboard', 'summary', 'trends'];
    
    for (const template of templates) {
      try {
        console.log(`   Probando template: ${template}`);
        const response = await axios.get(`${API_BASE}/reports/export?format=pdf&templateType=${template}`, {
          responseType: 'blob',
          timeout: 30000,
          headers: {
            'Accept': 'application/pdf, application/octet-stream'
          }
        });
        
        if (response.data && response.data.size > 0) {
          console.log(`   ✅ Template ${template}: ${(response.data.size / 1024).toFixed(2)} KB`);
        } else {
          console.log(`   ❌ Template ${template}: PDF vacío`);
        }
      } catch (error) {
        console.log(`   ❌ Template ${template}: Error - ${error.message}`);
      }
    }
    
    console.log('\n🎉 Pruebas completadas exitosamente!');
    
  } catch (error) {
    console.error('\n❌ Error en las pruebas:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Sugerencia: Verifica que el backend esté ejecutándose en http://localhost:5000');
    } else if (error.response) {
      console.log(`📊 Status: ${error.response.status}`);
      console.log(`📝 Mensaje: ${error.response.statusText}`);
    }
  }
}

// Ejecutar las pruebas
testPDFExport();

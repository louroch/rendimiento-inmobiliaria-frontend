# 🧪 Guía de Pruebas del Sistema de Rendimiento Inmobiliario

Esta guía te ayudará a probar completamente el sistema de rendimiento inmobiliario, incluyendo el formulario actualizado con los nuevos campos de Tokko.

## 📋 Índice

1. [Preparación](#preparación)
2. [Scripts de Prueba Disponibles](#scripts-de-prueba-disponibles)
3. [Cómo Ejecutar las Pruebas](#cómo-ejecutar-las-pruebas)
4. [Qué Verifican las Pruebas](#qué-verifican-las-pruebas)
5. [Solución de Problemas](#solución-de-problemas)
6. [Interpretación de Resultados](#interpretación-de-resultados)

## 🚀 Preparación

### Requisitos Previos

1. **Frontend corriendo**: Asegúrate de que el frontend esté ejecutándose en `http://localhost:3000`
2. **Backend corriendo**: Asegúrate de que el backend esté ejecutándose en `http://localhost:5000`
3. **Navegador**: Usa Chrome, Firefox, Safari o Edge (versiones recientes)
4. **Página correcta**: Navega a la página de "Nuevo Registro"

### Pasos de Preparación

```bash
# 1. Iniciar el frontend
cd rendimiento-inmobiliaria-frontend
npm start

# 2. En otra terminal, iniciar el backend
cd rendimiento-inmobiliaria-backend
npm start
```

## 📁 Scripts de Prueba Disponibles

### 1. `test-script.js` - Pruebas del Formulario
- **Propósito**: Probar la funcionalidad del formulario de nuevo registro
- **Incluye**: Validación de campos, lógica condicional, envío de datos
- **Uso**: Ejecutar en la consola del navegador

### 2. `test-api.js` - Pruebas de la API
- **Propósito**: Probar la integración con el backend
- **Incluye**: Creación, lectura, actualización de registros
- **Uso**: Ejecutar en la consola del navegador

### 3. `test-integration.js` - Pruebas de Integración
- **Propósito**: Pruebas end-to-end completas
- **Incluye**: Flujo completo de usuario, rendimiento, compatibilidad
- **Uso**: Ejecutar en la consola del navegador

## 🎯 Cómo Ejecutar las Pruebas

### Método 1: Consola del Navegador (Recomendado)

1. **Abrir la consola del navegador**:
   - Chrome/Edge: `F12` o `Ctrl+Shift+I`
   - Firefox: `F12` o `Ctrl+Shift+K`
   - Safari: `Cmd+Option+I`

2. **Navegar a la página de Nuevo Registro**:
   ```
   http://localhost:3000/nuevo-registro
   ```

3. **Cargar el script de prueba**:
   ```javascript
   // Copia y pega el contenido de test-script.js
   // Luego ejecuta:
   testSistemaRendimiento()
   ```

### Método 2: Cargar desde Archivo

1. **Crear un archivo HTML temporal**:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <title>Pruebas del Sistema</title>
   </head>
   <body>
       <h1>Pruebas del Sistema de Rendimiento</h1>
       <button onclick="loadTestScript()">Cargar Script de Pruebas</button>
       <div id="results"></div>
       
       <script>
       async function loadTestScript() {
           const response = await fetch('test-script.js');
           const script = await response.text();
           eval(script);
           testSistemaRendimiento();
       }
       </script>
   </body>
   </html>
   ```

2. **Abrir el archivo en el navegador**

### Método 3: Usando Node.js (Para pruebas de API)

```bash
# Instalar dependencias
npm install node-fetch

# Crear archivo de prueba
node test-api-node.js
```

## 🔍 Qué Verifican las Pruebas

### Pruebas del Formulario (`test-script.js`)

#### ✅ Campos Nuevos Existen
- Verifica que todos los 5 nuevos campos estén presentes
- Campos verificados:
  - `cantidadPropiedadesTokko`
  - `linksTokko`
  - `dificultadTokko` (radio buttons)
  - `detalleDificultadTokko` (condicional)
  - `observaciones`

#### ✅ Validación de Fecha
- Verifica que no se puedan seleccionar fechas pasadas
- Prueba la restricción `min={today}`

#### ✅ Llenado de Formulario
- Simula el llenado completo del formulario
- Verifica que todos los campos acepten datos

#### ✅ Campo Condicional
- Prueba que el campo de detalle aparezca solo cuando se selecciona "Sí"
- Verifica que se oculte cuando se selecciona "No"

#### ✅ Envío de Formulario
- Intercepta la petición HTTP
- Verifica que los datos se envíen correctamente
- Confirma que se use el endpoint correcto (`/performance`)

### Pruebas de la API (`test-api.js`)

#### ✅ Disponibilidad del Backend
- Verifica que el backend esté corriendo
- Prueba la conectividad

#### ✅ Creación de Registros
- Prueba crear un nuevo registro con todos los campos
- Verifica que los datos se guarden correctamente

#### ✅ Obtención de Registros
- Prueba obtener la lista de registros
- Verifica que incluyan los nuevos campos

#### ✅ Actualización de Registros
- Prueba actualizar un registro existente
- Verifica que los cambios se guarden

#### ✅ Estructura de Respuesta
- Verifica que la respuesta tenga la estructura correcta
- Confirma tipos de datos apropiados

### Pruebas de Integración (`test-integration.js`)

#### ✅ Entorno Completo
- Verifica que estemos en la página correcta
- Confirma que todos los elementos estén presentes

#### ✅ Flujo de Usuario
- Simula una interacción completa del usuario
- Prueba el flujo end-to-end

#### ✅ Validación de Datos
- Verifica validaciones de fecha
- Confirma campos requeridos
- Prueba tipos de datos

#### ✅ Rendimiento
- Mide el tiempo de interacción
- Verifica que el formulario sea responsivo

#### ✅ Compatibilidad del Navegador
- Verifica características modernas de JavaScript
- Confirma soporte para async/await, fetch, etc.

## 🛠️ Solución de Problemas

### Error: "Backend no disponible"
```javascript
// Verificar que el backend esté corriendo
fetch('http://localhost:5000/health')
  .then(response => console.log('Backend OK:', response.ok))
  .catch(error => console.log('Backend Error:', error));
```

### Error: "Campos nuevos no encontrados"
```javascript
// Verificar que estés en la página correcta
console.log('URL actual:', window.location.href);
console.log('Formulario encontrado:', document.querySelector('form') !== null);
```

### Error: "Fetch no está definido"
```javascript
// Verificar compatibilidad del navegador
console.log('Fetch disponible:', typeof fetch !== 'undefined');
console.log('Promises disponibles:', typeof Promise !== 'undefined');
```

### Error: "Script no se ejecuta"
1. Verifica que no haya errores de sintaxis en la consola
2. Asegúrate de que estés en la página correcta
3. Intenta recargar la página y ejecutar nuevamente

## 📊 Interpretación de Resultados

### Resultados Exitosos ✅
```
🎯 Resultado: 8/8 pruebas pasaron
🎉 ¡Todas las pruebas pasaron! El sistema está funcionando correctamente.
```

### Resultados con Errores ❌
```
🎯 Resultado: 6/8 pruebas pasaron
⚠️  Algunas pruebas fallaron. Revisa los errores arriba.
```

### Códigos de Estado
- **✅**: Prueba exitosa
- **❌**: Prueba falló
- **⚠️**: Advertencia (no crítico)
- **🧪**: Prueba en progreso

## 🎯 Casos de Uso Específicos

### Probar Solo el Formulario
```javascript
// Cargar test-script.js y ejecutar:
testFormulario()
```

### Probar Solo la API
```javascript
// Cargar test-api.js y ejecutar:
testAPI()
```

### Probar Todo el Sistema
```javascript
// Cargar test-integration.js y ejecutar:
runAllTests()
```

## 📈 Métricas de Rendimiento

### Tiempos Esperados
- **Llenado de formulario**: < 2 segundos
- **Envío de datos**: < 1 segundo
- **Carga de página**: < 3 segundos
- **Interacción condicional**: < 500ms

### Indicadores de Éxito
- Todas las pruebas pasan (8/8)
- Tiempo de respuesta < 5 segundos
- Sin errores en la consola
- Datos se envían correctamente al backend

## 🔄 Pruebas Automatizadas

### Para Desarrollo Continuo
```bash
# Crear script de automatización
echo "#!/bin/bash
echo 'Iniciando pruebas...'
# Aquí puedes agregar comandos para ejecutar las pruebas
" > run-tests.sh

chmod +x run-tests.sh
./run-tests.sh
```

### Para CI/CD
```yaml
# Ejemplo para GitHub Actions
- name: Run Frontend Tests
  run: |
    npm start &
    sleep 10
    # Ejecutar pruebas automatizadas
```

## 📞 Soporte

Si encuentras problemas con las pruebas:

1. **Verifica la consola** del navegador para errores
2. **Confirma que ambos servidores** estén corriendo
3. **Revisa la configuración** de URLs en los scripts
4. **Ejecuta las pruebas paso a paso** para identificar el problema

---

**¡Las pruebas están listas para usar!** 🚀

Ejecuta `testSistemaRendimiento()` en la consola del navegador para comenzar.

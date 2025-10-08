# ✅ Checklist de Verificación - Modo Mantenimiento

Use este checklist para verificar que el modo mantenimiento funciona correctamente.

## 📋 Verificación Pre-Activación

- [ ] El sistema está funcionando normalmente
- [ ] Los agentes pueden acceder a sus páginas
- [ ] Los administradores pueden acceder al panel de admin
- [ ] Tienes acceso a Vercel Dashboard

## 🔴 Activación del Modo Mantenimiento

### Paso 1: Configurar Variable
- [ ] Ingresé a https://vercel.com
- [ ] Abrí el proyecto: `rendimiento-inmobiliaria-frontend`
- [ ] Fui a **Settings** → **Environment Variables**
- [ ] Hice click en **Add New**
- [ ] Agregué:
  - Key: `REACT_APP_MAINTENANCE_MODE`
  - Value: `true`
  - Environment: **Production** ✓
- [ ] Hice click en **Save**

### Paso 2: Redeploy
- [ ] Fui a **Deployments**
- [ ] Encontré el último deployment (el de arriba)
- [ ] Hice click en (...) a la derecha
- [ ] Seleccioné **Redeploy**
- [ ] Confirmé haciendo click en **Redeploy** nuevamente
- [ ] Esperé 1-2 minutos hasta ver "Ready"

### Paso 3: Verificar Deployment
- [ ] El status del deployment muestra "Ready" ✓
- [ ] No hay errores en el build
- [ ] El deployment se completó exitosamente

## 🧪 Pruebas de Funcionamiento

### Prueba 1: Acceso de Agente
- [ ] Abrí el sitio en una ventana privada/incógnito
- [ ] Ingresé con credenciales de un **agente**
- [ ] Veo el mensaje: "Sistema Temporalmente Desactivado" ✓
- [ ] Veo el ícono de candado 🔒
- [ ] El mensaje explica que el sistema está fuera de servicio
- [ ] El diseño se ve bien (centrado, con colores correctos)

### Prueba 2: Acceso de Administrador
- [ ] Abrí el sitio en otra ventana/pestaña
- [ ] Ingresé con credenciales de **administrador**
- [ ] Puedo acceder al dashboard de admin ✓
- [ ] Todas las funciones de admin funcionan normalmente
- [ ] Puedo navegar por todas las secciones de admin

### Prueba 3: Navegación del Agente
- [ ] Intenté acceder directamente a `/nuevo-registro` como agente
- [ ] Sigo viendo el mensaje de mantenimiento ✓
- [ ] No puedo acceder a ninguna página del sistema como agente
- [ ] El sistema me mantiene en la página de mantenimiento

## 🟢 Desactivación del Modo Mantenimiento

### Paso 1: Modificar Variable
- [ ] Fui a **Settings** → **Environment Variables** en Vercel
- [ ] Busqué `REACT_APP_MAINTENANCE_MODE`
- [ ] Hice click en el ícono de editar (lápiz)
- [ ] Cambié el valor a: `false`
- [ ] Guardé los cambios

### Paso 2: Redeploy
- [ ] Fui a **Deployments**
- [ ] Hice click en (...) del último deployment
- [ ] Seleccioné **Redeploy**
- [ ] Esperé a que se complete

### Paso 3: Verificar Restauración
- [ ] El deployment se completó
- [ ] Ingresé como **agente**
- [ ] Puedo acceder a todas las páginas normalmente ✓
- [ ] Puedo crear registros
- [ ] El sistema funciona como antes

## 🔍 Verificaciones Adicionales

### Cache del Navegador
Si un agente no ve los cambios:
- [ ] Pedí que recargue con: `Ctrl + Shift + R` (Windows)
- [ ] O con: `Cmd + Shift + R` (Mac)
- [ ] El cambio se reflejó correctamente

### Sesiones Activas
- [ ] Las sesiones activas ven el cambio al recargar/navegar
- [ ] No es necesario hacer logout/login

### Múltiples Agentes
- [ ] Probé con al menos 2 cuentas de agentes diferentes
- [ ] Ambos ven el mensaje de mantenimiento cuando está activado
- [ ] Ambos recuperan acceso cuando se desactiva

## ❌ Solución de Problemas

Si algo no funciona, verificar:

- [ ] La variable es exactamente: `REACT_APP_MAINTENANCE_MODE`
- [ ] El valor es exactamente: `true` o `false` (minúsculas)
- [ ] Se hizo **Redeploy** después de cambiar la variable
- [ ] Se esperó al menos 2 minutos completos
- [ ] Se recargó la página con Ctrl+Shift+R
- [ ] No hay errores en la consola del navegador (F12)

## 📊 Estado Actual

**Fecha de Verificación:** ___________________

**Verificado por:** ___________________

**Estado del Modo Mantenimiento:**
- [ ] Activado correctamente ✓
- [ ] Desactivado correctamente ✓
- [ ] Funcionando como se esperaba ✓

**Notas adicionales:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

## 🎉 Confirmación Final

- [ ] El modo mantenimiento funciona perfectamente
- [ ] Puedo activarlo cuando sea necesario
- [ ] Puedo desactivarlo cuando quiera volver a usar el sistema
- [ ] Los administradores siempre tienen acceso
- [ ] Los agentes ven un mensaje claro y profesional

**✅ Sistema de Modo Mantenimiento: OPERATIVO**


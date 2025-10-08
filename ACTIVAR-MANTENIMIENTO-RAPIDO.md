# ⚡ Guía Rápida: Activar Modo Mantenimiento

## 🚀 Activación Inmediata en Vercel (Producción)

### Paso 1: Ir a Vercel
1. Ingresa a [vercel.com](https://vercel.com)
2. Selecciona tu proyecto: `rendimiento-inmobiliaria-frontend`

### Paso 2: Agregar Variable de Entorno
1. Click en **Settings** (en el menú superior)
2. Click en **Environment Variables** (menú lateral izquierdo)
3. Click en **Add New**
4. Completa:
   ```
   Key:   REACT_APP_MAINTENANCE_MODE
   Value: true
   ```
5. Selecciona **Production** (y todos los ambientes donde quieras activarlo)
6. Click en **Save**

### Paso 3: Redeploy
1. Click en **Deployments** (en el menú superior)
2. Busca el último deployment (el de arriba)
3. Click en los 3 puntos (...) al lado derecho
4. Click en **Redeploy**
5. Confirma haciendo click en **Redeploy** nuevamente
6. Espera 1-2 minutos a que termine el deployment

### ✅ Listo!
Los agentes ahora verán el mensaje de sistema desactivado.
Los administradores seguirán teniendo acceso normal.

---

## 🔄 Desactivar Modo Mantenimiento (Cuando Quieran Volver a Usarlo)

1. Ve a **Settings** → **Environment Variables** en Vercel
2. Busca `REACT_APP_MAINTENANCE_MODE`
3. Click en el ícono de editar (lápiz)
4. Cambia el valor a: `false`
5. Click en **Save**
6. Ve a **Deployments** y haz **Redeploy** del último deployment
7. Espera a que termine el deployment

---

## 📝 Notas
- **IMPORTANTE:** Siempre hacer el Redeploy después de cambiar variables de entorno
- Los cambios NO son instantáneos, toma 1-2 minutos
- Si un agente no ve el cambio, que recargue con Ctrl+Shift+R (o Cmd+Shift+R en Mac)

## 📖 Documentación Completa
Para más detalles, ver: `MODO-MANTENIMIENTO.md`


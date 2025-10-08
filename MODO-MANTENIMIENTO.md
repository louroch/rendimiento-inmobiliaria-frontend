# 🔧 Modo Mantenimiento - Sistema de Rendimiento Inmobiliaria

## ¿Qué es el Modo Mantenimiento?

El modo mantenimiento permite desactivar temporalmente el acceso de los agentes al sistema, mostrándoles un mensaje informativo. Los administradores mantienen acceso completo para gestionar el sistema.

## 📋 Cómo Activar el Modo Mantenimiento

### Para Desarrollo Local:

1. Localiza o crea el archivo `.env` en la raíz del proyecto (si no existe, copia `env.example` y renómbralo a `.env`)

2. Agrega o modifica la siguiente línea:
   ```
   REACT_APP_MAINTENANCE_MODE=true
   ```

3. Reinicia el servidor de desarrollo:
   ```bash
   npm start
   ```

### Para Producción (Vercel):

1. Ve a tu proyecto en Vercel Dashboard

2. Navega a: **Settings** → **Environment Variables**

3. Agrega una nueva variable de entorno:
   - **Key:** `REACT_APP_MAINTENANCE_MODE`
   - **Value:** `true`
   - **Environment:** Production (o el ambiente que desees)

4. Guarda los cambios

5. Ve a la pestaña **Deployments** y haz clic en el botón de los tres puntos (...) del último deployment → **Redeploy**

6. Espera a que el deployment se complete (aproximadamente 1-2 minutos)

## ✅ Cómo Desactivar el Modo Mantenimiento

### Para Desarrollo Local:

1. Abre el archivo `.env`

2. Cambia el valor a:
   ```
   REACT_APP_MAINTENANCE_MODE=false
   ```

3. Reinicia el servidor de desarrollo

### Para Producción (Vercel):

1. Ve a **Settings** → **Environment Variables** en Vercel

2. Busca la variable `REACT_APP_MAINTENANCE_MODE`

3. Edita el valor a `false` o elimina la variable completamente

4. Haz un **Redeploy** del último deployment

5. Espera a que se complete el deployment

## 🎯 Comportamiento del Sistema

### Cuando el Modo Mantenimiento está ACTIVADO:
- ✅ **Administradores:** Acceso completo a todas las funciones
- ⛔ **Agentes:** Ven un mensaje informativo de sistema desactivado
- 🔒 Los agentes NO pueden acceder a ninguna página del sistema

### Cuando el Modo Mantenimiento está DESACTIVADO:
- ✅ **Todos los usuarios:** Acceso normal según sus permisos

## 📱 Mensaje que Verán los Agentes

Cuando el modo mantenimiento esté activado, los agentes verán una pantalla con:
- Un icono de candado
- Título: "Sistema Temporalmente Desactivado"
- Mensaje explicativo de que el sistema está fuera de servicio
- Sugerencia de contactar al administrador

## 🔍 Verificar el Estado Actual

### En Desarrollo:
Revisa el archivo `.env` y busca la línea `REACT_APP_MAINTENANCE_MODE`

### En Producción:
1. Ve a Vercel Dashboard
2. **Settings** → **Environment Variables**
3. Busca `REACT_APP_MAINTENANCE_MODE`
4. Si el valor es `true`, el modo está activo
5. Si no existe o es `false`, el modo está inactivo

## ⚠️ Notas Importantes

1. **Reinicio Requerido:** Después de cambiar la variable de entorno en desarrollo local, DEBES reiniciar el servidor

2. **Redeploy en Producción:** En Vercel, los cambios en variables de entorno NO se aplican automáticamente. DEBES hacer un redeploy

3. **Caché del Navegador:** Si los agentes no ven los cambios inmediatamente, pídeles que hagan:
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

4. **Sesiones Activas:** Los usuarios que ya estén logueados verán el mensaje de mantenimiento la próxima vez que naveguen a otra página o recarguen el navegador

## 📞 Soporte

Si tienes problemas para activar/desactivar el modo mantenimiento:
1. Verifica que el valor sea exactamente `true` o `false` (en minúsculas)
2. Asegúrate de haber reiniciado/redeployado después del cambio
3. Revisa la consola del navegador por posibles errores

---

**Última actualización:** Octubre 2025


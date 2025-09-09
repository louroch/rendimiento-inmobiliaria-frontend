# Frontend - Sistema de Monitoreo de Desempeño Inmobiliario

Aplicación React para el sistema de monitoreo de desempeño inmobiliario.

## 🚀 Deploy en Vercel

### 1. Preparar el repositorio
```bash
# Clonar solo el directorio frontend
git clone <repo-url> frontend-repo
cd frontend-repo
```

### 2. Configurar variables de entorno en Vercel
- `REACT_APP_BACKEND_URL`: https://rendimiento-inmobiliaria-production.up.railway.app
- `REACT_APP_API_URL`: https://rendimiento-inmobiliaria-production.up.railway.app/api

**Nota**: Las variables de entorno ya están configuradas en el código para usar Railway por defecto en producción.

### 3. Deploy automático
Vercel detectará automáticamente el `package.json` y desplegará la aplicación React.

### 4. Configuración de dominio
Vercel asignará automáticamente un dominio. Puedes configurar un dominio personalizado en la configuración del proyecto.

## 🔧 Desarrollo local

```bash
npm install
npm start
```

La aplicación se ejecutará en `http://localhost:3000`

## 📋 Características

- Dashboard de administrador
- Dashboard de asesor
- Gestión de usuarios
- Registro de desempeño
- Gráficos y estadísticas
- Recomendaciones con IA (Gemini)
- Autenticación JWT
- Diseño responsive con Tailwind CSS

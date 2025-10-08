# ⚡ INICIO RÁPIDO - Modo Mantenimiento

## 🔴 ACTIVAR (Bloquear Agentes)

1. Ir a → https://vercel.com
2. Tu proyecto → **Settings** → **Environment Variables**
3. **Add New** →
   ```
   REACT_APP_MAINTENANCE_MODE = true
   ```
4. **Save**
5. **Deployments** → (...) → **Redeploy**
6. Esperar 2 minutos

✅ **LISTO** - Los agentes verán el mensaje de sistema desactivado

---

## 🟢 DESACTIVAR (Permitir Agentes)

1. Vercel → **Settings** → **Environment Variables**
2. Buscar `REACT_APP_MAINTENANCE_MODE`
3. Editar → Cambiar a `false`
4. **Save**
5. **Deployments** → (...) → **Redeploy**
6. Esperar 2 minutos

✅ **LISTO** - Los agentes vuelven a tener acceso

---

## ℹ️ Importante

- **SIEMPRE** hacer Redeploy después de cambiar
- Espera 2 minutos completos
- Si no ves el cambio: Recargar con `Ctrl+Shift+R`

---

## 👥 ¿Qué pasa con cada rol?

| Rol | Modo Activado | Modo Desactivado |
|-----|---------------|------------------|
| **Admin** | ✅ Acceso total | ✅ Acceso total |
| **Agente** | ⛔ Ve mensaje | ✅ Acceso normal |

---

**Documentación completa:** Ver `MODO-MANTENIMIENTO.md`


# Script para activar el modo "Dado de Baja" localmente

Write-Host "════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ACTIVANDO MODO 'DADO DE BAJA' PARA AGENTES" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Crear archivo .env.local
$envContent = @"
# Configuración local
REACT_APP_BACKEND_URL=https://rendimiento-inmobiliaria-production.up.railway.app
REACT_APP_API_URL=https://rendimiento-inmobiliaria-production.up.railway.app/api

# MODO DADO DE BAJA ACTIVADO
REACT_APP_MAINTENANCE_MODE=true
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host "✅ Archivo .env.local creado" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANTE:" -ForegroundColor Yellow
Write-Host "1. Detén el servidor si está corriendo (Ctrl+C)" -ForegroundColor White
Write-Host "2. Ejecuta: npm start" -ForegroundColor White
Write-Host "3. Ingresa con un usuario AGENTE" -ForegroundColor White
Write-Host "4. Deberías ver el cartel 'Sistema Dado de Baja'" -ForegroundColor White
Write-Host ""
Write-Host "Los ADMIN seguirán teniendo acceso normal" -ForegroundColor Cyan
Write-Host ""
Write-Host "════════════════════════════════════════════════" -ForegroundColor Cyan


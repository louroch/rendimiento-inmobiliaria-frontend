# Script para desactivar el modo "Dado de Baja"

Write-Host "════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  DESACTIVANDO MODO 'DADO DE BAJA'" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Crear archivo .env.local con modo desactivado
$envContent = @"
# Configuración local
REACT_APP_BACKEND_URL=https://rendimiento-inmobiliaria-production.up.railway.app
REACT_APP_API_URL=https://rendimiento-inmobiliaria-production.up.railway.app/api

# MODO DADO DE BAJA DESACTIVADO
REACT_APP_MAINTENANCE_MODE=false
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host "✅ Modo desactivado en .env.local" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANTE:" -ForegroundColor Yellow
Write-Host "1. Detén el servidor si está corriendo (Ctrl+C)" -ForegroundColor White
Write-Host "2. Ejecuta: npm start" -ForegroundColor White
Write-Host "3. Todo volverá a funcionar normal" -ForegroundColor White
Write-Host ""
Write-Host "════════════════════════════════════════════════" -ForegroundColor Cyan


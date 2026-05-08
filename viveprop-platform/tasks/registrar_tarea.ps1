# Ejecutar como Administrador:
# Click derecho sobre este archivo → "Ejecutar con PowerShell"

$taskName = "ViveProp - Actualizar Stock Secundario"
$batPath  = "C:\AI\viveprop_web\viveprop-platform\tasks\actualizar_stock.bat"

$action   = New-ScheduledTaskAction -Execute $batPath
$trigger  = New-ScheduledTaskTrigger -Daily -At "06:00AM"
$settings = New-ScheduledTaskSettingsSet `
    -StartWhenAvailable `
    -RunOnlyIfNetworkAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 10)

Register-ScheduledTask `
    -TaskName  $taskName `
    -Action    $action `
    -Trigger   $trigger `
    -Settings  $settings `
    -RunLevel  Highest `
    -Force

Write-Host ""
Write-Host "Tarea registrada: $taskName" -ForegroundColor Green
Write-Host "Corre diariamente a las 06:00 AM"
Write-Host ""
Write-Host "Para verificar: Programador de Tareas > Biblioteca > ViveProp"
pause

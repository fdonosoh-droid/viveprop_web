@echo off
echo Actualizando condiciones comerciales...
cd /d "C:\AI\viveprop_web\viveprop-platform"

echo [1/2] Sincronizando desde condiciones comerciales.xlsx...
python tools\cc_sync.py
if %errorlevel% neq 0 (
    echo ERROR en cc_sync.py
    pause
    exit /b 1
)
echo.

echo [2/2] Generando cc.json...
python tools\cc_importer.py
if %errorlevel% neq 0 (
    echo ERROR al generar cc.json
    pause
    exit /b 1
)
echo.
echo Haciendo commit y push...
git add frontend/public/data/cc.json data/cc_data.js
git diff --cached --quiet && (echo Sin cambios en CC && goto fin)
git commit -m "chore: actualiza condiciones comerciales %date:~6,4%-%date:~3,2%-%date:~0,2%"
git push
echo.
echo Listo. Vercel desplegara automaticamente.
:fin
pause

@echo off
echo Actualizando condiciones comerciales...
cd /d "C:\AI\viveprop_web\viveprop-platform"
C:\Python314\python.exe tools\cc_importer.py
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

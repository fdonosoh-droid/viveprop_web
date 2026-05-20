@echo off
echo Actualizando proyectos y stock primario...
cd /d "C:\AI\viveprop_web\viveprop-platform"

echo.
echo Paso 1: Copiando fotos y generando fotos_pri.json...
C:\Python314\python.exe tools\copy_portadas.py
if %errorlevel% neq 0 (
    echo ERROR en copy_portadas.py
    pause
    exit /b 1
)

echo.
echo Paso 2: Generando projects.json...
C:\Python314\python.exe tools\access_to_projects.py
if %errorlevel% neq 0 (
    echo ERROR al generar projects.json
    pause
    exit /b 1
)

echo.
echo Haciendo commit y push...
git add frontend/public/data/projects.json data/projects.js frontend/public/data/fotos_pri.json frontend/public/photos/pri/
git diff --cached --quiet && (echo Sin cambios && goto fin)
git commit -m "chore: actualiza stock primario %date:~6,4%-%date:~3,2%-%date:~0,2%"
git push
echo.
echo Listo. Vercel desplegara automaticamente.
:fin
pause

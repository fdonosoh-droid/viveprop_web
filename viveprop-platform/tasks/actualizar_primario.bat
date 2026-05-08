@echo off
echo Actualizando proyectos y stock primario...
cd /d "C:\AI\viveprop_web\viveprop-platform"
C:\Python314\python.exe tools\access_to_projects.py
if %errorlevel% neq 0 (
    echo ERROR al generar projects.json
    pause
    exit /b 1
)
echo.
echo Haciendo commit y push...
git add frontend/public/data/projects.json data/projects.js
git diff --cached --quiet && (echo Sin cambios en projects.json && goto fin)
git commit -m "chore: actualiza stock primario %date:~6,4%-%date:~3,2%-%date:~0,2%"
git push
echo.
echo Listo. Vercel desplegara automaticamente.
:fin
pause

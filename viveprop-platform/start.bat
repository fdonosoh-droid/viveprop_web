@echo off
echo Starting ViveProp Platform...

:: Start FastAPI backend (run from project root so relative imports work as a package)
start "ViveProp Backend" cmd /k "cd /d %~dp0 && python -m uvicorn backend.main:app --reload --port 8001"

:: Wait a moment for backend to start
timeout /t 2 /nobreak >nul

:: Start Vite frontend dev server
start "ViveProp Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Backend:  http://localhost:8001
echo Frontend: http://localhost:5174
echo API docs: http://localhost:8001/docs
echo.

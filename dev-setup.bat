@echo off
REM 🚀 Rotana E-Learning Development Setup for Windows
REM This script starts both the backend server and frontend dev server

cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  🚀 Rotana E-Learning - Development Mode                  ║
echo ║     Backend: http://localhost:3001                        ║
echo ║     Frontend: http://localhost:5173                       ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if node_modules exist in root
if not exist "node_modules" (
    echo 📦 Installing root dependencies...
    call npm install
)

REM Check if node_modules exist in frontend
if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo.
echo 🔧 Starting servers...
echo    - Backend on port 3001
echo    - Frontend on port 5173
echo.
echo Press Ctrl+C to stop servers
echo.

REM Try to use concurrently if available, otherwise run backend only
where concurrently >nul 2>nul
if %errorlevel% equ 0 (
    echo Starting both servers...
    call npm run dev:all
) else (
    echo 💡 Tip: Install 'concurrently' for running both servers at once
    echo    npm install -g concurrently
    echo.
    echo Starting backend server...
    echo.
    echo In another terminal, run:
    echo    cd frontend
    echo    npm run dev
    echo.
    call npm run dev
)

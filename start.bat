@echo off
chcp 65001 > nul
setlocal

cd /d "%~dp0"

echo ================================================
echo    Memorize Supporter - Quick Launcher (Windows)
echo ================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [Error] Node.js is not installed. Please install Node.js 20 or higher.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo [Info] Installing project dependencies...
    call npm install
)

if not exist ".env" (
    echo [Info] Running initial setup...
    call npm run setup
)

echo.
echo [Info] Starting Memorize Supporter...
call npm run dev

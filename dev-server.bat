@echo off
REM MKKP Plakátszerkesztő Development Server Script for Windows
REM This script provides easy commands for development and testing

echo [INFO] MKKP Plakátszerkesztő Development Server

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 20+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo [SUCCESS] Dependencies installed successfully
) else (
    echo [INFO] Dependencies already installed
)

REM Default to development mode if no argument provided
if "%1"=="" (
    set MODE=dev
) else (
    set MODE=%1
)

REM Handle different modes
if "%MODE%"=="dev" goto development
if "%MODE%"=="development" goto development
if "%MODE%"=="prod" goto production
if "%MODE%"=="production" goto production
if "%MODE%"=="build" goto build
if "%MODE%"=="clean" goto clean
if "%MODE%"=="help" goto help
if "%MODE%"=="-h" goto help
if "%MODE%"=="--help" goto help

echo [ERROR] Unknown option: %MODE%
goto usage

:development
echo [INFO] Starting development server...
echo [INFO] The application will be available at: http://localhost:8080
echo [INFO] Press Ctrl+C to stop the server
echo.
npm start
goto end

:production
echo [INFO] Building production version...
npm run build
if errorlevel 1 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)
echo [SUCCESS] Production build completed

echo [INFO] Starting production server...
echo [INFO] The application will be available at: http://localhost:8000
echo [INFO] Press Ctrl+C to stop the server
echo.
cd dist
python -m http.server 8000 2>nul
if errorlevel 1 (
    python -m SimpleHTTPServer 8000
)
goto end

:build
echo [INFO] Building production version...
npm run build
if errorlevel 1 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)
echo [SUCCESS] Production build completed in 'dist' directory
goto end

:clean
if exist dist (
    echo [INFO] Cleaning build artifacts...
    rmdir /s /q dist
    echo [SUCCESS] Build artifacts cleaned
) else (
    echo [INFO] No build artifacts to clean
)
goto end

:help
:usage
echo Usage: dev-server.bat [OPTION]
echo.
echo Options:
echo   dev, development    Start development server (default)
echo   prod, production    Build and serve production version
echo   build               Build production version without serving
echo   clean               Clean build artifacts
echo   help                Show this help message
echo.
echo Examples:
echo   dev-server.bat dev        # Start development server
echo   dev-server.bat production # Build and serve production version
echo   dev-server.bat build      # Just build production version
echo   dev-server.bat clean      # Clean build directory
:end
pause
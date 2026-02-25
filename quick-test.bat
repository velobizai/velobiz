@echo off
REM Velobiz Quick Test Script (Windows)
REM Run this after MySQL is configured

echo ================================
echo Velobiz Quick Test Script
echo ================================
echo.

echo Step 1: Testing MySQL Connection...
cd backend\Velobiz.Api
dotnet ef database update --no-build >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] MySQL connection successful
) else (
    echo [ERROR] MySQL connection failed
    echo Check your connection string in appsettings.Development.json
    echo See SETUP-AND-TEST.md for MySQL setup instructions
    exit /b 1
)
echo.

echo Step 2: Building Backend...
dotnet build --nologo >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Backend build successful
) else (
    echo [ERROR] Backend build failed
    exit /b 1
)
echo.

echo Step 3: Building Frontend...
cd ..\..\frontend
call npm run build >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Frontend build successful
) else (
    echo [ERROR] Frontend build failed
    exit /b 1
)
echo.

echo ================================
echo All builds successful!
echo ================================
echo.
echo Next steps:
echo   1. Start backend:  cd backend\Velobiz.Api ^&^& dotnet run
echo   2. Start frontend: cd frontend ^&^& npm start
echo   3. Visit: http://localhost:4200
echo.
echo See SETUP-AND-TEST.md for complete testing procedures
pause

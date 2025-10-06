@echo off
setlocal enabledelayedexpansion

echo _____________________________________
echo 🎭 NODE RESOURCES ⚡
echo -------------------------------------

echo 🚀 Installing Node.js version 22...

REM Check if nvm is installed
where nvm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ NVM for Windows is not installed.
    echo 👉 Please install it from: https://github.com/coreybutler/nvm-windows/releases
    exit /b 1
)

REM Install and use Node.js v22
nvm install 22
nvm use 22

echo ✅ Node.js 22 installed successfully.
echo.

REM Add Node.js to PATH permanently
for /f "delims=" %%i in ('nvm root') do set "NVM_DIR=%%i"
set "NODE_PATH=%NVM_DIR%\v22.0.0"
setx PATH "%NODE_PATH%;%PATH%"
echo ✅ Environment variables updated.
echo.

echo 🥁 Installing npm-check-updates...
npm install -g npm-check-updates
ncu -v

echo ✅ All done.
pause

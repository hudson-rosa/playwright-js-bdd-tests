@echo off
setlocal enabledelayedexpansion

REM     .\triggers\appium\start_appium_server.bat

echo ⚙️ Setting the environment variables for platform-tools and emulator...
call triggers\checks\set_environment_vars_win.bat

echo ______________________________________
echo 🎭 APPIUM SERVER ⚡
echo --------------------------------------
echo      ▶ Starting Appium server...

REM ----------------------------------------------------------
REM Start Appium server in the background
REM ----------------------------------------------------------
start "AppiumServer" cmd /c "npx appium -p 4723 > appium.log 2>&1"

REM Give it a few seconds to initialize
timeout /t 5 >nul

REM ----------------------------------------------------------
REM Capture PID of process listening on port 4723
REM ----------------------------------------------------------
set "APPIUM_PID="

for /f "tokens=5" %%A in ('netstat -ano ^| find ":4723"') do (
    set "APPIUM_PID=%%A"
)

REM ----------------------------------------------------------
REM Check if PID was found
REM ----------------------------------------------------------
if defined APPIUM_PID (
    echo 🚀 Appium started successfully with PID !APPIUM_PID!
    echo !APPIUM_PID! > "%TEMP%\appium_pid.txt"
    exit /b 0
) else (
    echo ❌ Could not detect Appium process. Check appium.log for details.
    exit /b 1
)

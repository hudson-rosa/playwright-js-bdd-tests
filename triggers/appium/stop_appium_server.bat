@echo off
setlocal enabledelayedexpansion

REM     .\triggers\appium\stop_appium_server.bat

echo ______________________________________
echo 🛑 STOPPING APPIUM SERVER ⚡
echo --------------------------------------
echo      ▶ Stopping...

set "PID_FILE=%TEMP%\appium_pid.txt"

if exist "%PID_FILE%" (
    set /p APPIUM_PID=<"%PID_FILE%"
    if defined APPIUM_PID (
        echo ⏹️ Killing Appium process with PID %APPIUM_PID%...
        taskkill /PID %APPIUM_PID% /F >nul 2>&1
        del "%PID_FILE%" >nul 2>&1
        echo ✅ Appium process stopped.
        exit /b 0
    )
)

echo ⚠️ No PID file found. Trying to stop any Appium on port 4723...
for /f "tokens=5" %%p in ('netstat -ano ^| find ":4723"') do taskkill /PID %%p /F
REM for /f "tokens=5" %%p in ('netstat -ano ^| find ":4723"') do (
REM    echo ⏹️ Killing process PID %%p...
REM    taskkill /PID %%p /F >nul 2>&1
REM )
exit /b 0
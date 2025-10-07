@echo off

REM .\triggers\checks\set_environment_vars_win.bat

REM Install Android from: https://developer.android.com/studio#command-tools
REM Download the Command line tools only: commandlinetools-win-13114758_latest.zip

REM ----------------------------------------------------------
REM Configure Android SDK environment variables for Windows
REM ----------------------------------------------------------

REM set "SDK_PATH=%LOCALAPPDATA%\Android\Sdk"
set "SDK_PATH=D:\Android\Sdk"

set ANDROID_HOME=%SDK_PATH%
set ANDROID_SDK_ROOT=%ANDROID_HOME%
set PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin;%PATH%

echo ⚙️ Android SDK environment configured:
echo    ⤷ ANDROID_HOME: %ANDROID_HOME%
echo    ⤷ ANDROID_SDK_ROOT: %ANDROID_SDK_ROOT%
echo    ⤷ PATH includes platform-tools and emulator

adb version

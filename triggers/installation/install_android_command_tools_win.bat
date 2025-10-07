@echo off

REM Run this command for this file: .\triggers\installation\install_android_command_tools_win.bat

REM Install Android from: https://developer.android.com/studio#command-tools
REM Download the Command line tools only: commandlinetools-win-13114758_latest.zip
REM Unzip and paste the cmdline-tools within the folder C:/Android/Sdk

cd C:\Android\Sdk\cmdline-tools\bin
sdkmanager "platform-tools"

REM ----------------------------------------------------------
REM Configure Android SDK environment variables for Windows
REM ----------------------------------------------------------
REM setx "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
set "ANDROID_HOME=C:\Android\Sdk"
set "ANDROID_SDK_ROOT=%ANDROID_HOME%"
set "PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin;%PATH%"

echo ⚙️ Android SDK environment configured:
echo    ⤷ ANDROID_HOME: %ANDROID_HOME%
echo    ⤷ ANDROID_SDK_ROOT: %ANDROID_SDK_ROOT%
echo    ⤷ PATH includes platform-tools and emulator

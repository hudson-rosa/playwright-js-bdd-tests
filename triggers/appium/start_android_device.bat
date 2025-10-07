@echo off
setlocal enabledelayedexpansion

REM     .\triggers\appium\start_android_device.bat

echo ______________________________________
echo 🎭 ANDROID DEVICES - REAL / EMULATOR ⚡
echo --------------------------------------
echo      ▶ Starting...

echo ⚙️ Setting the environment variables for platform-tools and emulator...
call triggers\checks\set_environment_vars_win.bat

set "TARGET_DEVICE="

REM ----------------------------------------------------------
REM Parse named arguments
REM ----------------------------------------------------------
:parse_args
if "%~1"=="" goto after_parse
set "arg=%~1"

echo %arg% | find "=" >nul

REM If argument doesn't contain '=' then PowerShell probably split it in two tokens:
echo %arg% | find "=" >nul
if errorlevel 1 (
  if not "%~2"=="" (
    rem combine current and next token: name + "=" + value
    set "arg=%~1=%~2"
    shift
  ) else (
    echo ❌ Unknown argument: %arg%
    exit /b 1
  )
)

for /f "tokens=1* delims==" %%A in ("%arg%") do (
  set "name=%%~A"
  set "value=%%~B"
)

if /i "!name!"=="target_device" set "TARGET_DEVICE=!value!"

shift
goto parse_args

:after_parse
set "MISSING_ARGS="

if "%TARGET_DEVICE%"=="" set "MISSING_ARGS=!MISSING_ARGS! ❌ TARGET_DEVICE arg is missing! Use: target_device=real|emulator"

echo %TAG% | findstr /b "@" >nul
if errorlevel 1 (
  set "MISSING_ARGS=!MISSING_ARGS! ⚠️ TAG value must start with '@'"
)

if not "%MISSING_ARGS%"=="" (
  echo %MISSING_ARGS%
  exit /b 1
)

:: --- Handle target device type ---
if /i "%TARGET_DEVICE%"=="real" (
    echo Checking connected real Android devices...
    for /f "skip=1 tokens=1,2" %%D in ('adb devices') do (
        if "%%E"=="device" (
            set "HAS_REAL_DEVICE=true"
            echo ✅ Real device connected: %%D
        )
    )

    if not defined HAS_REAL_DEVICE (
        echo ❌ No real devices connected.
        exit /b 1
    )
    goto :done
)

if /i "%TARGET_DEVICE%"=="emulator" (
    echo Listing available AVDs...
    for /f "delims=" %%F in ('emulator -list-avds') do (
        if not defined FIRST_AVD set "FIRST_AVD=%%F"
        echo   • %%F
    )

    if not defined FIRST_AVD (
        echo ❌ No AVD found! Please create one in Android Studio.
        exit /b 1
    )

    echo 🚀 Starting emulator (1st option): %FIRST_AVD% ...
    start "" cmd /c emulator -avd %FIRST_AVD% -netdelay none -netspeed full ^> android_device_run.log 2^>^&1
    echo %FIRST_AVD% > "%TEMP%\emulator_name.txt"

    echo ⏳ Waiting for emulator to be ready...
    adb wait-for-device >nul 2>&1

    :check_boot
    for /f "tokens=* usebackq" %%Z in (`adb shell getprop sys.boot_completed 2^>nul`) do (
        if "%%Z"=="1" (
            echo ✅ Emulator %FIRST_AVD% is ready.
            goto :done
        )
    )
    timeout /t 2 >nul
    goto :check_boot
)

echo ❌ Invalid device option name: %TARGET_DEVICE%. Valid options are: real, emulator
exit /b 1

:done
echo ✅ Device is ready to use!
exit /b 0

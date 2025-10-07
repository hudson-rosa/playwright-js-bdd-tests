@echo off
setlocal enabledelayedexpansion

echo _______________________________________________
echo MOBILE . Playwright . JS . BDD . Allure
echo -----------------------------------------------
echo      ▶ Starting...

echo ⚙️ Setting the environment variables for platform-tools and emulator...
call triggers\checks\set_environment_vars_win.bat

REM ==========================================================
REM Example usage:
REM .\test_mobile_from_batch.bat open_allure=true clear_old_results=true platform=android target_device=real device_profile_name=real_pixel6_android16 tag=@android
REM .\test_mobile_from_batch.bat open_allure=true clear_old_results=true platform=ios target_device=emulator device_profile_name=iphone15 tag=@ios
REM ==========================================================

set "OPEN_ALLURE=false"
set "CLEAR_OLD_RESULTS=false"
set "PLATFORM="
set "TARGET_DEVICE="
set "DEVICE_PROFILE_NAME="
set "TAG="

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

rem assign to known vars (value already has surrounding quotes removed by %%~B)
if /i "!name!"=="open_allure" set "OPEN_ALLURE=!value!"
if /i "!name!"=="clear_old_results" set "CLEAR_OLD_RESULTS=!value!"
if /i "!name!"=="platform" set "PLATFORM=!value!"
if /i "!name!"=="target_device" set "TARGET_DEVICE=!value!"
if /i "!name!"=="device_profile_name" set "DEVICE_PROFILE_NAME=!value!"
if /i "!name!"=="tag" set "TAG=!value!"

shift
goto parse_args

:after_parse
set "MISSING_ARGS="

if "%OPEN_ALLURE%"=="" set "MISSING_ARGS=!MISSING_ARGS! ❌ OPEN_ALLURE arg is missing! Use: open_allure=true|false"
if "%CLEAR_OLD_RESULTS%"=="" set "MISSING_ARGS=!MISSING_ARGS! ❌ CLEAR_OLD_RESULTS arg is missing! Use: clear_old_results=true|false"
if "%PLATFORM%"=="" set "MISSING_ARGS=!MISSING_ARGS! ❌ PLATFORM arg is missing! Use: platform=android|ios"
if "%TARGET_DEVICE%"=="" set "MISSING_ARGS=!MISSING_ARGS! ❌ TARGET_DEVICE arg is missing! Use: target_device=real|emulator"
if "%DEVICE_PROFILE_NAME%"=="" set "MISSING_ARGS=!MISSING_ARGS! ❌ DEVICE_PROFILE_NAME arg is missing! Use: device_profile_name=real_pixel6_android16|emulator_pixel_android15|..."
if "%TAG%"=="" set "MISSING_ARGS=!MISSING_ARGS! ❌ TAG arg is missing! Use: tag=@smoke-android|@regression-android|@android..."

echo %TAG% | findstr /b "@" >nul
if errorlevel 1 (
  set "MISSING_ARGS=!MISSING_ARGS! ⚠️ TAG value must start with '@'"
)

if not "%MISSING_ARGS%"=="" (
  echo %MISSING_ARGS%
  exit /b 1
)

REM ----------------------------------------------------------
REM Clear old results if requested
REM ----------------------------------------------------------
if /i "%CLEAR_OLD_RESULTS%"=="true" (
  echo 🗑 Cleaning up old reports...
  call npm run appium:remove-logs:win
  call npm run allure:remove-results:%PLATFORM%:win
)

REM ----------------------------------------------------------
REM Start Appium server in the background
REM ----------------------------------------------------------
echo 🚀 Starting Appium server in background...
call triggers\appium\start_appium_server.bat
if errorlevel 1 (
  echo ❌ Failed to start Appium server.
  exit /b 1
)

REM ----------------------------------------------------------
REM Display environment variables
REM ----------------------------------------------------------
echo ⚙️ MOBILE Environment variables:
echo    ⤷ ✅ Open Allure              : %OPEN_ALLURE%
echo    ⤷ ✅ Clear Old Allure Results : %CLEAR_OLD_RESULTS%
echo    ⤷ ✅ Platform                 : %PLATFORM%
echo    ⤷ ✅ Target Device            : %TARGET_DEVICE%
echo    ⤷ ✅ Device Profile Name      : %DEVICE_PROFILE_NAME%
echo    ⤷ ✅ Tag                      : %TAG%
echo _________________________________________
echo ▶ Running Playwright tests on %PLATFORM%
echo -----------------------------------------

set "TEST_EXIT_CODE=0"

if /i "%PLATFORM%"=="android" (
  call triggers\appium\start_android_device.bat target_device=%TARGET_DEVICE%
  set "TAG=%TAG%"
  set "ANDROID_PROFILE=%DEVICE_PROFILE_NAME%"
  call npm run test:android:tags:win || set TEST_EXIT_CODE=%ERRORLEVEL%
) else if /i "%PLATFORM%"=="ios" (
  set "TAG=%TAG%"
  set "IOS_PROFILE=%DEVICE_PROFILE_NAME%"
  call npm run test:ios:tags:win || set TEST_EXIT_CODE=%ERRORLEVEL%
) else (
  echo ❌ Invalid platform: %PLATFORM%. Valid options are: android, ios
  exit /b 1
)

echo ✅ All tests were executed.

REM ----------------------------------------------------------
REM Stop Appium server
REM ----------------------------------------------------------
echo 🚀 Stopping Appium server in background...
call triggers\appium\stop_appium_server.bat
if errorlevel 1 (
  echo ❌ Failed to stop Appium server.
  exit /b 1
)

REM ----------------------------------------------------------
REM Generate Allure Report
REM ----------------------------------------------------------
call triggers\allure\run_allure_report.bat open_allure=%OPEN_ALLURE% test_level=mobile

echo ✅ All done.
exit /b %TEST_EXIT_CODE%

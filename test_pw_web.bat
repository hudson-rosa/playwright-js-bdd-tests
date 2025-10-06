@echo off
setlocal enabledelayedexpansion

echo ___________________________________________
echo WEB . Playwright . JS . BDD . Allure
echo -------------------------------------------
echo      - Starting...

REM ===========================================
REM Example usage with POWERSHELL:
REM
REM .\test_pw_web.bat headless=false open_allure=true clear_old_results=true browser=chromium tag=@web
REM .\test_pw_web.bat headless=false open_allure=true clear_old_results=true browser=firefox tag=@web
REM .\test_pw_web.bat headless=false open_allure=true clear_old_results=true browser=webkit tag=@web
REM .\test_pw_web.bat headless=false open_allure=true clear_old_results=true browser=all tag=@web
REM
REM Example usage with CMD:
REM
REM test_pw_web.bat headless=false open_allure=true clear_old_results=true browser=chromium tag=@web
REM ===========================================

set "BROWSER="
set "HEADLESS="
set "OPEN_ALLURE=false"
set "CLEAR_OLD_RESULTS=false"
set "TAG="

REM Parse named arguments
:parse_args
if "%~1"=="" goto after_parse

set "arg=%~1"

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
if /i "!name!"=="browser" set "BROWSER=!value!"
if /i "!name!"=="headless" set "HEADLESS=!value!"
if /i "!name!"=="tag" set "TAG=!value!"

shift
goto parse_args

:after_parse
set "MISSING_ARGS="

if "%OPEN_ALLURE%"=="" set "MISSING_ARGS=!MISSING_ARGS! ❌ OPEN_ALLURE arg is missing! Use: open_allure=true|false"
if "%CLEAR_OLD_RESULTS%"=="" set "MISSING_ARGS=!MISSING_ARGS! ❌ CLEAR_OLD_RESULTS arg is missing! Use: clear_old_results=true|false"
if "%BROWSER%"=="" set "MISSING_ARGS=!MISSING_ARGS! ❌ BROWSER arg is missing! Use: browser=chromium|firefox|webkit|all"
if "%HEADLESS%"=="" set "MISSING_ARGS=!MISSING_ARGS! ❌ HEADLESS arg is missing! Use: headless=true|false"
if "%TAG%"=="" set "MISSING_ARGS=!MISSING_ARGS! ❌ TAG arg is missing! Use: tag=@smoke-web|@regression-web|@web..."

echo %TAG% | findstr /b "@" >nul
if errorlevel 1 (
  set "MISSING_ARGS=!MISSING_ARGS! --️ TAG value must start with '@'"
)

if not "%MISSING_ARGS%"=="" (
  echo %MISSING_ARGS%
  exit /b 1
)

REM Clear old results if requested
if /i "%CLEAR_OLD_RESULTS%"=="true" (
  echo 🗑 Cleaning up old reports...
  call npm run allure:remove-results:%BROWSER%
)

echo ⚙️ WEB Environment variables:
echo    ⤷ ✅ Open Allure              : %OPEN_ALLURE%
echo    ⤷ ✅ Clear Old Allure Results : %CLEAR_OLD_RESULTS%
echo    ⤷ ✅ Browser                  : %BROWSER%
echo    ⤷ ✅ Headless                 : %HEADLESS%
echo    ⤷ ✅ Tag                      : %TAG%
echo ________________________________________________________
echo ▶ Running Playwright tests on %BROWSER% browser pages...
echo --------------------------------------------------------

set "TEST_EXIT_CODE=0"

if /i "%BROWSER%"=="chromium" (
  set TAGS=%TAG%
  set HEADLESS=%HEADLESS%
  call npm run test:chromium:tags:win || set TEST_EXIT_CODE=%ERRORLEVEL%
) else if /i "%BROWSER%"=="firefox" (
  set TAGS=%TAG%
  set HEADLESS=%HEADLESS%
  call npm run test:firefox:tags:win || set TEST_EXIT_CODE=%ERRORLEVEL%
) else if /i "%BROWSER%"=="webkit" (
  set TAGS=%TAG%
  set HEADLESS=%HEADLESS%
  call npm run test:webkit:tags:win || set TEST_EXIT_CODE=%ERRORLEVEL%
) else if /i "%BROWSER%"=="all" (
  set TAGS=%TAG%
  set HEADLESS=%HEADLESS%
  call npx npm-run-all --parallel test:chromium:tags:win test:firefox:tags:win test:webkit:tags:win || set TEST_EXIT_CODE=%ERRORLEVEL%
) else (
  echo ❌ Invalid browser: %BROWSER%. Valid options are: chromium, firefox, webkit, all
  exit /b 1
)

echo ✅ All tests were executed.

REM Generate Allure Report
call triggers\allure\run_allure_report.bat open_allure=%OPEN_ALLURE% test_level=web

exit /b %TEST_EXIT_CODE%

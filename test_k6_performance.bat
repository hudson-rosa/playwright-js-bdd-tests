@echo off
setlocal enabledelayedexpansion

REM RUN THIS FILE WITH THIS COMMAND:
REM   .\test_k6_performance.bat open_k6_reporter=true clear_old_results=true file="perf-tests\k6-tests\ddos-base-test.js" service_name=demo
REM   .\test_k6_performance.bat open_k6_reporter=true clear_old_results=true file="perf-tests\k6-tests\demo\ddos-demo-single-file-test.js" service_name=null

echo __________________________________________________
echo 🎭 PEFORMANCE • Playwright • JS • K6 Reporter ⚡
echo --------------------------------------------------
echo      ▶ Starting...

:: Default values
set "CLEAR_OLD_RESULTS=false"
set "OPEN_K6_REPORTER=false"
set "FILE="
set "SERVICE_NAME="

:: Report path
set "REPORT_PATH=audit-perfs\reports\report.html"

REM -------------------------
REM Parse named arguments
REM -------------------------
:parse_args
if "%~1"=="" goto after_parse

set "arg=%~1"

REM If argument doesn't contain '=', maybe split by PowerShell, combine
echo %arg% | find "=" >nul
if errorlevel 1 (
  if not "%~2"=="" (
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

if /i "!name!"=="clear_old_results" set "CLEAR_OLD_RESULTS=!value!"
if /i "!name!"=="open_k6_reporter" set "OPEN_K6_REPORTER=!value!"
if /i "!name!"=="file" set "FILE=!value!"
if /i "!name!"=="service_name" set "SERVICE_NAME=!value!"
shift
goto parse_args

:after_parse
set "MISSING_ARGS="

if "%CLEAR_OLD_RESULTS%"=="" (
  set "MISSING_ARGS=!MISSING_ARGS! ❌ CLEAR_OLD_RESULTS arg is missing! Use: clear_old_results=true|false"
)
if "%OPEN_K6_REPORTER%"=="" (
  set "MISSING_ARGS=!MISSING_ARGS! ❌ OPEN_K6_REPORTER arg is missing! Use: open_k6_reporter=true|false"
)
if "%FILE%"=="" (
  set "MISSING_ARGS=!MISSING_ARGS! ❌ FILE arg is missing! Use: file=perf-tests/k6-tests/demo/ddos-demo-single-file-test.js"
)
if "%SERVICE_NAME%"=="" (
  set "MISSING_ARGS=!MISSING_ARGS! ❌ SERVICE_NAME arg is missing! Use e.g.: service_name=demo --> matches an endpoint name in perf-tests/data/endpoints.js"
)

if not "%MISSING_ARGS%"=="" (
  echo %MISSING_ARGS%
  exit /b 1
)

REM Clear old results if requested
if /i "%CLEAR_OLD_RESULTS%"=="true" (
  echo 🗑 Cleaning up old API reports...
  call npm run results:k6:remove:bat
  timeout /t 1 /nobreak >nul
  call npm run results:k6:create-folder:bat
)

:: Running tests
echo ⚙️ PERFORMANCE Environment variables:
echo    ⤷ ✅ Clear Old Allure Results : %CLEAR_OLD_RESULTS%
echo    ⤷ ✅ Open K6 Reporter         : %OPEN_K6_REPORTER%
echo    ⤷ ✅ File Name                : %FILE%
echo    ⤷ ✅ Service Name             : %SERVICE_NAME%
echo __________________________

if /i "%OPEN_K6_REPORTER%"=="true" (
  if not exist audit-perfs\reports (
    mkdir audit-perfs\reports
  )
)

:: When running from the k6 package
@REM call npm run test:perf:file:bat %FILE% -- -e ENDPOINT=%SERVICE_NAME%

:: When running from the portable k6.exe on Windows
call npm run test:perf:file:exe:bat %FILE% -- -e ENDPOINT=%SERVICE_NAME%
set "TEST_EXIT_CODE=%ERRORLEVEL%"

echo ✅ All selected PERFORMANCE tests were executed.

:: OPENING THE REPORTS
if /i "%OPEN_K6_REPORTER%"=="true" (
  timeout /t 3 /nobreak >nul
  if exist "%REPORT_PATH%" (
    start "REPORT for %SERVICE_NAME%" "%REPORT_PATH%"
    echo ✅ Report generated on: "%REPORT_PATH%"
  ) else (
    echo ⚠️ Report not generated on: "%REPORT_PATH%"
  )
)

exit /b %TEST_EXIT_CODE%
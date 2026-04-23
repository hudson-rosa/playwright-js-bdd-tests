@echo off
setlocal enabledelayedexpansion

REM RUN THIS FILE WITH THIS COMMAND:
REM .\test_pw_performance.bat open_allure=true clear_old_results=true file="ddos-k6.test.js"

echo __________________________________________________
echo 🎭 PEFORMANCE • Playwright • JS • Allure ⚡
echo --------------------------------------------------
echo      ▶ Starting...

:: Default values
set "OPEN_ALLURE=false"
set "CLEAR_OLD_RESULTS=false"
set "FILE="

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

if /i "!name!"=="open_allure" set "OPEN_ALLURE=!value!"
if /i "!name!"=="clear_old_results" set "CLEAR_OLD_RESULTS=!value!"
if /i "!name!"=="file" set "FILE=!value!"

shift
goto parse_args

:after_parse
set "MISSING_ARGS="

if "%OPEN_ALLURE%"=="" (
  set "MISSING_ARGS=!MISSING_ARGS! ❌ OPEN_ALLURE arg is missing! Use: open_allure=true|false"
)
if "%CLEAR_OLD_RESULTS%"=="" (
  set "MISSING_ARGS=!MISSING_ARGS! ❌ CLEAR_OLD_RESULTS arg is missing! Use: clear_old_results=true|false"
)
if "%FILE%"=="" (
  set "MISSING_ARGS=!MISSING_ARGS! ❌ FILE arg is missing! Use: file=ddos-k6.test.js"
)

if not "%MISSING_ARGS%"=="" (
  echo %MISSING_ARGS%
  exit /b 1
)

REM Clear old results if requested
if /i "%CLEAR_OLD_RESULTS%"=="true" (
  echo 🗑 Cleaning up old API reports...
  call npm run allure:remove-results:api:win
)

:: Running tests
echo ⚙️ PERFORMANCE Environment variables:
echo    ⤷ ✅ Open Allure              : %OPEN_ALLURE%
echo    ⤷ ✅ Clear Old Allure Results : %CLEAR_OLD_RESULTS%
echo    ⤷ ✅ File Name                : %FILE%
echo __________________________

call npm run test:perf:file:win %FILE%
set "TEST_EXIT_CODE=%ERRORLEVEL%"

echo ✅ All selected PERFORMANCE tests were executed.

REM Generate Allure Report
call .\triggers\allure\run_allure_report.bat open_allure=%OPEN_ALLURE% test_level=perf

exit /b %TEST_EXIT_CODE%
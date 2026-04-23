@echo off
setlocal enabledelayedexpansion

REM RUN THIS FILE WITH THIS COMMAND:
REM .\test_pw_performance.bat open_k6_reporter=true clear_old_results=true file=".\tests\performance\ddos-k6-test.js"

echo __________________________________________________
echo 🎭 PEFORMANCE • Playwright • JS • K6 Reporter ⚡
echo --------------------------------------------------
echo      ▶ Starting...

:: Default values
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

if /i "!name!"=="clear_old_results" set "CLEAR_OLD_RESULTS=!value!"
if /i "!name!"=="file" set "FILE=!value!"

shift
goto parse_args

:after_parse
set "MISSING_ARGS="

if "%CLEAR_OLD_RESULTS%"=="" (
  set "MISSING_ARGS=!MISSING_ARGS! ❌ CLEAR_OLD_RESULTS arg is missing! Use: clear_old_results=true|false"
)
if "%FILE%"=="" (
  set "MISSING_ARGS=!MISSING_ARGS! ❌ FILE arg is missing! Use: file=.\tests\performance\ddos-k6-test.js"
)

if not "%MISSING_ARGS%"=="" (
  echo %MISSING_ARGS%
  exit /b 1
)

REM Clear old results if requested
@REM if /i "%CLEAR_OLD_RESULTS%"=="true" (
@REM   echo 🗑 Cleaning up old API reports...
@REM   call npm run audit-k6:remove-results:perf:win
@REM )

:: Running tests
echo ⚙️ PERFORMANCE Environment variables:
echo    ⤷ ✅ Clear Old Allure Results : %CLEAR_OLD_RESULTS%
echo    ⤷ ✅ File Name                : %FILE%
echo __________________________

:: When running from the k6 package
@REM call npm run test:perf:file:win %FILE%

:: When running from the portable k6.exe on Windows
call npm run test:perf:file:exe:win %FILE%
set "TEST_EXIT_CODE=%ERRORLEVEL%"

echo ✅ All selected PERFORMANCE tests were executed.

exit /b %TEST_EXIT_CODE%
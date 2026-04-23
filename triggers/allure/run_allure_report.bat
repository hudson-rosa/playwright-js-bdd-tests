@echo off
setlocal enabledelayedexpansion

REM .\triggers\allure\run_allure_report.sh open_allure=true test_level=restapi
REM .\triggers\allure\run_allure_report.sh open_allure=true test_level=soapapi
REM .\triggers\allure\run_allure_report.sh open_allure=true test_level=web
REM .\triggers\allure\run_allure_report.sh open_allure=true test_level=mobile

echo ✨✨ Generating Allure Report ✨✨...

REM -------------------------
REM Parse named arguments
REM -------------------------

set "TEST_LEVEL="
set "OPEN_ALLURE=false"

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
if /i "!name!"=="test_level" set "TEST_LEVEL=!value!"

shift
goto parse_args

:after_parse
set "MISSING_ARGS="

if "%OPEN_ALLURE%"=="" (
  set "MISSING_ARGS=!MISSING_ARGS! ❌ OPEN_ALLURE arg is missing! --> Use: open_allure=true|false"
)
if "%TEST_LEVEL%"=="" (
  set "MISSING_ARGS=!MISSING_ARGS! ❌ TEST_LEVEL arg is missing! --> Use: test_level=restapi|soapapi|api|web|mobile"
)

if not "%MISSING_ARGS%"=="" (
  echo %MISSING_ARGS%
  exit /b 1
)

timeout /t 1 >nul

set "TEST_EXIT_CODE=0"

if /i "%TEST_LEVEL%"=="restapi" (
  call npm run allure:generate-report:api:win || set TEST_EXIT_CODE=%ERRORLEVEL%
) else if /i "%TEST_LEVEL%"=="soapapi" (
  call npm run allure:generate-report:api:win || set TEST_EXIT_CODE=%ERRORLEVEL%
) else if /i "%TEST_LEVEL%"=="api" (
  call npm run allure:generate-report:api:win || set TEST_EXIT_CODE=%ERRORLEVEL%
) else if /i "%TEST_LEVEL%"=="web" (
  call npm run allure:generate-report:web:win || set TEST_EXIT_CODE=%ERRORLEVEL%
) else if /i "%TEST_LEVEL%"=="mobile" (
  call npm run allure:generate-report:mobile:win || set TEST_EXIT_CODE=%ERRORLEVEL%
) else (
  echo ❌ Invalid test level: %TEST_LEVEL%. Valid options are: api, web, mobile
  exit /b 1
)

echo OPEN_ALLURE is: %OPEN_ALLURE%
if /i "%OPEN_ALLURE%"=="true" (
  timeout /t 1 >nul
  echo 📂 Opening Allure Report...
  call npm run allure:open:win
) else (
  echo OPEN_ALLURE is not "true", skipping...
)

echo ✅ All done.
exit /b %TEST_EXIT_CODE%

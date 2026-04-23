@echo off
setlocal enabledelayedexpansion

echo ___________________________________________
echo API . Playwright . JS . BDD . Allure
echo -------------------------------------------
echo      - Starting...

REM ===========================================
REM RUN THIS FILE WITH ONE OF THESE COMMANDS:
REM .\test_pw_api.bat open_allure=true clear_old_results=true api_type=soapapi tag="@soap-api"
REM .\test_pw_api.bat open_allure=true clear_old_results=true api_type=restapi tag="@rest-api"
REM ===========================================

set "API_TYPE=false"
set "OPEN_ALLURE=false"
set "CLEAR_OLD_RESULTS=false"
set "TAG="

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
if /i "!name!"=="api_type" set "API_TYPE=!value!"
if /i "!name!"=="tag" set "TAG=!value!"

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
if "%API_TYPE%"=="" (
  set "MISSING_ARGS=!MISSING_ARGS! ❌ API_TYPE arg is missing! Use: api_type=restapi|soapapi|api"
)
if "%TAG%"=="" (
  set "MISSING_ARGS=!MISSING_ARGS! ❌ TAG arg is missing! Use: tag=@smoke-api|@regression-api|@api..."
)

echo %TAG% | findstr /b "@" >nul
if errorlevel 1 (
  set "MISSING_ARGS=!MISSING_ARGS! ⚠️ TAG value must start with '@'"
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

REM Running tests
echo ⚙️ API Environment variables:
echo    ⤷ ✅ Open Allure              : %OPEN_ALLURE%
echo    ⤷ ✅ Clear Old Allure Results : %CLEAR_OLD_RESULTS%
echo    ⤷ ✅ API Type                 : %API_TYPE%
echo    ⤷ ✅ Tag                      : %TAG%
echo __________________________

set "TEST_EXIT_CODE=0"

IF /I "%API_TYPE%"=="soapapi" (
    IF /I "%CLEAR_OLD_RESULTS%"=="true" (
        echo 🗑 Cleaning up old SOAP API reports...
        call npm run allure:remove-results:api:soap:win
    )
    set "TAGS=%TAG%"
    call npm run test:api:soap:tags:win
    set "TEST_EXIT_CODE=%ERRORLEVEL%"

) ELSE IF /I "%API_TYPE%"=="restapi" (
    IF /I "%CLEAR_OLD_RESULTS%"=="true" (
        echo 🗑 Cleaning up old REST API reports...
        call npm run allure:remove-results:api:rest:win
    )
    set "TAGS=%TAG%"
    call npm run test:api:rest:tags
    set "TEST_EXIT_CODE=%ERRORLEVEL%"

) ELSE IF /I "%API_TYPE%"=="api" (
    call npm run allure:remove-results:api:soap:win
    call npm run allure:remove-results:api:rest:win
    set "TAGS=%TAG%"
    call npx npm-run-all --parallel test:api:soap:tags test:api:rest:tags:win
    set "TEST_EXIT_CODE=%ERRORLEVEL%"

) ELSE (
    echo ❌ Invalid API type: %API_TYPE%. Valid options are: soapapi, restapi, api
    exit /b 1
)

echo ✅ All selected %API_TYPE% tests were executed.

REM Generate Allure Report
call triggers\allure\run_allure_report.bat open_allure=%OPEN_ALLURE% test_level=%API_TYPE%

exit /b %TEST_EXIT_CODE%

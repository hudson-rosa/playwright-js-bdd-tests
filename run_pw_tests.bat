@echo off
setlocal enabledelayedexpansion

echo _____________________________________
echo.
echo 🎭 Playwright • JS • BDD • Allure ⚡
echo -------------------------------------
echo      ▶ Starting...

echo.
echo 🗑 Cleaning up old reports...
call npm run remove-allure

:: Default values
set "OPEN_ALLURE=false"
set "BROWSER="
set "HEADLESS="
set "TAG="

:: Parse named arguments
for %%A in (%*) do (
    echo %%A | findstr /B "open_allure=" >nul && set "OPEN_ALLURE=%%~A" & set "OPEN_ALLURE=!OPEN_ALLURE:open_allure==!"
    echo %%A | findstr /B "browser=" >nul && set "BROWSER=%%~A" & set "BROWSER=!BROWSER:browser==!"
    echo %%A | findstr /B "headless=" >nul && set "HEADLESS=%%~A" & set "HEADLESS=!HEADLESS:headless==!"
    echo %%A | findstr /B "tag=" >nul && set "TAG=%%~A" & set "TAG=!TAG:tag==!"
)

set "MISSING_ARGS="

if "%OPEN_ALLURE%"=="" (
    set MISSING_ARGS=!MISSING_ARGS!& echo ❌ OPEN_ALLURE arg is missing! Use: open_allure=true^|false
)
if "%BROWSER%"=="" (
    set MISSING_ARGS=!MISSING_ARGS!& echo ❌ BROWSER arg is missing! Use: browser=chromium^|firefox^|webkit^|all
)
if "%HEADLESS%"=="" (
    set MISSING_ARGS=!MISSING_ARGS!& echo ❌ HEADLESS arg is missing! Use: headless=true^|false
)
if "%TAG%"=="" (
    set MISSING_ARGS=!MISSING_ARGS!& echo ❌ TAG arg is missing! Use: tag='@smoke'^|'@regression'
)
echo %TAG% | findstr "^@" >nul
if errorlevel 1 (
    echo ⚠️ TAG should start with '@' → Use: tag='@smoke'^|'@regression'
)

if defined MISSING_ARGS (
    echo.
    echo %MISSING_ARGS%
    exit /b 1
)

echo.
echo ▶ Running Playwright tests
echo    ⤷ ✅ Open Allure : %OPEN_ALLURE%
echo    ⤷ ✅ Browser     : %BROWSER%
echo    ⤷ ✅ Headless    : %HEADLESS%
echo    ⤷ ✅ Tag         : %TAG%

if /I "%BROWSER%"=="chromium" (
    set HEADLESS=%HEADLESS%
    call npm run test:chromium:tags %TAG%
) else if /I "%BROWSER%"=="firefox" (
    set HEADLESS=%HEADLESS%
    call npm run test:firefox:tags %TAG%
) else if /I "%BROWSER%"=="webkit" (
    set HEADLESS=%HEADLESS%
    call npm run test:webkit:tags %TAG%
) else if /I "%BROWSER%"=="all" (
    set HEADLESS=%HEADLESS%
    call npx npm-run-all -p ^
        "test:chromium:tags %TAG%" ^
        "test:firefox:tags %TAG%" ^
        "test:webkit:tags %TAG%"
) else (
    echo ❌ Invalid browser: %BROWSER%
    exit /b 1
)

:: Optional: call another batch file (like run_allure.bat)
:: call run_allure.bat open_allure=%OPEN_ALLURE%

echo ✅ All tests were executed.
echo ✅ All done.
endlocal

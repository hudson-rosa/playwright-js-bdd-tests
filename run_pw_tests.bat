@echo off
setlocal enabledelayedexpansion

echo _____________________________________
echo.
echo Playwright . JS . BDD . Allure
echo -------------------------------------
echo      Starting...

echo.
echo Cleaning up old reports...
call npm run remove-allure-win

:: Default values
set OPEN_ALLURE=
set BROWSER=
set HEADLESS=
set TAG=

:: Parse named arguments (key=value)
for %%A in (%*) do (
    set "arg=%%~A"
    for /F "tokens=1* delims==" %%K in ("!arg!") do (
        if /I "%%K"=="open_allure" set "OPEN_ALLURE=%%L"
        if /I "%%K"=="browser"     set "BROWSER=%%L"
        if /I "%%K"=="headless"    set "HEADLESS=%%L"
        if /I "%%K"=="tag"         set "TAG=%%L"
    )
)

:: Validate args
set "MISSING_ARGS="
if not defined OPEN_ALLURE (
    echo x OPEN_ALLURE arg is missing! Use: open_allure=true^|false
    set MISSING_ARGS=1
)
if not defined BROWSER (
    echo x BROWSER arg is missing! Use: browser=chromium^|firefox^|webkit^|all
    set MISSING_ARGS=1
)
if not defined HEADLESS (
    echo x HEADLESS arg is missing! Use: headless=true^|false
    set MISSING_ARGS=1
)
if not defined TAG (
    echo x TAG arg is missing! Use: tag=@smoke^|@regression
    set MISSING_ARGS=1
) else (
    if not "%TAG:~0,1%"=="@" (
        echo x TAG should start with '@' → Use: tag=@smoke^|@regression
    )
)

if defined MISSING_ARGS (
    echo.
    echo x Exiting due to missing arguments.
    exit /b 1
)

echo.
echo Running Playwright tests
echo    - Open Allure : %OPEN_ALLURE%
echo    - Browser     : %BROWSER%
echo    - Headless    : %HEADLESS%
echo    - Tag         : %TAG%

if /I "%BROWSER%"=="chromium" (
    call npm run test:chromium:tags %TAG%
) else if /I "%BROWSER%"=="firefox" (
    call npm run test:firefox:tags %TAG%
) else if /I "%BROWSER%"=="webkit" (
    call npm run test:webkit:tags %TAG%
) else if /I "%BROWSER%"=="all" (
    call npx npm-run-all -p ^
        "test:chromium:tags %TAG%" ^
        "test:firefox:tags %TAG%" ^
        "test:webkit:tags %TAG%"
) else (
    echo x Invalid browser: %BROWSER%
    exit /b 1
)

:: Optional: call another batch file (like run_allure.bat)
:: if /I "%OPEN_ALLURE%"=="true" call run_allure.bat

echo All tests were executed.
echo All done.
endlocal
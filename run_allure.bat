@echo off
setlocal enabledelayedexpansion

:: Default value
set "OPEN_ALLURE=false"

:: Parse argument
for %%A in (%*) do (
    echo %%A | findstr /B "open_allure=" >nul && set "OPEN_ALLURE=%%~A" & set "OPEN_ALLURE=!OPEN_ALLURE:open_allure==!"
)

echo ✨✨ Generating Allure Report ✨✨...
timeout /t 2 >nul
call npm run generate:allure-report

echo OPEN_ALLURE is: %OPEN_ALLURE%
if /I "%OPEN_ALLURE%"=="true" (
    timeout /t 2 >nul
    echo 📂 Opening Allure Report...
    call npm run open:allure-report
) else (
    echo OPEN_ALLURE is not 'true', skipping...
)

echo ✅ All done.
endlocal

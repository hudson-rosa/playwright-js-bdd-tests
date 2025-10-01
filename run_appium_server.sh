#!/bin/bash
set -e

# RUN THIS FILE WITH THE COMMAND:  ./run_appium_server.sh

# Remove Previous Allure Results
echo "_____________________________________"
echo "\n🎭 APPIUM SERVER ⚡"
echo "-------------------------------------"
echo "     ▶ Starting..."

npm run appium:server
sleep 5000
curl http://127.0.0.1:4723/status
echo "✅ Appium is running!

# Exit with captured test result
exit ${TEST_EXIT_CODE:-0}
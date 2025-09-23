#!/bin/bash
set -e

# RUN THIS FILE WITH THE COMMAND:  ./run_appium_server.sh

# Remove Previous Allure Results
echo "_____________________________________"
echo "\n🎭 APPIUM SERVER ⚡"
echo "-------------------------------------"
echo "     ▶ Starting..."

echo "\n 🗑 Cleaning up old reports..."
npm run appium:server:debug
echo "✅ Appium is running on port 4723"

# Exit with captured test result
exit ${TEST_EXIT_CODE:-0}
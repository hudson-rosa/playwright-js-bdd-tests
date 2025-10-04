#!/bin/bash
set -e

# RUN THIS FILE WITH THE COMMAND:  ./triggers/appium/start_appium_server.sh

echo "_____________________________________"
echo "🎭 APPIUM SERVER ⚡"
echo "-------------------------------------"
echo "     ▶ Starting..."

npm run appium:server
curl http://127.0.0.1:4723/status
echo "✅ Appium is running!"

# Exit with captured test result
exit ${TEST_EXIT_CODE:-0}
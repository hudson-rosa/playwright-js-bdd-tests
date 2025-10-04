#!/bin/bash
set -e

# RUN THIS FILE WITH THE COMMAND:  ./triggers/appium/stop_appium_server.sh

echo "_____________________________________"
echo "🎭 APPIUM SERVER ⚡"
echo "-------------------------------------"
echo "     ⏳ Stopping..."

ps aux | grep appium
pkill -f appium

sleep 2
echo "⏳ Rechecking existing processes..."
ps aux | grep appium
echo "🛑 Appium is stopped!"

echo "✅ All done."

# Exit with captured test result
exit ${TEST_EXIT_CODE:-0}
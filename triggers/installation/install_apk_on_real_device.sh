#!/bin/bash
set -e

# RUN THIS FILE WITH THE COMMAND:  ./triggers/installation/install_apk_on_real_device.sh

echo "_____________________________________"
echo "🎭 ANDROID - APK ⚡"
echo "-------------------------------------"

APP_PATH="./app-dist/ApiDemos-debug.apk"

echo "     ▶ Installing APK on real device..."
npm run android:adb:install-apk -- $APP_PATH

echo "✅ APK is installed!"

# Exit with captured test result
exit ${TEST_EXIT_CODE:-0}
#!/bin/bash
set -e

echo "_______________________________________________"
echo "🎭 MOBILE • Playwright • JS • BDD • Allure ⚡"
echo "-----------------------------------------------"
echo "     ▶ Starting..."


# RUN THIS FILE WITH ONE OF THESE COMMANDS:
# E.g.1:       ./test_mobile_from_bash.sh open_allure=true clear_old_results=true platform=android target_device=real|emulator device_profile_name=phone_x tag="@android"
# E.g.2:       ./test_mobile_from_bash.sh open_allure=true clear_old_results=true platform=ios target_device=real|emulator device_profile_name=phone_y tag="@ios"

# Demo comand: ./test_mobile_from_bash.sh open_allure=true clear_old_results=true platform=android target_device=real device_profile_name=real_pixel6_android16 tag=@android

OPEN_ALLURE="false"
CLEAR_OLD_RESULTS="false"
PLATFORM=""
TARGET_DEVICE=""
DEVICE_PROFILE_NAME=""
TAG=""

# Parse named arguments
for arg in "$@"; do
  case $arg in
    open_allure=*)
      OPEN_ALLURE="${arg#*=}"
      shift
      ;;
    clear_old_results=*)
      CLEAR_OLD_RESULTS="${arg#*=}"
      shift
      ;;
    platform=*)
      PLATFORM="${arg#*=}"
      shift
      ;;
    target_device=*)
      TARGET_DEVICE="${arg#*=}"
      shift
      ;;
    device_profile_name=*)
      DEVICE_PROFILE_NAME="${arg#*=}"
      shift
      ;;
    tag=*)
      TAG="${arg#*=}"
      shift
      ;;
    *)
      echo "❌ Unknown argument: $arg"
      exit 1
      ;;
  esac
done

MISSING_ARGS=""

if [ -z "$OPEN_ALLURE" ]; then
  MISSING_ARGS+=" ❌ OPEN_ALLURE arg is missing on the command!    --> Use: open_allure=true|false"
fi
if [ -z "$CLEAR_OLD_RESULTS" ]; then
  MISSING_ARGS+=" ❌ CLEAR_OLD_RESULTS arg is missing on the command!    --> Use: clear_old_results=true|false"
fi
if [ -z "$PLATFORM" ]; then
  MISSING_ARGS+=" ❌ PLATFORM arg is missing on the command!    --> Use: platform=android|ios"
fi
if [ -z "$TARGET_DEVICE" ]; then
  MISSING_ARGS+=" ❌ TARGET_DEVICE arg is missing on the command!    --> Use: target_device=real|emulator"
fi
if [ -z "$DEVICE_PROFILE_NAME" ]; then
  MISSING_ARGS+=" ❌ DEVICE_PROFILE_NAME arg is missing on the command!    --> Use: device_profile_name=real_pixel6_android16|emulator_pixel_android15|..."
fi
if [ -z "$TAG" ]; then
  MISSING_ARGS+=" ❌ TAG arg is missing on the command!    --> Use: tag='@smoke-android'|'@regression-android'|'@android...|@smoke-ios'|'@regression-ios'|'@ios...'"
fi
if [[ $TAG != @* ]]; then
  MISSING_ARGS+=" ⚠️ Current TAG value must start with '@' under the brackets    --> Use: tag='@smoke-android'|'@regression-android'|'@android...|@smoke-ios'|'@regression-ios'|'@ios...'"
fi

# Show all missing arg messages at once
if [ -n "$MISSING_ARGS" ]; then
  echo -e "$MISSING_ARGS"
  exit 1
fi

# Clear old results if specified
if [[ $CLEAR_OLD_RESULTS == "true" ]]; then
  echo "🗑 Cleaning up old reports..."
  npm run appium:remove-logs-sh
  npm run allure:remove-results:$PLATFORM
fi

# Running Appium server in the background
./triggers/appium/start_appium_server.sh > appium.log 2>&1 & APPIUM_PID=$!
echo "🚀 Appium started in background with PID $APPIUM_PID"

# Running tests
echo "⚙️ MOBILE Environment variables:"
echo "   ⤷ ✅ Open Allure              : $OPEN_ALLURE"
echo "   ⤷ ✅ Clear Old Allure Results : $CLEAR_OLD_RESULTS"
echo "   ⤷ ✅ Platform                 : $PLATFORM"
echo "   ⤷ ✅ Target Device            : $TARGET_DEVICE"
echo "   ⤷ ✅ Device Profile Name      : $DEVICE_PROFILE_NAME"
echo "   ⤷ ✅ Tag                      : $TAG"
echo "_________________________________________"
echo "▶ Running Playwright tests on $PLATFORM"
echo "-----------------------------------------"

case "$PLATFORM" in
  android)
    # Starting the device/emulator in the background
    ./triggers/appium/start_android_device.sh target_device=$TARGET_DEVICE
    
    # Running the tests on Android
    TAG=$TAG ANDROID_PROFILE=$DEVICE_PROFILE_NAME npm run test:android:tags || TEST_EXIT_CODE=$?
  ;;
  ios)
    # Running the tests on IOS
    TAG=$TAG IOS_PROFILE=$DEVICE_PROFILE_NAME npm run test:ios:tags || TEST_EXIT_CODE=$?
  ;;
  *)
    echo "❌ Invalid platform: $PLATFORM. Valid options are: android, ios"
    exit 1
  ;;
esac

echo "✅ All tests were executed."

# Stopping Appium
if [ -n "$APPIUM_PID" ]; then
  echo "🛑 Stopping Appium (PID $APPIUM_PID)..."
  kill $APPIUM_PID >/dev/null 2>&1 || true

  # Wait a moment for it to exit cleanly
  sleep 2

  if ps -p $APPIUM_PID > /dev/null; then
    echo "⚠️ Appium did not stop gracefully, forcing termination..."
    kill -9 $APPIUM_PID >/dev/null 2>&1 || true
  fi

  echo "⏹️ Appium (PID $APPIUM_PID) is stopped"
fi

# Stopping emulator if started
if [ -f /tmp/emulator_pid.txt ]; then
  sleep 3
  EMULATOR_PID=$(cat /tmp/emulator_pid.txt)
  echo "🛑 Stopping Android Emulator (PID $EMULATOR_PID)..."
  kill $EMULATOR_PID || true
  sleep 2
  if ps -p $EMULATOR_PID > /dev/null; then
    echo "⚠️ Emulator still running, forcing shutdown..."
    kill -9 $EMULATOR_PID || true
  fi
  rm -f /tmp/emulator_pid.txt
  echo "⏹️ Android Emulator (PID $EMULATOR_PID) is stopped"
fi

# Generate Allure Report
./triggers/allure/run_allure_report.sh open_allure=$OPEN_ALLURE test_level=mobile

echo "✅ All done."

# Exit with captured test result
exit ${TEST_EXIT_CODE:-0}
#!/bin/bash
set -e

# Remove Previous Allure Results
echo "_______________________________________________"
echo "\n🎭 MOBILE • Playwright • JS • BDD • Allure ⚡"
echo "-----------------------------------------------"
echo "     ▶ Starting..."


# RUN THIS FILE WITH THE COMMAND:
# E.g.1:       ./test_pw_mobile.sh platform=android open_allure=true clear_old_results=true tag="@android"
# E.g.2:       ./test_pw_mobile.sh platform=ios open_allure=true clear_old_results=true tag="@ios"
OPEN_ALLURE="false"
CLEAR_OLD_RESULTS="false"
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
  MISSING_ARGS+="\n ❌ OPEN_ALLURE arg is missing on the command!\n    --> Use: open_allure=true|false"
fi
if [ -z "$CLEAR_OLD_RESULTS" ]; then
  MISSING_ARGS+="\n ❌ CLEAR_OLD_RESULTS arg is missing on the command!\n    --> Use: clear_old_results=true|false"
fi
if [ -z "$PLATFORM" ]; then
  MISSING_ARGS+="\n ❌ PLATFORM arg is missing on the command!\n    --> Use: platform=android"
fi
if [ -z "$TAG" ]; then
  MISSING_ARGS+="\n ❌ TAG arg is missing on the command!\n    --> Use: tag='@smoke-android'|'@regression-android'|'@android...|@smoke-ios'|'@regression-ios'|'@ios...'"
fi
if [[ $TAG != @* ]]; then
  MISSING_ARGS+="\n ⚠️ Current TAG value must start with '@' under the brackets\n    --> Use: tag='@smoke-android'|'@regression-android'|'@android...|@smoke-ios'|'@regression-ios'|'@ios...'"
fi

# Show all missing arg messages at once
if [ -n "$MISSING_ARGS" ]; then
  echo -e "$MISSING_ARGS"
  exit 1
fi

# Clear old results if specified
if [[ $CLEAR_OLD_RESULTS == "true" ]]; then
  echo "\n 🗑 Cleaning up old reports..."
  npm run appium:remove-logs-sh
  npm run allure:remove-results:$PLATFORM
fi

# Running Appium server in the background
./triggers/appium/run_appium_server.sh > appium.log 2>&1 & APPIUM_PID=$!
echo "🚀 Appium started in background with PID $APPIUM_PID"

# Running tests
echo "\n▶ Running Playwright tests"
echo "   ⤷ ✅ Open Allure              : $OPEN_ALLURE"
echo "   ⤷ ✅ Clear Old Allure Results : $CLEAR_OLD_RESULTS"
echo "   ⤷ ✅ Platform                 : $PLATFORM"
echo "   ⤷ ✅ Tag                      : $TAG"

case "$PLATFORM" in
  android)
    npm run test:android:tags $TAG || TEST_EXIT_CODE=$?
    ;;
  ios)
    npm run test:ios:tags $TAG || TEST_EXIT_CODE=$?
    ;;
*)
  echo "❌ Invalid platform name: $PLATFORM. Valid options is: android, ios"
  exit 1
  ;;
esac

echo "✅ All tests were executed."

# Generate Allure Report
./triggers/allure/run_allure_mobile_results.sh open_allure=$OPEN_ALLURE

echo "✅ All done."


# Stopping Appium
if [ -n "$APPIUM_PID" ]; then
  echo "🛑 Stopping Appium (PID $APPIUM_PID)..."
  kill $APPIUM_PID || true
fi

# Exit with captured test result
exit ${TEST_EXIT_CODE:-0}
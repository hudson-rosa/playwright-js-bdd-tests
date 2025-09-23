#!/bin/bash
set -e

# Remove Previous Allure Results
echo "___________________________________________"
echo "\n🎭 WEB • Playwright • JS • BDD • Allure ⚡"
echo "-------------------------------------------"
echo "     ▶ Starting..."

echo "\n 🗑 Cleaning up old reports..."
npm run remove-allure-sh

# RUN THIS FILE WITH THE COMMAND:
# E.g.:       ./run_pw_web_tests.sh open_allure=true headless=false browser=chromium tag="@web"
OPEN_ALLURE="false"
BROWSER=""
HEADLESS=""
TAG=""

# Parse named arguments
for arg in "$@"; do
  case $arg in
    open_allure=*)
      OPEN_ALLURE="${arg#*=}"
      shift
      ;;
    browser=*)
      BROWSER="${arg#*=}"
      shift
      ;;
    headless=*)
      HEADLESS="${arg#*=}"
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
if [ -z "$BROWSER" ]; then
  MISSING_ARGS+="\n ❌ BROWSER arg is missing on the command!\n    --> Use: browser=chromium|firefox|webkit|all"
fi
if [ -z "$HEADLESS" ]; then
  MISSING_ARGS+="\n ❌ HEADLESS arg is missing on the command!\n    --> Use: headless=true|false"
fi
if [ -z "$TAG" ]; then
  MISSING_ARGS+="\n ❌ TAG arg is missing on the command!\n    --> Use: tag='@smoke-web'|'@regression-web'|'@web...'"
fi
if [[ $TAG != @* ]]; then
  MISSING_ARGS+="\n ⚠️ Current TAG value must start with '@' under the brackets\n    --> Use: tag='@smoke-web'|'@regression-web'|'@web...'"
fi

# Show all missing arg messages at once
if [ -n "$MISSING_ARGS" ]; then
  echo -e "$MISSING_ARGS"
  exit 1
fi

echo "\n▶ Running Playwright tests"
echo "   ⤷ ✅ Open Allure : $OPEN_ALLURE"
echo "   ⤷ ✅ Browser     : $BROWSER"
echo "   ⤷ ✅ Headless    : $HEADLESS"
echo "   ⤷ ✅ Tag         : $TAG"

case "$BROWSER" in
chromium)
  HEADLESS=$HEADLESS npm run test:chromium:tags $TAG || TEST_EXIT_CODE=$?
  ;;
firefox)
  HEADLESS=$HEADLESS npm run test:firefox:tags $TAG || TEST_EXIT_CODE=$?
  ;;
webkit)
  HEADLESS=$HEADLESS npm run test:webkit:tags $TAG || TEST_EXIT_CODE=$?
  ;;
all)
  HEADLESS=$HEADLESS npx npm-run-all -p \
    test:chromium:tags $TAG \
    test:firefox:tags $TAG \
    test:webkit:tags $TAG || TEST_EXIT_CODE=$?
  ;;
*)
  echo "❌ Invalid browser: $BROWSER. Valid options are: chromium, firefox, webkit, all"
  exit 1
  ;;
esac

echo "✅ All tests were executed."

./run_allure.sh open_allure=$OPEN_ALLURE

echo "✅ All done."

# Exit with captured test result
exit ${TEST_EXIT_CODE:-0}
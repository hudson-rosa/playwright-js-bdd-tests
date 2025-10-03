#!/bin/bash
set -e

# Remove Previous Allure Results
echo "___________________________________________"
echo "\n🎭 WEB • Playwright • JS • BDD • Allure ⚡"
echo "-------------------------------------------"
echo "     ▶ Starting..."


# RUN THIS FILE WITH THE COMMAND:
# E.g.1 - Chrome:        ./test_pw_web.sh headless=false open_allure=true clear_old_results=true browser=chromium tag="@web"
# E.g.2 - Firefox:       ./test_pw_web.sh headless=false open_allure=true clear_old_results=true browser=firefox tag="@web"
# E.g.3 - Webkit:        ./test_pw_web.sh headless=false open_allure=true clear_old_results=true browser=webkit tag="@web"
# E.g.4 - All Browsers:  ./test_pw_web.sh headless=false open_allure=true clear_old_results=true browser=all tag="@web"
BROWSER=""
HEADLESS=""
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
if [ -z "$CLEAR_OLD_RESULTS" ]; then
  MISSING_ARGS+="\n ❌ CLEAR_OLD_RESULTS arg is missing on the command!\n    --> Use: clear_old_results=true|false"
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

# Clear old results if specified
if [[ $CLEAR_OLD_RESULTS == "true" ]]; then
  echo "\n 🗑 Cleaning up old reports..."
  npm run allure:remove-results:$BROWSER
fi

# Running tests based on the selected browser
echo "\n▶ Running Playwright tests"
echo "   ⤷ ✅ Open Allure              : $OPEN_ALLURE"
echo "   ⤷ ✅ Clear Old Allure Results : $CLEAR_OLD_RESULTS"
echo "   ⤷ ✅ Browser                  : $BROWSER"
echo "   ⤷ ✅ Headless                 : $HEADLESS"
echo "   ⤷ ✅ Tag                      : $TAG"

case "$BROWSER" in
  chromium)
    TAGS=$TAG HEADLESS=$HEADLESS npm run test:chromium:tags || TEST_EXIT_CODE=$?
    ;;
  firefox)
    TAGS=$TAG HEADLESS=$HEADLESS npm run test:firefox:tags || TEST_EXIT_CODE=$?
    ;;
  webkit)
    TAGS=$TAG HEADLESS=$HEADLESS npm run test:webkit:tags || TEST_EXIT_CODE=$?
    ;;
  all)
    TAGS=$TAG HEADLESS=$HEADLESS npx npm-run-all --parallel test:chromium:tags test:firefox:tags test:webkit:tags || TEST_EXIT_CODE=$?
    ;;
  *)
    echo "❌ Invalid browser: $BROWSER. Valid options are: chromium, firefox, webkit, all"
    exit 1
    ;;
esac

echo "✅ All tests were executed."

# Generate Allure Report
./triggers/allure/run_allure_web_results.sh open_allure=$OPEN_ALLURE

echo "✅ All done."

# Exit with captured test result
exit ${TEST_EXIT_CODE:-0}
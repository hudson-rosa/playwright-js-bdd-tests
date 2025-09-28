#!/bin/bash
set -e

# Remove Previous Allure Results
echo "___________________________________________"
echo "\n🎭 API • Playwright • JS • BDD • Allure ⚡"
echo "-------------------------------------------"
echo "     ▶ Starting..."

# RUN THIS FILE WITH THE COMMAND:
# E.g.:       ./test_pw_api.sh open_allure=true clear_old_results=true tag="@api"
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
if [ -z "$TAG" ]; then
  MISSING_ARGS+="\n ❌ TAG arg is missing on the command!\n    --> Use: tag='@smoke-api'|'@regression-api'|'@api...'"
fi
if [[ $TAG != @* ]]; then
  MISSING_ARGS+="\n ⚠️ Current TAG value must start with '@' under the brackets\n    --> Use: tag='@smoke-api'|'@regression-api'|'@api...'"
fi

# Show all missing arg messages at once
if [ -n "$MISSING_ARGS" ]; then
  echo -e "$MISSING_ARGS"
  exit 1
fi

# Clear old results if specified
if [[ $CLEAR_OLD_RESULTS == "true" ]]; then
  echo "\n 🗑 Cleaning up old reports..."
  npm run remove-allure-sh
fi

# Running tests
echo "\n▶ Running Playwright API tests"
echo "   ⤷ ✅ Open Allure              : $OPEN_ALLURE"
echo "   ⤷ ✅ Clear Old Allure Results : $CLEAR_OLD_RESULTS"
echo "   ⤷ ✅ Tag                      : $TAG"

npm run test:api:tags $TAG || TEST_EXIT_CODE=$?

echo "✅ All selected API tests were executed."

# Generate Allure Report
./run_allure_api_results.sh open_allure=$OPEN_ALLURE

echo "✅ All done."

# Exit with captured test result
exit ${TEST_EXIT_CODE:-0}
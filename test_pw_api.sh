#!/bin/bash
set -e

echo "___________________________________________"
echo "🎭 API • Playwright • JS • BDD • Allure ⚡"
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
  MISSING_ARGS+=" ❌ OPEN_ALLURE arg is missing on the command!    --> Use: open_allure=true|false"
fi
if [ -z "$CLEAR_OLD_RESULTS" ]; then
  MISSING_ARGS+=" ❌ CLEAR_OLD_RESULTS arg is missing on the command!    --> Use: clear_old_results=true|false"
fi
if [ -z "$TAG" ]; then
  MISSING_ARGS+=" ❌ TAG arg is missing on the command!    --> Use: tag='@smoke-api'|'@regression-api'|'@api...'"
fi
if [[ $TAG != @* ]]; then
  MISSING_ARGS+=" ⚠️ Current TAG value must start with '@' under the brackets    --> Use: tag='@smoke-api'|'@regression-api'|'@api...'"
fi

# Show all missing arg messages at once
if [ -n "$MISSING_ARGS" ]; then
  echo -e "$MISSING_ARGS"
  exit 1
fi

# Clear old results if specified
if [[ $CLEAR_OLD_RESULTS == "true" ]]; then
  echo "🗑 Cleaning up old reports..."
  npm run allure:remove-results:api
fi

# Running tests
echo "⚙️ API Environment variables:"
echo "   ⤷ ✅ Open Allure              : $OPEN_ALLURE"
echo "   ⤷ ✅ Clear Old Allure Results : $CLEAR_OLD_RESULTS"
echo "   ⤷ ✅ Tag                      : $TAG"
echo "__________________________"

npm run test:api:tags $TAG || TEST_EXIT_CODE=$?

echo "✅ All selected API tests were executed."

# Generate Allure Report
./triggers/allure/run_allure_report.sh open_allure=$OPEN_ALLURE test_level=api

# Exit with captured test result
exit ${TEST_EXIT_CODE:-0}
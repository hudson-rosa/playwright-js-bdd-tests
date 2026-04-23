#!/bin/bash
set -e

echo "____________________________________________"
echo "🎭 PEFORMANCE • Playwright • JS • Allure ⚡"
echo "--------------------------------------------"
echo "     ▶ Starting..."


# RUN THIS FILE WITH THE COMMAND:
# ./test_pw_performance.sh open_allure=true clear_old_results=true file="ddos-k6.test.js"
OPEN_ALLURE="false"
CLEAR_OLD_RESULTS="false"
FILE=""

# Parse named arguments

case $arg in
  open_allure=*)
    OPEN_ALLURE="${arg#*=}"
    shift
    ;;
  clear_old_results=*)
    CLEAR_OLD_RESULTS="${arg#*=}"
    shift
    ;;
  file=*)
    FILE="${arg#*=}"
    shift
    ;;
  *)
    echo "❌ Unknown argument: $arg"
    exit 1
    ;;
esac


MISSING_ARGS=""

if [ -z "$OPEN_ALLURE" ]; then
  MISSING_ARGS+=" ❌ OPEN_ALLURE arg is missing on the command!    --> Use: open_allure=true|false"
fi
if [ -z "$CLEAR_OLD_RESULTS" ]; then
  MISSING_ARGS+=" ❌ CLEAR_OLD_RESULTS arg is missing on the command!    --> Use: clear_old_results=true|false"
fi
if [ -z "$FILE" ]; then
  MISSING_ARGS+=" ❌ FILE arg is missing on the command!    --> Use: FILE='ddos-k6.test.js'"
fi
if [[ $FILE != @* ]]; then
  MISSING_ARGS+=" ⚠️ Current FILE value must start with '@' under the brackets    --> Use: FILE='ddos-k6.test.js'"
fi

# Show all missing arg messages at once
if [ -n "$MISSING_ARGS" ]; then
  echo -e "$MISSING_ARGS"
  exit 1
fi

# Clear old results if specified
if [[ $CLEAR_OLD_RESULTS == "true" ]]; then
  echo "🗑 Cleaning up old reports..."
  npm run allure:remove-results:perf
fi

# Running tests
echo "⚙️ PERFORMANCE Environment variables:"
echo "   ⤷ ✅ Open Allure              : $OPEN_ALLURE"
echo "   ⤷ ✅ Clear Old Allure Results : $CLEAR_OLD_RESULTS"
echo "   ⤷ ✅ File Name                : $FILE"
echo "__________________________"

npm run test:perf:file $FILE || TEST_EXIT_CODE=$?

echo "✅ All selected PERFORMANCE tests were executed."

# Generate Allure Report
./triggers/allure/run_allure_report.sh open_allure=$OPEN_ALLURE test_level=perf

# Exit with captured test result
exit ${TEST_EXIT_CODE:-0}
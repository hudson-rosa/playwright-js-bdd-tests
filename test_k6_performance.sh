#!/bin/bash
set -e

# RUN THIS FILE WITH THE COMMAND:
#   ./test_k6_performance.sh open_k6_reporter=true clear_old_results=true file="perf-tests/k6-tests/ddos-base-test.js" service_name=demo
#   ./test_k6_performance.sh open_k6_reporter=true clear_old_results=true file="perf-tests/k6-tests/demo/ddos-demo-single-file-test.js" service_name=null

echo "_________________________________________________"
echo "🎭 PEFORMANCE • Playwright • JS • K6 Reporter ⚡"
echo "-------------------------------------------------"
echo "     ▶ Starting..."

CLEAR_OLD_RESULTS="false"
OPEN_K6_REPORTER="false"
FILE=""
SERVICE_NAME=""

echo "CLEAR_OLD_RESULTS: $CLEAR_OLD_RESULTS"
echo "OPEN_K6_REPORTER: $OPEN_K6_REPORTER"
echo "FILE: $FILE"
echo "SERVICE_NAME: $SERVICE_NAME"

# Parse named arguments
for arg in "$@"; do
  case $arg in
    clear_old_results=*)
      CLEAR_OLD_RESULTS="${arg#*=}"
      ;;
    open_k6_reporter=*)
      OPEN_K6_REPORTER="${arg#*=}"
      ;;
    file=*)
      FILE="${arg#*=}"
      ;;
    service_name=*)
      SERVICE_NAME="${arg#*=}"
      ;;
  esac
done


MISSING_ARGS=""

if [ -z "$CLEAR_OLD_RESULTS" ]; then
  MISSING_ARGS+=" ❌ CLEAR_OLD_RESULTS arg is missing on the command!    --> Use: clear_old_results=true|false"
fi
if [ -z "$OPEN_K6_REPORTER" ]; then
  MISSING_ARGS+=" ❌ OPEN_K6_REPORTER arg is missing on the command!    --> Use: open_k6_reporter=true|false"
fi
if [ -z "$FILE" ]; then
  MISSING_ARGS+=" ❌ FILE arg is missing on the command!    --> Use: FILE='./perf-tests/k6-tests/ddos-base-test.js'"
fi
if [ -z "$SERVICE_NAME" ]; then
  MISSING_ARGS+=" ❌ SERVICE_NAME arg is missing on the command!    --> Use e.g.: service_name=demo --> matches an endpoint name in perf-tests/data/endpoints.js"
fi

# Show all missing arg messages at once
if [ -n "$MISSING_ARGS" ]; then
  echo -e "$MISSING_ARGS"
  exit 1
fi

Clear old results if specified
if [[ $CLEAR_OLD_RESULTS == "true" ]]; then
  echo "🗑 Cleaning up old reports..."
  npm run results:k6:remove:bash
  sleep 1
  npm run results:k6:create-folder:bash
fi

# Running tests
echo "⚙️ PERFORMANCE Environment variables:"
echo "   ⤷ ✅ Clear Old Allure Results : $CLEAR_OLD_RESULTS"
echo "   ⤷ ✅ Open K6 Reporter         : $OPEN_K6_REPORTER"
echo "   ⤷ ✅ File Name                : $FILE"
echo "   ⤷ ✅ Service Name             : $SERVICE_NAME"
echo "__________________________"

npm run test:perf:file:bash $FILE -- -e ENDPOINT=$SERVICE_NAME || TEST_EXIT_CODE=$?

echo "✅ All selected PERFORMANCE tests were executed."

# OPENING THE REPORTS
if [[ $OPEN_K6_REPORTER == "true" ]]; then
  echo "🚀 Opening K6 HTML Reporter..."
  sleep 3
  npm run results:k6:html:open:bash
fi

# Exit with captured test result
exit ${TEST_EXIT_CODE:-0}
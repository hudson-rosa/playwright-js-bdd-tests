#!/bin/bash
set -e

echo "___________________________________________"
echo "🎭 API • Playwright • JS • BDD • Allure ⚡"
echo "-------------------------------------------"
echo "     ▶ Starting..."


# RUN THIS FILE WITH THE COMMAND:
# E.g.:       ./test_pw_api.sh open_allure=true clear_old_results=true api_type=soapapi tag="@soap-api"
# E.g.:       ./test_pw_api.sh open_allure=true clear_old_results=true api_type=restapi tag="@rest-api"
API_TYPE=""
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
    api_type=*)
      API_TYPE="${arg#*=}"
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
if [ -z "$API_TYPE" ]; then
  MISSING_ARGS+=" ❌ API_TYPE arg is missing on the command!    --> Use: api_type=restapi|soapapi|api"
fi
if [ -z "$TAG" ]; then
  MISSING_ARGS+=" ❌ TAG arg is missing on the command!    --> Use: tag='@rest-api'|'@soap-api'|'@api...'"
fi
if [[ $TAG != @* ]]; then
  MISSING_ARGS+=" ⚠️ Current TAG value must start with '@' under the brackets    --> Use: tag='@rest-api'|'@soap-api'|'@api...'"
fi

# Show all missing arg messages at once
if [ -n "$MISSING_ARGS" ]; then
  echo -e "$MISSING_ARGS"
  exit 1
fi

# Running tests
echo "⚙️ API Environment variables:"
echo "   ⤷ ✅ Open Allure              : $OPEN_ALLURE"
echo "   ⤷ ✅ Clear Old Allure Results : $CLEAR_OLD_RESULTS"
echo "   ⤷ ✅ API Type                 : $API_TYPE"
echo "   ⤷ ✅ Tag                      : $TAG"
echo "________________________________________________________"
echo "▶ Running Playwright $API_TYPE API tests..."
echo "--------------------------------------------------------"

case "$API_TYPE" in
  soapapi)
    if [[ $CLEAR_OLD_RESULTS == "true" ]]; then
      echo "🗑 Cleaning up old SOAP API reports..."
      npm run allure:remove-results:api:soap
    fi
    TAGS=$TAG npm run test:api:soap:tags || TEST_EXIT_CODE=$?
    ;;
  restapi)
    if [[ $CLEAR_OLD_RESULTS == "true" ]]; then
      echo "🗑 Cleaning up old REST API reports..."
      npm run allure:remove-results:api:rest
    fi
    TAGS=$TAG npm run test:api:rest:tags || TEST_EXIT_CODE=$?
    ;;
  api)
    npm run allure:remove-results:api:soap
    npm run allure:remove-results:api:rest 
    TAGS=$TAG npx npm-run-all --parallel test:api:soap:tags test:api:rest:tags || TEST_EXIT_CODE=$?
    ;;
  *)
    echo "❌ Invalid API type: $API_TYPE. Valid options are: soapapi, restapi, api"
    exit 1
    ;;
esac

echo "✅ All selected $API_TYPE API tests were executed."

# Generate Allure Report
./triggers/allure/run_allure_report.sh open_allure=$OPEN_ALLURE test_level=$API_TYPE

# Exit with captured test result
exit ${TEST_EXIT_CODE:-0}
#!/bin/bash
set -e

# RUN THIS FILE WITH THE COMMAND:
# E.g.1:       ./triggers/allure/run_allure_report.sh open_allure=true test_level=api
# E.g.2:       ./triggers/allure/run_allure_report.sh open_allure=true test_level=web
# E.g.3:       ./triggers/allure/run_allure_report.sh open_allure=true test_level=mobile

# Default values
TEST_LEVEL=""
OPEN_ALLURE="false"

for arg in "$@"; do
  case $arg in
    open_allure=*)
      OPEN_ALLURE="${arg#*=}"
      shift
      ;;
    test_level=*)
      TEST_LEVEL="${arg#*=}"
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
if [ -z "$TEST_LEVEL" ]; then
  MISSING_ARGS+=" ❌ TEST_LEVEL arg is missing on the command!    --> Use: test_level=api|web|mobole"
fi

# Show all missing arg messages at once
if [ -n "$MISSING_ARGS" ]; then
  echo -e "$MISSING_ARGS"
  exit 1
fi

echo "✨✨ Generating Allure Report ✨✨..."
sleep 1

case "$TEST_LEVEL" in
  api)
     npm run allure:generate-report:api || TEST_EXIT_CODE=$?
    ;;
  web)
    npm run allure:generate-report:web || TEST_EXIT_CODE=$?
    ;;
  mobile)
    npm run allure:generate-report:mobile || TEST_EXIT_CODE=$?
    ;;
  *)
    echo "❌ Invalid test level name: $BROWSER. Valid options are: api, web, mobile"
    exit 1
    ;;
esac

echo "OPEN_ALLURE is: $OPEN_ALLURE"
if [ "$OPEN_ALLURE" = "true" ]; then
  sleep 1
  echo "📂 Opening Allure Report..."
  npm run allure:open
else
  echo "OPEN_ALLURE is not 'true', skipping..."
fi

echo "✅ All done."

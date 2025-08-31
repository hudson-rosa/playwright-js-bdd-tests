#!/bin/bash
set -e

# Remove Previous Allure Results
echo "_____________________________________"
echo "\n🎭 Playwright • API • JS • BDD • Allure ⚡"
echo "-------------------------------------"
echo "     ▶ Starting..."

echo "\n 🗑 Cleaning up old reports..."
npm run remove-allure

# Default values
# E.g.: sh run_pw_tests.sh open_allure=true tag="@api"
OPEN_ALLURE="false"
TAG=""

# Parse named arguments
for arg in "$@"; do
  case $arg in
    open_allure=*)
      OPEN_ALLURE="${arg#*=}"
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
if [ -z "$TAG" ]; then
  MISSING_ARGS+="\n ❌ TAG arg is missing on the command!\n    --> Use: tag='@smoke'|'@regression'|'@...'"
fi
if [[ $TAG != @* ]]; then
  MISSING_ARGS+="\n ⚠️ Current TAG value must start with '@' under the brackets\n    --> Use: tag='@smoke'|'@regression'|'@...'"
fi

# Show all missing arg messages at once
if [ -n "$MISSING_ARGS" ]; then
  echo -e "$MISSING_ARGS"
  exit 1
fi

echo "\n▶ Running Playwright API tests"
echo "   ⤷ ✅ Open Allure : $OPEN_ALLURE"
echo "   ⤷ ✅ Tag         : $TAG"


npm run test:api:tags $TAG || TEST_EXIT_CODE=$?

echo "✅ All selected API tests were executed."


./run_allure.sh open_allure=$OPEN_ALLURE

echo "✅ All done."

# Exit with captured test result
exit ${TEST_EXIT_CODE:-0}
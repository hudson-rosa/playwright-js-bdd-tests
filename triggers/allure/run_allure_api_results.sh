#!/bin/bash
set -e

# RUN THIS FILE WITH THE COMMAND:
# E.g.:       ./triggers/allure/run_allure_api_results.sh open_allure=true

# Default values
OPEN_ALLURE="false"

for arg in "$@"; do
  case $arg in
    open_allure=*)
      OPEN_ALLURE="${arg#*=}"
      shift
      ;;
    *)
      echo "❌ Unknown argument: $arg"
      exit 1
      ;;
  esac
done

echo "\n ✨✨ Generating Allure Report ✨✨..."
sleep 2
npm run allure:generate-report:api

echo "OPEN_ALLURE is: $OPEN_ALLURE"
if [ "$OPEN_ALLURE" = "true" ]; then
  sleep 2
  echo "📂 Opening Allure Report..."
  npm run allure:open
else
  echo "OPEN_ALLURE is not 'true', skipping..."
fi

echo "✅ All done."

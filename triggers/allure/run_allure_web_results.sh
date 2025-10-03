#!/bin/bash
set -e

# RUN THIS FILE WITH THE COMMAND:
# E.g.:       ./triggers/allure/run_allure_web_results.sh open_allure=true

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

MISSING_ARGS=""

if [ -z "$OPEN_ALLURE" ]; then
  MISSING_ARGS+="\n ❌ OPEN_ALLURE arg is missing on the command!\n    --> Use: open_allure=true|false"
fi

# Show all missing arg messages at once
if [ -n "$MISSING_ARGS" ]; then
  echo -e "$MISSING_ARGS"
  exit 1
fi

echo "\n✨✨ Generating Allure Report ✨✨..."
sleep 2
npm run allure:generate-report:web

echo "OPEN_ALLURE is: $OPEN_ALLURE"
if [ "$OPEN_ALLURE" = "true" ]; then
  sleep 1
  echo "📂 Opening Allure Report..."
  npm run allure:open
else
  echo "OPEN_ALLURE is not 'true', skipping..."
fi

echo "✅ All done."

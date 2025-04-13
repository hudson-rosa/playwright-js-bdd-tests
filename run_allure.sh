#!/bin/bash
set -e

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

echo "\n✨✨ Generating Allure Report ✨✨..."
sleep 2
npm run generate:allure-report

echo "OPEN_ALLURE is: $OPEN_ALLURE"
if [ "$OPEN_ALLURE" = "true" ]; then
  sleep 2
  echo "📂 Opening Allure Report..."
  npm run open:allure-report
else
  echo "OPEN_ALLURE is not 'true', skipping..."
fi

echo "✅ All done."

#!/bin/bash
set -e

# Default values
OPEN_ALLURE="false"
BROWSER=""
HEADLESS="true"
TAG="@regression"

# Parse named arguments
for arg in "$@"; do
  case $arg in
  open_allure=*)
    OPEN_ALLURE="${arg#*=}"
    shift
    ;;
  browser=*)
    BROWSER="${arg#*=}"
    shift
    ;;
  headless=*)
    HEADLESS="${arg#*=}"
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

if [ -z "$BROWSER" ]; then
  echo "\nSome arguments are missing for this command! "
  echo "✅ OPEN_ALLURE arg is 'false' by default. --> Use: open_allure=true|false"
  echo "❌ No browser specified.                  --> Use: browser=chromium|firefox|webkit|all"
  echo "✅ HEADLESS arg is 'true' by default.     --> Use: headless=true|false"
  echo "✅ TAG arg is '@regression' by default.   --> Use: tag='@smoke'|'@regression'\n"
  exit 1
fi

echo "▶ Running Playwright tests"
echo "   ⤷ Open Allure : $OPEN_ALLURE"
echo "   ⤷ Browser     : $BROWSER"
echo "   ⤷ Headless    : $HEADLESS"
echo "   ⤷ Tag         : $TAG"

# Remove Previous Allure Results
npm run remove-allure

case "$BROWSER" in
chromium)
  HEADLESS=$HEADLESS npm run test:chromium:tags $TAG
  ;;
firefox)
  HEADLESS=$HEADLESS npm run test:firefox:tags $TAG
  ;;
webkit)
  HEADLESS=$HEADLESS npm run test:webkit:tags $TAG
  ;;
all)
  HEADLESS=$HEADLESS npx npm-run-all -p \
    test:chromium:tags $TAG \
    test:firefox:tags $TAG \
    test:webkit:tags $TAG
  ;;
*)
  echo "❌ Invalid browser: $BROWSER. Valid options are: chromium, firefox, webkit, all"
  exit 1
  ;;
esac

echo "✨✨ Generating Allure Report ✨✨..."
npm run generate:allure-report

if [ "$OPEN_ALLURE" == "true" ]; then
  echo "📂 Opening Allure Report..."
  npm run open:allure-report
fi

echo "✅ All done."

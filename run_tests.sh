
#!/bin/bash
set -e

echo "▶ Running Playwright tests LOCALLY across all browsers..."
npm run test:all-browsers:smoke

echo "▶ Generating Allure Report..."
sleep 1
npm run generate:allure-report
npm run open:allure-report

echo "✅ All done."
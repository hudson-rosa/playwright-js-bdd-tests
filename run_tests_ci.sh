
#!/bin/bash
set -e

echo "▶ Running Playwright tests in CI across all browsers - HEADLESS MODE=true..."
npm run test:all-browsers:smoke:headless

echo "▶ Generating Allure Report..."
npm run generate:allure-report

echo "✅ All done."
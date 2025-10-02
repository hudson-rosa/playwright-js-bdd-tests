
#!/bin/bash
set -e

# RUN THIS FILE WITH THE COMMAND:  ./triggers/installation/install_dependency_updates.sh

echo "_____________________________________"
echo "🎭 PROJECT DEPENDENCIES UPDATE ⚡"
echo "-------------------------------------"

echo "------> Installing Playwright browsers through NPX..."
npm install playwright
npx playwright install
playwright --version

echo "------> Outdated NPM packages:"
npm outdated

echo "------> Updating all dependencies from the project to their latest versions..."
ncu -u
npm install

# echo "------> Updating NPM devDependencies..."
# npm install --save-dev @playwright/test@latest \
#  @types/node@latest \
#  allure-commandline@latest \
#  allure-cucumberjs@latest \
#  allure-playwright@latest \
#  appium-uiautomator2-driver@latest \
#  appium-xcuitest-driver@latest \
#  cross-env@latest \
#  cucumber@latest \
#  cucumber-playwright@latest \
#  dotenv-cli@latest \
#  npm-run-all@latest \
#  playwright@latest \
#  ts-node@latest \
#  typescript@latest

# echo "------> Updating NPM Dependencies..."
# npm install --save allure-js-commons@latest \
#  @appium/doctor@latest \
#  appium@latest \
#  axios@latest \
#  dotenv@latest \
#  npm@latest \
#  openai@latest \
#  rimraf@latest \
#  sanitize-filename@latest \
#  webdriverio@latest

echo "✅ All main packages installed."

# echo "------> Initializing Playwright..."
# npm init playwright@latest --yes
# echo "✅ All done."
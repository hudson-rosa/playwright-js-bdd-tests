
#!/bin/bash

echo "------> Initializing npm..."
npm init -y

echo "✅ All done."

echo "------> Installing packages: Playwright + Cucumber ..."
npm install --save-dev playwright @playwright/test cucumber @cucumber/cucumber cucumber-playwright ts-node typescript
npm install allure-js-commons allure-cucumberjs
npm install allure-commandline --save-dev
npm install playwright
echo "..."
playwright --version
echo "✅ All main packages installed."

# echo "------> Initializing Playwright..."
# npm init playwright@latest

echo "------> Globally installing iOS / Android Resources..."
npm install -g appium@latest
npm install -g appium @appium/doctor
brew install android-platform-tools
brew install libimobiledevice
appium driver list

echo "✅ All done."

#!/bin/bash

echo "------> Initializing npm..."
npm init -y

echo "✅ All done."

echo "------> Installing packages: Playwright + Cucumber ..."
npm install --save-dev playwright @playwright/test cucumber @cucumber/cucumber cucumber-playwright ts-node typescript
npm install allure-js-commons allure-cucumberjs
npm install -g allure-commandline --save-dev
npm install -g dotenv
echo "..."
playwright --version 
echo "✅ All main packages installed."

echo "------> Initializing Playwright..."
npm init playwright@latest

echo "------> iOS / Android Resources..."
npm install appium @appium/doctor
brew install android-platform-tools
brew install libimobiledevice
appium driver list

echo "✅ All done."
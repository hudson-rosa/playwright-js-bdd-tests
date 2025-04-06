
#!/bin/bash

echo "------> Initializing npm..."
npm init -y

echo "------- DONE --------"

echo "------> Installing packages: Playwright + Cucumber ..."
npm install --save-dev playwright @playwright/test cucumber @cucumber/cucumber cucumber-playwright ts-node typescript
npm install allure-js-commons allure-cucumberjs
npm install -g allure-commandline --save-dev
npm install -g dotenv
echo " "
playwright --version 
echo "------- DONE --------"

echo "------> Initializing Playwright..."
npm init playwright@latest
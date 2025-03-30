
#!/bin/bash

echo "------> Initializing npm..."
npm init -y

echo "------- DONE --------"

echo "------> Installing packages: Playwright + Cucumber ..."
npm install --save-dev playwright @playwright/test cucumber @cucumber/cucumber ts-node typescript
echo " "
playwright --version 
echo "------- DONE --------"

echo "------> Initializing Playwright..."
npm init playwright@latest
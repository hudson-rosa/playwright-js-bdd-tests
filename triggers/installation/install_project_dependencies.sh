#!/bin/bash
set -e 

# RUN THIS FILE WITH THE COMMAND:  ./triggers/installation/install_project_dependencies.sh

echo "_________________________________________"
echo "🎭 INITIALIZING PLAYWRIGHT-JS-BDD-TESTS ⚡"
echo "-----------------------------------------"

echo "🥁 Installing Basic Dependencies..."
npm install
npm init -y

# Run a single scenario to check if everything works:
echo "▶ Running quick tests on Chromium, Firefox and Webkit..."
npx playwright test signInOrangeHrm.spec.js

echo "✅ All done."
#!/bin/bash

echo "------> Installing Basic Dependencies..."
# brew install node
npm install -g npm
npm init -y

# Run a single scenario to check if everything works:
npx playwright test signInOrangeHrm
#!/bin/bash
set -e

# RUN THIS FILE WITH THE COMMAND:  ./run_appium_server.sh

# Remove Previous Allure Results
echo "_____________________________________"
echo "\n🎭 APPIUM SERVER ⚡"
echo "-------------------------------------"
echo "     ▶ Starting..."

# Ensure Xcode Command Line Tools are installed
echo "------> Checking for Xcode Command Line Tools..."
xcode-select --install || true

# Install Carthage for iOS dependencies
echo "------> Installing Carthage..."
brew install carthage
brew install ios-deploy

# ~/Library/Developer/Xcode/DerivedData/<AppName-xxxx>/Build/Products/Debug-iphonesimulator/AppName.app


#!/bin/bash
set -e

# RUN THIS FILE WITH THE COMMAND:  ./triggers/installation/install_xcode_builders.sh

echo "_____________________________________"
echo "🎭 XCODE RESOURCES ⚡"
echo "-------------------------------------"
echo "     ▶ Installing..."

# Ensure Xcode Command Line Tools are installed
echo "🔎 Checking for Xcode Command Line Tools..."
xcode-select --install || true

# Install Carthage for iOS dependencies
echo "🥁 Installing Carthage..."
brew install carthage
brew install ios-deploy

echo "✅ Xcode tools installed!"

# ~/Library/Developer/Xcode/DerivedData/<AppName-xxxx>/Build/Products/Debug-iphonesimulator/AppName.app


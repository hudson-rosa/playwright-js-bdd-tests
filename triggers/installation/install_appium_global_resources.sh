
#!/bin/bash
set -e

# RUN THIS FILE WITH THE COMMAND:  ./triggers/installation/install_appium_global_resources.sh

echo "_____________________________________"
echo "🎭 NODE RESOURCES ⚡"
echo "-------------------------------------"

echo "------> Globally installing iOS / Android Resources..."
npm install --save appium@latest
npm install --save appium @appium/doctor
brew install android-platform-tools
brew install libimobiledevice
appium driver list

echo "✅ All done."
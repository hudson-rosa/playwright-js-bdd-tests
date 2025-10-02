#!/bin/bash
set -e

# RUN THIS FILE WITH THE COMMAND:  ./triggers/checks/check_mobile_devices.sh

echo "------> Checking Android Devices connected..."
adb devices
echo "✅ Revealed all the connected Android devices!"

echo "------> Checking iOS Devices connected..."
idevice_id -l
echo "✅ Revealed all the connected iOS devices!"

echo "------> Checking All devices simulators available..."
xcrun xctrace list devices
echo "✅ Revealed all the device simulators available!"

# echo "------> Installing iOS app on connected device..."
# unzip iOS-Real-Device-Saucelabs-MyDemo.1.3.0-162.ipa -d iOS-Real-Device-Saucelabs-MyDemo.1.3.0-162
# codesign -f -s "com.saucelabs.mydemoapp.rn" --entitlements Entitlements.plist ./iOS-Real-Device-Saucelabs-MyDemo.1.3.0-162/Payload/MyRNDemoApp.app
# codesign -dvvv iOS-Real-Device-Saucelabs-MyDemo.1.3.0-162/Payload/MyRNDemoApp.app
# ios-deploy --id <UDID> --bundle ./app-dist/iOS-Real-Device-Saucelabs-MyDemo.1.3.0-162.ipa

# xcodebuild -exportArchive \
#   -archivePath ./MyApp.xcarchive \
#   -exportPath ./output \
#   -exportOptionsPlist ExportOptions.plist

# xcrun xcodebuild -exportArchive -archivePath ./app-dist/iOS-Simulator-Saucelabs-MyDemo.app/MyRNDemoApp.app -exportPath ./InstalledApp -exportOptionsPlist ExportOptions.plist
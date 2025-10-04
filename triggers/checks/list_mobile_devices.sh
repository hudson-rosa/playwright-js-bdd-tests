#!/bin/bash
set -e

# RUN THIS FILE WITH THE COMMAND:  ./triggers/checks/list_mobile_devices.sh

echo "______________________________________"
echo "🎭 LISTING ANDROID/IOS DEVICES ⚡"
echo "--------------------------------------"
echo "     ▶ Checking..."

echo ""
echo "=============================================="
echo "🔎 Finding Android Devices connected..."
adb devices
echo "✅ Revealed all the connected Android devices!"
echo "=============================================="
echo ""
echo "🔎 Finding All Android Emulators available..."
emulator -list-avds
echo "✅ Revealed all the Android Emulators!"
echo "=============================================="
echo ""
echo "🔎 Finding IOS Real Devices connected..."
idevice_id -l
echo "✅ Revealed all the connected iOS devices!"
echo "=============================================="
echo ""
echo "🔎 Finding All IOS Emulators available..."
xcrun xctrace list devices
echo "✅ Revealed all the IOS Emulators!"
echo "=============================================="

# echo "🥁 Installing iOS app on connected device..."
# unzip iOS-Real-Device-Saucelabs-MyDemo.1.3.0-162.ipa -d iOS-Real-Device-Saucelabs-MyDemo.1.3.0-162
# codesign -f -s "com.saucelabs.mydemoapp.rn" --entitlements Entitlements.plist ./iOS-Real-Device-Saucelabs-MyDemo.1.3.0-162/Payload/MyRNDemoApp.app
# codesign -dvvv iOS-Real-Device-Saucelabs-MyDemo.1.3.0-162/Payload/MyRNDemoApp.app
# ios-deploy --id <UDID> --bundle ./app-dist/iOS-Real-Device-Saucelabs-MyDemo.1.3.0-162.ipa

# xcodebuild -exportArchive \
#   -archivePath ./MyApp.xcarchive \
#   -exportPath ./output \
#   -exportOptionsPlist ExportOptions.plist

# xcrun xcodebuild -exportArchive -archivePath ./app-dist/iOS-Simulator-Saucelabs-MyDemo.app/MyRNDemoApp.app -exportPath ./InstalledApp -exportOptionsPlist ExportOptions.plist
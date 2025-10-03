#!/bin/bash
set -e

# RUN THIS FILE WITH THE COMMAND:  ./triggers/installation/install_apk_on_device.sh app_path=./app-dist/ApiDemos-debug.apk app_package=io.appium.android.apis target_device=real|emulator

APP_PATH=""
APP_PACKAGE=""
TARGET_DEVICE="real"

for arg in "$@"; do
  case $arg in
    app_path=*)
      APP_PATH="${arg#*=}"
      shift
      ;;
    app_package=*)
      APP_PACKAGE="${arg#*=}"
      shift
      ;;
    target_device=*)
      TARGET_DEVICE="${arg#*=}"
      shift
      ;;
    *)
      echo "❌ Unknown argument: $arg"
      exit 1
      ;;
  esac
done

MISSING_ARGS=""

if [ -z "$APP_PACKAGE" ]; then
  MISSING_ARGS+="\n ❌ APP_PACKAGE arg is missing on the command!\n    --> Use: app_package=your.app.package"
fi
if [ -z "$APP_PATH" ]; then
  MISSING_ARGS+="\n ❌ APP_PATH arg is missing on the command!\n    --> Use: app_path=./app-dist/ApiDemos-debug.apk"
fi
if [ -z "$TARGET_DEVICE" ]; then
  MISSING_ARGS+="\n ❌ TARGET_DEVICE arg is missing on the command!\n    --> Use: target_device=real|emulator"
fi

# List all the available AVDs
AVDS=$(emulator -list-avds)

if [ -z "$AVDS" ]; then
  echo "❌ No AVD found! Please, create an Android Virtual Device (AVD) on Android Studio first."
  exit 1
fi

case "$TARGET_DEVICE" in
  real)
    echo "     ▶ Installing APK on real device..."
    npm run android:adb:install-apk -- $APP_PATH 
    
    echo "------> Verifying and opening the installed app..."
    adb shell pm list packages | grep $APP_PACKAGE
    adb shell monkey -p $APP_PACKAGE 1 || TEST_EXIT_CODE=$?
    ;;
    
  emulator)
    echo "📱 Available emulators:"
    echo "$AVDS" | nl -w2 -s'. '

    # Ask the user to choose an emulator
    echo "📱 ___________________________________________________________"
    read -p "👉 Enter the number from one of the emulators listed: " choice

    # Get the selected AVD name
    AVD_NAME=$(echo "$AVDS" | sed -n "${choice}p")

    if [ -z "$AVD_NAME" ]; then
    echo "❌ Invalid option!"
    exit 1
    fi

    echo "🚀 Starting emulator: $AVD_NAME ..."
    emulator -avd "$AVD_NAME"

    sleep 10
    echo "------> Installing the app from based on the App path..."
    npm run android:adb:install-apk -- $APP_PATH || TEST_EXIT_CODE=$?
    ;;
  *)
    echo "❌ Invalid target device: $TARGET_DEVICE. Valid options are: real, emulator"
    exit 1
    ;;
esac

echo "✅ App installed successfully"

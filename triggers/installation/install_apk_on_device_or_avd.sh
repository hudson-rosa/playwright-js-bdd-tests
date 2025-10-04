#!/bin/bash
set -e

# RUN THIS FILE WITH THE COMMAND:  ./triggers/installation/install_apk_on_device_or_avd.sh app_path=./app-dist/ApiDemos-debug.apk app_package=io.appium.android.apis target_device=real|emulator

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
  MISSING_ARGS+=" ❌ APP_PACKAGE arg is missing on the command!    --> Use: app_package=your.app.package"
fi
if [ -z "$APP_PATH" ]; then
  MISSING_ARGS+=" ❌ APP_PATH arg is missing on the command!    --> Use: app_path=./app-dist/ApiDemos-debug.apk"
fi
if [ -z "$TARGET_DEVICE" ]; then
  MISSING_ARGS+=" ❌ TARGET_DEVICE arg is missing on the command!    --> Use: target_device=real|emulator"
fi

case "$TARGET_DEVICE" in
  real)
      # Filter devices/emulators connected
      devices=$(adb devices | grep -w "device" | grep -v "List" | grep -v "emulator")
      
      if [ -z "$devices" ]; then
          echo "❌ No real devices connected."
          exit 1
      else
          echo "✅ Real device(s) connected:"
          echo "$devices"
          exit 0
      fi
    
      echo "🥁 Installing APK on real device..."
      npm run android:adb:install-apk -- $APP_PATH 
      
      echo "🔎 Verifying and opening the installed app..."
      adb shell pm list packages | grep $APP_PACKAGE
      adb shell monkey -p $APP_PACKAGE 1 || TEST_EXIT_CODE=$?
  ;;
  emulator)
    # List all the available AVDs
    AVDS=$(emulator -list-avds)

    if [ -z "$AVDS" ]; then
      echo "❌ No AVD found! Please, create an Android Virtual Device (AVD) on Android Studio first."
      exit 1
    fi

    echo "📱 Available emulators:"
    echo "$AVDS" | nl -w2 -s'. '

    # Asking user to choose an emulator by position index in the list
    echo "📱 ___________________________________________________________"
    read -p "👉 Enter the number from one of the emulators listed: " choice

    # Getting the selected AVD name
    AVD_NAME=$(echo "$AVDS" | sed -n "${choice}p")

    if [ -z "$AVD_NAME" ]; then
      echo "❌ Invalid option!"
      exit 1
    fi

    echo "🚀 Starting emulator: $AVD_NAME ..."
    emulator -avd "$AVD_NAME"

    # Wait until emulator is started and ready
    echo "⏳ Waiting emulator to be started..."
    adb wait-for-device
    echo "✅ Emulador $first_avd is ready to use!"
    
    echo "🥁 Installing the app from based on the App path..."
    npm run android:adb:install-apk -- $APP_PATH || TEST_EXIT_CODE=$?
    ;;
  *)
    echo "❌ Invalid target device: $TARGET_DEVICE. Valid options are: real, emulator"
    exit 1
    ;;
esac

echo "✅ App installed successfully"

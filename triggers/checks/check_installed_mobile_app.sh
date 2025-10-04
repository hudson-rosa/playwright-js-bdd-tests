#!/bin/bash
set -e

# RUN THIS FILE WITH THE COMMAND:  ./triggers/checks/check_installed_mobile_app.sh app_package=io.appium.android.apis

APP_PACKAGE=""

for arg in "$@"; do
  case $arg in
    app_package=*)
      APP_PACKAGE="${arg#*=}"
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
  MISSING_ARGS+="❌ APP_PACKAGE arg is missing on the command!    --> Use: app_package=your.app.package"
fi

echo "🔎 Verifying and opening the installed app..."
adb shell pm list packages | grep $APP_PACKAGE
adb shell monkey -p $APP_PACKAGE 1

echo "✅ All done."
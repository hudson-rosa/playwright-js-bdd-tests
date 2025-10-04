#!/bin/bash
set -e

# RUN THIS FILE WITH THE COMMAND:  ./triggers/appium/start_android_device.sh target_device=real|emulator

echo "______________________________________"
echo "🎭 ANDROID DEVICES - REAL / EMULATOR ⚡"
echo "--------------------------------------"
echo "     ▶ Starting..."

TARGET_DEVICE=""

# Parse named arguments
for arg in "$@"; do
  case $arg in
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

if [ -z "$TARGET_DEVICE" ]; then
  MISSING_ARGS+=" ❌ TARGET_DEVICE arg is missing on the command!    --> Use: target_device=real|emulator"
fi

# Show all missing arg messages at once
if [ -n "$MISSING_ARGS" ]; then
  echo -e "$MISSING_ARGS"
  exit 1
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
        fi
    ;;
    emulator)
        # Listing available AVDs
        avds=$(emulator -list-avds)
        
        if [ -z "$avds" ]; then
            echo "❌ No AVD found! Please create one in Android Studio."
            exit 1
        fi     

        # Selecting the first AVD from the list
        first_avd=$(echo "$avds" | head -n 1)
        echo "🚀 Starting emulator (1th option): $first_avd ..."
        
        # Starting emulator in a background process
        nohup emulator -avd "$first_avd" -netdelay none -netspeed full > android_device_run.log 2>&1 &
        EMULATOR_PID=$!

        # Save the PID so we can kill it later
        echo $EMULATOR_PID > /tmp/emulator_pid.txt

        # Wait until emulator is started and ready
        echo "⏳ Waiting emulator to be started..."
        adb wait-for-device

        # Extra check: wait until system property sys.boot_completed = 1
        until adb shell getprop sys.boot_completed 2>/dev/null | grep -q "1"; do
          sleep 2
        done

        echo "✅ Emulator $first_avd is ready (PID $EMULATOR_PID)."
    ;;
    *)
        echo "❌ Invalid device option name: $TARGET_DEVICE. Valid options is: real, emulator"
        exit 1
    ;;
esac

echo "✅ Device is ready to use!"

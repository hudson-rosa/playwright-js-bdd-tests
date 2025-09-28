#!/bin/bash

echo "\n------> Checking Android Devices connected..."
adb devices

echo "\n------> Checking iOS Devices connected..."
idevice_id -l
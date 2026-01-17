#!/bin/bash
# APK Installer
# Installs APK to connected Android device or emulator

set -e

echo "================================"
echo "APK Installer"
echo "================================"
echo ""

# Check if adb is available
if ! command -v adb &> /dev/null; then
    echo "❌ Error: adb not found"
    echo "adb comes with Android SDK Platform Tools."
    echo "Install it or add it to your PATH."
    exit 1
fi

# Check for connected devices
echo "🔍 Checking for connected devices..."
DEVICE_COUNT=$(adb devices | grep -v "List of devices" | grep -c "device$" || true)

if [ "$DEVICE_COUNT" -eq 0 ]; then
    echo "❌ No Android devices found"
    echo ""
    echo "💡 Make sure:"
    echo "   - Your Android device is connected via USB"
    echo "   - USB debugging is enabled on the device"
    echo "   - Or an Android emulator is running"
    exit 1
fi

echo "✅ Found $DEVICE_COUNT device(s)"
echo ""

# Find APK files
DEBUG_APK="platforms/android/app/build/outputs/apk/debug/app-debug.apk"
RELEASE_APK="platforms/android/app/build/outputs/apk/release/app-release-signed.apk"
RELEASE_UNSIGNED="platforms/android/app/build/outputs/apk/release/app-release.apk"

APK_TO_INSTALL=""

# Check which APKs are available
if [ -f "$RELEASE_APK" ]; then
    echo "📦 Found signed release APK"
    APK_TO_INSTALL="$RELEASE_APK"
    APK_TYPE="Release (Signed)"
elif [ -f "$RELEASE_UNSIGNED" ]; then
    echo "📦 Found release APK"
    APK_TO_INSTALL="$RELEASE_UNSIGNED"
    APK_TYPE="Release"
elif [ -f "$DEBUG_APK" ]; then
    echo "📦 Found debug APK"
    APK_TO_INSTALL="$DEBUG_APK"
    APK_TYPE="Debug"
else
    echo "❌ No APK files found"
    echo ""
    echo "Build an APK first:"
    echo "   - Debug: cordova build android"
    echo "   - Release: cordova build android --release"
    exit 1
fi

echo "📲 Installing $APK_TYPE APK..."
echo "   $APK_TO_INSTALL"
echo ""

# Install the APK
adb install -r "$APK_TO_INSTALL"

echo ""
echo "✅ APK installed successfully!"
echo ""
echo "💡 The app should now appear on your device"

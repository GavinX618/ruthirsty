#!/bin/bash
# Cordova Debug APK Builder
# Builds a debug APK for development and testing

set -e

echo "================================"
echo "Cordova Debug APK Builder"
echo "================================"
echo ""

# Check if cordova is installed
if ! command -v cordova &> /dev/null; then
    echo "❌ Error: Cordova CLI is not installed"
    echo "Install it with: npm install -g cordova"
    exit 1
fi

# Check if config.xml exists
if [ ! -f "config.xml" ]; then
    echo "❌ Error: Not in a Cordova project directory (config.xml not found)"
    exit 1
fi

# Check if Android platform is added
if [ ! -d "platforms/android" ]; then
    echo "⚠️  Android platform not found. Adding it now..."
    cordova platform add android
fi

echo "🔨 Building debug APK..."
echo ""

cordova build android --debug

echo ""
echo "✅ Debug APK built successfully!"
echo ""
echo "📦 APK Location:"
echo "   platforms/android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "💡 To install on a connected device, run:"
echo "   adb install platforms/android/app/build/outputs/apk/debug/app-debug.apk"
echo "   or use: cordova run android"

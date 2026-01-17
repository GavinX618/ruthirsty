#!/bin/bash
# Cordova Release APK Builder
# Builds a release APK with optional signing

set -e

echo "================================"
echo "Cordova Release APK Builder"
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

# Check for build.json configuration file
if [ -f "build.json" ]; then
    echo "✅ Found build.json - Will use signing configuration from file"
    echo "🔨 Building signed release APK..."
    echo ""
    cordova build android --release

    echo ""
    echo "✅ Signed release APK built successfully!"
    echo ""
    echo "📦 APK Location:"
    echo "   platforms/android/app/build/outputs/apk/release/app-release.apk"
else
    echo "⚠️  No build.json found - Building unsigned release APK"
    echo "🔨 Building release APK..."
    echo ""
    cordova build android --release

    echo ""
    echo "✅ Unsigned release APK built successfully!"
    echo ""
    echo "📦 APK Location:"
    echo "   platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk"
    echo ""
    echo "⚠️  Note: This APK is unsigned and cannot be installed on devices."
    echo "💡 To sign it, either:"
    echo "   1. Create a build.json file with signing configuration"
    echo "   2. Run the sign_apk.sh script manually"
fi

echo ""

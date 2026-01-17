#!/bin/bash
# APK Signer
# Signs an unsigned APK with a keystore

set -e

echo "================================"
echo "APK Signer"
echo "================================"
echo ""

# Check if jarsigner is available
if ! command -v jarsigner &> /dev/null; then
    echo "❌ Error: jarsigner not found"
    echo "jarsigner comes with Java JDK. Please install Java JDK."
    exit 1
fi

# Check if zipalign is available
if ! command -v zipalign &> /dev/null; then
    echo "⚠️  Warning: zipalign not found (comes with Android SDK)"
    echo "The APK will be signed but not optimized."
    ZIPALIGN_AVAILABLE=false
else
    ZIPALIGN_AVAILABLE=true
fi

# Find unsigned APK
UNSIGNED_APK="platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk"

if [ ! -f "$UNSIGNED_APK" ]; then
    echo "❌ Error: Unsigned APK not found at $UNSIGNED_APK"
    echo "Build a release APK first with: cordova build android --release"
    exit 1
fi

echo "📦 Found unsigned APK: $UNSIGNED_APK"
echo ""

# Get keystore path
read -p "Keystore path: " KEYSTORE
if [ ! -f "$KEYSTORE" ]; then
    echo "❌ Error: Keystore not found: $KEYSTORE"
    exit 1
fi

# Get alias
read -p "Key alias: " ALIAS

# Get passwords
read -sp "Keystore password: " STORE_PASS
echo ""
read -sp "Key password (press Enter if same as keystore): " KEY_PASS
echo ""
if [ -z "$KEY_PASS" ]; then
    KEY_PASS=$STORE_PASS
fi

echo ""
echo "🔐 Signing APK..."

# Create output filenames
SIGNED_UNALIGNED="platforms/android/app/build/outputs/apk/release/app-release-signed-unaligned.apk"
SIGNED_APK="platforms/android/app/build/outputs/apk/release/app-release-signed.apk"

# Sign the APK
jarsigner -verbose \
    -sigalg SHA256withRSA \
    -digestalg SHA-256 \
    -keystore "$KEYSTORE" \
    -storepass "$STORE_PASS" \
    -keypass "$KEY_PASS" \
    -signedjar "$SIGNED_UNALIGNED" \
    "$UNSIGNED_APK" \
    "$ALIAS"

echo ""

# Optimize with zipalign if available
if [ "$ZIPALIGN_AVAILABLE" = true ]; then
    echo "⚙️  Optimizing APK with zipalign..."
    zipalign -v 4 "$SIGNED_UNALIGNED" "$SIGNED_APK"
    rm "$SIGNED_UNALIGNED"

    echo ""
    echo "✅ APK signed and optimized successfully!"
    echo ""
    echo "📦 Signed APK: $SIGNED_APK"
else
    mv "$SIGNED_UNALIGNED" "$SIGNED_APK"

    echo ""
    echo "✅ APK signed successfully (not optimized)"
    echo ""
    echo "📦 Signed APK: $SIGNED_APK"
fi

echo ""
echo "💡 To verify the signature:"
echo "   jarsigner -verify -verbose -certs $SIGNED_APK"
echo ""
echo "💡 To install on a connected device:"
echo "   adb install $SIGNED_APK"

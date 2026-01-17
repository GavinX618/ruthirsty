#!/bin/bash
# Android Keystore Generator
# Creates a new keystore for signing Android APKs

set -e

echo "================================"
echo "Android Keystore Generator"
echo "================================"
echo ""

# Check if keytool is available
if ! command -v keytool &> /dev/null; then
    echo "❌ Error: keytool not found"
    echo "keytool comes with Java JDK. Please install Java JDK."
    exit 1
fi

# Default values
DEFAULT_KEYSTORE="my-release-key.keystore"
DEFAULT_ALIAS="my-key-alias"
DEFAULT_VALIDITY=10000

# Get keystore filename
read -p "Keystore filename [$DEFAULT_KEYSTORE]: " KEYSTORE
KEYSTORE=${KEYSTORE:-$DEFAULT_KEYSTORE}

# Check if keystore already exists
if [ -f "$KEYSTORE" ]; then
    echo "⚠️  Warning: $KEYSTORE already exists!"
    read -p "Overwrite? (y/N): " OVERWRITE
    if [ "$OVERWRITE" != "y" ] && [ "$OVERWRITE" != "Y" ]; then
        echo "Cancelled."
        exit 0
    fi
    rm "$KEYSTORE"
fi

# Get alias
read -p "Key alias [$DEFAULT_ALIAS]: " ALIAS
ALIAS=${ALIAS:-$DEFAULT_ALIAS}

# Get validity
read -p "Validity (days) [$DEFAULT_VALIDITY]: " VALIDITY
VALIDITY=${VALIDITY:-$DEFAULT_VALIDITY}

echo ""
echo "🔐 Generating keystore..."
echo ""
echo "You will be prompted for:"
echo "  - Keystore password (remember this!)"
echo "  - Key password (can be same as keystore password)"
echo "  - Your name, organization, etc."
echo ""

keytool -genkey -v \
    -keystore "$KEYSTORE" \
    -alias "$ALIAS" \
    -keyalg RSA \
    -keysize 2048 \
    -validity $VALIDITY

echo ""
echo "✅ Keystore created successfully!"
echo ""
echo "📁 Keystore file: $KEYSTORE"
echo "🔑 Alias: $ALIAS"
echo ""
echo "⚠️  IMPORTANT: Keep this information safe!"
echo ""
echo "To use this keystore for signing, create a build.json file:"
echo ""
echo "{"
echo "  \"android\": {"
echo "    \"release\": {"
echo "      \"keystore\": \"$KEYSTORE\","
echo "      \"storePassword\": \"YOUR_KEYSTORE_PASSWORD\","
echo "      \"alias\": \"$ALIAS\","
echo "      \"password\": \"YOUR_KEY_PASSWORD\""
echo "    }"
echo "  }"
echo "}"
echo ""
echo "💡 Or use the sign_apk.sh script for interactive signing"

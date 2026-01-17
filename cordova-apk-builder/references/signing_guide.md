# Android APK Signing Guide

## Overview

Android apps must be digitally signed before they can be installed on devices. This guide covers keystore creation, management, and best practices for signing Cordova Android apps.

## Keystore Basics

### What is a Keystore?

A keystore is a binary file that contains private keys used to sign your APK. Each key in the keystore has an alias and is protected by passwords.

### Keystore vs Key

- **Keystore**: A container file (like a database) that can hold multiple keys
- **Key**: A single cryptographic key pair used for signing
- **Alias**: A name to identify a specific key within the keystore

## Creating a Keystore

### Option 1: Using the Script

```bash
./scripts/generate_keystore.sh
```

Follow the interactive prompts to create your keystore.

### Option 2: Manual Creation

```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Parameters:**
- `-keystore`: Output filename for the keystore
- `-alias`: Name to identify this key
- `-keyalg`: Algorithm (use RSA)
- `-keysize`: Key size in bits (2048 or higher)
- `-validity`: Days the key is valid (10000 = ~27 years)

### Information You'll Need to Provide

1. **Keystore password**: Protects the entire keystore file
2. **Key password**: Protects this specific key (can be same as keystore password)
3. **Distinguished Name fields**:
   - First and last name
   - Organizational unit
   - Organization
   - City or locality
   - State or province
   - Two-letter country code

## Configuring Signing in Cordova

### Method 1: build.json File (Recommended for CI/CD)

Create a `build.json` file in your project root:

```json
{
  "android": {
    "debug": {
      "keystore": "debug.keystore",
      "storePassword": "android",
      "alias": "androiddebugkey",
      "password": "android"
    },
    "release": {
      "keystore": "my-release-key.keystore",
      "storePassword": "your-keystore-password",
      "alias": "my-key-alias",
      "password": "your-key-password"
    }
  }
}
```

**Security Note**: Add `build.json` to `.gitignore` to prevent committing passwords.

### Method 2: Environment Variables

```json
{
  "android": {
    "release": {
      "keystore": "../my-release-key.keystore",
      "storePassword": "",
      "alias": "my-key-alias",
      "password": "",
      "keystoreType": ""
    }
  }
}
```

Then provide passwords via environment variables or Gradle properties.

### Method 3: Interactive Signing

Use the `sign_apk.sh` script to sign APKs interactively without storing passwords in files.

## Build Commands

### Debug Build
```bash
cordova build android --debug
# Output: platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

### Release Build (with build.json)
```bash
cordova build android --release
# Output: platforms/android/app/build/outputs/apk/release/app-release.apk
```

### Release Build (unsigned)
```bash
cordova build android --release
# Then sign manually with sign_apk.sh
```

## Best Practices

### Security

1. **Never commit keystores to version control**
   - Add `*.keystore` to `.gitignore`
   - Store keystores in a secure location

2. **Never commit build.json with passwords**
   - Add `build.json` to `.gitignore`
   - Use environment variables in CI/CD

3. **Use strong passwords**
   - At least 6 characters
   - Mix of letters, numbers, and symbols

4. **Backup your keystore**
   - Store multiple copies in secure locations
   - If you lose it, you cannot update your published app

### Key Management

1. **Use the same key for all versions**
   - Google Play requires the same signing key for app updates
   - You cannot change the signing key after publishing

2. **Keep track of your keystore info**
   - Keystore filename
   - Keystore password
   - Key alias
   - Key password
   - Store in a password manager

3. **Validity period**
   - Use at least 25+ years for production apps
   - Google Play requires keys valid until at least 2033

## Verifying Signatures

Check if an APK is signed:
```bash
jarsigner -verify -verbose -certs app-release.apk
```

View certificate details:
```bash
keytool -list -v -keystore my-release-key.keystore -alias my-key-alias
```

## Troubleshooting

### "jarsigner: unable to sign jar: java.util.zip.ZipException: invalid entry compressed size"

This usually means the APK is already signed. Build a fresh unsigned APK.

### "keytool error: java.io.FileNotFoundException: keystore (No such file or directory)"

The keystore path is incorrect. Use absolute path or correct relative path.

### "jarsigner: Certificate chain not found"

The alias is incorrect or doesn't exist in the keystore. List aliases:
```bash
keytool -list -keystore my-release-key.keystore
```

### "Installation failed: INSTALL_PARSE_FAILED_NO_CERTIFICATES"

The APK is not signed. Sign it with jarsigner before installing.

## APK Alignment

After signing, optimize the APK with zipalign:

```bash
zipalign -v 4 app-release-signed-unaligned.apk app-release-signed.apk
```

**Benefits:**
- Reduces RAM consumption
- Improves app performance
- Required for Google Play upload

The `sign_apk.sh` script automatically runs zipalign if available.

## Google Play Requirements

For uploading to Google Play Store:

1. APK must be signed with a release key
2. Key must be valid until at least 2033
3. APK must be aligned with zipalign
4. Version code must be incremented for updates
5. Same signing key must be used for all updates

## App Signing by Google Play

Google offers "App Signing by Google Play" which:
- Manages your app signing key
- Signs APKs with Google's infrastructure
- Allows you to upload APKs signed with an upload key
- Provides additional security

Consider using this for production apps.

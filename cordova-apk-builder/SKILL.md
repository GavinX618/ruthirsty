---
name: cordova-apk-builder
description: Build and package Cordova applications into Android APK files. Use when user requests to build APK, create Android package, generate release/debug builds, sign APKs, create keystore for Android app signing, or deploy Cordova app to Android. Handles debug builds, release builds, APK signing, keystore generation, and device installation.
---

# Cordova APK Builder

Build, sign, and package Cordova applications into Android APK files ready for testing or distribution.

## Quick Start

**Build debug APK for testing:**
```bash
./scripts/build_debug.sh
```
Output: `platforms/android/app/build/outputs/apk/debug/app-debug.apk`

**Build signed release APK:**
1. Create keystore: `./scripts/generate_keystore.sh`
2. Configure signing (see Signing Configuration below)
3. Build: `./scripts/build_release.sh`

**Install APK to device:**
```bash
./scripts/install_apk.sh
```

## Core Operations

### 1. Building Debug APK

Debug builds are for development and testing. They're automatically signed with a debug keystore.

**Script:** `scripts/build_debug.sh`

**Usage:**
```bash
cd /path/to/cordova/project
/path/to/skill/scripts/build_debug.sh
```

**Output:** `platforms/android/app/build/outputs/apk/debug/app-debug.apk`

**Requirements:**
- Cordova CLI installed (`npm install -g cordova`)
- Android platform added (`cordova platform add android`)

### 2. Building Release APK

Release builds are optimized and must be signed for distribution.

**Script:** `scripts/build_release.sh`

**Behavior:**
- If `build.json` exists: Builds and signs APK automatically
- If no `build.json`: Builds unsigned APK (requires manual signing)

**Usage:**
```bash
cd /path/to/cordova/project
/path/to/skill/scripts/build_release.sh
```

**Output:**
- With build.json: `platforms/android/app/build/outputs/apk/release/app-release.apk` (signed)
- Without build.json: `platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk`

### 3. Generating Signing Keystore

Create a new keystore for signing release APKs.

**Script:** `scripts/generate_keystore.sh`

**Usage:**
```bash
cd /path/to/cordova/project
/path/to/skill/scripts/generate_keystore.sh
```

**Interactive prompts:**
- Keystore filename (default: my-release-key.keystore)
- Key alias (default: my-key-alias)
- Validity period (default: 10000 days)
- Keystore password
- Key password
- Certificate details (name, organization, etc.)

**Output:** Keystore file in project directory

**Important:** Save keystore and passwords securely. You cannot update a published app without the original keystore.

### 4. Signing APK Manually

Sign an unsigned release APK interactively.

**Script:** `scripts/sign_apk.sh`

**Usage:**
```bash
cd /path/to/cordova/project
/path/to/skill/scripts/sign_apk.sh
```

**Requirements:**
- Unsigned APK must exist at `platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk`
- Keystore file available
- Java JDK installed (provides jarsigner)

**Interactive prompts:**
- Keystore path
- Key alias
- Keystore password
- Key password

**Output:** `platforms/android/app/build/outputs/apk/release/app-release-signed.apk`

**Features:**
- Automatically runs zipalign if available (optimizes APK)
- Verifies signature after signing

### 5. Installing APK to Device

Install APK to connected Android device or emulator.

**Script:** `scripts/install_apk.sh`

**Usage:**
```bash
cd /path/to/cordova/project
/path/to/skill/scripts/install_apk.sh
```

**Requirements:**
- Android device connected via USB with USB debugging enabled, OR
- Android emulator running
- ADB (Android Debug Bridge) available in PATH

**Behavior:**
- Automatically detects and installs the best available APK:
  1. Signed release APK (if exists)
  2. Unsigned release APK (if exists)
  3. Debug APK (if exists)

## Signing Configuration

Two methods to configure APK signing:

### Method 1: build.json File (Recommended)

Create `build.json` in project root:

```json
{
  "android": {
    "release": {
      "keystore": "my-release-key.keystore",
      "storePassword": "your-keystore-password",
      "alias": "my-key-alias",
      "password": "your-key-password"
    }
  }
}
```

**Security:** Add `build.json` to `.gitignore` to avoid committing passwords.

**Template:** Copy from `assets/build.json.example`

**Usage:** Run `build_release.sh` - signing happens automatically.

### Method 2: Interactive Signing

Don't create `build.json`. Instead:
1. Run `build_release.sh` to create unsigned APK
2. Run `sign_apk.sh` to sign interactively

**Advantages:**
- No passwords stored in files
- Better for local development
- More secure

**Disadvantages:**
- Requires manual intervention
- Not suitable for CI/CD

## Typical Workflows

### First-Time Setup

```bash
# 1. Generate keystore
./scripts/generate_keystore.sh
# Save the keystore file and remember passwords!

# 2. Create build.json (optional)
cp assets/build.json.example build.json
# Edit build.json with your keystore details

# 3. Add to .gitignore
echo "build.json" >> .gitignore
echo "*.keystore" >> .gitignore
```

### Development Workflow

```bash
# Build and test
./scripts/build_debug.sh
./scripts/install_apk.sh

# Or use Cordova directly
cordova run android
```

### Release Workflow (with build.json)

```bash
# Build signed release APK
./scripts/build_release.sh

# Output: platforms/android/app/build/outputs/apk/release/app-release.apk
```

### Release Workflow (interactive)

```bash
# Build unsigned APK
./scripts/build_release.sh

# Sign APK
./scripts/sign_apk.sh

# Output: platforms/android/app/build/outputs/apk/release/app-release-signed.apk
```

## Advanced Topics

### Detailed Signing Guide

For comprehensive information on Android keystore management, signing best practices, and troubleshooting, see:

**Reference:** `references/signing_guide.md`

Covers:
- Keystore vs key concepts
- Security best practices
- Backup strategies
- Google Play requirements
- App signing by Google Play
- Certificate verification
- Common errors and solutions

### Build Configuration Reference

For advanced build configuration, Gradle customization, and config.xml settings, see:

**Reference:** `references/build_config.md`

Covers:
- build.json structure and options
- Environment variables for passwords
- config.xml Android preferences
- Version management
- Gradle customization
- Build variants
- ProGuard configuration
- Common build issues

## Troubleshooting

### "Cordova CLI is not installed"

Install Cordova globally:
```bash
npm install -g cordova
```

### "Android platform not found"

Add Android platform:
```bash
cordova platform add android
```

### "No Android devices found" when installing

- Connect Android device via USB
- Enable USB debugging on device (Settings → Developer Options)
- Or start an Android emulator

### "jarsigner not found"

Install Java JDK (not just JRE). jarsigner comes with the JDK.

### "Unsigned APK not found"

Build a release APK first:
```bash
cordova build android --release
```

### APK signed but cannot install

Make sure zipalign was run. The `sign_apk.sh` script does this automatically if zipalign is available.

### Lost keystore password

Unfortunately, there's no way to recover it. You'll need to:
- Create a new keystore
- Publish as a completely new app (different package ID)
- Cannot update existing app on Google Play

**Prevention:** Store keystore and passwords in a secure password manager.

## Requirements

**Essential:**
- Node.js and npm
- Cordova CLI (`npm install -g cordova`)
- Java JDK 11 or higher

**For building:**
- Android SDK
- Gradle

**For installing to device:**
- Android SDK Platform Tools (adb)

**Platform support:** Linux, macOS, Windows (scripts use bash)

## CI/CD Integration

For automated builds in CI/CD pipelines:

1. Store keystore as base64-encoded secret
2. Use environment variables for passwords
3. Decode keystore in build step
4. Use build.json with environment variables
5. Run `build_release.sh`

Example for GitHub Actions:
```yaml
- name: Decode keystore
  run: echo "${{ secrets.KEYSTORE_BASE64 }}" | base64 -d > my-release-key.keystore

- name: Build release APK
  env:
    KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
    KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
  run: ./scripts/build_release.sh
```

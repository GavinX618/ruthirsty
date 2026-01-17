# Cordova Build Configuration Reference

## build.json

The `build.json` file configures platform-specific build settings for Cordova projects. It's the recommended way to specify signing credentials and build options.

### Basic Structure

```json
{
  "android": {
    "debug": {
      // Debug build configuration
    },
    "release": {
      // Release build configuration
    }
  },
  "ios": {
    // iOS configuration (if needed)
  }
}
```

### Android Debug Configuration

```json
{
  "android": {
    "debug": {
      "keystore": "debug.keystore",
      "storePassword": "android",
      "alias": "androiddebugkey",
      "password": "android",
      "keystoreType": "jks"
    }
  }
}
```

Android debug builds use a default debug keystore automatically. You typically don't need to configure this unless using a custom debug keystore.

### Android Release Configuration

```json
{
  "android": {
    "release": {
      "keystore": "path/to/my-release-key.keystore",
      "storePassword": "keystore-password",
      "alias": "my-key-alias",
      "password": "key-password",
      "keystoreType": "jks"
    }
  }
}
```

**Fields:**
- `keystore`: Path to keystore file (relative to project root or absolute)
- `storePassword`: Password for the keystore file
- `alias`: Alias of the key to use from keystore
- `password`: Password for the specific key (can be same as storePassword)
- `keystoreType`: Usually "jks" (Java KeyStore) or "pkcs12"

### Security Best Practices

#### Option 1: Gitignore build.json

```bash
# Add to .gitignore
build.json
```

Keep actual `build.json` locally and use a template:

**build.json.example:**
```json
{
  "android": {
    "release": {
      "keystore": "path/to/keystore",
      "storePassword": "REPLACE_WITH_PASSWORD",
      "alias": "key-alias",
      "password": "REPLACE_WITH_PASSWORD"
    }
  }
}
```

#### Option 2: Environment Variables

Use placeholder passwords in build.json and set them via environment variables:

```json
{
  "android": {
    "release": {
      "keystore": "${ANDROID_KEYSTORE_PATH}",
      "storePassword": "${ANDROID_KEYSTORE_PASSWORD}",
      "alias": "${ANDROID_KEY_ALIAS}",
      "password": "${ANDROID_KEY_PASSWORD}"
    }
  }
}
```

Then export before building:
```bash
export ANDROID_KEYSTORE_PATH="my-release-key.keystore"
export ANDROID_KEYSTORE_PASSWORD="your-password"
export ANDROID_KEY_ALIAS="my-alias"
export ANDROID_KEY_PASSWORD="your-password"

cordova build android --release
```

#### Option 3: CI/CD Secrets

For CI/CD pipelines, store credentials as encrypted secrets:

**GitHub Actions:**
```yaml
- name: Build Release APK
  env:
    ANDROID_KEYSTORE_PASSWORD: ${{ secrets.ANDROID_KEYSTORE_PASSWORD }}
    ANDROID_KEY_PASSWORD: ${{ secrets.ANDROID_KEY_PASSWORD }}
  run: cordova build android --release
```

## config.xml Configuration

### Version Management

```xml
<widget id="com.example.app" version="1.0.0" android-versionCode="1">
```

**Important:**
- `version`: Human-readable version (e.g., "1.0.0", "2.1.3")
- `android-versionCode`: Integer that must increment with each release
- Google Play uses `versionCode` to determine update order

### Android-Specific Settings

```xml
<platform name="android">
    <!-- Minimum Android version -->
    <preference name="android-minSdkVersion" value="22" />

    <!-- Target Android version -->
    <preference name="android-targetSdkVersion" value="33" />

    <!-- Build tools version -->
    <preference name="android-buildToolsVersion" value="33.0.0" />

    <!-- Gradle version -->
    <preference name="GradleVersion" value="7.6" />

    <!-- Android X -->
    <preference name="AndroidXEnabled" value="true" />
</platform>
```

### App Icons and Splash Screens

```xml
<platform name="android">
    <icon src="res/icon/android/mipmap-ldpi/ic_launcher.png" density="ldpi"/>
    <icon src="res/icon/android/mipmap-mdpi/ic_launcher.png" density="mdpi"/>
    <icon src="res/icon/android/mipmap-hdpi/ic_launcher.png" density="hdpi"/>
    <icon src="res/icon/android/mipmap-xhdpi/ic_launcher.png" density="xhdpi"/>
    <icon src="res/icon/android/mipmap-xxhdpi/ic_launcher.png" density="xxhdpi"/>
    <icon src="res/icon/android/mipmap-xxxhdpi/ic_launcher.png" density="xxxhdpi"/>
</platform>
```

## Gradle Configuration

For advanced build customization, you can add Gradle configuration to `platforms/android/build.gradle` or use hooks.

### Common Gradle Customizations

**Enable ProGuard (code shrinking):**
```gradle
android {
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

**Split APKs by ABI:**
```gradle
android {
    splits {
        abi {
            enable true
            reset()
            include 'armeabi-v7a', 'arm64-v8a', 'x86', 'x86_64'
            universalApk true
        }
    }
}
```

## Build Variants

### Debug vs Release

**Debug builds:**
- Automatically signed with debug keystore
- Debuggable
- No code optimization
- Faster build times
- Cannot be uploaded to Play Store

**Release builds:**
- Must be signed with release keystore
- Not debuggable (by default)
- Code optimized and shrunk (if configured)
- Slower build times
- Required for Play Store

### Build Commands

```bash
# Debug
cordova build android --debug
cordova run android --debug

# Release
cordova build android --release
cordova run android --release

# Specific architecture
cordova build android --release -- --gradleArg=-PcdvBuildMultipleApks=true
```

## Troubleshooting

### Build fails with "AAPT: error: resource android:attr/lStar not found"

Update Android platform:
```bash
cordova platform rm android
cordova platform add android@latest
```

### "Execution failed for task ':app:validateSigningRelease'"

Check build.json paths and passwords are correct.

### Gradle version conflicts

Specify Gradle version in config.xml:
```xml
<preference name="GradleVersion" value="7.6" />
```

### Out of memory during build

Increase Gradle memory in `platforms/android/gradle.properties`:
```
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m
```

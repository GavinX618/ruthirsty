# RUthirsty 喝水打卡应用 - APK构建指南

本文档详细说明如何在本地环境中将RUthirsty Cordova应用构建成Android APK。

## 目录

1. [环境准备](#环境准备)
2. [快速构建（使用Skill）](#快速构建使用skill)
3. [标准构建流程](#标准构建流程)
4. [发布版本构建](#发布版本构建)
5. [故障排除](#故障排除)
6. [测试和部署](#测试和部署)

---

## 环境准备

### 必需软件

#### 1. Node.js 和 npm

**检查是否已安装：**
```bash
node --version  # 需要 v14 或更高
npm --version
```

**安装（如未安装）：**
- 从 [nodejs.org](https://nodejs.org/) 下载并安装 LTS 版本
- 或使用包管理器：
  ```bash
  # macOS
  brew install node

  # Ubuntu/Debian
  sudo apt install nodejs npm

  # Windows
  # 下载安装程序或使用 Chocolatey
  choco install nodejs
  ```

#### 2. Cordova CLI

```bash
# 全局安装Cordova
npm install -g cordova

# 验证安装
cordova --version  # 应显示 13.0.0 或更高
```

#### 3. Java JDK

**需要 JDK 11 或更高版本**

**检查：**
```bash
java -version
javac -version
```

**安装：**
- [下载 OpenJDK](https://adoptium.net/)
- 或使用包管理器：
  ```bash
  # macOS
  brew install openjdk@17

  # Ubuntu/Debian
  sudo apt install openjdk-17-jdk

  # Windows
  choco install openjdk17
  ```

**配置 JAVA_HOME：**
```bash
# macOS/Linux - 添加到 ~/.bashrc 或 ~/.zshrc
export JAVA_HOME=$(/usr/libexec/java_home)  # macOS
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64  # Linux

# Windows - 系统环境变量
# JAVA_HOME = C:\Program Files\Java\jdk-17
```

#### 4. Android SDK

**选项A：安装 Android Studio（推荐）**

1. 从 [developer.android.com](https://developer.android.com/studio) 下载 Android Studio
2. 安装并打开 Android Studio
3. 打开 SDK Manager (Tools → SDK Manager)
4. 安装以下组件：
   - Android SDK Platform 33 (或你的目标版本)
   - Android SDK Build-Tools 33.0.2
   - Android SDK Platform-Tools
   - Android SDK Command-line Tools

**选项B：仅安装命令行工具**

1. 下载 [Android Command Line Tools](https://developer.android.com/studio#command-tools)
2. 解压到 `~/android-sdk/cmdline-tools/latest/`
3. 安装必要组件：
   ```bash
   sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.2"
   ```

**配置环境变量：**

```bash
# macOS/Linux - 添加到 ~/.bashrc 或 ~/.zshrc
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
export ANDROID_HOME=$HOME/Android/Sdk          # Linux
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# Windows - 系统环境变量
# ANDROID_HOME = C:\Users\<用户名>\AppData\Local\Android\Sdk
# Path 添加: %ANDROID_HOME%\platform-tools
# Path 添加: %ANDROID_HOME%\cmdline-tools\latest\bin
```

**验证配置：**
```bash
# 重新加载配置
source ~/.bashrc  # 或 source ~/.zshrc

# 验证
cordova requirements android
```

期望输出：
```
Requirements check results for android:
Java JDK: installed
Android SDK: installed true
Android target: installed android-33
Gradle: installed
```

#### 5. Gradle

通常Cordova会自动下载Gradle，但也可以手动安装：

```bash
# macOS
brew install gradle

# 验证
gradle --version
```

### 项目依赖安装

```bash
# 进入项目目录
cd RUthirsty-cordova

# 安装项目依赖
npm install

# 添加Android平台（如果尚未添加）
cordova platform add android
```

---

## 快速构建（使用Skill）

项目包含了 `cordova-apk-builder` skill，提供了便捷的构建脚本。

### 1. 构建调试APK（最快）

```bash
# 使用skill脚本
./cordova-apk-builder/scripts/build_debug.sh
```

**输出位置：**
```
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

### 2. 安装到设备

确保Android设备已连接（USB调试已启用）或Android模拟器正在运行：

```bash
# 使用skill脚本
./cordova-apk-builder/scripts/install_apk.sh

# 或使用Cordova命令
cordova run android
```

### 3. 构建发布APK

```bash
# 使用skill脚本
./cordova-apk-builder/scripts/build_release.sh
```

**注意：** 发布版本需要签名，详见[发布版本构建](#发布版本构建)。

---

## 标准构建流程

### 调试版本构建

```bash
# 方法1：构建APK
cordova build android --debug

# 方法2：直接运行到设备（会自动构建）
cordova run android --debug

# 方法3：运行到模拟器
cordova emulate android
```

**APK位置：**
```
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

### 发布版本构建（未签名）

```bash
cordova build android --release
```

**输出：**
```
platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
```

⚠️ **未签名的APK无法安装**，必须先签名。

---

## 发布版本构建

发布到Google Play或分发给用户的APK必须签名。

### 步骤1：生成签名密钥库

**使用skill脚本（推荐）：**
```bash
./cordova-apk-builder/scripts/generate_keystore.sh
```

**手动生成：**
```bash
keytool -genkey -v \
  -keystore ruthirsty-release-key.keystore \
  -alias ruthirsty-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**交互式提示：**
- 输入密钥库口令（记住它！）
- 再次输入相同口令
- 输入密钥口令（可以与密钥库口令相同）
- 输入您的名字、组织等信息

⚠️ **重要提醒：**
- 妥善保管密钥库文件和密码！
- 如果丢失，将无法更新已发布的应用
- 建议使用密码管理器保存这些信息
- 备份密钥库文件到安全位置

### 步骤2：配置签名

#### 选项A：使用 build.json（推荐用于CI/CD）

创建 `build.json` 文件（在项目根目录）：

```json
{
  "android": {
    "release": {
      "keystore": "ruthirsty-release-key.keystore",
      "storePassword": "你的密钥库密码",
      "alias": "ruthirsty-key",
      "password": "你的密钥密码",
      "keystoreType": "jks"
    }
  }
}
```

**安全提示：**
```bash
# 将build.json添加到.gitignore
echo "build.json" >> .gitignore
echo "*.keystore" >> .gitignore
```

#### 选项B：交互式签名

1. 先构建未签名的APK：
   ```bash
   cordova build android --release
   ```

2. 使用skill脚本签名：
   ```bash
   ./cordova-apk-builder/scripts/sign_apk.sh
   ```

   脚本会交互式询问：
   - 密钥库路径
   - 密钥别名
   - 密钥库密码
   - 密钥密码

### 步骤3：构建已签名的发布APK

**如果使用 build.json：**
```bash
# 使用skill脚本
./cordova-apk-builder/scripts/build_release.sh

# 或使用Cordova命令
cordova build android --release
```

**输出位置：**
```
platforms/android/app/build/outputs/apk/release/app-release.apk
```

### 步骤4：验证签名

```bash
# 验证APK签名
jarsigner -verify -verbose -certs \
  platforms/android/app/build/outputs/apk/release/app-release.apk

# 查看签名详情
keytool -list -v -keystore ruthirsty-release-key.keystore
```

---

## 故障排除

### 常见问题

#### 1. "ANDROID_HOME not found"

**解决方案：**
```bash
# 找到Android SDK位置
# macOS: ~/Library/Android/sdk
# Linux: ~/Android/Sdk
# Windows: C:\Users\<用户名>\AppData\Local\Android\Sdk

# 设置环境变量
export ANDROID_HOME=<你的SDK路径>
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### 2. "Gradle build failed"

**解决方案：**
```bash
# 清理Gradle缓存
cd platforms/android
./gradlew clean

# 或重新添加平台
cd ../..
cordova platform rm android
cordova platform add android
```

#### 3. "Android target not installed"

**解决方案：**
```bash
# 使用sdkmanager安装
sdkmanager "platforms;android-33"
```

#### 4. "jarsigner not found"

**解决方案：**
- 安装完整的JDK（不仅是JRE）
- 确保JAVA_HOME正确设置

#### 5. 构建很慢

**优化方案：**
```bash
# 增加Gradle内存
# 编辑 platforms/android/gradle.properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m
```

#### 6. 版本冲突

**检查版本兼容性：**
```bash
# 查看Cordova版本
cordova --version

# 查看Android平台版本
cordova platform version android

# 如需更新
cordova platform update android@latest
```

### 完全重置

如果遇到无法解决的问题：

```bash
# 1. 删除平台和插件
cordova platform rm android
rm -rf plugins
rm -rf node_modules

# 2. 重新安装
npm install
cordova platform add android

# 3. 重新构建
cordova build android
```

---

## 测试和部署

### 在设备上测试

#### 连接物理设备

1. **启用USB调试：**
   - 打开设置 → 关于手机
   - 连续点击"版本号"7次启用开发者选项
   - 设置 → 开发者选项 → 启用"USB调试"

2. **连接设备：**
   ```bash
   # 检查设备连接
   adb devices

   # 应该看到设备列表
   ```

3. **安装APK：**
   ```bash
   # 使用skill脚本
   ./cordova-apk-builder/scripts/install_apk.sh

   # 或手动安装
   adb install -r platforms/android/app/build/outputs/apk/debug/app-debug.apk
   ```

#### 使用模拟器

```bash
# 创建模拟器（如果没有）
# 打开Android Studio → AVD Manager → Create Virtual Device

# 启动模拟器
emulator -avd <模拟器名称>

# 运行应用
cordova emulate android
```

### 日志调试

```bash
# 查看应用日志
adb logcat | grep -i cordova

# 或使用Chrome调试
# 1. 运行应用
# 2. 在Chrome打开 chrome://inspect
# 3. 选择你的设备进行调试
```

### 发布到Google Play

1. **准备发布材料：**
   - 应用图标（512x512 PNG）
   - 截图（至少2张）
   - 应用描述
   - 隐私政策URL

2. **版本管理：**

   编辑 `config.xml`：
   ```xml
   <widget id="com.ruthirsty.app"
           version="1.0.0"
           android-versionCode="1">
   ```

   每次发布更新时递增 `android-versionCode`

3. **构建生产APK：**
   ```bash
   # 确保使用发布密钥签名
   cordova build android --release
   ```

4. **上传到Google Play Console**

5. **AAB格式（推荐）：**

   Google Play现在推荐使用AAB格式：
   ```bash
   cordova build android --release --packageType=bundle
   ```

   输出：`platforms/android/app/build/outputs/bundle/release/app-release.aab`

---

## 快速参考

### 常用命令

```bash
# 构建调试版
cordova build android

# 构建发布版
cordova build android --release

# 运行到设备
cordova run android

# 清理构建
cordova clean

# 查看日志
cordova run android --verbose
```

### 重要文件位置

```
项目结构：
├── config.xml                          # Cordova配置
├── www/                                # Web资源（HTML/CSS/JS）
├── platforms/android/                  # Android平台代码
│   └── app/build/outputs/apk/         # 生成的APK
├── build.json                          # 签名配置（不要提交）
├── ruthirsty-release-key.keystore     # 签名密钥（不要提交）
└── cordova-apk-builder/               # 构建skill工具
    ├── scripts/                        # 构建脚本
    ├── references/                     # 参考文档
    └── assets/                         # 配置模板
```

### 版本信息

**当前配置：**
- Cordova: 13.0.0
- Android平台: 12.0.1
- 目标Android SDK: 33
- 最低Android版本: 7.0 (API 24)

---

## 下一步

构建成功后，你可以：

1. ✅ **测试应用** - 在多个设备上测试所有功能
2. ✅ **准备发布** - 准备应用商店材料
3. ✅ **持续改进** - 根据反馈优化应用
4. ✅ **自动化构建** - 设置CI/CD流程

**有问题？** 查看 `cordova-apk-builder/SKILL.md` 获取更多详细信息。

---

**创建日期：** 2026-01-17
**应用版本：** 1.0.0
**文档版本：** 1.0

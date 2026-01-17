# 我要喝水 - 喝水打卡应用

一款简洁实用的喝水打卡Cordova应用，采用现代化毛玻璃设计风格，帮助你养成健康的喝水习惯。

## ✨ 功能特点

- 💧 **一键打卡** - 简单点击即可记录喝水
- 📊 **实时统计** - 动态显示今日喝水次数
- 📝 **详细记录** - 时间戳精确到秒的喝水历史
- 💾 **本地存储** - 数据持久化，隐私安全
- 🎨 **毛玻璃UI** - 流畅的glassmorphism设计风格
- 🌊 **流动背景** - 水主题的动态渐变效果
- ✨ **精美动画** - 丰富的交互动画和过渡效果
- 📱 **完美适配** - 响应式设计，支持各种屏幕尺寸

## 🚀 快速开始

### 方式1：浏览器预览（最快）

```bash
# 已经启动了live-server，直接访问
# http://localhost:8080
```

### 方式2：Mac应用

**在Mac电脑上：**
```bash
./build-mac.sh
# 选择选项2，生成DMG安装包
```

**详细说明：** 参见 [Mac快速开始.md](./Mac快速开始.md) 或 [Mac应用构建指南.md](./Mac应用构建指南.md)

### 方式3：Android APK

**超快速构建（推荐）：**
```bash
# 使用内置的构建skill
./cordova-apk-builder/scripts/build_debug.sh
```

**详细步骤：** 参见 [快速开始.md](./快速开始.md)

**完整指南：** 参见 [APK构建指南.md](./APK构建指南.md)

## 📚 文档

- 📖 [快速开始](./快速开始.md) - 5分钟快速构建APK
- 📋 [APK构建指南](./APK构建指南.md) - 详细的构建说明和故障排除
- 🛠️ [Cordova APK Builder Skill](./cordova-apk-builder-README.md) - 构建工具说明
- 🔐 [签名指南](./cordova-apk-builder/references/signing_guide.md) - APK签名详细教程
- ⚙️ [构建配置参考](./cordova-apk-builder/references/build_config.md) - 高级配置选项

## 🛠️ 技术栈

- **框架**: Apache Cordova 13.0.0
- **前端**: HTML5 + CSS3 + JavaScript (ES6)
- **样式**: Glassmorphism (毛玻璃设计)
- **字体**: Quicksand (轻柔圆润的水滴风格)
- **数据**: localStorage API
- **平台**: Android (API 24+)
- **构建工具**: Gradle + Android SDK 33

## 环境要求

- Node.js (建议 v14 或更高版本)
- npm 或 yarn
- Cordova CLI (`npm install -g cordova`)
- Android Studio (用于Android开发)
- Java JDK 11 或更高版本
- Android SDK

## 安装步骤

1. 克隆或下载项目

2. 安装依赖
```bash
npm install
```

3. 添加Android平台
```bash
cordova platform add android
```

## 构建和运行

### 在浏览器中运行（开发调试）
```bash
cordova serve
# 然后在浏览器中访问 http://localhost:8000
```

### 构建Android APK
```bash
# 构建调试版本
cordova build android

# 构建发布版本
cordova build android --release
```

### 在Android设备上运行
```bash
# 连接Android设备或启动模拟器，然后运行
cordova run android
```

### 在Android模拟器上运行
```bash
cordova emulate android
```

## 项目结构

```
RUthirsty-cordova/
├── www/                    # Web资源目录
│   ├── css/
│   │   └── index.css      # 样式文件
│   ├── js/
│   │   └── index.js       # JavaScript逻辑
│   └── index.html         # 主页面
├── config.xml             # Cordova配置文件
├── package.json           # NPM配置文件
└── README.md             # 项目说明
```

## 使用说明

1. 启动应用后，主界面显示今日喝水次数统计
2. 点击中间的"喝水打卡"按钮进行打卡
3. 打卡后会显示成功提示，并自动更新记录
4. 下方列表展示今日所有喝水记录，包括具体时间
5. 数据自动保存在本地，关闭应用后不会丢失

## 数据存储

应用使用HTML5 localStorage进行数据存储，所有记录保存在设备本地，确保隐私安全。

## 调试技巧

### 查看日志
```bash
# Android设备日志
adb logcat | grep -i cordova
```

### Chrome远程调试
1. 在Chrome浏览器中访问 `chrome://inspect`
2. 连接Android设备并运行应用
3. 点击"inspect"开始调试

## 常见问题

### 问题1: cordova命令不存在
解决方案: 全局安装Cordova CLI
```bash
npm install -g cordova
```

### 问题2: Android SDK未找到
解决方案: 设置环境变量
```bash
export ANDROID_HOME=/path/to/android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### 问题3: Gradle构建失败
解决方案: 确保网络畅通，或配置Gradle镜像源

## 开发计划

- [ ] 添加每日喝水目标设置
- [ ] 添加喝水提醒功能
- [ ] 添加统计图表
- [ ] 添加历史记录查看
- [ ] 支持自定义喝水量
- [ ] 添加深色模式

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 联系方式

如有问题或建议，请联系开发团队。

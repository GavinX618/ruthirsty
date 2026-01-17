# RUthirsty Mac应用构建指南

为Mac电脑打包喝水打卡应用的完整指南。

## 🍎 概述

这个项目使用**Electron**将网页应用打包成Mac原生应用，可以：
- ✅ 作为独立应用运行（不需要浏览器）
- ✅ 在Dock中显示图标
- ✅ 支持Mac快捷键和菜单
- ✅ 数据保存在本地
- ✅ 双击即可打开

## 📋 准备工作

### 必需软件

1. **Mac电脑**（推荐，但也支持交叉编译）
2. **Node.js**（v16或更高）
   - 下载: https://nodejs.org
   - 或使用Homebrew: `brew install node`

### 环境检查

打开终端，运行：
```bash
node --version  # 应显示 v16.0.0 或更高
npm --version   # 应显示 8.0.0 或更高
```

## 🚀 快速开始

### 方法1：使用构建脚本（最简单）

```bash
# 1. 进入项目目录
cd RUthirsty-cordova

# 2. 运行构建脚本
./build-mac.sh

# 3. 选择选项
# 选项1: 快速测试运行
# 选项2: 构建DMG安装包（推荐）
# 选项3: 构建ZIP压缩包
# 选项4: 构建所有格式
```

### 方法2：手动构建

```bash
# 1. 复制Mac配置文件
cp package-mac.json package.json

# 2. 安装依赖
npm install

# 3. 选择以下一种方式：

# 快速测试（不生成安装包）
npm start

# 构建DMG安装包
npm run build-mac-dmg

# 构建ZIP压缩包
npm run build-mac-zip

# 构建所有格式
npm run build-mac
```

## 📦 构建产物

构建完成后，会在`dist-mac/`目录生成：

```
dist-mac/
├── RUthirsty-1.0.0.dmg          # DMG安装包（双击安装）
├── RUthirsty-1.0.0-mac.zip      # ZIP压缩包（解压即用）
└── mac/                          # 未打包的应用目录
    └── RUthirsty.app            # 可直接运行的应用
```

### 文件说明

- **DMG文件**：macOS标准安装包，双击后拖拽到Applications文件夹
- **ZIP文件**：压缩包，解压后可直接运行
- **APP文件**：macOS应用程序，可以放到任何位置运行

## 💾 文件大小

- DMG安装包：约 100-150 MB
- ZIP压缩包：约 90-120 MB

（大小主要来自Electron框架，实际应用代码很小）

## 🎯 安装和使用

### 使用DMG安装包

1. **双击** `RUthirsty-1.0.0.dmg`
2. **拖拽** RUthirsty图标到Applications文件夹
3. **打开** Applications文件夹，双击RUthirsty
4. 如果提示"来自未识别的开发者"：
   - 打开**系统偏好设置** → **安全性与隐私**
   - 点击"仍要打开"

### 使用ZIP压缩包

1. **解压** `RUthirsty-1.0.0-mac.zip`
2. **拖拽** RUthirsty.app到Applications文件夹（可选）
3. **双击** RUthirsty.app运行

## 🔐 Mac安全设置

首次打开可能会遇到安全提示：

### 问题："RUthirsty"已损坏，无法打开

**解决方案1：** 移除隔离属性
```bash
xattr -cr /Applications/RUthirsty.app
```

**解决方案2：** 临时允许任何来源
```bash
sudo spctl --master-disable
# 打开应用后，再执行：
sudo spctl --master-enable
```

### 问题：无法验证开发者

1. 打开**系统偏好设置**
2. 点击**安全性与隐私**
3. 在**通用**标签下点击**仍要打开**

## ✨ 应用特性

### 功能
- 💧 一键打卡喝水
- 📊 显示今日喝水次数
- 📝 查看打卡记录列表
- 🔊 打卡成功声音提示
- 🎨 毛玻璃风格界面

### Mac原生特性
- ⌨️ 支持Mac快捷键
  - `Cmd+Q` 退出
  - `Cmd+W` 关闭窗口
  - `Cmd+R` 重新加载
  - `Cmd+M` 最小化
- 📋 原生菜单栏
- 🖼️ Dock图标
- 🔔 可添加到启动项

## 🛠️ 高级配置

### 修改应用窗口大小

编辑`electron-main.js`：

```javascript
mainWindow = new BrowserWindow({
    width: 420,   // 改这里：窗口宽度
    height: 780,  // 改这里：窗口高度
    // ...
});
```

### 修改应用信息

编辑`package-mac.json`：

```json
{
  "name": "ruthirsty-mac",
  "version": "1.0.0",          // 版本号
  "description": "...",         // 描述
  "build": {
    "appId": "com.ruthirsty.app",  // 应用ID
    "productName": "RUthirsty"     // 应用名称
  }
}
```

### 自定义应用图标

1. 准备1024x1024的PNG图标
2. 使用在线工具转换为ICNS格式：
   - https://cloudconvert.com/png-to-icns
3. 保存为`build/icon.icns`
4. 重新构建

## 🐛 常见问题

### 1. 构建失败："Cannot find module 'electron'"

**解决方案：**
```bash
rm -rf node_modules
npm install
```

### 2. DMG构建失败

**解决方案：** 确保有足够磁盘空间（至少1GB）

### 3. 应用打不开

**解决方案：**
```bash
# 移除隔离属性
xattr -cr /Applications/RUthirsty.app

# 或右键点击应用 → 打开
```

### 4. 数据保存在哪里？

**位置：**
```
~/Library/Application Support/ruthirsty-mac/
```

清除数据：
```bash
rm -rf ~/Library/Application\ Support/ruthirsty-mac/
```

### 5. 在非Mac系统上构建

Electron Builder支持交叉编译：

**在Linux上：**
```bash
npm run build-mac
```

**在Windows上：**
```bash
npm run build-mac
```

注意：某些Mac特有的功能（如代码签名）需要在Mac上完成。

## 📱 分发应用

### 分享给朋友

**方法1：** 分享DMG文件
- 上传到网盘（百度云、OneDrive等）
- 朋友下载后双击安装

**方法2：** 分享ZIP文件
- 更小的文件大小
- 解压即用

### 上架Mac App Store（可选）

需要：
1. 注册Apple开发者账号（$99/年）
2. 配置代码签名
3. 公证应用
4. 提交审核

详见：https://developer.apple.com/app-store/

## 🔄 更新应用

### 发布新版本

1. 修改代码
2. 更新`package-mac.json`中的版本号
3. 重新构建
4. 分发新的DMG/ZIP文件

### 用户更新

用户需要：
1. 下载新版本
2. 删除旧应用
3. 安装新版本

（数据会保留，因为存储在独立目录）

## 🎨 自定义优化

### 优化启动速度

在`electron-main.js`中添加：

```javascript
app.commandLine.appendSwitch('disable-http-cache');
```

### 添加系统托盘图标

参考Electron文档：
https://www.electronjs.org/docs/latest/api/tray

### 添加开机自启动

```javascript
app.setLoginItemSettings({
  openAtLogin: true
});
```

## 📚 学习资源

- Electron官方文档: https://www.electronjs.org/docs
- Electron Builder文档: https://www.electron.build
- Mac应用开发指南: https://developer.apple.com/macos/

## 💡 提示

1. **第一次构建会比较慢**（需要下载Electron），请耐心等待
2. **构建产物较大**（100MB+），这是正常的，因为包含了整个Chromium引擎
3. **可以在任何系统上构建**，但在Mac上构建效果最好
4. **建议使用DMG格式分发**，这是Mac用户最熟悉的安装方式

---

**问题反馈：** 如遇问题，请查看终端输出的错误信息

**项目版本：** 1.0.0
**更新日期：** 2026-01-17

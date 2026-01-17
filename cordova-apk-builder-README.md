# Cordova APK Builder Skill

一个完整的Cordova Android应用打包skill，支持构建、签名和部署APK。

## 功能特性

- 🔨 **构建调试APK** - 快速构建用于开发测试的debug APK
- 📦 **构建发布APK** - 构建优化的生产环境release APK
- 🔐 **生成签名密钥** - 创建Android应用签名所需的keystore
- ✍️ **APK签名** - 支持自动签名和交互式签名两种方式
- 📲 **安装到设备** - 自动将APK安装到连接的Android设备或模拟器

## 安装Skill

将 `cordova-apk-builder.skill` 文件安装到Claude Code：

```bash
# 方法1：使用Claude Code CLI
claude-code skill install cordova-apk-builder.skill

# 方法2：手动安装
# 将.skill文件复制到 ~/.claude/skills/ 目录
```

## 使用示例

安装skill后，你可以直接向Claude请求构建APK：

### 示例对话

**用户：** "帮我构建一个调试APK"

**Claude：** *使用cordova-apk-builder skill构建debug APK*

**用户：** "生成发布版本的APK并签名"

**Claude：** *引导你生成keystore，配置签名，然后构建signed release APK*

**用户：** "把APK安装到我的手机上"

**Claude：** *使用install_apk.sh脚本将APK安装到连接的设备*

## Skill包含的脚本

- `scripts/build_debug.sh` - 构建调试APK
- `scripts/build_release.sh` - 构建发布APK
- `scripts/generate_keystore.sh` - 生成Android签名密钥库
- `scripts/sign_apk.sh` - 手动签名APK
- `scripts/install_apk.sh` - 安装APK到设备

## 参考文档

- `references/signing_guide.md` - 详细的APK签名指南
- `references/build_config.md` - 构建配置参考
- `assets/build.json.example` - 签名配置模板

## 环境要求

- Node.js 和 npm
- Cordova CLI (`npm install -g cordova`)
- Java JDK 11+
- Android SDK
- Android SDK Platform Tools (adb)

## 典型工作流程

### 1. 首次设置
```bash
# 生成签名密钥
./scripts/generate_keystore.sh

# 配置签名信息（可选）
cp assets/build.json.example build.json
# 编辑build.json填入密钥信息
```

### 2. 开发测试
```bash
# 构建调试版本
./scripts/build_debug.sh

# 安装到设备
./scripts/install_apk.sh
```

### 3. 发布部署
```bash
# 构建发布版本（自动签名）
./scripts/build_release.sh

# 或者分步操作
./scripts/build_release.sh  # 构建未签名APK
./scripts/sign_apk.sh       # 手动签名
```

## 技术支持

查看 `SKILL.md` 获取完整文档，包括：
- 详细使用说明
- 故障排除指南
- CI/CD集成示例
- 安全最佳实践

## 许可证

MIT License

---

**创建日期：** 2026-01-17
**版本：** 1.0.0
**作者：** RUthirsty Team

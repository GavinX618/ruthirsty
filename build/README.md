# 应用图标说明

## 📍 图标文件位置

Mac应用需要ICNS格式的图标文件：
```
build/icon.icns
```

## 🎨 创建图标

### 步骤1：准备PNG图标

- **尺寸**：1024x1024 像素
- **格式**：PNG（透明背景）
- **建议**：简洁的水滴或林志玲头像

### 步骤2：转换为ICNS格式

**在线转换（推荐）：**
1. 访问 https://cloudconvert.com/png-to-icns
2. 上传你的PNG图标
3. 下载转换后的ICNS文件
4. 重命名为`icon.icns`并放到`build/`目录

**使用Mac命令行：**
```bash
# 1. 创建iconset目录
mkdir MyIcon.iconset

# 2. 生成不同尺寸
sips -z 16 16     icon.png --out MyIcon.iconset/icon_16x16.png
sips -z 32 32     icon.png --out MyIcon.iconset/icon_16x16@2x.png
sips -z 32 32     icon.png --out MyIcon.iconset/icon_32x32.png
sips -z 64 64     icon.png --out MyIcon.iconset/icon_32x32@2x.png
sips -z 128 128   icon.png --out MyIcon.iconset/icon_128x128.png
sips -z 256 256   icon.png --out MyIcon.iconset/icon_128x128@2x.png
sips -z 256 256   icon.png --out MyIcon.iconset/icon_256x256.png
sips -z 512 512   icon.png --out MyIcon.iconset/icon_256x256@2x.png
sips -z 512 512   icon.png --out MyIcon.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out MyIcon.iconset/icon_512x512@2x.png

# 3. 转换为ICNS
iconutil -c icns MyIcon.iconset

# 4. 移动到build目录
mv MyIcon.icns build/icon.icns
```

## 💧 默认图标建议

可以使用：
- 💧 水滴emoji风格
- 🥤 杯子图标
- 🌊 水波纹图案
- 或林志玲头像（如果有合法使用权）

## 🔄 重新构建

添加/更换图标后，需要重新构建：
```bash
./build-mac.sh
# 选择选项2或4
```

## 📝 注意事项

1. 图标应该简洁明了，在小尺寸下也清晰可见
2. 建议使用透明背景（PNG格式）
3. 避免过于复杂的图案
4. Mac会自动为图标添加圆角和阴影效果

## 🎯 占位符图标

如果暂时没有图标，应用会使用Electron默认图标。不影响功能，只是显示为默认的Electron图标。

---

**提示**：图标只影响应用在Dock和Finder中的显示，不影响应用内部的界面。

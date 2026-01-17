# 如何添加林志玲图片

## 📸 图片要求

- **文件名**: `avatar.png` (或 `avatar.jpg`)
- **位置**: `www/img/avatar.png`
- **推荐尺寸**: 300x300 像素或更大
- **格式**: PNG、JPG 都可以
- **建议**: 使用方形图片效果最好

## 🎯 添加步骤

### 步骤1：准备图片

1. 找一张林志玲的图片
2. 最好是正面照、头像或半身照
3. 建议使用方形或接近方形的图片

### 步骤2：放置图片

将图片重命名为 `avatar.png` 或 `avatar.jpg`，然后放到：

```
RUthirsty-cordova/
└── www/
    └── img/
        └── avatar.png  ← 放这里
```

### 步骤3：如果使用JPG格式

如果你的图片是JPG格式，需要修改 `www/index.html` 文件：

找到这一行：
```html
<img id="avatarImage" src="img/avatar.png" alt="打卡图标"
```

改成：
```html
<img id="avatarImage" src="img/avatar.jpg" alt="打卡图标"
```

### 步骤4：刷新浏览器

- 在浏览器中按 `Ctrl+Shift+R` (Windows/Linux)
- 或 `Cmd+Shift+R` (Mac)
- 强制刷新页面

## ✨ 效果说明

图片会显示为：
- 圆形头像
- 90x90像素大小
- 白色发光边框
- 浮动动画效果
- 玻璃质感

## 🔄 临时测试

如果暂时没有图片，可以使用网络图片测试：

在 `www/index.html` 中找到：
```html
<img id="avatarImage" src="img/avatar.png"
```

临时改成（仅用于测试）：
```html
<img id="avatarImage" src="https://via.placeholder.com/300"
```

## ⚠️ 注意事项

1. **图片版权**：确保你有权使用该图片
2. **文件大小**：建议不超过500KB，太大会影响加载速度
3. **备用方案**：如果图片加载失败，会自动显示原来的💧水滴图标

## 🎨 进阶定制

如果想调整头像大小，编辑 `www/css/index.css`：

```css
.button-avatar {
    width: 90px;   /* 改这里 */
    height: 90px;  /* 改这里 */
    /* ... */
}
```

## 📱 在APK中使用

构建APK时，图片会自动打包进去，用户看到的就是你设置的图片。

---

**提示**：图片添加后记得提交到git仓库（如果使用版本控制）。

# 打卡声音说明

## 🔊 当前实现

应用已集成了两种声音播放方式：

### 方式1：自动生成的声音（默认）
使用 Web Audio API 实时生成一个清脆的"叮"声：
- 不需要音频文件
- 轻量级，无需下载
- 兼容所有现代浏览器
- 声音特点：800Hz → 400Hz 的下降音，持续0.3秒

### 方式2：自定义音频文件（可选）
如果你想使用自己的声音，可以添加音频文件：

## 📁 添加自定义音频

### 步骤1：准备音频文件

**推荐格式：** MP3、WAV、OGG
**推荐时长：** 0.5-1秒（太长会影响体验）
**文件名：** `success.mp3`

**音效建议：**
- 叮咚声
- 水滴声
- 清脆的铃声
- 林志玲的语音（比如"喝水啦"、"好棒"等）

### 步骤2：放置音频文件

```
RUthirsty-cordova/
└── www/
    └── sounds/
        └── success.mp3  ← 放这里
```

### 步骤3：修改代码使用自定义音频

在 `www/js/index.js` 中找到：
```javascript
// 播放成功声音
playSuccessSound();
```

改成：
```javascript
// 播放自定义音频
playCustomSound();
```

## 🎵 获取音效资源

### 免费音效网站
1. **Freesound.org** - https://freesound.org/
   - 搜索 "ding", "notification", "water drop"

2. **Zapsplat** - https://www.zapsplat.com/
   - 免费音效库

3. **Mixkit** - https://mixkit.co/free-sound-effects/
   - 高质量免费音效

### 林志玲语音（需要自己录制或获取授权）
- 找林志玲的配音片段
- 或使用AI语音合成（需遵守使用规定）

## 🎚️ 调整音量

在代码中可以调整音量（0.0 - 1.0）：

**生成的声音：**
```javascript
gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
// 改这里：0.3 = 30% 音量
```

**自定义音频：**
```javascript
audio.volume = 0.5; // 改这里：0.5 = 50% 音量
```

## 🔧 高级定制

### 更换生成的声音类型

在 `playSuccessSound()` 函数中：

**当前（叮声）：**
```javascript
oscillator.frequency.setValueAtTime(800, ctx.currentTime);
oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
```

**水滴声（低沉）：**
```javascript
oscillator.frequency.setValueAtTime(300, ctx.currentTime);
oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);
```

**欢快的双音：**
```javascript
// 第一个音
oscillator.frequency.setValueAtTime(600, ctx.currentTime);
oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.1);
```

## 📱 移动端注意事项

- iOS需要用户交互后才能播放声音（已处理）
- 部分浏览器的静音模式会阻止声音
- 建议测试不同设备的音量和音效

## 🧪 测试

1. 刷新页面
2. 点击"喝水打卡"按钮
3. 应该听到清脆的"叮"声
4. 如果没有声音，检查：
   - 设备音量是否打开
   - 浏览器是否允许播放声音
   - 查看浏览器控制台是否有错误

---

**提示**：默认的生成声音已经足够好用，无需额外配置。如果想要特殊音效，再添加自定义音频文件。

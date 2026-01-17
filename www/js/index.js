// RUthirsty - 喝水打卡应用（升级版）
// 数据存储键名
const STORAGE_KEY = 'ruthirsty_records';
const REMINDER_SETTINGS_KEY = 'ruthirsty_reminder_settings';

// 每日目标（ml）
const DAILY_GOAL = 2000;

// 提醒定时器
let reminderTimer = null;
let lastNotificationTime = 0;

// 音频上下文（用于生成声音）
let audioContext = null;

// 初始化音频上下文
function initAudioContext() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    return audioContext;
}

// 播放打卡成功声音
function playSuccessSound() {
    const ctx = initAudioContext();
    if (!ctx) return;

    try {
        // 创建振荡器（产生声音）
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // 连接节点
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        // 设置音调（清脆的"叮"声）
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);

        // 设置音量（淡入淡出）
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        // 播放声音
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
    } catch (e) {
        console.log('Sound play error:', e);
    }
}

// 应用主对象
const app = {
    // 初始化应用
    initialize: function() {
        // 同时支持浏览器和Cordova环境
        if (window.cordova) {
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        } else {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', this.onDeviceReady.bind(this));
            } else {
                this.onDeviceReady();
            }
        }
    },

    // 设备准备就绪
    onDeviceReady: function() {
        console.log('App is ready');
        this.bindEvents();
        this.loadRecords();
        this.loadReminderSettings();
        this.updateUI();
        this.requestNotificationPermission();
    },

    // 绑定事件
    bindEvents: function() {
        // 绑定三个喝水量按钮
        const amountButtons = document.querySelectorAll('.amount-button');
        amountButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const amount = parseInt(button.getAttribute('data-amount'));
                this.onDrinkButtonClick(button, amount);
            });
        });

        // 绑定设置按钮
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsModal = document.getElementById('settingsModal');
        const settingsOverlay = document.getElementById('settingsOverlay');
        const closeSettingsBtn = document.getElementById('closeSettingsBtn');

        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.add('show');
        });

        closeSettingsBtn.addEventListener('click', () => {
            settingsModal.classList.remove('show');
        });

        settingsOverlay.addEventListener('click', () => {
            settingsModal.classList.remove('show');
        });

        // 绑定提醒开关
        const reminderToggle = document.getElementById('reminderToggle');
        const reminderTimeSettings = document.getElementById('reminderTimeSettings');

        reminderToggle.addEventListener('change', () => {
            const enabled = reminderToggle.checked;
            reminderTimeSettings.style.display = enabled ? 'block' : 'none';
            this.saveReminderSettings();

            if (enabled) {
                this.startReminder();
                this.showToast('✅ 智能提醒已开启');
            } else {
                this.stopReminder();
                this.showToast('❌ 提醒已关闭');
            }
        });

        // 绑定时间设置变化
        const startTimeInput = document.getElementById('reminderStartTime');
        const endTimeInput = document.getElementById('reminderEndTime');

        startTimeInput.addEventListener('change', () => {
            this.saveReminderSettings();
            if (reminderToggle.checked) {
                this.stopReminder();
                this.startReminder();
            }
        });

        endTimeInput.addEventListener('change', () => {
            this.saveReminderSettings();
            if (reminderToggle.checked) {
                this.stopReminder();
                this.startReminder();
            }
        });
    },

    // 打卡按钮点击事件
    onDrinkButtonClick: function(button, amount) {
        // 初始化音频上下文（需要用户交互）
        initAudioContext();

        // 添加按钮点击动画效果
        button.classList.add('button-press');
        setTimeout(() => {
            button.classList.remove('button-press');
        }, 400);

        // 记录喝水
        this.recordDrink(amount);
    },

    // 记录喝水
    recordDrink: function(amount) {
        console.log('记录喝水:', amount, 'ml');
        const now = new Date();
        const record = {
            id: Date.now(),
            timestamp: now.toISOString(),
            date: this.formatDate(now),
            time: this.formatTime(now),
            amount: amount // 喝水量（ml）
        };

        console.log('新记录:', record);

        // 获取现有记录
        let records = this.getRecords();
        console.log('现有记录数:', records.length);

        // 添加新记录到开头
        records.unshift(record);

        // 保存记录
        this.saveRecords(records);
        console.log('记录已保存，总数:', records.length);

        // 更新界面
        this.updateUI();

        // 播放成功声音
        playSuccessSound();

        // 显示反馈
        this.showToast(`✨ 打卡成功！+${amount}ml`);
    },

    // 获取所有记录
    getRecords: function() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error reading records:', e);
            return [];
        }
    },

    // 保存记录
    saveRecords: function(records) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        } catch (e) {
            console.error('Error saving records:', e);
        }
    },

    // 加载记录
    loadRecords: function() {
        this.getRecords();
    },

    // 获取今日记录
    getTodayRecords: function() {
        const records = this.getRecords();
        const today = this.formatDate(new Date());
        return records.filter(record => record.date === today);
    },

    // 计算今日总喝水量
    getTodayTotal: function() {
        const todayRecords = this.getTodayRecords();
        return todayRecords.reduce((total, record) => total + (record.amount || 0), 0);
    },

    // 更新界面
    updateUI: function() {
        this.updateProgress();
        this.updateStats();
        this.renderRecordsList();
    },

    // 更新进度条
    updateProgress: function() {
        const total = this.getTodayTotal();
        const percentage = Math.min(Math.round((total / DAILY_GOAL) * 100), 100);

        // 更新显示的数字
        document.getElementById('currentAmount').textContent = total;
        document.getElementById('progressPercentage').textContent = percentage + '%';

        // 更新圆形进度条
        const circle = document.getElementById('progressCircle');
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;

        circle.style.strokeDashoffset = offset;
    },

    // 更新统计信息
    updateStats: function() {
        const todayRecords = this.getTodayRecords();
        const allRecords = this.getRecords();
        const total = this.getTodayTotal();
        const remaining = Math.max(DAILY_GOAL - total, 0);

        // 更新今日打卡次数
        document.getElementById('todayCount').textContent = todayRecords.length;

        // 更新总打卡次数（带动画）
        const totalCountElement = document.getElementById('totalCount');
        totalCountElement.textContent = allRecords.length;
        totalCountElement.classList.add('update-animation');
        setTimeout(() => {
            totalCountElement.classList.remove('update-animation');
        }, 500);

        // 更新剩余量
        document.getElementById('remainAmount').textContent = remaining + 'ml';

        // 计算连续打卡天数（带动画）
        const streakDays = this.calculateStreakDays();
        const streakElement = document.getElementById('streakDays');
        streakElement.textContent = streakDays;
        streakElement.classList.add('update-animation');
        setTimeout(() => {
            streakElement.classList.remove('update-animation');
        }, 500);
    },

    // 计算连续打卡天数
    calculateStreakDays: function() {
        const records = this.getRecords();
        if (records.length === 0) return 0;

        // 获取所有不重复的日期
        const uniqueDates = [...new Set(records.map(r => r.date))].sort().reverse();

        if (uniqueDates.length === 0) return 0;

        let streak = 0;
        const today = this.formatDate(new Date());
        let checkDate = new Date();

        // 从今天开始往前检查
        for (let i = 0; i < 365; i++) { // 最多检查一年
            const dateStr = this.formatDate(checkDate);

            if (uniqueDates.includes(dateStr)) {
                streak++;
            } else if (dateStr !== today) {
                // 如果不是今天且没有记录，则中断
                break;
            }

            // 往前推一天
            checkDate.setDate(checkDate.getDate() - 1);
        }

        return streak;
    },

    // 渲染记录列表
    renderRecordsList: function() {
        const todayRecords = this.getTodayRecords();
        const recordsList = document.getElementById('recordsList');

        console.log('渲染记录列表，今日记录数:', todayRecords.length);

        if (todayRecords.length === 0) {
            recordsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">💧</div>
                    <p>还没有喝水记录</p>
                    <p class="empty-hint">选择饮水量开始打卡吧！</p>
                </div>
            `;
            return;
        }

        // 生成记录列表HTML
        let html = '';
        todayRecords.forEach((record, index) => {
            const amount = record.amount || 200; // 兼容旧数据
            const badgeText = amount >= 300 ? '大杯' : amount >= 200 ? '中杯' : '小杯';

            html += `
                <div class="record-item" style="animation-delay: ${index * 0.05}s" data-id="${record.id}">
                    <div class="record-icon">💧</div>
                    <div class="record-info">
                        <div class="record-time">${record.time}</div>
                        <div class="record-date">${record.date}</div>
                    </div>
                    <div class="record-amount">
                        <div class="record-volume">${amount}ml</div>
                        <div class="record-badge">${badgeText}</div>
                    </div>
                    <button class="record-delete-btn" data-id="${record.id}">
                        <span>🗑️</span>
                    </button>
                </div>
            `;
        });

        recordsList.innerHTML = html;
        console.log('记录列表已更新，显示', todayRecords.length, '条记录');

        // 绑定删除按钮事件
        this.bindDeleteButtons();
    },

    // 绑定删除按钮事件
    bindDeleteButtons: function() {
        const deleteButtons = document.querySelectorAll('.record-delete-btn');

        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const recordId = parseInt(button.getAttribute('data-id'));
                const recordItem = button.closest('.record-item');

                // 添加删除动画
                recordItem.style.transition = 'all 0.3s ease';
                recordItem.style.transform = 'scale(0.8)';
                recordItem.style.opacity = '0';

                // 等待动画完成后删除
                setTimeout(() => {
                    this.deleteRecord(recordId);
                }, 300);
            });
        });
    },

    // 删除记录
    deleteRecord: function(recordId) {
        // 获取所有记录
        let records = this.getRecords();

        // 找到要删除的记录
        const recordToDelete = records.find(r => r.id === recordId);
        if (!recordToDelete) return;

        // 从数组中删除
        records = records.filter(r => r.id !== recordId);

        // 保存更新后的记录
        this.saveRecords(records);

        // 更新界面
        this.updateUI();

        // 显示提示
        this.showToast(`🗑️ 已删除 ${recordToDelete.amount}ml 打卡记录`);
    },

    // 显示提示信息
    showToast: function(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('toast-show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    },

    // 格式化日期 (YYYY-MM-DD)
    formatDate: function(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    // 格式化时间 (HH:MM:SS)
    formatTime: function(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    },

    // 请求通知权限
    requestNotificationPermission: function() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                console.log('Notification permission:', permission);
            });
        }
    },

    // 加载提醒设置
    loadReminderSettings: function() {
        try {
            const settings = localStorage.getItem(REMINDER_SETTINGS_KEY);
            if (settings) {
                const { enabled, startTime, endTime } = JSON.parse(settings);
                document.getElementById('reminderToggle').checked = enabled || false;
                document.getElementById('reminderStartTime').value = startTime || '08:00';
                document.getElementById('reminderEndTime').value = endTime || '20:00';

                const reminderTimeSettings = document.getElementById('reminderTimeSettings');
                reminderTimeSettings.style.display = enabled ? 'block' : 'none';

                if (enabled) {
                    this.startReminder();
                }
            }
        } catch (e) {
            console.error('Error loading reminder settings:', e);
        }
    },

    // 保存提醒设置
    saveReminderSettings: function() {
        try {
            const settings = {
                enabled: document.getElementById('reminderToggle').checked,
                startTime: document.getElementById('reminderStartTime').value,
                endTime: document.getElementById('reminderEndTime').value
            };
            localStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error('Error saving reminder settings:', e);
        }
    },

    // 开始提醒
    startReminder: function() {
        console.log('启动智能提醒');
        // 每10分钟检查一次是否需要提醒
        reminderTimer = setInterval(() => {
            this.checkAndNotify();
        }, 10 * 60 * 1000); // 10分钟

        // 立即检查一次
        setTimeout(() => {
            this.checkAndNotify();
        }, 5000); // 5秒后首次检查
    },

    // 停止提醒
    stopReminder: function() {
        console.log('停止提醒');
        if (reminderTimer) {
            clearInterval(reminderTimer);
            reminderTimer = null;
        }
    },

    // 检查是否需要提醒
    checkAndNotify: function() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour * 60 + currentMinute; // 转换为分钟

        // 获取设置的时间段
        const startTime = document.getElementById('reminderStartTime').value;
        const endTime = document.getElementById('reminderEndTime').value;

        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);

        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        // 检查是否在提醒时间段内
        if (currentTime < startMinutes || currentTime > endMinutes) {
            console.log('不在提醒时间段内');
            return;
        }

        // 检查是否刚刚通知过（避免频繁通知）
        const timeSinceLastNotification = Date.now() - lastNotificationTime;
        if (timeSinceLastNotification < 30 * 60 * 1000) { // 30分钟内不重复通知
            console.log('距离上次通知时间太短');
            return;
        }

        // 智能判断是否需要提醒
        const todayTotal = this.getTodayTotal();
        const todayRecords = this.getTodayRecords();
        const percentage = (todayTotal / DAILY_GOAL) * 100;

        // 计算预期进度（根据当前时间）
        const totalMinutes = endMinutes - startMinutes;
        const passedMinutes = currentTime - startMinutes;
        const expectedPercentage = (passedMinutes / totalMinutes) * 100;

        let shouldNotify = false;
        let message = '';

        // 智能提醒逻辑
        if (todayRecords.length === 0) {
            // 还没开始喝水
            shouldNotify = true;
            message = '💧 今天还没有喝水哦！快来打卡吧~';
        } else if (percentage < 25 && currentTime > startMinutes + 120) {
            // 超过2小时了，但进度不到25%
            shouldNotify = true;
            message = `💧 已经${Math.floor(passedMinutes / 60)}小时了，才喝了${todayTotal}ml，加油哦！`;
        } else if (percentage < expectedPercentage - 20) {
            // 实际进度落后预期20%以上
            shouldNotify = true;
            const remaining = DAILY_GOAL - todayTotal;
            message = `💧 进度有点落后啦！还需要${remaining}ml才能达成目标！`;
        } else if (percentage >= 50 && percentage < 60 && todayRecords.length < 3) {
            // 进度过半但打卡次数少，提醒多喝几次
            shouldNotify = true;
            message = '💧 进度不错！记得少量多次更健康哦~';
        }

        if (shouldNotify) {
            this.sendNotification(message);
            lastNotificationTime = Date.now();
        }
    },

    // 发送通知
    sendNotification: function(message) {
        console.log('发送通知:', message);

        // 检查通知权限
        if ('Notification' in window && Notification.permission === 'granted') {
            try {
                const notification = new Notification('我要喝水 💧', {
                    body: message,
                    icon: 'img/icon-192.png',
                    badge: 'img/icon-192.png',
                    vibrate: [200, 100, 200],
                    tag: 'water-reminder',
                    requireInteraction: false
                });

                // 点击通知时聚焦窗口
                notification.onclick = function() {
                    window.focus();
                    notification.close();
                };

                // 3秒后自动关闭
                setTimeout(() => {
                    notification.close();
                }, 3000);
            } catch (e) {
                console.error('Error sending notification:', e);
                // 如果通知失败，使用toast提示
                this.showToast(message);
            }
        } else {
            // 如果没有通知权限，使用toast提示
            this.showToast(message);
        }
    }
};

// 启动应用
app.initialize();

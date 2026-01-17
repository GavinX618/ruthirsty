// RUthirsty - 喝水打卡应用（升级版）
// 数据存储键名
const STORAGE_KEY = 'ruthirsty_records';

// 每日目标（ml）
const DAILY_GOAL = 2000;

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
        this.updateUI();
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
                <div class="record-item" style="animation-delay: ${index * 0.05}s">
                    <div class="record-icon">💧</div>
                    <div class="record-info">
                        <div class="record-time">${record.time}</div>
                        <div class="record-date">${record.date}</div>
                    </div>
                    <div class="record-amount">
                        <div class="record-volume">${amount}ml</div>
                        <div class="record-badge">${badgeText}</div>
                    </div>
                </div>
            `;
        });

        recordsList.innerHTML = html;
        console.log('记录列表已更新，显示', todayRecords.length, '条记录');
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
    }
};

// 启动应用
app.initialize();

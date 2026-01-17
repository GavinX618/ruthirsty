const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    // 创建浏览器窗口
    mainWindow = new BrowserWindow({
        width: 420,
        height: 780,
        minWidth: 380,
        minHeight: 650,
        maxWidth: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            webSecurity: true
        },
        titleBarStyle: 'hiddenInset', // Mac风格的标题栏
        backgroundColor: '#667eea',
        show: false, // 先隐藏，加载完成后再显示
        icon: path.join(__dirname, 'www/img/icon.png')
    });

    // 加载应用
    mainWindow.loadFile('www/index.html');

    // 窗口准备好后显示
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // 创建应用菜单
    createMenu();

    // 打开开发者工具（可选，发布时注释掉）
    // mainWindow.webContents.openDevTools();

    // 窗口关闭时的处理
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

function createMenu() {
    const template = [
        {
            label: '我要喝水',
            submenu: [
                {
                    label: '关于 我要喝水',
                    role: 'about'
                },
                { type: 'separator' },
                {
                    label: '隐藏',
                    accelerator: 'Command+H',
                    role: 'hide'
                },
                {
                    label: '隐藏其他',
                    accelerator: 'Command+Alt+H',
                    role: 'hideOthers'
                },
                {
                    label: '显示全部',
                    role: 'unhide'
                },
                { type: 'separator' },
                {
                    label: '退出',
                    accelerator: 'Command+Q',
                    click: function() {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: '编辑',
            submenu: [
                {
                    label: '撤销',
                    accelerator: 'CmdOrCtrl+Z',
                    role: 'undo'
                },
                {
                    label: '重做',
                    accelerator: 'Shift+CmdOrCtrl+Z',
                    role: 'redo'
                },
                { type: 'separator' },
                {
                    label: '剪切',
                    accelerator: 'CmdOrCtrl+X',
                    role: 'cut'
                },
                {
                    label: '复制',
                    accelerator: 'CmdOrCtrl+C',
                    role: 'copy'
                },
                {
                    label: '粘贴',
                    accelerator: 'CmdOrCtrl+V',
                    role: 'paste'
                },
                {
                    label: '全选',
                    accelerator: 'CmdOrCtrl+A',
                    role: 'selectAll'
                }
            ]
        },
        {
            label: '查看',
            submenu: [
                {
                    label: '重新加载',
                    accelerator: 'CmdOrCtrl+R',
                    click: function(item, focusedWindow) {
                        if (focusedWindow) focusedWindow.reload();
                    }
                },
                {
                    label: '全屏',
                    accelerator: (function() {
                        if (process.platform === 'darwin')
                            return 'Ctrl+Command+F';
                        else
                            return 'F11';
                    })(),
                    click: function(item, focusedWindow) {
                        if (focusedWindow)
                            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                    }
                },
                {
                    label: '开发者工具',
                    accelerator: (function() {
                        if (process.platform === 'darwin')
                            return 'Alt+Command+I';
                        else
                            return 'Ctrl+Shift+I';
                    })(),
                    click: function(item, focusedWindow) {
                        if (focusedWindow)
                            focusedWindow.toggleDevTools();
                    }
                }
            ]
        },
        {
            label: '窗口',
            role: 'window',
            submenu: [
                {
                    label: '最小化',
                    accelerator: 'CmdOrCtrl+M',
                    role: 'minimize'
                },
                {
                    label: '关闭',
                    accelerator: 'CmdOrCtrl+W',
                    role: 'close'
                }
            ]
        },
        {
            label: '帮助',
            role: 'help',
            submenu: [
                {
                    label: '了解更多',
                    click: function() {
                        require('electron').shell.openExternal('https://github.com');
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// Electron 准备就绪时创建窗口
app.whenReady().then(createWindow);

// 所有窗口关闭时退出应用（macOS除外）
app.on('window-all-closed', function () {
    // 在 macOS 上，应用通常会保持活动状态
    // 直到用户使用 Cmd + Q 明确退出
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // 在 macOS 上，点击 dock 图标时重新创建窗口
    if (mainWindow === null) {
        createWindow();
    }
});

// 禁用硬件加速（可选，某些Mac上可能需要）
// app.disableHardwareAcceleration();

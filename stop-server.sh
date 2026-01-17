#!/bin/bash

# 停止 live-server 服务的脚本

echo "正在查找 live-server 进程..."

# 查找 live-server 进程
PIDS=$(ps aux | grep "live-server www" | grep -v grep | awk '{print $2}')

if [ -z "$PIDS" ]; then
    echo "未找到运行中的 live-server 进程"
    exit 0
fi

echo "找到以下进程："
ps aux | grep "live-server www" | grep -v grep

echo ""
read -p "确认要停止这些进程吗? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "正在停止进程..."
    for PID in $PIDS; do
        kill $PID 2>/dev/null && echo "已停止进程 $PID" || echo "无法停止进程 $PID"
    done
    echo "完成！"
else
    echo "已取消"
fi

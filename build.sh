#!/bin/bash

# RUthirsty Cordova 构建脚本

echo "================================"
echo "RUthirsty - 喝水打卡应用"
echo "Cordova 构建脚本"
echo "================================"
echo ""

# 检查Cordova是否安装
if ! command -v cordova &> /dev/null
then
    echo "错误: Cordova CLI未安装"
    echo "请运行: npm install -g cordova"
    exit 1
fi

# 检查是否需要安装依赖
if [ ! -d "node_modules" ]; then
    echo "正在安装依赖..."
    npm install
fi

# 检查Android平台是否已添加
if [ ! -d "platforms/android" ]; then
    echo "正在添加Android平台..."
    cordova platform add android
fi

echo ""
echo "请选择操作:"
echo "1. 在浏览器中运行（开发调试）"
echo "2. 构建Android APK（调试版本）"
echo "3. 构建Android APK（发布版本）"
echo "4. 在Android设备上运行"
echo "5. 在Android模拟器上运行"
echo ""
read -p "请输入选项 (1-5): " choice

case $choice in
    1)
        echo "正在启动Cordova服务器..."
        cordova serve
        ;;
    2)
        echo "正在构建Android调试版本..."
        cordova build android
        echo ""
        echo "构建完成！"
        echo "APK位置: platforms/android/app/build/outputs/apk/debug/app-debug.apk"
        ;;
    3)
        echo "正在构建Android发布版本..."
        cordova build android --release
        echo ""
        echo "构建完成！"
        echo "APK位置: platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk"
        echo "注意: 发布版本需要签名才能安装"
        ;;
    4)
        echo "正在连接Android设备并运行..."
        cordova run android
        ;;
    5)
        echo "正在启动Android模拟器并运行..."
        cordova emulate android
        ;;
    *)
        echo "无效的选项"
        exit 1
        ;;
esac

echo ""
echo "操作完成！"

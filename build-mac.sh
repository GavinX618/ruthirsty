#!/bin/bash
# RUthirsty Mac应用构建脚本

echo "================================"
echo "RUthirsty Mac应用构建工具"
echo "================================"
echo ""

# 检查是否在Mac上运行
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "⚠️  警告: 此脚本最好在Mac上运行"
    echo "但Electron Builder支持跨平台构建，将继续..."
    echo ""
fi

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未安装Node.js"
    echo "请从 https://nodejs.org 下载并安装"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"
echo ""

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未安装npm"
    exit 1
fi

echo "✅ npm版本: $(npm --version)"
echo ""

# 显示菜单
echo "请选择构建选项:"
echo "1) 快速测试运行（不构建安装包）"
echo "2) 构建DMG安装包（推荐）"
echo "3) 构建ZIP压缩包"
echo "4) 构建所有格式（DMG + ZIP）"
echo ""
read -p "请输入选项 (1-4): " choice

case $choice in
    1)
        echo ""
        echo "📦 准备运行应用..."

        # 复制package.json
        cp package-mac.json package.json

        # 安装依赖
        echo "📥 安装依赖..."
        npm install

        # 运行应用
        echo "🚀 启动应用..."
        npm start
        ;;

    2)
        echo ""
        echo "📦 构建DMG安装包..."

        # 复制package.json
        cp package-mac.json package.json

        # 安装依赖
        echo "📥 安装依赖..."
        npm install

        # 构建DMG
        echo "🔨 开始构建..."
        npm run build-mac-dmg

        echo ""
        echo "✅ 构建完成！"
        echo "📍 安装包位置: dist-mac/RUthirsty-1.0.0.dmg"
        ;;

    3)
        echo ""
        echo "📦 构建ZIP压缩包..."

        # 复制package.json
        cp package-mac.json package.json

        # 安装依赖
        echo "📥 安装依赖..."
        npm install

        # 构建ZIP
        echo "🔨 开始构建..."
        npm run build-mac-zip

        echo ""
        echo "✅ 构建完成！"
        echo "📍 压缩包位置: dist-mac/RUthirsty-1.0.0-mac.zip"
        ;;

    4)
        echo ""
        echo "📦 构建所有格式..."

        # 复制package.json
        cp package-mac.json package.json

        # 安装依赖
        echo "📥 安装依赖..."
        npm install

        # 构建所有格式
        echo "🔨 开始构建..."
        npm run build-mac

        echo ""
        echo "✅ 构建完成！"
        echo "📍 输出目录: dist-mac/"
        ls -lh dist-mac/
        ;;

    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac

echo ""
echo "================================"
echo "构建完成！"
echo "================================"

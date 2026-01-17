#!/bin/bash

echo "======================================"
echo "  修复Mac构建依赖问题"
echo "======================================"
echo ""

cd /workspaces/RUthirsty-cordova

# 复制Mac配置
echo "📋 复制Mac配置文件..."
cp package-mac.json package.json

# 清理旧的依赖
echo "🧹 清理旧的依赖..."
rm -rf node_modules package-lock.json

# 重新安装所有依赖
echo "📥 安装所有依赖（包含dmg-license）..."
npm install

echo ""
echo "✅ 依赖安装完成！"
echo ""
echo "现在可以运行以下命令构建："
echo "  npm start              # 快速测试"
echo "  npm run build-mac-dmg  # 构建DMG"
echo "  npm run build-mac-zip  # 构建ZIP"
echo ""

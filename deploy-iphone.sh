#!/bin/bash

echo "🚀 我要喝水 - iPhone版部署工具"
echo "=================================="
echo ""

# 检查www目录
if [ ! -d "www" ]; then
    echo "❌ 错误：找不到www目录"
    echo "请确保在项目根目录下运行此脚本"
    exit 1
fi

echo "选择部署方式："
echo "1) GitHub Pages (推荐，需要GitHub账号)"
echo "2) Netlify (最简单，网页拖拽即可)"
echo "3) Vercel (需要Vercel账号)"
echo "4) 生成部署包（手动上传）"
echo ""
read -p "请选择 (1-4): " choice

case $choice in
    1)
        echo ""
        echo "📦 准备GitHub Pages部署..."

        # 检查是否已有git仓库
        if [ ! -d ".git" ]; then
            git init
            echo "✓ Git仓库已初始化"
        fi

        # 添加所有文件
        git add .
        git commit -m "iPhone PWA版本 - $(date '+%Y-%m-%d %H:%M:%S')"

        echo ""
        echo "📝 接下来的步骤："
        echo "1. 在GitHub上创建一个新仓库"
        echo "2. 复制仓库地址（如：https://github.com/username/ruthirsty.git）"
        echo ""
        read -p "请输入GitHub仓库地址: " repo_url

        if [ -z "$repo_url" ]; then
            echo "❌ 仓库地址不能为空"
            exit 1
        fi

        # 设置远程仓库
        git remote remove origin 2>/dev/null
        git remote add origin "$repo_url"

        # 推送到GitHub
        git branch -M main
        git push -u origin main --force

        echo ""
        echo "✅ 代码已推送到GitHub！"
        echo ""
        echo "📱 接下来在GitHub网站上操作："
        echo "1. 进入仓库: $repo_url"
        echo "2. 点击 Settings → Pages"
        echo "3. Source选择 'main' 分支"
        echo "4. Folder选择 '/www'"
        echo "5. 点击Save"
        echo ""
        echo "⏰ 等待3-5分钟后，你的应用将发布在："
        echo "https://你的用户名.github.io/仓库名/"
        echo ""
        ;;

    2)
        echo ""
        echo "📦 准备Netlify部署包..."

        # 创建部署包
        cd www
        zip -r ../ruthirsty-netlify.zip .
        cd ..

        echo ""
        echo "✅ 部署包已创建: ruthirsty-netlify.zip"
        echo ""
        echo "📱 接下来的步骤："
        echo "1. 访问: https://www.netlify.com/"
        echo "2. 注册/登录账号"
        echo "3. 点击 'Add new site' → 'Deploy manually'"
        echo "4. 直接拖拽 ruthirsty-netlify.zip 文件"
        echo "5. 等待部署完成"
        echo ""
        echo "🌐 Netlify会给你一个网址，如："
        echo "https://你的应用名.netlify.app"
        echo ""
        ;;

    3)
        echo ""
        echo "📦 准备Vercel部署..."

        # 检查是否安装了vercel
        if ! command -v vercel &> /dev/null; then
            echo "📥 正在安装Vercel CLI..."
            npm install -g vercel
        fi

        echo ""
        echo "🚀 开始部署到Vercel..."
        cd www
        vercel --prod
        cd ..

        echo ""
        echo "✅ 部署完成！"
        echo "Vercel会显示你的应用网址"
        echo ""
        ;;

    4)
        echo ""
        echo "📦 生成部署包..."

        # 创建时间戳
        timestamp=$(date '+%Y%m%d_%H%M%S')

        # 压缩www目录
        cd www
        zip -r "../ruthirsty-deploy-${timestamp}.zip" .
        cd ..

        echo ""
        echo "✅ 部署包已创建: ruthirsty-deploy-${timestamp}.zip"
        echo ""
        echo "📱 你可以将这个压缩包上传到："
        echo "- GitHub Pages"
        echo "- Netlify"
        echo "- Vercel"
        echo "- 任何支持静态网站的服务器"
        echo ""
        ;;

    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac

echo ""
echo "=================================="
echo "🎉 准备完成！"
echo ""
echo "📱 在iPhone上安装："
echo "1. 用Safari打开你的应用网址"
echo "2. 点击分享按钮"
echo "3. 选择'添加到主屏幕'"
echo "4. 完成！"
echo ""
echo "💡 详细说明请查看: iPhone安装指南.md"
echo "=================================="

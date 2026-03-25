# 🚀 Vercel部署详细步骤

## 第1步：准备GitHub仓库

### 方案A：使用GitHub Desktop（最简单，推荐）

1. **下载GitHub Desktop**
   - 访问：https://desktop.github.com
   - 下载并安装

2. **登录GitHub**
   - 打开GitHub Desktop
   - 点击 "Sign in to GitHub.com"
   - 登录你的GitHub账号

3. **克隆仓库**
   - 点击 "File" → "Clone repository"
   - 在URL栏输入：`https://github.com/Leo-fsf/ai-dev-platform`
   - 选择保存位置
   - 点击 "Clone"

4. **复制项目文件**
   - 打开克隆的仓库文件夹
   - 删除仓库中的所有文件（除了.git文件夹）
   - 复制 `/workspace/projects/workspace/ai-dev-platform` 中的所有文件到仓库文件夹

5. **提交并推送**
   - 在GitHub Desktop中查看更改
   - 输入提交信息："AI Dev Platform v1.0 完整版"
   - 点击 "Commit"
   - 点击 "Push origin"

**完成！代码已推送到GitHub**

---

### 方案B：使用命令行

如果你熟悉命令行，可以这样操作：

```bash
# 1. 进入项目目录
cd /workspace/projects/workspace/ai-dev-platform

# 2. 删除现有的git仓库（如果有）
rm -rf .git

# 3. 重新初始化
git init
git config user.email "your-email@example.com"
git config user.name "Your Name"

# 4. 添加所有文件
git add .
git commit -m "AI Dev Platform v1.0 完整版"

# 5. 添加远程仓库
git remote add origin https://github.com/Leo-fsf/ai-dev-platform.git

# 6. 强制推送（如果远程有内容）
git push -f origin main
```

**完成！代码已推送到GitHub**

---

## 第2步：部署到Vercel

### 1. 访问Vercel

打开浏览器访问：**https://vercel.com**

### 2. 登录账号

- 推荐使用 **GitHub账号登录**（最简单）
- 点击 "Continue with GitHub"
- 授权Vercel访问你的GitHub账号

### 3. 创建新项目

1. 登录后会看到仪表板
2. 点击右上角的 **"Add New..."** 按钮
3. 选择 **"Project"**

### 4. 导入项目

1. 在 "Import Project" 页面
2. 在搜索框输入：`ai-dev-platform`
3. 找到你的仓库：`Leo-fsf/ai-dev-platform`
4. 点击 **"Import"** 按钮

### 5. 配置项目

Vercel会自动检测配置，你只需要确认：

**项目信息：**
- **Project Name**: `ai-dev-platform`（可自定义，会作为域名的一部分）
- **Framework Preset**: `Next.js`（自动检测，无需修改）
- **Root Directory**: `/`（自动检测，无需修改）

**构建配置：**
- **Build Command**: `npm run build`（自动检测，无需修改）
- **Output Directory**: `out`（自动检测，无需修改）

**环境变量：**
- 如果有 `.env` 文件，可以添加环境变量
- 本项目无需额外配置

### 6. 部署

- 检查所有配置是否正确
- 点击 **"Deploy"** 按钮

**部署过程：**
1. Vercel拉取代码
2. 安装依赖（`npm install`）
3. 构建项目（`npm run build`）
4. 部署到CDN

**预计时间：2-3分钟**

---

## 第3步：访问你的网站

### 部署成功后

Vercel会显示：
```
🎉 Deployed Successfully

Your application is live at:
https://ai-dev-platform.vercel.app
```

**点击链接访问你的网站！**

### 查看部署日志

- 在项目页面可以看到部署历史
- 每次部署都有详细的日志
- 如果有错误，可以查看具体信息

---

## 第4步：验证功能

访问你的Vercel URL，验证以下功能：

### 页面访问
- [ ] 首页：`https://ai-dev-platform.vercel.app/`
- [ ] Agent：`https://ai-dev-platform.vercel.app/agent`
- [ ] 项目：`https://ai-dev-platform.vercel.app/projects`
- [ ] 用户中心：`https://ai-dev-platform.vercel.app/profile`
- [ ] 文档：`https://ai-dev-platform.vercel.app/docs`
- [ ] 登录：`https://ai-dev-platform.vercel.app/login`

### 功能测试
- [ ] 首页代码生成功能
- [ ] Agent对话和快捷问题
- [ ] 项目搜索、筛选、排序
- [ ] 语言切换（中英文）
- [ ] 暗黑模式切换
- [ ] 全局搜索（Command+K）
- [ ] Toast通知

---

## 🔄 更新代码

以后如果你想更新代码：

1. 修改代码
2. 提交到GitHub
3. Vercel会自动检测到推送并重新部署
4. 2-3分钟后新版本上线

---

## 🎊 完成！

恭喜！你的AI全栈开发平台已经成功部署到Vercel！

**分享你的网站：**
```
https://ai-dev-platform.vercel.app
```

---

## 🐛 遇到问题？

### 常见错误和解决方案

**问题1：构建失败**
- 检查GitHub上的代码是否完整
- 查看Vercel的构建日志
- 确认 `package.json` 正确

**问题2：页面404**
- 确认 `next.config.js` 中有 `output: 'export'`
- 确认构建成功

**问题3：样式不显示**
- 检查Tailwind配置
- 查看浏览器控制台错误

---

**需要帮助随时联系我！** 😊
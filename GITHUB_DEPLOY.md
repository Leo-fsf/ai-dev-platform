# 🚀 GitHub 部署全流程 - AI Dev Platform v2.0

## 📍 GitHub 仓库地址

**仓库地址**: https://github.com/Leo-fsf/ai-dev-platform.git

**克隆命令**: 
```bash
git clone https://github.com/Leo-fsf/ai-dev-platform.git
```

---

## 📋 部署方案总览

由于这是一个 Next.js 全栈应用（包含API路由），需要 Node.js 运行时环境，有以下部署方案：

### ⭐ 方案1：Vercel + GitHub集成（推荐，最简单）
- ✅ 一键部署
- ✅ 自动HTTPS
- ✅ 全球CDN
- ✅ 自动扩展
- ✅ 免费额度充足

### 方案2：Railway + GitHub
- ✅ 免费PostgreSQL
- ✅ 持久化存储
- ✅ 自动部署
- ✅ 免费额度充足

### 方案3：Render + GitHub
- ✅ 免费PostgreSQL
- ✅ 自动HTTPS
- ✅ DDoS保护
- ✅ 免费额度充足

---

## 🎯 方案1：Vercel 部署（推荐）

### 步骤1：准备 Vercel 账号

1. 访问 https://vercel.com
2. 使用GitHub账号登录（推荐，免注册）

### 步骤2：导入GitHub仓库

1. 登录后，点击 "Add New Project"
2. 选择 "Continue with GitHub"
3. 授权Vercel访问你的GitHub
4. 选择仓库：`Leo-fsf/ai-dev-platform`
5. 点击 "Import"

### 步骤3：配置环境变量

Vercel会自动检测Next.js项目并配置，但需要手动添加环境变量：

点击 "Settings" → "Environment Variables"，添加以下变量：

```bash
# 必需
DATABASE_URL="postgresql://user:password@host:5432/dbname"  # 或使用Vercel Postgres
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# 可选
OPENAI_API_KEY="sk-..."
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
```

**Vercel Postgres数据库配置**：
1. 点击 "Storage" → "Postgres Database"
2. 创建新数据库（免费500MB）
3. 复制连接字符串到DATABASE_URL

### 步骤4：部署

点击 "Deploy" 按钮，Vercel会自动：
- 检测项目类型
- 安装依赖
- 构建项目
- 部署应用

等待2-5分钟，部署完成后会显示：
- 🌐 访问地址：https://your-app.vercel.app
- 📦 构建日志
- ⚡ 性能监控

### 步骤5：连接自定义域名（可选）

1. 点击 "Settings" → "Domains"
2. 添加你的域名
3. 按照指引配置DNS记录

---

## 🎯 方案2：Railway 部署

### 步骤1：准备 Railway 账号

1. 访问 https://railway.app
2. 使用GitHub账号登录

### 步骤2：创建新项目

1. 点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择仓库：`Leo-fsf/ai-dev-platform`
4. 设置项目名称

### 步骤3：配置服务

Railway会自动检测package.json，需要配置：

**数据库服务**：
1. 点击 "New" → "Add Database"
2. 选择 "PostgreSQL"（免费）
3. 设置名称：`ai-dev-platform-db`

**环境变量**：
- 点击项目 → "Variables" → "New Variable"
- 添加环境变量（同上）

### 步骤4：部署

点击 "Deploy" 按钮

Railway会自动：
- 克隆代码
- 安装依赖
- 构建项目
- 启动服务

### 步骤5：获取访问地址

部署完成后，Railway会提供：
- 🌐 公网访问地址
- 📊 性能监控
- 📋 日志查看

---

## 🎯 方案3：Render 部署

### 步骤1：准备 Render 账号

1. 访问 https://render.com
2. 使用GitHub账号登录

### 步骤2：连接GitHub

1. 点击 "New +" → "Web Service"
2. 选择 "Connect GitHub"
3. 授权并选择仓库：`Leo-fsf/ai-dev-platform`

### 步骤3：配置

**构建命令**：
```
npm install
npm run build
npm run start
```

**环境变量**：
- 点击 "Advanced" → "Add Environment Variable"
- 添加环境变量（同上）

**数据库**：
- 创建PostgreSQL数据库
- 复制连接字符串

### 步骤：部署

点击 "Create Web Service" 开始部署

---

## 🔧 本地开发 + GitHub 同步

### 克隆仓库
```bash
git clone https://github.com/Leo-fsf/ai-dev-platform.git
cd ai-dev-platform
```

### 安装依赖
```bash
npm install
```

### 配置环境变量
```bash
cp .env.example .env.local
# 编辑 .env.local 配置数据库、JWT密钥等
```

### 初始化数据库
```bash
npx prisma generate
DATABASE_URL="file:./dev.db" npx prisma db push
DATABASE_URL="file:./dev.db" npx prisma db seed
```

### 启动开发服务器
```bash
DATABASE_URL="file:./dev.db" npm run dev
```

### 同步到GitHub
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### 拉取最新代码
```bash
git pull origin main
npm install
```

---

## 🌐 自动CI/CD部署（可选）

### GitHub Actions + Vercel

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Install Vercel CLI
        run: npm i -g vercel
      
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
```

在Vercel获取 `VERCEL_TOKEN` 和 `VERCEL_ORG_ID`，添加到GitHub仓库的Secrets中。

---

## 🧪 部署后检查清单

- [ ] 访问应用首页
- [ ] 测试注册/登录功能
- [ ] 测试AI对话功能
- [ ] 测试项目管理功能
- [ ] 检查API健康状态
- [ ] 验证数据库连接
- [ ] 测试文件上传功能
- [ ] 测试OAuth登录（需配置）
- [ ] 检查暗黑模式
- [ ] 检查多语言切换

---

## 📊 监控和日志

### Vercel
- 📊 Dashboard: https://vercel.com/dashboard
- 📝 Logs: 项目 → Logs
- 📈 Analytics: 项目 → Analytics

### Railway
- 📊 Dashboard: 项目 → Metrics
- 📝 Logs: 项目 → Logs

### Render
- 📊 Dashboard: 仪表盘
- 📝 Logs: Logs tab

---

## 🔄 更新应用

### Vercel
```bash
git add .
git commit -m "Update: description"
git push origin main
```
Vercel会自动检测推送并重新部署。

### Railway/Render
```bash
git push origin main
```
需要手动触发重新部署。

---

## 🎉 部署完成！

访问你的应用开始使用吧！

**GitHub仓库**: https://github.com/Leo-fsf/ai-dev-platform

**推荐部署平台**: Vercel（最简单）

**需要帮助？** 查看项目的 `DEPLOY_STEPS.md` 文件！

# 🚀 AI Dev Platform v2.0 - 部署指南

## 📋 部署前检查

### 1. 检查Node.js版本
```bash
node -v  # 需要 >= 18.0.0
```

### 2. 安装依赖
```bash
cd /workspace/projects/workspace/ai-dev-platform
npm install
```

### 3. 初始化数据库
```bash
# 生成Prisma客户端
npm run db:generate

# 推送数据库schema
npm run db:push

# 播种测试数据（可选）
npm run db:seed
```

---

## 方案1: SQLite 快速部署（推荐）

### 1. 配置环境变量
```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local，配置以下变量：
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
OPENAI_API_KEY=""  # 可选，用于AI功能
NEXT_PUBLIC_APP_URL="http://your-domain.com"
NODE_ENV="production"
```

### 2. 构建生产版本
```bash
npm run build
```

### 3. 启动服务
```bash
# 开发模式（带热重载）
npm run dev -p 3200

# 生产模式
npm run start -p 3200
```

### 4. 访问应用
打开浏览器访问：http://localhost:3200

---

## 方案2: Docker 生产部署

### 1. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 配置PostgreSQL连接
```

### 2. 启动服务
```bash
# 启动PostgreSQL和应用
docker-compose up -d

# 查看日志
docker-compose logs -f backend
```

### 3. 初始化数据库
```bash
# 进入容器
docker-compose exec backend sh

# 初始化数据库
npx prisma generate
npx prisma db push
npx prisma db seed

# 退出容器
exit
```

---

## 方案3: Vercel 部署

### 1. 安装Vercel CLI
```bash
npm i -g vercel
```

### 2. 登录Vercel
```bash
vercel login
```

### 3. 部署
```bash
cd /workspace/projects/workspace/ai-dev-platform
vercel
```

### 4. 配置环境变量
在Vercel控制台添加以下环境变量：
- DATABASE_URL
- JWT_SECRET
- OPENAI_API_KEY (可选)
- NEXT_PUBLIC_APP_URL

### 5. 重新部署
```bash
vercel --prod
```

---

## 🧪 数据库迁移

### SQLite 初始化
```bash
cd /workspace/projects/workspace/ai-dev-platform

# 1. 生成客户端
npx prisma generate

# 2. 推送schema
npx prisma db push

# 3. 播种测试数据
npx prisma db seed
```

### PostgreSQL 初始化
```bash
# 使用Docker时已自动初始化
# 或手动运行：
npx prisma generate
npx prisma db push
npx prisma db seed
```

---

## 🔐 环境变量配置

### 必需
```bash
DATABASE_URL="file:./dev.db"  # SQLite 或 PostgreSQL连接字符串
JWT_SECRET="your-super-secret-jwt-key-change-in-production"  # 生产环境必须设置强密钥
```

### 可选
```bash
OPENAI_API_KEY="sk-..."  # AI功能需要
NEXT_PUBLIC_APP_URL="http://your-domain.com"  # 应用URL
NODE_ENV="production"  # 运行环境
```

### OAuth配置（可选）
```bash
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

---

## 🎯 推荐部署方式

**快速测试/开发**: SQLite部署（方案1）
**生产环境**: Docker部署（方案2）
**快速上线**: Vercel部署（方案3）

---

## 📝 部署后验证

1. 访问应用首页
2. 测试注册/登录功能
3. 检查API健康状态：`curl http://your-domain/api/health`
4. 验证数据库连接

---

## 📊 默认测试账号

```
admin@example.com / password123
developer@example.com / password123
designer@example.com / password123
```

---

## 🎉 部署完成！

访问应用开始使用吧！

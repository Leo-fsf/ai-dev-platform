# AI Dev Platform 部署指南

## 📋 目录

- [开发环境部署](#开发环境部署)
- [生产环境部署](#生产环境部署)
- [Docker 部署](#docker-部署)
- [Vercel 部署](#vercel-部署)
- [环境变量配置](#环境变量配置)
- [常见问题](#常见问题)

---

## 🔧 开发环境部署

### 1. 前置要求

- Node.js >= 18.0.0
- npm 或 yarn
- Git

### 2. 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/Leo-fsf/ai-dev-platform.git
cd ai-dev-platform

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 文件

# 4. 初始化数据库
npm run db:generate
npm run db:migrate
npm run db:seed

# 5. 启动开发服务器
npm run dev

# 6. 访问应用
# 浏览器打开: http://localhost:3200
```

### 3. 测试账号

```
邮箱: admin@example.com
密码: password123

邮箱: developer@example.com
密码: password123

邮箱: designer@example.com
密码: password123
```

---

## 🚀 生产环境部署

### 1. 服务器要求

- CPU: 2核+
- 内存: 4GB+
- 存储: 20GB+
- 操作系统: Linux (Ubuntu 20.04+ 推荐)

### 2. 使用 PostgreSQL 数据库

#### 安装 PostgreSQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# 启动 PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 创建数据库

```bash
# 切换到 postgres 用户
sudo -u postgres psql

# 执行以下 SQL 命令
CREATE DATABASE aiplatform;
CREATE USER aiplatform WITH PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE aiplatform TO aiplatform;
\q
```

#### 更新环境变量

```env
DATABASE_URL="postgresql://aiplatform:your_strong_password@localhost:5432/aiplatform"
```

### 3. 使用 Redis 缓存（可选）

#### 安装 Redis

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install redis-server

# 启动 Redis
sudo systemctl start redis
sudo systemctl enable redis
```

#### 更新环境变量

```env
REDIS_URL="redis://localhost:6379"
```

### 4. 构建和启动

```bash
# 1. 安装依赖
npm ci --only=production

# 2. 运行数据库迁移
npm run db:migrate

# 3. 播种数据（可选）
npm run db:seed

# 4. 构建应用
npm run build

# 5. 启动应用
npm start

# 或使用 PM2
npm install -g pm2
pm2 start npm --name "ai-dev-platform" -- start
pm2 save
pm2 startup
```

---

## 🐳 Docker 部署

### 方式 1: SQLite 版本（简单）

```bash
# 1. 构建镜像
docker build -t ai-dev-platform .

# 2. 运行容器
docker run -d \
  --name ai-dev-platform \
  -p 3200:3000 \
  -v $(pwd)/data:/app/data \
  -e DATABASE_URL="file:/app/data/dev.db" \
  -e JWT_SECRET="your-super-secret-jwt-key" \
  ai-dev-platform
```

### 方式 2: PostgreSQL + Redis 版本（推荐）

```bash
# 1. 启动完整环境
docker-compose up -d

# 2. 初始化数据库
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed

# 3. 查看日志
docker-compose logs -f backend

# 4. 停止服务
docker-compose down

# 5. 重启服务
docker-compose restart
```

### Docker Compose 配置说明

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: aiplatform
      POSTGRES_PASSWORD: aiplatform_secret
      POSTGRES_DB: aiplatform
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build: .
    ports:
      - "3200:3000"
    environment:
      DATABASE_URL: postgresql://aiplatform:aiplatform_secret@postgres:5432/aiplatform
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-super-secret-jwt-key
      NODE_ENV: production
    depends_on:
      - postgres
      - redis
    volumes:
      - ./data:/app/data

volumes:
  postgres_data:
  redis_data:
```

---

## ☁️ Vercel 部署

### 1. 准备工作

1. 创建 GitHub 仓库并推送代码
2. 注册 Vercel 账号
3. 安装 Vercel CLI

```bash
npm install -g vercel
```

### 2. 配置环境变量

在 Vercel 控制台添加以下环境变量：

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="your-super-secret-jwt-key"
OPENAI_API_KEY="sk-your-openai-api-key"
NODE_ENV="production"
```

### 3. 部署

```bash
# 登录 Vercel
vercel login

# 部署
vercel

# 生产环境
vercel --prod
```

### 4. 数据库设置（Neon/Turso）

对于 Vercel，推荐使用 Neon（PostgreSQL）或 Turso（SQLite）：

#### Neon (PostgreSQL)

1. 访问 https://neon.tech
2. 创建项目
3. 复制连接字符串
4. 添加到 Vercel 环境变量

#### Turso (SQLite)

1. 访问 https://turso.tech
2. 创建数据库
3. 复制连接字符串
4. 添加到 Vercel 环境变量

---

## 🔐 环境变量配置

### 必需变量

```env
# 数据库连接（必需）
DATABASE_URL="your_database_url"

# JWT 密钥（必需，生产环境必须修改）
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# 应用URL（必需）
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### 可选变量

```env
# Redis 缓存（可选，用于性能优化）
REDIS_URL="redis://localhost:6379"

# OpenAI API（可选，用于 AI 功能）
OPENAI_API_KEY="sk-your-openai-api-key"

# OAuth 配置（可选，用于第三方登录）
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# 文件上传（可选）
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp

# 环境（可选，默认 development）
NODE_ENV="production"
```

---

## 🔍 常见问题

### 1. 数据库连接失败

**问题**: `Error: Can't reach database server`

**解决方案**:
- 检查数据库是否正在运行
- 验证 `DATABASE_URL` 是否正确
- 确保数据库用户有足够的权限

### 2. JWT Token 无效

**问题**: 用户登录后立即被登出

**解决方案**:
- 确保 `JWT_SECRET` 在所有环境一致
- 检查 Cookie 配置是否正确
- 验证中间件是否正确配置

### 3. 文件上传失败

**问题**: 上传文件时出错

**解决方案**:
- 检查 `public/uploads` 目录权限
- 验证文件大小和类型限制
- 确保磁盘空间充足

### 4. OpenAI API 调用失败

**问题**: AI 对话功能不可用

**解决方案**:
- 验证 `OPENAI_API_KEY` 是否正确
- 检查 API 密钥是否过期
- 确保有足够的 API 配额

### 5. Docker 容器无法启动

**问题**: `docker-compose up` 失败

**解决方案**:
- 检查 Docker 是否正在运行
- 验证端口是否被占用
- 检查 Docker 日志: `docker-compose logs`

### 6. Prisma 迁移失败

**问题**: `npx prisma migrate dev` 报错

**解决方案**:
- 确保数据库连接正常
- 删除 `node_modules/.prisma` 目录
- 重新运行: `npx prisma generate`

---

## 📊 性能优化建议

### 1. 数据库优化

- 使用连接池
- 添加适当的索引
- 定期清理旧数据

### 2. 缓存策略

- 使用 Redis 缓存频繁查询
- 设置合理的过期时间
- 监控缓存命中率

### 3. 前端优化

- 启用 Gzip 压缩
- 使用 CDN 分发静态资源
- 实现图片懒加载

### 4. 监控和日志

- 使用 PM2 监控进程
- 配置日志收集
- 设置性能监控

---

## 🔒 安全最佳实践

1. **定期更新依赖**
   ```bash
   npm audit fix
   npm update
   ```

2. **使用强密码**
   - 数据库密码
   - JWT 密钥
   - OAuth 密钥

3. **启用 HTTPS**
   - 使用 Let's Encrypt 免费证书
   - 强制重定向到 HTTPS

4. **限制 API 访问**
   - 使用 rate limiting
   - 实现请求限流
   - 记录访问日志

5. **定期备份**
   - 数据库备份
   - 文件备份
   - 配置备份

---

## 📞 技术支持

遇到问题？

- 📖 查看 [README.md](./README.md)
- 🐛 提交 [GitHub Issue](https://github.com/Leo-fsf/ai-dev-platform/issues)
- 💬 加入 [Discord 社区](https://discord.gg/clawd)

---

**祝你部署顺利！** 🎉

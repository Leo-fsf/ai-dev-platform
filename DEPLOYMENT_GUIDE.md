# AI Dev Platform - 部署指南

## 📋 项目信息

- **项目名称**: AI Dev Platform
- **GitHub仓库**: https://github.com/Leo-fsf/ai-dev-platform
- **本地路径**: `/workspace/projects/workspace/ai-dev-platform`
- **Vercel模板**: ai-dev-platform

---

## 🚀 部署方案

### 方案1：GitHub + Vercel（推荐）

#### 第1步：推送到GitHub

**选项A：使用GitHub Desktop**
1. 下载 GitHub Desktop：https://desktop.github.com
2. 登录你的GitHub账号
3. 选择 "File" → "Clone repository"
4. 输入：`https://github.com/Leo-fsf/ai-dev-platform`
5. 克隆到本地
6. 将项目文件夹中的所有文件复制到克隆的仓库中
7. 提交并推送

**选项B：使用命令行**
```bash
# 进入项目目录
cd /workspace/projects/workspace/ai-dev-platform

# 初始化git仓库（如果没有）
git init
git config user.email "your-email@example.com"
git config user.name "Your Name"

# 添加所有文件
git add .
git commit -m "AI Dev Platform v1.0 完整版"

# 添加远程仓库
git remote add origin https://github.com/Leo-fsf/ai-dev-platform.git

# 推送（如果远程有内容，使用强制推送）
git push -f origin main
```

#### 第2步：部署到Vercel

1. **访问Vercel**
   - 打开浏览器访问：https://vercel.com
   - 登录或注册账号（推荐使用GitHub账号登录）

2. **创建新项目**
   - 点击 "Add New..." → "Project"
   - 或者点击页面上的 "Import Project"

3. **导入项目**
   - 输入仓库地址：`https://github.com/Leo-fsf/ai-dev-platform`
   - 或者点击 "Import" 按钮

4. **配置项目**
   - **Project Name**: ai-dev-platform（可自定义）
   - **Framework Preset**: Next.js（自动检测）
   - **Root Directory**: `/`
   - **Build Command**: `npm run build`（自动检测）
   - **Output Directory**: `out`（自动检测）

5. **部署**
   - 点击 "Deploy" 按钮
   - 等待2-3分钟
   - 部署成功后会显示访问地址

**预计时间：2-3分钟**

---

### 方案2：GitHub Pages（免费）

#### 第1步：推送到GitHub

参考方案1的第1步。

#### 第2步：启用GitHub Pages

1. 访问你的GitHub仓库：https://github.com/Leo-fsf/ai-dev-platform
2. 点击 "Settings" 标签
3. 滚动到 "Pages" 部分
4. 在 "Source" 下：
   - 选择 `Deploy from a branch`
   - Branch 选择 `main`
   - Folder 选择 `/ (root)`
5. 点击 "Save"

**等待1-2分钟后，访问：**
```
https://Leo-fsf.github.io/ai-dev-platform
```

---

### 方案3：Netlify（免费）

#### 第1步：推送到GitHub

参考方案1的第1步。

#### 第2步：部署到Netlify

1. 访问 https://netlify.com
2. 登录或注册账号
3. 点击 "Add new site" → "Import from project"
4. 连接你的GitHub账号
5. 选择 `ai-dev-platform` 仓库
6. 构建配置：
   - Build command: `npm run build`
   - Publish directory: `out`
7. 点击 "Deploy site"

**预计时间：1-2分钟**

---

## ✅ 部署验证

部署完成后，验证以下功能：

### 页面访问
- [ ] 首页：`https://your-domain.vercel.app/`
- [ ] Agent：`https://your-domain.vercel.app/agent`
- [ ] 项目：`https://your-domain.vercel.app/projects`
- [ ] 用户中心：`https://your-domain.vercel.app/profile`
- [ ] 文档：`https://your-domain.vercel.app/docs`
- [ ] 项目详情：`https://your-domain.vercel.app/project-detail`
- [ ] 登录：`https://your-domain.vercel.app/login`

### 功能测试
- [ ] 首页代码生成
- [ ] Agent对话功能
- [ ] 项目搜索和筛选
- [ ] 语言切换（中英文）
- [ ] 暗黑模式切换
- [ ] 全局搜索（Command+K）
- [ ] Toast通知

---

## 📊 项目统计

- **页面数量**: 8个
- **组件数量**: 5个
- **构建大小**: ~3-6KB/页面
- **首屏加载**: ~90-101KB
- **支持语言**: 中文、英文
- **支持主题**: 浅色、暗黑

---

## 🐛 常见问题

### Q: 部署后页面404？
**A**: 确认：
1. Next.js配置中 `output: 'export'`
2. 构建配置的Output Directory是 `out`
3. Vercel构建日志没有错误

### Q: 样式不显示？
**A**: 检查：
1. Tailwind CSS配置正确
2. `globals.css` 正确导入
3. 浏览器控制台无错误

### Q: 中文乱码？
**A**: 确认：
1. layout.tsx中有 `<meta charSet="utf-8" />`
2. 文件保存为UTF-8编码

### Q: GitHub推送失败？
**A**: 解决方案：
1. 检查Token是否正确
2. 尝试使用GitHub Desktop
3. 删除远程仓库重新推送

---

## 🔄 持续部署

### 自动部署

使用Vercel/Netlify后，每次推送到GitHub会自动触发重新部署：

```bash
git add .
git commit -m "更新内容"
git push origin main
```

自动部署流程：
1. 检测到代码推送
2. 自动拉取代码
3. 运行 `npm install`
4. 运行 `npm run build`
5. 部署到CDN
6. 更新访问地址

---

## 📞 需要帮助？

如果遇到部署问题：
1. 检查浏览器控制台错误
2. 查看Vercel构建日志
3. 确认GitHub仓库配置正确
4. 联系技术支持

---

## 🎉 部署成功！

部署成功后，你的AI全栈开发平台就上线了！

🎊 恭喜你完成了完整的AI全栈开发平台项目！
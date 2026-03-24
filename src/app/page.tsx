'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Code2, 
  Sparkles, 
  Globe, 
  Smartphone, 
  Palette, 
  Database, 
  Server, 
  GitBranch,
  Play,
  Copy,
  Download,
  Send,
  Zap,
  Terminal,
  Box,
  Layers,
  Cpu,
  Brain,
  Rocket,
  Settings,
  ChevronRight,
  X,
  Check,
  RefreshCw,
  ExternalLink,
  Search,
  FileCode,
  Folder,
  GitPullRequest,
  Coffee,
  MessageSquare,
  HelpCircle,
  BookOpen,
  Code,
  Layout,
  Monitor,
  Cloud,
  Shield,
  Search as SearchIcon
} from 'lucide-react'

// 工具分类数据
const toolCategories = [
  {
    id: 'frontend',
    name: '前端开发',
    icon: Layout,
    color: 'from-blue-500 to-cyan-500',
    tools: [
      { id: 'react', name: 'React组件生成', description: '用自然语言生成React组件' },
      { id: 'vue', name: 'Vue组件生成', description: '用自然语言生成Vue组件' },
      { id: 'html', name: 'HTML页面生成', description: '快速生成HTML页面' },
      { id: 'css', name: 'CSS样式生成', description: '生成现代CSS样式' },
      { id: 'tailwind', name: 'Tailwind组件', description: '生成Tailwind CSS组件' },
      { id: 'animation', name: '动画效果', description: '创建动画效果' },
    ]
  },
  {
    id: 'backend',
    name: '后端开发',
    icon: Server,
    color: 'from-green-500 to-emerald-500',
    tools: [
      { id: 'api', name: 'API接口生成', description: '生成RESTful API' },
      { id: 'database', name: '数据库设计', description: '设计数据库模型' },
      { id: 'auth', name: '认证系统', description: '生成用户认证' },
      { id: 'crud', name: 'CRUD操作', description: '生成增删改查' },
      { id: 'middleware', name: '中间件', description: '创建中间件' },
      { id: 'schema', name: '数据验证', description: 'Schema验证' },
    ]
  },
  {
    id: 'mobile',
    name: '移动开发',
    icon: Smartphone,
    color: 'from-purple-500 to-pink-500',
    tools: [
      { id: 'react-native', name: 'React Native', description: '生成React Native应用' },
      { id: 'flutter', name: 'Flutter组件', description: '生成Flutter组件' },
      { id: 'ios', name: 'iOS组件', description: '生成iOS组件' },
      { id: 'android', name: 'Android组件', description: '生成Android组件' },
    ]
  },
  {
    id: 'devops',
    name: 'DevOps部署',
    icon: Rocket,
    color: 'from-orange-500 to-red-500',
    tools: [
      { id: 'docker', name: 'Docker配置', description: '生成Dockerfile' },
      { id: 'github', name: 'GitHub部署', description: '一键部署到GitHub' },
      { id: 'vercel', name: 'Vercel部署', description: '部署到Vercel' },
      { id: 'netlify', name: 'Netlify部署', description: '部署到Netlify' },
      { id: 'ci', name: 'CI/CD配置', description: '生成CI/CD流程' },
      { id: 'yaml', name: 'YAML配置', description: '生成配置文件' },
    ]
  },
  {
    id: 'ai',
    name: 'AI工具',
    icon: Brain,
    color: 'from-violet-500 to-purple-500',
    tools: [
      { id: 'prompt', name: '提示词工程', description: '优化AI提示词' },
      { id: 'agent', name: 'AI Agent', description: '创建AI代理' },
      { id: 'workflow', name: '工作流', description: '设计AI工作流' },
      { id: 'embedding', name: '向量嵌入', description: '生成向量嵌入' },
    ]
  },
  {
    id: 'tools',
    name: '开发工具',
    icon: Tool,
    color: 'from-teal-500 to-blue-500',
    tools: [
      { id: 'refactor', name: '代码重构', description: '重构优化代码' },
      { id: 'debug', name: '调试助手', description: '辅助代码调试' },
      { id: 'test', name: '测试生成', description: '生成单元测试' },
      { id: 'doc', name: '文档生成', description: '生成代码文档' },
      { id: 'optimize', name: '性能优化', description: '优化代码性能' },
      { id: 'security', name: '安全检查', description: '代码安全审计' },
    ]
  }
]

// 代码生成模板
const generateHTMLContent = (prompt: string) => {
  const lowerPrompt = prompt.toLowerCase()
  
  if (lowerPrompt.includes('网站') || lowerPrompt.includes('landing') || lowerPrompt.includes('页面')) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI生成的网站</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    
    header {
      background: rgba(255, 255, 255, 0.95);
      padding: 1rem 2rem;
      position: fixed;
      width: 100%;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2563eb;
    }
    
    .nav-links {
      display: flex;
      list-style: none;
      gap: 2rem;
    }
    
    .nav-links a {
      text-decoration: none;
      color: #333;
      transition: color 0.3s;
    }
    
    .nav-links a:hover {
      color: #2563eb;
    }
    
    #hero {
      padding: 8rem 2rem 4rem;
      text-align: center;
      color: white;
    }
    
    #hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    #hero button {
      background: white;
      color: #667eea;
      border: none;
      padding: 1rem 2rem;
      font-size: 1rem;
      border-radius: 8px;
      cursor: pointer;
      margin-top: 2rem;
      transition: transform 0.3s;
    }
    
    #hero button:hover {
      transform: translateY(-2px);
    }
    
    #features {
      padding: 4rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    #features h2 {
      text-align: center;
      margin-bottom: 3rem;
      font-size: 2rem;
    }
    
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }
    
    .feature-card {
      padding: 2rem;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      text-align: center;
    }
    
    .feature-card h3 {
      margin-bottom: 1rem;
    }
    
    footer {
      background: #1f2937;
      color: white;
      text-align: center;
      padding: 2rem;
      margin-top: 4rem;
    }
  </style>
</head>
<body>
  <header>
    <nav>
      <div class="logo">AI Website</div>
      <ul class="nav-links">
        <li><a href="#hero">首页</a></li>
        <li><a href="#features">功能</a></li>
        <li><a href="#about">关于</a></li>
        <li><a href="#contact">联系</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <section id="hero">
      <h1>欢迎来到AI生成的网站</h1>
      <p>这是一个使用自然语言描述生成的现代化网站</p>
      <button>了解更多</button>
    </section>
    
    <section id="features">
      <h2>核心功能</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <h3>功能一</h3>
          <p>这里是功能的详细描述，可以介绍产品的特点和优势</p>
        </div>
        <div class="feature-card">
          <h3>功能二</h3>
          <p>这里是第二个功能模块的描述内容</p>
        </div>
        <div class="feature-card">
          <h3>功能三</h3>
          <p>这是第三个功能，突出产品的主要价值</p>
        </div>
      </div>
    </section>
  </main>
  
  <footer>
    <p>© 2024 AI Generated Website. All rights reserved.</p>
  </footer>
  
  <script>
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
    
    // 导航栏滚动效果
    window.addEventListener('scroll', () => {
      const header = document.querySelector('header');
      if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 6px rgba(0,0,0,0.15)';
      } else {
        header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }
    });
  </script>
</body>
</html>`
  }

  if (lowerPrompt.includes('按钮')) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI生成的按钮</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      margin: 0;
      padding: 20px;
    }
    
    .btn-primary {
      padding: 16px 32px;
      background: white;
      color: #f093fb;
      border: none;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.3);
    }
    
    .btn-secondary {
      padding: 16px 32px;
      background: rgba(255,255,255,0.2);
      color: white;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 12px;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }
    
    .btn-secondary:hover {
      background: rgba(255,255,255,0.3);
      border-color: rgba(255,255,255,0.5);
    }
  </style>
</head>
<body>
  <button class="btn-primary">
    主要按钮
  </button>
  <br><br>
  <button class="btn-secondary">
    次要按钮
  </button>
</body>
</html>`
  }

  if (lowerPrompt.includes('卡片')) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI生成的卡片</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    
    .card {
      width: 320px;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      transition: transform 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 24px 48px rgba(0,0,0,0.3);
    }
    
    .card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    
    .card-content {
      padding: 1.5rem;
    }
    
    .card-content h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .card-content p {
      color: #64748b;
      line-height: 1.5;
      margin-bottom: 1rem;
    }
    
    .card button {
      width: 100%;
      background: #667eea;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      margin-top: 0.5rem;
    }
  </style>
</head>
<body>
  <div class="card">
    <img src="https://picsum.photos/400/200" alt="示例图片" />
    <div class="card-content">
      <h3>卡片标题</h3>
      <p>这是卡片的描述内容，展示了产品或服务的核心信息。</p>
      <button>了解更多</button>
    </div>
  </div>
</body>
</html>`
  }

  if (lowerPrompt.includes('表单')) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI生成的表单</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    
    .form-container {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    
    .form-container h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
      color: #1f2937;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #4B5563;
    }
    
    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s;
    }
    
    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .form-group textarea {
      resize: vertical;
      min-height: 100px;
    }
    
    .submit-btn {
      width: 100%;
      background: #667eea;
      color: white;
      border: none;
      padding: 12px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 0.5rem;
    }
    
    .submit-btn:hover {
      background: #5568d3;
    }
  </style>
</head>
<body>
  <div class="form-container">
    <h2>联系表单</h2>
    <form onsubmit="return false;">
      <div class="form-group">
        <label>姓名</label>
        <input type="text" placeholder="请输入您的姓名" required />
      </div>
      <div class="form-group">
        <label>邮箱</label>
        <input type="email" placeholder="your@email.com" required />
      </div>
      <div class="form-group">
        <label>留言内容</label>
        <textarea placeholder="请输入您的留言内容"></textarea>
      </div>
      <button type="submit" class="submit-btn">提交</button>
    </form>
  </div>
</body>
</html>`
  }

  if (lowerPrompt.includes('导航栏') || lowerPrompt.includes('navbar')) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI生成的导航栏</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0f172a;
      color: #f1f5f9;
      padding: 2rem;
    }
    
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: white;
      border-radius: 12px;
      max-width: 1200px;
      margin: 0 auto;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .nav-brand {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2563eb;
    }
    
    .nav-menu {
      display: flex;
      list-style: none;
      gap: 2rem;
    }
    
    .nav-menu a {
      text-decoration: none;
      color: #374151;
      transition: color 0.3s;
    }
    
    .nav-menu a:hover {
      color: #2563eb;
    }
    
    .nav-toggle {
      display: none;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #374151;
    }
    
    .btn-primary {
      background: #2563eb;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-primary:hover {
      background: #1d4ed8;
    }
    
    @media (max-width: 768px) {
      .nav-menu { display: none; }
      .nav-toggle { display: block; }
      .btn-primary { display: none; }
    }
  </style>
</head>
<body>
  <nav class="navbar">
    <div class="nav-brand">MyApp</div>
    <ul class="nav-menu">
      <li><a href="#">首页</a></li>
      <li><a href="#">产品</a></li>
      <li><a href="#">服务</a></li>
      <li><a href="#">关于</a></li>
    </ul>
    <button class="btn-primary">立即开始</button>
    <button class="nav-toggle">☰</button>
  </nav>
  
  <div style="text-align: center; padding: 4rem 2rem;">
    <h1>这是响应式导航栏示例</h1>
    <p>导航栏会在移动端自动收起，点击按钮展开</p>
  </div>
</body>
</html>`
  }

  // 默认：响应式导航栏
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI生成的导航栏</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0f172a;
      color: #f1f5f9;
      padding: 2rem;
    }
    
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: white;
      border-radius: 12px;
      max-width: 1200px;
      margin: 0 auto;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .nav-brand {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2563eb;
    }
    
    .nav-menu {
      display: flex;
      list-style: none;
      gap: 2rem;
    }
    
    .nav-menu a {
      text-decoration: none;
      color: #374151;
      transition: color 0.3s;
    }
    
    .nav-menu a:hover {
      color: #2563eb;
    }
    
    .nav-toggle {
      display: none;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #374151;
    }
    
    .btn-primary {
      background: #2563eb;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-primary:hover {
      background: #1d4ed8;
    }
    
    @media (max-width: 768px) {
      .nav-menu { display: none; }
      .nav-toggle { display: block; }
      .btn-primary { display: none; }
    }
  </style>
</head>
<body>
  <nav class="navbar">
    <div class="nav-brand">MyApp</div>
    <ul class="nav-menu">
      <li><a href="#">首页</a></li>
      <li><a href="#">产品</a></li>
      <li><a href="#">服务</a></li>
      <li><a href="#">关于</a></li>
    </ul>
    <button class="btn-primary">立即开始</button>
    <button class="nav-toggle">☰</button>
  </nav>
  
  <div style="text-align: center; padding: 4rem 2rem;">
    <h1>这是响应式导航栏示例</h1>
    <p>导航栏会在移动端自动收起，点击按钮展开</p>
  </div>
</body>
</html>`
  }
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('home')
  const [prompt, setPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('frontend')
  const [selectedTool, setSelectedTool] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [copied, setCopied = = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [previewWindow, setPreviewWindow] = useState<Window | null>(null)
  const previewRef = useRef<HTMLIFrameElement>(null)

  // 生成代码
  const generateCode = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    
    // 模拟AI生成延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 根据输入生成对应代码
    const code = generateHTMLContent(prompt)
    setGeneratedCode(code)
    setIsGenerating(false)
    setShowPreview(true)
  }

  // 复制代码
  const copyCode = async () => {
    await navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 下载代码
  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'generated-code.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  // 打开预览窗口
  const openPreviewWindow = () => {
    if (!generatedCode) return
    
    // 创建一个新窗口
    const newWindow = window.open('', 'preview', 'width=1024,height=768')
    if (!newWindow) {
      alert('无法打开新窗口，请检查浏览器弹窗设置')
      return
    }
    
    // 写入完整的HTML文档
    const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI预览</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, sans-serif; background: #f8fafc; }
    .preview-content { padding: 20px; max-width: 100%; overflow-x: auto; }
    pre { background: #f1f5f9; padding: 15px; border-radius: 8px; overflow-x: auto; font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="preview-content">
    <h2>页面预览</h2>
    <pre>${generatedCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
    <p style="margin-top: 20px; color: #64748b;">此为预览区域，样式可能不完全一致，请点击"下载"按钮下载完整HTML文件查看完整效果</p>
  </div>
</body>
</html>`
    newWindow.document.write(htmlContent)
    newWindow.document.close()
    
    setPreviewWindow(newWindow)
  }

  // 部署到GitHub
  const deployToGitHub = () => {
    alert('部署功能需要连接GitHub API，将在后续版本中实现！')
  }

  return (
    <div className="min-h-screen">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center animate-pulse-glow">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Dev Platform
              </span>
            </div>

            {/* 桌面导航 */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { id: 'home', name: '首页', icon: Sparkles },
                { id: 'tools', name: 'AI工具', icon: Code },
                { id: 'generate', name: '代码生成', icon: FileCode },
                { id: 'deploy', name: '部署', icon: Rocket },
                { id: 'docs', name: '文档', icon: BookOpen },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === item.id 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </button>
              ))}
            </div>

            {/* 右侧按钮 */}
            <div className="hidden md:flex items-center gap-3">
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <SearchIcon className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                GitHub
              </button>
            </div>

            {/* 移动端菜单按钮 */}
            <button 
              className="md:hidden p-2 text-slate-400"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {showMobileMenu && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4">
            <div className="flex flex-col gap-2">
              {[
                { id: 'home', name: '首页', icon: Sparkles },
                { id: 'tools', name: 'AI工具', icon: Code },
                { id: 'generate', name: '代码生成', icon: FileCode },
                { id: 'deploy', name: '部署', icon: Rocket },
                { id: 'docs', name: '文档', icon: BookOpen },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setShowMobileMenu(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === item.id 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* 主内容 */}
      <main className="pt-16">
        {/* 首页 */}
        {activeTab === 'home' && (
          <div>
            {/* Hero区域 */}
            <section className="relative py-20 px-4 overflow-hidden">
              {/* 背景效果 */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20" />
              <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
              
              <div className="relative max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 mb-8">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm">AI全栈开发工作流平台</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  用自然语言<br/>构建一切
                </h1>
                
                <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                  允许任何人通过简单地用自然语言编写程序和软件。
                  构建应用、游戏、网站，部署到GitHub，打造全栈AI工作流。
                </p>

                {/* AI对话输入框 */}
                <div className="max-w-2xl mx-auto">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-2">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="描述你想要的功能，例如：'生成一个现代的登录页面' 或 '创建一个响应式导航栏'"
                      className="w-full bg-transparent border-none text-white placeholder-slate-500 px-4 py-3 resize-none focus:outline-none"
                      rows={3}
                    />
                    <div className="flex items-center justify-between px-2 pb-2">
                      <div className="flex items-center gap-2">
                        {['网站', '按钮', '卡片', '表单', '导航栏'].map(tag => (
                          <button
                            key={tag}
                            onClick={() => setPrompt(prompt + tag)}
                            className="px-3 py-1 bg-slate-700/50 rounded-full text-sm text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={generateCode}
                        disabled={isGenerating || !prompt.trim()}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            生成中...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            生成代码
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 功能特点 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
                  {[
                    { icon: Globe, name: 'Web开发', desc: '前端+后端' },
                    { icon: Smartphone, name: '移动应用', desc: 'iOS+Android' },
                    { icon: Gamepad2, name: '游戏开发', desc: '2D+3D游戏' },
                    { icon: Cloud, name: '云部署', desc: '一键上线' },
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:border-slate-600 transition-colors">
                      <item.icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-slate-500">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 代码预览 */}
            {showPreview && generatedCode && (
              <section className="py-12 px-4">
                <div className="max-w-6xl mx-auto">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    {/* 标签页 */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setGeneratedCode('')}
                          className={`px-4 py-2 rounded-lg transition-colors ${!generatedCode ? 'text-slate-400' : 'text-slate-400 hover:text-white'}`}
                        >
                          <FileCode className="w-4 h-4 inline mr-2" />
                          代码
                        </button>
                        <button
                          onClick={openPreviewWindow}
                          className={`px-4 py-2 rounded-lg transition-colors ${generatedCode ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                          <ExternalLink className="w-4 h-4 inline mr-2" />
                          新窗口预览
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={copyCode}
                          className="p-2 text-slate-400 hover:text-white transition-colors"
                          title="复制代码"
                        >
                          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={downloadCode}
                          className="p-2 text-slate-400 hover:text-white transition-colors"
                          title="下载HTML文件"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* 代码显示区域 */}
                    <div className="max-h-[500px] overflow-auto">
                      <pre className="p-4 text-sm text-slate-300 font-mono">
                        {generatedCode}
                      </pre>
                    </div>

                    {/* 提示信息 */}
                    <div className="p-4 border-t border-slate-800">
                      <p className="text-xs text-slate-400 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        <span>提示：点击"新窗口预览"可以在新窗口中查看完整效果</span>
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 工具分类展示 */}
            <section className="py-16 px-4">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-4">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    全栈AI开发工具
                  </span>
                </h2>
                <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
                  包含自由职业和独立开发者经常会用到的各种人工智能编码工具
                </p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {toolCategories.map(category => (
                    <div key={category.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-colors group">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4`}>
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{category.name}</h3>
                      <div className="space-y-2">
                        {category.tools.slice(0, 4).map(tool => (
                          <button
                            key={tool.id}
                            onClick={() => { setSelectedCategory(category.id); setSelectedTool(tool.id); setPrompt(`使用${tool.name}创建一个示例`); setActiveTab('home'); }}
                            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors flex items-center justify-between group-hover:text-blue-400"
                          >
                            <span>{tool.name}</span>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* AI工具页面 */}
        {activeTab === 'tools' && (
          <div className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    AI开发工具中心
                  </span>
                </h2>
                <p className="text-slate-400">选择工具类别，开始你的AI开发之旅</p>
              </div>

              {/* 工具分类选择 */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {toolCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <category.icon className="w-4 h-4" />
                    {category.name}
                  </button>
                ))}
              </div>

              {/* 工具列表 */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {toolCategories
                  .find(c => c.id === selectedCategory)
                  ?.tools.map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => { setSelectedTool(tool.id); setPrompt(`使用${tool.name}创建一个示例`); setActiveTab('home'); }}
                      className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl text-left hover:border-blue-500/50 hover:bg-slate-800 transition-all group"
                    >
                      <h3 className="font-semibold mb-2 group-hover:text-blue-400 transition-colors">{tool.name}</h3>
                      <p className="text-sm text-slate-500">{tool.description}</p>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* 代码生成页面 */}
        {activeTab === 'generate' && (
          <div className="py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AI代码生成器
                </span>
              </h2>
              
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="用自然语言描述你想要的功能..."
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                  rows={5}
                />
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <select className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-400">
                      <option>React</option>
                      <option>Vue</option>
                      <option>HTML/CSS</option>
                      <option>Next.js</option>
                    </select>
                    <select className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-400">
                      <option>TypeScript</option>
                      <option>JavaScript</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={generateCode}
                    disabled={isGenerating || !prompt.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
                  >
                    {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    生成代码
                  </button>
                </div>
              </div>

              {/* 生成结果 */}
              {generatedCode && (
                <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                    <span className="text-sm text-slate-400">生成的代码</span>
                    <div className="flex items-center gap-2">
                      <button onClick={copyCode} className="p-2 text-slate-400 hover:text-white">
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button onClick={downloadCode} className="p-2 text-slate-400 hover:text-white">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <pre className="p-4 text-sm text-slate-300 font-mono max-h-[400px] overflow-auto">
                    {generatedCode}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 部署页面 */}
        {activeTab === 'deploy' && (
          <div className="py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text3xl font-bold text-center mb-8">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  一键部署
                </span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: GitBranch, name: 'GitHub Pages', desc: '部署静态网站', color: 'from-gray-500 to-gray-700' },
                  { icon: Rocket, name: 'Vercel', desc: 'Next.js最佳选择', color: 'from-black to-gray-800' },
                  { icon: Cloud, name: 'Netlify', desc: '现代化部署平台', color: 'from-cyan-500 to-blue-500' },
                  { icon: Box, name: 'Docker', desc: '容器化部署', color: 'from-blue-400 to-blue-600' },
                ].map(platform => (
                  <button
                    key={platform.name}
                    onClick={deployToGitHub}
                    className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-left hover:border-green-500/50 transition-all group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center mb-4`}>
                      <platform.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{platform.name}</h3>
                    <p className="text-slate-500">{platform.desc}</p>
                    <div className="mt-4 flex items-center gap-2 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>点击部署</span>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 文档页面 */}
        {activeTab === 'docs' && (
          <div className="py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  使用文档
                </span>
              </h2>
              
              <div className="space-y-4">
                {[
                  { icon: BookOpen, title: '快速开始', desc: '5分钟入门AI开发' },
                  { icon: Code, title: '代码生成指南', desc: '如何使用自然语言生成代码' },
                  { icon: Rocket, title: '部署教程', desc: '一键部署到各大平台' },
                  { icon: Settings, title: 'API参考', desc: '开发者接口文档' },
                ].map((doc, i) => (
                  <button
                    key={i}
                    className="w-full p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl text-left hover:border-blue-500/50 transition-all flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center">
                      <doc.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{doc.title}</h3>
                      <p className="text-sm text-slate-500">{doc.desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="py-8 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">AI Dev Platform</span>
          </div>
          <p className="text-slate-500 text-sm">
            用自然语言构建应用和网站 - 全栈AI开发工作流
          </p>
          <p className="text-slate-600 text-xs mt-2">
            © 2024 AI Dev Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

// Menu图标组件
function Menu({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

// Gamepad2图标组件
function Gamepad2({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M15 5v2m0 4v2m0 4v2m0 4v2" />
    </svg>
  )
}

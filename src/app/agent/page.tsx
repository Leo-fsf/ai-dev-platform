'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/i18n/context'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AgentPage() {
  const { t, language } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: t.assistantGreeting,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const conversationTemplates = [
    {
      category: t.codeWriting,
      templates: [
        { id: 'react-component', title: t.generateReactComponent, prompt: '帮我生成一个React按钮组件，包含点击事件' },
        { id: 'api-endpoint', title: t.generateAPIEndpoint, prompt: '创建一个RESTful API接口，用于用户认证' },
        { id: 'database-schema', title: t.databaseSchema, prompt: '设计一个电商系统的数据库表结构' }
      ]
    },
    {
      category: t.codeDebugging,
      templates: [
        { id: 'debug-error', title: t.fixError, prompt: '帮我分析这个错误并提供解决方案' },
        { id: 'optimize-performance', title: t.optimizePerformance, prompt: '优化这段代码的性能' },
        { id: 'code-refactor', title: t.codeRefactor, prompt: '重构这段代码，使其更易维护' }
      ]
    },
    {
      category: t.architectureDesign,
      templates: [
        { id: 'system-design', title: t.systemDesign, prompt: '设计一个微服务架构的高可用系统' },
        { id: 'api-design', title: t.apiDesign, prompt: '设计一个符合RESTful规范的API' },
        { id: 'tech-stack', title: t.techStack, prompt: '为这个项目推荐合适的技术栈' }
      ]
    },
    {
      category: t.learningAssistance,
      templates: [
        { id: 'explain-concept', title: t.explainConcept, prompt: '详细解释这个技术概念' },
        { id: 'best-practices', title: t.bestPractices, prompt: '介绍这个技术的最佳实践' },
        { id: 'code-example', title: t.codeExample, prompt: '提供这个功能的完整代码示例' }
      ]
    }
  ]

  const handleTemplateClick = (template: { title: string; prompt: string }) => {
    handleSend(template.prompt)
  }

  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    setTimeout(() => {
      const responses: Record<string, string> = {
        '生成React组件': `以下是React按钮组件的代码：

\`\`\`tsx
import { useState } from 'react'

interface ButtonProps {
  label: string
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

export default function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  const [isClicked, setIsClicked] = useState(false)
  
  const handleClick = () => {
    setIsClicked(true)
    onClick?.()
    setTimeout(() => setIsClicked(false), 200)
  }

  return (
    <button
      onClick={handleClick}
      className={\`px-4 py-2 rounded-lg transition-all \${
        variant === 'primary'
          ? 'bg-blue-500 text-white hover:bg-blue-600'
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      } \${isClicked ? 'scale-95' : 'scale-100'}\`}
    >
      {label}
    </button>
  )
}
\`\`\`

这个组件支持：
- 自定义标签文字
- 点击事件处理
- 两种样式变体（primary/secondary）
- 点击动画效果`,
        '创建一个RESTful API接口，用于用户认证': `以下是用户认证API接口设计：

\`\`\`typescript
// Express.js 示例
import express from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body
  
  // 验证输入
  if (!username || !email || !password) {
    return res.status(400).json({ error: '缺少必填字段' })
  }
  
  // 检查用户是否已存在
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(409).json({ error: '邮箱已被注册' })
  }
  
  // 创建新用户
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({
    username,
    email,
    password: hashedPassword
  })
  
  // 生成JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )
  
  res.status(201).json({
    message: '注册成功',
    token,
    user: { id: user.id, username, email }
  })
})
\`\`\`

包含功能：
- 输入验证
- 密码加密
- JWT令牌生成
- 错误处理`,
        '设计一个电商系统的数据库表结构': `电商系统核心数据库设计：

\`\`\`sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 商品表
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  category_id UUID REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 订单表
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 订单详情表
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL
);
\`\`\`

设计要点：
- 使用UUID作为主键
- 添加外键约束
- 包含时间戳字段
- 适当的索引优化`,
        default: t.assistantGreeting
      }

      let responseText = responses.default
      for (const [key, value] of Object.entries(responses)) {
        if (content.includes(key)) {
          responseText = value
          break
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">{t.agentTitle}</h1>
          <p className="text-gray-600 text-sm mt-1">{t.agentDescription}</p>
        </div>
      </div>

      {/* Quick Templates */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">{t.quickQuestions}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conversationTemplates.map(category => (
              <div key={category.category} className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600">{category.category}</h3>
                {category.templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateClick(template)}
                    className="w-full text-left px-3 py-2 bg-white rounded-lg border border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all text-sm"
                  >
                    {template.title}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-4xl mx-auto px-4 pb-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  <div className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder={t.inputPlaceholder}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isLoading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t.send}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
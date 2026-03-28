// OpenAI API 集成

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''

export async function chatWithAI(
  messages: { role: string; content: string }[],
  model: string = 'gpt-4o'
): Promise<string> {
  if (!OPENAI_API_KEY || !OPENAI_API_KEY.startsWith('sk-')) {
    throw new Error('OpenAI API Key未配置')
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9,
        frequency_penalty: 0.6,
        presence_penalty: 0.4
      })
    })

    const data = await response.json()

    if (!response.ok) {
      const error = data.error || 'Unknown error'
      throw new Error(`OpenAI API error: ${error}`)
    }

    return data.choices?.[0]?.message?.content || '抱歉，我无法回答这个问题。'
  } catch (error) {
    console.error('OpenAI API调用失败:', error)
    return '抱歉，服务暂时不可用，请稍后重试。'
  }
}

export function hasOpenAIKey(): boolean {
  return !!(OPENAI_API_KEY && OPENAI_API_KEY.startsWith('sk-'))
}

// 预设的快速回复模板（当OpenAI不可用时使用）
const FALLBACK_RESPONSES: Record<string, string> = {
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
\`\`\``,

  '生成API接口': `以下是用户认证API接口设计：

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
\`\`\``,

  '设计数据库': `电商系统核心数据库设计：

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
\`\`\``
}

export function getFallbackResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase()
  
  for (const [key, value] of Object.entries(FALLBACK_RESPONSES)) {
    if (lowerPrompt.includes(key)) {
      return value
    }
  }
  
  return '抱歉，我无法理解这个问题。建议你：\n\n1. 更详细地描述你的需求\n2. 提供具体的上下文信息\n3. 提到具体的技术栈或框架'
}
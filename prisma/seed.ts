import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始播种数据...')

  // 创建测试用户
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: hashedPassword,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        bio: '系统管理员',
        isVerified: true
      }
    }),
    prisma.user.upsert({
      where: { email: 'developer@example.com' },
      update: {},
      create: {
        email: 'developer@example.com',
        name: 'Developer User',
        password: hashedPassword,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Developer',
        bio: '全栈开发者'
      }
    }),
    prisma.user.upsert({
      where: { email: 'designer@example.com' },
      update: {},
      create: {
        email: 'designer@example.com',
        name: 'Designer User',
        password: hashedPassword,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Designer',
        bio: 'UI/UX设计师'
      }
    })
  ])

  const adminUser = users[0]

  // 创建示例项目
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        userId: adminUser.id,
        name: 'React电商后台管理系统',
        description: '基于Next.js和TypeScript的现代化电商后台，包含商品管理、订单处理、数据分析等功能',
        code: `import React from 'react'

export default function Dashboard() {
  return <div>电商后台</div>
}`,
        tags: JSON.stringify(['React', 'TypeScript', 'Next.js', '电商']),
        stars: 156,
        forks: 43,
        likes: 89
      }
    }),
    prisma.project.create({
      data: {
        userId: adminUser.id,
        name: 'Vue3移动端UI组件库',
        description: '轻量级Vue3移动端组件库，包含40+常用组件，支持主题定制',
        code: `import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Button'
})`,
        tags: JSON.stringify(['Vue3', 'TypeScript', 'UI组件', '移动端']),
        stars: 234,
        forks: 78,
        likes: 156
      }
    }),
    prisma.project.create({
      data: {
        userId: adminUser.id,
        name: 'Node.js微服务架构示例',
        description: '完整的微服务架构示例，包含服务发现、API网关、消息队列等核心组件',
        code: `const express = require('express')
const app = express()

app.listen(3000)`,
        tags: JSON.stringify(['Node.js', '微服务', 'Docker', '架构']),
        stars: 189,
        forks: 56,
        likes: 123
      }
    }),
    prisma.project.create({
      data: {
        userId: adminUser.id,
        name: 'Python数据可视化平台',
        description: '基于Flask和D3.js的数据可视化平台，支持多种图表类型',
        code: `from flask import Flask
app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello'`,
        tags: JSON.stringify(['Python', 'Flask', 'D3.js', '数据可视化']),
        stars: 312,
        forks: 92,
        likes: 234
      }
    }),
    prisma.project.create({
      data: {
        userId: users[1].id,
        name: 'TypeScript工具函数库',
        description: '常用的JavaScript/TypeScript工具函数集合',
        code: `export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T {
  // implementation
}`,
        tags: JSON.stringify(['TypeScript', '工具库', '函数式编程']),
        stars: 98,
        forks: 34,
        likes: 67
      }
    }),
    prisma.project.create({
      data: {
        userId: users[2].id,
        name: 'Flutter跨平台应用模板',
        description: 'Flutter跨平台应用开发模板，包含登录、首页、个人中心等常用页面',
        code: `import 'package:flutter/material.dart'

void main() {
  runApp(MyApp())
}`,
        tags: JSON.stringify(['Flutter', 'Dart', '跨平台', '移动应用']),
        stars: 145,
        forks: 47,
        likes: 89
      }
    })
  ])

  // 创建示例对话
  await prisma.conversation.create({
    data: {
      userId: adminUser.id,
      title: 'React组件开发',
      messages: JSON.stringify([
        { role: 'user', content: '帮我生成一个React按钮组件' },
        { role: 'assistant', content: '以下是React按钮组件代码...' }
      ])
    }
  })

  // 创建通知
  await prisma.notification.createMany({
    data: [
      {
        userId: adminUser.id,
        type: 'info',
        title: '欢迎加入',
        message: '欢迎使用AI开发平台！'
      },
      {
        userId: users[1].id,
        type: 'success',
        title: '项目创建成功',
        message: '你的项目"TypeScript工具函数库"已成功创建！'
      }
    ]
  })

  console.log('✅ 数据播种完成！')
  console.log(`👥 创建了 ${users.length} 个用户`)
  console.log(`📦 创建了 ${projects.length} 个项目`)
  console.log(`💬 创建了 1 个对话`)
  console.log(`🔔 创建了 2 个通知`)
  console.log('\n🎉 可以开始使用系统了！')
  console.log('\n📝 测试账号：')
  console.log('  邮箱: admin@example.com')
  console.log('  密码: password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

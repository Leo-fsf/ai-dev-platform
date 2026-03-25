'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/i18n/context'

export default function DocsPage() {
  const { t } = useLanguage()
  const [activeSection, setActiveSection] = useState<'guide' | 'faq' | 'api'>('guide')
  const [openSection, setOpenSection] = useState<string>('getting-started')

  const guideSections = [
    {
      id: 'getting-started',
      title: '🚀 快速开始',
      content: `
# 快速开始

欢迎使用 AI Dev Platform！本指南将帮助你快速上手。

## 前置要求

- Node.js 18+ 
- npm 或 yarn
- 现代浏览器

## 安装

\`\`\`bash
# 克隆项目
git clone https://github.com/example/ai-dev-platform

# 安装依赖
cd ai-dev-platform
npm install

# 启动开发服务器
npm run dev
\`\`\`

访问 http://localhost:3200 查看应用。

## 功能介绍

### 代码生成
输入自然语言描述，自动生成代码示例。

### Agent助手
专业的开发顾问，帮助你解决各种技术问题。

### 项目分享
发现、分享和探索优秀的开源项目。
      `
    },
    {
      id: 'agent',
      title: '🤖 使用Agent助手',
      content: `
# 使用Agent助手

Agent助手是一个智能的开发顾问，可以帮助你：

## 主要功能

### 代码编写
- 生成组件、函数、接口等代码
- 代码示例和最佳实践
- 多语言支持

### 代码调试
- 分析错误信息
- 提供解决方案
- 性能优化建议

### 架构设计
- 系统架构设计
- API接口设计
- 技术选型建议

### 学习辅导
- 概念解释
- 技术文档
- 学习路径

## 使用技巧

1. **明确问题**：清晰描述你的需求
2. **提供上下文**：提供相关的代码或错误信息
3. **追问细节**：根据回答继续提问
4. **实践应用**：将建议应用到实际项目中
      `
    },
    {
      id: 'projects',
      title: '📦 项目管理',
      content: `
# 项目管理

项目广场是发现和分享优秀项目的平台。

## 功能特性

### 发现项目
- 浏览热门项目
- 按标签筛选
- 搜索关键词

### 分享项目
- 上传你的项目
- 添加项目描述
- 设置标签

### 项目互动
- 点赞收藏
- Fork项目
- 参与讨论

## 最佳实践

1. **完整描述**：提供清晰的项目介绍
2. **使用标签**：添加相关标签便于发现
3. **保持更新**：及时更新项目代码
4. **积极互动**：回复问题和建议
      `
    }
  ]

  const faqItems = [
    {
      id: '1',
      question: '如何开始使用AI代码生成？',
      answer: '只需在首页的输入框中输入你想要的功能描述，例如"生成一个React按钮组件"，点击"生成代码"按钮即可获得代码示例。'
    },
    {
      id: '2',
      question: 'Agent助手支持哪些编程语言？',
      answer: 'Agent助手支持主流编程语言，包括JavaScript/TypeScript、Python、Java、Go、Rust等。你可以指定语言进行提问。'
    },
    {
      id: '3',
      question: '如何分享我的项目？',
      answer: '在项目广场页面点击"分享项目"按钮，填写项目名称、描述和标签，然后点击"分享"即可。分享后的项目会显示在项目列表中。'
    },
    {
      id: '4',
      question: '支持中英文切换吗？',
      answer: '是的！点击导航栏右上角的语言切换按钮（🌐），可以在中文和英文之间切换。语言设置会自动保存。'
    },
    {
      id: '5',
      question: '如何重置密码？',
      answer: '在登录页面点击"忘记密码"链接，输入你的邮箱地址，会收到密码重置邮件。按照邮件中的指引完成密码重置。'
    },
    {
      id: '6',
      question: '项目支持哪些许可证？',
      answer: '支持主流开源许可证，包括MIT、Apache 2.0、GPL v3等。你可以在创建项目时选择合适的许可证。'
    },
    {
      id: '7',
      question: '如何联系技术支持？',
      answer: '如果你遇到问题，可以通过以下方式联系我们：\n- GitHub Issues：提交问题报告\n- 邮件：support@example.com\n- 社区论坛：参与讨论'
    }
  ]

  const apiEndpoints = [
    {
      method: 'GET',
      path: '/api/v1/code/generate',
      description: '生成代码',
      params: {
        prompt: '代码生成描述',
        language: '编程语言（可选）',
        framework: '框架（可选）'
      }
    },
    {
      method: 'POST',
      path: '/api/v1/projects',
      description: '创建项目',
      params: {
        name: '项目名称',
        description: '项目描述',
        tags: '标签数组'
      }
    },
    {
      method: 'GET',
      path: '/api/v1/projects',
      description: '获取项目列表',
      params: {
        page: '页码',
        limit: '每页数量',
        search: '搜索关键词'
      }
    },
    {
      method: 'GET',
      path: '/api/v1/agent/chat',
      description: 'Agent对话',
      params: {
        message: '用户消息',
        session_id: '会话ID（可选）'
      }
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">📚 文档中心</h1>
          <p className="text-gray-600 mt-1">完整的使用指南和API文档</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧：导航 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4 sticky top-20">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveSection('guide')}
                  className={`w-full px-4 py-3 text-left rounded-lg transition-colors ${
                    activeSection === 'guide'
                      ? 'bg-purple-100 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  📖 使用指南
                </button>
                <button
                  onClick={() => setActiveSection('faq')}
                  className={`w-full px-4 py-3 text-left rounded-lg transition-colors ${
                    activeSection === 'faq'
                      ? 'bg-purple-100 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  ❓ 常见问题
                </button>
                <button
                  onClick={() => setActiveSection('api')}
                  className={`w-full px-4 py-3 text-left rounded-lg transition-colors ${
                    activeSection === 'api'
                      ? 'bg-purple-100 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  🔌 API文档
                </button>
              </nav>
            </div>
          </div>

          {/* 右侧：内容 */}
          <div className="lg:col-span-3">
            {activeSection === 'guide' && (
              <div className="space-y-4">
                {guideSections.map(section => (
                  <div
                    key={section.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenSection(openSection === section.id ? '' : section.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-800">{section.title}</span>
                      <span className="text-gray-500">
                        {openSection === section.id ? '▼' : '▶'}
                      </span>
                    </button>
                    {openSection === section.id && (
                      <div className="px-6 pb-6">
                        <div className="prose prose-gray max-w-none">
                          <div className="whitespace-pre-wrap">{section.content}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'faq' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">常见问题</h2>
                {faqItems.map(faq => (
                  <div
                    key={faq.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenSection(openSection === faq.id ? '' : faq.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-800">{faq.question}</span>
                      <span className="text-gray-500">
                        {openSection === faq.id ? '▼' : '▶'}
                      </span>
                    </button>
                    {openSection === faq.id && (
                      <div className="px-6 pb-6">
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'api' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">API文档</h2>
                <p className="text-gray-600 mb-6">AI Dev Platform 提供RESTful API，支持开发者集成到自己的应用中。</p>
                
                <div className="space-y-6">
                  {apiEndpoints.map((endpoint, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="px-4 py-3 bg-gray-50 flex items-center gap-4">
                        <span className={`px-3 py-1 rounded font-mono text-sm ${
                          endpoint.method === 'GET'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="font-mono text-gray-800">{endpoint.path}</code>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-gray-800 mb-2">{endpoint.description}</h4>
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">参数：</h5>
                          <div className="space-y-1">
                            {Object.entries(endpoint.params).map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <code className="text-purple-600">{key}</code>
                                <span className="text-gray-600 ml-2">- {value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">💡 使用提示</h4>
                  <p className="text-blue-700 text-sm">
                    所有API请求需要在Header中包含Authorization token：{`Authorization: Bearer <your_token>`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
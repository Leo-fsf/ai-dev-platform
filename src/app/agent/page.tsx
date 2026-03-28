'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { useLanguage } from '@/lib/i18n/context'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AgentPage() {
  const { t, language } = useLanguage()
  const { user, addConversation, setCurrentConversationId, setTheme, setLanguage: setLanguage } = useAppStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: t.assistantGreeting || '你好！我是AI助手，有什么可以帮你的吗？',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentConversationId, setCurrentConversationIdState] = useState<string | null>(null)

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

    try {
      // 调用API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...(messages.length > 0 ? messages.slice(-10) : []),
            userMessage
          ],
          conversationId: currentConversationId
        })
      })

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response || '抱歉，无法获取回复',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      setMessages(prev => [...prev.slice(-10)])

      // 设置当前对话ID
      if (data.conversationId) {
        setCurrentConversationIdState(data.conversationId)
        setCurrentConversationId(data.conversationId)
      }

    } catch (error) {
      console.error('发送消息失败:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '抱歉，消息发送失败，请稍后重试',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
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
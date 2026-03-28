'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/i18n/context'
import { useAppStore } from '@/lib/store'

export default function Page() {
  const [code, setCode] = useState('')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const { t } = useLanguage()
  const { user } = useAppStore()

  const handleGenerate = async () => {
    if (!input.trim()) {
      setCode('请输入代码生成描述')
      return
    }

    if (!user) {
      setCode('请先登录后使用代码生成功能')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: `请生成代码：${input}` }
          ]
        })
      })

      const data = await response.json()

      if (data.response) {
        setCode(data.response)
      } else {
        setCode('代码生成失败，请重试')
      }
    } catch (error) {
      console.error('代码生成错误:', error)
      setCode('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{t.homeTitle}</h1>
          <p className="text-gray-600 mt-2">{t.homeDescription}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.homeInputPlaceholder || '描述你想要生成的代码...'}
            className="w-full h-40 border rounded-lg p-3 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            disabled={loading}
          />

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '生成中...' : t.generateCode || '生成代码'}
            </button>
            {code && (
              <button
                onClick={handleCopy}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                复制
              </button>
            )}
          </div>

          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto max-h-96 mt-4">
            <code>{code || t.waiting || '等待生成...'}</code>
          </pre>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">💡 使用提示</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• 描述你想要的功能，例如："生成一个React按钮组件"</li>
            <li>• 可以指定语言和框架，例如："用Python写一个快速排序算法"</li>
            <li>• 代码生成需要配置OPENAI_API_KEY</li>
            <li>• 未配置API key时，系统会返回示例代码</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

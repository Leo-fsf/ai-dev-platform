'use client'

import { useState, useEffect } from 'react'
import { useToast } from './Toast'

interface SearchProps {
  isOpen: boolean
  onClose: () => void
}

export default function Search({ isOpen, onClose }: SearchProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const toast = useToast()

  const items = [
    { type: 'page', icon: '🏠', title: '首页', description: 'AI代码生成器', path: '/' },
    { type: 'page', icon: '🤖', title: 'Agent助手', description: '智能AI开发顾问', path: '/agent' },
    { type: 'page', icon: '📦', title: '项目广场', description: '发现和分享项目', path: '/projects' },
    { type: 'page', icon: '📚', title: '文档中心', description: '使用指南和API文档', path: '/docs' },
    { type: 'page', icon: '👤', title: '用户中心', description: '个人资料和设置', path: '/profile' },
    { type: 'action', icon: '🔄', title: '切换语言', description: '在中文和英文之间切换', action: 'language' },
    { type: 'action', icon: '🌙', title: '切换主题', description: '在浅色和暗黑模式之间切换', action: 'theme' },
  ]

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % filteredItems.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        handleSelect(filteredItems[selectedIndex])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredItems, selectedIndex])

  const handleSelect = (item: typeof items[0]) => {
    if (item.type === 'page') {
      window.location.href = item.path
    } else if (item.action === 'language') {
      toast.info('语言切换功能', '请点击右上角的语言按钮')
    } else if (item.action === 'theme') {
      toast.info('主题切换功能', '请点击导航栏的主题按钮')
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-32 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* 搜索框 */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索页面、功能..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
              autoFocus
            />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            使用 <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">↑</kbd>{' '}
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">↓</kbd>{' '}
            导航，<kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Enter</kbd>{' '}
            选择，<kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Esc</kbd>{' '}
            关闭
          </div>
        </div>

        {/* 搜索结果 */}
        <div className="max-h-96 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">🔍</div>
              <p>没有找到匹配的结果</p>
            </div>
          ) : (
            <div>
              {query === '' && (
                <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
                  快速导航
                </div>
              )}
              {filteredItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(item)}
                  className={`w-full px-4 py-3 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    index === selectedIndex ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-800 dark:text-gray-200">{item.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{item.description}</div>
                  </div>
                  {index === selectedIndex && (
                    <span className="text-purple-600">→</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'
import { useTheme } from '@/components/ThemeProvider'

export default function Navbar() {
  const { language, toggleLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            {t.appName}
          </Link>
          
          <div className="flex items-center gap-6">
            <Link
              href="/agent"
              className="text-gray-700 dark:text-gray-200 hover:text-purple-600 transition-colors font-medium hidden md:block"
            >
              🤖 {t.agent}
            </Link>
            <Link
              href="/projects"
              className="text-gray-700 dark:text-gray-200 hover:text-purple-600 transition-colors font-medium hidden md:block"
            >
              📦 {t.projects}
            </Link>
            <Link
              href="/docs"
              className="text-gray-700 dark:text-gray-200 hover:text-purple-600 transition-colors font-medium hidden md:block"
            >
              📚 {t.docs || '文档'}
            </Link>
            <Link
              href="/profile"
              className="text-gray-700 dark:text-gray-200 hover:text-purple-600 transition-colors font-medium hidden md:block"
            >
              👤 {t.profile || '我的'}
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium"
            >
              {t.login}
            </Link>
            
            {/* 暗黑模式切换 */}
            <button
              onClick={toggleTheme}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={theme === 'light' ? '切换到暗黑模式' : '切换到浅色模式'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            
            {/* 语言切换按钮 */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
              title={t.switchLanguage}
            >
              <span>🌐</span>
              <span className="hidden md:inline">{language === 'zh' ? t.chinese : t.english}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
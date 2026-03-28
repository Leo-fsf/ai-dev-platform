'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/context'
import { useTheme } from '@/components/ThemeProvider'
import { useAppStore } from '@/lib/store'

export default function Navbar() {
  const { language, toggleLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAppStore()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' })
      })
      
      if (response.ok) {
        logout()
        localStorage.removeItem('user')
        router.push('/')
      }
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            {t.appName}
          </Link>
          
          <div className="flex items-center gap-4">
            {/* 导航链接 */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/agent"
                className="text-gray-700 dark:text-gray-200 hover:text-purple-600 transition-colors font-medium"
              >
                🤖 {t.agent}
              </Link>
              <Link
                href="/projects"
                className="text-gray-700 dark:text-gray-200 hover:text-purple-600 transition-colors font-medium"
              >
                📦 {t.projects}
              </Link>
              <Link
                href="/docs"
                className="text-gray-700 dark:text-gray-200 hover:text-purple-600 transition-colors font-medium"
              >
                📚 {t.docs || '文档'}
              </Link>
              {user && (
                <Link
                  href="/profile"
                  className="text-gray-700 dark:text-gray-200 hover:text-purple-600 transition-colors font-medium"
                >
                  👤 {t.profile || '我的'}
                </Link>
              )}
            </div>

            {/* 分隔线 */}
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>

            {/* 用户信息或登录按钮 */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {t.logout || '退出'}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium text-sm"
              >
                {t.login}
              </Link>
            )}
            
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

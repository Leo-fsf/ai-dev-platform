'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/i18n/context'
import Link from 'next/link'

export default function ProfilePage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'settings'>('overview')
  
  const userStats = {
    projects: 12,
    likes: 156,
    forks: 43,
    followers: 89,
    following: 32
  }

  const myProjects = [
    {
      id: '1',
      name: 'React电商后台管理系统',
      description: '基于Next.js和TypeScript的现代化电商后台',
      tags: ['React', 'TypeScript', 'Next.js'],
      stars: 156,
      forks: 43,
      updatedAt: '2026-03-24'
    },
    {
      id: '2',
      name: 'Vue3移动端UI组件库',
      description: '轻量级Vue3移动端组件库',
      tags: ['Vue3', 'TypeScript'],
      stars: 89,
      forks: 23,
      updatedAt: '2026-03-22'
    },
    {
      id: '3',
      name: 'TypeScript工具函数库',
      description: '常用的JavaScript/TypeScript工具函数集合',
      tags: ['TypeScript', '工具库'],
      stars: 67,
      forks: 12,
      updatedAt: '2026-03-20'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">👤 用户中心</h1>
          <p className="text-gray-600 mt-1">管理你的个人资料和项目</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：个人信息卡片 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* 头像 */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center text-4xl text-white mb-4">
                  👤
                </div>
                <h2 className="text-2xl font-bold text-gray-800">开发者用户</h2>
                <p className="text-gray-600">@developer</p>
              </div>

              {/* 统计数据 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{userStats.projects}</div>
                  <div className="text-sm text-gray-600">项目</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{userStats.likes}</div>
                  <div className="text-sm text-gray-600">点赞</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{userStats.followers}</div>
                  <div className="text-sm text-gray-600">粉丝</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{userStats.following}</div>
                  <div className="text-sm text-gray-600">关注</div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all">
                  编辑资料
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  分享主页
                </button>
              </div>
            </div>
          </div>

          {/* 右侧：主要内容 */}
          <div className="lg:col-span-2">
            {/* 标签页 */}
            <div className="bg-white rounded-xl shadow-lg mb-6">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 px-6 py-4 font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  📊 概览
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`flex-1 px-6 py-4 font-medium transition-colors ${
                    activeTab === 'projects'
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  📦 我的项目
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex-1 px-6 py-4 font-medium transition-colors ${
                    activeTab === 'settings'
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  ⚙️ 设置
                </button>
              </div>

              {/* 标签页内容 */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* 个人信息 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">个人信息</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-gray-600">用户名</span>
                          <span className="font-medium">开发者用户</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-gray-600">邮箱</span>
                          <span className="font-medium">user@example.com</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-gray-600">加入时间</span>
                          <span className="font-medium">2026-03-01</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-600">个人简介</span>
                          <span className="font-medium text-sm">热爱技术，专注于全栈开发</span>
                        </div>
                      </div>
                    </div>

                    {/* 最近活动 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">最近活动</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <span className="text-2xl">📤</span>
                          <div>
                            <p className="font-medium">分享了新项目</p>
                            <p className="text-sm text-gray-600">React电商后台管理系统</p>
                            <p className="text-xs text-gray-500">2小时前</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <span className="text-2xl">⭐</span>
                          <div>
                            <p className="font-medium">点赞了项目</p>
                            <p className="text-sm text-gray-600">Vue3移动端UI组件库</p>
                            <p className="text-xs text-gray-500">5小时前</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <span className="text-2xl">🍴</span>
                          <div>
                            <p className="font-medium">Fork了项目</p>
                            <p className="text-sm text-gray-600">Node.js微服务架构示例</p>
                            <p className="text-xs text-gray-500">1天前</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'projects' && (
                  <div className="space-y-4">
                    {myProjects.map(project => (
                      <div
                        key={project.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                          <span className="text-xs text-gray-500">{project.updatedAt}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>⭐ {project.stars}</span>
                            <span>🍴 {project.forks}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Link
                      href="/projects"
                      className="block text-center py-3 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                    >
                      查看全部项目 →
                    </Link>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">账户设置</h3>
                      <div className="space-y-3">
                        <button className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-between">
                          <span>修改密码</span>
                          <span>→</span>
                        </button>
                        <button className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-between">
                          <span>邮箱设置</span>
                          <span>→</span>
                        </button>
                        <button className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-between">
                          <span>双因素认证</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">偏好设置</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-gray-600">语言</span>
                          <span className="font-medium">中文</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-gray-600">主题</span>
                          <span className="font-medium">浅色</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-600">通知</span>
                          <span className="font-medium">开启</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">危险操作</h3>
                      <button className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                        注销账户
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
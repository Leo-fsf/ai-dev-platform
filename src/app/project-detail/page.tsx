'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/i18n/context'
import Link from 'next/link'

export default function ProjectDetailPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'overview' | 'code' | 'discussion'>('overview')

  const project = {
    id: '1',
    name: 'React电商后台管理系统',
    description: '基于Next.js和TypeScript的现代化电商后台，包含商品管理、订单处理、数据分析等功能',
    author: '张三',
    authorId: '1',
    avatar: '👤',
    tags: ['React', 'TypeScript', 'Next.js', '电商'],
    stars: 156,
    forks: 43,
    watchers: 28,
    language: 'TypeScript',
    license: 'MIT',
    size: '2.4 MB',
    createdAt: '2026-03-20',
    updatedAt: '2026-03-24',
    isForked: false,
    isStarred: true
  }

  const files = [
    { name: 'src/', type: 'folder', items: 8 },
    { name: 'public/', type: 'folder', items: 3 },
    { name: 'package.json', type: 'file', size: '1.2 KB' },
    { name: 'README.md', type: 'file', size: '4.5 KB' },
    { name: 'tsconfig.json', type: 'file', size: '0.8 KB' },
    { name: 'next.config.js', type: 'file', size: '0.5 KB' }
  ]

  const discussions = [
    {
      id: '1',
      title: '如何添加新的商品分类？',
      author: '李四',
      replies: 5,
      createdAt: '2天前'
    },
    {
      id: '2',
      title: '订单导出功能有问题',
      author: '王五',
      replies: 3,
      createdAt: '5天前'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/projects" className="text-purple-600 hover:text-purple-700 mb-2 inline-block">
            ← 返回项目列表
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
          <p className="text-gray-600 mt-2">{project.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">作者</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-xl text-white">
                    {project.avatar}
                  </div>
                  <div>
                    <div className="font-medium">{project.author}</div>
                    <div className="text-sm text-gray-600">@author1</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">统计</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">⭐ Stars</span>
                    <span className="font-medium">{project.stars}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">🍴 Forks</span>
                    <span className="font-medium">{project.forks}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">👀 Watchers</span>
                    <span className="font-medium">{project.watchers}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all">
                  🍴 Fork 项目
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  📢 分享
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 px-6 py-4 font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  📄 概览
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex-1 px-6 py-4 font-medium transition-colors ${
                    activeTab === 'code'
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  💻 代码
                </button>
                <button
                  onClick={() => setActiveTab('discussion')}
                  className={`flex-1 px-6 py-4 font-medium transition-colors ${
                    activeTab === 'discussion'
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  💬 讨论
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="prose prose-gray max-w-none">
                    <h2>React电商后台管理系统</h2>
                    <p>一个功能完整的电商后台管理系统，使用Next.js 14、TypeScript和TailwindCSS构建。</p>
                    <h3>功能特性</h3>
                    <ul>
                      <li>✅ 商品管理</li>
                      <li>✅ 订单处理</li>
                      <li>✅ 数据分析</li>
                      <li>✅ 用户管理</li>
                    </ul>
                  </div>
                )}

                {activeTab === 'code' && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">文件结构</h3>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-xl">{file.type === 'folder' ? '📁' : '📄'}</span>
                          <span className="flex-1 font-medium">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'discussion' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">讨论区</h3>
                    </div>
                    {discussions.map(discussion => (
                      <div
                        key={discussion.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 mb-1">{discussion.title}</h4>
                            <div className="text-sm text-gray-600">
                              <span>by {discussion.author}</span>
                              <span className="mx-2">•</span>
                              <span>{discussion.createdAt}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Project {
  id: string
  name: string
  description: string
  author: string
  tags: string[]
  likes: number
  forks: number
  createdAt: Date
  isPublic: boolean
}

const SAMPLE_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'React电商后台管理系统',
    description: '基于Next.js和TypeScript的现代化电商后台，包含商品管理、订单处理、数据分析等功能',
    author: '张三',
    tags: ['React', 'TypeScript', 'Next.js', '电商'],
    likes: 156,
    forks: 43,
    createdAt: new Date('2026-03-20'),
    isPublic: true
  },
  {
    id: '2',
    name: 'Vue3移动端UI组件库',
    description: '轻量级Vue3移动端组件库，包含40+常用组件，支持主题定制',
    author: '李四',
    tags: ['Vue3', 'TypeScript', 'UI组件', '移动端'],
    likes: 234,
    forks: 78,
    createdAt: new Date('2026-03-18'),
    isPublic: true
  },
  {
    id: '3',
    name: 'Node.js微服务架构示例',
    description: '完整的微服务架构示例，包含服务发现、API网关、消息队列等核心组件',
    author: '王五',
    tags: ['Node.js', '微服务', 'Docker', '架构'],
    likes: 189,
    forks: 56,
    createdAt: new Date('2026-03-15'),
    isPublic: true
  },
  {
    id: '4',
    name: 'Python数据可视化平台',
    description: '基于Flask和D3.js的数据可视化平台，支持多种图表类型和实时数据更新',
    author: '赵六',
    tags: ['Python', 'Flask', 'D3.js', '数据可视化'],
    likes: 312,
    forks: 92,
    createdAt: new Date('2026-03-12'),
    isPublic: true
  },
  {
    id: '5',
    name: 'TypeScript工具函数库',
    description: '常用的JavaScript/TypeScript工具函数集合，包含字符串、数组、对象等操作方法',
    author: '孙七',
    tags: ['TypeScript', '工具库', '函数式编程'],
    likes: 98,
    forks: 34,
    createdAt: new Date('2026-03-10'),
    isPublic: true
  },
  {
    id: '6',
    name: 'Flutter跨平台应用模板',
    description: 'Flutter跨平台应用开发模板，包含登录、首页、个人中心等常用页面',
    author: '周八',
    tags: ['Flutter', 'Dart', '跨平台', '移动应用'],
    likes: 145,
    forks: 47,
    createdAt: new Date('2026-03-08'),
    isPublic: true
  }
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'likes' | 'forks' | 'date'>('likes')
  const [showShareModal, setShowShareModal] = useState(false)
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    tags: '',
    isPublic: true
  })

  const allTags = Array.from(
    new Set(projects.flatMap(p => p.tags))
  ).slice(0, 10)

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = !selectedTag || project.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'likes':
        return b.likes - a.likes
      case 'forks':
        return b.forks - a.forks
      case 'date':
        return b.createdAt.getTime() - a.createdAt.getTime()
      default:
        return 0
    }
  })

  const handleShareProject = () => {
    if (!newProject.name || !newProject.description) {
      alert('请填写项目名称和描述')
      return
    }

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      author: '你',
      tags: newProject.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      likes: 0,
      forks: 0,
      createdAt: new Date(),
      isPublic: newProject.isPublic
    }

    setProjects([project, ...projects])
    setShowShareModal(false)
    setNewProject({ name: '', description: '', tags: '', isPublic: true })
    alert('项目分享成功！')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">📦 项目广场</h1>
              <p className="text-gray-600 mt-1">发现、分享和探索优秀的项目</p>
            </div>
            <button
              onClick={() => setShowShareModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              🚀 分享项目
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 搜索项目名称或描述..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-full text-sm ${
                !selectedTag
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              全部
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">排序方式：</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="likes">👍 按点赞数</option>
              <option value="forks">🍴 按Fork数</option>
              <option value="date">📅 按创建时间</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map(project => (
            <Link
              key={project.id}
              href="/project-detail"
              className="block"
            >
              <div
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6 h-full"
              >
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{project.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">{project.description}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    👤 {project.author}
                  </span>
                  <span className="flex items-center gap-1">
                    👍 {project.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    🍴 {project.forks}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs hover:bg-gray-200">
                    查看
                  </button>
                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs hover:bg-blue-200">
                    Fork
                  </button>
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {sortedProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600">没有找到匹配的项目</p>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">📤 分享项目</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  项目名称 *
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入项目名称"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  项目描述 *
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                  placeholder="描述你的项目..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标签（用逗号分隔）
                </label>
                <input
                  type="text"
                  value={newProject.tags}
                  onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例如: React, TypeScript, Next.js"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newProject.isPublic}
                  onChange={(e) => setNewProject({ ...newProject, isPublic: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700">
                  公开项目
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleShareProject}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                分享
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
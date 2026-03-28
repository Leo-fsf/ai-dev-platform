'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import Link from 'next/link'

function ProjectDetailContent() {
  const { user } = useAppStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('id')

  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'code' | 'discussion'>('overview')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    tags: ''
  })

  useEffect(() => {
    if (projectId) {
      loadProject()
    }
  }, [projectId])

  const loadProject = async () => {
    if (!projectId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.project) {
          setProject(data.project)
          setEditForm({
            name: data.project.name,
            description: data.project.description,
            tags: Array.isArray(data.project.tags) ? data.project.tags.join(', ') : ''
          })
        }
      }
    } catch (error) {
      console.error('加载项目详情失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!projectId) return

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          description: editForm.description,
          tags: editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          alert('项目已更新')
          setShowEditModal(false)
          loadProject()
        }
      } else {
        const data = await response.json()
        alert(data.error || '更新失败')
      }
    } catch (error) {
      console.error('更新项目失败:', error)
      alert('更新项目失败')
    }
  }

  const handleDelete = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!confirm('确定要删除这个项目吗？此操作不可恢复！')) {
      return
    }

    if (!projectId) return

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          alert('项目已删除')
          router.push('/projects')
        }
      } else {
        const data = await response.json()
        alert(data.error || '删除失败')
      }
    } catch (error) {
      console.error('删除项目失败:', error)
      alert('删除项目失败')
    }
  }

  const handleLike = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!projectId) return

    try {
      const response = await fetch(`/api/projects/${projectId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like' })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          loadProject()
        }
      }
    } catch (error) {
      console.error('点赞失败:', error)
    }
  }

  const handleFork = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!projectId) return

    try {
      const response = await fetch(`/api/projects/${projectId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fork' })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          alert('已Fork该项目！')
          loadProject()
        }
      }
    } catch (error) {
      console.error('Fork失败:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">项目不存在</p>
          <Link href="/projects" className="text-purple-600 hover:text-purple-700">
            返回项目列表
          </Link>
        </div>
      </div>
    )
  }

  const isOwner = user && project.userId === user.id

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
          <div className="lg:col-span-2">
            {/* 标签页 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-4 text-center font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  概览
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex-1 py-4 text-center font-medium transition-colors ${
                    activeTab === 'code'
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  代码
                </button>
                <button
                  onClick={() => setActiveTab('discussion')}
                  className={`flex-1 py-4 text-center font-medium transition-colors ${
                    activeTab === 'discussion'
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  讨论
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">README</h3>
                      <p className="text-gray-600 whitespace-pre-wrap">
# {project.name}

{project.description}

## 安装

\`\`\`bash
npm install
\`\`\`

## 使用

\`\`\`bash
npm start
\`\`\`
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">标签</h3>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(project.tags) && project.tags.map((tag: string) => (
                          <span key={tag} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'code' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">项目文件</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <span>📁</span>
                        <span>src/</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <span>📁</span>
                        <span>public/</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <span>📄</span>
                        <span>package.json</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <span>📄</span>
                        <span>README.md</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'discussion' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">讨论区</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-center">暂无讨论</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              {/* 操作按钮 */}
              <div className="space-y-3">
                <button
                  onClick={handleLike}
                  className="w-full py-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors flex items-center justify-center gap-2"
                >
                  ❤️ 点赞 ({project.likes})
                </button>
                <button
                  onClick={handleFork}
                  className="w-full py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                >
                  🍴 Fork ({project.forks})
                </button>
                <button className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  📤 分享
                </button>
              </div>

              {/* 项目信息 */}
              <div>
                <h3 className="text-lg font-semibold mb-3">项目信息</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">创建时间</span>
                    <span className="text-gray-900">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">更新时间</span>
                    <span className="text-gray-900">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 作者信息 - 使用真实数据 */}
              {project.user && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">作者</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-xl text-white">
                      {project.user.avatar ? (
                        <img src={project.user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        (project.user.name || 'U').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{project.user.name || '未命名'}</div>
                      <div className="text-sm text-gray-600">@{project.user.email.split('@')[0]}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 所有者操作 */}
              {isOwner && (
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-3">项目设置</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      ✏️ 编辑项目
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      🗑️ 删除项目
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 编辑项目弹窗 */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">编辑项目</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  项目名称
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  项目描述
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标签（用逗号分隔）
                </label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProjectDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    }>
      <ProjectDetailContent />
    </Suspense>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/i18n/context'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'

interface User {
  id: string
  name: string | null
  email: string
  avatar: string | null
  bio: string | null
  createdAt: string
}

interface Project {
  id: string
  name: string
  description: string
  tags: string[]
  stars: number
  forks: number
  updatedAt: string
}

export default function ProfilePage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { user, setUser } = useAppStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'settings'>('overview')
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<User | null>(null)
  const [userStats, setUserStats] = useState({ projectCount: 0, totalLikes: 0, totalForks: 0 })
  const [myProjects, setMyProjects] = useState<Project[]>([])
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', bio: '' })
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    password: ''
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user')
      if (response.ok) {
        const data = await response.json()
        setUserData(data.user)
        setUserStats(data.stats)
        setEditForm({ name: data.user.name || '', bio: data.user.bio || '' })
        setUser(data.user)
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMyProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setMyProjects(data.projects.filter((p: Project) => p.id))
      }
    } catch (error) {
      console.error('获取项目列表失败:', error)
    }
  }

  useEffect(() => {
    if (activeTab === 'projects') {
      fetchMyProjects()
    }
  }, [activeTab])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    // 验证文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB')
      return
    }

    setUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!uploadResponse.ok) {
        throw new Error('上传失败')
      }

      const uploadData = await uploadResponse.json()
      const avatarUrl = uploadData.file.url

      // 更新用户头像
      const updateResponse = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: avatarUrl })
      })

      if (updateResponse.ok) {
        const updateData = await updateResponse.json()
        setUserData(updateData.user)
        setUser(updateData.user)
        alert('头像更新成功')
      }
    } catch (error) {
      console.error('上传头像失败:', error)
      alert('上传失败，请重试')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editForm.name, bio: editForm.bio })
      })

      if (response.ok) {
        const data = await response.json()
        setUserData(data.user)
        setUser(data.user)
        setEditing(false)
        alert('保存成功')
      }
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败，请重试')
    }
  }

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert('请填写所有字段')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('两次输入的新密码不一致')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      alert('新密码长度不能少于6位')
      return
    }

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert('密码修改成功！')
        setShowPasswordModal(false)
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        alert(data.error || '密码修改失败')
      }
    } catch (error) {
      console.error('修改密码失败:', error)
      alert('修改密码失败，请重试')
    }
  }

  const handleChangeEmail = async () => {
    if (!emailForm.newEmail || !emailForm.password) {
      alert('请填写所有字段')
      return
    }

    if (!emailForm.newEmail.includes('@')) {
      alert('请输入有效的邮箱地址')
      return
    }

    try {
      const response = await fetch('/api/user/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newEmail: emailForm.newEmail,
          password: emailForm.password
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert('邮箱修改成功！')
        setShowEmailModal(false)
        setEmailForm({ newEmail: '', password: '' })
        fetchUserData()
      } else {
        alert(data.error || '邮箱修改失败')
      }
    } catch (error) {
      console.error('修改邮箱失败:', error)
      alert('修改邮箱失败，请重试')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">加载中...</div>
      </div>
    )
  }

  if (!userData) {
    router.push('/login')
    return null
  }

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
              {/* 头像上传 */}
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center text-4xl text-white mb-4 overflow-hidden">
                  {userData.avatar ? (
                    <img src={userData.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    (userData.name || 'U').charAt(0).toUpperCase()
                  )}
                  <label className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploadingAvatar}
                      className="hidden"
                    />
                    <span className="text-white text-xs opacity-0 hover:opacity-100">
                      {uploadingAvatar ? '上传中...' : '更换'}
                    </span>
                  </label>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{userData.name || '未命名'}</h2>
                <p className="text-gray-600">@{userData.email.split('@')[0]}</p>
              </div>

              {/* 统计数据 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{userStats.projectCount}</div>
                  <div className="text-sm text-gray-600">项目</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{userStats.totalLikes}</div>
                  <div className="text-sm text-gray-600">获赞</div>
                </div>
              </div>

              {/* 编辑按钮 */}
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
                >
                  编辑资料
                </button>
              )}
            </div>
          </div>

          {/* 右侧：主要内容 */}
          <div className="lg:col-span-2">
            {/* 编辑模式 */}
            {editing && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">编辑资料</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">个人简介</label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 标签页 */}
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
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">个人信息</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-gray-600">用户名</span>
                          <span className="font-medium">{userData.name || '未设置'}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-gray-600">邮箱</span>
                          <span className="font-medium">{userData.email}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-gray-600">加入时间</span>
                          <span className="font-medium">{new Date(userData.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-600">个人简介</span>
                          <span className="font-medium text-sm">{userData.bio || '未设置'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'projects' && (
                  <div className="space-y-4">
                    {myProjects.length > 0 ? (
                      myProjects.map(project => (
                        <div
                          key={project.id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                            <span className="text-xs text-gray-500">
                              {new Date(project.updatedAt).toLocaleDateString()}
                            </span>
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
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>还没有项目</p>
                        <Link href="/projects" className="text-purple-600 hover:underline">
                          创建你的第一个项目 →
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">账户设置</h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => setShowPasswordModal(true)}
                          className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span>修改密码</span>
                          <span>→</span>
                        </button>
                        <button
                          onClick={() => setShowEmailModal(true)}
                          className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span>邮箱设置</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 修改密码弹窗 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">修改密码</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">新密码</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowPasswordModal(false)
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleChangePassword}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  确认修改
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 修改邮箱弹窗 */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">修改邮箱</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">新邮箱</label>
                <input
                  type="email"
                  value={emailForm.newEmail}
                  onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
                <input
                  type="password"
                  value={emailForm.password}
                  onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="验证你的身份"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowEmailModal(false)
                    setEmailForm({ newEmail: '', password: '' })
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleChangeEmail}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  确认修改
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
